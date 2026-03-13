# RealApp - API Documentation

## Base URL

```
Development: http://localhost:5000
Production: https://api.realapp.ru
```

## Authentication

Все защищенные endpoints требуют JWT токен в заголовке:

```
Authorization: Bearer <token>
```

## Response Format

### Success Response

```json
{
  "data": { ... },
  "message": "Success message"
}
```

### Error Response

```json
{
  "error": "Error message",
  "details": { ... }
}
```

---

## Endpoints

### 🔐 Authentication

#### POST /api/auth/register

Регистрация нового пользователя.

**Request Body:**
```json
{
  "name": "Иван Петров",
  "phone": "+79991234567",
  "email": "ivan@example.com",
  "password": "password123",
  "role": "owner"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "name": "Иван Петров",
    "phone": "+79991234567",
    "email": "ivan@example.com",
    "role": "owner"
  },
  "token": "jwt_token",
  "refreshToken": "refresh_token"
}
```

#### POST /api/auth/login

Вход в систему.

**Request Body:**
```json
{
  "phone": "+79991234567",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "name": "Иван Петров",
    "phone": "+79991234567",
    "email": "ivan@example.com",
    "role": "owner",
    "avatarUrl": "https://...",
    "rating": 4.5,
    "isVerified": true
  },
  "token": "jwt_token",
  "refreshToken": "refresh_token"
}
```

#### POST /api/auth/refresh-token

Обновление JWT токена.

**Request Body:**
```json
{
  "refreshToken": "refresh_token"
}
```

**Response (200):**
```json
{
  "token": "new_jwt_token",
  "refreshToken": "new_refresh_token"
}
```

#### GET /api/auth/profile

Получение профиля текущего пользователя.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "name": "Иван Петров",
    "phone": "+79991234567",
    "email": "ivan@example.com",
    "role": "owner",
    "avatarUrl": "https://...",
    "rating": 4.5,
    "reviewsCount": 10,
    "isVerified": true,
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

#### PUT /api/auth/profile

Обновление профиля.

**Request Body:**
```json
{
  "name": "Новое имя",
  "email": "new@example.com"
}
```

---

### 🏠 Listings

#### GET /api/listings

Получение списка объявлений с фильтрами.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| propertyType | string | apartment, house, land |
| dealType | string | rent, sale |
| minPrice | number | Минимальная цена |
| maxPrice | number | Максимальная цена |
| rooms | number | Количество комнат |
| minArea | number | Минимальная площадь |
| maxArea | number | Максимальная площадь |
| district | number | ID района |
| hasFurniture | boolean | С мебелью |
| isNewBuilding | boolean | Новостройка |
| floor | number | Этаж |
| lat | number | Широта для поиска рядом |
| lng | number | Долгота для поиска рядом |
| radius | number | Радиус в км |
| sortBy | string | created_at, price, area, views_count |
| sortOrder | string | asc, desc |
| page | number | Номер страницы |
| limit | number | Количество на странице |

