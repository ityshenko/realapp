'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { useAuthStore } from '@/store';

const MOCK_USER = {
  name: 'Иван Петров',
  phone: '+7 (999) 123-45-67',
  email: 'ivan@example.com',
  rating: 4.5,
  reviewsCount: 12,
  memberSince: 'Январь 2024',
  isVerified: true,
  avatar: 'https://placehold.co/200x200/4A90D9/FFFFFF?text=User',
};

const MOCK_LISTINGS = [
  { id: '1', title: '2-к квартира центр', description: 'Двухкомнатная квартира в центре города', price: 45000, status: 'active', views: 150, favorites: 25 },
  { id: '2', title: '1-к квартира near парк', description: 'Однокомнатная квартира рядом с парком', price: 35000, status: 'active', views: 89, favorites: 12 },
  { id: '3', title: 'Студия в новостройке', description: 'Современная студия в новом жилом комплексе', price: 28000, status: 'pending', views: 45, favorites: 8 },
];

const MOCK_STATS = {
  totalViews: 1247,
  totalFavorites: 89,
  activeListings: 5,
  totalMessages: 34,
};

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('listings');

  return (
    <main className="min-h-screen bg-[#353535]">
      <Header />

      <div className="container mx-auto px-4 py-12 pt-24">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-[#2a2a2a] rounded-2xl p-6 border border-white/10 sticky top-28">
              {/* Avatar & Info */}
              <div className="text-center mb-6">
                <img
                  src={MOCK_USER.avatar}
                  alt={MOCK_USER.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-blue-500/30"
                />
                <h2 className="text-xl font-bold text-white">{MOCK_USER.name}</h2>
                <p className="text-gray-400 text-sm">{MOCK_USER.phone}</p>
                {MOCK_USER.isVerified && (
                  <div className="mt-2 inline-flex items-center gap-1 bg-green-600/20 text-green-400 px-3 py-1 rounded-full text-xs font-semibold">
                    ✓ Проверен
                  </div>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center justify-center gap-2 mb-6 pb-6 border-b border-white/10">
                <span className="text-yellow-500 text-xl">★</span>
                <span className="text-white font-bold text-lg">{MOCK_USER.rating}</span>
                <span className="text-gray-400 text-sm">({MOCK_USER.reviewsCount} отзывов)</span>
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('listings')}
                  className={`w-full text-left px-4 py-3 rounded-xl font-semibold transition-all ${
                    activeTab === 'listings'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:bg-[#353535]'
                  }`}
                >
                  Мои объявления
                </button>
                <button
                  onClick={() => setActiveTab('stats')}
                  className={`w-full text-left px-4 py-3 rounded-xl font-semibold transition-all ${
                    activeTab === 'stats'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:bg-[#353535]'
                  }`}
                >
                  Статистика
                </button>
                <button
                  onClick={() => setActiveTab('favorites')}
                  className={`w-full text-left px-4 py-3 rounded-xl font-semibold transition-all ${
                    activeTab === 'favorites'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:bg-[#353535]'
                  }`}
                >
                  Избранное
                </button>
                <button
                  onClick={() => setActiveTab('messages')}
                  className={`w-full text-left px-4 py-3 rounded-xl font-semibold transition-all ${
                    activeTab === 'messages'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:bg-[#353535]'
                  }`}
                >
                  Сообщения
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full text-left px-4 py-3 rounded-xl font-semibold transition-all ${
                    activeTab === 'settings'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:bg-[#353535]'
                  }`}
                >
                  Настройки
                </button>
              </nav>

              {/* Actions */}
              <div className="mt-6 space-y-3">
                <Link
                  href="/create"
                  className="block w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white text-center py-3 rounded-xl font-semibold transition-all"
                >
                  + Создать объявление
                </Link>
                <Link
                  href="/promotions"
                  className="block w-full bg-[#353535] hover:bg-[#404040] text-white text-center py-3 rounded-xl font-semibold transition-all border border-white/10"
                >
                  💰 Продвижение
                </Link>
              </div>

              {/* Logout */}
              <button
                onClick={() => logout()}
                className="w-full mt-4 text-red-400 hover:text-red-300 text-sm py-2 font-semibold"
              >
                Выйти
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'listings' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold text-white">Мои объявления</h1>
                  <Link
                    href="/create"
                    className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold transition-all"
                  >
                    + Добавить
                  </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-[#2a2a2a] rounded-xl p-4 border border-white/10">
                    <div className="text-2xl font-bold text-white">{MOCK_STATS.activeListings}</div>
                    <div className="text-gray-400 text-sm">Активных</div>
                  </div>
                  <div className="bg-[#2a2a2a] rounded-xl p-4 border border-white/10">
                    <div className="text-2xl font-bold text-blue-400">{MOCK_STATS.totalViews}</div>
                    <div className="text-gray-400 text-sm">Просмотров</div>
                  </div>
                  <div className="bg-[#2a2a2a] rounded-xl p-4 border border-white/10">
                    <div className="text-2xl font-bold text-pink-400">{MOCK_STATS.totalFavorites}</div>
                    <div className="text-gray-400 text-sm">В избранном</div>
                  </div>
                </div>

                {/* Listings Table */}
                <div className="bg-[#2a2a2a] rounded-2xl border border-white/10 overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-[#252525]">
                      <tr className="text-left text-gray-400 text-sm">
                        <th className="px-6 py-4 font-medium">Объявление</th>
                        <th className="px-6 py-4 font-medium">Цена</th>
                        <th className="px-6 py-4 font-medium">Просмотры</th>
                        <th className="px-6 py-4 font-medium">Статус</th>
                        <th className="px-6 py-4 font-medium">Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_LISTINGS.map((listing) => (
                        <tr key={listing.id} className="border-t border-white/5">
                          <td className="px-6 py-4">
                            <div className="text-white font-semibold">{listing.title}</div>
                          </td>
                          <td className="px-6 py-4 text-blue-400 font-semibold">
                            {listing.price.toLocaleString()} ₽
                          </td>
                          <td className="px-6 py-4 text-gray-400">{listing.views}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              listing.status === 'active' ? 'bg-green-600/20 text-green-400' :
                              listing.status === 'pending' ? 'bg-yellow-600/20 text-yellow-400' :
                              'bg-red-600/20 text-red-400'
                            }`}>
                              {listing.status === 'active' ? 'Активно' :
                               listing.status === 'pending' ? 'На проверке' : 'Скрыто'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <Link
                                href={`/listings/${listing.id}`}
                                className="text-blue-400 hover:text-blue-300 text-sm font-semibold"
                              >
                                Просмотр
                              </Link>
                              <Link
                                href={`/edit/${listing.id}`}
                                className="text-gray-400 hover:text-white text-sm font-semibold"
                              >
                                Редактировать
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'stats' && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold text-white">Статистика</h1>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-[#2a2a2a] rounded-2xl p-6 border border-white/10">
                    <h3 className="text-lg font-bold text-white mb-4">Просмотры за 30 дней</h3>
                    <div className="h-48 bg-[#1a1a2e] rounded-xl flex items-center justify-center">
                      <p className="text-gray-500">График загружается...</p>
                    </div>
                  </div>

                  <div className="bg-[#2a2a2a] rounded-2xl p-6 border border-white/10">
                    <h3 className="text-lg font-bold text-white mb-4">Источники трафика</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Поиск</span>
                        <span className="text-white font-semibold">45%</span>
                      </div>
                      <div className="w-full bg-[#353535] rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }} />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Карта</span>
                        <span className="text-white font-semibold">30%</span>
                      </div>
                      <div className="w-full bg-[#353535] rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '30%' }} />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Прямые заходы</span>
                        <span className="text-white font-semibold">25%</span>
                      </div>
                      <div className="w-full bg-[#353535] rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: '25%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'favorites' && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold text-white">Избранное</h1>
                <div className="bg-[#2a2a2a] rounded-2xl p-8 border border-white/10 text-center">
                  <p className="text-gray-400">У вас пока нет избранных объявлений</p>
                  <Link
                    href="/listings"
                    className="inline-block mt-4 text-blue-400 hover:text-blue-300 font-semibold"
                  >
                    Смотреть все объявления →
                  </Link>
                </div>
              </div>
            )}

            {activeTab === 'messages' && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold text-white">Сообщения</h1>
                <div className="bg-[#2a2a2a] rounded-2xl p-8 border border-white/10 text-center">
                  <p className="text-gray-400">У вас {MOCK_STATS.totalMessages} сообщений</p>
                  <Link
                    href="/messages"
                    className="inline-block mt-4 text-blue-400 hover:text-blue-300 font-semibold"
                  >
                    Открыть чат →
                  </Link>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold text-white">Настройки</h1>
                
                <div className="bg-[#2a2a2a] rounded-2xl p-6 border border-white/10">
                  <h3 className="text-lg font-bold text-white mb-6">Личная информация</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Имя</label>
                      <input
                        type="text"
                        defaultValue={MOCK_USER.name}
                        className="w-full bg-[#353535] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Телефон</label>
                      <input
                        type="tel"
                        defaultValue={MOCK_USER.phone}
                        className="w-full bg-[#353535] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Email</label>
                      <input
                        type="email"
                        defaultValue={MOCK_USER.email}
                        className="w-full bg-[#353535] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none"
                      />
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-semibold transition-all">
                      Сохранить изменения
                    </button>
                  </div>
                </div>

                <div className="bg-[#2a2a2a] rounded-2xl p-6 border border-white/10">
                  <h3 className="text-lg font-bold text-white mb-6">Безопасность</h3>
                  <div className="space-y-4">
                    <button className="text-left w-full bg-[#353535] hover:bg-[#404040] p-4 rounded-xl transition-all border border-white/10">
                      <div className="text-white font-semibold">Изменить пароль</div>
                      <div className="text-gray-400 text-sm mt-1">Регулярно меняйте пароль для безопасности</div>
                    </button>
                    <button className="text-left w-full bg-[#353535] hover:bg-[#404040] p-4 rounded-xl transition-all border border-white/10">
                      <div className="text-white font-semibold">Двухфакторная аутентификация</div>
                      <div className="text-gray-400 text-sm mt-1">Дополнительная защита аккаунта</div>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
