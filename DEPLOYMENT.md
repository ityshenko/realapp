# 📦 DEPLOYMENT GUIDE - REALAPP

Пошаговая инструкция по развертыванию сайта недвижимости Тут.ру

---

## 📋 Требования

- **Node.js** >= 18.0.0
- **PostgreSQL** >= 14
- **npm** >= 9

---

## 🚀 БЫСТРЫЙ СТАРТ (Локальная разработка)

### 1. Установка зависимостей

```bash
cd /Users/ityshenko/Realapp
npm install
```

### 2. Настройка базы данных

```bash
# Установите PostgreSQL (если не установлен)
# macOS: brew install postgresql
# Ubuntu: sudo apt-get install postgresql

# Создайте базу данных
psql -U postgres
CREATE DATABASE realapp;
\q

# Скопируйте .env.example в .env
cp .env.example .env

# Отредактируйте .env - укажите ваши данные PostgreSQL
# DATABASE_URL="postgresql://postgres:password@localhost:5432/realapp?schema=public"

# Примените схему базы данных
npm run db:push

# Сгенерируйте Prisma клиент
npm run db:generate
```

### 3. Запуск разработки

```bash
# Запуск frontend + backend одновременно
npm run dev

# Frontend: http://localhost:3000
# Backend: http://localhost:5000
```

---

## 🌐 ДЕПЛОЙ НА VPS (Ubuntu 20.04+)

### 1. Подготовка сервера

```bash
# Подключение к серверу
ssh user@your-server.com

# Обновление системы
sudo apt update && sudo apt upgrade -y

# Установка Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Установка PostgreSQL
sudo apt-get install -y postgresql postgresql-contrib

# Установка PM2 (менеджер процессов)
sudo npm install -g pm2

# Установка Nginx
sudo apt-get install -y nginx
```

### 2. Настройка PostgreSQL

```bash
# Вход в PostgreSQL
sudo -u postgres psql

# Создание пользователя и базы данных
CREATE USER realapp WITH PASSWORD 'your_secure_password';
CREATE DATABASE realapp OWNER realapp;
GRANT ALL PRIVILEGES ON DATABASE realapp TO realapp;
\q

# Разрешить подключения (опционально)
sudo nano /etc/postgresql/14/main/pg_hba.conf
# Добавьте: host all all 0.0.0.0/0 md5

sudo systemctl restart postgresql
```

### 3. Загрузка проекта

```bash
# Создание директории
sudo mkdir -p /var/www/realapp
sudo chown -R $USER:$USER /var/www/realapp

# Копирование файлов (локально)
cd /Users/ityshenko/Realapp
scp -r . user@your-server.com:/var/www/realapp/

# ИЛИ используйте git
cd /var/www/realapp
git clone https://github.com/your-username/realapp.git .
```

### 4. Установка и настройка

```bash
cd /var/www/realapp

# Установка зависимостей
npm install --production

# Создание .env файла
cp .env.example .env
nano .env

# Измените значения:
# DATABASE_URL="postgresql://realapp:your_secure_password@localhost:5432/realapp?schema=public"
# JWT_SECRET="generate_random_string_32_chars"
# NEXTAUTH_SECRET="generate_random_string_32_chars"
# NODE_ENV=production

# Применение схемы БД
npm run db:push
npm run db:generate

# Сборка проекта
npm run build
```

### 5. Запуск через PM2

```bash
# Создание PM2 ecosystem файла
nano ecosystem.config.js
```

```javascript
module.exports = {
  apps: [
    {
      name: 'realapp-backend',
      cwd: '/var/www/realapp/backend',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
      instances: 2,
      exec_mode: 'cluster',
    },
    {
      name: 'realapp-frontend',
      cwd: '/var/www/realapp/web',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};
```

```bash
# Запуск приложений
pm2 start ecosystem.config.js

# Сохранение конфигурации
pm2 save

# Автозапуск при загрузке
pm2 startup
# Выполните команду которую выведет pm2
```

### 6. Настройка Nginx

```bash
sudo nano /etc/nginx/sites-available/realapp
```

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Frontend (Next.js)
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Static files
    location /uploads {
        alias /var/www/realapp/backend/public/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

```bash
# Включение конфигурации
sudo ln -s /etc/nginx/sites-available/realapp /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Настройка firewall
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
```

### 7. Настройка SSL (HTTPS)

```bash
# Установка Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# Получение сертификата
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Автообновление сертификата
sudo certbot renew --dry-run
```

---

## 🔐 БЕЗОПАСНОСТЬ

### 1. Сгенерируйте секретные ключи

```bash
# Для JWT_SECRET
openssl rand -base64 32

# Для NEXTAUTH_SECRET
openssl rand -base64 32
```

### 2. Настройте firewall

```bash
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

### 3. Ограничьте доступ к PostgreSQL

```bash
sudo nano /etc/postgresql/14/main/pg_hba.conf
# Используйте md5 вместо trust
```

---

## 📊 МОНИТОРИНГ

```bash
# Просмотр логов PM2
pm2 logs

# Статус приложений
pm2 status

# Перезапуск приложений
pm2 restart all

# Остановка приложений
pm2 stop all

# Удаление приложений
pm2 delete all
```

---

## 🔄 ОБНОВЛЕНИЕ ПРОЕКТА

```bash
cd /var/www/realapp

# Обновление кода (если используете git)
git pull origin main

# Установка новых зависимостей
npm install

# Применение миграций БД
npm run db:push

# Пересборка
npm run build

# Перезапуск
pm2 restart all
```

---

## 📧 НАСТРОЙКА EMAIL (опционально)

Для уведомления пользователей:

1. Зарегистрируйтесь на [SendGrid](https://sendgrid.com) или используйте Gmail
2. Получите SMTP credentials
3. Добавьте в `.env`:

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your_sendgrid_api_key
```

---

## 💾 БЕКАП БАЗЫ ДАННЫХ

```bash
# Создание бэкапа
pg_dump -U realapp realapp > backup_$(date +%Y%m%d).sql

# Восстановление
psql -U realapp realapp < backup_20240101.sql

# Автоматизация (cron)
crontab -e
# 0 2 * * * pg_dump -U realapp realapp > /backups/realapp_$(date +\%Y\%m\%d).sql
```

---

## ❗ ПРОБЛЕМЫ И РЕШЕНИЯ

### Ошибка: "Cannot connect to database"
```bash
# Проверьте PostgreSQL
sudo systemctl status postgresql

# Проверьте подключение
psql -U realapp -d realapp -h localhost
```

### Ошибка: "Port 3000 already in use"
```bash
# Найдите процесс
lsof -i :3000

# Убейте процесс
kill -9 <PID>
```

### Ошибка: "Prisma Client not generated"
```bash
npm run db:generate
```

---

## 📞 ПОДДЕРЖКА

При возникновении проблем:
1. Проверьте логи: `pm2 logs`
2. Проверьте статус: `pm2 status`
3. Проверьте Nginx: `sudo nginx -t`

---

## ✅ ЧЕКЛИСТ ПЕРЕД ЗАПУСКОМ

- [ ] PostgreSQL установлен и настроен
- [ ] .env файл создан с правильными данными
- [ ] JWT_SECRET и NEXTAUTH_SECRET сгенерированы
- [ ] База данных создана и миграции применены
- [ ] PM2 настроен и приложения запущены
- [ ] Nginx настроен и работает
- [ ] SSL сертификат установлен
- [ ] Firewall настроен
- [ ] Бэкапы настроены

---

**Готово! 🎉 Ваш сайт доступен по адресу: https://your-domain.com**
