const fs = require('fs');
const path = require('path');

const listingsDir = path.join(__dirname, 'public/uploads/listings');

// Real photos from Pexels (free stock). We download and embed them as base64 in SVG
// so the site works without hotlinking and without requiring backend to proxy remote images.
const PHOTO_POOLS = {
  apartment: [
    'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?w=800&h=600&auto=compress&cs=tinysrgb',
    'https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?w=800&h=600&auto=compress&cs=tinysrgb',
    'https://images.pexels.com/photos/2082087/pexels-photo-2082087.jpeg?w=800&h=600&auto=compress&cs=tinysrgb',
    'https://images.pexels.com/photos/1571470/pexels-photo-1571470.jpeg?w=800&h=600&auto=compress&cs=tinysrgb',
  ],
  house: [
    'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?w=800&h=600&auto=compress&cs=tinysrgb',
    'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?w=800&h=600&auto=compress&cs=tinysrgb',
    'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?w=800&h=600&auto=compress&cs=tinysrgb',
    'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?w=800&h=600&auto=compress&cs=tinysrgb',
  ],
  land: [
    'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?w=800&h=600&auto=compress&cs=tinysrgb',
    'https://images.pexels.com/photos/1671324/pexels-photo-1671324.jpeg?w=800&h=600&auto=compress&cs=tinysrgb',
    'https://images.pexels.com/photos/1172064/pexels-photo-1172064.jpeg?w=800&h=600&auto=compress&cs=tinysrgb',
    'https://images.pexels.com/photos/440731/pexels-photo-440731.jpeg?w=800&h=600&auto=compress&cs=tinysrgb',
  ],
  commercial: [
    'https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg?w=800&h=600&auto=compress&cs=tinysrgb',
    'https://images.pexels.com/photos/37347/office-sitting-room-executive-sitting.jpg?w=800&h=600&auto=compress&cs=tinysrgb',
    'https://images.pexels.com/photos/3968056/pexels-photo-3968056.jpeg?w=800&h=600&auto=compress&cs=tinysrgb',
  ],
};

const TARGET_FILES = [
  'apartment-1.svg',
  'apartment-2.svg',
  'apartment-cozy-2.svg',
  'apartment-cozy.svg',
  'apartment-luxury-1.svg',
  'apartment-luxury.svg',
  'apartment-modern.svg',
  'apartment-studio-3.svg',
  'category-apartments.svg',
  'category-commercial.svg',
  'category-houses.svg',
  'category-land.svg',
  'house-1.svg',
  'house-2.svg',
  'house-cottage-1.svg',
  'house-cottage.svg',
  'house-exterior.svg',
  'house-modern-2.svg',
  'house-modern.svg',
  'house-villa-3.svg',
  'land-1.svg',
  'land-2.svg',
  'land-commercial.svg',
  'land-field.svg',
  'land-green.svg',
  'land-plot-1.svg',
  'land-plot-2.svg',
];

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

async function fetchAsBase64(url) {
  const res = await fetch(url, {
    headers: {
      // Some CDNs behave better with a UA.
      'User-Agent': 'RealappImageFetcher/1.0',
      'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
    },
    redirect: 'follow',
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  return buf.toString('base64');
}

function pickPool(filename) {
  if (filename.startsWith('category-commercial')) return 'commercial';
  if (filename.startsWith('category-apartments')) return 'apartment';
  if (filename.startsWith('category-houses')) return 'house';
  if (filename.startsWith('category-land')) return 'land';
  if (filename.startsWith('apartment-')) return 'apartment';
  if (filename.startsWith('house-')) return 'house';
  if (filename.startsWith('land-commercial')) return 'commercial';
  if (filename.startsWith('land-')) return 'land';
  return 'apartment';
}

function poolIndex(filename, poolLength) {
  // Stable distribution based on filename.
  let hash = 0;
  for (let i = 0; i < filename.length; i++) hash = (hash * 31 + filename.charCodeAt(i)) >>> 0;
  return hash % poolLength;
}

async function main() {
  ensureDir(listingsDir);

  // Cache downloads so multiple files can reuse the same photo without re-fetching.
  const base64Cache = new Map();

  for (const filename of TARGET_FILES) {
    const poolName = pickPool(filename);
    const pool = PHOTO_POOLS[poolName] || PHOTO_POOLS.apartment;
    const imageUrl = pool[poolIndex(filename, pool.length)];

    let base64 = base64Cache.get(imageUrl);
    if (!base64) {
      base64 = await fetchAsBase64(imageUrl);
      base64Cache.set(imageUrl, base64);
    }

    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
  <image href="data:image/jpeg;base64,${base64}" width="800" height="600" preserveAspectRatio="xMidYMid slice"/>
</svg>`;

    fs.writeFileSync(path.join(listingsDir, filename), svg);
    console.log(`✓ ${filename} (${poolName})`);
  }

  console.log(`\n✅ Создано ${TARGET_FILES.length} файлов с локально встроенными фото!`);
}

main().catch((err) => {
  console.error('❌ Ошибка генерации фото:', err);
  process.exitCode = 1;
});
