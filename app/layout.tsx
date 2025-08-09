import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tamales Dali',
  description: 'Tamales tradicionales en hoja de plátano',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-white text-green-900">{children}</body>
    </html>
  );
