const fs = require('fs');
const path = require('path');

const listingsDir = path.join(__dirname, 'public/uploads/listings');

// Изображения для категорий
const categoryImages = [
  {
    name: 'category-apartments.svg',
    gradient: ['#FF8C42', '#FF7B2A'],
    icon: '🏢',
    title: 'Квартиры',
    subtitle: 'От студий до пентхаусов'
  },
  {
    name: 'category-houses.svg',
    gradient: ['#27AE60', '#2ECC71'],
    icon: '🏡',
    title: 'Дома',
    subtitle: 'Частные дома и коттеджи'
  },
  {
    name: 'category-land.svg',
    gradient: ['#1ABC9C', '#16A085'],
    icon: '🌳',
    title: 'Участки',
    subtitle: 'Земля под застройку'
  },
  {
    name: 'category-commercial.svg',
    gradient: ['#34495E', '#2C3E50'],
    icon: '🏪',
    title: 'Коммерция',
    subtitle: 'Офисы, магазины, склады'
  },
];

categoryImages.forEach(img => {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad-${img.name}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${img.gradient[0]};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${img.gradient[1]};stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="url(#grad-${img.name})"/>
  <circle cx="600" cy="100" r="150" fill="rgba(255,255,255,0.1)"/>
  <circle cx="100" cy="500" r="200" fill="rgba(255,255,255,0.05)"/>
  <text x="50%" y="45%" font-family="Arial" font-size="120" text-anchor="middle">🏠</text>
  <text x="50%" y="60%" font-family="Arial" font-size="48" fill="white" text-anchor="middle" font-weight="bold">${img.title}</text>
  <text x="50%" y="68%" font-family="Arial" font-size="24" fill="rgba(255,255,255,0.9)" text-anchor="middle">${img.subtitle}</text>
  <text x="50%" y="95%" font-family="Arial" font-size="16" fill="rgba(255,255,255,0.5)" text-anchor="middle">Тут.ру</text>
</svg>`;
  
  fs.writeFileSync(path.join(listingsDir, img.name), svg);
  console.log(`✓ ${img.name}`);
});

console.log('\n✅ Категорияльные изображения созданы!');
