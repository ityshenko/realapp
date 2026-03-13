'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  propertyType: 'apartment' | 'house' | 'land';
  dealType: 'rent' | 'sale';
  rooms?: number;
  area: number;
  floor?: number;
  totalFloors?: number;
  address: string;
  districtName?: string;
  districtNameRu?: string;
  lat?: number;
  lng?: number;
  hasFurniture: boolean;
  isNewBuilding: boolean;
  status: string;
  viewsCount: number;
  favoritesCount: number;
  primaryPhoto?: string;
  ownerName?: string;
  ownerPhone?: string;
  ownerRating?: number;
  createdAt: string;
  isFavorite?: boolean;
  highlightColor?: string;
  isTop?: boolean;
  isFeatured?: boolean;
}

interface ListingCardProps {
  listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  const formatPrice = (price: number, dealType: string) => {
    const formatted = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    if (dealType === 'rent') {
      return `${formatted} ₽/мес`;
    }
    return `${formatted} ₽`;
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  // Генерация SVG заглушки вместо внешнего изображения
  const getPlaceholderImage = () => {
    const colors = {
      apartment: 'FF8C42',
      house: '4A90D9',
      land: '70AD47',
    };
    const color = colors[listing.propertyType] || 'FF8C42';
    const text = listing.propertyType === 'apartment' ? 'Квартира' :
                 listing.propertyType === 'house' ? 'Дом' : 'Участок';

    const svg = `
      <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
        <rect width="800" height="600" fill="#${color}"/>
        <text x="50%" y="50%" font-family="Arial" font-size="48" fill="white" text-anchor="middle" dominant-baseline="middle" font-weight="bold">
          ${text}
        </text>
      </svg>
    `.trim();

    return `data:image/svg+xml,${encodeURIComponent(svg).replace(/'/g, '%27').replace(/"/g, '%22')}`;
  };

  // Получение URL изображения
  const getImageUrl = () => {
    // Если есть primaryPhoto
    if (listing.primaryPhoto) {
      // Если это data:image (base64)
      if (listing.primaryPhoto.startsWith('data:')) {
        return listing.primaryPhoto;
      }
      // Если это полный URL (начинается с http)
      if (listing.primaryPhoto.startsWith('http')) {
        return listing.primaryPhoto;
      }
      // Если это относительный путь (начинается с /)
      if (listing.primaryPhoto.startsWith('/')) {
        // Serve from the current origin. Next rewrites `/uploads/**` to the backend when needed.
        return listing.primaryPhoto;
      }
      // В остальных случаях возвращаем как есть
      return listing.primaryPhoto;
    }

    // Возвращаем заглушку
    return getPlaceholderImage();
  };

  const imageUrl = getImageUrl();
  const isDataImage = imageUrl.startsWith('data:');

  return (
    <Link href={`/listings/${listing.id}`} className="block group">
      <div className="bg-[#252525] rounded-2xl overflow-hidden border border-white/5 hover:border-[#FF8C42]/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40">
        {/* Image */}
        <div className="relative h-44 overflow-hidden">
          {isDataImage ? (
            <img
              src={imageUrl}
              alt={listing.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-600"
            />
          ) : (
            <Image
              src={imageUrl}
              alt={listing.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
              className="object-cover group-hover:scale-105 transition-transform duration-600"
              onError={(e) => {
                const img = e.currentTarget as unknown as HTMLImageElement;
                img.src = getPlaceholderImage();
              }}
            />
          )}
          {/* Bottom gradient for price overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

          {/* Deal type badge */}
          <div className="absolute top-2.5 left-2.5 flex gap-1">
            <span className={`px-2 py-0.5 rounded-lg text-xs font-semibold backdrop-blur-sm ${
              listing.dealType === 'rent'
                ? 'bg-blue-500/80 text-white'
                : 'bg-emerald-500/80 text-white'
            }`}>
              {listing.dealType === 'rent' ? 'Аренда' : 'Продажа'}
            </span>
            {listing.isTop && <span className="px-2 py-0.5 rounded-lg text-xs font-semibold bg-[#FF8C42]/90 text-white backdrop-blur-sm">ТОП</span>}
            {listing.isFeatured && <span className="px-2 py-0.5 rounded-lg text-xs font-semibold bg-purple-500/90 text-white backdrop-blur-sm">VIP</span>}
          </div>

          {/* Favourite button */}
          <button
            onClick={handleFavorite}
            className="absolute top-2.5 right-2.5 w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/70 transition-all hover:scale-110"
          >
            <svg
              className={`w-4 h-4 transition-colors ${isFavorite ? 'text-red-500 fill-red-500' : 'text-white'}`}
              fill={isFavorite ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>

          {/* Price on image */}
          <div className="absolute bottom-2.5 left-2.5">
            <span className="text-sm font-bold text-white drop-shadow-lg">
              {formatPrice(listing.price, listing.dealType)}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-3.5">
          {/* Title */}
          <h3 className="font-semibold text-white text-sm line-clamp-1 mb-1">
            {listing.title}
          </h3>

          {/* Location */}
          <p className="text-xs text-neutral-500 mb-2.5 flex items-center gap-1 line-clamp-1">
            <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {listing.districtNameRu || listing.districtName || listing.address}
          </p>

          {/* Features */}
          <div className="flex flex-wrap items-center gap-1.5 mb-3">
            {listing.rooms && (
              <span className="bg-[#333] px-2 py-0.5 rounded-md text-xs text-neutral-300 border border-white/5">{listing.rooms} комн.</span>
            )}
            <span className="bg-[#333] px-2 py-0.5 rounded-md text-xs text-neutral-300 border border-white/5">{listing.area} м²</span>
            {listing.floor && (
              <span className="bg-[#333] px-2 py-0.5 rounded-md text-xs text-neutral-300 border border-white/5">{listing.floor} эт.</span>
            )}
          </div>

          {/* Owner */}
          <div className="flex items-center justify-between pt-2.5 border-t border-white/5">
            <div className="flex items-center gap-1.5 min-w-0">
              <div className="w-5 h-5 bg-[#FF8C42]/15 rounded-full flex items-center justify-center shrink-0">
                <span className="text-[10px] text-[#FF8C42] font-bold">{listing.ownerName?.[0]?.toUpperCase()}</span>
              </div>
              <span className="text-xs text-neutral-500 truncate">{listing.ownerName}</span>
            </div>
            {listing.ownerRating && (
              <div className="flex items-center gap-0.5 text-xs shrink-0">
                <svg className="w-3 h-3 text-[#FF8C42] fill-[#FF8C42]" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-neutral-500">{listing.ownerRating}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export function ListingCardSkeleton() {
  return (
    <div className="bg-[#252525] rounded-2xl overflow-hidden border border-white/8">
      <div className="relative h-44 bg-[#333] animate-pulse" />
      <div className="p-3 space-y-2">
        <div className="h-5 w-24 bg-[#3A3A3A] rounded animate-pulse" />
        <div className="h-4 w-full bg-[#3A3A3A] rounded animate-pulse" />
        <div className="h-3 w-3/4 bg-[#3A3A3A] rounded animate-pulse" />
        <div className="flex gap-2">
          <div className="h-6 w-16 bg-[#3A3A3A] rounded animate-pulse" />
          <div className="h-6 w-16 bg-[#3A3A3A] rounded animate-pulse" />
          <div className="h-6 w-16 bg-[#3A3A3A] rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
