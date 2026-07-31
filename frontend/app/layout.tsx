'use client'; // usePathname kullanmak için client component yapmalıyiz

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Mic, Bell, User } from 'lucide-react';

const inter = Inter({ subsets: ["latin"] });

// Navigasyon menüsü verisi
const navItems = [
  { name: 'Dashboard', href: '/' },
  { name: 'Projects', href: '/projects' },
  { name: 'My Maps', href: '/my-maps' },
  { name: 'Library', href: '/library' },
  { name: 'Integrations', href: '/integrations' },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname(); // Mevcut URL path'ini alır (ör: /projects)

  return (
    <html lang="en" className="dark bg-[#0d0f17]">
      <body className={`${inter.className} min-h-screen bg-[#0d0f17] text-slate-100 font-sans flex flex-col antialiased`}>
        
        {/* ================= 1. HEADER (ÜST MENÜ - TÜM SAYFALARDA ORTAK) ================= */}
        <header className="border-b border-[#1f2438] bg-[#121622] px-6 py-3.5 flex items-center justify-between z-50 sticky top-0 antialiased selection:bg-indigo-500 selection:text-white">
          
          {/* Logo ve İsim */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Mic className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white">Vocalyze</h1>
              <p className="text-[9px] tracking-widest text-purple-400 font-semibold uppercase">
                AI AUDIO MAPPER
              </p>
            </div>
          </Link>

          {/* Dinamik Navigasyon Sekmeleri (İstenen Kısım Burası) */}
          <nav className="flex items-center gap-1 bg-[#090b10] p-1 rounded-xl border border-[#1f2438]">
            {navItems.map((item) => {
              // URL pathname ile item'ın href'i eşleşiyorsa "aktif" olarak işaretle
              // Dashboard ('/') için tam eşleşme, diğerleri için başlangıç eşleşmesi kontrolü
              const isActive = item.href === '/' 
                ? pathname === '/' 
                : pathname.startsWith(item.href);

              return (
                <Link 
                  key={item.href} 
                  href={item.href}
                  className={`px-5 py-1.5 rounded-lg text-sm font-medium transition active:scale-95 whitespace-nowrap ${
                    isActive 
                      ? 'bg-[#1a2035] text-white shadow-sm' // Aktif buton stili
                      : 'text-slate-400 hover:text-slate-200' // Normal buton stili
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Sağ Taraf (Bildirim & Profil) */}
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-xl bg-[#1a2035] hover:bg-[#252b45] text-slate-300 transition relative border border-[#252b45] active:scale-95">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-pink-500"></span>
            </button>
            <div className="flex items-center gap-3 border-l border-[#1f2438] pl-4">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-0.5">
                <div className="w-full h-full bg-[#121622] rounded-full flex items-center justify-center overflow-hidden">
                  <User className="w-5 h-5 text-indigo-300" />
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 bg-[#0d0f17]">
  {children}
</main>
        
      </body>
    </html>
  );
}