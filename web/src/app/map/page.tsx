'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { ListingCard } from '@/components/ListingCard';

const MOCK_LISTINGS = [
  {
    id: '1',
    title: '2-к квартира в центре',
    description: 'Просторная двухкомнатная квартира в центре города с ремонтом',
    price: 45000,
    dealType: 'rent' as const,
    rooms: 2,
    area: 54,
    floor: 3,
    districtNameRu: 'Ворошиловский',
    lat: 48.0083,
    lng: 37.8083,
    primaryPhoto: '/uploads/listings/apartment-modern.jpg',
    isTop: true,
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
    title: '1-к квартира у парка',
    description: 'Уютная однокомнатная квартира рядом с парком',
    price: 35000,
    dealType: 'rent' as const,
    rooms: 1,
    area: 40,
    floor: 5,
    districtNameRu: 'Киевский',
    lat: 48.0333,
    lng: 37.8000,
    primaryPhoto: '/uploads/listings/apartment-cozy.jpg',
    ownerName: 'Анна С.',
    ownerRating: 4.8,
    createdAt: '2024-01-05',
    hasFurniture: false,
    isNewBuilding: true,
    status: 'active',
    viewsCount: 89,
    favoritesCount: 12,
    currency: 'RUB',
    propertyType: 'apartment' as const,
    address: 'ул. Артема, 25',
  },
  {
    id: '3',
    title: '3-к квартира просторная',
    description: 'Просторная трехкомнатная квартира с качественным ремонтом',
    price: 65000,
    dealType: 'rent' as const,
    rooms: 3,
    area: 85,
    floor: 7,
    districtNameRu: 'Калининский',
    lat: 48.0167,
    lng: 37.7833,
    primaryPhoto: '/uploads/listings/apartment-luxury.jpg',
    isFeatured: true,
    ownerName: 'Сергей К.',
    ownerRating: 4.2,
    createdAt: '2024-01-10',
    hasFurniture: true,
    isNewBuilding: false,
    status: 'active',
    viewsCount: 234,
    favoritesCount: 45,
    currency: 'RUB',
    propertyType: 'apartment' as const,
    address: 'пр. Ильича, 50',
  },
  {
    id: '4',
    title: 'Дом с участком',
    description: 'Частный дом с большим участком в тихом районе',
    price: 8500000,
    dealType: 'sale' as const,
    rooms: 4,
    area: 150,
    districtNameRu: 'Будённовский',
    lat: 47.9833,
    lng: 37.8167,
    primaryPhoto: '/uploads/listings/house-exterior.jpg',
    isTop: true,
    ownerName: 'Ольга М.',
    ownerRating: 5.0,
    createdAt: '2024-01-15',
    hasFurniture: true,
    isNewBuilding: true,
    status: 'active',
    viewsCount: 567,
    favoritesCount: 89,
    currency: 'RUB',
    propertyType: 'house' as const,
    address: 'пгт. Александровка',
  },
  {
    id: '5',
    title: 'Студия в новостройке',
    description: 'Современная студия в новом жилом комплексе',
    price: 28000,
    dealType: 'rent' as const,
    rooms: 1,
    area: 32,
    floor: 12,
    districtNameRu: 'Кировский',
    lat: 47.9917,
    lng: 37.7667,
    primaryPhoto: '/uploads/listings/house-cottage.jpg',
    ownerName: 'Дмитрий В.',
    ownerRating: 4.6,
    createdAt: '2024-01-20',
    hasFurniture: true,
    isNewBuilding: true,
    status: 'active',
    viewsCount: 123,
    favoritesCount: 34,
    currency: 'RUB',
    propertyType: 'apartment' as const,
    address: 'пр. Панфилова, 8',
  },
  {
    id: '6',
    title: '2-к квартира у рынка',
    description: 'Двухкомнатная квартира в удобном расположении у рынка',
    price: 40000,
    dealType: 'rent' as const,
    rooms: 2,
    area: 50,
    floor: 4,
    districtNameRu: 'Петровский',
    lat: 47.9750,
    lng: 37.7500,
    primaryPhoto: '/uploads/listings/house-modern.jpg',
    ownerName: 'Елена С.',
    ownerRating: 4.3,
    createdAt: '2024-01-25',
    hasFurniture: false,
    isNewBuilding: false,
    status: 'active',
    viewsCount: 78,
    favoritesCount: 15,
    currency: 'RUB',
    propertyType: 'apartment' as const,
    address: 'ул. Челюскинцев, 100',
  },
  {
    id: '7',
    title: 'Участок 12 соток',
    description: 'Земельный участок под индивидуальное жилищное строительство',
    price: 1800000,
    dealType: 'sale' as const,
    area: 1200,
    districtNameRu: 'Пролетарский',
    lat: 47.9583,
    lng: 37.8333,
    primaryPhoto: '/uploads/listings/land-green.jpg',
    ownerName: 'Алексей К.',
    ownerRating: 4.7,
    createdAt: '2024-01-28',
    hasFurniture: false,
    isNewBuilding: false,
    status: 'active',
    viewsCount: 234,
    favoritesCount: 56,
    currency: 'RUB',
    propertyType: 'land' as const,
    address: 'пгт. Лидиевка',
  },
  {
    id: '8',
    title: '4-к квартира премиум',
    description: 'Премиальная четырехкомнатная квартира с дизайнерским ремонтом',
    price: 120000,
    dealType: 'rent' as const,
    rooms: 4,
    area: 120,
    floor: 10,
    districtNameRu: 'Ворошиловский',
    lat: 48.0100,
    lng: 37.8100,
    primaryPhoto: '/uploads/listings/land-field.jpg',
    isFeatured: true,
    ownerName: 'Виктор Л.',
    ownerRating: 4.9,
    createdAt: '2024-02-01',
    hasFurniture: true,
    isNewBuilding: true,
    status: 'active',
    viewsCount: 456,
    favoritesCount: 78,
    currency: 'RUB',
    propertyType: 'apartment' as const,
    address: 'пр. Науки, 15',
  },
];

