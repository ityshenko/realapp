# 🎯 ПЕРЕНОС НА LINK-HOST.NET - ПОЛНАЯ ИНСТРУКЦИЯ

Ваш проект готов к переносу на хостинг с **MySQL** базой данных.

---

## 📦 ЧТО ИЗМЕНИЛОСЬ

✅ **Prisma настроена для MySQL**  
✅ **Зависимости обновлены**  
✅ **Скрипт деплоя готов**  
✅ **Документация создана**

---

## 🚀 ПОШАГОВАЯ ИНСТРУКЦИЯ

### 1️⃣ Создайте MySQL базу на хостинге

1. Зайдите в панель: **https://link-host.net/cpanel**
2. Найдите раздел **"Базы данных MySQL"**
3. Создайте базу данных:
   - Имя: `username_realapp` (или любое другое)
4. Создайте пользователя:
   - Имя: `username_user`
   - Пароль: (запомните!)
5. **Добавьте пользователя к базе** с правами **ALL PRIVILEGES**

📝 **Запишите:**
```
Хост: localhost
База: username_realapp
Пользователь: username_user
Пароль: ********
```

---

### 2️⃣ Настройте .env файл

```bash
cd /Users/ityshenko/Realapp
cp .env.example .env
nano .env
```

**Вставьте ваши данные:**
```env
DATABASE_URL="mysql://username_user:password@localhost/username_realapp"
JWT_SECRET="sekretnaya_stroka_min_32_simvola_abc123"
NODE_ENV=production
PORT=3000
API_URL=http://localhost:5000
NEXTAUTH_URL=http://ваш-домен.com
NEXTAUTH_SECRET=sekretnaya_stroka_dlya_nextauth_xyz789
```

---

### 3️⃣ Примените схему базы данных

**Локально (для теста):**
```bash
cd /Users/ityshenko/Realapp

# Установите зависимости
npm install

# Примените схему к локальной MySQL
npm run db:push

# Сгенерируйте Prisma Client
npm run db:generate
```

**На хостинге (после загрузки):**
```bash
# В терминале хостинга (SSH или Terminal в панели)
cd /home/username/public_html
npm install --production
npx prisma generate
npx prisma migrate deploy --name init
```

---

### 4️⃣ Загрузите файлы на хостинг

**Вариант A: Через скрипт**
```bash
cd /Users/ityshenko/Realapp
chmod +x deploy.sh
./deploy.sh
```

**Вариант B: Вручную через FileZilla**

1. Откройте FileZilla
2. Подключитесь к хостингу:
   - Host: ваш-домен.com или IP
   - Username: ваш логин
   - Password: ваш пароль
3. Загрузите файлы:
```
/local/deploy/  →  /public_html/
```

**Структура на хостинге:**
```
/public_html/
├── .next/              # Собранный Next.js
├── public/             # Статические файлы
├── backend/            # Backend код
├── prisma/             # Prisma схема
├── .env                # Переменные окружения
├── .htaccess           # Apache настройки
├── server.js           # Точка входа
├── package.json        # Зависимости
└── node_modules/       # Установится после npm install
```

---

### 5️⃣ Настройте Node.js в панели хостинга

1. **Node.js Selector** или **Node.js Manager**
2. **Create Application** или **Setup Node.js App**
3. **Заполните:**

| Поле | Значение |
|------|----------|
| Node.js version | 18.x или 20.x |
| Application mode | Production |
| Application root | `/public_html` |
| Application URL | `https://ваш-домен.com` |
| Startup file | `server.js` |
| Port | `3000` |

4. **Environment Variables** (переменные среды):

```
DATABASE_URL=mysql://username_user:password@localhost/username_realapp
JWT_SECRET=sekretnaya_stroka_min_32_simvola_abc123
NODE_ENV=production
PORT=3000
NEXTAUTH_URL=https://ваш-домен.com
```

5. **Create** ✓

---

### 6️⃣ Установите зависимости на хостинге

