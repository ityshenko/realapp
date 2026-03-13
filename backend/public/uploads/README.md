# Хранилище изображений

Изображения хранятся в следующих папках:

## /listings/
Фотографии объявлений о недвижимости.
- Форматы: jpeg, jpg, png, gif, webp, svg
- Максимальный размер: 5MB
- Имена файлов генерируются автоматически: `{timestamp}-{random}-{original_name}`

## /avatars/
Аватарки пользователей.
- Те же требования к форматам и размеру

## Доступ к изображениям

Изображения доступны по URL:
```
http://localhost:5000/uploads/listings/{filename}
http://localhost:5000/uploads/avatars/{filename}
```

## Загрузка изображений

Для загрузки изображений используйте multipart/form-data с полем:
- `photos` - для объявлений (массив файлов, макс. 20)
- `avatar` - для аватарок пользователей

Пример через FormData:
```javascript
const formData = new FormData();
formData.append('photos', fileInput.files[0]);
formData.append('photos', fileInput.files[1]);
// ...

fetch('http://localhost:5000/api/listings', {
  method: 'POST',
  body: formData,
  headers: {
    'Authorization': 'Bearer {token}'
  }
});
```
