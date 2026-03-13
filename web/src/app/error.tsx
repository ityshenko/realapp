'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen bg-[#1A1A1A] text-white flex items-center justify-center p-6">
      <div className="max-w-lg w-full bg-white/5 border border-white/10 rounded-2xl p-6">
        <h1 className="text-2xl font-bold">Произошла ошибка</h1>
        <p className="text-white/70 mt-2 break-words">
          {error.message || 'Что-то пошло не так.'}
        </p>
        <div className="mt-5 flex gap-3">
          <button
            onClick={() => reset()}
            className="px-4 py-2 rounded-xl bg-[#FF8C42] text-black hover:text-white font-semibold"
          >
            Повторить
          </button>
          <Link
            href="/"
            className="px-4 py-2 rounded-xl border border-white/20 text-white"
          >
            На главную
          </Link>
        </div>
      </div>
    </main>
  );
}
