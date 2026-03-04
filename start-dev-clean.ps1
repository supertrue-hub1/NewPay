# Скрипт для запуска Next.js проекта
# Запустите этот файл вручную через PowerShell

$ErrorActionPreference = "Stop"

# Очищаем PATH и устанавливаем правильный путь к Node.js
$cleanPath = "C:\Users\neutr\AppData\Local\nvm\v24.14.0;C:\Windows;C:\Windows\System32"
$env:PATH = $cleanPath

# Переходим в папку проекта
Set-Location "D:\NewProject\next-mfo"

# Запускаем dev сервер
Write-Host "Запуск Next.js development server..."
& "C:\Users\neutr\AppData\Local\nvm\v24.14.0\node.exe" "D:\NewProject\next-mfo\node_modules\next\dist\bin\next" dev
