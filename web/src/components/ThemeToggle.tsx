'use client';

import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'amoled';

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('dark');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    }
  }, []);

  const applyTheme = (newTheme: Theme) => {
    document.documentElement.classList.remove('light', 'dark', 'amoled');
    document.documentElement.classList.add(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const changeTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 bg-[#2a2a2a] hover:bg-[#353535] rounded-xl flex items-center justify-center transition-all border border-white/10"
        title="Сменить тему"
      >
        {theme === 'light' ? (
          <span className="text-xl">☀️</span>
        ) : theme === 'amoled' ? (
          <span className="text-xl">🌑</span>
        ) : (
          <span className="text-xl">🌙</span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-[#2a2a2a] rounded-2xl border border-white/10 shadow-2xl overflow-hidden z-50 animate-slide-down">
          <div className="p-2">
            <button
              onClick={() => changeTheme('light')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                theme === 'light' ? 'bg-blue-600/20 text-blue-400' : 'hover:bg-[#353535]'
              }`}
            >
              <span className="text-xl">☀️</span>
              <div className="text-left">
                <p className="text-white font-medium text-sm">Светлая</p>
                <p className="text-gray-500 text-xs">Классический дизайн</p>
              </div>
            </button>

            <button
              onClick={() => changeTheme('dark')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                theme === 'dark' ? 'bg-blue-600/20 text-blue-400' : 'hover:bg-[#353535]'
              }`}
            >
              <span className="text-xl">🌙</span>
              <div className="text-left">
                <p className="text-white font-medium text-sm">Тёмная</p>
                <p className="text-gray-500 text-xs">Рекомендуемая</p>
              </div>
            </button>

            <button
              onClick={() => changeTheme('amoled')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                theme === 'amoled' ? 'bg-blue-600/20 text-blue-400' : 'hover:bg-[#353535]'
              }`}
            >
              <span className="text-xl">🌑</span>
              <div className="text-left">
                <p className="text-white font-medium text-sm">AMOLED</p>
                <p className="text-gray-500 text-xs">Глубокий чёрный</p>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
