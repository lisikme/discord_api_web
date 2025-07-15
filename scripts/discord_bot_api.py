import requests
import json
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Разрешаем CORS для работы с браузером

# Замените на ваш Discord Bot Token
DISCORD_BOT_TOKEN = "YOUR_DISCORD_BOT_TOKEN_HERE"

def get_discord_user_info(user_id):
    """
    Получает информацию о пользователе Discord по ID
    """
    headers = {
        'Authorization': f'Bot {DISCORD_BOT_TOKEN}',
        'Content-Type': 'application/json'
    }
    
    try:
        # Получаем информацию о пользователе
        response = requests.get(
            f'https://discord.com/api/v10/users/{user_id}',
            headers=headers
        )
        
        if response.status_code == 200:
            user_data = response.json()
            
            # Формируем URL аватарки
            avatar_url = ""
            if user_data.get('avatar'):
                avatar_url = f"https://cdn.discordapp.com/avatars/{user_id}/{user_data['avatar']}.png?size=1024"
            else:
                # Дефолтная аватарка если у пользователя нет своей
                discriminator = int(user_data.get('discriminator', '0'))
                default_avatar_id = discriminator % 5
                avatar_url = f"https://cdn.discordapp.com/embed/avatars/{default_avatar_id}.png"
            
            # Формируем ответ в нужном формате
            result = {
                "name": user_data.get('username', ''),
                "displayname": user_data.get('global_name', user_data.get('username', '')),
                "avatar": avatar_url,
                "discriminator": user_data.get('discriminator', ''),
                "id": user_data.get('id', ''),
                "success": True
            }
            
            return result
            
        else:
            return {
                "error": f"Discord API error: {response.status_code}",
                "success": False
            }
            
    except Exception as e:
        return {
            "error": f"Request failed: {str(e)}",
            "success": False
        }

@app.route('/', methods=['GET'])
def get_user_info():
    """
    Основной endpoint для получения информации о пользователе
    Пример: http://localhost:5000/?userid=470573716711931905
    """
    user_id = request.args.get('userid')
    
    if not user_id:
        return jsonify({
            "error": "userid parameter is required",
            "success": False
        }), 400
    
    # Получаем информацию о пользователе
    user_info = get_discord_user_info(user_id)
    
    return jsonify(user_info)

@app.route('/health', methods=['GET'])
def health_check():
    """
    Проверка работоспособности API
    """
    return jsonify({
        "status": "API is running",
        "success": True
    })

if __name__ == '__main__':
    print("Starting Discord Bot API...")
    print("Example usage: http://localhost:5000/?userid=470573716711931905")
    app.run(host='0.0.0.0', port=5000, debug=True)
