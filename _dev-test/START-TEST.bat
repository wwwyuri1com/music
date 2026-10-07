@echo off
setlocal
cd /d "%~dp0"

echo.
echo ================================
echo   YURI1 Music Local Test Server
echo ================================
echo.

where php >nul 2>nul
if errorlevel 1 (
    echo [ERROR] 找不到 PHP。
    echo.
    echo 這個測試啟動器需要 Windows 可以直接執行 php 指令。
    echo 如果之後已安裝 PHP，請重新雙擊這個檔案。
    echo.
    pause
    exit /b 1
)

echo 啟動測試站：
echo http://127.0.0.1:8000/
echo.

start "YURI1 Music PHP Server" cmd /k php -S 127.0.0.1:8000 -t "%~dp0"

timeout /t 1 /nobreak >nul
start "" "http://127.0.0.1:8000/"

exit /b 0
