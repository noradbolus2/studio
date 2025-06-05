
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react'; // Added for language state
import {
  BookOpen,
  Brain,
  Languages,
  Notebook, 
  PackageCheck,
  Rocket,
  ShoppingCart,
  Bot,
  Target,
  Users,
  FileText,
  Briefcase,
  GraduationCap,
  Library, 
  BookCopy,
  Baby,
  Apple,
  PencilLine, 
  Shirt,
  Sun,
  ScreenShare,
} from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BilingualText } from '@/components/shared/BilingualText';
import { MotivationalQuoteCard } from '@/components/shared/MotivationalQuoteCard'; // Assuming this is for the daily quote/tip
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';


const iconMap = {
  Stationery: PencilLine,
  Courses: BookOpen, 
  NCERTBooks: Library,
  BrainScan: Brain,
  QuickOrder: ShoppingCart,
  PocketSchool: Rocket,
  TestSeries: Target,
  AIGuruji: Bot,
  NurseryTo5th: Baby,
  Class6To12: BookCopy,
  CompetitivePrep: GraduationCap,
  ParentMode: Users,
  Projects: Briefcase,
  Assignments: FileText,
  Uniforms: Shirt,
  eLibrary: Library, 
  StudySnacks: Apple,
  LastMinuteKits: PackageCheck,
  DailyGuruGyaan: Sun,
  LiveClasses: ScreenShare,
};

const gridItems = [
  { id: 'stationery', href: '/delivery', icon: iconMap.Stationery, labelEn: 'Stationery', labelHi: 'स्टेशनरी', iconColor: 'text-blue-500' },
  { id: 'projects', href: '/projects', icon: iconMap.Projects, labelEn: 'Projects', labelHi: 'परियोजनाएं', iconColor: 'text-green-500' },
  { id: 'assignments', href: '/assignments', icon: iconMap.Assignments, labelEn: 'Assignments', labelHi: 'असाइनमेंट', iconColor: 'text-red-500' },
  { id: 'uniforms', href: '/uniforms', icon: iconMap.Uniforms, labelEn: 'Uniforms', labelHi: 'वर्दी', iconColor: 'text-yellow-600' },
  { id: 'elibrary', href: '/class-6-12-books', icon: iconMap.eLibrary, labelEn: 'e-Library', labelHi: 'ई-लाइब्रेरी', iconColor: 'text-indigo-500' }, // Pointing to class-6-12-books for now
  { id: 'studysnacks', href: '/study-snacks', icon: iconMap.StudySnacks, labelEn: 'Study Snacks', labelHi: 'स्टडी स्नैक्स', iconColor: 'text-pink-500' },
  { id: 'kits', href: '/last-minute-kits', icon: iconMap.LastMinuteKits, labelEn: 'Last Minute Kits', labelHi: 'अंतिम मिनट किट', iconColor: 'text-purple-500' },
  { id: 'testseries', href: '/test-series', icon: iconMap.TestSeries, labelEn: 'Test Series', labelHi: 'टेस्ट सीरीज़', iconColor: 'text-teal-500' },
  { id: 'parentmode', href: '/parent-mode', icon: iconMap.ParentMode, labelEn: 'Parent Mode', labelHi: 'पेरेंट मोड', iconColor: 'text-orange-500' },
  { id: 'dailygyaan', href: '/daily-gyaan', icon: iconMap.DailyGuruGyaan, labelEn: 'Daily Guru Gyaan', labelHi: 'दैनिक गुरु ज्ञान', iconColor: 'text-cyan-500' },
  { id: 'guruji', href: '/ai-guruji', icon: iconMap.AIGuruji, labelEn: 'Guru Ji', labelHi: 'गुरु जी', iconColor: 'text-lime-500' },
  { id: 'liveclasses', href: '/live-classes', icon: iconMap.LiveClasses, labelEn: 'Live Classes', labelHi: 'लाइव कक्षाएं', iconColor: 'text-rose-500' },
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
        <div className="grid grid-cols-4 gap-3 sm:gap-4">
          {gridItems.map((item) => {
            const IconComponent = item.icon;
            return (
            <Link href={item.href} key={item.id} passHref>
              <Card className="aspect-square flex flex-col items-center justify-center p-2.5 text-center hover:shadow-lg transition-shadow cursor-pointer bg-card hover:bg-muted/50 active:bg-muted/80 rounded-xl shadow-sm">
                <IconComponent className={`h-7 w-7 sm:h-8 sm:w-8 mb-1.5 ${item.iconColor || 'text-primary'}`} strokeWidth={1.5} />
                <span className="text-[10px] sm:text-xs font-medium text-foreground leading-tight block">
                  {item.labelEn}
                </span>
                <span className="text-[8px] sm:text-[10px] text-muted-foreground/90 block leading-tight">
                  {item.labelHi}
                </span>
              </Card>
            </Link>
          )})}
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
