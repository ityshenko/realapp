# 🚀 БЫСТРЫЙ СТАРТ - REALAPP

## 1️⃣ Установка

```bash
cd /Users/ityshenko/Realapp
npm install
```

---

## 2️⃣ Настройка базы данных

### Установите PostgreSQL

**macOS:**
```bash
brew install postgresql
brew services start postgresql
```

**Ubuntu:**
```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### Создайте базу данных

```bash
psql -U postgres

CREATE DATABASE realapp;
CREATE USER realapp WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE realapp TO realapp;
\q
```

### Настройте .env

```bash
cp .env.example .env
nano .env
```

**Измените строку подключения:**
```env
DATABASE_URL="postgresql://realapp:password@localhost:5432/realapp?schema=public"
```

---

## 3️⃣ Инициализация базы данных

```bash
# Примените схему
npm run db:push

# Сгенерируйте Prisma Client
npm run db:generate

# Добавьте тестовые данные (опционально)
cd backend
npx prisma db seed
```

**Тестовые учетки:**
- Admin: `admin@tut.ru` / `admin123`
- User: `user1@test.ru` / `admin123`

---

## 4️⃣ Запуск

### Разработка

```bash
# Запуск frontend + backend
npm run dev
```

**Доступ:**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

### Продакшен

```bash
# Сборка
npm run build

# Запуск
npm start
```

---

## 5️⃣ Проверка работы

1. Откройте http://localhost:3000
2. Войдите как admin@tut.ru / admin123
3. Создайте тестовое объявление
4. Проверьте карту

---

## 📝 Основные команды

```bash
# База данных
npm run db:push          # Применить схему
npm run db:generate      # Генерация Prisma Client
npm run db:studio        # Prisma Studio (GUI)

# Разработка
npm run dev              # Запуск разработки
npm run build            # Сборка проекта
npm start                # Запуск продакшена

# Backend
cd backend
npm run dev              # Запуск backend
```

---

## ❗ Решение проблем

### "Cannot connect to database"

```bash
# Проверьте PostgreSQL
sudo systemctl status postgresql  # Ubuntu
brew services list                # macOS

# Перезапустите
sudo systemctl restart postgresql
brew services restart postgresql
```

### "Prisma Client not found"

```bash
npm run db:generate
```

### "Port already in use"

```bash
# Найдите процесс
lsof -i :3000
lsof -i :5000

# Убейте процесс
kill -9 <PID>
```

---

## 📦 Структура проекта

```
realapp/
├── backend/              # Backend API
│   ├── prisma/
│   │   ├── schema.prisma # Модель данных
│   │   └── seed.js       # Тестовые данные
│   ├── src/
│   │   ├── controllers/  # Логика API
│   │   ├── middleware/   # Auth middleware
│   │   └── index.js      # Точка входа
│   └── public/uploads/   # Фотографии
├── web/                  # Frontend (Next.js)
│   ├── src/
│   │   ├── app/          # Страницы
│   │   ├── components/   # Компоненты
│   │   └── pages/api/    # NextAuth API
│   └── public/
├── .env                  # Переменные окружения
├── .env.example          # Пример .env
├── DEPLOYMENT.md         # Инструкция по деплою
└── ecosystem.config.js   # PM2 config
```

---

## 🔐 Безопасность

**Перед деплоем измените в .env:**

```bash
# Сгенерируйте новые секреты
openssl rand -base64 32  # Для JWT_SECRET
openssl rand -base64 32  # Для NEXTAUTH_SECRET
```

---

## 📞 Поддержка

При возникновении проблем:
1. Проверьте `.env` файл
2. Проверьте логи: `npm run dev`
3. Убедитесь что PostgreSQL запущен

---

**Готово! 🎉**
