'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const MOCK_STATS = {
  totalListings: 1247,
  activeListings: 892,
  pendingListings: 45,
  blockedListings: 12,
  totalUsers: 3456,
  newUsersToday: 23,
  revenueToday: 15400,
  revenueMonth: 456000,
  viewsToday: 12450,
  favoritesToday: 234,
};

const MOCK_LISTINGS = [
  { id: '1', title: '2-к квартира центр', description: 'Двухкомнатная квартира в центре города', price: 45000, status: 'active', views: 150, date: '2024-01-15', owner: 'Иван П.' },
  { id: '2', title: '1-к квартира near парк', description: 'Однокомнатная квартира рядом с парком', price: 35000, status: 'pending', views: 89, date: '2024-01-14', owner: 'Анна С.' },
  { id: '3', title: '3-к квартира просторная', description: 'Просторная трехкомнатная квартира', price: 65000, status: 'active', views: 234, date: '2024-01-13', owner: 'Сергей К.' },
  { id: '4', title: 'Дом с участком', description: 'Частный дом с большим участком', price: 8500000, status: 'blocked', views: 567, date: '2024-01-12', owner: 'Ольга М.' },
  { id: '5', title: 'Студия в новостройке', description: 'Современная студия в новом жилом комплексе', price: 28000, status: 'active', views: 123, date: '2024-01-11', owner: 'Дмитрий В.' },
];

