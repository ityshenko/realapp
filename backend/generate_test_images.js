const fs = require('fs');
const path = require('path');

// Простая генерация PNG изображений (1x1 пиксель растягивается браузером)
// Создадим SVG которые браузер может отображать как изображения

const listingsDir = path.join(__dirname, 'public/uploads/listings');

// Тестовые SVG изображения для объявлений
const testImages = [
  {
    name: 'apartment-1.svg',
    color: 'FF8C42',
    text: 'Квартира 1'
  },
  {
    name: 'apartment-2.svg',
    color: 'FF7B2A',
    text: 'Квартира 2'
  },
  {
    name: 'house-1.svg',
    color: '4A90D9',
    text: 'Дом 1'
  },
  {
    name: 'house-2.svg',
    color: '5B9BD5',
    text: 'Дом 2'
  },
  {
    name: 'land-1.svg',
    color: '70AD47',
    text: 'Участок 1'
  },
  {
    name: 'land-2.svg',
    color: '8BC34A',
    text: 'Участок 2'
  },
];

testImages.forEach(img => {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="600" fill="#${img.color}"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="48" fill="white" text-anchor="middle" dominant-baseline="middle" font-weight="bold">
    ${img.text}
  </text>
</svg>`;
  
  const filePath = path.join(listingsDir, img.name);
  fs.writeFileSync(filePath, svg);
  console.log(`Создано: ${filePath}`);
});

console.log('\nГотово! Тестовые изображения созданы в:', listingsDir);
