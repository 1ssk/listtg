# Команды для тестирования API

Используйте эти команды для быстрого тестирования вашего backend API.

## 🔍 Проверка доступности

```bash
# Простая проверка, что backend запущен
curl http://localhost:8080/api/v1/bot

# Должен вернуть JSON массив проектов или пустой массив []
```

## 📋 Публичные endpoints

### 1. Получить все одобренные проекты

```bash
curl -X GET http://localhost:8080/api/v1/bot \
  -H "Content-Type: application/json"
```

**Ожидаемый ответ:**
```json
[
  {
    "id": "uuid",
    "name": "Test Bot",
    "category": "Инструменты",
    "shortDescription": "Краткое описание",
    "fullDescription": "Полное описание проекта",
    "link": "https://t.me/testbot",
    "image": "",
    "tags": ["test", "bot"],
    "date": "2025-10-28",
    "status": "approved",
    "type": "bot",
    "createdAt": "2025-10-28T10:00:00Z",
    "updatedAt": "2025-10-28T10:00:00Z"
  }
]
```

### 2. Добавить новую заявку

```bash
curl -X POST http://localhost:8080/api/v1/bot/addApplication \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Music Bot",
    "category": "Музыка",
    "shortDescription": "Находит музыку по названию",
    "fullDescription": "Полное описание бота. Может искать музыку по названию, исполнителю и тексту песни. Поддерживает высокое качество аудио.",
    "link": "https://t.me/testmusicbot",
    "image": "",
    "tags": ["музыка", "поиск", "аудио"],
    "date": "2025-10-28",
    "type": "bot"
  }'
```

**Ожидаемый ответ:** `200 OK`

## 🔐 Аутентификация

### 1. Войти в систему

```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "login": "admin",
    "password": "yourpassword"
  }'
```

**Ожидаемый ответ:**
```json
{
  "token": "jwt_token_string",
  "message": "Login successful"
}
```

**Важно:** Cookie с токеном сохранится в файл `cookies.txt`

### 2. Проверить токен

```bash
curl -X GET http://localhost:8080/api/v1/auth/validate \
  -b cookies.txt
```

**Ожидаемый ответ:** `200 OK`

### 3. Выйти из системы

```bash
curl -X POST http://localhost:8080/api/v1/auth/logout \
  -b cookies.txt
```

**Ожидаемый ответ:** `200 OK`

## 👨‍💼 Административные endpoints

**Важно:** Для всех административных endpoints нужна аутентификация!
Сначала выполните команду login выше, чтобы получить cookies.txt

### 1. Получить все заявки

```bash
curl -X GET http://localhost:8080/api/v1/admin/ \
  -H "Content-Type: application/json" \
  -b cookies.txt
```

**Ожидаемый ответ:** Массив всех заявок (approved, pending, rejected)

### 2. Одобрить заявку

```bash
curl -X POST http://localhost:8080/api/v1/admin/update \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "id": "uuid-заявки",
    "status": "approved"
  }'
```

**Замените** `uuid-заявки` на реальный ID из предыдущего запроса

**Ожидаемый ответ:** `200 OK`

### 3. Отклонить заявку

```bash
curl -X POST http://localhost:8080/api/v1/admin/update \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "id": "uuid-заявки",
    "status": "rejected"
  }'
```

**Ожидаемый ответ:** `200 OK`

### 4. Удалить заявку

```bash
curl -X DELETE http://localhost:8080/api/v1/admin/delete \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "id": "uuid-заявки"
  }'
```

**Ожидаемый ответ:** `200 OK`

## 🧪 Тестовый сценарий

Выполните эти команды по порядку для полного теста:

