#!/bin/bash

# Скрипт деплоя на хостинг через git clone

# 1. Перейдите в директорию вашего сайта на хостинге
# cd /var/www/ваш-сайт.ru

# 2. Клонируйте репозиторий (или обновите, если уже есть)
git clone https://github.com/supertrue-hub1/Sravnipay.git temp_deploy

# 3. Если папка сайта уже существует, сделайте:
# cd /var/www/ваш-сайт.ru
# git pull origin main

# 4. Установите зависимости
# npm install

# 5. Соберите проект
# npm run build

# 6. Если нужно запустить в режиме разработки:
# npm run dev