**Response (200):**
```json
{
  "listings": [
    {
      "id": "uuid",
      "title": "2-к квартира в центре",
      "description": "Уютная квартира...",
      "price": 50000,
      "currency": "RUB",
      "propertyType": "apartment",
      "dealType": "rent",
      "rooms": 2,
      "area": 54.5,
      "floor": 3,
      "totalFloors": 9,
      "address": "ул. Пушкина, 10",
      "districtName": "Ворошиловський",
      "districtNameRu": "Ворошиловский",
      "lat": 48.0083,
      "lng": 37.8083,
      "hasFurniture": true,
      "isNewBuilding": false,
      "status": "active",
      "viewsCount": 150,
      "favoritesCount": 25,
      "primaryPhoto": "https://...",
      "photos": [...],
      "ownerName": "Иван Петров",
      "ownerPhone": "+79991234567",
      "ownerRating": 4.5,
      "createdAt": "2024-01-01T00:00:00Z",
      "isFavorite": false,
      "isTop": true,
      "isFeatured": false
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

#### GET /api/listings/:id

Получение деталей объявления.

**Response (200):**
```json
{
  "listing": {
    "id": "uuid",
    "title": "2-к квартира в центре",
    "description": "Уютная квартира с ремонтом...",
    "price": 50000,
    "propertyType": "apartment",
    "dealType": "rent",
    "rooms": 2,
    "area": 54.5,
    "livingArea": 40.0,
    "kitchenArea": 10.0,
    "floor": 3,
    "totalFloors": 9,
    "address": "ул. Пушкина, 10",
    "districtNameRu": "Ворошиловский",
    "lat": 48.0083,
    "lng": 37.8083,
    "hasFurniture": true,
    "hasParking": true,
    "hasElevator": true,
    "hasBalcony": true,
    "isNewBuilding": false,
    "petsAllowed": false,
    "status": "active",
    "viewsCount": 150,
    "favoritesCount": 25,
    "photos": [
      {
        "id": "uuid",
        "url": "https://...",
        "thumbnailUrl": "https://...",
        "orderIndex": 0,
        "isPrimary": true
      }
    ],
    "owner": {
      "id": "uuid",
      "name": "Иван Петров",
      "phone": "+79991234567",
      "rating": 4.5,
      "reviewsCount": 10,
      "isVerified": true,
      "avatarUrl": "https://..."
    },
    "isFavorite": false,
    "createdAt": "2024-01-01T00:00:00Z",
    "publishedAt": "2024-01-01T00:00:00Z"
  }
}
```

#### POST /api/listings

Создание объявления.

**Headers:** 
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Form Data:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | Yes | Заголовок |
| description | string | No | Описание |
| price | number | Yes | Цена |
| propertyType | string | Yes | apartment/house/land |
| dealType | string | Yes | rent/sale |
| rooms | number | No | Комнаты |
| area | number | Yes | Площадь |
| livingArea | number | No | Жилая площадь |
| kitchenArea | number | No | Площадь кухни |
| floor | number | No | Этаж |
| totalFloors | number | No | Всего этажей |
| address | string | No | Адрес |
| districtId | number | No | ID района |
| lat | number | Yes | Широта |
| lng | number | Yes | Долгота |
| hasFurniture | boolean | No | С мебелью |
| hasParking | boolean | No | Парковка |
| hasElevator | boolean | No | Лифт |
| hasBalcony | boolean | No | Балкон |
| isNewBuilding | boolean | No | Новостройка |
| petsAllowed | boolean | No | Можно с животными |
| photos | file[] | No | Фотографии (до 20) |

**Response (201):**
```json
{
  "message": "Listing created successfully",
  "listing": { ... }
}
```

#### PUT /api/listings/:id

Обновление объявления.

**Response (200):**
```json
{
  "message": "Listing updated successfully",
  "listing": { ... }
}
```

#### DELETE /api/listings/:id

Удаление объявления.

**Response (200):**
```json
{
  "message": "Listing deleted successfully"
}
```

#### POST /api/listings/:id/favorite

Добавить/удалить из избранного.

**Response (200):**
```json
{
  "message": "Added to favorites",
  "isFavorite": true
}
```

#### GET /api/listings/favorites

Получение избранных объявлений.

---

### 💬 Messages

#### GET /api/messages

Получение списка конверсаций.

**Response (200):**
```json
{
  "conversations": [
    {
      "id": "uuid",
      "otherUserId": "uuid",
      "otherUserName": "Иван Петров",
      "otherUserAvatar": "https://...",
      "lastMessage": "Здравствуйте, квартира ещё свободна?",
      "lastMessageAt": "2024-01-01T12:00:00Z",
      "unreadCount": 2,
      "listingTitle": "2-к квартира в центре",
      "listingPhoto": "https://..."
    }
  ]
}
```

#### POST /api/messages/conversation

Создать или найти конверсацию.

**Request Body:**
```json
{
  "userId": "uuid",
  "listingId": "uuid"
}
```

**Response (200/201):**
```json
{
  "conversation": { ... },
  "created": false
}
```

#### GET /api/messages/:conversationId/messages

Получение сообщений конверсации.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Номер страницы |
| limit | number | Количество сообщений |

**Response (200):**
```json
{
  "messages": [
    {
      "id": "uuid",
      "conversationId": "uuid",
      "senderId": "uuid",
      "text": "Здравствуйте!",
      "imageUrl": null,
      "isRead": true,
      "readAt": "2024-01-01T12:00:00Z",
      "createdAt": "2024-01-01T12:00:00Z",
      "senderName": "Иван Петров",
      "senderAvatar": "https://..."
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50
  }
}
```

#### POST /api/messages/send

Отправить сообщение.

**Request Body:**
```json
{
  "conversationId": "uuid",
  "text": "Здравствуйте!",
  "imageUrl": "https://..."
}
```

**Response (201):**
```json
{
  "message": { ... }
}
```

#### PUT /api/messages/:conversationId/read

Отметить конверсацию как прочитанную.

---

### 💰 Promotions

#### GET /api/promotions/available

Получение доступных типов продвижения.

**Response (200):**
```json
{
  "promotions": [
    {
      "type": "boost",
      "name": "Поднять в поиске",
      "description": "Ваше объявление будет показываться выше",
      "price": 10,
      "unit": "день"
    },
    {
      "type": "highlight",
      "name": "Выделить цветом",
      "price": 10,
      "unit": "день"
    },
    {
      "type": "top",
      "name": "Закрепить в топе",
      "price": 20,
      "unit": "день"
    },
    {
      "type": "recommended",
      "name": "Рекомендуемые",
      "price": 25,
      "unit": "день"
    }
  ]
}
```

#### POST /api/promotions

Создать продвижение.

**Request Body:**
```json
{
  "listingId": "uuid",
  "type": "boost",
  "durationDays": 7
}
```

**Response (201):**
```json
{
  "promotion": { ... },
  "totalPrice": 70,
  "message": "Promotion created. Please complete payment to activate."
}
```

#### POST /api/promotions/payment

Создать платеж за продвижение.

**Request Body:**
```json
{
  "promotionId": "uuid",
  "method": "bank_card"
}
```

**Response (200):**
```json
{
  "payment": {
    "id": "payment_uuid",
    "amount": 70,
    "currency": "RUB",
    "confirmationUrl": "https://yookassa.ru/...",
    "method": "bank_card"
  },
  "transaction": { ... }
}
```

---

### 📊 Statistics

#### GET /api/stats/dashboard

Получение статистики дашборда владельца.

**Response (200):**
```json
{
  "listings": {
    "total": 10,
    "active": 8,
    "inactive": 2,
    "completed": 5
  },
  "views": {
    "views": 1500
  },
  "promotions": {
    "count": 3,
    "spent": 500
  },
  "messages": {
    "unread": 5
  }
}
```

#### GET /api/stats/listing/:id

Статистика конкретного объявления.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| days | number | Количество дней (default: 30) |

**Response (200):**
```json
{
  "dailyStats": [
    {
      "date": "2024-01-01",
      "views": 50,
      "favorites": 5,
      "contactsShown": 10
    }
  ],
  "totalStats": {
    "totalViews": 1500,
    "totalFavorites": 150,
    "totalContacts": 300
  }
}
```

---

### 👤 Users

#### GET /api/users/:id

Получение публичного профиля пользователя.

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "name": "Иван Петров",
    "phone": "+79991234567",
    "email": "ivan@example.com",
    "role": "owner",
    "avatarUrl": "https://...",
    "rating": 4.5,
    "reviewsCount": 10,
    "isVerified": true,
    "activeListings": 5,
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

#### GET /api/users/:id/reviews

Получение отзывов о пользователе.

#### POST /api/users/reviews

Оставить отзыв.

**Request Body:**
```json
{
  "revieweeId": "uuid",
  "listingId": "uuid",
  "rating": 5,
  "comment": "Отличный арендодатель!"
}
```

---

### 🔔 Notifications

#### GET /api/notifications

Получение уведомлений.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Номер страницы |
| limit | number | Количество |
| unreadOnly | boolean | Только непрочитанные |

**Response (200):**
```json
{
  "notifications": [
    {
      "id": "uuid",
      "type": "price_change",
      "title": "Цена изменена",
      "message": "Цена на недвижимость изменилась",
      "data": {
        "listingId": "uuid",
        "newPrice": 45000
      },
      "isRead": false,
      "createdAt": "2024-01-01T12:00:00Z"
    }
  ],
  "pagination": { ... }
}
```

#### PUT /api/notifications/:id/read

Отметить уведомление как прочитанное.

#### PUT /api/notifications/read-all

Отметить все уведомления как прочитанные.

#### GET /api/notifications/unread/count

Получить количество непрочитанных уведомлений.

---

### 🛡️ Admin (требуется роль admin)

#### GET /api/admin/users

Получение всех пользователей.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Номер страницы |
| limit | number | Количество |
| role | string | Фильтр по роли |
| isBlocked | boolean | Фильтр по статусу |

#### PUT /api/admin/users/:id/block

Заблокировать/разблокировать пользователя.

**Request Body:**
```json
{
  "isBlocked": true
}
```

#### GET /api/admin/listings

Получение всех объявлений.

#### PUT /api/admin/listings/:id/status

Изменить статус объявления.

**Request Body:**
```json
{
  "status": "blocked"
}
```

#### DELETE /api/admin/listings/:id

Удалить объявление.

#### GET /api/admin/stats

Статистика платформы.

**Response (200):**
```json
{
  "users": {
    "total": 1000,
    "owners": 200,
    "users": 800,
    "blocked": 10
  },
  "listings": {
    "total": 500,
    "active": 400,
    "rent": 250,
    "sale": 150
  },
  "revenue": {
    "total": 50000,
    "completed": 45000
  },
  "promotions": {
    "count": 50,
    "revenue": 10000
  }
}
```

#### GET /api/admin/activity

Последняя активность на платформе.

---

## WebSocket Events

### Client → Server

```javascript
// Join conversation room
socket.emit('conversation:join', conversationId);

// Leave conversation room
socket.emit('conversation:leave', conversationId);

// Typing indicator
socket.emit('typing:start', { conversationId });
socket.emit('typing:stop', { conversationId });

// Send message
socket.emit('message:send', { conversationId, text, imageUrl });

// Mark messages as read
socket.emit('messages:read', { conversationId });

// Mark notification as read
socket.emit('notification:read', { notificationId });
```

### Server → Client

```javascript
// New message received
socket.on('message:new', { conversationId, message, senderId });

// Message sent confirmation
socket.on('message:sent', message);

// User started typing
socket.on('typing:started', { userId, conversationId });

// User stopped typing
socket.on('typing:stopped', { userId, conversationId });

// Messages marked as read
socket.on('messages:read', { userId, conversationId });
```

---

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Invalid/missing token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found |
| 409 | Conflict - Resource already exists |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |

## Rate Limiting

- 100 requests per 15 minutes per IP
- 1000 requests per hour per authenticated user

---

**RealApp API © 2024**
