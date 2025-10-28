# Решение проблем

## 🔍 Диагностика белого экрана

Если вы видите белый экран, следуйте этим шагам:

### Шаг 1: Откройте консоль браузера

1. Нажмите `F12` или `Ctrl+Shift+I` (Windows/Linux) / `Cmd+Option+I` (Mac)
2. Перейдите на вкладку **Console**
3. Найдите красные сообщения об ошибках

### Шаг 2: Типичные ошибки и решения

#### Ошибка: "Failed to fetch"

```
GET http://localhost:8080/api/v1/bot net::ERR_CONNECTION_REFUSED
```

**Причина:** Backend не запущен или недоступен

**Решение:**
1. Запустите ваш Go backend на порту 8080
2. Проверьте доступность: `curl http://localhost:8080/api/v1/bot`
3. Или временно используйте моковые данные (см. ниже)

#### Ошибка: "CORS policy"

```
Access to fetch at 'http://localhost:8080/...' has been blocked by CORS policy
```

**Причина:** Backend не настроен для приема запросов с frontend

**Решение:** Добавьте CORS middleware в Go:

```go
import "github.com/gin-contrib/cors"

router.Use(cors.New(cors.Config{
    AllowOrigins:     []string{"*"}, // Для разработки
    AllowMethods:     []string{"GET", "POST", "DELETE", "OPTIONS"},
    AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
    AllowCredentials: true,
}))
```

#### Ошибка: "Cannot read properties of undefined"

```
TypeError: Cannot read properties of undefined (reading 'map')
```

**Причина:** API возвращает неожиданную структуру данных

**Решение:**
1. Проверьте ответ API в Network tab
2. Убедитесь, что API возвращает массив Application[]
3. Проверьте структуру данных в документации

### Шаг 3: Временное решение - моковые данные

Если вы хотите проверить frontend без backend:

#### Для HomePage:

Откройте `/pages/HomePage.tsx` и замените функцию `loadProjects`:

```typescript
// Закомментируйте или удалите оригинальную функцию
/*
const loadProjects = async () => {
  try {
    setLoading(true);
    const data = await publicAPI.getApprovedProjects();
    setProjects(data);
  } catch (error) {
    console.error("Failed to load projects:", error);
    toast.error("Не удалось загрузить проекты. Попробуйте обновить страницу.");
  } finally {
    setLoading(false);
  }
};
*/

// Добавьте эту версию
const loadProjects = async () => {
  setLoading(true);
  // Импортируйте mockData вверху файла:
  // import { mockApplications } from "../lib/mockData";
  
  // Имитация задержки сети
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Используем моковые данные
  const { mockApplications } = await import("../lib/mockData");
  setProjects(mockApplications.filter(app => app.status === "approved"));
  setLoading(false);
};
```

#### Для AdminPage:

Закомментируйте вызов API и используйте mockData:

```typescript
// В функции loadApplications
const loadApplications = async () => {
  setLoadingData(true);
  const { mockApplications } = await import("../lib/mockData");
  setApplications(mockApplications);
  setLoadingData(false);
};
```

#### Для AddPage:

Закомментируйте отправку на API:

```typescript
// В функции handleSubmit
// Вместо await publicAPI.addApplication(applicationData);
console.log("Mock submission:", applicationData);
toast.success("Заявка успешно отправлена на модерацию!");
setSubmitted(true);
```

## 🌐 Проверка сети

### Вкладка Network в DevTools

1. Откройте DevTools (`F12`)
2. Перейдите на вкладку **Network**
3. Обновите страницу (`F5`)
4. Найдите запросы к API (фильтр: XHR/Fetch)

#### Успешный запрос
- Статус: `200 OK`
- Response: JSON с данными

#### Проблемный запрос
- Статус: `0` или `(failed)` - Backend недоступен
- Статус: `404` - Неправильный URL endpoint
- Статус: `500` - Ошибка на backend
- Статус: `401/403` - Проблемы с аутентификацией

## 🔄 Состояния загрузки

### Нормальное поведение:

1. **Загрузка:** Показывается спиннер
2. **Успех:** Отображаются данные
3. **Ошибка:** Показывается сообщение об ошибке

### Проверьте состояния:

```typescript
// В консоли браузера
console.log("Loading:", loading);
console.log("Projects:", projects);
```

## 🐛 Частые проблемы

### 1. Пустой список проектов

