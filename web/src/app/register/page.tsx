'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      setLoading(false);
      return;
    }

    await new Promise(resolve => setTimeout(resolve, 1000));

    login(
      { id: '1', name: formData.name, phone: formData.phone, role: 'user' },
      'mock_token',
      'mock_refresh'
    );
    router.push('/profile');
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
          <p className="text-neutral-400 mt-1">Регистрация</p>
        </div>

        {/* Register Form */}
        <div className="bg-[#2D2D2D] rounded-2xl p-8 border border-white/10">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm text-neutral-400 mb-2">Имя</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Иван Петров"
                className="w-full bg-[#3A3A3A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:border-[#FF8C42] focus:ring-1 focus:ring-[#FF8C42] outline-none transition-all"
                required
              />
            </div>

            <div className="mb-4">
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

            <div className="mb-4">
              <label className="block text-sm text-neutral-400 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="example@mail.ru"
                className="w-full bg-[#3A3A3A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:border-[#FF8C42] focus:ring-1 focus:ring-[#FF8C42] outline-none transition-all"
              />
            </div>

            <div className="mb-4">
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

            <div className="mb-6">
              <label className="block text-sm text-neutral-400 mb-2">Подтвердите пароль</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
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
              {loading ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/login" className="text-neutral-400 hover:text-white text-sm">
              Уже есть аккаунт? Войти
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
