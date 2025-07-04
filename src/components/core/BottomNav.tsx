
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Bot, User, Sparkles, Brain, GraduationCap, FileSignature } from 'lucide-react'; 
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react'; 

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/study', label: 'Study', icon: BookOpen },
  { href: '/creator-marketplace', label: 'Projects', icon: Sparkles }, 
  { href: '/ai-guruji', label: 'AI', icon: Bot },
  { href: '/profile', label: 'Me', icon: User },
];

export function BottomNav() {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const itemsToDisplay = navItems.slice(0, 5);


  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-card/95 border-t border-border shadow- ऊपर flex md:hidden z-50">
      {itemsToDisplay.map((item) => {
        let itemIsActive = false;
        if (isClient) {
            // More robust active check
            if (item.href === '/') {
                itemIsActive = pathname === '/';
            } else {
                itemIsActive = pathname.startsWith(item.href);
            }
        }
        
        return (
          <Link href={item.href} key={item.label} legacyBehavior>
            <a
              className={cn(
                'flex flex-col items-center justify-center flex-1 p-1 pt-2 text-center transition-colors duration-200 ease-in-out',
                itemIsActive ? 'text-accent scale-105' : 'text-muted-foreground hover:text-accent/80'
              )}
            >
              <item.icon size={24} strokeWidth={itemIsActive ? 2.5 : 2} className={cn("mb-0.5 transition-all duration-200 ease-in-out", itemIsActive ? "drop-shadow-[0_0_3px_hsl(var(--accent))]" : "")} />
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
