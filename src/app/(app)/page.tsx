
"use client";

import React, { useState, useEffect, useRef } from 'react'; 
import Link from 'next/link';
import Image from 'next/image';
import {
  MapPin, Search as SearchIcon, BookOpen as BookIcon, Brain, ShoppingBag, Bot,
  FlaskConical, Package as PackageIcon, Smile, Target, ChevronRight, ChevronLeft, Hand, Star, Users, Briefcase, Bike, FileText, Award, CalendarDays, ClipboardList, Home as HomeIcon, Truck, Settings, User as UserIcon, Sparkles, MessageCircleHeart, Youtube, Library, Cookie, PackageSearch
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { BilingualText } from '@/components/shared/BilingualText'; 

// Mock data
const user = {
  name: 'Abhishek',
  avatarUrl: 'https://placehold.co/40x40.png',
  dataAiHint: 'student avatar male'
};
const location = "Modern School, Barakhamba";

const heroSlides = [
  { id: 1, titleEn: "1-Click Project Help", titleHi: "1-क्लिक प्रोजेक्ट सहायता", descriptionEn: "AI assistance & material kits", descriptionHi: "एआई सहायता और सामग्री किट", imageUrl: "https://placehold.co/800x300.png", dataAiHint: "project help technology", bgColor: "bg-gradient-to-r from-purple-500 to-violet-600", href:"/services/projects" },
  { id: 2, titleEn: "Study Material in 30 Mins!", titleHi: "30 मिनट में अध्ययन सामग्री!", descriptionEn: "Notes, books & stationery, delivered fast", descriptionHi: "नोट्स, किताबें और स्टेशनरी, तेजी से डिलीवर", imageUrl: "https://placehold.co/800x300.png", dataAiHint: "fast delivery books", bgColor: "bg-gradient-to-r from-yellow-400 to-amber-500", href:"/delivery" },
  { id: 3, titleEn: "OSO Guruji AI is Online", titleHi: "OSO गुरुजी AI ऑनलाइन हैं", descriptionEn: "Your 24/7 AI study partner", descriptionHi: "आपका 24/7 एआई अध्ययन भागीदार", imageUrl: "https://placehold.co/800x300.png", dataAiHint: "ai robot teaching", bgColor: "bg-gradient-to-r from-pink-500 to-rose-500", href:"/ai-guruji" },
];

const quickCategories = [
  { id: 'books', labelEn: 'Books', labelHi: 'किताबें', icon: BookIcon, href: '/class-6-12-books', color: 'text-primary', bgColor: 'bg-primary/10 hover:bg-primary/20' },
  { id: 'projects', labelEn: 'Projects', labelHi: 'प्रोजेक्ट', icon: FlaskConical, href: '/services/projects', color: 'text-primary', bgColor: 'bg-primary/10 hover:bg-primary/20' },
  { id: 'stationery', labelEn: 'Stationery', labelHi: 'स्टेशनरी', icon: PackageIcon, href: '/delivery', color: 'text-primary', bgColor: 'bg-primary/10 hover:bg-primary/20' },
  { id: 'ai_guruji', labelEn: 'AI Guruji', labelHi: 'AI गुरुजी', icon: Bot, href: '/ai-guruji', color: 'text-primary', bgColor: 'bg-primary/10 hover:bg-primary/20' },
  { id: 'mind_diary', labelEn: 'Mind Diary', labelHi: 'माइंड डायरी', icon: Smile, href: '/mind-diary', color: 'text-primary', bgColor: 'bg-primary/10 hover:bg-primary/20' },
  { id: 'test_series', labelEn: 'Test Series', labelHi: 'टेस्ट सीरीज़', icon: Target, href: '/test-series', color: 'text-primary', bgColor: 'bg-primary/10 hover:bg-primary/20' },
];

const recommendations = [
  { id: 'rec1', typeEn: 'Book', typeHi: 'किताब', titleEn: 'Class 10 - Lakhmir Singh Science', titleHi: 'कक्षा 10 - लखमीर सिंह विज्ञान', imageUrl: 'https://placehold.co/150x200.png', dataAiHint: "science textbook", href: '/class-6-12-books', priceEn: 'INR 450', priceHi: 'INR 450' },
  { id: 'rec2', typeEn: 'Project', typeHi: 'प्रोजेक्ट', titleEn: 'Volcano Model Kit', titleHi: 'ज्वालामुखी मॉडल किट', descriptionEn: 'Get All Materials', descriptionHi: 'सभी सामग्री प्राप्त करें', imageUrl: 'https://placehold.co/150x200.png', dataAiHint: "volcano model kit", href: '/services/projects', priceEn: 'INR 299', priceHi: 'INR 299' },
  { id: 'rec3', typeEn: 'AI Tool', typeHi: 'AI उपकरण', titleEn: 'Ask Guruji: NEET Doubts', titleHi: 'गुरुजी से पूछें: NEET शंकाएँ', descriptionEn: 'Clear your concepts', descriptionHi: 'अपनी अवधारणाएँ स्पष्ट करें', imageUrl: 'https://placehold.co/150x200.png', dataAiHint: "ai chat exam", href: '/ai-guruji', priceEn: 'Free', priceHi: 'निःशुल्क' },
  { id: 'rec4', typeEn: 'Test', typeHi: 'टेस्ट', titleEn: 'JEE Main Mock Test', titleHi: 'JEE मुख्य मॉक टेस्ट', descriptionEn: 'Full Syllabus', descriptionHi: 'पूर्ण पाठ्यक्रम', imageUrl: 'https://placehold.co/150x200.png', dataAiHint: "online test interface", href: '/test-series', priceEn: 'INR 99', priceHi: 'INR 99' },
];

const deliveryDeals = [
  { id: 'deal1', titleEn: "Charts in 20 mins!", titleHi: "20 मिनट में चार्ट!", descriptionEn: "All sizes & types", descriptionHi: "सभी आकार और प्रकार", icon: FileText, bgColor: "bg-orange-500", textColor: "text-white", dataAiHint:"charts diagram" },
  { id: 'deal2', titleEn: "INR 10 Off School Kits", titleHi: "स्कूल किट पर INR 10 की छूट", descriptionEn: "Notebooks, Pens & More", descriptionHi: "नोटबुक, पेन और भी बहुत कुछ", icon: PackageSearch, bgColor: "bg-teal-500", textColor: "text-white", dataAiHint:"school supplies kit" },
  { id: 'deal3', titleEn: "Project Emergency?", titleHi: "प्रोजेक्ट इमरजेंसी?", descriptionEn: "Materials in a Jiffy!", descriptionHi: "सामान झटपट!", icon: Brain, bgColor: "bg-violet-500", textColor: "text-white", dataAiHint:"project materials box" },
];

const searchIcons = [
    {labelEn: "Books", labelHi: "किताबें", icon: BookIcon, href:"/class-6-12-books"},
    {labelEn: "Projects", labelHi: "प्रोजेक्ट", icon: Brain, href:"/services/projects"},
    {labelEn: "Stationery", labelHi: "स्टेशनरी", icon: PackageIcon, href:"/delivery"},
    {labelEn: "Guruji AI", labelHi: "गुरुजी AI", icon: Bot, href:"/ai-guruji"},
];

export default function ModernHomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [currentLang, setCurrentLang] = useState<'en' | 'hi'>('en'); 

  const startSlideShow = () => {
    slideIntervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
    }, 4000);
  };

  useEffect(() => {
    startSlideShow();
    return () => {
      if (slideIntervalRef.current) {
        clearInterval(slideIntervalRef.current);
      }
    };
  }, []);

  const jumpToSlide = (index: number) => {
    setCurrentSlide(index);
    if (slideIntervalRef.current) clearInterval(slideIntervalRef.current);
    startSlideShow();
  };
  
  const MemoizedImage = React.memo(Image);

  const toggleLanguage = () => {
    setCurrentLang(prevLang => prevLang === 'en' ? 'hi' : 'en');
  };


  return (
    <div className="space-y-6 pb-10 bg-background min-h-screen -m-4 p-4">
      {/* Top Section */}
      <header className="space-y-3 sticky top-0 bg-background/80 backdrop-blur-sm z-40 py-3 -mx-4 px-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-5 w-5 text-primary" />
            <span className="font-medium truncate max-w-[200px]">{location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={toggleLanguage} variant="outline" size="sm" className="text-xs h-7 px-2">
              {currentLang === 'en' ? 'हिन्दी' : 'English'}
            </Button>
            <Link href="/profile">
              <Avatar className="h-8 w-8 border-2 border-primary">
                <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint={user.dataAiHint} />
                <AvatarFallback>{user.name.substring(0,1)}</AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </div>
        <div className="px-0">
            <h1 className="text-2xl font-bold text-foreground">
                <BilingualText en={`Hello, ${user.name}`} hi={`नमस्ते, ${user.name}`} lang={currentLang} /> <Hand className="inline h-6 w-6 text-yellow-400" />
            </h1>
            <p className="text-muted-foreground text-sm"><BilingualText en="What do you need today?" hi="आज आपको क्या चाहिए?" lang={currentLang} /></p>
        </div>
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder={currentLang === 'en' ? "Search for books, projects, stationery..." : "किताबें, प्रोजेक्ट, स्टेशनरी खोजें..."}
            className="pl-10 h-12 text-base border-border focus:border-primary focus:ring-primary rounded-xl shadow-sm" 
          />
        </div>
         <div className="flex justify-around items-center pt-1 text-xs text-muted-foreground">
            {searchIcons.map(item => (
                <Link href={item.href} key={item.labelEn} className="flex flex-col items-center gap-1 hover:text-primary transition-colors">
                    <item.icon className="h-5 w-5"/>
                    <span><BilingualText en={item.labelEn} hi={item.labelHi} lang={currentLang} separator=" "/></span>
                </Link>
            ))}
        </div>
      </header>

      {/* Hero Banner Carousel */}
      <section className="relative w-full h-48 md:h-64 overflow-hidden rounded-xl shadow-lg">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000 ease-in-out flex items-center justify-center text-white p-6 text-center",
              slide.bgColor,
              index === currentSlide ? "opacity-100 z-10" : "opacity-0"
            )}
          >
            <Link href={slide.href} className="block w-full h-full">
              <MemoizedImage src={slide.imageUrl} alt={currentLang === 'en' ? slide.titleEn : slide.titleHi} layout="fill" objectFit="cover" className="absolute inset-0 z-0 opacity-30 data-ai-hint={slide.dataAiHint}" priority={index === 0}/>
              <div className="relative z-10 flex flex-col items-center justify-center h-full">
                <h2 className="text-2xl font-bold mb-1 text-shadow shadow-black/50"><BilingualText en={slide.titleEn} hi={slide.titleHi} lang={currentLang} /></h2>
                <p className="text-sm text-shadow-sm shadow-black/50"><BilingualText en={slide.descriptionEn} hi={slide.descriptionHi} lang={currentLang} /></p>
                 <Button variant="outline" size="sm" className="mt-3 bg-white/20 hover:bg-white/30 border-white text-white backdrop-blur-sm">
                   <BilingualText en="Learn More" hi="और जानें" lang={currentLang} />
                 </Button>
              </div>
            </Link>
          </div>
        ))}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => jumpToSlide(index)}
              className={cn("h-2 w-2 rounded-full transition-all", currentSlide === index ? "w-4 bg-white" : "bg-white/50 hover:bg-white/75")}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Quick Categories */}
      <section>
        <h2 className="text-xl font-semibold text-foreground mb-3"><BilingualText en="Quick Categories" hi="त्वरित श्रेणियाँ" lang={currentLang}/></h2>
        <div className="grid grid-cols-3 sm:grid-cols-3 gap-3">
          {quickCategories.map((category) => (
            <Link href={category.href} key={category.id}>
              <Card className={cn("text-center p-3 rounded-xl shadow-sm hover:shadow-md transition-all h-full flex flex-col justify-center items-center", category.bgColor)}>
                <category.icon className={cn("h-6 w-6 mx-auto mb-1", category.color)} />
                <p className={cn("text-xs font-medium", category.color)}><BilingualText en={category.labelEn} hi={category.labelHi} lang={currentLang} separator=" "/></p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Today’s Recommendations */}
      <section>
        <h2 className="text-xl font-semibold text-foreground mb-3"><BilingualText en="Today's Recommendations" hi="आज की सिफारिशें" lang={currentLang}/></h2>
        <ScrollArea className="w-full whitespace-nowrap pb-3">
          <div className="flex space-x-4">
            {recommendations.map((item) => (
              <Link href={item.href} key={item.id} className="block min-w-[150px] max-w-[150px]">
                <Card className="overflow-hidden rounded-lg shadow hover:shadow-lg transition-shadow h-full flex flex-col">
                  <div className="aspect-[3/4] relative w-full">
                    <MemoizedImage src={item.imageUrl} alt={currentLang === 'en' ? item.titleEn : item.titleHi} layout="fill" objectFit="cover" data-ai-hint={item.dataAiHint} />
                  </div>
                  <CardContent className="p-2.5 flex-grow flex flex-col justify-between">
                    <div>
                        <p className="text-xs font-semibold text-primary truncate"><BilingualText en={item.typeEn} hi={item.typeHi} lang={currentLang}/></p>
                        <h3 className="text-sm font-medium text-foreground leading-tight h-10 overflow-hidden mb-1"><BilingualText en={item.titleEn} hi={item.titleHi} lang={currentLang}/></h3>
                        { (item.descriptionEn || item.descriptionHi) && <p className="text-xs text-muted-foreground truncate"><BilingualText en={item.descriptionEn!} hi={item.descriptionHi!} lang={currentLang}/></p>}
                    </div>
                    <p className="text-sm font-bold text-foreground mt-1"><BilingualText en={item.priceEn} hi={item.priceHi} lang={currentLang}/></p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </section>

      {/* Delivery Deals */}
      <section>
        <h2 className="text-xl font-semibold text-foreground mb-3"><BilingualText en="Delivery Deals" hi="डिलीवरी डील्स" lang={currentLang}/></h2>
         <ScrollArea className="w-full whitespace-nowrap pb-3">
            <div className="flex space-x-3">
                {deliveryDeals.map((deal) => (
                <Card key={deal.id} className={cn("min-w-[200px] p-4 rounded-lg shadow-sm flex items-center gap-3", deal.bgColor, deal.textColor)}>
                    <deal.icon className="h-8 w-8 shrink-0" />
                    <div>
                    <h3 className="text-sm font-bold"><BilingualText en={deal.titleEn} hi={deal.titleHi} lang={currentLang}/></h3>
                    <p className="text-xs opacity-90"><BilingualText en={deal.descriptionEn} hi={deal.descriptionHi} lang={currentLang}/></p>
                    </div>
                </Card>
                ))}
            </div>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </section>
    </div>
  );
}

