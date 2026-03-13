'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store';
import { ListingCard } from '@/components/ListingCard';
import { AIAssistant } from '@/components/AIAssistant';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Header } from '@/components/Header';

const API_URL = process.env.API_URL || 'http://localhost:5000';

const HERO_IMAGES = [
  '/uploads/hero/hero-1.jpg',
  '/uploads/hero/hero-2.jpg',
  '/uploads/hero/hero-3.jpg',
];

const FEATURED_LISTINGS = [
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
    primaryPhoto: '/uploads/listings/house-exterior.jpg',
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
    description: 'Роскошная трехкомнатная квартира с панорамными окнами',
    price: 85000,
    dealType: 'rent' as const,
    rooms: 3,
    area: 95,
    floor: 8,
    districtNameRu: 'Киевский',
    primaryPhoto: '/uploads/listings/house-cottage.jpg',
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
    title: 'Современная студия',
    description: 'Современная студия с дизайнерским ремонтом в новостройке',
    price: 28000,
    dealType: 'rent' as const,
    rooms: 1,
    area: 35,
    floor: 5,
    districtNameRu: 'Калининский',
    primaryPhoto: '/uploads/listings/house-modern.jpg',
    ownerName: 'Сергей К.',
    ownerRating: 4.7,
    createdAt: '2024-01-10',
    hasFurniture: true,
    isNewBuilding: true,
    status: 'active',
    viewsCount: 180,
    favoritesCount: 42,
    currency: 'RUB',
    propertyType: 'apartment' as const,
    address: 'пр. Ильича, 50',
  },
  {
    id: '4',
    title: 'Дом с участком',
    description: 'Загородный дом с большим участком и гаражом',
    price: 12500000,
    dealType: 'sale' as const,
    rooms: 4,
    area: 180,
    districtNameRu: 'Будённовский',
    primaryPhoto: '/uploads/listings/land-green.jpg',
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
  {
    id: '5',
    title: 'Участок 15 соток',
    description: 'Ровный земельный участок под застройку в тихом районе',
    price: 2500000,
    dealType: 'sale' as const,
    area: 1500,
    districtNameRu: 'Кировский',
    primaryPhoto: '/uploads/listings/land-field.jpg',
    ownerName: 'Дмитрий В.',
    ownerRating: 4.6,
    createdAt: '2024-01-18',
    hasFurniture: false,
    isNewBuilding: false,
    status: 'active',
    viewsCount: 445,
    favoritesCount: 78,
    currency: 'RUB',
    propertyType: 'land' as const,
    address: 'пгт. Лидиевка',
  },
  {
    id: '6',
    title: '1-к квартира у парка',
    description: 'Однокомнатная квартира near парка с видом на зелень',
    price: 32000,
    dealType: 'rent' as const,
    rooms: 1,
    area: 42,
    floor: 4,
    districtNameRu: 'Петровский',
    primaryPhoto: '/uploads/listings/apartment-modern.jpg',
    ownerName: 'Елена С.',
    ownerRating: 4.4,
    createdAt: '2024-01-20',
    hasFurniture: false,
    isNewBuilding: false,
    status: 'active',
    viewsCount: 234,
    favoritesCount: 45,
    currency: 'RUB',
    propertyType: 'apartment' as const,
    address: 'ул. Челюскинцев, 50',
  },
  {
    id: '7',
    title: '2-к квартира новостройка',
    description: 'Двухкомнатная квартира в новом жилом комплексе',
    price: 55000,
    dealType: 'rent' as const,
    rooms: 2,
    area: 62,
    floor: 10,
    districtNameRu: 'Ворошиловский',
    primaryPhoto: '/uploads/listings/apartment-cozy.jpg',
    ownerName: 'Алексей К.',
    ownerRating: 4.8,
    createdAt: '2024-01-22',
    hasFurniture: true,
    isNewBuilding: true,
    status: 'active',
    viewsCount: 312,
    favoritesCount: 58,
    currency: 'RUB',
    propertyType: 'apartment' as const,
    address: 'пр. Науки, 25',
  },
  {
    id: '8',
    title: 'Дом 200м² с гаражом',
    description: 'Большой семейный дом с гаражом и садом',
    price: 18500000,
    dealType: 'sale' as const,
    rooms: 5,
    area: 200,
    districtNameRu: 'Киевский',
    primaryPhoto: '/uploads/listings/apartment-luxury.jpg',
    ownerName: 'Виктор Л.',
    ownerRating: 4.9,
    createdAt: '2024-01-24',
    hasFurniture: true,
    isNewBuilding: true,
    status: 'active',
    viewsCount: 678,
    favoritesCount: 123,
    currency: 'RUB',
    propertyType: 'house' as const,
    address: 'пгт. Октябрьское',
  },
  {
    id: '9',
    title: '3-к квартира центр',
    description: 'Трехкомнатная квартира в центре города с ремонтом',
    price: 75000,
    dealType: 'rent' as const,
    rooms: 3,
    area: 85,
    floor: 6,
    districtNameRu: 'Ворошиловский',
    primaryPhoto: '/uploads/listings/house-exterior.jpg',
    ownerName: 'Наталья М.',
    ownerRating: 4.7,
    createdAt: '2024-01-26',
    hasFurniture: true,
    isNewBuilding: false,
    status: 'active',
    viewsCount: 445,
    favoritesCount: 89,
    currency: 'RUB',
    propertyType: 'apartment' as const,
    address: 'пр. Пушкина, 35',
  },
  {
    id: '10',
    title: 'Участок 10 соток ИЖС',
    description: 'Земельный участок 10 соток под индивидуальное строительство',
    price: 1800000,
    dealType: 'sale' as const,
    area: 1000,
    districtNameRu: 'Пролетарский',
    primaryPhoto: '/uploads/listings/house-cottage.jpg',
    ownerName: 'Павел Р.',
    ownerRating: 4.5,
    createdAt: '2024-01-28',
    hasFurniture: false,
    isNewBuilding: false,
    status: 'active',
    viewsCount: 356,
    favoritesCount: 67,
    currency: 'RUB',
    propertyType: 'land' as const,
    address: 'пгт. Лидиевка',
  },
];

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  // Rent categories
  'rent-apartments': (
    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  'rent-houses': (
    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  'rent-commercial': (
    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  ),
  'rent-land': (
    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
    </svg>
  ),
  // Sale categories - different icons
  'sale-apartments': (
    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      <circle cx="12" cy="14" r="2" strokeWidth={1.5} />
    </svg>
  ),
  'sale-houses': (
    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v4m0 4v4" />
    </svg>
  ),
  'sale-commercial': (
    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  ),
  'sale-land': (
    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

const CATEGORIES = [
  { key: 'rent-apartments', title: 'Аренда квартир', count: '450+', icon: 'rent-apartments', color: 'from-blue-500 to-blue-600' },
  { key: 'rent-houses', title: 'Аренда домов', count: '120+', icon: 'rent-houses', color: 'from-emerald-500 to-emerald-600' },
  { key: 'rent-commercial', title: 'Аренда коммерции', count: '65+', icon: 'rent-commercial', color: 'from-purple-500 to-purple-600' },
  { key: 'rent-land', title: 'Аренда участков', count: '45+', icon: 'rent-land', color: 'from-amber-500 to-amber-600' },
  { key: 'sale-apartments', title: 'Продажа квартир', count: '400+', icon: 'sale-apartments', color: 'from-cyan-500 to-cyan-600' },
  { key: 'sale-houses', title: 'Продажа домов', count: '200+', icon: 'sale-houses', color: 'from-teal-500 to-teal-600' },
  { key: 'sale-commercial', title: 'Продажа коммерции', count: '30+', icon: 'sale-commercial', color: 'from-fuchsia-500 to-fuchsia-600' },
  { key: 'sale-land', title: 'Продажа участков', count: '135+', icon: 'sale-land', color: 'from-orange-500 to-orange-600' },
];

export default function Home() {
  const [currentHeroImage, setCurrentHeroImage] = useState(0);
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="min-h-screen bg-[#1A1A1A]">
      <Header />

      {/* Hero Section */}
      <section className="relative h-screen min-h-[700px] overflow-hidden">
        {HERO_IMAGES.map((img, index) => (
          <div
            key={img}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentHeroImage ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={img}
              alt="Hero"
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-[#1A1A1A]" />
          </div>
        ))}

        <div className="relative z-10 container mx-auto px-4 h-full flex items-center justify-center text-center pt-16">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              <span className="text-[#FF8C42]">Тут.ру</span><span className="text-white" style={{ lineHeight: '1.5' }}> бесплатная доска объявлений недвижимости в ДНР</span>
            </h1>
            <p className="text-base md:text-lg text-neutral-300 mb-8 max-w-xl mx-auto">
              Аренда и продажа квартир, домов и участков
            </p>

            {/* Extended Search Form — dark glassmorphic */}
            <div className="max-w-4xl mx-auto mb-8">
              <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-2.5 shadow-2xl border border-white/10">
                <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
                  {(['Тип сделки', 'Тип объекта', 'Комнаты'] as const).map((placeholder, i) => (
                    <div key={placeholder} className="col-span-1">
                      <select
                        className="w-full px-3 py-3 rounded-xl bg-white/8 text-white focus:outline-none focus:ring-2 focus:ring-[#FF8C42]/60 cursor-pointer text-sm border border-white/10 hover:border-white/20 transition-colors appearance-none"
                        style={{ background: 'rgba(255,255,255,0.06)' }}
                      >
                        <option className="bg-[#2D2D2D] text-white" value="">{placeholder}</option>
                        {i === 0 && <><option className="bg-[#2D2D2D]" value="rent">Аренда</option><option className="bg-[#2D2D2D]" value="sale">Продажа</option></>}
                        {i === 1 && <><option className="bg-[#2D2D2D]" value="apartment">Квартира</option><option className="bg-[#2D2D2D]" value="house">Дом</option><option className="bg-[#2D2D2D]" value="land">Участок</option></>}
                        {i === 2 && <><option className="bg-[#2D2D2D]" value="1">1-к</option><option className="bg-[#2D2D2D]" value="2">2-к</option><option className="bg-[#2D2D2D]" value="3">3-к</option><option className="bg-[#2D2D2D]" value="4">4+</option></>}
                      </select>
                    </div>
                  ))}
                  <div className="col-span-1">
                    <input
                      type="text"
                      placeholder="Цена от"
                      className="w-full px-3 py-3 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#FF8C42]/60 text-sm border border-white/10 hover:border-white/20 transition-colors"
                      style={{ background: 'rgba(255,255,255,0.06)' }}
                    />
                  </div>
                  <div className="col-span-1">
                    <input
                      type="text"
                      placeholder="Цена до"
                      className="w-full px-3 py-3 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#FF8C42]/60 text-sm border border-white/10 hover:border-white/20 transition-colors"
                      style={{ background: 'rgba(255,255,255,0.06)' }}
                    />
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <Link
                      href="/map"
                      className="w-full bg-gradient-to-r from-[#FF8C42] to-[#FF7B2A] hover:from-[#FF7B2A] hover:to-[#FF8C42] text-white px-4 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 text-sm shadow-lg shadow-[#FF8C42]/30 hover:shadow-[#FF8C42]/50"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      Найти
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              {[
                { value: '1 200+', label: 'объектов' },
                { value: '7', label: 'районов' },
                { value: '850+', label: 'клиентов' },
                { value: '100%', label: 'бесплатно' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center gap-3 px-5 py-3 rounded-2xl border border-white/10"
                  style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)' }}
                >
                  <span className="text-xl font-bold text-white">{stat.value}</span>
                  <span className="text-neutral-400 text-sm">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Image Slider Controls */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {HERO_IMAGES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentHeroImage(index)}
              className={`h-1.5 rounded-full transition-all ${
                index === currentHeroImage 
                  ? 'bg-[#FF8C42] w-8' 
                  : 'bg-white/30 w-6 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 bg-[#1A1A1A]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Категории</h2>
            <p className="text-sm text-neutral-400 max-w-xl mx-auto">
              Выберите тип недвижимости
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {CATEGORIES.map((category) => (
              <Link
                key={category.title}
                href={`/listings?category=${category.key}`}
                className="group relative w-40 h-36 rounded-xl bg-[#252525] border border-white/5 hover:border-[#FF8C42]/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#FF8C42]/10 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent" />
                <div className="relative h-full flex flex-col items-center justify-center p-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {CATEGORY_ICONS[category.icon as keyof typeof CATEGORY_ICONS]}
                  </div>
                  <h3 className="text-xs font-bold text-white text-center mb-1 leading-tight">{category.title}</h3>
                  <span className="text-[#FF8C42] font-semibold text-xs">{category.count}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-20 bg-[#2D2D2D]">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Рекомендуемые</h2>
              <p className="text-base text-neutral-400">Лучшие предложения</p>
            </div>
            <Link
              href="/listings"
              className="text-[#FF8C42] font-semibold hover:text-[#FFA96D] transition-colors flex items-center gap-2 group text-sm"
            >
              Смотреть все
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {FEATURED_LISTINGS.slice(0, 5).map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-4">
            {FEATURED_LISTINGS.slice(5, 10).map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-[#222222]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-[#FF8C42] text-xs font-semibold tracking-widest uppercase mb-2">Просто и быстро</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Как это работает</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                step: '01',
                title: 'Разместите объявление',
                desc: 'Заполните форму, добавьте фото и укажите цену — это бесплатно',
                icon: (
                  <svg className="w-6 h-6 text-[#FF8C42]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                ),
              },
              {
                step: '02',
                title: 'Получите обращения',
                desc: 'Покупатели и арендаторы сами выйдут на связь через чат или звонок',
                icon: (
                  <svg className="w-6 h-6 text-[#FF8C42]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                ),
              },
              {
                step: '03',
                title: 'Заключите сделку',
                desc: 'Встретьтесь с покупателем и успешно завершите сделку',
                icon: (
                  <svg className="w-6 h-6 text-[#FF8C42]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
              },
            ].map((item, i) => (
              <div key={item.step} className="relative flex flex-col items-center text-center p-6 rounded-2xl border border-white/5 bg-[#2D2D2D]/60">
                {i < 2 && (
                  <div className="hidden md:block absolute top-10 right-0 translate-x-1/2 z-10 text-white/15 text-xl">→</div>
                )}
                <div className="w-12 h-12 rounded-xl bg-[#FF8C42]/12 border border-[#FF8C42]/20 flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <span className="text-[#FF8C42]/50 text-xs font-mono font-bold tracking-widest mb-2">{item.step}</span>
                <h3 className="text-white font-semibold text-base mb-2">{item.title}</h3>
                <p className="text-neutral-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#1A1A1A] relative overflow-hidden" style={{ isolation: 'isolate', contain: 'paint' }}>
        {/* subtle background orbs — contained, no bleed */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-64 h-64 bg-[#FF8C42] rounded-full blur-[80px] opacity-[0.05]" />
          <div className="absolute top-1/2 right-1/3 -translate-y-1/2 w-64 h-64 bg-[#FF7B2A] rounded-full blur-[80px] opacity-[0.05]" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center border border-white/5 rounded-3xl p-10 bg-[#2D2D2D]/50 backdrop-blur-sm">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF8C42]/10 border border-[#FF8C42]/20 text-[#FF8C42] text-xs font-semibold tracking-wide mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF8C42] animate-pulse" />
              Бесплатно · Без регистрации карты
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Разместите объявление
            </h2>
            <p className="text-neutral-400 mb-8 max-w-md mx-auto text-sm leading-relaxed">
              Найдите арендаторов или покупателей за считанные дни. Тысячи просмотров с первого дня.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/create"
                className="bg-gradient-to-r from-[#FF8C42] to-[#FF7B2A] hover:from-[#FF7B2A] hover:to-[#FF8C42] text-white px-8 py-3.5 rounded-xl font-semibold transition-all shadow-lg shadow-[#FF8C42]/30 hover:shadow-[#FF8C42]/50 hover:-translate-y-0.5 text-sm"
              >
                Создать бесплатно →
              </Link>
              <Link
                href="/listings"
                className="bg-white/5 text-neutral-300 hover:text-white px-8 py-3.5 rounded-xl font-semibold transition-all border border-white/5 hover:border-white/10 hover:bg-white/10 text-sm"
              >
                Смотреть объекты
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0D0D0D] border-t border-white/10 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 bg-gradient-to-br from-[#FF8C42] to-[#FF7B2A] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-base">Т</span>
                </div>
                <div>
                  <span className="text-base font-bold text-white">Тут.ру</span>
                  <p className="text-[10px] text-neutral-500">Недвижимость Донецка</p>
                </div>
              </div>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Современный сервис для аренды и продажи недвижимости
              </p>
              <div className="flex gap-2 mt-4">
                <a href="https://t.me/tutru_donetsk" className="w-8 h-8 bg-white/5 hover:bg-[#FF8C42] rounded-md flex items-center justify-center transition-all">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.008-1.252-.241-1.865-.44-.751-.244-1.349-.374-1.297-.789.027-.216.324-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.477-1.635.099-.002.321.023.465.141.119.098.152.228.166.331.016.118.033.383.022.591z"/>
                  </svg>
                </a>
                <a href="https://vk.com/tutru_donetsk" className="w-8 h-8 bg-white/5 hover:bg-[#FF8C42] rounded-md flex items-center justify-center transition-all">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M15.073 2H8.937C5.004 2 2 4.988 2 8.916v6.167C2 18.988 4.993 22 8.926 22h6.147c3.933 0 6.927-2.988 6.927-6.916V8.916C22 4.988 19.007 2 15.073 2z"/>
                    <path d="M16.704 15.773c.782 0 1.206-.07 1.206-.07s.256-.053.384-.17c.117-.108.114-.31.114-.31s-.018-.956-1.224-1.098c-.99-.116-1.355-.477-1.355-.477s-.36-.277-.36-.795c0-.477.14-.853.571-1.224.395-.34.562-.605.562-.605s.28-.433-.311-.617c-.592-.184-1.355.371-1.355.371s-.774.55-1.074.55c-.3 0-.445-.238-.445-.238s-.269-.571-.628-.571c-.36 0-.687.371-.687.371s-.382.403-.89.403c-.508 0-1.135-.488-1.135-.488s-.477-.403-.837-.403c-.36 0-.64.347-.64.347s-.36.456-.837.456c-.477 0-1.064-.456-1.064-.456s-.53-.347-.925-.347c-.395 0-.592.206-.592.206s-.347.371-.347.826c0 .456.238.985.238.985s.14.301.325.562c.184.261.238.347.238.347s.117.163.117.456c0 .293-.14.64-.14.64s-.184.382-.184.763c0 .382.184.617.184.617s.184.238.424.238h1.593s.477-.07.715.163c.238.233.238.509.238.509s.011.273.129.413c.117.14.336.14.336.14h1.69s.797-.047.944-.261c.147-.214.164-.562.164-.562s.011-.273.129-.413c.117-.14.336-.14.336-.14h1.69s.797-.047.944-.261c.147-.214.164-.562.164-.562z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm">Разделы</h4>
              <ul className="space-y-2 text-neutral-400 text-sm">
                <li><Link href="/" className="hover:text-[#FF8C42] transition-colors">Главная</Link></li>
                <li><Link href="/map" className="hover:text-[#FF8C42] transition-colors">Карта</Link></li>
                <li><Link href="/listings" className="hover:text-[#FF8C42] transition-colors">Объявления</Link></li>
                <li><Link href="/create" className="hover:text-[#FF8C42] transition-colors">Создать</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm">Помощь</h4>
              <ul className="space-y-2 text-neutral-400 text-sm">
                <li><Link href="/faq" className="hover:text-[#FF8C42] transition-colors">FAQ</Link></li>
                <li><Link href="/support" className="hover:text-[#FF8C42] transition-colors">Поддержка</Link></li>
                <li><Link href="/contact" className="hover:text-[#FF8C42] transition-colors">Контакты</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm">Контакты</h4>
              <ul className="space-y-3 text-neutral-400 text-sm">
                <li className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-neutral-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  info@tut.ru
                </li>
                <li className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-neutral-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  +7 (XXX) XXX-XX-XX
                </li>
                <li className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-neutral-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Донецк, ДНР
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-neutral-500 text-sm">
            <div>© 2024 Тут.ру. Все права защищены.</div>
            <div className="flex gap-4">
              <Link href="/terms" className="hover:text-white transition-colors">Условия</Link>
              <Link href="/privacy" className="hover:text-white transition-colors">Конфиденциальность</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* AI Assistant */}
      <AIAssistant />
    </main>
  );
}
