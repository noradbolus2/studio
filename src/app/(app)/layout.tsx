
"use client"; // Required for hooks like useEffect and useRouter

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { BottomNav } from '@/components/core/BottomNav';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Define paths that should not have the app layout (e.g., full-screen dashboards)
  const noAppLayoutPaths = [
    '/rider-dashboard',
    '/school-dashboard',
    '/vendor-dashboard',
    '/creator-dashboard',
    '/coaching-panel',
    '/platform-admin',
    '/ai-voice-call',
    '/live-class',
  ];

  const showAppLayout = !noAppLayoutPaths.some(path => pathname.startsWith(path));

  useEffect(() => {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (!loggedInUser) {
      if (pathname !== '/login' && pathname !== '/auth') { 
         router.push('/login');
      } else {
        setIsCheckingAuth(false);
      }
    } else {
      setIsCheckingAuth(false);
    }
  }, [pathname, router]);

  if (isCheckingAuth) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <LoadingSpinner size={48} />
        <p className="mt-4 text-muted-foreground">Checking authentication...</p>
      </div>
    );
  }
  
  // If the path is one of the full-screen dashboards, render children without the app layout wrapper
  if (!showAppLayout) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <main className="flex-grow pb-20 md:pb-4">
        <div className="container mx-auto max-w-3xl px-4 py-4 sm:py-6">
            {children}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
