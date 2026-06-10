import type { Metadata, Viewport } from 'next';
import { Fredoka, Poppins } from 'next/font/google';
import './globals.css';
import { FloatingCart } from '@/components/FloatingCart';

const displayFont = Fredoka({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-display'
});

const bodyFont = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body'
});

export const metadata: Metadata = {
  title: 'tu restaurante app · Menús QR interactivos',
  description: 'Menús interactivos, experiencias deliciosas. Pedidos, personalización y delivery con panel admin.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'tu restaurante app',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: '/icons/icon-192.svg',
    apple: '/icons/icon-192.svg',
  },
};

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${displayFont.variable} ${bodyFont.variable} h-full`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                  document.documentElement.classList.toggle('dark', prefersDark);
                  if (window.matchMedia) {
                    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
                      document.documentElement.classList.toggle('dark', e.matches);
                    });
                  }
                } catch (e) {}
              })();
            `
          }}
        />
      </head>
      <body className="h-full font-body antialiased">
        {children}
        <FloatingCart />
      </body>
    </html>
  );
}
