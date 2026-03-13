'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface BreadcrumbItem {
  label: string;
  href: string;
}

export function Breadcrumbs() {
  const pathname = usePathname() ?? '';
  
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const paths = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];
    
    // Always add Home
    breadcrumbs.push({ label: 'Главная', href: '/' });
    
    let accumulatedPath = '';
    paths.forEach((path, index) => {
      accumulatedPath += `/${path}`;
      
      // Format label
      let label = path
        .replace(/-/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
      
      // Special cases
      if (path === 'listings') label = 'Объявления';
      if (path === 'map') label = 'Карта';
      if (path === 'create') label = 'Создать объявление';
      if (path === 'profile') label = 'Профиль';
      if (path === 'favorites') label = 'Избранное';
      if (path === 'messages') label = 'Сообщения';
      if (path === 'promotions') label = 'Продвижение';
      if (path === 'admin') label = 'Админ панель';
      if (path === 'login') label = 'Вход';
      if (path === 'register') label = 'Регистрация';
      
      // Don't add last item (current page) if not home
      if (index === paths.length - 1 && pathname !== '/') {
        return;
      }
      
      breadcrumbs.push({ label, href: accumulatedPath });
    });
    
    return breadcrumbs;
  };
  
  const breadcrumbs = generateBreadcrumbs();
  
  if (!pathname || pathname === '/') return null;
  
  return (
    <nav className="flex items-center gap-2 text-sm" aria-label="Breadcrumb">
      {breadcrumbs.map((breadcrumb, index) => (
        <div key={breadcrumb.href} className="flex items-center gap-2">
          {index > 0 && (
            <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
          {index < breadcrumbs.length - 1 ? (
            <Link
              href={breadcrumb.href}
              className="text-gray-400 hover:text-blue-400 transition-colors whitespace-nowrap"
            >
              {breadcrumb.label}
            </Link>
          ) : (
            <span className="text-white font-medium whitespace-nowrap">{breadcrumb.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}

// Compact version for mobile
export function BreadcrumbsCompact() {
  const pathname = usePathname() ?? '';
  
  if (!pathname || pathname === '/') return null;
  
  const currentPage = pathname.split('/').pop()?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || '';
  
  return (
    <div className="flex items-center gap-2 text-sm">
      <Link href="/" className="text-gray-400 hover:text-blue-400 transition-colors">
        Главная
      </Link>
      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
      <span className="text-white font-medium">{currentPage}</span>
    </div>
  );
}
