"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Truck, Bot, User, Sparkles, Brain } from 'lucide-react'; 
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react'; 

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/study', label: 'Study', icon: BookOpen },
  { href: '/creator-marketplace', label: 'Projects', icon: Sparkles }, 
  { href: '/ai-guruji', label: 'AI', icon: Bot },
  { href: '/brain-scan-report', label: 'Aura Map', icon: Brain }, // Changed label
  { href: '/profile', label: 'Me', icon: User },
];

export function BottomNav() {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Filter out Aura Map if it's already active from another route or to avoid duplication if a direct /brain-scan link exists
  const filteredNavItems = navItems.filter(item => {
    if (item.href === '/brain-scan-report') {
        return pathname !== '/brain-scan-report'; // Hide if already on the page
    }
    return true;
  }).slice(0, 5); // Ensure max 5 items for aesthetics


  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-card/95 backdrop-blur-md border-t border-border shadow- ऊपर flex md:hidden z-50">
      {filteredNavItems.map((item) => {
        let itemIsActive = false;
        if (isClient) {
          itemIsActive = (pathname === item.href) ||
                       (item.href === "/ai-guruji" && pathname.startsWith("/ai-guruji")) ||
                       (item.href === "/study" && pathname.startsWith("/study")) ||
                       (item.href === "/creator-marketplace" && pathname.startsWith("/creator-marketplace")) ||
                       (item.href === "/brain-scan-report" && pathname.startsWith("/brain-scan-report")); // Check for Aura Map active state
        }
        
        return (
          <Link href={item.href} key={item.label} legacyBehavior>
            <a
              className={cn(
                'flex flex-col items-center justify-center flex-1 p-1 pt-2 text-center transition-colors duration-200 ease-in-out',
                itemIsActive ? 'text-accent scale-105' : 'text-muted-foreground hover:text-accent/80'
              )}
            >
              <item.icon size={24} strokeWidth={itemIsActive ? 2.5 : 2} className={cn("mb-0.5 transition-all duration-200 ease-in-out", itemIsActive ? "filter drop-shadow-[0_0_3px_hsl(var(--accent))]" : "")} />
              <span className={cn(
                  "text-[0.65rem] leading-tight font-medium transition-colors duration-200 ease-in-out", 
                  itemIsActive ? "text-accent" : "text-muted-foreground"
                )}
              >
                {item.label}
              </span>
            </a>
          </Link>
        );
      })}
    </nav>
  );
}