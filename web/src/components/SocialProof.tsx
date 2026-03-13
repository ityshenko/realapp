'use client';

import { useState, useEffect } from 'react';

interface SocialProofProps {
  listingId: string;
  className?: string;
}

export function SocialProof({ listingId, className = '' }: SocialProofProps) {
  // Use fixed initial values to avoid hydration mismatch
  const [viewers, setViewers] = useState(7);
  const [favoritesToday, setFavoritesToday] = useState(15);
  const [callsThisWeek, setCallsThisWeek] = useState(5);

  // Randomize values after mount (client-side only)
  useEffect(() => {
    setViewers(Math.floor(Math.random() * 20) + 5);
    setFavoritesToday(Math.floor(Math.random() * 50) + 10);
    setCallsThisWeek(Math.floor(Math.random() * 15) + 3);
  }, []);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setViewers(prev => {
        const change = Math.floor(Math.random() * 5) - 2;
        return Math.max(1, prev + change);
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Live Viewers */}
      <div className="flex items-center gap-2 bg-green-600/20 border border-green-500/30 rounded-xl px-4 py-3">
        <div className="relative">
          <span className="text-xl">👁️</span>
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
        </div>
        <div className="flex-1">
          <p className="text-green-400 font-semibold text-sm">
            {viewers} чел. смотрят сейчас
          </p>
          <p className="text-green-500/70 text-xs">Активный интерес!</p>
        </div>
      </div>

      {/* Favorites Today */}
      <div className="flex items-center gap-2 bg-pink-600/20 border border-pink-500/30 rounded-xl px-4 py-3">
        <span className="text-xl">❤️</span>
        <div className="flex-1">
          <p className="text-pink-400 font-semibold text-sm">
            {favoritesToday} добавили в избранное сегодня
          </p>
          <p className="text-pink-500/70 text-xs">Популярный объект</p>
        </div>
      </div>

      {/* Calls This Week */}
      <div className="flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 rounded-xl px-4 py-3">
        <span className="text-xl">📞</span>
        <div className="flex-1">
          <p className="text-blue-400 font-semibold text-sm">
            {callsThisWeek} звонков за неделю
          </p>
          <p className="text-blue-500/70 text-xs">Высокий спрос</p>
        </div>
      </div>

      {/* Urgency Banner */}
      {viewers > 10 && (
        <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 border border-orange-500/30 rounded-xl px-4 py-3 animate-pulse">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔥</span>
            <p className="text-orange-400 font-semibold text-sm">
              Высокий спрос! Рекомендуем не откладывать просмотр
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Recent activity popup
export function RecentActivity() {
  const activities = [
    { action: 'просмотр', time: '2 мин назад', location: 'Ворошиловский' },
    { action: 'добавил в избранное', time: '5 мин назад', location: 'Киевский' },
    { action: 'позвонил', time: '12 мин назад', location: 'Калининский' },
    { action: 'запросил контакты', time: '25 мин назад', location: 'Центр' },
  ];

  return (
    <div className="bg-[#2a2a2a] rounded-2xl border border-white/10 overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-white/5">
        <h3 className="text-white font-bold flex items-center gap-2">
          <span className="text-xl">📊</span>
          Активность на сайте
        </h3>
        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
      </div>
      <div className="divide-y divide-white/5">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-center gap-3 p-3 hover:bg-[#353535] transition-all">
            <div className="w-8 h-8 bg-blue-600/20 rounded-full flex items-center justify-center">
              <span className="text-sm">
                {activity.action.includes('просмотр') && '👁️'}
                {activity.action.includes('избранное') && '❤️'}
                {activity.action.includes('позвонил') && '📞'}
                {activity.action.includes('контакты') && '📋'}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-white text-sm">
                Пользователь <span className="text-blue-400">{activity.action}</span> объект
              </p>
              <p className="text-gray-500 text-xs">{activity.time} • {activity.location}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Trust badges
export function TrustBadges() {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="text-center p-4 bg-[#2a2a2a] rounded-xl border border-white/5">
        <div className="text-3xl mb-2">✓</div>
        <p className="text-white font-semibold text-sm">Проверено</p>
        <p className="text-gray-500 text-xs">Документы</p>
      </div>
      <div className="text-center p-4 bg-[#2a2a2a] rounded-xl border border-white/5">
        <div className="text-3xl mb-2">🔒</div>
        <p className="text-white font-semibold text-sm">Безопасно</p>
        <p className="text-gray-500 text-xs">Сделка</p>
      </div>
      <div className="text-center p-4 bg-[#2a2a2a] rounded-xl border border-white/5">
        <div className="text-3xl mb-2">⭐</div>
        <p className="text-white font-semibold text-sm">4.9/5</p>
        <p className="text-gray-500 text-xs">Рейтинг</p>
      </div>
    </div>
  );
}
