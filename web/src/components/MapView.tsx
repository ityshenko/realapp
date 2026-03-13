'use client';

import { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { Listing, DISTRICTS } from '@/lib/types';
import { listingsApi } from '@/lib/api';
import { useFilterStore } from '@/store';
import { useRouter } from 'next/navigation';

const DONETSK_CENTER = { lat: 48.0083, lng: 37.8083 };
const DEFAULT_BBOX = {
  minLng: 37.73,
  minLat: 47.94,
  maxLng: 37.84,
  maxLat: 48.05,
};
const MAP_OPTIONS = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: true,
};

const CLUSTER_COLORS = {
  1: '#FF385C',
  2: '#FF6B6B',
  3: '#FF8E8E',
  4: '#FFB1B1',
  5: '#0066FF',
};

export function MapView() {
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
  const { isLoaded, loadError } = useJsApiLoader({ googleMapsApiKey });

  const router = useRouter();
  const filters = useFilterStore();
  const [listings, setListings] = useState<Listing[]>([]);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [zoom, setZoom] = useState(12);

  useEffect(() => {
    fetchListings();
  }, [filters]);

  const fetchListings = async () => {
    try {
      const params: any = { limit: 100 };
      if (filters.dealType) params.dealType = filters.dealType;
      if (filters.propertyType) params.propertyType = filters.propertyType;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.rooms) params.rooms = filters.rooms;
      if (filters.district) params.district = filters.district;
      if (filters.hasFurniture) params.hasFurniture = filters.hasFurniture;
      if (filters.isNewBuilding) params.isNewBuilding = filters.isNewBuilding;

      const response = await listingsApi.getListings(params);
      setListings(response.data.listings);
    } catch (error) {
      console.error('Error fetching listings:', error);
    }
  };

  const handleMarkerClick = (listing: Listing) => {
    setSelectedListing(listing);
  };

  const handleListingNavigate = (listingId: string) => {
    router.push(`/listings/${listingId}`);
  };

  const formatPrice = (price: number, dealType: string) => {
    if (dealType === 'rent') {
      return `${price.toLocaleString()} ₽/мес`;
    }
    return `${price.toLocaleString()} ₽`;
  };

  const osmSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${DEFAULT_BBOX.minLng}%2C${DEFAULT_BBOX.minLat}%2C${DEFAULT_BBOX.maxLng}%2C${DEFAULT_BBOX.maxLat}&layer=mapnik&marker=${DONETSK_CENTER.lat}%2C${DONETSK_CENTER.lng}`;

  // Always show a map: if Google Maps can't load, fall back to OSM embed.
  if (!googleMapsApiKey || loadError || !isLoaded) {
    return (
      <div className="w-full h-full relative overflow-hidden">
        <iframe
          title="Map"
          className="absolute inset-0 w-full h-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={osmSrc}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-black/20 pointer-events-none" />
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <GoogleMap
        mapContainerClassName="w-full h-full"
        center={DONETSK_CENTER}
        zoom={zoom}
        options={MAP_OPTIONS}
        onLoad={setMap}
        onZoomChanged={() => {
          if (map) {
            setZoom(map.getZoom() || 12);
          }
        }}
      >
        {listings.map((listing) => (
          <Marker
            key={listing.id}
            position={{ lat: listing.lat!, lng: listing.lng! }}
            onClick={() => handleMarkerClick(listing)}
            icon={{
              path: (google.maps as any).Symbol.CIRCLE,
              scale: zoom > 14 ? 8 : 12,
              fillColor: listing.isTop
                ? '#FFD700'
                : listing.isFeatured
                ? '#FF6B6B'
                : listing.highlightColor || '#0066FF',
              fillOpacity: 1,
              strokeWeight: 2,
              strokeColor: '#FFFFFF',
            }}
          />
        ))}

        {selectedListing && (
          <InfoWindow
            position={{ lat: selectedListing.lat, lng: selectedListing.lng }}
            onCloseClick={() => setSelectedListing(null)}
            options={{
              maxWidth: 300,
              disableAutoPan: false,
            }}
          >
            <div className="p-2">
              {selectedListing.primaryPhoto && (
                <img
                  src={selectedListing.primaryPhoto}
                  alt={selectedListing.title}
                  className="w-full h-32 object-cover rounded-lg mb-2"
                />
              )}
              <h3 className="font-semibold text-text-primary mb-1">
                {selectedListing.title}
              </h3>
              <p className="text-primary font-bold mb-1">
                {formatPrice(selectedListing.price, selectedListing.dealType)}
              </p>
              <p className="text-sm text-text-secondary mb-2">
                {selectedListing.districtNameRu || selectedListing.districtName}
              </p>
              <div className="flex gap-2 text-sm text-text-secondary mb-2">
                {selectedListing.rooms && (
                  <span>{selectedListing.rooms} комн.</span>
                )}
                <span>{selectedListing.area} м²</span>
                {selectedListing.floor && (
                  <span>{selectedListing.floor} этаж</span>
                )}
              </div>
              <button
                onClick={() => handleListingNavigate(selectedListing.id)}
                className="w-full btn-primary py-2 text-sm"
              >
                Подробнее
              </button>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      {/* Filters Overlay */}
      <div className="absolute top-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-white rounded-xl shadow-large p-4 max-h-[80vh] overflow-y-auto">
        <h3 className="font-semibold text-lg mb-4">Фильтры</h3>

        {/* Deal Type */}
        <div className="mb-4">
          <label className="block text-sm text-text-secondary mb-2">Тип сделки</label>
          <div className="flex gap-2">
            <button
              onClick={() =>
                useFilterStore.getState().setFilter(
                  'dealType',
                  filters.dealType === 'rent' ? undefined : 'rent'
                )
              }
              className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
                filters.dealType === 'rent'
                  ? 'bg-primary text-white border-primary'
                  : 'border-border text-text-secondary hover:border-primary'
              }`}
            >
              Аренда
            </button>
            <button
              onClick={() =>
                useFilterStore.getState().setFilter(
                  'dealType',
                  filters.dealType === 'sale' ? undefined : 'sale'
                )
              }
              className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
                filters.dealType === 'sale'
                  ? 'bg-primary text-white border-primary'
                  : 'border-border text-text-secondary hover:border-primary'
              }`}
            >
              Продажа
            </button>
          </div>
        </div>

        {/* Property Type */}
        <div className="mb-4">
          <label className="block text-sm text-text-secondary mb-2">Тип недвижимости</label>
          <select
            value={filters.propertyType || ''}
            onChange={(e) =>
              useFilterStore.getState().setFilter('propertyType', e.target.value as 'apartment' | 'house' | 'land' | undefined)
            }
            className="input"
          >
            <option value="">Все типы</option>
            <option value="apartment">Квартира</option>
            <option value="house">Дом</option>
            <option value="land">Участок</option>
          </select>
        </div>

        {/* Price Range */}
        <div className="mb-4">
          <label className="block text-sm text-text-secondary mb-2">Цена</label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="От"
              value={filters.minPrice || ''}
              onChange={(e) =>
                useFilterStore.getState().setFilter('minPrice', e.target.value ? Number(e.target.value) : undefined)
              }
              className="input"
            />
            <input
              type="number"
              placeholder="До"
              value={filters.maxPrice || ''}
              onChange={(e) =>
                useFilterStore.getState().setFilter('maxPrice', e.target.value ? Number(e.target.value) : undefined)
              }
              className="input"
            />
          </div>
        </div>

        {/* Rooms */}
        <div className="mb-4">
          <label className="block text-sm text-text-secondary mb-2">Комнаты</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((rooms) => (
              <button
                key={rooms}
                onClick={() =>
                  useFilterStore.getState().setFilter(
                    'rooms',
                    filters.rooms === rooms ? undefined : rooms
                  )
                }
                className={`flex-1 py-2 rounded-lg border transition-colors ${
                  filters.rooms === rooms
                    ? 'bg-primary text-white border-primary'
                    : 'border-border text-text-secondary hover:border-primary'
                }`}
              >
                {rooms}
              </button>
            ))}
          </div>
        </div>

        {/* District */}
        <div className="mb-4">
          <label className="block text-sm text-text-secondary mb-2">Район</label>
          <select
            value={filters.district || ''}
            onChange={(e) =>
              useFilterStore.getState().setFilter('district', e.target.value ? Number(e.target.value) : undefined)
            }
            className="input"
          >
            <option value="">Все районы</option>
            {DISTRICTS.map((d) => (
              <option key={d.id} value={d.id}>
                {d.nameRu}
              </option>
            ))}
          </select>
        </div>

        {/* Features */}
        <div className="mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.hasFurniture || false}
              onChange={(e) =>
                useFilterStore.getState().setFilter('hasFurniture', e.target.checked ? true : undefined)
              }
              className="w-4 h-4"
            />
            <span className="text-sm text-text-secondary">С мебелью</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer mt-2">
            <input
              type="checkbox"
              checked={filters.isNewBuilding || false}
              onChange={(e) =>
                useFilterStore.getState().setFilter('isNewBuilding', e.target.checked ? true : undefined)
              }
              className="w-4 h-4"
            />
            <span className="text-sm text-text-secondary">Новостройка</span>
          </label>
        </div>

        {/* Reset Filters */}
        <button
          onClick={() => useFilterStore.getState().resetFilters()}
          className="w-full btn-secondary py-2"
        >
          Сбросить фильтры
        </button>

        {/* Results Count */}
        <div className="mt-4 text-center text-sm text-text-secondary">
          Найдено: {listings.length} объектов
        </div>
      </div>
    </div>
  );
}
