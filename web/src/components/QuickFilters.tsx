'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface QuickFilter {
  id: string;
  label: string;
  icon: string;
  value: string;
  active?: boolean;
}

const DEFAULT_FILTERS: QuickFilter[] = [
  { id: 'rent', label: 'Аренда', icon: '🏠', value: 'deal:rent' },
  { id: 'sale', label: 'Продажа', icon: '💰', value: 'deal:sale' },
  { id: '1room', label: '1-к', icon: '🏢', value: 'rooms:1' },
  { id: '2room', label: '2-к', icon: '🏢', value: 'rooms:2' },
  { id: '3room', label: '3-к', icon: '🏢', value: 'rooms:3' },
  { id: 'furniture', label: 'С мебелью', icon: '🪑', value: 'feature:furniture' },
  { id: 'newbuilding', label: 'Новостройки', icon: '🏗️', value: 'feature:new' },
  { id: 'under50k', label: 'До 50к', icon: '💵', value: 'price:50000' },
  { id: 'under100k', label: 'До 100к', icon: '💵', value: 'price:100000' },
  { id: 'center', label: 'Центр', icon: '📍', value: 'district:center' },
];

interface QuickFiltersProps {
  filters?: QuickFilter[];
  className?: string;
}

export function QuickFilters({ filters = DEFAULT_FILTERS, className = '' }: QuickFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());

  const toggleFilter = (filterValue: string) => {
    const newFilters = new Set(activeFilters);
    if (newFilters.has(filterValue)) {
      newFilters.delete(filterValue);
    } else {
      newFilters.add(filterValue);
    }
    setActiveFilters(newFilters);

    // Update URL
    const params = new URLSearchParams(searchParams?.toString() ?? '');
    if (newFilters.size > 0) {
      params.set('filters', Array.from(newFilters).join(','));
    } else {
      params.delete('filters');
    }
    router.push(`/listings?${params.toString()}`);
  };

  return (
    <div className={`flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide ${className}`}>
      {filters.map((filter) => {
        const isActive = activeFilters.has(filter.value);
        return (
          <button
            key={filter.id}
            onClick={() => toggleFilter(filter.value)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition-all duration-300 ${
              isActive
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/30 scale-105'
                : 'bg-[#2a2a2a] text-gray-400 hover:bg-[#353535] hover:text-white border border-white/10'
            }`}
          >
            <span className="text-lg">{filter.icon}</span>
            <span>{filter.label}</span>
            {isActive && (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        );
      })}
    </div>
  );
}

// Horizontal scrollable container for filters
export function QuickFiltersContainer({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#353535] to-transparent pointer-events-none z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#353535] to-transparent pointer-events-none z-10" />
      
      {/* Scrollable content */}
      <div className="overflow-x-auto scrollbar-hide">
        {children}
      </div>
    </div>
  );
}
