# GitHub Setup Instructions

## Что было сделано
1. Обновлен `.gitignore` - исключены временные файлы
2. Добавлена конфигурация PM2 (ecosystem.config.js)
3. Добавлен скрипт запуска (server-start.sh)
4. Исправлена ошибка API route (dynamic = 'force-dynamic')

## Для пуша на GitHub
```
bash
git push
```

## Клонирование и запуск на сервере

### Первый запуск:
```
bash
git clone https://github.com/supertrue-hub1/NewPay.git
cd NewPay
bash server-start.sh
```

### Обновление и перезапуск:
```
bash
git pull
npm run build
pm2 restart all
```

### Команды PM2:
```bash
pm2 start ecosystem.config.js  # Запуск
pm2 stop all                  # Остановка
pm2 restart all               # Перезапуск
pm2 logs                      # Логи
pm2 list                      # Список процессов
```

## Важно
- Node.js >= 24.0.0
- Сайт работает на порту 3000
