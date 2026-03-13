'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/Header';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';


// Генерация SVG заглушки
const getPlaceholderImage = (type: string = 'Квартира') => {
  const colors: Record<string, string> = {
    'Квартира': 'FF8C42',
    'Дом': '4A90D9',
    'Участок': '70AD47',
  };
  const color = colors[type] || 'FF8C42';
  
  const svg = `
    <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
      <rect width="800" height="600" fill="#${color}"/>
      <text x="50%" y="50%" font-family="Arial" font-size="48" fill="white" text-anchor="middle" dominant-baseline="middle" font-weight="bold">
        ${type}
      </text>
    </svg>
  `.trim();
  
  return `data:image/svg+xml,${encodeURIComponent(svg).replace(/'/g, '%27').replace(/"/g, '%22')}`;
};

const LISTING_DATA = {
  id: '1',
  title: '2-к квартира в центре Донецка',
  description: `Продаётся просторная 2-комнатная квартира в самом центре Донецка. 

Преимущества:
• Панорамные окна с видом на центр
• Качественный европейский ремонт
• Встроенная кухня и техника
• Кондиционер в каждой комнате
• Подземный паркинг
• Закрытая территория

Дом расположен в тихом дворе, рядом школы, детские сады, торговые центры. Отличная транспортная развязка.

Идеальный вариант как для проживания, так и для сдачи в аренду.`,
  price: 4500000,
  currency: 'RUB',
  propertyType: 'apartment' as const,
  dealType: 'sale' as const,
  rooms: 2,
  area: 54,
  livingArea: 40,
  kitchenArea: 10,
  floor: 3,
  totalFloors: 9,
  address: 'пр. Пушкина, 10, Донецк',
  districtNameRu: 'Ворошиловский',
  lat: 48.0083,
  lng: 37.8083,
  hasFurniture: true,
  hasParking: true,
  hasElevator: true,
  hasBalcony: true,
  isNewBuilding: false,
  petsAllowed: false,
  status: 'active',
  viewsCount: 150,
  favoritesCount: 25,
  photos: [
    '/uploads/listings/apartment-1.jpg','/uploads/listings/apartment-2.jpg','/uploads/listings/apartment-modern.jpg','/uploads/listings/apartment-luxury.jpg','/uploads/listings/apartment-cozy.jpg',],
  owner: {
    id: 'owner1',
    name: 'Иван Петров',
    phone: '+7 (999) 123-45-67',
    rating: 4.5,
    reviewsCount: 12,
    isVerified: true,
    avatar: '/uploads/listings/apartment-1.jpg',memberSince: '2023',
  },
  features: [
    'С мебелью',
    'Парковка',
    'Лифт',
    'Балкон',
    'Кондиционер',
    'Домофон',
    'Металлическая дверь',
    'Пластиковые окна',
  ],
  nearby: [
    { name: 'Школа №1', distance: '200 м' },
    { name: 'Детский сад', distance: '150 м' },
    { name: 'ТЦ Донбасс Палас', distance: '500 м' },
    { name: 'Остановка', distance: '100 м' },
  ],
  createdAt: '2024-01-01',
  isTop: true,
};

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapRef.current) return;

    // Fix for default marker icons in Next.js
    const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png';
    const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
    const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';

    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
    });

    // Create map
    const map = L.map(mapRef.current!, {
      zoomControl: true,
      attributionControl: true,
      scrollWheelZoom: false,
      doubleClickZoom: false,
    }).setView([LISTING_DATA.lat, LISTING_DATA.lng], 14);

    // Add CartoDB Voyager tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 20,
    }).addTo(map);

    // Add marker
    L.marker([LISTING_DATA.lat, LISTING_DATA.lng]).addTo(map)
      .bindPopup(`<b>${LISTING_DATA.title}</b><br>${LISTING_DATA.address}`)
      .openPopup();

    return () => {
      map.remove();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#353535]">
      <Header />

      <main>

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link href="/" className="hover:text-white">Главная</Link>
          <span>/</span>
          <Link href="/listings" className="hover:text-white">Объявления</Link>
          <span>/</span>
          <span className="text-white">{LISTING_DATA.title}</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Photo Gallery */}
            <div className="bg-[#2a2a2a] rounded-2xl overflow-hidden">
              <div className="relative h-[400px] md:h-[500px]">
                <img
                  src={LISTING_DATA.photos[currentPhotoIndex]}
                  alt={LISTING_DATA.title}
                  className="object-cover"
                  style={{ objectFit: 'cover' }}
                  onError={(e) => {
                    const t = e.target as HTMLImageElement;
                    if (!t.src.includes('data:image/svg+xml')) {
                      t.src = getPlaceholderImage();
                    }
                  }}
                />
                {LISTING_DATA.isTop && (
                  <div className="absolute top-4 left-4 bg-yellow-600 text-white px-4 py-2 rounded-full font-semibold text-sm">
                    ТОП объявление
                  </div>
                )}
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="absolute top-4 right-4 w-12 h-12 bg-black/50 backdrop-blur rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                >
                  <span className="text-2xl">{isFavorite ? '❤️' : '🤍'}</span>
                </button>
              </div>

              {/* Thumbnail Strip */}
              <div className="flex gap-2 p-4 overflow-x-auto">
                {LISTING_DATA.photos.map((photo, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPhotoIndex(index)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                      currentPhotoIndex === index ? 'border-blue-500' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={photo}
                      alt=""
                      className="object-cover"
                      style={{ objectFit: 'cover' }}
                      onError={(e) => {
                        const t = e.target as HTMLImageElement;
                        if (!t.src.includes('data:image/svg+xml')) {
                          t.src = getPlaceholderImage();
                        }
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Title & Price */}
            <div className="bg-[#2a2a2a] rounded-2xl p-6">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    {LISTING_DATA.title}
                  </h1>
                  <p className="text-gray-400">{LISTING_DATA.address}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-400">
                    {formatPrice(LISTING_DATA.price)} ₽
                  </div>
                  <p className="text-gray-400 text-sm">
                    {formatPrice(Math.round(LISTING_DATA.price / LISTING_DATA.area))} ₽/м²
                  </p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-4 gap-4 pt-4 border-t border-white/10">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{LISTING_DATA.rooms}</div>
                  <div className="text-gray-400 text-sm">комнаты</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{LISTING_DATA.area}</div>
                  <div className="text-gray-400 text-sm">площадь м²</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{LISTING_DATA.floor}</div>
                  <div className="text-gray-400 text-sm">этаж</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{LISTING_DATA.totalFloors}</div>
                  <div className="text-gray-400 text-sm">этажей</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-[#2a2a2a] rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Описание</h2>
              <p className="text-gray-300 whitespace-pre-line leading-relaxed">
                {LISTING_DATA.description}
              </p>
            </div>

            {/* Features */}
            <div className="bg-[#2a2a2a] rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Удобства</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {LISTING_DATA.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2 bg-[#353535] px-4 py-3 rounded-xl">
                    <span className="text-blue-400">✓</span>
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="bg-[#2a2a2a] rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Расположение</h2>
              <div className="h-[400px] rounded-xl overflow-hidden border border-white/10 relative">
                <div ref={mapRef} className="absolute inset-0 w-full h-full" />
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-white mb-3">Инфраструктура рядом</h3>
                <div className="grid grid-cols-2 gap-3">
                  {LISTING_DATA.nearby.map((place) => (
                    <div key={place.name} className="flex justify-between bg-[#353535] px-4 py-3 rounded-xl">
                      <span className="text-gray-300">{place.name}</span>
                      <span className="text-blue-400 font-semibold">{place.distance}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Owner Card */}
            <div className="bg-[#2a2a2a] rounded-2xl p-6 sticky top-24">
              <div className="flex items-center gap-4 mb-6">
                <Image
                  src={LISTING_DATA.owner.avatar}
                  alt={LISTING_DATA.owner.name}
                  width={60}
                  height={60}
                  className="rounded-full"
                />
                <div>
                  <h3 className="text-lg font-bold text-white">{LISTING_DATA.owner.name}</h3>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-yellow-500">★</span>
                    <span className="text-white">{LISTING_DATA.owner.rating}</span>
                    <span className="text-gray-400">({LISTING_DATA.owner.reviewsCount} отзывов)</span>
                  </div>
                </div>
              </div>

              {/* Contact Buttons */}
              <div className="space-y-3">
                <button className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-semibold transition-all">
                  Написать сообщение
                </button>
                {showPhone ? (
                  <a
                    href={`tel:${LISTING_DATA.owner.phone}`}
                    className="block w-full bg-[#353535] hover:bg-[#404040] text-white py-4 rounded-xl font-semibold transition-all text-center border border-white/10"
                  >
                    {LISTING_DATA.owner.phone}
                  </a>
                ) : (
                  <button
                    onClick={() => setShowPhone(true)}
                    className="w-full bg-[#353535] hover:bg-[#404040] text-white py-4 rounded-xl font-semibold transition-all border border-white/10"
                  >
                    Показать телефон
                  </button>
                )}
              </div>

              {/* Actions */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`w-full py-4 rounded-xl font-semibold transition-all ${
                    isFavorite
                      ? 'bg-red-600/20 text-red-400 border border-red-500/50'
                      : 'bg-[#353535] text-gray-300 border border-white/10 hover:bg-[#404040]'
                  }`}
                >
                  {isFavorite ? '❤️ В избранном' : '🤍 Добавить в избранное'}
                </button>
              </div>

              {/* Report */}
              <button className="w-full mt-3 text-gray-400 hover:text-white text-sm py-2">
                Пожаловаться на объявление
              </button>
            </div>

            {/* Stats */}
            <div className="bg-[#2a2a2a] rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Статистика объявления</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Просмотры</span>
                  <span className="text-white font-semibold">{LISTING_DATA.viewsCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">В избранном</span>
                  <span className="text-white font-semibold">{LISTING_DATA.favoritesCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Дата публикации</span>
                  <span className="text-white font-semibold">{LISTING_DATA.createdAt}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </main>
    </div>
  );
}