**Симптомы:** Показывается "Проекты не найдены"

**Возможные причины:**
- Backend возвращает пустой массив
- Все проекты имеют status !== "approved"
- Фильтры исключают все проекты

**Решение:**
1. Проверьте ответ API в Network tab
2. Убедитесь, что есть проекты со статусом "approved"
3. Сбросьте фильтры (выберите "Все")

### 2. Изображения не загружаются

**Симптомы:** Показываются placeholder'ы вместо изображений

**Возможные причины:**
- Неправильные пути к изображениям
- CORS для изображений
- Изображения не загружены на backend

**Решение:**
1. Проверьте поле `image` в ответе API
2. Убедитесь, что URL изображений доступны
3. Проверьте CORS для изображений

### 3. Не работает авторизация

**Симптомы:** После входа перекидывает обратно на форму

**Возможные причины:**
- Backend не возвращает cookie
- Cookie блокируются браузером
- Endpoint validate не работает

**Решение:**
1. Проверьте Response Headers в Network tab
2. Ищите `Set-Cookie` header
3. Проверьте, что `credentials: "include"` установлен
4. Проверьте endpoint `/api/v1/auth/validate`

### 4. Форма не отправляется

**Симптомы:** После submit ничего не происходит

**Возможные причины:**
- Валидация не проходит
- Ошибка на frontend
- Ошибка на backend

**Решение:**
1. Откройте консоль - проверьте ошибки
2. Проверьте Network tab - был ли запрос
3. Проверьте Response - что вернул backend

## 📊 Инструменты отладки

### React DevTools

Установите расширение React DevTools для вашего браузера:
- [Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
- [Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)

### Console Commands

Полезные команды для отладки в консоли:

```javascript
// Проверить текущий path
window.location.hash

// Проверить cookies
document.cookie

// Очистить cookies
document.cookie.split(";").forEach(c => {
  document.cookie = c.trim().split("=")[0] + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/";
});

// Очистить localStorage
localStorage.clear()

// Перезагрузить страницу без кэша
location.reload(true)
```

## 🔧 Backend чеклист

Убедитесь, что ваш Go backend:

- [ ] Запущен на порту 8080
- [ ] Отвечает на `/api/v1/bot` (GET)
- [ ] Настроен CORS для всех origins (для разработки)
- [ ] Возвращает правильную структуру JSON
- [ ] Обрабатывает ошибки и возвращает правильные статус-коды
- [ ] Логирует запросы для отладки

### Пример минимального тестового endpoint:

```go
// Для быстрого теста
router.GET("/api/v1/bot", func(c *gin.Context) {
    c.JSON(200, []gin.H{
        {
            "id": "1",
            "name": "Test Bot",
            "category": "Инструменты",
            "shortDescription": "Test",
            "fullDescription": "Test description",
            "link": "https://t.me/testbot",
            "image": "",
            "tags": []string{"test"},
            "date": "2025-10-28",
            "status": "approved",
            "type": "bot",
            "createdAt": time.Now().Format(time.RFC3339),
            "updatedAt": time.Now().Format(time.RFC3339),
        },
    })
})
```

## 💡 Советы по отладке

1. **Всегда проверяйте консоль** - 90% проблем видны в консоли
2. **Используйте Network tab** - видите все запросы и ответы
3. **Логируйте всё** - добавляйте `console.log()` где нужно
4. **Проверяйте по шагам** - изолируйте проблему
5. **Читайте ошибки внимательно** - они обычно говорят, что не так

## 🆘 Если ничего не помогает

1. Очистите кэш браузера полностью
2. Попробуйте другой браузер
3. Проверьте, что все файлы на месте
4. Убедитесь, что нет конфликтов портов
5. Перезапустите и backend, и frontend

## 📞 Дополнительная помощь

Если проблема не решается:

1. Скопируйте полное сообщение об ошибке из консоли
2. Сделайте скриншот Network tab
3. Опишите, что вы делали до возникновения ошибки
4. Укажите версии браузера и операционной системы

## ✅ Контрольный список

- [ ] Консоль открыта и проверена
- [ ] Network tab проверен
- [ ] Backend запущен и доступен
- [ ] CORS настроен правильно
- [ ] API возвращает правильные данные
- [ ] Cookies работают (для admin панели)
- [ ] Изображения загружаются
- [ ] Нет JavaScript ошибок
