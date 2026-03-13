import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import '../styles/globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata: Metadata = {
  title: 'RealApp - Недвижимость Донецка',
  description: 'Аренда и продажа недвижимости в Донецке. Квартиры, дома, участки на карте города.',
  keywords: ['недвижимость', 'Донецк', 'аренда', 'продажа', 'квартиры', 'дома', 'участки'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
(function () {
  try {
    var t = localStorage.getItem('theme');
    if (!t) return;
    document.documentElement.classList.remove('light','dark','amoled');
    document.documentElement.classList.add(t);
  } catch (e) {}
})();`,
          }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
