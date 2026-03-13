'use client';

import { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { ListingCard } from '@/components/ListingCard';

// Generate mock listings with fixed seed-like values to avoid hydration mismatch
const generateMockListings = () => {
  return Array.from({ length: 20 }, (_, i) => ({
    id: `${i + 1}`,
    title: `${i % 3 + 1}-к квартира, ул. Пушкина ${i + 1}`,
    description: 'Уютная квартира с ремонтом',
    price: ((i * 7321 + 25000) % 100000) + 25000, // Deterministic pseudo-random
    currency: 'RUB' as const,
    propertyType: 'apartment' as const,
    dealType: (i % 3 === 0 ? 'sale' : 'rent') as 'rent' | 'sale',
    rooms: ((i % 4) + 1) as 1 | 2 | 3 | 4,
    area: ((i * 37) % 100) + 30, // Deterministic pseudo-random
    floor: ((i % 9) + 1) as number,
    districtNameRu: ['Ворошиловский', 'Киевский', 'Калининский', 'Будённовский', 'Кировский'][i % 5] as string,
    lat: 48.0083 + (((i * 17) % 100) / 1000 - 0.05), // Deterministic pseudo-random
    lng: 37.8083 + (((i * 23) % 100) / 1000 - 0.05), // Deterministic pseudo-random
    hasFurniture: i % 2 === 0,
    isNewBuilding: i % 3 === 0,
    status: 'active' as const,
    viewsCount: ((i * 13) % 500) as number,
    favoritesCount: ((i * 7) % 50) as number,
    primaryPhoto: `/uploads/listings/apartment-modern.jpg`,
    ownerName: `Владелец ${i + 1}`,
    ownerRating: 4 + ((i % 10) / 10), // Deterministic: 4.0 to 4.9
    createdAt: '2024-01-01',
    isTop: i % 5 === 0,
    address: `ул. Пушкина, ${i + 1}`,
  }));
};

const DISTRICTS = [
  { id: 1, name: 'Все районы' },
  { id: 2, name: 'Ворошиловский' },
  { id: 3, name: 'Киевский' },
  { id: 4, name: 'Калининский' },
  { id: 5, name: 'Будённовский' },
  { id: 6, name: 'Кировский' },
  { id: 7, name: 'Петровский' },
  { id: 8, name: 'Пролетарский' },
];

export default function ListingsPage() {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'rent' | 'sale'>('all');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedRooms, setSelectedRooms] = useState<number | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<number>(1);
  const [hasFurniture, setHasFurniture] = useState(false);
  const [isNewBuilding, setIsNewBuilding] = useState(false);
  const [sortBy, setSortBy] = useState('created_at');

  // Generate mock listings once (deterministic, no random)
  const MOCK_LISTINGS = useMemo(() => generateMockListings(), []);

  const filteredListings = MOCK_LISTINGS.filter(listing => {
    if (selectedFilter !== 'all' && listing.dealType !== selectedFilter) return false;
    if (priceRange.min && listing.price < parseInt(priceRange.min)) return false;
    if (priceRange.max && listing.price > parseInt(priceRange.max)) return false;
    if (selectedRooms && listing.rooms !== selectedRooms) return false;
    if (selectedDistrict > 1 && !listing.districtNameRu.includes(DISTRICTS.find(d => d.id === selectedDistrict)?.name || '')) return false;
    if (hasFurniture && !listing.hasFurniture) return false;
    if (isNewBuilding && !listing.isNewBuilding) return false;
    return true;
  });

  const resetFilters = () => {
    setSelectedFilter('all');
    setPriceRange({ min: '', max: '' });
    setSelectedRooms(null);
    setSelectedDistrict(1);
    setHasFurniture(false);
    setIsNewBuilding(false);
  };

  return (
    <main className="min-h-screen bg-[#1A1A1A]">
      <Header />

      <div className="container mx-auto px-4 py-12 pt-24">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 mt-6">
          {selectedFilter === 'all' ? 'Все объявления' : selectedFilter === 'rent' ? 'Аренда' : 'Продажа'}
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-72 flex-shrink-0 lg:mt-[3.5%]">
            <div className="bg-[#2D2D2D] rounded-2xl p-5 sticky top-24 border border-white/5">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-white">Фильтры</h2>
                <button
                  onClick={resetFilters}
                  className="text-[#FF8C42] hover:text-[#FFA96D] text-sm font-semibold"
                >
                  Сбросить
                </button>
              </div>

              {/* Deal Type */}
              <div className="mb-4">
                <label className="block text-xs text-neutral-400 mb-2">Тип сделки</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedFilter(selectedFilter === 'rent' ? 'all' : 'rent')}
                    className={`py-2.5 px-3 rounded-lg font-medium transition-all text-xs ${
                      selectedFilter === 'rent'
                        ? 'bg-gradient-to-r from-[#FF8C42] to-[#FF7B2A] text-white'
                        : 'bg-[#3A3A3A] text-neutral-400 hover:bg-[#404040] border border-white/5'
                    }`}
                  >
                    Аренда
                  </button>
                  <button
                    onClick={() => setSelectedFilter(selectedFilter === 'sale' ? 'all' : 'sale')}
                    className={`py-2.5 px-3 rounded-lg font-medium transition-all text-xs ${
                      selectedFilter === 'sale'
                        ? 'bg-gradient-to-r from-[#FF8C42] to-[#FF7B2A] text-white'
                        : 'bg-[#3A3A3A] text-neutral-400 hover:bg-[#404040] border border-white/5'
                    }`}
                  >
                    Продажа
                  </button>
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-4">
                <label className="block text-xs text-neutral-400 mb-2">Цена, ₽</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="От"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                    className="w-full bg-[#3A3A3A] border border-white/5 rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-[#FF8C42] focus:ring-1 focus:ring-[#FF8C42] outline-none transition-all"
                  />
                  <input
                    type="number"
                    placeholder="До"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                    className="w-full bg-[#3A3A3A] border border-white/5 rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-[#FF8C42] focus:ring-1 focus:ring-[#FF8C42] outline-none transition-all"
                  />
                </div>
              </div>

              {/* Rooms */}
              <div className="mb-4">
                <label className="block text-xs text-neutral-400 mb-2">Комнаты</label>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((rooms) => (
                    <button
                      key={rooms}
                      onClick={() => setSelectedRooms(selectedRooms === rooms ? null : rooms)}
                      className={`w-8 h-8 rounded-lg font-medium transition-all text-xs ${
                        selectedRooms === rooms
                          ? 'bg-gradient-to-r from-[#FF8C42] to-[#FF7B2A] text-white'
                          : 'bg-[#3A3A3A] text-neutral-400 hover:bg-[#404040] border border-white/5'
                      }`}
                    >
                      {rooms}
                    </button>
                  ))}
                </div>
              </div>

              {/* District */}
              <div className="mb-4">
                <label className="block text-xs text-neutral-400 mb-2">Район</label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(parseInt(e.target.value))}
                  className="w-full bg-[#3A3A3A] border border-white/5 rounded-lg px-3 py-2 text-xs text-white focus:border-[#FF8C42] focus:ring-1 focus:ring-[#FF8C42] outline-none transition-all cursor-pointer"
                >
                  {DISTRICTS.map((district) => (
                    <option key={district.id} value={district.id} className="bg-[#2D2D2D]">
                      {district.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Features */}
              <div className="mb-4">
                <label className="block text-xs text-neutral-400 mb-2">Особенности</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasFurniture}
                      onChange={(e) => setHasFurniture(e.target.checked)}
                      className="w-4 h-4 rounded bg-[#3A3A3A] border-white/10 text-[#FF8C42] focus:ring-[#FF8C42] focus:ring-2"
                    />
                    <span className="text-xs text-neutral-300">С мебелью</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isNewBuilding}
                      onChange={(e) => setIsNewBuilding(e.target.checked)}
                      className="w-4 h-4 rounded bg-[#3A3A3A] border-white/10 text-[#FF8C42] focus:ring-[#FF8C42] focus:ring-2"
                    />
                    <span className="text-xs text-neutral-300">Новостройка</span>
                  </label>
                </div>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-xs text-neutral-400 mb-2">Сортировка</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-[#3A3A3A] border border-white/5 rounded-lg px-3 py-2 text-xs text-white focus:border-[#FF8C42] focus:ring-1 focus:ring-[#FF8C42] outline-none transition-all cursor-pointer"
                >
                  <option value="created_at" className="bg-[#2D2D2D]">По дате</option>
                  <option value="price_asc" className="bg-[#2D2D2D]">Сначала дешёвые</option>
                  <option value="price_desc" className="bg-[#2D2D2D]">Сначала дорогие</option>
                  <option value="area" className="bg-[#2D2D2D]">По площади</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Listings Grid - Two Rows */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-neutral-400">
                Найдено <span className="text-white font-semibold">{filteredListings.length}</span> объектов
              </p>
            </div>

            {/* Grid - 2 rows of 5 = 10 items per page */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {filteredListings.slice(0, 10).map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
