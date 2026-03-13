import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#1A1A1A] text-white flex items-center justify-center p-6">
      <div className="max-w-lg w-full bg-white/5 border border-white/10 rounded-2xl p-6">
        <h1 className="text-2xl font-bold">Страница не найдена</h1>
        <p className="text-white/70 mt-2">HTTP 404</p>
        <div className="mt-5">
          <Link
            href="/"
            className="inline-flex px-4 py-2 rounded-xl bg-[#FF8C42] text-black hover:text-white font-semibold"
          >
            На главную
          </Link>
        </div>
      </div>
    </main>
  );
}