**В терминале хостинга:**
```bash
cd /home/username/public_html

# Установите все зависимости
npm install --production

# Сгенерируйте Prisma Client
npx prisma generate

# Примените схему базы данных
npx prisma migrate deploy --name init

# Добавьте тестовые данные (опционально)
node backend/prisma/seed.js
```

---

### 7️⃣ Проверьте работу

1. **Откройте сайт:** `https://ваш-домен.com`
2. **Проверьте API:** `https://ваш-домен.com/api/health`
3. **Войдите как админ:**
   - Email: `admin@tut.ru`
   - Пароль: `admin123`

---

## 🔧 НАСТРОЙКА .htaccess

Создайте файл `/public_html/.htaccess`:

```apache
RewriteEngine On
RewriteRule ^$ http://127.0.0.1:3000/$1 [P,L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ http://127.0.0.1:3000/$1 [P,L]

# Security headers
<IfModule mod_headers.c>
    Header set X-Content-Type-Options "nosniff"
    Header set X-Frame-Options "SAMEORIGIN"
    Header set X-XSS-Protection "1; mode=block"
</IfModule>

# Gzip compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
</IfModule>
```

---

## ⚠️ ВОЗМОЖНЫЕ ПРОБЛЕМЫ И РЕШЕНИЯ

### ❌ "Cannot find module 'next'"

```bash
cd /home/username/public_html
npm install next react react-dom --save
```

### ❌ "Prisma Client not found"

```bash
npx prisma generate
```

### ❌ "Cannot connect to database"

1. Проверьте .env:
```env
DATABASE_URL="mysql://user:pass@localhost/database"
```

2. Проверьте подключение:
```bash
mysql -u username_user -p
# Введите пароль
SHOW DATABASES;
```

### ❌ "Port 3000 already in use"

В панели хостинга измените порт на другой (например, 8080) и обновите:
- .env: `PORT=8080`
- .htaccess: замените 3000 на 8080

### ❌ "502 Bad Gateway"

1. Проверьте логи:
```bash
# В панели: Error Logs
# Или файл: error.log
```

2. Перезапустите Node.js приложение в панели

3. Проверьте что server.js существует и правильный

---

## 📊 АРХИТЕКТУРА НА ХОСТИНГЕ

```
┌─────────────────────────────────────┐
│         Apache (Port 80/443)        │
│         Ваш домен                   │
└──────────────┬──────────────────────┘
               │
               │ .htaccess (proxy)
               │
┌──────────────▼──────────────────────┐
│      Node.js (Port 3000)            │
│      ┌─────────────────────┐        │
│      │   Next.js (Frontend)│        │
│      │   /public_html      │        │
│      └─────────────────────┘        │
│      ┌─────────────────────┐        │
│      │   Express (Backend) │        │
│      │   /backend          │        │
│      └─────────────────────┘        │
└──────────────┬──────────────────────┘
               │
               │ Prisma ORM
               │
┌──────────────▼──────────────────────┐
│         MySQL Database              │
│         /home/username/realapp      │
└─────────────────────────────────────┘
```

---

## 🎯 ЧЕКЛИСТ ПЕРЕД ЗАПУСКОМ

- [ ] MySQL база создана
- [ ] Пользователь БД создан и имеет права
- [ ] .env файл создан и заполнен
- [ ] Файлы загружены на хостинг
- [ ] Node.js приложение создано в панели
- [ ] Переменные окружения добавлены
- [ ] Зависимости установлены (`npm install`)
- [ ] Prisma Client сгенерирован
- [ ] Миграции применены
- [ ] Сайт открывается
- [ ] API работает
- [ ] Вход админа работает

---

## 📞 ТЕХПОДДЕРЖКА

Если что-то не работает:

1. **Проверьте логи ошибок** в панели хостинга
2. **Проверьте версию Node.js** (должна быть 18+)
3. **Проверьте подключение к БД** через phpMyAdmin
4. **Перезапустите Node.js приложение** в панели

---

**Успешного деплоя! 🎉**

Ваш сайт готов к работе!
