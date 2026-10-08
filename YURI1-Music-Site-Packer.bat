@echo off
setlocal EnableExtensions DisableDelayedExpansion
set "MUSIC_PACKER_SELF=%~f0"
set "MUSIC_PACKER_DIR=%~dp0"
set "MUSIC_PACKER_TARGET=%~1"
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -Command "$ErrorActionPreference='Stop'; $t=[System.IO.File]::ReadAllText($env:MUSIC_PACKER_SELF); $m='REM ## YURI1_POWERSHELL_START ##'; $i=$t.LastIndexOf($m,[System.StringComparison]::Ordinal); if($i -lt 0){throw 'Missing internal script'}; & ([scriptblock]::Create($t.Substring($i+$m.Length)))"
set "PACKER_EXIT=%ERRORLEVEL%"
if not "%PACKER_EXIT%"=="0" echo [ERROR] Packing failed. No existing ZIP was overwritten.
echo.
pause
exit /b %PACKER_EXIT%
REM ## YURI1_POWERSHELL_START ##
# YURI1 Music Site Packer - single-file BAT + embedded Windows PowerShell.
# Does not modify the selected website. Run this BAT from the music website root
# or drag the music directory onto the BAT to select a different directory.
$ErrorActionPreference = 'Stop'

function Write-Heading([string]$s) {
    Write-Host ''
    Write-Host $s -ForegroundColor Magenta
}
function Is-BlockedDirectory([string]$name) {
    $name = $name.ToLowerInvariant()
    return @('.git', '.github', 'git backup', 'git-backup', 'git_backup', '.git-backup', '.git_backup') -contains $name
}
function Is-ValidRoot([string]$p) {
    if (-not [System.IO.Directory]::Exists($p)) { return $false }
    return ([System.IO.File]::Exists((Join-Path $p 'index.html')) -and
            [System.IO.Directory]::Exists((Join-Path $p 'config')) -and
            [System.IO.Directory]::Exists((Join-Path $p 'music-core')) -and
            [System.IO.Directory]::Exists((Join-Path $p 'music-track')))
}

