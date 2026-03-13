'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { ListingCard } from '@/components/ListingCard';
import Link from 'next/link';

const FAVORITE_LISTINGS = [
  {
    id: '1',
    title: '2-к квартира в центре',
    description: 'Просторная квартира в центре города',
    price: 45000,
    dealType: 'rent' as const,
    rooms: 2,
    area: 54,
    floor: 3,
    districtNameRu: 'Ворошиловский',
    lat: 48.0083,
    lng: 37.8083,
    primaryPhoto: '/uploads/listings/apartment-1.jpg',
    ownerName: 'Иван П.',
    ownerRating: 4.5,
    createdAt: '2024-01-01',
    hasFurniture: true,
    isNewBuilding: false,
    status: 'active',
    viewsCount: 150,
    favoritesCount: 25,
    currency: 'RUB',
    propertyType: 'apartment' as const,
    address: 'пр. Пушкина, 10',
  },
  {
    id: '2',
    title: 'Роскошная 3-к квартира',
    description: 'Квартира с дизайнерским ремонтом',
    price: 85000,
    dealType: 'rent' as const,
    rooms: 3,
    area: 95,
    floor: 8,
    districtNameRu: 'Киевский',
    lat: 48.0333,
    lng: 37.8000,
    primaryPhoto: '/uploads/listings/apartment-1.jpg',
    ownerName: 'Анна С.',
    ownerRating: 4.9,
    createdAt: '2024-01-05',
    hasFurniture: true,
    isNewBuilding: true,
    status: 'active',
    viewsCount: 320,
    favoritesCount: 67,
    currency: 'RUB',
    propertyType: 'apartment' as const,
    address: 'ул. Артема, 25',
  },
  {
    id: '3',
    title: 'Дом с участком',
    description: 'Загородный дом с большим участком',
    price: 12500000,
    dealType: 'sale' as const,
    rooms: 4,
    area: 180,
    districtNameRu: 'Будённовский',
    lat: 47.9833,
    lng: 37.8167,
    primaryPhoto: '/uploads/listings/apartment-1.jpg',
    ownerName: 'Ольга М.',
    ownerRating: 5.0,
    createdAt: '2024-01-15',
    hasFurniture: true,
    isNewBuilding: true,
    status: 'active',
    viewsCount: 890,
    favoritesCount: 156,
    currency: 'RUB',
    propertyType: 'house' as const,
    address: 'пгт. Александровка',
  },
];

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState(FAVORITE_LISTINGS);

  const removeFavorite = (id: string) => {
    setFavorites(favorites.filter(f => f.id !== id));
  };

  return (
    <main className="min-h-screen bg-[#353535]">
      <Header />

      <div className="container mx-auto px-4 py-8 pt-28">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Избранное</h1>
            <p className="text-gray-400">
              {favorites.length} сохранённых объектов
            </p>
          </div>
          <Link
            href="/listings"
            className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-2"
          >
            ← Смотреть все объявления
          </Link>
        </div>

        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {favorites.map((listing) => (
              <div key={listing.id} className="relative group">
                <ListingCard listing={listing} />
                <button
                  onClick={() => removeFavorite(listing.id)}
                  className="absolute top-3 right-3 z-10 w-8 h-8 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                  title="Удалить из избранного"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#2a2a2a] rounded-2xl p-12 border border-white/10 text-center">
            <div className="text-6xl mb-4">🤍</div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Список избранного пуст
            </h2>
            <p className="text-gray-400 mb-6">
              Сохраняйте понравившиеся объекты, чтобы не потерять их
            </p>
            <Link
              href="/listings"
              className="inline-block bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-semibold transition-all"
            >
              Смотреть объявления
            </Link>
          </div>
        )}

        {/* Price Alert Info */}
        {favorites.length > 0 && (
          <div className="mt-12 bg-blue-600/20 border border-blue-500/30 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="text-3xl">🔔</div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">
                  Уведомления об изменении цены
                </h3>
                <p className="text-gray-300">
                  Вы получите уведомление, если цена на любой из сохранённых объектов изменится.
                  Следите за лучшими предложениями!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
