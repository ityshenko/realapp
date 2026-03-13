# Тут.ру - Недвижимость в ДНР

Современная доска объявлений недвижимости для Донецка

---

## 🚀 Быстрый старт

### 1. Установка

```bash
npm install
```

### 2. Настройка

```bash
# Скопируйте .env.example
cp .env.example .env

# Отредактируйте .env - укажите ваши данные PostgreSQL
nano .env
```

### 3. База данных

```bash
# Создайте базу данных PostgreSQL
createdb realapp

# Примените схему
npm run db:push

# Сгенерируйте Prisma Client
npm run db:generate
```

### 4. Запуск

```bash
# Разработка (frontend + backend)
npm run dev

# Продакшен
npm run build
npm start
```

---

## 📁 Структура проекта

```
realapp/
├── backend/              # Backend API (Express + Prisma)
│   ├── prisma/          # Схема базы данных
│   ├── src/
│   │   ├── controllers/ # Контроллеры
│   │   ├── routes/      # API routes
│   │   └── index.js     # Точка входа
│   └── public/          # Статические файлы
├── web/                 # Frontend (Next.js + React)
│   ├── src/
│   │   ├── app/         # Страницы
│   │   ├── components/  # Компоненты
│   │   └── lib/         # Утилиты
│   └── public/          # Статические файлы
├── DEPLOYMENT.md        # Подробная инструкция по деплою
└── ecosystem.config.js  # PM2 конфигурация
```

---

## 🔧 Технологии

### Frontend
- **Next.js 14** - React фреймворк
- **TypeScript** - Типизация
- **Tailwind CSS** - Стили
- **Framer Motion** - Анимации
- **Leaflet** - Карты
- **NextAuth.js** - Авторизация

### Backend
- **Express.js** - Web сервер
- **Prisma** - ORM для PostgreSQL
- **JWT** - Аутентификация
- **Bcrypt** - Хеширование паролей

---

## 📦 API Endpoints

### Аутентификация
- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Вход
- `POST /api/auth/logout` - Выход

### Объявления
- `GET /api/listings` - Список объявлений
- `GET /api/listings/:id` - Детали объявления
- `POST /api/listings` - Создать объявление
- `PUT /api/listings/:id` - Обновить объявление
- `DELETE /api/listings/:id` - Удалить объявление

### Пользователи
- `GET /api/users/:id` - Профиль пользователя
- `PUT /api/users/:id` - Обновить профиль

---

## 👤 Роли пользователей

- **USER** - Обычный пользователь (может создавать объявления)
- **MODERATOR** - Модератор (может модерировать объявления)
- **ADMIN** - Администратор (полный доступ)

---

## 🔐 Безопасность

- Пароли хешируются через bcrypt
- JWT токены для аутентификации
- HTTPS обязателен в продакшене
- Rate limiting для API
- Валидация данных на сервере

---

## 📊 База данных

### Основные таблицы
- **users** - Пользователи
- **listings** - Объявления
- **photos** - Фотографии объявлений
- **favorites** - Избранное
- **messages** - Сообщения между пользователями
- **notifications** - Уведомления

---

## 🌐 Деплой

Подробная инструкция в файле [DEPLOYMENT.md](./DEPLOYMENT.md)

### Варианты деплоя:
1. **VPS** (Ubuntu/CentOS) - полный контроль
2. **Vercel** - автоматически для Next.js
3. **Heroku** - простой деплой
4. **DigitalOcean App Platform** - managed хостинг

---

## 📝 Переменные окружения

См. `.env.example`

**Обязательные:**
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Секретный ключ для JWT
- `NEXTAUTH_SECRET` - Секретный ключ NextAuth

---

## 🛠 Разработка

```bash
# Запуск в режиме разработки
npm run dev

# Запуск тестов
npm test

# Сборка проекта
npm run build

# Проверка типов TypeScript
npx tsc --noEmit
```

---

## 📞 Поддержка

Email: support@tut.ru

---

## 📄 Лицензия

MIT

---

**Сделано в Донецке 🏙️**
