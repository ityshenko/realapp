'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { PROMOTION_TYPES } from '@/lib/constants';

const MY_LISTINGS = [
  { id: '1', title: '2-к квартира центр', price: 45000, views: 150, active: true },
  { id: '2', title: '1-к квартира near парк', price: 35000, views: 89, active: true },
  { id: '3', title: 'Студия в новостройке', price: 28000, views: 45, active: false },
];

const PRICING = {
  boost: { 1: 10, 7: 60, 30: 200 },
  highlight: { 1: 10, 7: 60, 30: 200 },
  combo: { 1: 18, 7: 100, 30: 350 },
};

export default function PromotionsPage() {
  const [selectedListing, setSelectedListing] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedDuration, setSelectedDuration] = useState(1);
  const [showPayment, setShowPayment] = useState(false);

  const calculatePrice = () => {
    if (!selectedType) return 0;
    const type = selectedType as keyof typeof PRICING;
    return PRICING[type][selectedDuration as 1 | 7 | 30] || 0;
  };

  return (
    <main className="min-h-screen bg-[#353535]">
      <Header />

      <div className="container mx-auto px-4 py-8 pt-28">
        <h1 className="text-3xl font-bold text-white mb-8">Продвижение объявлений</h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Promotion Types */}
          <div className="space-y-6">
            <div className="bg-[#2a2a2a] rounded-2xl p-6 border border-white/10">
              <h2 className="text-xl font-bold text-white mb-6">Типы продвижения</h2>
              
              <div className="space-y-4">
                {PROMOTION_TYPES.map((type) => (
                  <button
                    key={type.type}
                    onClick={() => setSelectedType(type.type)}
                    className={`w-full p-6 rounded-xl border-2 transition-all text-left ${
                      selectedType === type.type
                        ? 'border-blue-500 bg-blue-600/20'
                        : 'border-white/10 bg-[#353535] hover:border-blue-500/50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-4xl">{type.icon}</span>
                      <div>
                        <h3 className="text-lg font-bold text-white">{type.name}</h3>
                        <p className="text-gray-400 text-sm mt-1">
                          от {PRICING[type.type as keyof typeof PRICING][1]} ₽/день
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div className="bg-[#2a2a2a] rounded-2xl p-6 border border-white/10">
              <h2 className="text-xl font-bold text-white mb-6">Длительность</h2>
              
              <div className="grid grid-cols-3 gap-4">
                {[
                  { days: 1, label: '1 день', discount: '' },
                  { days: 7, label: '7 дней', discount: '-15%' },
                  { days: 30, label: '30 дней', discount: '-30%' },
                ].map((d) => (
                  <button
                    key={d.days}
                    onClick={() => setSelectedDuration(d.days)}
                    className={`relative p-4 rounded-xl border-2 transition-all ${
                      selectedDuration === d.days
                        ? 'border-blue-500 bg-blue-600/20'
                        : 'border-white/10 bg-[#353535] hover:border-blue-500/50'
                    }`}
                  >
                    {d.discount && (
                      <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {d.discount}
                      </span>
                    )}
                    <div className="text-white font-semibold">{d.label}</div>
                    <div className="text-gray-400 text-sm mt-1">
                      {calculatePrice() > 0 && (
                        <>
                          {(calculatePrice() / d.days).toFixed(0)} ₽/день
                        </>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Select Listing */}
            <div className="bg-[#2a2a2a] rounded-2xl p-6 border border-white/10">
              <h2 className="text-xl font-bold text-white mb-6">Выберите объявление</h2>
              
              <div className="space-y-3">
                {MY_LISTINGS.map((listing) => (
                  <button
                    key={listing.id}
                    onClick={() => setSelectedListing(listing.id)}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center gap-4 ${
                      selectedListing === listing.id
                        ? 'border-blue-500 bg-blue-600/20'
                        : 'border-white/10 bg-[#353535] hover:border-blue-500/50'
                    }`}
                  >
                    <div className="flex-1">
                      <h3 className="text-white font-semibold">{listing.title}</h3>
                      <p className="text-gray-400 text-sm">
                        {listing.price.toLocaleString()} ₽ • {listing.views} просмотров
                      </p>
                    </div>
                    {listing.active && (
                      <span className="px-3 py-1 bg-green-600/20 text-green-400 rounded-full text-xs font-semibold">
                        Активно
                      </span>
                    )}
                  </button>
                ))}
              </div>

              <button className="w-full mt-4 bg-[#353535] hover:bg-[#404040] text-white py-3 rounded-xl font-semibold transition-all border border-white/10 border-dashed">
                + Создать новое объявление
              </button>
            </div>

            {/* Order Summary */}
            <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 rounded-2xl p-6 border border-blue-500/30">
              <h2 className="text-xl font-bold text-white mb-6">Итого</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between text-gray-300">
                  <span>Тип продвижения:</span>
                  <span className="text-white font-semibold">
                    {PROMOTION_TYPES.find(t => t.type === selectedType)?.name || 'Не выбрано'}
                  </span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Длительность:</span>
                  <span className="text-white font-semibold">{selectedDuration} дн.</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Объявление:</span>
                  <span className="text-white font-semibold">
                    {MY_LISTINGS.find(l => l.id === selectedListing)?.title || 'Не выбрано'}
                  </span>
                </div>
                
                <div className="border-t border-white/20 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">К оплате:</span>
                    <span className="text-3xl font-bold text-white">
                      {calculatePrice()} ₽
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setShowPayment(true)}
                  disabled={!selectedListing || !selectedType}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white py-4 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/30"
                >
                  Оплатить продвижение
                </button>

                <p className="text-xs text-gray-400 text-center">
                  🔒 Безопасная оплата через ЮKassa
                </p>
              </div>
            </div>

            {/* Active Promotions */}
            <div className="bg-[#2a2a2a] rounded-2xl p-6 border border-white/10">
              <h2 className="text-xl font-bold text-white mb-6">Активные продвижения</h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-[#353535] rounded-xl border border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-semibold">2-к квартира центр</span>
                    <span className="px-3 py-1 bg-yellow-600/20 text-yellow-400 rounded-full text-xs font-semibold">
                      🔥 Комбо
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>Осталось 5 дней</span>
                    <span>до 15.02.2024</span>
                  </div>
                  <div className="mt-3 w-full bg-[#2a2a2a] rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#2a2a2a] rounded-2xl p-8 max-w-md w-full border border-white/10">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💳</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Оплата продвижения</h2>
              <p className="text-gray-400">Сумма: <span className="text-white font-bold">{calculatePrice()} ₽</span></p>
            </div>

            <div className="space-y-4 mb-6">
              <button className="w-full p-4 bg-[#353535] hover:bg-[#404040] rounded-xl transition-all border border-white/10 flex items-center gap-4">
                <span className="text-2xl">💳</span>
                <span className="text-white">Банковская карта</span>
              </button>
              <button className="w-full p-4 bg-[#353535] hover:bg-[#404040] rounded-xl transition-all border border-white/10 flex items-center gap-4">
                <span className="text-2xl">🏦</span>
                <span className="text-white">ЮKassa</span>
              </button>
              <button className="w-full p-4 bg-[#353535] hover:bg-[#404040] rounded-xl transition-all border border-white/10 flex items-center gap-4">
                <span className="text-2xl">⚡</span>
                <span className="text-white">СБП</span>
              </button>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowPayment(false)}
                className="flex-1 bg-[#353535] hover:bg-[#404040] text-white py-4 rounded-xl font-semibold transition-all border border-white/10"
              >
                Отмена
              </button>
              <button className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-semibold transition-all">
                Оплатить
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
