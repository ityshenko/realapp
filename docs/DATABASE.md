# RealApp - Database Schema Documentation

## Overview

This document describes the PostgreSQL database schema for the RealApp real estate marketplace.

## Tables

### users

Хранит информацию о пользователях системы.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | VARCHAR(100) | Имя пользователя |
| phone | VARCHAR(20) | Уникальный телефон |
| email | VARCHAR(255) | Уникальный email |
| password_hash | VARCHAR(255) | Хешированный пароль |
| role | VARCHAR(20) | Роль: user, owner, admin |
| avatar_url | TEXT | URL аватара |
| rating | DECIMAL(3,2) | Рейтинг (0-5) |
| reviews_count | INTEGER | Количество отзывов |
| is_verified | BOOLEAN | Верифицирован |
| is_blocked | BOOLEAN | Заблокирован |
| created_at | TIMESTAMP | Дата создания |
| updated_at | TIMESTAMP | Дата обновления |

### districts

Районы Донецка.

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| name | VARCHAR(100) | Название на украинском |
| name_ru | VARCHAR(100) | Название на русском |
| bounds | JSONB | Границы района |
| center_lat | DECIMAL(10,8) | Широта центра |
| center_lng | DECIMAL(11,8) | Долгота центра |

### listings

Объявления о недвижимости.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| title | VARCHAR(255) | Заголовок |
| description | TEXT | Описание |
| price | DECIMAL(12,2) | Цена |
| currency | VARCHAR(3) | Валюта (RUB) |
| property_type | VARCHAR(20) | apartment, house, land |
| deal_type | VARCHAR(20) | rent, sale |
| rooms | INTEGER | Количество комнат |
| area | DECIMAL(10,2) | Общая площадь |
| living_area | DECIMAL(10,2) | Жилая площадь |
| kitchen_area | DECIMAL(10,2) | Площадь кухни |
| floor | INTEGER | Этаж |
| total_floors | INTEGER | Всего этажей |
| address | VARCHAR(255) | Адрес |
| district_id | INTEGER | FK на districts |
| lat | DECIMAL(10,8) | Широта |
| lng | DECIMAL(11,8) | Долгота |
| user_id | UUID | FK на users (владелец) |
| has_furniture | BOOLEAN | С мебелью |
| has_parking | BOOLEAN | Есть парковка |
| has_elevator | BOOLEAN | Есть лифт |
| has_balcony | BOOLEAN | Есть балкон |
| is_new_building | BOOLEAN | Новостройка |
| pets_allowed | BOOLEAN | Можно с животными |
| status | VARCHAR(20) | active, inactive, sold, etc. |
| is_featured | BOOLEAN | VIP объявление |
| is_top | BOOLEAN | Закреплено в топе |
| is_recommended | BOOLEAN | В рекомендуемых |
| highlight_color | VARCHAR(7) | Цвет выделения |
| views_count | INTEGER | Количество просмотров |
| favorites_count | INTEGER | В избранном |
| contacts_shown | INTEGER | Показов контактов |
| created_at | TIMESTAMP | Дата создания |
| published_at | TIMESTAMP | Дата публикации |

### photos

Фотографии объявлений.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| listing_id | UUID | FK на listings |
| url | TEXT | URL фотографии |
| thumbnail_url | TEXT | URL миниатюры |
| order_index | INTEGER | Порядок сортировки |
| is_primary | BOOLEAN | Главное фото |
| created_at | TIMESTAMP | Дата загрузки |

### conversations

Диалоги между пользователями.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| participant1_id | UUID | FK на users |
| participant2_id | UUID | FK на users |
| listing_id | UUID | FK на listings (опционально) |
| last_message | TEXT | Последнее сообщение |
| last_message_at | TIMESTAMP | Время последнего сообщения |
| participant1_unread_count | INTEGER | Непрочитанные у 1 |
| participant2_unread_count | INTEGER | Непрочитанные у 2 |
| created_at | TIMESTAMP | Дата создания |
| updated_at | TIMESTAMP | Дата обновления |

### messages

Сообщения в чате.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| conversation_id | UUID | FK на conversations |
| sender_id | UUID | FK на users |
| text | TEXT | Текст сообщения |
| image_url | TEXT | URL изображения |
| is_read | BOOLEAN | Прочитано |
| read_at | TIMESTAMP | Время прочтения |
| created_at | TIMESTAMP | Дата создания |

### favorites

Избранные объявления.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | FK на users |
| listing_id | UUID | FK на listings |
| created_at | TIMESTAMP | Дата добавления |

### promotions

Платное продвижение.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| listing_id | UUID | FK на listings |
| user_id | UUID | FK на users |
| type | VARCHAR(50) | boost, highlight, top, recommended |
| price | DECIMAL(10,2) | Цена |
| duration_days | INTEGER | Длительность в днях |
| start_date | TIMESTAMP | Дата начала |
| end_date | TIMESTAMP | Дата окончания |
| status | VARCHAR(20) | pending, active, expired |
| payment_id | VARCHAR(255) | ID платежа |
| created_at | TIMESTAMP | Дата создания |

