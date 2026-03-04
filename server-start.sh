#!/bin/bash

# Установка зависимостей
npm install

# Сборка проекта
npm run build

# Запуск с PM2
pm2 start ecosystem.config.js
