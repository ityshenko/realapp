'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const ADMIN_PASSWORD = 'admin';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    if (password === ADMIN_PASSWORD) {
      // Store admin session
      localStorage.setItem('adminAuthenticated', 'true');
      router.push('/admin/dashboard');
    } else {
      setError('Неверный пароль');
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#353535] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 mx-auto mb-4">
            <span className="text-white font-bold text-3xl">Р</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Тут.ру</h1>
          <p className="text-gray-400 mt-1">Админ панель</p>
        </div>

        {/* Login Form */}
        <div className="bg-[#2a2a2a] rounded-2xl p-8 border border-white/10">
          <h2 className="text-xl font-bold text-white mb-6 text-center">Вход для администратора</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm text-gray-400 mb-2">Пароль</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введите пароль"
                className="w-full bg-[#353535] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
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
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white py-4 rounded-xl font-semibold transition-all shadow-lg shadow-blue-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Вход...' : 'Войти'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="text-gray-400 hover:text-white text-sm transition-colors">
              ← Вернуться на главную
            </Link>
          </div>
        </div>

        {/* Security Note */}
        <p className="text-center text-gray-500 text-sm mt-6">
          🔒 Безопасное соединение
        </p>
      </div>
    </main>
  );
}
