# API Integration Documentation

## Base URL
```
http://localhost:8080/api/v1
```

## API Endpoints

### 🔹 Публичные endpoints (`/api/v1/bot`)

#### 1. Получить все одобренные проекты
```
GET /api/v1/bot
```

**Response:**
```json
[
  {
    "id": "uuid-string",
    "name": "Music Finder Bot",
    "category": "Музыка",
    "shortDescription": "Краткое описание",
    "fullDescription": "Полное описание проекта",
    "link": "https://t.me/musicbot",
    "image": "path/to/image.jpg",
    "tags": ["музыка", "поиск", "аудио"],
    "date": "2025-10-22",
    "status": "approved",
    "type": "bot",
    "createdAt": "2025-10-22T10:00:00Z",
    "updatedAt": "2025-10-22T10:00:00Z"
  }
]
```

#### 2. Добавить новую заявку
```
POST /api/v1/bot/addApplication
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Music Finder Bot",
  "category": "Музыка",
  "shortDescription": "Краткое описание (до 100 символов)",
  "fullDescription": "Полное описание (до 500 символов)",
  "link": "https://t.me/musicbot",
  "image": "base64_string_or_path",
  "tags": ["музыка", "поиск", "аудио"],
  "date": "2025-10-22",
  "type": "bot"
}
```

**Response:** `200 OK` или `400 Bad Request`

---

### 🔹 Аутентификация (`/api/v1/auth`)

#### 1. Авторизация
```
POST /api/v1/auth/login
Content-Type: application/json
```

**Request Body:**
```json
{
  "login": "admin",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "jwt_token_string",
  "message": "Login successful"
}
```

**Note:** Токен должен быть сохранен в cookies для последующих запросов.

#### 2. Проверка токена
```
GET /api/v1/auth/validate
Cookie: token=jwt_token_string
```

**Response:** `200 OK` или `401 Unauthorized`

#### 3. Выход из системы
```
POST /api/v1/auth/logout
Cookie: token=jwt_token_string
```

**Response:** `200 OK`

---

### 🔹 Административные endpoints (`/api/v1/admin`)

**Note:** Все административные endpoints требуют авторизации через cookie с JWT токеном.

#### 1. Получить все заявки
```
GET /api/v1/admin/
Cookie: token=jwt_token_string
```

**Response:**
```json
[
  {
    "id": "uuid-string",
    "name": "Music Finder Bot",
    "category": "Музыка",
    "shortDescription": "Краткое описание",
    "fullDescription": "Полное описание",
    "link": "https://t.me/musicbot",
    "image": "path/to/image.jpg",
    "tags": ["музыка", "поиск", "аудио"],
    "date": "2025-10-22",
    "status": "pending",
    "type": "bot",
    "createdAt": "2025-10-22T10:00:00Z",
    "updatedAt": "2025-10-22T10:00:00Z"
  }
]
```

#### 2. Удалить заявку
```
DELETE /api/v1/admin/delete
Content-Type: application/json
Cookie: token=jwt_token_string
```

**Request Body:**
```json
{
  "id": "uuid-string"
}
```

**Response:** `200 OK` или `404 Not Found`

#### 3. Обновить статус заявки
```
POST /api/v1/admin/update
Content-Type: application/json
Cookie: token=jwt_token_string
```

**Request Body:**
```json
{
  "id": "uuid-string",
  "status": "approved"
}
```

**Possible status values:** `"pending"`, `"approved"`, `"rejected"`

**Response:** `200 OK` или `404 Not Found`

---

## Используемые типы

### Application (Заявка)
```typescript
interface Application {
  id: string;
  name: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  link: string;
  image?: string;
  tags: string[];
  date: string; // YYYY-MM-DD format
  status: "pending" | "approved" | "rejected";
  type: "bot" | "channel" | "group";
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}
```

### User (Администратор)
```typescript
interface User {
  id: number;
  login: string;
  password: string; // hashed
  createdAt: string;
  updatedAt: string;
}
```

---

## CORS Configuration

Убедитесь, что ваш backend настроен на прием запросов с frontend:

```go
// Пример для Go
router.Use(cors.New(cors.Config{
    AllowOrigins:     []string{"http://localhost:3000", "http://localhost:5173"},
    AllowMethods:     []string{"GET", "POST", "DELETE", "OPTIONS"},
    AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
    AllowCredentials: true,
}))
```

---

## Категории проектов

```typescript
const CATEGORIES = [
  "Музыка",
  "Образование",
  "Развлечения",
  "Новости",
  "Инструменты",
  "Бизнес",
  "Технологии",
  "Игры",
  "Спорт",
  "Другое",
];
```

---

## Тестирование API

### Примеры cURL команд:

#### Получить все проекты:
```bash
curl http://localhost:8080/api/v1/bot
```

#### Добавить заявку:
```bash
curl -X POST http://localhost:8080/api/v1/bot/addApplication \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Bot",
    "category": "Инструменты",
    "shortDescription": "Test description",
    "fullDescription": "Full test description",
    "link": "https://t.me/testbot",
    "image": "",
    "tags": ["test"],
    "date": "2025-10-28",
    "type": "bot"
  }'
```

#### Авторизация:
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "login": "admin",
    "password": "password123"
  }'
```

#### Получить все заявки (с авторизацией):
```bash
curl http://localhost:8080/api/v1/admin/ \
  -b cookies.txt
```

---

## Frontend Implementation

Все API запросы реализованы в файле `/lib/api.ts`:

- **publicAPI** - публичные endpoints
- **authAPI** - аутентификация
- **adminAPI** - административные функции

Использование в компонентах:

```typescript
import { publicAPI, authAPI, adminAPI } from "../lib/api";

// Получить проекты
const projects = await publicAPI.getApprovedProjects();

// Добавить заявку
await publicAPI.addApplication(applicationData);

// Войти
await authAPI.login({ login: "admin", password: "pass" });

// Одобрить заявку
await adminAPI.updateApplicationStatus(id, "approved");
```
