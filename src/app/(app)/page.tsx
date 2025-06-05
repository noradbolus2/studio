
"use client";

import Link from 'next/link';
import {
  PencilLine, BookMarked, LibraryBig, BrainCircuit, ShoppingBasket, Rocket, Target, BotMessageSquare, Baby, School, Sparkles, Users as UsersIcon,
  Languages, Volume2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { BilingualText } from '@/components/shared/BilingualText';

const iconMap = {
  Stationery: PencilLine,
  Courses: BookMarked,
  NCERTBooks: LibraryBig,
  BrainScan: BrainCircuit,
  QuickOrder: ShoppingBasket,
  PocketSchool: Rocket,
  TestSeries: Target,
  AIGuruji: BotMessageSquare,
  NurseryTo5th: Baby,
  Class6To12: School,
  CompetitivePrep: Sparkles,
  ParentMode: UsersIcon,
};

const gridItems = [
  { id: 'stationery', href: '/delivery', icon: iconMap.Stationery, labelEn: 'Stationery', labelHi: 'स्टेशनरी', iconColor: 'text-primary' },
  { id: 'courses', href: '/study', icon: iconMap.Courses, labelEn: 'Courses', labelHi: 'कोर्स', iconColor: 'text-accent' },
  { id: 'ncert', href: '/ncert-books', icon: iconMap.NCERTBooks, labelEn: 'NCERT Books', labelHi: 'एनसीईआरटी किताबें', iconColor: 'text-primary' },
  { id: 'brain_scan', href: '/profile', icon: iconMap.BrainScan, labelEn: 'Brain Scan', labelHi: 'ब्रेन स्कैन', iconColor: 'text-accent' },
  { id: 'quick_order', href: '/delivery', icon: iconMap.QuickOrder, labelEn: 'Quick Order', labelHi: 'तुरंत ऑर्डर', iconColor: 'text-primary' },
  { id: 'pocket_school', href: '/study', icon: iconMap.PocketSchool, labelEn: 'Pocket School', labelHi: 'पॉकेट स्कूल', iconColor: 'text-accent' },
  { id: 'test_series', href: '/test-series', icon: iconMap.TestSeries, labelEn: 'Test Series', labelHi: 'टेस्ट सीरीज़', iconColor: 'text-primary' },
  { id: 'ai_guruji', href: '/ai-guruji', icon: iconMap.AIGuruji, labelEn: 'AI Guruji', labelHi: 'एआई गुरुजी', iconColor: 'text-accent' },
  { id: 'nursery_to_5th', href: '/books/nursery-5th', icon: iconMap.NurseryTo5th, labelEn: 'Nursery to 5th', labelHi: 'नर्सरी से 5वीं', iconColor: 'text-primary' },
  { id: 'class_6_12', href: '/books/6-12', icon: iconMap.Class6To12, labelEn: 'Class 6–12', labelHi: 'कक्षा 6–12', iconColor: 'text-accent' },
  { id: 'competitive_prep', href: '/competitive-prep', icon: iconMap.CompetitivePrep, labelEn: 'Competitive Prep', labelHi: 'प्रतियोगी परीक्षा', iconColor: 'text-primary' },
  { id: 'parent_mode', href: '/parent-mode', icon: iconMap.ParentMode, labelEn: 'Parent Mode', labelHi: 'पेरेंट मोड', iconColor: 'text-accent' },
];

export default function HomePage() {
  return (
    <div className="space-y-6 pb-16 md:pb-8"> {/* Padding bottom for floating button if not on md screen */}
      <header className="mb-2">
        <h1 className="text-2xl font-bold font-headline">
          <BilingualText en="OSO App" hi="OSO ऐप" />
        </h1>
        <p className="text-sm text-muted-foreground">
          <BilingualText en="One Student One App" hi="एक छात्र एक ऐप" />
        </p>
      </header>

      <section>
        <ScrollArea className="w-full whitespace-nowrap rounded-md pb-2.5">
          <div className="flex space-x-4">
            <Card className="min-w-[280px] sm:min-w-[320px] shadow-md bg-gradient-to-r from-primary/5 via-background to-accent/5 border border-primary/10">
              <CardHeader className="pb-3 pt-4">
                <CardTitle className="text-base font-semibold flex items-center">
                  <BilingualText en="Brain Tip ✨" hi="ब्रेन टिप ✨" />
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <p className="text-sm mb-2">
                  <BilingualText en="Stay curious & keep learning! – AI Guruji" hi="मन शांत रखो और सीखते रहो। – एआई गुरुजी" />
                </p>
                <Button variant="link" size="sm" className="p-0 h-auto text-primary hover:text-primary/80">
                  <Volume2 className="mr-1.5 h-4 w-4" />
                  <BilingualText en="Play Audio" hi="ऑडियो चलाएं" />
                </Button>
              </CardContent>
            </Card>
            
            <Card className="min-w-[280px] sm:min-w-[320px] shadow-md">
              <CardHeader className="pb-3 pt-4">
                <CardTitle className="text-base font-semibold">
                  <BilingualText en="Quick Study" hi="जल्दी पढ़ाई" />
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <p className="text-sm text-muted-foreground mb-3">
                  <BilingualText en="Jump back into your last lesson." hi="अपनी पिछली पाठ पर वापस जाएं।" />
                </p>
                <Button variant="outline" size="sm" className="w-full">
                    <BilingualText en="Continue Chapter 3" hi="अध्याय 3 जारी रखें" />
                </Button>
              </CardContent>
            </Card>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </section>

      <section>
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {gridItems.map((item) => (
            <Link href={item.href} key={item.id} passHref>
              <Card className="aspect-[10/9] flex flex-col items-center justify-center p-2 sm:p-3 text-center hover:shadow-lg transition-shadow cursor-pointer bg-card hover:bg-muted/50 active:bg-muted/90">
                <item.icon className={`h-7 w-7 sm:h-8 sm:w-8 mb-1.5 ${item.iconColor}`} strokeWidth={2} />
                <span className="text-xs sm:text-sm font-medium text-foreground leading-tight block">
                  {item.labelEn}
                </span>
                <span className="text-[10px] sm:text-xs text-muted-foreground block">
                  {item.labelHi}
                </span>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <div className="fixed bottom-20 right-4 z-20 md:hidden"> {/* Only show on mobile, below BottomNav */}
        <Button variant="default" className="rounded-full shadow-lg bg-accent text-accent-foreground hover:bg-accent/90 h-11 w-auto px-3">
          <Languages className="mr-1.5 h-5 w-5" />
          <span className="text-xs"><BilingualText en="EN" hi="हि" separator="|" hiClassName="font-semibold"/></span>
        </Button>
      </div>
    </div>
  );
}
