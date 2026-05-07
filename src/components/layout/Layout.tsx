import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Sheet, SheetContent } from '@/components/ui/sheet';

export function Layout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ backgroundColor: 'var(--color-deep-space)' }}
    >
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col flex-shrink-0" style={{ width: 260 }}>
        <Sidebar />
      </aside>

      {/* Mobile Sidebar via Sheet */}
      <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
        <SheetContent
          side="left"
          className="p-0 w-[260px] border-r-0"
          style={{
            backgroundColor: 'var(--color-deep-space)',
            borderRight: '1px solid rgba(112,112,125,0.2)',
          }}
        >
          <Sidebar onNavClick={() => setMobileSidebarOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main content column */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Sticky Header */}
        <Header onMenuClick={() => setMobileSidebarOpen(true)} />

        {/* Page content */}
        <main
          className="flex-1 overflow-y-auto"
          style={{ backgroundColor: 'var(--color-deep-space)' }}
        >
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
