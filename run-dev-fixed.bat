@echo off
call nvm use 25.7.0
set "PATH=C:\Users\neutr\AppData\Local\nvm\v25.7.0;%PATH%"
cd /d D:\NewProject\next-mfo
node --version
npm run dev
