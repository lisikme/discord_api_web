Discord Bot API - Инструкция по установке и использованию

1. УСТАНОВКА ЗАВИСИМОСТЕЙ:
   pip install requests flask flask-cors

2. ПОЛУЧЕНИЕ DISCORD BOT TOKEN:
   - Перейдите на https://discord.com/developers/applications
   - Создайте новое приложение
   - Перейдите в раздел "Bot"
   - Скопируйте токен бота
   - Замените "YOUR_DISCORD_BOT_TOKEN_HERE" в коде на ваш токен

3. ЗАПУСК API СЕРВЕРА:
   python discord_bot_api.py

4. ИСПОЛЬЗОВАНИЕ:
   - GET запрос: http://localhost:5000/?userid=USER_ID
   - Пример: http://localhost:5000/?userid=470573716711931905

5. ТЕСТИРОВАНИЕ:
   - Откройте test.html в браузере
   - Введите Discord User ID
   - Нажмите "Получить информацию"

6. ФОРМАТ ОТВЕТА:
   {
     "name": "username",
     "displayname": "Display Name",
     "avatar": "https://cdn.discordapp.com/avatars/ID/hash.png?size=1024",
     "discriminator": "0000",
     "id": "470573716711931905",
     "success": true
   }

7. ПРАВА БОТА:
   Боту не нужны специальные права для получения публичной информации о пользователях.

8. ОГРАНИЧЕНИЯ:
   - Discord API имеет лимиты запросов
   - Бот может получить только публичную информацию
   - Для получения информации о пользователях на сервере нужны дополнительные права
