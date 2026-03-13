#!/bin/bash

# ============================================
# Скрипт для деплоя на link-host.net
# ============================================

# Настройки
FTP_HOST="ваш-домен.com"
FTP_USER="ваш_логин"
FTP_PASS="ваш_пароль"
FTP_DIR="/public_html"

echo "🚀 Начало деплоя на link-host.net..."

# 1. Сборка frontend
echo "📦 Сборка frontend..."
cd web
npm run build
cd ..

# 2. Создание папки deploy
echo "📁 Создание папки deploy..."
rm -rf deploy
mkdir -p deploy

# 3. Копирование файлов
echo "📋 Копирование файлов..."
cp -r web/.next deploy/.next
cp -r web/public deploy/public
cp web/package.json deploy/
cp web/next.config.js deploy/
cp -r backend/src deploy/backend
cp backend/package.json deploy/backend-package.json
cp -r backend/prisma deploy/prisma
cp .env.example deploy/.env

# 4. Создание server.js
echo "📝 Создание server.js..."
cat > deploy/server.js << 'EOF'
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const express = require('express');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, dir: path.join(__dirname, '.') });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  
  // API routes
  if (process.env.NODE_ENV === 'production') {
    process.chdir(path.join(__dirname, 'backend'));
    const apiApp = require('./backend/index.js');
    server.use('/api', apiApp);
  }
  
  server.all('*', (req, res) => {
    return handle(req, res);
  });
  
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, '0.0.0.0', (err) => {
    if (err) throw err;
    console.log(`> Ready on http://0.0.0.0:${PORT}`);
  });
});
EOF

# 5. Создание .htaccess
echo "📝 Создание .htaccess..."
cat > deploy/.htaccess << 'EOF'
RewriteEngine On
RewriteRule ^$ http://127.0.0.1:3000/$1 [P,L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ http://127.0.0.1:3000/$1 [P,L]
EOF

# 6. Создание package.json для хостинга
echo "📝 Создание package.json..."
cat > deploy/package.json << 'EOF'
{
  "name": "realapp-hosting",
  "version": "1.0.0",
  "scripts": {
    "start": "node server.js",
    "build": "next build"
  },
  "dependencies": {
    "next": "14.0.4",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "express": "^4.18.2",
    "@prisma/client": "^5.7.1",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.1.5"
  },
  "devDependencies": {
    "prisma": "^5.7.1"
  }
}
EOF

# 7. Отправка на хостинг через lftp (если установлен)
if command -v lftp &> /dev/null; then
    echo "📤 Загрузка на хостинг через lftp..."
    lftp -c "
        set ftp:ssl-allow no;
        open ftp://$FTP_USER:$FTP_PASS@$FTP_HOST;
        mirror --reverse --delete --verbose deploy $FTP_DIR;
        bye;
    "
else
    echo "⚠️ lftp не установлен. Загрузите файлы через FTP вручную:"
    echo "   Папка: deploy/"
    echo "   Загрузить в: $FTP_DIR"
    echo ""
    echo "   Установить lftp: brew install lftp (macOS) или sudo apt-get install lftp (Ubuntu)"
fi

echo ""
echo "✅ Деплой завершен!"
echo ""
echo "📋 Следующие шаги:"
echo "1. Зайдите в панель хостинга"
echo "2. Node.js Selector → Create Application"
echo "3. Укажите:"
echo "   - Application root: $FTP_DIR"
echo "   - Startup file: server.js"
echo "   - Port: 3000"
echo "4. Добавьте переменные окружения в .env:"
echo "   DATABASE_URL=mysql://user:pass@localhost/database"
echo "   JWT_SECRET=your_secret"
echo "   NODE_ENV=production"
echo "5. В терминале хостинга выполните:"
echo "   cd $FTP_DIR"
echo "   npm install --production"
echo "   npx prisma generate"
echo "   npx prisma migrate deploy"
echo ""
