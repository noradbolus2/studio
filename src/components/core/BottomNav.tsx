
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Truck, Bot, User, Sparkles } from 'lucide-react'; // Added Sparkles
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react'; 

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/study', label: 'Study', icon: BookOpen },
  { href: '/creator-marketplace', label: 'Projects', icon: Sparkles }, // Changed Delivery to Projects
  { href: '/ai-guruji', label: 'AI', icon: Bot },
  { href: '/profile', label: 'Me', icon: User },
];

export function BottomNav() {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-card border-t border-border shadow- ऊपर flex md:hidden z-50">
      {navItems.map((item) => {
        let itemIsActive = false;
        if (isClient) {
          itemIsActive = (pathname === item.href) ||
                       (item.href === "/ai-guruji" && pathname.startsWith("/ai-guruji")) ||
                       (item.href === "/study" && pathname.startsWith("/study")) ||
                       (item.href === "/creator-marketplace" && pathname.startsWith("/creator-marketplace")); // Added for creator marketplace
        }
        
        return (
          <Link href={item.href} key={item.label} legacyBehavior>
            <a
              className={cn(
                'flex flex-col items-center justify-center flex-1 p-1 pt-2 text-center transition-colors',
                itemIsActive ? 'text-primary' : 'text-muted-foreground hover:text-primary'
              )}
            >
              <item.icon size={24} strokeWidth={itemIsActive ? 2.5 : 2} className="mb-0.5" />
              <span className={cn(
                  "text-[0.65rem] leading-tight font-medium", 
                  itemIsActive ? "text-primary" : "text-muted-foreground"
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

    