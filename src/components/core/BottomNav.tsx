
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Truck, Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/study', label: 'Study', icon: BookOpen },
  { href: '/delivery', label: 'Orders', icon: Truck }, // Changed from ShoppingCart to Truck, label from Delivery to Orders
  { href: '/ai-guruji', label: 'AI', icon: Bot }, // Changed href and label
  { href: '/profile', label: 'Me', icon: User }, // Label changed
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-card border-t border-border shadow- ऊपर flex md:hidden z-50">
      {navItems.map((item) => {
        const isActive = (pathname === item.href) || (item.href === "/ai-guruji" && pathname.startsWith("/ai-guruji")) || (item.href === "/study" && pathname.startsWith("/study"));
        // More specific active check for /ai-guruji if it has sub-routes or if /ai is a distinct section
        
        return (
          <Link href={item.href} key={item.label} legacyBehavior>
            <a
              className={cn(
                'flex flex-col items-center justify-center flex-1 p-1 pt-2 text-center transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-primary'
              )}
            >
              <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} className="mb-0.5" />
              <span className={cn("text-[0.65rem] leading-tight font-medium", isActive ? "text-primary" : "text-muted-foreground")}>{item.label}</span>
            </a>
          </Link>
        );
      })}
    </nav>
  );
}
