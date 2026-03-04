'use client';

import React from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Topbar } from '@/components/Topbar';
import { useAppContext } from './context/AppContext';
import { usePathname } from 'next/navigation';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAppContext();
  const pathname = usePathname();

  if (!isAuthenticated || pathname === '/login') {
    return <main className="flex-1 flex flex-col min-w-0 min-h-screen">{children}</main>;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Topbar />
        {children}
      </main>
    </div>
  );
}