```bash
# 1. Проверка доступности
echo "=== 1. Проверка backend ==="
curl http://localhost:8080/api/v1/bot

# 2. Добавление тестовой заявки
echo "\n=== 2. Добавление заявки ==="
curl -X POST http://localhost:8080/api/v1/bot/addApplication \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Bot",
    "category": "Инструменты",
    "shortDescription": "Test bot",
    "fullDescription": "Full description of test bot",
    "link": "https://t.me/testbot",
    "tags": ["test"],
    "date": "2025-10-28",
    "type": "bot"
  }'

# 3. Авторизация
echo "\n=== 3. Авторизация ==="
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "login": "admin",
    "password": "password"
  }'

# 4. Получение всех заявок
echo "\n=== 4. Все заявки ==="
curl -X GET http://localhost:8080/api/v1/admin/ \
  -b cookies.txt

# 5. Одобрение заявки (замените ID!)
echo "\n=== 5. Одобрение заявки ==="
# Скопируйте ID из предыдущего шага
# curl -X POST http://localhost:8080/api/v1/admin/update \
#   -H "Content-Type: application/json" \
#   -b cookies.txt \
#   -d '{"id": "ЗАМЕНИТЕ_НА_РЕАЛЬНЫЙ_ID", "status": "approved"}'

echo "\n=== Тестирование завершено ==="
```

## 📝 Примечания

### Windows PowerShell

Если вы используете PowerShell, используйте такой синтаксис:

```powershell
# GET запрос
Invoke-RestMethod -Uri "http://localhost:8080/api/v1/bot" -Method Get

# POST запрос
$body = @{
    login = "admin"
    password = "password"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8080/api/v1/auth/login" `
    -Method Post `
    -ContentType "application/json" `
    -Body $body `
    -SessionVariable session

# С сохраненной сессией
Invoke-RestMethod -Uri "http://localhost:8080/api/v1/admin/" `
    -Method Get `
    -WebSession $session
```

### Postman

Если вы предпочитаете Postman:

1. Создайте коллекцию "LISTTG API"
2. Импортируйте эти endpoints
3. Настройте Environment:
   - `base_url`: `http://localhost:8080/api/v1`
4. Используйте `{{base_url}}/bot` в запросах

### Статус-коды

- `200 OK` - Успешный запрос
- `201 Created` - Ресурс создан
- `400 Bad Request` - Неверные данные
- `401 Unauthorized` - Требуется авторизация
- `403 Forbidden` - Доступ запрещен
- `404 Not Found` - Ресурс не найден
- `500 Internal Server Error` - Ошибка сервера

## 🔧 Отладка

### Проверка CORS

```bash
curl -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -X OPTIONS \
  --verbose \
  http://localhost:8080/api/v1/bot
```

Должны быть заголовки:
```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: POST
Access-Control-Allow-Credentials: true
```

### Проверка cookies

```bash
# Посмотреть cookies после login
cat cookies.txt

# Должно быть что-то вроде:
# localhost:8080	FALSE	/	FALSE	0	token	eyJhbGc...
```

### Детальный вывод

Добавьте флаг `-v` для детального вывода:

```bash
curl -v http://localhost:8080/api/v1/bot
```

Покажет:
- Request headers
- Response headers
- Response body
- Timing information

## 🎯 Быстрая проверка

Одна команда для проверки, что все работает:

```bash
# Проверка всех основных endpoints
for endpoint in "/bot" "/admin/" "/auth/validate"; do
  echo "Testing: $endpoint"
  curl -s -o /dev/null -w "Status: %{http_code}\n" http://localhost:8080/api/v1$endpoint
done
```

Должны быть:
- `/bot` - 200
- `/admin/` - 401 (без auth) или 200 (с auth)
- `/auth/validate` - 401 (без auth) или 200 (с auth)

## 📚 Дополнительно

- [API Documentation](./API_INTEGRATION.md)
- [Setup Guide](./SETUP_GUIDE.md)
- [Troubleshooting](./TROUBLESHOOTING.md)

---

**Tip:** Сохраните эти команды в файл `test-api.sh` и запускайте через `bash test-api.sh`
