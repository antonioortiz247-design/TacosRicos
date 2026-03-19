import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tacos Ricos',
  description: 'PWA de pedidos para taquerías con delivery y administración',
  manifest: '/manifest.json'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
