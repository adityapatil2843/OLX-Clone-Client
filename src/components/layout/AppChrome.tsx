'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { Footer } from './Footer';
import { BottomNav } from './BottomNav';

const ChromeContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const isStandalone =
    ['/login', '/register', '/verify-otp'].some((route) => pathname.startsWith(route)) ||
    pathname.startsWith('/admin');

  if (isStandalone) {
    return (
      <div className="flex min-h-screen flex-1 flex-col">
        <Header />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-1 flex-col">
      <Header />
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer />
      <BottomNav />
    </div>
  );
};

export const AppChrome: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <React.Suspense
      fallback={
        <div className="flex min-h-screen flex-1 flex-col">
          <Header />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
        </div>
      }
    >
      <ChromeContent>{children}</ChromeContent>
    </React.Suspense>
  );
};