### reviews

Отзывы о пользователях.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| listing_id | UUID | FK на listings (опционально) |
| reviewer_id | UUID | Кто оставил отзыв |
| reviewee_id | UUID | О кого отзыв |
| rating | INTEGER | Оценка 1-5 |
| comment | TEXT | Комментарий |
| created_at | TIMESTAMP | Дата создания |

### notifications

Уведомления пользователей.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | FK на users |
| type | VARCHAR(50) | Тип уведомления |
| title | VARCHAR(255) | Заголовок |
| message | TEXT | Текст |
| data | JSONB | Дополнительные данные |
| is_read | BOOLEAN | Прочитано |
| read_at | TIMESTAMP | Время прочтения |
| created_at | TIMESTAMP | Дата создания |

### price_history

История изменения цен.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| listing_id | UUID | FK на listings |
| old_price | DECIMAL(12,2) | Старая цена |
| new_price | DECIMAL(12,2) | Новая цена |
| changed_at | TIMESTAMP | Дата изменения |

### listing_stats

Ежедневная статистика.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| listing_id | UUID | FK на listings |
| date | DATE | Дата |
| views | INTEGER | Просмотры |
| favorites | INTEGER | В избранном |
| contacts_shown | INTEGER | Показов контактов |

### transactions

Платежные транзакции.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | FK на users |
| amount | DECIMAL(10,2) | Сумма |
| currency | VARCHAR(3) | Валюта |
| type | VARCHAR(50) | Тип транзакции |
| status | VARCHAR(20) | pending, completed, failed |
| payment_method | VARCHAR(50) | Метод оплаты |
| yookassa_payment_id | VARCHAR(255) | ID в ЮKassa |
| description | TEXT | Описание |
| metadata | JSONB | Метаданные |
| created_at | TIMESTAMP | Дата создания |
| completed_at | TIMESTAMP | Дата завершения |

## Indexes

### Performance Indexes

```sql
-- Listings
idx_listings_property_type ON listings(property_type)
idx_listings_deal_type ON listings(deal_type)
idx_listings_price ON listings(price)
idx_listings_district ON listings(district_id)
idx_listings_location ON listings USING GIST (ll_to_earth(lat, lng))
idx_listings_status ON listings(status)
idx_listings_user ON listings(user_id)
idx_listings_created ON listings(created_at DESC)
idx_listings_featured ON listings(is_featured) WHERE is_featured = TRUE
idx_listings_top ON listings(is_top) WHERE is_top = TRUE
idx_listings_recommended ON listings(is_recommended) WHERE is_recommended = TRUE

-- Photos
idx_photos_listing ON photos(listing_id)

-- Favorites
idx_favorites_user ON favorites(user_id)
idx_favorites_listing ON favorites(listing_id)

-- Messages
idx_messages_conversation ON messages(conversation_id)
idx_messages_sender ON messages(sender_id)
idx_messages_created ON messages(created_at DESC)

-- Notifications
idx_notifications_user ON notifications(user_id)
idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = FALSE

-- Users
idx_users_phone ON users(phone)
idx_users_email ON users(email)
```

## Triggers

### update_updated_at_column

Автоматически обновляет `updated_at` при изменении записи.

Применяется к:
- users
- listings
- conversations

### update_user_rating_after_review

Обновляет рейтинг пользователя после добавления отзыва.

## Constraints

### Check Constraints

```sql
-- Price must be non-negative
CONSTRAINT price_check CHECK (price >= 0)

-- Role must be valid
CHECK (role IN ('user', 'owner', 'admin'))

-- Property type must be valid
CHECK (property_type IN ('apartment', 'house', 'land'))

-- Deal type must be valid
CHECK (deal_type IN ('rent', 'sale'))

-- Status must be valid
CHECK (status IN ('active', 'inactive', 'sold', 'rented', 'moderation', 'blocked'))

-- Rating must be 1-5
CHECK (rating >= 1 AND rating <= 5)
```

### Unique Constraints

```sql
users.phone - UNIQUE
users.email - UNIQUE
favorites(user_id, listing_id) - UNIQUE
reviews(reviewer_id, reviewee_id, listing_id) - UNIQUE
listing_stats(listing_id, date) - UNIQUE
```

## Relationships

```
users (1) ──────< listings (M)
users (1) ──────< favorites (M)
users (1) ──────< messages (M)
users (1) ──────< conversations (M)
users (1) ──────< reviews (M)
users (1) ──────< notifications (M)
users (1) ──────< transactions (M)

districts (1) ──< listings (M)

listings (1) ───< photos (M)
listings (1) ───< favorites (M)
listings (1) ───< promotions (M)
listings (1) ───< listing_stats (M)
listings (1) ───< price_history (M)

conversations (1) ──< messages (M)
```
