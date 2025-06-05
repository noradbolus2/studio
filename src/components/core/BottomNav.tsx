
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, ShoppingCart, UsersRound, UserCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/study', label: 'Study', icon: BookOpen },
  { href: '/delivery', label: 'Delivery', icon: ShoppingCart },
  { href: '/circle', label: 'Circle', icon: UsersRound },
  { href: '/profile', label: 'Profile', icon: UserCircle },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-card border-t border-border shadow- ऊपर flex md:hidden z-50">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
        return (
          <Link href={item.href} key={item.label} legacyBehavior>
            <a
              className={cn(
                'flex flex-col items-center justify-center flex-1 p-2 text-sm transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <item.icon size={26} strokeWidth={isActive ? 2.5 : 2} className="mb-0.5" />
              <span className={cn("text-xs", isActive ? "font-semibold" : "font-normal")}>{item.label}</span>
            </a>
          </Link>
        );
      })}
    </nav>
  );
}