const DISTRICTS = [
  { id: 1, name: 'Киевский', lat: 48.0333, lng: 37.8000 },
  { id: 2, name: 'Калининский', lat: 48.0167, lng: 37.7833 },
  { id: 3, name: 'Ворошиловский', lat: 48.0083, lng: 37.8083 },
  { id: 4, name: 'Будённовский', lat: 47.9833, lng: 37.8167 },
  { id: 5, name: 'Кировский', lat: 47.9917, lng: 37.7667 },
  { id: 6, name: 'Петровский', lat: 47.9750, lng: 37.7500 },
  { id: 7, name: 'Пролетарский', lat: 47.9583, lng: 37.8333 },
];

// Map bounds for Donetsk
const MAP_BOUNDS = {
  minLat: 47.92,
  maxLat: 48.08,
  minLng: 37.70,
  maxLng: 37.88,
};

export default function MapPage() {
  const [selectedListing, setSelectedListing] = useState<typeof MOCK_LISTINGS[0] | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'rent' | 'sale'>('all');
  const [mapZoom, setMapZoom] = useState(1);

  const filteredListings = MOCK_LISTINGS.filter(l =>
    activeFilter === 'all' ? true : l.dealType === activeFilter
  );

  const formatPrice = (price: number, dealType: string) => {
    const formatted = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    if (dealType === 'rent') {
      return `${formatted} ₽`;
    }
    return `${formatted} ₽`;
  };

  // Calculate map center based on zoom
  const centerLat = (MAP_BOUNDS.minLat + MAP_BOUNDS.maxLat) / 2;
  const centerLng = (MAP_BOUNDS.minLng + MAP_BOUNDS.maxLng) / 2;
  
  const ZOOM_MIN = 1;
  const ZOOM_MAX = 5;
  const baseLatSpan = MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat;
  const baseLngSpan = MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng;
  
  const latSpan = baseLatSpan / mapZoom;
  const lngSpan = baseLngSpan / mapZoom;
  
  const bounds = {
    minLat: centerLat - latSpan / 2,
    maxLat: centerLat + latSpan / 2,
    minLng: centerLng - lngSpan / 2,
    maxLng: centerLng + lngSpan / 2,
  };

  const toCoord = (n: number) => n.toFixed(6);
  // Use retina tiles (@2x) for better quality
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${toCoord(bounds.minLng)}%2C${toCoord(bounds.minLat)}%2C${toCoord(bounds.maxLng)}%2C${toCoord(bounds.maxLat)}&layer=mapnik&scale=2`;

  // Convert lat/lng to percentage position on map
  const getPosition = (lat: number, lng: number) => {
    const x = ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * 100;
    const y = ((bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat)) * 100;
    return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) };
  };

  return (
    <main className="min-h-screen bg-[#353535]">
      <Header />

      {/* Content */}
      <div className="pt-[114px] pb-[50px]">
        <div className="flex flex-col lg:flex-row" style={{ height: 'calc(100vh - 164px)', minHeight: '600px' }}>
          {/* Map Area */}
          <div className="flex-1 bg-gradient-to-br from-[#353535] to-[#1a1a2e]">
            <div className="h-full p-6">
              <div className="relative h-full overflow-hidden rounded-2xl border border-white/5 bg-[#1a1a2e]">
                {/* Map iframe */}
                <iframe
                  title="Donetsk Map"
                  className="absolute inset-0 w-full h-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={mapSrc}
                  style={{ 
                    filter: 'brightness(1.1) contrast(1.15) saturate(1.05)',
                  }}
                />
                
                {/* Overlay gradient for dark theme - lighter for better visibility */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#353535]/5 to-[#1a1a2e]/10 pointer-events-none" />

                {/* Map Markers */}
                <div className="absolute inset-0">
                  {filteredListings.map((listing) => {
                    const pos = getPosition(listing.lat, listing.lng);
                    return (
                      <button
                        key={listing.id}
                        onClick={() => setSelectedListing(listing)}
                        className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 group ${
                          selectedListing?.id === listing.id ? 'scale-150 z-20' : 'hover:scale-125 z-10'
                        }`}
                        style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                      >
                        <div className="relative">
                          <div className={`w-4 h-4 rounded-full border-2 border-white shadow-lg ${
                            listing.isTop ? 'bg-yellow-500' : listing.isFeatured ? 'bg-orange-500' : 'bg-blue-500'
                          }`} />
                          <div className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-20" />
                          
                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-[#1a1a2e] rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            <p className="text-white text-sm font-semibold">{formatPrice(listing.price, listing.dealType)}</p>
                            <p className="text-gray-400 text-xs">{listing.rooms} комн. • {listing.area} м²</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Selected Listing Popup */}
                {selectedListing && (
                  <div
                    className="absolute z-[1000] bg-[#1a1a2e] rounded-xl shadow-2xl border border-white/5 p-4 w-80 animate-slide-up"
                    style={{ left: '50%', top: '20%', transform: 'translate(-50%, 0)' }}
                  >
                    <button
                      onClick={() => setSelectedListing(null)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-white z-[1001]"
                    >
                      ✕
                    </button>
                    {selectedListing.primaryPhoto && (
                      <img
                        src={selectedListing.primaryPhoto}
                        alt={selectedListing.title}
                        className="w-full h-40 object-cover rounded-lg mb-3"
                      />
                    )}
                    <h3 className="font-semibold text-white mb-1">{selectedListing.title}</h3>
                    <p className="text-[#FF8C42] font-bold mb-2">
                      {formatPrice(selectedListing.price, selectedListing.dealType)}
                    </p>
                    <div className="flex gap-2 text-sm text-gray-400 mb-3">
                      <span>{selectedListing.rooms} комн.</span>
                      <span>{selectedListing.area} м²</span>
                      <span>{selectedListing.floor} эт.</span>
                    </div>
                    <a
                      href={`/listings/${selectedListing.id}`}
                      className="block w-full bg-gradient-to-r from-[#FF8C42] to-[#FF7B2A] text-white text-center py-2.5 rounded-lg hover:from-[#FF7B2A] hover:to-[#FF8C42] transition-all font-semibold"
                    >
                      Подробнее
                    </a>
                  </div>
                )}

                {/* Map Info */}
                <div className="absolute top-4 left-4 bg-[#1a1a2e]/95 backdrop-blur rounded-lg px-4 py-3 shadow-lg border border-white/5 z-[999]">
                  <p className="text-sm font-medium text-white">Донецк</p>
                  <p className="text-xs text-gray-400">{filteredListings.length} объектов на карте</p>
                </div>

                {/* Filter Buttons */}
                <div className="absolute top-4 right-4 flex gap-2 z-[999]">
                  <button
                    onClick={() => setActiveFilter('all')}
                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all shadow-lg ${
                      activeFilter === 'all'
                        ? 'bg-gradient-to-r from-[#FF8C42] to-[#FF7B2A] text-white'
                        : 'bg-[#1a1a2e]/95 text-gray-400 hover:bg-[#2a2a2a] border border-white/5'
                    }`}
                  >
                    Все
                  </button>
                  <button
                    onClick={() => setActiveFilter('rent')}
                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all shadow-lg ${
                      activeFilter === 'rent'
                        ? 'bg-gradient-to-r from-[#FF8C42] to-[#FF7B2A] text-white'
                        : 'bg-[#1a1a2e]/95 text-gray-400 hover:bg-[#2a2a2a] border border-white/5'
                    }`}
                  >
                    Аренда
                  </button>
                  <button
                    onClick={() => setActiveFilter('sale')}
                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all shadow-lg ${
                      activeFilter === 'sale'
                        ? 'bg-gradient-to-r from-[#FF8C42] to-[#FF7B2A] text-white'
                        : 'bg-[#1a1a2e]/95 text-gray-400 hover:bg-[#2a2a2a] border border-white/5'
                    }`}
                  >
                    Продажа
                  </button>
                </div>

                {/* Zoom Controls */}
                <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-[999]">
                  <button
                    onClick={() => setMapZoom((z) => Math.min(ZOOM_MAX, z + 1))}
                    disabled={mapZoom >= ZOOM_MAX}
                    className="w-10 h-10 bg-[#1a1a2e] rounded-lg shadow-lg flex items-center justify-center hover:bg-[#2a2a2a] text-white text-xl font-bold border border-white/5 disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Приблизить"
                  >
                    +
                  </button>
                  <button
                    onClick={() => setMapZoom((z) => Math.max(ZOOM_MIN, z - 1))}
                    disabled={mapZoom <= ZOOM_MIN}
                    className="w-10 h-10 bg-[#1a1a2e] rounded-lg shadow-lg flex items-center justify-center hover:bg-[#2a2a2a] text-white text-xl font-bold border border-white/5 disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Отдалить"
                  >
                    −
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar with Listings */}
          <div className="w-full lg:w-[800px] bg-[#353535] border-l border-white/5 overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Объекты на карте</h2>
              <div className="grid grid-cols-2 gap-4">
                {filteredListings.map((listing) => (
                  <div
                    key={listing.id}
                    onClick={() => setSelectedListing(listing)}
                    className={`cursor-pointer rounded-xl border-2 transition-all ${
                      selectedListing?.id === listing.id
                        ? 'border-[#FF8C42] shadow-lg shadow-[#FF8C42]/20'
                        : 'border-white/5 hover:border-white/10'
                    }`}
                  >
                    <ListingCard listing={listing} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
