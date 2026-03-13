import type { NextPageContext } from 'next';
import Link from 'next/link';

type ErrorPageProps = {
  statusCode?: number;
};

export default function ErrorPage({ statusCode }: ErrorPageProps) {
  return (
    <main style={{ padding: 24, fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif' }}>
      <h1 style={{ fontSize: 22, margin: 0 }}>Произошла ошибка</h1>
      <p style={{ marginTop: 12, marginBottom: 0, opacity: 0.85 }}>
        {statusCode ? `HTTP ${statusCode}` : 'Ошибка на клиенте'}
      </p>
      <p style={{ marginTop: 16 }}>
        <Link href="/">На главную</Link>
      </p>
    </main>
  );
}

ErrorPage.getInitialProps = ({ res, err }: NextPageContext): ErrorPageProps => {
  const statusCode = res?.statusCode ?? err?.statusCode ?? 500;
  return { statusCode };
};

