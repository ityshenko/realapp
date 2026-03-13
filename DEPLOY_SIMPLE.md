# 🚀 ДЕПЛОЙ НА LINK-HOST.NET - БЫСТРАЯ ИНСТРУКЦИЯ

## 5 ПРОСТЫХ ШАГОВ

---

### Шаг 1: Создайте MySQL базу

1. Зайдите в панель хостинга: **https://link-host.net/cpanel**
2. **MySQL Databases** → Создайте базу
3. Запишите:
   - **Имя базы:** `username_realapp`
   - **Пользователь:** `username_user`
   - **Пароль:** (придумайте)
   - **Хост:** `localhost`

---

### Шаг 2: Подготовьте проект

```bash
cd /Users/ityshenko/Realapp

# Сделайте скрипт исполняемым
chmod +x deploy.sh

# Запустите деплой
./deploy.sh
```

---

### Шаг 3: Загрузите файлы на хостинг

**Вариант A: Автоматически (если установлен lftp)**
```bash
# Скрипт загрузит сам
```

**Вариант B: Вручную через FileZilla**

1. Откройте FileZilla
2. Подключитесь к хостингу
3. Загрузите папку `deploy/*` в `/public_html/`

---

### Шаг 4: Настройте Node.js на хостинге

1. В панели хостинга: **Node.js Selector**
2. **Create Application**
3. Заполните:
   - **Node.js version:** 18.x
   - **Application mode:** Production
   - **Application root:** `/public_html`
   - **Application URL:** ваш-домен.com
   - **Startup file:** `server.js`
   - **Port:** 3000

4. **Environment Variables:**
```
DATABASE_URL=mysql://username_user:password@localhost/username_realapp
JWT_SECRET=sekretnaya_stroka_32_simvola_12345
NODE_ENV=production
PORT=3000
```

5. **Create** ✓

---

### Шаг 5: Установите зависимости

1. В панели: **Terminal** или **SSH Access**
2. Выполните:
```bash
cd /home/username/public_html
npm install --production
npx prisma generate
```

---

## ✅ ГОТОВО!

**Откройте сайт:** http://ваш-домен.com

**Вход для админа:**
- Email: `admin@tut.ru`
- Пароль: `admin123`

---

## 🆘 Если не работает

### 1. Проверьте логи
```bash
# В панели хостинга: Error Logs
# Или файл: /public_html/error.log
```

### 2. Проверьте Node.js
```bash
node --version
# Должно быть: v18.x.x
```

### 3. Перезапустите приложение
```bash
# В панели: Node.js Selector → Stop → Start
```

### 4. Проверьте базу данных
```bash
mysql -u username_user -p
# Введите пароль
SHOW DATABASES;
# Должна быть ваша база
```

---

## 📝 Переменные для .env

Создайте файл `/public_html/.env`:

```env
DATABASE_URL="mysql://username_user:password@localhost/username_realapp"
JWT_SECRET="sekretnaya_stroka_32_simvola_12345"
NODE_ENV="production"
PORT="3000"
API_URL="http://localhost:5000"
```

---

## 🎯 Альтернатива (если Node.js не работает)

Если хостинг не поддерживает Node.js, используйте **Vercel**:

```bash
cd /Users/ityshenko/Realapp/web
npx vercel login
npx vercel
```

**Бесплатно, быстро, без настройки!**

Backend тогда разместите на **Railway.app**:
1. Зарегистрируйтесь на railway.app
2. Deploy from GitHub
3. Добавьте MySQL базу
4. Укажите переменные окружения

---

**Вопросы? Пишите! 🎉**
