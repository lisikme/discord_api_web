import requests
import json

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
        print(f"Получаем информацию о пользователе {user_id}...")
        
        # Получаем информацию о пользователе
        response = requests.get(
            f'https://discord.com/api/v10/users/{user_id}',
            headers=headers
        )
        
        print(f"Статус ответа: {response.status_code}")
        
        if response.status_code == 200:
            user_data = response.json()
            print(f"Получены данные: {json.dumps(user_data, indent=2, ensure_ascii=False)}")
            
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
            
            print("Результат:")
            print(json.dumps(result, indent=2, ensure_ascii=False))
            return result
            
        else:
            error_result = {
                "error": f"Discord API error: {response.status_code}",
                "message": response.text,
                "success": False
            }
            print(f"Ошибка: {json.dumps(error_result, indent=2, ensure_ascii=False)}")
            return error_result
            
    except Exception as e:
        error_result = {
            "error": f"Request failed: {str(e)}",
            "success": False
        }
        print(f"Исключение: {json.dumps(error_result, indent=2, ensure_ascii=False)}")
        return error_result

# Тестирование
if __name__ == '__main__':
    # Пример использования
    test_user_id = "470573716711931905"
    result = get_discord_user_info(test_user_id)