const DEFAULT_PRICING = {
  boost1: 10,
  boost7: 60,
  boost30: 200,
  highlight1: 10,
  highlight7: 60,
  highlight30: 200,
  combo1: 18,
  combo7: 100,
  combo30: 350,
};

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [pricing, setPricing] = useState(DEFAULT_PRICING);
  const [listings, setListings] = useState(MOCK_LISTINGS);
  const [showPricingModal, setShowPricingModal] = useState(false);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuthenticated');
    if (!isAuthenticated) {
      router.push('/admin/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    router.push('/admin/login');
  };

  const handleDeleteListing = (id: string) => {
    setListings(listings.filter(l => l.id !== id));
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    setListings(listings.map(l => l.id === id ? { ...l, status: newStatus } : l));
  };

  const handleSavePricing = () => {
    localStorage.setItem('adminPricing', JSON.stringify(pricing));
    setShowPricingModal(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-600/20 text-green-400';
      case 'pending': return 'bg-yellow-600/20 text-yellow-400';
      case 'blocked': return 'bg-red-600/20 text-red-400';
      default: return 'bg-gray-600/20 text-gray-400';
    }
  };

  return (
    <main className="min-h-screen bg-[#353535]">
      {/* Admin Header */}
      <header className="bg-[#2a2a2a] border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">Р</span>
              </div>
              <div>
                <h1 className="text-white font-bold">Тут.ру Админ</h1>
                <p className="text-xs text-gray-400">Панель управления</p>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`text-sm font-semibold transition-colors ${
                  activeTab === 'dashboard' ? 'text-blue-400' : 'text-gray-400 hover:text-white'
                }`}
              >
                Статистика
              </button>
              <button
                onClick={() => setActiveTab('listings')}
                className={`text-sm font-semibold transition-colors ${
                  activeTab === 'listings' ? 'text-blue-400' : 'text-gray-400 hover:text-white'
                }`}
              >
                Объявления
              </button>
              <button
                onClick={() => setShowPricingModal(true)}
                className="text-sm font-semibold text-gray-400 hover:text-white transition-colors"
              >
                Настройки цен
              </button>
            </nav>

            <button
              onClick={handleLogout}
              className="bg-red-600/20 hover:bg-red-600/30 text-red-400 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            >
              Выйти
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {activeTab === 'dashboard' && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Всего объявлений"
                value={MOCK_STATS.totalListings}
                icon="📋"
                trend="+12%"
              />
              <StatCard
                title="Активные"
                value={MOCK_STATS.activeListings}
                icon="✓"
                trend="+5%"
                trendUp
              />
              <StatCard
                title="Пользователей"
                value={MOCK_STATS.totalUsers}
                icon="👥"
                trend={`+${MOCK_STATS.newUsersToday} сегодня`}
                trendUp
              />
              <StatCard
                title="Доход за месяц"
                value={`${(MOCK_STATS.revenueMonth / 1000).toFixed(0)}к ₽`}
                icon="💰"
                trend="+18%"
                trendUp
              />
            </div>

            {/* More Stats */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-[#2a2a2a] rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white">Просмотры сегодня</h3>
                  <span className="text-3xl">👁️</span>
                </div>
                <div className="text-3xl font-bold text-white mb-2">{MOCK_STATS.viewsToday.toLocaleString()}</div>
                <div className="text-green-400 text-sm">+15% к вчера</div>
              </div>

              <div className="bg-[#2a2a2a] rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white">В избранном</h3>
                  <span className="text-3xl">❤️</span>
                </div>
                <div className="text-3xl font-bold text-white mb-2">{MOCK_STATS.favoritesToday}</div>
                <div className="text-green-400 text-sm">+8% к вчера</div>
              </div>

              <div className="bg-[#2a2a2a] rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white">Ожидают модерации</h3>
                  <span className="text-3xl">⏳</span>
                </div>
                <div className="text-3xl font-bold text-white mb-2">{MOCK_STATS.pendingListings}</div>
                <div className="text-yellow-400 text-sm">Требуют внимания</div>
              </div>
            </div>

            {/* Recent Listings */}
            <div className="bg-[#2a2a2a] rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Последние объявления</h3>
                <button
                  onClick={() => setActiveTab('listings')}
                  className="text-blue-400 hover:text-blue-300 text-sm font-semibold"
                >
                  Все объявления →
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-400 text-sm border-b border-white/10">
                      <th className="pb-3 font-medium">Объявление</th>
                      <th className="pb-3 font-medium">Цена</th>
                      <th className="pb-3 font-medium">Владелец</th>
                      <th className="pb-3 font-medium">Просмотры</th>
                      <th className="pb-3 font-medium">Статус</th>
                      <th className="pb-3 font-medium">Дата</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listings.slice(0, 5).map((listing) => (
                      <tr key={listing.id} className="border-b border-white/5">
                        <td className="py-4 text-white">{listing.title}</td>
                        <td className="py-4 text-blue-400 font-semibold">{listing.price.toLocaleString()} ₽</td>
                        <td className="py-4 text-gray-400">{listing.owner}</td>
                        <td className="py-4 text-gray-400">{listing.views}</td>
                        <td className="py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(listing.status)}`}>
                            {listing.status === 'active' ? 'Активно' : listing.status === 'pending' ? 'На проверке' : 'Заблокировано'}
                          </span>
                        </td>
                        <td className="py-4 text-gray-400">{listing.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === 'listings' && (
          <div className="bg-[#2a2a2a] rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Управление объявлениями</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Поиск..."
                  className="bg-[#353535] border border-white/10 rounded-xl px-4 py-2 text-white placeholder-gray-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-400 text-sm border-b border-white/10">
                    <th className="pb-3 font-medium">Объявление</th>
                    <th className="pb-3 font-medium">Цена</th>
                    <th className="pb-3 font-medium">Владелец</th>
                    <th className="pb-3 font-medium">Статус</th>
                    <th className="pb-3 font-medium">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {listings.map((listing) => (
                    <tr key={listing.id} className="border-b border-white/5">
                      <td className="py-4 text-white">{listing.title}</td>
                      <td className="py-4 text-blue-400 font-semibold">{listing.price.toLocaleString()} ₽</td>
                      <td className="py-4 text-gray-400">{listing.owner}</td>
                      <td className="py-4">
                        <select
                          value={listing.status}
                          onChange={(e) => handleStatusChange(listing.id, e.target.value)}
                          className="bg-[#353535] border border-white/10 rounded-lg px-3 py-1 text-white text-sm focus:border-blue-500 outline-none cursor-pointer"
                        >
                          <option value="active">Активно</option>
                          <option value="pending">На проверке</option>
                          <option value="blocked">Заблокировано</option>
                        </select>
                      </td>
                      <td className="py-4">
                        <div className="flex gap-2">
                          <Link
                            href={`/listings/${listing.id}`}
                            className="text-blue-400 hover:text-blue-300 text-sm font-semibold"
                          >
                            Просмотр
                          </Link>
                          <button
                            onClick={() => handleDeleteListing(listing.id)}
                            className="text-red-400 hover:text-red-300 text-sm font-semibold"
                          >
                            Удалить
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Pricing Modal */}
      {showPricingModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#2a2a2a] rounded-2xl p-8 max-w-2xl w-full border border-white/10 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Настройки цен на продвижение</h2>
              <button
                onClick={() => setShowPricingModal(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Boost Pricing */}
              <div>
                <h3 className="text-lg font-bold text-blue-400 mb-4">📈 Поднять в поиске</h3>
                <div className="grid grid-cols-3 gap-4">
                  <PricingInput
                    label="1 день"
                    value={pricing.boost1}
                    onChange={(v) => setPricing({ ...pricing, boost1: v })}
                  />
                  <PricingInput
                    label="7 дней"
                    value={pricing.boost7}
                    onChange={(v) => setPricing({ ...pricing, boost7: v })}
                  />
                  <PricingInput
                    label="30 дней"
                    value={pricing.boost30}
                    onChange={(v) => setPricing({ ...pricing, boost30: v })}
                  />
                </div>
              </div>

              {/* Highlight Pricing */}
              <div>
                <h3 className="text-lg font-bold text-yellow-400 mb-4">⭐ Выделить цветом</h3>
                <div className="grid grid-cols-3 gap-4">
                  <PricingInput
                    label="1 день"
                    value={pricing.highlight1}
                    onChange={(v) => setPricing({ ...pricing, highlight1: v })}
                  />
                  <PricingInput
                    label="7 дней"
                    value={pricing.highlight7}
                    onChange={(v) => setPricing({ ...pricing, highlight7: v })}
                  />
                  <PricingInput
                    label="30 дней"
                    value={pricing.highlight30}
                    onChange={(v) => setPricing({ ...pricing, highlight30: v })}
                  />
                </div>
              </div>

              {/* Combo Pricing */}
              <div>
                <h3 className="text-lg font-bold text-green-400 mb-4">🔥 Комбо (Поднять + Выделить)</h3>
                <div className="grid grid-cols-3 gap-4">
                  <PricingInput
                    label="1 день"
                    value={pricing.combo1}
                    onChange={(v) => setPricing({ ...pricing, combo1: v })}
                  />
                  <PricingInput
                    label="7 дней"
                    value={pricing.combo7}
                    onChange={(v) => setPricing({ ...pricing, combo7: v })}
                  />
                  <PricingInput
                    label="30 дней"
                    value={pricing.combo30}
                    onChange={(v) => setPricing({ ...pricing, combo30: v })}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={handleSavePricing}
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-semibold transition-all"
              >
                Сохранить цены
              </button>
              <button
                onClick={() => setShowPricingModal(false)}
                className="px-8 bg-[#353535] hover:bg-[#404040] text-white py-4 rounded-xl font-semibold transition-all border border-white/10"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function StatCard({ title, value, icon, trend, trendUp }: { title: string; value: string | number; icon: string; trend: string; trendUp?: boolean }) {
  return (
    <div className="bg-[#2a2a2a] rounded-2xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-400 text-sm">{title}</h3>
        <span className="text-3xl">{icon}</span>
      </div>
      <div className="text-3xl font-bold text-white mb-2">{value}</div>
      <div className={`text-sm ${trendUp ? 'text-green-400' : 'text-gray-400'}`}>{trend}</div>
    </div>
  );
}

function PricingInput({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <label className="block text-sm text-gray-400 mb-2">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value) || 0)}
        className="w-full bg-[#353535] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
      />
    </div>
  );
}
