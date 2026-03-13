'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [formData, setFormData] = useState({ phone: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    await new Promise(resolve => setTimeout(resolve, 1000));

    if (formData.phone && formData.password) {
      login(
        { id: '1', name: 'Иван Петров', phone: formData.phone, role: 'user' },
        'mock_token',
        'mock_refresh'
      );
      router.push('/profile');
    } else {
      setError('Введите телефон и пароль');
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#1A1A1A] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-[#FF8C42] to-[#FF7B2A] rounded-2xl flex items-center justify-center shadow-lg shadow-[#FF8C42]/30 mx-auto mb-4">
            <span className="text-white font-bold text-3xl">Т</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Тут.ру</h1>
          <p className="text-neutral-400 mt-1">Вход в личный кабинет</p>
        </div>

        {/* Login Form */}
        <div className="bg-[#2D2D2D] rounded-2xl p-8 border border-white/10">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm text-neutral-400 mb-2">Телефон</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+7 (___) ___-__-__"
                className="w-full bg-[#3A3A3A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:border-[#FF8C42] focus:ring-1 focus:ring-[#FF8C42] outline-none transition-all"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm text-neutral-400 mb-2">Пароль</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full bg-[#3A3A3A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:border-[#FF8C42] focus:ring-1 focus:ring-[#FF8C42] outline-none transition-all"
                required
              />
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-600/20 border border-red-500/50 rounded-xl text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#FF8C42] to-[#FF7B2A] hover:from-[#FF7B2A] hover:to-[#FF8C42] text-white py-4 rounded-xl font-semibold transition-all shadow-lg shadow-[#FF8C42]/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Вход...' : 'Войти'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/register" className="text-[#FF8C42] hover:text-[#FFA96D] text-sm font-semibold">
              Нет аккаунта? Зарегистрироваться
            </Link>
          </div>

          <div className="mt-4 text-center">
            <Link href="/" className="text-neutral-400 hover:text-white text-sm transition-colors">
              ← Вернуться на главную
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