try {
    Write-Heading 'YURI1 MUSIC SITE PACKER'
    Write-Host 'Windows PowerShell / 本機離線打包 / 不修改原始網站'
    Write-Host ''
    Write-Host '排除：.git/、.github/、Git 備份目錄、.gitattributes、music-core/ 下所有 MP3'
    Write-Host '保留：music-player/ 下的 MP3，以及其餘網站檔案'

    $rootCandidate = $env:MUSIC_PACKER_TARGET
    if ([string]::IsNullOrWhiteSpace($rootCandidate)) { $rootCandidate = $env:MUSIC_PACKER_DIR }
    $rootCandidate = $rootCandidate.Trim().Trim('"')
    if (-not (Is-ValidRoot $rootCandidate)) {
        Write-Host ''
        Write-Host '未在 BAT 所在位置找到完整網站，請輸入 music 網站根目錄：' -ForegroundColor Yellow
        $rootCandidate = (Read-Host 'Music root path').Trim().Trim('"')
    }
    if (-not (Is-ValidRoot $rootCandidate)) {
        throw '選擇的位置不是 Music 網站根目錄（需要 index.html、config/、music-core/、music-track/）。'
    }
    $root = [System.IO.Path]::GetFullPath($rootCandidate).TrimEnd([char]'\', [char]'/')
    $rootItem = Get-Item -LiteralPath $root -Force
    if (($rootItem.Attributes -band [System.IO.FileAttributes]::ReparsePoint) -ne 0) {
        throw '網站根目錄不可使用捷徑或重新解析連結。'
    }
    Write-Host ('Website: ' + $root) -ForegroundColor Cyan

    $script:includeFiles = New-Object 'System.Collections.Generic.List[object]'
    $script:skippedDirectories = New-Object 'System.Collections.Generic.List[string]'
    $script:skippedFiles = New-Object 'System.Collections.Generic.List[string]'
    $script:includeBytes = [long]0
    $script:packerSelf = [System.IO.Path]::GetFullPath($env:MUSIC_PACKER_SELF)

    function Walk-MusicDirectory([string]$current, [string]$relative) {
        foreach ($entry in (Get-ChildItem -LiteralPath $current -Force -ErrorAction Stop)) {
            $rel = if ([string]::IsNullOrEmpty($relative)) { $entry.Name } else { $relative + '/' + $entry.Name }
            $rel = $rel.Replace('\', '/')

            if (($entry.Attributes -band [System.IO.FileAttributes]::ReparsePoint) -ne 0) {
                $script:skippedDirectories.Add($rel + ' [link/reparse]')
                continue
            }
            if ($entry.PSIsContainer) {
                if (Is-BlockedDirectory $entry.Name) {
                    $script:skippedDirectories.Add($rel)
                    continue
                }
                Walk-MusicDirectory $entry.FullName $rel
                continue
            }
            if ($entry.Name -ieq '.gitattributes' -or $entry.Name -ieq '.git') {
                $script:skippedFiles.Add($rel)
                continue
            }
            if ($rel.StartsWith('music-core/', [System.StringComparison]::OrdinalIgnoreCase) -and
                $entry.Extension -ieq '.mp3') {
                $script:skippedFiles.Add($rel)
                continue
            }
            if ([string]::Equals($entry.FullName, $script:packerSelf, [System.StringComparison]::OrdinalIgnoreCase)) {
                $script:skippedFiles.Add($rel + ' [packer]')
                continue
            }
            $script:includeFiles.Add([pscustomobject]@{Source=$entry.FullName; ZipPath=$rel; Size=[long]$entry.Length})
            $script:includeBytes += [long]$entry.Length
        }
    }
    Walk-MusicDirectory $root ''
    if ($includeFiles.Count -eq 0) { throw '沒有可打包的檔案，已取消。' }

    Write-Heading '打包預覽'
    Write-Host ('保留檔案：' + $includeFiles.Count)
    Write-Host ('排除檔案：' + $skippedFiles.Count)
    Write-Host ('排除資料夾：' + $skippedDirectories.Count + '（不掃描其內部，因此不列入排除檔案數）')
    Write-Host ('保留檔案大小（壓縮前）：{0:N1} MB' -f ($includeBytes / 1MB))
    if ($skippedDirectories.Count -gt 0) {
        Write-Host '整個排除的資料夾：' -ForegroundColor Yellow
        foreach ($d in $skippedDirectories) { Write-Host ('  - ' + $d) }
    }

    $parent = [System.IO.Directory]::GetParent($root).FullName
    $timestamp = Get-Date -Format 'yyyy-MM-dd-HHmmss'
    $basename = 'music-site-dev-' + $timestamp
    $destination = Join-Path $parent ($basename + '.zip')
    $suffix = 2
    while ([System.IO.File]::Exists($destination)) {
        $destination = Join-Path $parent ($basename + '-' + $suffix + '.zip')
        $suffix++
    }
    Write-Host ('輸出：' + $destination) -ForegroundColor Cyan
    Write-Host 'ZIP 裡不會多包一層 music/；不會包含 Git 歷史。'
    $response = (Read-Host '開始打包？[Y/n]').Trim()
    if ($response -match '^(n|no|0)$') {
        Write-Host '已取消，不會產生 ZIP。'
        exit 0
    }

    Add-Type -AssemblyName System.IO.Compression
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    $tempPath = $destination + '.' + $PID + '.partial'
    $zipStream = $null
    $zipArchive = $null
    try {
        $zipStream = [System.IO.File]::Open($tempPath, [System.IO.FileMode]::CreateNew)
        $zipArchive = [System.IO.Compression.ZipArchive]::new(
            $zipStream, [System.IO.Compression.ZipArchiveMode]::Create, $false)
        $total = $includeFiles.Count
        $done = 0
        foreach ($f in $includeFiles) {
            [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile(
                $zipArchive, $f.Source, $f.ZipPath,
                [System.IO.Compression.CompressionLevel]::Optimal) | Out-Null
            $done++
            if (($done % 10 -eq 0) -or ($done -eq $total)) {
                Write-Progress -Activity '打包 Music 網站' -Status ("$done / $total") -PercentComplete ([int](100 * $done / $total))
            }
        }
        Write-Progress -Activity '打包 Music 網站' -Completed
        $zipArchive.Dispose(); $zipArchive = $null
        $zipStream = $null

        # Validate entry paths BEFORE moving the new ZIP into place.
        $check = [System.IO.Compression.ZipFile]::OpenRead($tempPath)
        try {
            if ($check.Entries.Count -ne $includeFiles.Count) {
                throw 'ZIP 檔案數與預期不符。'
            }
            foreach ($ze in $check.Entries) {
                $parts = $ze.FullName.Replace('\', '/').Split('/')
                foreach ($part in $parts) {
                    if (Is-BlockedDirectory $part) { throw ('ZIP 中出現 Git 排除目錄：' + $ze.FullName) }
                    if ($part -ieq '.gitattributes' -or $part -ieq '.git') {
                        throw ('ZIP 中出現 Git 排除檔案：' + $ze.FullName)
                    }
                }
                if ($ze.FullName.StartsWith('music-core/', [System.StringComparison]::OrdinalIgnoreCase) -and
                    $ze.FullName.EndsWith('.mp3', [System.StringComparison]::OrdinalIgnoreCase)) {
                    throw ('ZIP 中出現 music-core MP3：' + $ze.FullName)
                }
            }
        } finally { $check.Dispose() }
        [System.IO.File]::Move($tempPath, $destination)
    } finally {
        if ($null -ne $zipArchive) { $zipArchive.Dispose() }
        if ($null -ne $zipStream) { $zipStream.Dispose() }
        if ([System.IO.File]::Exists($tempPath)) { [System.IO.File]::Delete($tempPath) }
    }

    Write-Heading '完成！'
    Write-Host ('ZIP: ' + $destination) -ForegroundColor Green
    Write-Host ('檔案數：' + $includeFiles.Count + '；ZIP 大小：{0:N1} MB' -f ((Get-Item -LiteralPath $destination).Length / 1MB))
    Write-Host '原始 Music 網站未修改。'
    exit 0
} catch {
    Write-Host ''
    Write-Host ('打包失敗：' + $_.Exception.Message) -ForegroundColor Red
    exit 1
}
