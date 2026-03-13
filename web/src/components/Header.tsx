'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';
import api from '@/lib/api';

export function Header() {
  const { isAuthenticated, user, _hasHydrated } = useAuthStore();
  const pathname = usePathname() ?? '';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  // Fetch unread messages count
  useEffect(() => {
    if (isAuthenticated) {
      api.get('/api/messages/unread/count')
        .then(res => setUnreadCount(res.data.unreadCount || 0))
        .catch(() => setUnreadCount(0));
    }
  }, [isAuthenticated]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#1A1A1A]/95 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 bg-gradient-to-br from-[#FF8C42] to-[#FF7B2A] rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-[#FF8C42]/50 transition-all">
              <span className="text-white font-bold text-base">Т</span>
            </div>
            <div>
              <span className="text-base font-bold text-white">Тут.ру</span>
              <p className="text-[10px] text-neutral-400 -mt-0.5">Недвижимость в ДНР</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {[
              { href: '/', label: 'Главная', active: isActive('/') },
              { href: '/map', label: 'Карта недвижимости', active: isActive('/map'), isSpecial: true },
              { href: '/listings?deal=rent', label: 'Аренда', active: isActive('/listings') && pathname.includes('rent') },
              { href: '/listings?deal=sale', label: 'Продажа', active: isActive('/listings') && pathname.includes('sale') },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                  item.isSpecial
                    ? item.active
                      ? 'bg-gradient-to-r from-[#FF8C42] to-[#FF7B2A] text-white shadow-lg shadow-[#FF8C42]/30'
                      : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                    : item.active
                      ? 'text-[#FF8C42] bg-[#FF8C42]/8'
                      : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
                {item.active && !item.isSpecial && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#FF8C42]" />
                )}
              </Link>
            ))}
            <Link
              href="/create"
              className="ml-3 bg-gradient-to-r from-[#FF8C42] to-[#FF7B2A] hover:from-[#FF7B2A] hover:to-[#FF8C42] text-white px-5 py-2.5 rounded-lg font-semibold transition-all shadow-[#FF8C42]/30 shadow-lg hover:shadow-[#FF8C42]/50 text-sm"
            >
              + Объявление
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Social Icons - Next to Favorites */}
            <div className="hidden lg:flex items-center gap-2">
              <a
                href="https://t.me/tutru_donetsk"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/5 hover:bg-[#FF8C42] rounded-lg flex items-center justify-center transition-all hover:scale-105"
                title="Telegram"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.008-1.252-.241-1.865-.44-.751-.244-1.349-.374-1.297-.789.027-.216.324-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.477-1.635.099-.002.321.023.465.141.119.098.152.228.166.331.016.118.033.383.022.591z"/>
                </svg>
              </a>
              <a
                href="https://vk.com/tutru_donetsk"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/5 hover:bg-[#FF8C42] rounded-lg flex items-center justify-center transition-all hover:scale-105"
                title="VKontakte"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M15.073 2H8.937C5.004 2 2 4.988 2 8.916v6.167C2 18.988 4.993 22 8.926 22h6.147c3.933 0 6.927-2.988 6.927-6.916V8.916C22 4.988 19.007 2 15.073 2z"/>
                  <path d="M16.704 15.773c.782 0 1.206-.07 1.206-.07s.256-.053.384-.17c.117-.108.114-.31.114-.31s-.018-.956-1.224-1.098c-.99-.116-1.355-.477-1.355-.477s-.36-.277-.36-.795c0-.477.14-.853.571-1.224.395-.34.562-.605.562-.605s.28-.433-.311-.617c-.592-.184-1.355.371-1.355.371s-.774.55-1.074.55c-.3 0-.445-.238-.445-.238s-.269-.571-.628-.571c-.36 0-.687.371-.687.371s-.382.403-.89.403c-.508 0-1.135-.488-1.135-.488s-.477-.403-.837-.403c-.36 0-.64.347-.64.347s-.36.456-.837.456c-.477 0-1.064-.456-1.064-.456s-.53-.347-.925-.347c-.395 0-.592.206-.592.206s-.347.371-.347.826c0 .456.238.985.238.985s.14.301.325.562c.184.261.238.347.238.347s.117.163.117.456c0 .293-.14.64-.14.64s-.184.382-.184.763c0 .382.184.617.184.617s.184.238.424.238h1.593s.477-.07.715.163c.238.233.238.509.238.509s.011.273.129.413c.117.14.336.14.336.14h1.69s.797-.047.944-.261c.147-.214.164-.562.164-.562s.011-.273.129-.413c.117-.14.336-.14.336-.14h1.69s.797-.047.944-.261c.147-.214.164-.562.164-.562z"/>
                </svg>
              </a>
              <div className="w-px h-6 bg-white/10 mx-1" />
              <a
                href="/admin/login"
                className="w-10 h-10 bg-white/5 hover:bg-[#FF8C42] rounded-lg flex items-center justify-center transition-all hover:scale-105"
                title="Админ панель"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </a>
            </div>

            <Link href="/favorites" className="hidden md:flex items-center gap-2 text-neutral-300 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="text-sm font-medium">Избранное</span>
            </Link>

            {/* Notifications Icon - Only for authenticated users */}
            {isAuthenticated && (
              <Link href="/messages" className="hidden md:flex items-center gap-2 text-neutral-300 hover:text-white transition-colors relative">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#FF8C42] text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </Link>
            )}

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-10 h-10 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center transition-all border border-white/10"
              aria-label="Меню"
            >
              {isMobileMenuOpen ? (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
  
            <ThemeToggle />
  
            {!_hasHydrated ? (
              // Show loading state during hydration
              <div className="hidden md:flex items-center gap-3">
                <div className="w-16 h-9 bg-[#3A3A3A] rounded-lg animate-pulse" />
                <div className="w-24 h-9 bg-[#3A3A3A] rounded-lg animate-pulse" />
              </div>
            ) : isAuthenticated ? (
              <div className="hidden md:flex items-center gap-3">
                <Link href="/profile" className="text-sm text-neutral-300 hover:text-white transition-colors">
                  {user?.name || 'Профиль'}
                </Link>
                <a
                  href="https://t.me/tutru_donetsk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-neutral-300 hover:text-white transition-colors flex items-center gap-2"
                  title="Техподдержка в Telegram"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-1.414 1.414M6.343 17.657l-1.414 1.414M9 6h.01M15 6h.01M9 10h6m-7 9a4 4 0 01-4-4V5a2 2 0 012-2h12a2 2 0 012 2v10a4 4 0 01-4 4H8z" />
                  </svg>
                  Техподдержка
                </a>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link
                  href="/login"
                  className="bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-lg font-semibold transition-all border border-white/20 text-sm font-medium"
                >
                  Войти
                </Link>
                <Link
                  href="/register"
                  className="bg-white/5 hover:bg-white/10 text-white px-5 py-2.5 rounded-lg font-semibold transition-all border border-white/20 text-sm"
                >
                  Регистрация
                </Link>
                <a
                  href="https://t.me/tutru_donetsk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-neutral-300 hover:text-white transition-colors flex items-center gap-2"
                  title="Техподдержка в Telegram"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-1.414 1.414M6.343 17.657l-1.414 1.414M9 6h.01M15 6h.01M9 10h6m-7 9a4 4 0 01-4-4V5a2 2 0 012-2h12a2 2 0 012 2v10a4 4 0 01-4 4H8z" />
                  </svg>
                  Техподдержка
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden animate-slide-down border-t border-white/10">
            <nav className="flex flex-col py-3 gap-1">
              {[
                { href: '/', label: 'Главная' },
                { href: '/map', label: 'Карта недвижимости', isSpecial: true },
                { href: '/listings?deal=rent', label: 'Аренда' },
                { href: '/listings?deal=sale', label: 'Продажа' },
                { href: '/favorites', label: 'Избранное' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    item.isSpecial
                      ? 'bg-white/10 text-white border border-white/20'
                      : isActive(item.href) ? 'text-[#FF8C42] bg-[#FF8C42]/8' : 'text-neutral-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              {isAuthenticated && (
                <Link href="/messages" onClick={() => setIsMobileMenuOpen(false)} className="px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-300 hover:text-white hover:bg-white/5 flex items-center justify-between">
                  Сообщения
                  {unreadCount > 0 && (
                    <span className="bg-[#FF8C42] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </Link>
              )}
              <div className="mt-3 pt-3 border-t border-white/10 flex flex-col gap-2">
                {isAuthenticated ? (
                  <>
                    <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)} className="px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-300 hover:text-white hover:bg-white/5">Профиль</Link>
                    <Link href="/create" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center bg-gradient-to-r from-[#FF8C42] to-[#FF7B2A] text-white px-5 py-3 rounded-xl font-semibold text-sm">+ Создать объявление</Link>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center bg-white/5 border border-white/15 text-white px-5 py-3 rounded-xl font-semibold text-sm">Войти</Link>
                    <Link href="/register" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center bg-gradient-to-r from-[#FF8C42] to-[#FF7B2A] text-white px-5 py-3 rounded-xl font-semibold text-sm">Регистрация</Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
