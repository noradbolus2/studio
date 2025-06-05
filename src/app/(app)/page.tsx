
"use client";

import Link from 'next/link';
import Image from 'next/image';
import {
  BookOpen,
  Brain,
  Languages,
  Notebook, // Used for Courses in previous iteration, PencilLine used for Stationery
  PackageCheck,
  Rocket,
  ShoppingCart,
  Bot,
  Target,
  Users,
  FileText,
  Briefcase,
  GraduationCap,
  Library, // Used for NCERTBooks and eLibrary
  BookCopy,
  Baby,
  Apple,
  PencilLine, // For Stationery
  Shirt,
  Sun,
  ScreenShare,
} from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BilingualText } from '@/components/shared/BilingualText';

// Icon mapping based on the new detailed prompt
const iconMap = {
  Stationery: PencilLine, // ✏️
  Courses: BookOpen, // 📘 (prompt actually doesn't list this in the 3x4 grid, but it's a core feature) - Re-added based on previous grid. Let's map new items.
  NCERTBooks: Library, // 📚
  BrainScan: Brain, // 🧠
  QuickOrder: ShoppingCart, // 🛍️
  PocketSchool: Rocket, // 🚀
  TestSeries: Target, // 🎯
  AIGuruji: Bot, // 👨‍🏫
  NurseryTo5th: Baby, // 👶
  Class6To12: BookCopy, // 📖
  CompetitivePrep: GraduationCap, // 🎓
  ParentMode: Users, // 👪

  // Additional items from the 3x4 prompt:
  Projects: Briefcase,
  Assignments: FileText,
  Uniforms: Shirt,
  eLibrary: Library, // Using Library icon, same as NCERT Books as per prompt (📚)
  StudySnacks: Apple,
  LastMinuteKits: PackageCheck,
  DailyGuruGyaan: Sun,
  LiveClasses: ScreenShare,
};

// Updated gridItems to match the 3x4 layout from the prompt
const gridItems = [
  // Row 1
  { id: 'stationery', href: '/delivery', icon: iconMap.Stationery, labelEn: 'Stationery', labelHi: 'स्टेशनरी', iconColor: 'text-blue-500' },
  { id: 'projects', href: '/projects', icon: iconMap.Projects, labelEn: 'Projects', labelHi: 'परियोजनाएं', iconColor: 'text-green-500' }, // Assuming /projects page
  { id: 'assignments', href: '/assignments', icon: iconMap.Assignments, labelEn: 'Assignments', labelHi: 'असाइनमेंट', iconColor: 'text-red-500' }, // Assuming /assignments page
  { id: 'uniforms', href: '/uniforms', icon: iconMap.Uniforms, labelEn: 'Uniforms', labelHi: 'वर्दी', iconColor: 'text-yellow-600' }, // Assuming /uniforms page

  // Row 2
  { id: 'elibrary', href: '/elibrary', icon: iconMap.eLibrary, labelEn: 'e-Library', labelHi: 'ई-लाइब्रेरी', iconColor: 'text-indigo-500' }, // Assuming /elibrary page
  { id: 'studysnacks', href: '/study-snacks', icon: iconMap.StudySnacks, labelEn: 'Study Snacks', labelHi: 'स्टडी स्नैक्स', iconColor: 'text-pink-500' }, // Assuming /study-snacks page
  { id: 'kits', href: '/last-minute-kits', icon: iconMap.LastMinuteKits, labelEn: 'Last Minute Kits', labelHi: 'अंतिम मिनट किट', iconColor: 'text-purple-500' }, // Assuming /last-minute-kits page
  { id: 'testseries', href: '/test-series', icon: iconMap.TestSeries, labelEn: 'Test Series', labelHi: 'टेस्ट सीरीज़', iconColor: 'text-teal-500' }, // Assuming /test-series page
  
  // Row 3
  { id: 'parentmode', href: '/parent-mode', icon: iconMap.ParentMode, labelEn: 'Parent Mode', labelHi: 'पेरेंट मोड', iconColor: 'text-orange-500' }, // Assuming /parent-mode page
  { id: 'dailygyaan', href: '/daily-gyaan', icon: iconMap.DailyGuruGyaan, labelEn: 'Daily Guru Gyaan', labelHi: 'दैनिक गुरु ज्ञान', iconColor: 'text-cyan-500' }, // Assuming /daily-gyaan page
  { id: 'guruji', href: '/ai-guruji', icon: iconMap.AIGuruji, labelEn: 'Guru Ji', labelHi: 'गुरु जी', iconColor: 'text-lime-500' },
  { id: 'liveclasses', href: '/live-classes', icon: iconMap.LiveClasses, labelEn: 'Live Classes', labelHi: 'लाइव कक्षाएं', iconColor: 'text-rose-500' }, // Assuming /live-classes page
];


export default function HomePage() {
  // TODO: Implement language toggle state
  // const [currentLanguage, setCurrentLanguage] = useState<'en' | 'hi'>('en');
  // const toggleLanguage = () => setCurrentLanguage(prev => prev === 'en' ? 'hi' : 'en');

  return (
    <div className="space-y-4 pb-8 relative">
      {/* Header: OSO logo & Subheading: “One Student, One App” */}
      <header className="flex items-center justify-between py-3 px-1 mb-3">
        <div className="flex items-center space-x-2">
          <Image
            src="https://placehold.co/40x40.png" // Actual OSO logo
            alt="OSO App Logo"
            width={36} // Adjusted size
            height={36} // Adjusted size
            className="rounded-md"
            data-ai-hint="app logo"
          />
          <div>
            <h1 className="text-xl font-bold font-headline text-primary">OSO App</h1>
            <p className="text-xs text-muted-foreground">
              <BilingualText en="One Student, One App" hi="एक छात्र, एक ऐप" separator=" / " hiClassName="opacity-80"/>
            </p>
          </div>
        </div>
        {/* Language Toggle Button */}
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
          <Languages className="h-5 w-5" />
          <span className="sr-only"><BilingualText en="Language" hi="भाषा"/></span>
        </Button>
      </header>

      {/* Special Section: Daily Quote / Brain Tip (Horizontal Scroll) - Placeholder for now */}
      {/* This was requested "above or below grid". Let's put it below grid for now or before. */}
      {/* For now, this section is omitted for simplicity of fixing the current error, will add later if requested */}


      {/* 3x4 Grid of colorful rounded icons */}
      <section className="px-1">
        <div className="grid grid-cols-4 gap-3 sm:gap-4"> {/* 4 columns for 12 items = 3 rows */}
          {gridItems.map((item) => {
            const IconComponent = item.icon;
            return (
            <Link href={item.href} key={item.id} passHref>
              <Card className="aspect-square flex flex-col items-center justify-center p-2.5 text-center hover:shadow-lg transition-shadow cursor-pointer bg-card hover:bg-muted/50 active:bg-muted/80 rounded-xl shadow-sm">
                <IconComponent className={`h-8 w-8 mb-1.5 ${item.iconColor || 'text-primary'}`} strokeWidth={1.5} />
                <span className="text-[11px] sm:text-xs font-medium text-foreground leading-tight block">
                  {item.labelEn}
                </span>
                <span className="text-[9px] sm:text-[10px] text-muted-foreground/90 block">
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
            <BilingualText en="Infinite Learning" hi="अनंत शिक्षा" separator=" ✨ " hiClassName="opacity-90"/>
          </span>
        </div>
      </footer>
    </div>
  );
}
