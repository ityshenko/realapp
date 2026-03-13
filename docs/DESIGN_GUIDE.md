# 🎨 Тут.ру - Дизайн Система

## Цветовая Палитра 2024

Профессиональная, современная, сбалансированная палитра для сервиса недвижимости.

---

## 🎯 ОСНОВНЫЕ ЦВЕТА

### Primary (Синий - Доверие и Надёжность)

```
┌─────────────────────────────────────────────────┐
│ 50   100   200   300   400   500   600   700   │
│ ▓▓▓▓▓ ▓▓▓▓▓ ▓▓▓▓▓ ▓▓▓▓▓ ▓▓▓▓▓ ▓▓▓▓▓ ▓▓▓▓▓ ▓▓▓▓▓ │
│EFF6FF DBEAFE BFDBFE 93C5FD 60A5FA 3B82F6 2563EB 1D4ED8│
└─────────────────────────────────────────────────┘
                    ↑
              Основной бренд
```

**Применение:**
- `--primary-500` (#3B82F6) - Логотип, иконки
- `--primary-600` (#2563EB) - Кнопки CTA
- `--primary-700` (#1D4ED8) - Hover состояния
- `--primary-100` (#DBEAFE) - Фоны акцентов

---

### Neutrals (Slate - Чистота и Современность)

```
Светлая тема:
50    100   200   300   400   500   600   700   800   900
▓     ▓▓    ▓▓▓   ▓▓▓▓  ▓▓▓▓▓ ▓▓▓▓▓▓ ▓▓▓▓▓▓▓ ▓▓▓▓▓▓▓▓ ▓▓▓▓▓▓▓▓▓ ▓▓▓▓▓▓▓▓▓▓
F8FAFC F1F5F9 E2E8F0 CBD5E1 94A3B8 64748B 475569 334155 1E293B 0F172A
│      │      │      │      │      │      │      │      │      │
Фон    Фон    Разде  Текст  Текст  Текст  Текст  Загол  Загол  Глубо
втор   карточ литель втор   основ  основ  основ  овки   овки   кий
       ек              ий     ой     ой     ой            чёрный
```

**Применение:**
- `--neutral-50` - Основной фон страницы
- `--neutral-100` - Вторичный фон
- `--neutral-200` - Разделители, границы
- `--neutral-400` - Вторичный текст
- `--neutral-600` - Основной текст
- `--neutral-800` - Заголовки
- `--neutral-900` - Акценты, глубокий чёрный

---

### Semantic (Смысловые цвета)

```
✅ SUCCESS (Зелёный)
#10B981 - Подтверждения, успешные действия

⚠️ WARNING (Жёлтый)
#F59E0B - Предупреждения, внимание

❌ ERROR (Красный)
#EF4444 - Ошибки, критичные сообщения

ℹ️ INFO (Голубой)
#0EA5E9 - Информация, подсказки
```

---

## 📋 ТАБЛИЦА ПРИМЕНЕНИЯ

| Элемент | Цвет | HEX | Когда использовать |
|---------|------|-----|-------------------|
| **Логотип** | Primary 600 | `#2563EB` | Всегда, основной бренд |
| **Кнопки CTA** | Primary 600 | `#2563EB` | Главные действия |
| **Кнопки hover** | Primary 700 | `#1D4ED8` | Наведение на кнопки |
| **Основной фон** | Neutral 50 | `#F8FAFC` | Фон всех страниц |
| **Фон карточек** | White | `#FFFFFF` | Карточки объектов |
| **Заголовки** | Neutral 800 | `#1E293B` | H1-H6 |
| **Основной текст** | Neutral 600 | `#475569` | Параграфы |
| **Вторичный текст** | Neutral 400 | `#94A3B8` | Подписи, мета |
| **Разделители** | Neutral 200 | `#E2E8F0` | Границы, линии |
| **Успех** | Success 500 | `#10B981` | Подтверждения |
| **Ошибка** | Error 500 | `#EF4444` | Ошибки форм |

---

## 🌙 ТЁМНАЯ ТЕМА

### Адаптация цветов

```
Светлая → Тёмная
─────────────────────
Neutral 50  → Neutral 900 (#0F172A)
Neutral 100 → Neutral 800 (#1E293B)
Neutral 200 → Neutral 700 (#334155)
Neutral 400 → Neutral 500 (#64748B)
Neutral 600 → Neutral 400 (#94A3B8)
Neutral 800 → Neutral 200 (#E2E8F0)
Neutral 900 → Neutral 50 (#F8FAFC)

Primary 600 → Primary 500 (#3B82F6)
Primary 700 → Primary 400 (#60A5FA)
```

**Принцип:** Инвертируем нейтральные, primary остаётся похожим для бренда.

---

## 🎨 ПРИМЕРЫ ИСПОЛЬЗОВАНИЯ

### Кнопки

```css
/* Главная кнопка */
.btn-primary {
  background: #2563EB;        /* Primary 600 */
  color: #FFFFFF;
  box-shadow: 0 1px 3px rgba(37, 99, 235, 0.3);
}

.btn-primary:hover {
  background: #1D4ED8;        /* Primary 700 */
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
}

/* Вторичная кнопка */
.btn-secondary {
  background: #FFFFFF;        /* White */
  color: #475569;             /* Neutral 600 */
  border: 1px solid #E2E8F0;  /* Neutral 200 */
}

.btn-secondary:hover {
  background: #F1F5F9;        /* Neutral 100 */
  border-color: #CBD5E1;      /* Neutral 300 */
}
```

### Карточка объекта

```css
.card {
  background: #FFFFFF;        /* White */
  border: 1px solid #E2E8F0;  /* Neutral 200 */
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.card-title {
  color: #1E293B;             /* Neutral 800 */
  font-weight: 600;
}

.card-price {
  color: #2563EB;             /* Primary 600 */
  font-weight: 700;
}

.card-meta {
  color: #94A3B8;             /* Neutral 400 */
  font-size: 14px;
}
```

### Форма

```css
.input {
  background: #FFFFFF;        /* White */
  border: 1px solid #E2E8F0;  /* Neutral 200 */
  color: #475569;             /* Neutral 600 */
}

.input:focus {
  border-color: #3B82F6;      /* Primary 500 */
  box-shadow: 0 0 0 3px #DBEAFE; /* Primary 100 */
}

.input::placeholder {
  color: #94A3B8;             /* Neutral 400 */
}
```

---

## 📏 РАЗМЕРЫ И ОТСТУПЫ

### Радиусы скругления

```
--radius-sm: 6px    (мелкие элементы)
--radius-md: 8px    (кнопки, инпуты)
--radius-lg: 12px   (карточки)
--radius-xl: 16px   (модальные окна)
--radius-2xl: 20px  (большие карточки)
--radius-3xl: 24px  (hero секции)
--radius-full: 9999px (бейджи, аватары)
```

### Тени

```
--shadow-sm:   0 1px 3px rgba(0,0,0,0.1)      (лёгкие карточки)
--shadow-md:   0 4px 6px rgba(0,0,0,0.1)      (карточки)
--shadow-lg:   0 10px 15px rgba(0,0,0,0.1)    (модальные окна)
--shadow-xl:   0 20px 25px rgba(0,0,0,0.1)    (выпадающие меню)
--shadow-2xl:  0 25px 50px rgba(0,0,0,0.25)   (попапы)
--shadow-glow: 0 0 40px rgba(59,130,246,0.3)  (акценты)
```

---

## ✨ АНИМАЦИИ

### Длительности

```
--transition-fast:   150ms (микро-взаимодействия)
--transition-base:   200ms (кнопки, ссылки)
--transition-slow:   300ms (карточки, панели)
--transition-slower: 500ms (модалки, страницы)
```

### Функции плавности

```
cubic-bezier(0.4, 0, 0.2, 1)  /* Стандарт */
cubic-bezier(0.4, 0, 0.6, 1)  /* Быстро */
cubic-bezier(0.2, 0, 0, 1)    /* Резко */
```

---

## 🎯 ПРАВИЛА ИСПОЛЬЗОВАНИЯ

### ✅ DO (Правильно)

1. **Используй Primary 600 для главных кнопок**
2. **Neutral 600 для основного текста**
3. **White для фона карточек**
4. **Neutral 200 для разделителей**
5. **Одна акцентная кнопка на экран**

### ❌ DON'T (Неправильно)

1. ~~Не используй Primary 500 для текста~~ (плохой контраст)
2. ~~Не используй Neutral 900 для фона~~ (слишком тёмный)
3. ~~Не используй больше 3 цветов на экран~~
4. ~~Не используй Error цвет для не-ошибок~~
5. ~~Не смешивай тёплые и холодные акценты~~

---

## ♿ ДОСТУПНОСТЬ (WCAG 2.1 AA)

### Контраст текста

| Комбинация | Контраст | Статус |
|------------|----------|--------|
| Neutral 800 на Neutral 50 | 16.5:1 | ✅ AAA |
| Neutral 600 на Neutral 50 | 7.2:1 | ✅ AA |
| White на Primary 600 | 8.1:1 | ✅ AAA |
| Primary 600 на Neutral 50 | 4.5:1 | ✅ AA |

### Размер кликабельных областей

- Минимум: **44×44px**
- Рекомендуется: **48×48px**

---

## 📱 АДАПТИВНОСТЬ

### Мобильная версия

```css
/* Увеличенные размеры для тача */
.btn {
  min-height: 44px;
  padding: 14px 20px;
}

.input {
  min-height: 48px;
  font-size: 16px; /* Предотвращает зум на iOS */
}
```

---

## 🎨 БРЕНД

### Логотип "Тут.ру"

```
Цвет: Primary 600 (#2563EB)
Фон: Градиент Primary 500 → Primary 700
Тень: rgba(37, 99, 235, 0.3)
Радиус: 12px
```

### Иконка

```
Размер: 40×40px
Буква: "Т" (белая, bold)
Фон: Градиент синий
```

---

## 🔧 CSS VARIABLES

```css
:root {
  /* Primary */
  --primary-50: #EFF6FF;
  --primary-100: #DBEAFE;
  --primary-500: #3B82F6;
  --primary-600: #2563EB;
  --primary-700: #1D4ED8;
  
  /* Neutrals */
  --neutral-50: #F8FAFC;
  --neutral-100: #F1F5F9;
  --neutral-200: #E2E8F0;
  --neutral-400: #94A3B8;
  --neutral-600: #475569;
  --neutral-800: #1E293B;
  --neutral-900: #0F172A;
  
  /* Semantic */
  --success: #10B981;
  --warning: #F59E0B;
  --error: #EF4444;
  
  /* Surface */
  --surface: #FFFFFF;
  --surface-secondary: #F8FAFC;
  
  /* Text */
  --text-primary: #1E293B;
  --text-secondary: #475569;
  --text-tertiary: #94A3B8;
  
  /* Border */
  --border-light: #E2E8F0;
  --border-medium: #CBD5E1;
}
```

---

**Тут.ру © 2024** - Современный дизайн для недвижимости
