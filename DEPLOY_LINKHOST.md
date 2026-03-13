# 📦 ДЕПЛОЙ НА LINK-HOST.NET

## Шаг 1: Проверка возможностей хостинга

Зайдите в панель управления хостингом и проверьте:

1. **Есть ли Node.js?**
   - Панель → Node.js Selector / Node.js Manager
   - Если есть - отлично!
   - Если нет - см. "Вариант без Node.js" ниже

2. **Создайте MySQL базу данных:**
   - Панель → MySQL Databases
   - Создайте базу данных (например: `username_realapp`)
   - Создайте пользователя (например: `username_realapp_user`)
   - Запишите: **host, database, username, password**

---

## Шаг 2: Подготовка проекта

### 2.1 Измените Prisma для MySQL

Откройте `backend/prisma/schema.prisma`:

```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}
```

### 2.2 Обновите зависимости

```bash
cd /Users/ityshenko/Realapp/backend

# Удалите старые зависимости
npm uninstall @prisma/client
npm install @prisma/client

# Переустановите Prisma
npm uninstall prisma
npm install prisma --save-dev

# Инициализируйте для MySQL
npx prisma init --datasource-provider mysql
```

### 2.3 Обновите .env

```bash
cd /Users/ityshenko/Realapp
cp .env.example .env
nano .env
```

**Для локальной разработки:**
```env
DATABASE_URL="mysql://root:password@localhost:3306/realapp"
```

**Для хостинга (заполните позже):**
```env
DATABASE_URL="mysql://username_dbuser:password@localhost/username_realapp"
JWT_SECRET="your_secret_key_32_chars"
NODE_ENV=production
PORT=3000
```

### 2.4 Примените схему

```bash
cd /Users/ityshenko/Realapp
npm run db:push
npm run db:generate
```

---

## Шаг 3: Сборка проекта

### 3.1 Соберите frontend

```bash
cd /Users/ityshenko/Realapp/web
npm run build
```

### 3.2 Подготовьте файлы для загрузки

Создайте папку для загрузки:

```bash
cd /Users/ityshenko/Realapp
mkdir -p deploy
cp -r web/.next deploy/
cp -r web/public deploy/public
cp -r web/package.json deploy/
cp -r web/next.config.js deploy/
cp -r backend/package.json deploy/backend-package.json
cp -r backend/src deploy/backend-src
cp -r backend/prisma deploy/prisma
cp .env deploy/.env
```

---

## Шаг 4: Загрузка на хостинг

### 4.1 Через FTP (FileZilla)

1. **Подключитесь к серверу:**
   - Host: `ваш-домен.com` или IP сервера
   - Username: ваш логин
   - Password: ваш пароль
   - Port: 21

2. **Загрузите файлы:**
```
/public_html/
├── .next/           ← из deploy/.next
├── public/          ← из deploy/public
├── backend/         ← из deploy/backend-src
├── prisma/          ← из deploy/prisma
├── .env             ← из deploy/.env
├── package.json     ← из deploy/package.json
├── next.config.js   ← из deploy/next.config.js
└── server.js        ← создайте (см. ниже)
```

### 4.2 Создайте server.js в корне

```javascript
// /public_html/server.js
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const express = require('express');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  
  // API routes для backend
  server.use('/api', require('./backend/index.js'));
  
  // Next.js handling
  server.all('*', (req, res) => {
    return handle(req, res);
  });
  
  server.listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});
```

---

## Шаг 5: Настройка Node.js на хостинге

### 5.1 В панели хостинга

1. **Node.js Selector** или **Node.js Manager**
2. **Create Application**
3. **Заполните:**
   - **Node.js version:** 18.x
   - **Application mode:** Production
   - **Application root:** `/public_html`
   - **Application URL:** ваш домен
   - **Startup file:** `server.js`
   - **Port:** 3000

4. **Environment Variables:**
```
DATABASE_URL=mysql://user:pass@localhost/username_realapp
JWT_SECRET=your_secret_key_32_chars
NODE_ENV=production
PORT=3000
```

5. **Нажмите "Create"**

### 5.2 Установите зависимости

В панели найдите **Terminal** или **SSH Access**:

```bash
cd /home/username/public_html
npm install --production
```

Или создайте файл `setup.sh`:

```bash
#!/bin/bash
cd /home/username/public_html
npm install --production
cd backend
npm install --production
npx prisma generate
npx prisma migrate deploy
```

---

## Шаг 6: Настройка .htaccess

Создайте `/public_html/.htaccess`:

```apache
RewriteEngine On
RewriteRule ^$ http://127.0.0.1:3000/$1 [P,L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ http://127.0.0.1:3000/$1 [P,L]
```

---

## Шаг 7: Проверка

1. **Откройте ваш сайт:** `https://ваш-домен.com`
2. **Проверьте API:** `https://ваш-домен.com/api/health`
3. **Войдите как админ:** `admin@tut.ru` / `admin123`

---

## ⚠️ ВАРИАНТ БЕЗ NODE.JS (если хостинг не поддерживает)

Если на хостинге нет Node.js, есть 2 варианта:

### Вариант A: Статический экспорт Next.js

```bash
cd /Users/ityshenko/Realapp/web

# Обновите next.config.js
module.exports = {
  output: 'export',
  images: {
    unoptimized: true,
  },
}

# Соберите
npm run build

# Загрузите папку /out на хостинг
```

**Минусы:**
- ❌ Нет API routes
- ❌ Нет авторизации
- ❌ Нет базы данных
- ✅ Только статические страницы

### Вариант B: Отдельный backend на PHP

Создайте `/public_html/api/index.php`:

```php
<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$host = 'localhost';
$db = 'username_realapp';
$user = 'username_dbuser';
$pass = 'password';

$pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass);

// Получение списка объявлений
if ($_GET['action'] == 'listings') {
    $stmt = $pdo->query("SELECT * FROM listings WHERE status = 'ACTIVE'");
    $listings = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['listings' => $listings]);
}

// Вход
if ($_POST['action'] == 'login') {
    $data = json_decode(file_get_contents('php://input'), true);
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$data['email']]);
    $user = $stmt->fetch();
    
    if ($user && password_verify($data['password'], $user['password'])) {
        $token = bin2hex(random_bytes(32));
        echo json_encode(['user' => $user, 'token' => $token]);
    } else {
        http_response_code(401);
        echo json_encode(['message' => 'Неверный логин или пароль']);
    }
}
?>
```

**Обновите API_URL в frontend:**
```javascript
// web/src/lib/api.js
const API_URL = '/api';
```

---

## 📊 Сводная таблица

| Метод | Сложность | Возможности | Цена |
|-------|-----------|-------------|------|
| Node.js на хостинге | ⭐⭐⭐ | Полные | $5-10/мес |
| Статический экспорт | ⭐ | Только frontend | $3/мес |
| PHP backend | ⭐⭐ | Ограниченные | $3/мес |

---

## 🆘 Помощь

Если возникли проблемы:

1. **Проверьте логи:**
   - Панель → Error Logs
   - Или файл `/public_html/error.log`

2. **Проверьте Node.js:**
   ```bash
   node --version
   npm --version
   ```

3. **Проверьте подключение к БД:**
   ```bash
   mysql -u username -p
   ```

---

**Готово! 🎉**
