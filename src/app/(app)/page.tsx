
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import {
  Languages,
} from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BilingualText } from '@/components/shared/BilingualText';
import { MotivationalQuoteCard } from '@/components/shared/MotivationalQuoteCard';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

const gridItems = [
  { id: 'stationery', href: '/delivery', imageUrl: 'https://placehold.co/60x60.png', dataAiHint: 'stationery items', labelEn: 'Stationery', labelHi: 'स्टेशनरी' },
  { id: 'courses', href: '/study', imageUrl: 'https://placehold.co/60x60.png', dataAiHint: 'online course', labelEn: 'Courses', labelHi: 'कोर्स' },
  { id: 'ncertbooks', href: '/class-6-12-books', imageUrl: 'https://placehold.co/60x60.png', dataAiHint: 'ncert textbook', labelEn: 'NCERT Books', labelHi: 'एनसीईआरटी किताबें' },
  { id: 'brainscan', href: '/brain-scan-report', imageUrl: 'https://placehold.co/60x60.png', dataAiHint: 'brain scan', labelEn: 'Brain Scan', labelHi: 'ब्रेन स्कैन' },
  { id: 'quickorder', href: '/delivery', imageUrl: 'https://placehold.co/60x60.png', dataAiHint: 'fast delivery', labelEn: 'Quick Order', labelHi: 'तुरंत ऑर्डर' },
  { id: 'pocketschool', href: '/study-dashboard', imageUrl: 'https://placehold.co/60x60.png', dataAiHint: 'offline study', labelEn: 'Pocket School', labelHi: 'पॉकेट स्कूल' },
  { id: 'testseries', href: '/test-series', imageUrl: 'https://placehold.co/60x60.png', dataAiHint: 'mock test', labelEn: 'Test Series', labelHi: 'टेस्ट सीरीज़' },
  { id: 'aiguruji', href: '/ai-guruji', imageUrl: 'https://placehold.co/60x60.png', dataAiHint: 'ai tutor', labelEn: 'AI Guruji', labelHi: 'एआई गुरुजी' },
  { id: 'nurserybooks', href: '/class-6-12-books?category=nursery-5', imageUrl: 'https://placehold.co/60x60.png', dataAiHint: 'kids books', labelEn: 'Nursery to 5th', labelHi: 'नर्सरी से 5वीं' }, // Shortened English label for space
  { id: 'class6to12books', href: '/class-6-12-books?category=6-12', imageUrl: 'https://placehold.co/60x60.png', dataAiHint: 'school textbook', labelEn: 'Class 6–12', labelHi: 'कक्षा 6–12' }, // Shortened English label for space
  { id: 'competitiveprep', href: '/competitive-bookstore', imageUrl: 'https://placehold.co/60x60.png', dataAiHint: 'exam prep', labelEn: 'Competitive', labelHi: 'प्रतियोगी परीक्षा' }, // Shortened English label
  { id: 'parentmode', href: '/parent-mode', imageUrl: 'https://placehold.co/60x60.png', dataAiHint: 'parental app', labelEn: 'Parent Mode', labelHi: 'पेरेंट मोड' },
];


export default function HomePage() {
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'hi'>('en');
  
  const toggleLanguage = () => {
    setCurrentLanguage(prev => (prev === 'en' ? 'hi' : 'en'));
  };

  return (
    <div className="space-y-4 pb-8 relative">
      {/* Header: OSO logo & Subheading: “One Student, One App” */}
      <header className="flex items-center justify-between py-3 px-1 mb-3">
        <div className="flex items-center space-x-2">
          <Image
            src="https://placehold.co/40x40.png" 
            alt="OSO App Logo"
            width={36}
            height={36}
            className="rounded-md"
            data-ai-hint="app logo"
          />
          <div>
            <h1 className="text-xl font-bold font-headline text-primary">OSO App</h1>
            <p className="text-xs text-muted-foreground">
              <BilingualText lang={currentLanguage} en="One Student, One App" hi="एक छात्र, एक ऐप" />
            </p>
          </div>
        </div>
        {/* Language Toggle Button */}
        <Button variant="ghost" size="icon" onClick={toggleLanguage} className="text-muted-foreground hover:text-primary">
          <Languages className="h-5 w-5" />
          <span className="sr-only"><BilingualText lang={currentLanguage} en="Toggle Language" hi="भाषा बदलें"/></span>
        </Button>
      </header>

      {/* Special Section: Daily Quote / Brain Tip (Horizontal Scroll) */}
      <ScrollArea className="w-full whitespace-nowrap pb-2.5 px-1">
        <div className="flex space-x-4">
          <MotivationalQuoteCard /> 
          {/* Add more cards here for horizontal scroll if needed */}
          {/* Example: <Card className="min-w-[280px]"><CardContent className="p-4">Another tip...</CardContent></Card> */}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>


      {/* 3x4 Grid of colorful rounded icons */}
      <section className="px-1">
        <div className="grid grid-cols-3 gap-3 sm:gap-4"> {/* Changed to grid-cols-3 for 3x4 layout */}
          {gridItems.map((item) => (
            <Link href={item.href} key={item.id} passHref>
              <Card className="aspect-square flex flex-col items-center justify-center p-2.5 text-center hover:shadow-lg transition-shadow cursor-pointer bg-card hover:bg-muted/50 active:bg-muted/80 rounded-xl shadow-sm">
                <div className="relative h-7 w-7 sm:h-8 sm:w-8 mb-1.5">
                  <Image
                    src={item.imageUrl}
                    alt={item.labelEn}
                    layout="fill"
                    objectFit="contain"
                    className="rounded-sm" 
                    data-ai-hint={item.dataAiHint}
                  />
                </div>
                <span className="text-[10px] sm:text-xs font-medium text-foreground leading-tight block">
                  {item.labelEn}
                </span>
                <span className="text-[8px] sm:text-[10px] text-muted-foreground/90 block leading-tight">
                  {item.labelHi}
                </span>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Bottom banner: “Infinite Learning” (purple with white text) */}
      <footer className="mt-6 px-1">
        <div className="bg-purple-600 text-white text-center py-3 rounded-lg shadow-md">
          <span className="font-semibold text-sm tracking-wide">
            <BilingualText lang={currentLanguage} en="Infinite Learning" hi="अनंत शिक्षा" separator=" ✨ " />
          </span>
        </div>
      </footer>
    </div>
  );
}
