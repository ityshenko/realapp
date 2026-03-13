'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface SearchSuggestion {
  type: 'district' | 'street' | 'building' | 'metro';
  text: string;
  icon: string;
  count?: number;
}

const SEARCH_SUGGESTIONS: SearchSuggestion[] = [
  { type: 'building', text: 'ЖК "Донбасс Палас"', icon: '🏢', count: 12 },
  { type: 'building', text: 'ЖК "Столичный"', icon: '🏢', count: 8 },
  { type: 'building', text: 'ЖК "Петровский"', icon: '🏢', count: 15 },
  { type: 'street', text: 'пр. Пушкина', icon: '🛣️', count: 45 },
  { type: 'street', text: 'ул. Артёма', icon: '🛣️', count: 38 },
  { type: 'street', text: 'пр. Ильича', icon: '🛣️', count: 52 },
  { type: 'district', text: 'Ворошиловский район', icon: '📍', count: 156 },
  { type: 'district', text: 'Киевский район', icon: '📍', count: 189 },
  { type: 'district', text: 'Калининский район', icon: '📍', count: 134 },
  { type: 'metro', text: 'Ж/д вокзал', icon: '🚉', count: 67 },
];

interface SmartSearchProps {
  className?: string;
  variant?: 'hero' | 'header' | 'compact';
}

export function SmartSearch({ className = '', variant = 'hero' }: SmartSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length > 1) {
      setIsSearching(true);
      // Simulate API delay
      const timer = setTimeout(() => {
        const filtered = SEARCH_SUGGESTIONS.filter(s =>
          s.text.toLowerCase().includes(query.toLowerCase())
        );
        setSuggestions(filtered);
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

  const handleSelect = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.text);
    setIsOpen(false);
    router.push(`/listings?search=${encodeURIComponent(suggestion.text)}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/listings?search=${encodeURIComponent(query)}`);
    }
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
        <div className={`relative flex items-center bg-[#353535] border border-white/10 rounded-2xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all ${sizeClasses[variant]}`}>
          <svg className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            placeholder="ЖК, район, улица..."
            className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none"
          />
          {isSearching && (
            <div className="w-5 h-5 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mr-3" />
          )}
          {query && !isSearching && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="text-gray-400 hover:text-white transition-colors"
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
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#2a2a2a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 animate-slide-down">
          {/* Recent Searches */}
          {query.length <= 1 && (
            <div className="p-3 border-b border-white/5">
              <p className="text-xs text-gray-400 mb-2">🕐 Недавние поиски</p>
              <div className="flex flex-wrap gap-2">
                {['ЖК Донбасс Палас', 'пр. Пушкина', '2-к центр'].map((recent, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setQuery(recent);
                      router.push(`/listings?search=${encodeURIComponent(recent)}`);
                    }}
                    className="px-3 py-1.5 bg-[#353535] hover:bg-[#404040] rounded-lg text-sm text-gray-300 hover:text-white transition-all"
                  >
                    {recent}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="max-h-80 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSelect(suggestion)}
                  className={`w-full flex items-center justify-between px-4 py-3 hover:bg-[#353535] transition-all ${
                    index === selectedIndex ? 'bg-blue-600/20' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{suggestion.icon}</span>
                    <div className="text-left">
                      <p className="text-white font-medium">{suggestion.text}</p>
                      <p className="text-xs text-gray-400">
                        {suggestion.type === 'district' && 'Район'}
                        {suggestion.type === 'street' && 'Улица'}
                        {suggestion.type === 'building' && 'Жилой комплекс'}
                        {suggestion.type === 'metro' && 'Транспорт'}
                      </p>
                    </div>
                  </div>
                  {suggestion.count && (
                    <span className="text-sm text-blue-400 font-semibold">
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
              <p className="text-gray-400 mb-2">Ничего не найдено</p>
              <p className="text-sm text-gray-500">Попробуйте другой запрос</p>
            </div>
          )}

          {/* Quick Filters */}
          <div className="p-3 border-t border-white/5 bg-[#252525]">
            <p className="text-xs text-gray-400 mb-2">⚡ Быстрый поиск</p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: '1-к квартиры', query: '1-к' },
                { label: '2-к квартиры', query: '2-к' },
                { label: 'До 50 000 ₽', query: 'price:50000' },
                { label: 'С мебелью', query: 'furniture' },
              ].map((filter, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setQuery(filter.query);
                    router.push(`/listings?quick=${filter.query}`);
                  }}
                  className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg text-xs font-medium transition-all"
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
