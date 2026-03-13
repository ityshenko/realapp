'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface Suggestion {
  type: 'district' | 'street' | 'building' | 'metro';
  text: string;
  icon: string;
  count?: number;
}

const SUGGESTIONS: Suggestion[] = [
  { type: 'district', text: 'Ворошиловский район', icon: '📍', count: 156 },
  { type: 'district', text: 'Киевский район', icon: '📍', count: 189 },
  { type: 'district', text: 'Калининский район', icon: '📍', count: 134 },
  { type: 'district', text: 'Будённовский район', icon: '📍', count: 98 },
  { type: 'district', text: 'Кировский район', icon: '📍', count: 87 },
  { type: 'district', text: 'Петровский район', icon: '📍', count: 76 },
  { type: 'district', text: 'Пролетарский район', icon: '📍', count: 65 },
  { type: 'street', text: 'проспект Пушкина', icon: '🛣️', count: 45 },
  { type: 'street', text: 'улица Артёма', icon: '🛣️', count: 38 },
  { type: 'street', text: 'проспект Ильича', icon: '🛣️', count: 52 },
  { type: 'street', text: 'улица Челюскинцев', icon: '🛣️', count: 34 },
  { type: 'street', text: 'проспект Науки', icon: '🛣️', count: 41 },
  { type: 'building', text: 'ЖК "Донбасс Палас"', icon: '🏢', count: 12 },
  { type: 'building', text: 'ЖК "Столичный"', icon: '🏢', count: 8 },
  { type: 'building', text: 'ЖК "Петровский"', icon: '🏢', count: 15 },
  { type: 'building', text: 'ЖК "Панорама"', icon: '🏢', count: 10 },
  { type: 'metro', text: 'Ж/д вокзал', icon: '🚉', count: 67 },
  { type: 'metro', text: 'Площадь Ленина', icon: '🚉', count: 54 },
  { type: 'metro', text: 'Проспект Мира', icon: '🚉', count: 43 },
];

interface SearchWithSuggestionsProps {
  className?: string;
  variant?: 'hero' | 'header' | 'compact';
  onSearch?: (query: string, filters: SearchFilters) => void;
}

interface SearchFilters {
  dealType?: string;
  propertyType?: string;
  rooms?: string;
  minPrice?: string;
  maxPrice?: string;
}

export function SearchWithSuggestions({ 
  className = '', 
  variant = 'hero',
  onSearch 
}: SearchWithSuggestionsProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isSearching, setIsSearching] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length > 1) {
      setIsSearching(true);
      const timer = setTimeout(() => {
        const filtered = SUGGESTIONS.filter(s =>
          s.text.toLowerCase().includes(query.toLowerCase())
        );
        setSuggestions(filtered.slice(0, 8));
        setIsSearching(false);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (suggestion: Suggestion) => {
    setQuery(suggestion.text);
    setIsOpen(false);
    performSearch(suggestion.text);
  };

  const performSearch = (searchQuery: string) => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (filters.dealType) params.set('deal', filters.dealType);
    if (filters.propertyType) params.set('type', filters.propertyType);
    if (filters.rooms) params.set('rooms', filters.rooms);
    if (filters.minPrice) params.set('minPrice', filters.minPrice);
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
    
    router.push(`/listings?${params.toString()}`);
    onSearch?.(searchQuery, filters);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      handleSelect(suggestions[selectedIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const sizeClasses = {
    hero: 'py-4 px-6 text-lg',
    header: 'py-2.5 px-4 text-sm',
    compact: 'py-2 px-3 text-sm',
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <form onSubmit={handleSubmit}>
        <div className={`relative flex items-center bg-white/90 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#FF8C42] ${sizeClasses[variant]}`}>
          <svg className="w-5 h-5 text-neutral-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
              setSelectedIndex(-1);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Район, улица, ЖК..."
            className="flex-1 bg-transparent text-neutral-800 placeholder-neutral-400 outline-none"
          />
          {isSearching && (
            <div className="w-5 h-5 border-2 border-[#FF8C42]/30 border-t-[#FF8C42] rounded-full animate-spin mr-3" />
          )}
          {query && !isSearching && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </form>

      {/* Dropdown */}
      {isOpen && (query.length > 1 || suggestions.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#2D2D2D] rounded-2xl shadow-2xl border border-white/10 overflow-hidden z-50 animate-slide-down max-h-96 overflow-y-auto">
          {/* Recent Searches */}
          {query.length <= 1 && (
            <div className="p-4 border-b border-white/5">
              <p className="text-xs text-neutral-400 mb-3 flex items-center gap-2">
                <span>🕐</span> Недавние поиски
              </p>
              <div className="flex flex-wrap gap-2">
                {['2-к квартира', 'ЖК Донбасс Палас', 'пр. Пушкина'].map((recent, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setQuery(recent);
                      performSearch(recent);
                    }}
                    className="px-3 py-1.5 bg-[#3A3A3A] hover:bg-[#FF8C42] rounded-lg text-sm text-neutral-300 hover:text-white transition-all"
                  >
                    {recent}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div>
              <p className="text-xs text-neutral-400 px-4 py-2 bg-[#252525]">
                📍 Подсказки
              </p>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSelect(suggestion)}
                  className={`w-full flex items-center justify-between px-4 py-3 hover:bg-[#3A3A3A] transition-all ${
                    index === selectedIndex ? 'bg-[#FF8C42]/20' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{suggestion.icon}</span>
                    <div className="text-left">
                      <p className="text-white font-medium">{suggestion.text}</p>
                      <p className="text-xs text-neutral-500">
                        {suggestion.type === 'district' && 'Район'}
                        {suggestion.type === 'street' && 'Улица'}
                        {suggestion.type === 'building' && 'Жилой комплекс'}
                        {suggestion.type === 'metro' && 'Транспорт'}
                      </p>
                    </div>
                  </div>
                  {suggestion.count && (
                    <span className="text-sm text-[#FF8C42] font-semibold">
                      {suggestion.count} объектов
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* No Results */}
          {query.length > 2 && suggestions.length === 0 && !isSearching && (
            <div className="p-6 text-center">
              <div className="text-4xl mb-3">🔍</div>
              <p className="text-neutral-400 mb-2">Ничего не найдено</p>
              <p className="text-sm text-neutral-500">Попробуйте другой запрос</p>
            </div>
          )}

          {/* Quick Filters */}
          <div className="p-4 border-t border-white/5 bg-[#252525]">
            <p className="text-xs text-neutral-400 mb-3 flex items-center gap-2">
              <span>⚡</span> Быстрый поиск
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: '1-к квартиры', query: '1-к' },
                { label: '2-к квартиры', query: '2-к' },
                { label: '3-к квартиры', query: '3-к' },
                { label: 'До 50 000 ₽', query: 'price:50000' },
                { label: 'До 100 000 ₽', query: 'price:100000' },
                { label: 'С мебелью', query: 'furniture' },
                { label: 'Новостройки', query: 'newbuilding' },
              ].map((filter, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setQuery(filter.label);
                    performSearch(filter.query);
                  }}
                  className="px-3 py-1.5 bg-[#FF8C42]/20 hover:bg-[#FF8C42]/30 text-[#FF8C42] rounded-lg text-xs font-medium transition-all"
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
