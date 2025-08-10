
"use client"; 

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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

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
    '/ai-teacher' // Add AI Teacher to the list
  ];

  const showAppLayout = !noAppLayoutPaths.some(path => pathname.startsWith(path));

  useEffect(() => {
    // This effect runs only on the client, after the initial render.
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (!loggedInUser) {
      if (pathname !== '/login' && pathname !== '/auth') { 
         router.push('/login');
      } else {
         // If we're on login/auth, we're not authenticated but it's okay.
         setIsAuthenticated(false);
      }
    } else {
      // User is authenticated.
      setIsAuthenticated(true);
    }
  }, [pathname, router]);

  // If the path is one of the full-screen dashboards, render children immediately.
  // These dashboards are expected to handle their own auth checks if necessary.
  if (!showAppLayout) {
    return <>{children}</>;
  }
  
  // Render loading state until authentication check is complete.
  // This guarantees the server and client render the same thing initially.
  if (isAuthenticated === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <LoadingSpinner size={48} />
        <p className="mt-4 text-muted-foreground">Checking authentication...</p>
      </div>
    );
  }
  
  // If authenticated, render the app layout with its children.
  if (isAuthenticated) {
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
  
  // If not authenticated and not on login/auth pages (the useEffect will redirect), 
  // render a loading screen to avoid flashes of content.
  return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <LoadingSpinner size={48} />
      </div>
  );
}
