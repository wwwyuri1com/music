@echo off
cd /d "%~dp0"
where py >nul 2>nul
if %ERRORLEVEL%==0 (
    py -3 tools\build_music_pages.py
) else (
    python tools\build_music_pages.py
)
if errorlevel 1 (
    echo.
    echo Music URL build failed. Check messages above.
    pause
    exit /b 1
)
echo.
echo Music pages and sitemap updated.
pause
