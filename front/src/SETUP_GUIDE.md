# Руководство по настройке и запуску

## 🎯 Быстрый старт

### 1. Проверка приложения

Приложение уже запущено и готово к работе. Откройте его в браузере и вы увидите:

- ✅ Главную страницу с Hero-секцией
- ✅ Каталог проектов
- ✅ Фильтры по типу и категории
- ✅ Форму добавления проектов
- ✅ Административную панель
- ✅ Дополнительные страницы

### 2. Подключение backend API

Приложение настроено для работы с вашим Go backend на `http://localhost:8080/api/v1/`

#### Проверьте, что backend запущен:

```bash
# Проверка доступности API
curl http://localhost:8080/api/v1/bot
```

Если backend не запущен, вы увидите ошибки в консоли браузера.

### 3. Тестирование без backend

По умолчанию приложение пытается загрузить данные с backend. Если backend недоступен:

1. Откройте консоль браузера (F12)
2. Вы увидите сообщение об ошибке загрузки
3. Приложение покажет пустой список или сообщение об ошибке

## 🔧 Режимы работы

### Режим 1: С реальным backend (текущий)

Приложение настроено на работу с API на `localhost:8080`. Все запросы идут на backend:

```typescript
// /lib/api.ts
const API_BASE_URL = "http://localhost:8080/api/v1";
```

**Требования:**
- Backend должен быть запущен на порту 8080
- CORS должен быть настроен для разрешения запросов с frontend
- Все endpoints должны соответствовать спецификации

### Режим 2: С моковыми данными (для тестирования)

Если вы хотите протестировать frontend без backend:

1. Откройте `/pages/HomePage.tsx`
2. Найдите строку:
```typescript
import { mockApplications } from "../lib/mockData";
```
3. Замените функцию `loadProjects()` на:
```typescript
const loadProjects = async () => {
  setLoading(true);
  // Имитация задержки сети
  await new Promise(resolve => setTimeout(resolve, 500));
  setProjects(mockApplications.filter(app => app.status === "approved"));
  setLoading(false);
};
```

## 📡 Проверка API endpoints

### Публичные endpoints

```bash
# Получить все одобренные проекты
curl http://localhost:8080/api/v1/bot

# Добавить заявку
curl -X POST http://localhost:8080/api/v1/bot/addApplication \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Bot",
    "category": "Инструменты",
    "shortDescription": "Test",
    "fullDescription": "Full test",
    "link": "https://t.me/testbot",
    "tags": ["test"],
    "date": "2025-10-28",
    "type": "bot"
  }'
```

### Административные endpoints

```bash
# Авторизация
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"login": "admin", "password": "password"}'

# Получить все заявки
curl http://localhost:8080/api/v1/admin/ -b cookies.txt

# Одобрить заявку
curl -X POST http://localhost:8080/api/v1/admin/update \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"id": "uuid", "status": "approved"}'

# Удалить заявку
curl -X DELETE http://localhost:8080/api/v1/admin/delete \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"id": "uuid"}'
```

## 🐛 Решение проблем

### Проблема: Белый экран

**Решение 1:** Проверьте консоль браузера (F12)
- Найдите красные ошибки
- Проверьте, нет ли ошибок импорта или синтаксиса

**Решение 2:** Проверьте сетевые запросы
- Откройте вкладку Network в DevTools
- Обновите страницу
- Проверьте статусы запросов к API

**Решение 3:** Переключитесь на моковые данные
- Следуйте инструкциям в разделе "Режим 2"

### Проблема: CORS ошибки

```
Access to fetch at 'http://localhost:8080/api/v1/bot' from origin 'http://localhost:3000' 
has been blocked by CORS policy
```

**Решение:** Настройте CORS на backend

```go
// main.go или router.go
import "github.com/gin-contrib/cors"

router.Use(cors.New(cors.Config{
    AllowOrigins:     []string{"http://localhost:3000", "http://localhost:5173"},
    AllowMethods:     []string{"GET", "POST", "DELETE", "OPTIONS"},
    AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
    AllowCredentials: true,
}))
```

### Проблема: Не работает авторизация

**Симптомы:**
- Не получается войти в админ-панель
- После входа сразу перекидывает обратно

**Решение:**
1. Проверьте, что backend возвращает cookie с токеном
2. Убедитесь, что `credentials: "include"` установлен в запросах
3. Проверьте, что домены совпадают (localhost:3000 ↔ localhost:8080)
4. Проверьте endpoint `/api/v1/auth/validate`

### Проблема: Не загружаются изображения

**Симптомы:**
- Вместо изображений видны placeholder'ы
- Ошибки 404 для изображений

**Решение:**
1. Проверьте пути к изображениям в ответах API
2. Убедитесь, что backend правильно обрабатывает загрузку изображений
3. Проверьте, что изображения доступны по указанным URL

### Проблема: Данные не обновляются

**Симптомы:**
- После добавления проекта он не появляется
- После одобрения заявка не меняет статус

**Решение:**
1. Проверьте, что API endpoints возвращают обновленные данные
2. Убедитесь, что нет кэширования на уровне браузера
3. Проверьте консоль на наличие ошибок сети
4. Попробуйте обновить страницу вручную

## 📊 Структура данных

### Application (Заявка)

```typescript
{
  id: string;                    // UUID генерируется backend
  name: string;                  // Название проекта
  category: string;              // Одна из 10 категорий
  shortDescription: string;      // До 100 символов
  fullDescription: string;       // До 500 символов
  link: string;                  // Ссылка на t.me
  image?: string;                // URL или base64
  tags: string[];                // Массив тегов
  date: string;                  // YYYY-MM-DD
  status: "pending" | "approved" | "rejected";
  type: "bot" | "channel" | "group";
  createdAt: string;             // ISO 8601
  updatedAt: string;             // ISO 8601
}
```

## 🔐 Безопасность

### Рекомендации для production:

1. **HTTPS:** Используйте HTTPS для всех запросов
2. **Токены:** Используйте JWT токены с коротким временем жизни
3. **Validation:** Проверяйте все входные данные на backend
4. **Rate Limiting:** Ограничьте количество запросов от одного IP
5. **CORS:** Настройте CORS только для доверенных доменов
6. **Sanitization:** Очищайте HTML и SQL инъекции

## 🚀 Deployment

### Frontend

Приложение готово к деплою на любой хостинг:
- Vercel
- Netlify  
- GitHub Pages
- Своем сервере

**Важно:** Обновите `API_BASE_URL` в `/lib/api.ts` на production URL вашего backend

### Backend

Убедитесь, что:
1. CORS настроен для production домена
2. База данных доступна
3. Переменные окружения настроены
4. SSL сертификат установлен

## 📞 Поддержка

Если у вас возникли проблемы:

1. Проверьте [API_INTEGRATION.md](./API_INTEGRATION.md) для документации по API
2. Проверьте [README.md](./README.md) для общей информации
3. Откройте консоль браузера для поиска ошибок
4. Проверьте логи backend для server-side ошибок

## ✅ Чек-лист запуска

- [ ] Backend запущен на порту 8080
- [ ] CORS настроен правильно
- [ ] База данных инициализирована
- [ ] Создан хотя бы один admin пользователь
- [ ] Все API endpoints работают
- [ ] Frontend загружается без ошибок
- [ ] Можно просматривать проекты
- [ ] Можно добавлять заявки
- [ ] Можно войти в админ-панель
- [ ] Можно одобрять/отклонять заявки

## 🎉 Готово!

После выполнения всех шагов ваше приложение должно работать полностью. Удачи! 🚀
