const fs = require('fs');
const path = require('path');

const listingsDir = path.join(__dirname, 'public/uploads/listings');

// Генерация красивых SVG с градиентами
const images = [
  // Квартиры
  {
    name: 'apartment-luxury-1.svg',
    gradient: ['#FF8C42', '#FF7B2A'],
    icon: '🏢',
    title: 'Квартира',
    subtitle: 'Современная'
  },
  {
    name: 'apartment-cozy-2.svg',
    gradient: ['#4A90D9', '#5B9BD5'],
    icon: '🏠',
    title: 'Квартира',
    subtitle: 'Уютная'
  },
  {
    name: 'apartment-studio-3.svg',
    gradient: ['#9B59B6', '#8E44AD'],
    icon: '🏢',
    title: 'Студия',
    subtitle: 'Комфорт'
  },
  // Дома
  {
    name: 'house-cottage-1.svg',
    gradient: ['#27AE60', '#2ECC71'],
    icon: '🏡',
    title: 'Дом',
    subtitle: 'Загородный'
  },
  {
    name: 'house-modern-2.svg',
    gradient: ['#E74C3C', '#C0392B'],
    icon: '🏠',
    title: 'Коттедж',
    subtitle: 'Премиум'
  },
  {
    name: 'house-villa-3.svg',
    gradient: ['#F39C12', '#E67E22'],
    icon: '🏡',
    title: 'Вилла',
    subtitle: 'Элитная'
  },
  // Участки
  {
    name: 'land-plot-1.svg',
    gradient: ['#1ABC9C', '#16A085'],
    icon: '🌳',
    title: 'Участок',
    subtitle: 'ИЖС 10 соток'
  },
  {
    name: 'land-plot-2.svg',
    gradient: ['#3498DB', '#2980B9'],
    icon: '🏞️',
    title: 'Участок',
    subtitle: '15 соток'
  },
  {
    name: 'land-commercial.svg',
    gradient: ['#95A5A6', '#7F8C8D'],
    icon: '🏗️',
    title: 'Участок',
    subtitle: 'Коммерческий'
  },
];

images.forEach(img => {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad-${img.name}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${img.gradient[0]};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${img.gradient[1]};stop-opacity:1" />
    </linearGradient>
    <filter id="shadow">
      <feDropShadow dx="2" dy="4" stdDeviation="8" flood-opacity="0.3"/>
    </filter>
  </defs>
  
  <!-- Background -->
  <rect width="800" height="600" fill="url(#grad-${img.name})"/>
  
  <!-- Decorative circles -->
  <circle cx="600" cy="100" r="150" fill="rgba(255,255,255,0.1)"/>
  <circle cx="100" cy="500" r="200" fill="rgba(255,255,255,0.05)"/>
  
  <!-- Icon -->
  <text x="50%" y="45%" font-family="Arial, sans-serif" font-size="120" text-anchor="middle" filter="url(#shadow)">${img.icon}</text>
  
  <!-- Title -->
  <text x="50%" y="60%" font-family="Arial, sans-serif" font-size="48" fill="white" text-anchor="middle" font-weight="bold">${img.title}</text>
  
  <!-- Subtitle -->
  <text x="50%" y="68%" font-family="Arial, sans-serif" font-size="28" fill="rgba(255,255,255,0.9)" text-anchor="middle">${img.subtitle}</text>
  
  <!-- Watermark -->
  <text x="50%" y="95%" font-family="Arial, sans-serif" font-size="16" fill="rgba(255,255,255,0.5)" text-anchor="middle">Тут.ру Недвижимость</text>
</svg>`;
  
  const filePath = path.join(listingsDir, img.name);
  fs.writeFileSync(filePath, svg);
  console.log(`✓ Создано: ${img.name}`);
});

console.log('\n✅ Готово! Создано', images.length, 'изображений в:', listingsDir);
