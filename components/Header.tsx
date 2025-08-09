'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="border-b border-green-200 bg-white">
      <div className="container mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-extrabold text-green-900">
          Tamales Dali
        </Link>
        <nav className="flex items-center gap-6 text-green-800">
          <Link href="/menu">Menú</Link>
          <Link href="/cobertura">Cobertura</Link>
          <Link href="/historia">Nuestra historia</Link>
          <Link href="/cuenta">Cuenta</Link>
        </nav>
      </div>
    </header>
  );
}
