
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

  useEffect(() => {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (!loggedInUser) {
      // Allow access to login page even if it were part of (app) group, though it's not currently
      if (pathname !== '/login') { // Make sure we are not already on login page to avoid loop
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

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow pb-20 md:pb-0">
        <div className="container mx-auto max-w-3xl px-4 py-8">
            {children}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
