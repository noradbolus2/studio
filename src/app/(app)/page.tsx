
"use client";

import React, { useState, useEffect, useRef } from 'react'; 
import Link from 'next/link';
import Image from 'next/image';
import {
  MapPin, Search as SearchIcon, BookOpen as BookIcon, Brain, ShoppingBag, Bot,
  FlaskConical, Package as PackageIcon, Smile, Target, ChevronRight, ChevronLeft, Hand, Star, Users, Briefcase, Bike, FileText, Award, CalendarDays, ClipboardList, Home as HomeIcon, Truck, Settings, User as UserIcon, Sparkles, MessageCircleHeart, Youtube, Library, Cookie, PackageSearch, LocateFixed, Search, Mic, Lightbulb, Music2
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { BilingualText } from '@/components/shared/BilingualText'; 
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';


// Mock data
const user = {
  name: 'Abhishek',
  avatarUrl: 'https://placehold.co/40x40.png',
  dataAiHint: 'student avatar male'
};

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

const studyBoosters = [
  { id: 'sb1', titleEn: "AI Doubt Solver", titleHi: "AI शंका समाधान", descriptionEn: "Clear concepts 24/7", descriptionHi: "अवधारणाएँ 24/7 स्पष्ट करें", icon: Lightbulb, bgColor: "bg-sky-500", textColor: "text-white", dataAiHint:"ai learning lightbulb", href: "/ai-guruji" },
  { id: 'sb2', titleEn: "Quick Revision Notes", titleHi: "त्वरित रिवीजन नोट्स", descriptionEn: "Key topics summarized", descriptionHi: "मुख्य विषय सारांशित", icon: ClipboardList, bgColor: "bg-green-500", textColor: "text-white", dataAiHint:"notes study checklist", href: "/study/my-notes" },
  { id: 'sb3', titleEn: "Focus Zone Music", titleHi: "फोकस ज़ोन संगीत", descriptionEn: "Beats for deep study", descriptionHi: "गहन अध्ययन के लिए बीट्स", icon: Music2, bgColor: "bg-indigo-500", textColor: "text-white", dataAiHint:"headphones music study", href: "/study/focus-music" },
];

const searchIcons = [
    {labelEn: "Books", labelHi: "किताबें", icon: BookIcon, href:"/class-6-12-books"},
    {labelEn: "Projects", labelHi: "प्रोजेक्ट", icon: Brain, href:"/services/projects"},
    {labelEn: "Stationery", labelHi: "स्टेशनरी", icon: PackageIcon, href:"/delivery"},
    {labelEn: "Guruji AI", labelHi: "गुरुजी AI", icon: Bot, href:"/ai-guruji"},
];

const mockLocations = [
    { id: "loc1", name: "Modern School, Barakhamba Road, Delhi", type: "School" },
    { id: "loc2", name: "DPS, R.K. Puram, New Delhi", type: "School" },
    { id: "loc3", name: "City Montessori School, Lucknow", type: "School" },
    { id: "loc4", name: "My Home - Sector 15, Noida", type: "Home" },
    { id: "loc5", name: "Karol Bagh, Delhi", type: "Area" },
    { id: "loc6", name: "Indiranagar, Bengaluru", type: "Area" },
    { id: "loc7", name: "IIT Delhi, Hauz Khas", type: "University" },
    { id: "loc8", name: "St. Stephen's College, Delhi University", type: "College" },
    { id: "loc9", name: "Anna University, Chennai", type: "University" },
    { id: "loc10", name: "Christ University, Bengaluru", type: "University" },
    { id: "loc11", name: "Koramangala, Bengaluru", type: "Area" },
    { id: "loc12", name: "Bandra West, Mumbai", type: "Area" },
    { id: "loc13", name: "Jadavpur University, Kolkata", type: "University" },
    { id: "loc14", name: "Loyola College, Chennai", type: "College" },
    { id: "loc15", name: "Park Street Area, Kolkata", type: "Area" },
    { id: "loc16", name: "BITS Pilani, Rajasthan", type: "University" },
];

export default function ModernHomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [currentLang, setCurrentLang] = useState<'en' | 'hi'>('en'); 
  const [location, setLocation] = useState("Modern School, Barakhamba");
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [locationSearchTerm, setLocationSearchTerm] = useState("");
  const [selectedTempLocation, setSelectedTempLocation] = useState(location);
  const { toast } = useToast();

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

  const handleLocationConfirm = () => {
    setLocation(selectedTempLocation);
    setIsLocationModalOpen(false);
    toast({
      title: "Location Updated",
      description: `Your location is now set to ${selectedTempLocation}.`,
    });
  };

  const handleUseCurrentLocation = () => {
    // Placeholder for actual geolocation logic
    const detectedLocation = "My Current Area (Detected)";
    setSelectedTempLocation(detectedLocation);
    toast({
      title: "Using Current Location (Simulated)",
      description: `Location set to ${detectedLocation}. Confirm to save.`,
    });
  };

  const filteredLocations = mockLocations.filter(loc =>
    loc.name.toLowerCase().includes(locationSearchTerm.toLowerCase())
  );


  return (
    <div className="space-y-6 pb-10 bg-background min-h-screen -m-4 p-4">
      {/* Top Section */}
      <header className="space-y-3 sticky top-0 bg-background/80 backdrop-blur-sm z-40 py-3 -mx-4 px-4 shadow-sm">
        <div className="flex items-center justify-between">
         <Button variant="ghost" onClick={() => setIsLocationModalOpen(true)} className="flex items-center gap-1.5 text-sm text-muted-foreground p-1 h-auto hover:bg-muted">
            <MapPin className="h-5 w-5 text-primary" />
            <span className="font-medium truncate max-w-[180px] sm:max-w-[220px] text-left">{location}</span>
            <ChevronRight className="h-4 w-4 opacity-70 shrink-0" />
          </Button>
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
            <p className="text-muted-foreground text-sm"><BilingualText en="Ready to learn something new?" hi="कुछ नया सीखने के लिए तैयार हैं?" lang={currentLang} /></p>
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

      {/* Study Boosters Section */}
      <section>
        <h2 className="text-xl font-semibold text-foreground mb-3">
          <BilingualText en="Study Boosters" hi="अध्ययन बूस्टर" lang={currentLang}/>
        </h2>
        <ScrollArea className="w-full whitespace-nowrap pb-3">
          <div className="flex space-x-3">
            {studyBoosters.map((booster) => {
              const CardWrapper = booster.href ? Link : 'div';
              return (
                <CardWrapper href={booster.href || '#'} key={booster.id} className={cn("block min-w-[200px] max-w-[240px]", booster.href ? "hover:opacity-90 transition-opacity" : "")}>
                  <Card className={cn("p-4 rounded-lg shadow-sm flex items-center gap-3 h-full", booster.bgColor, booster.textColor)}>
                    <booster.icon className="h-8 w-8 shrink-0" />
                    <div>
                      <h3 className="text-sm font-bold"><BilingualText en={booster.titleEn} hi={booster.titleHi} lang={currentLang}/></h3>
                      <p className="text-xs opacity-90"><BilingualText en={booster.descriptionEn} hi={booster.descriptionHi} lang={currentLang}/></p>
                    </div>
                  </Card>
                </CardWrapper>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </section>


      {/* Location Selection Modal */}
      <Dialog open={isLocationModalOpen} onOpenChange={setIsLocationModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle><BilingualText en="Select Your Location" hi="अपना स्थान चुनें" lang={currentLang} /></DialogTitle>
            <DialogDescription>
              <BilingualText en="Choose your school or area for personalized content and faster delivery." hi="व्यक्तिगत सामग्री और तेजी से वितरण के लिए अपना स्कूल या क्षेत्र चुनें।" lang={currentLang} />
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Button variant="outline" onClick={handleUseCurrentLocation} className="w-full justify-start gap-2">
              <LocateFixed className="h-4 w-4" /> <BilingualText en="Use My Current Location" hi="मेरे वर्तमान स्थान का उपयोग करें" lang={currentLang}/>
            </Button>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={currentLang === 'en' ? "Search school or area..." : "स्कूल या क्षेत्र खोजें..."}
                value={locationSearchTerm}
                onChange={(e) => setLocationSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <RadioGroup value={selectedTempLocation} onValueChange={setSelectedTempLocation}>
              <ScrollArea className="h-[200px] w-full rounded-md border p-2">
                {filteredLocations.length > 0 ? filteredLocations.map((loc) => (
                  <div key={loc.id} className="flex items-center space-x-2 p-2 hover:bg-muted/50 rounded-md">
                    <RadioGroupItem value={loc.name} id={loc.id} />
                    <Label htmlFor={loc.id} className="font-normal cursor-pointer flex-1">
                      {loc.name}
                      <span className="text-xs text-muted-foreground ml-1">({loc.type})</span>
                    </Label>
                  </div>
                )) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    <BilingualText en="No locations found for your search." hi="आपकी खोज के लिए कोई स्थान नहीं मिला।" lang={currentLang}/>
                  </p>
                )}
                <ScrollBar orientation="vertical" />
              </ScrollArea>
            </RadioGroup>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <DialogClose asChild>
              <Button type="button" variant="outline"><BilingualText en="Cancel" hi="रद्द करें" lang={currentLang}/></Button>
            </DialogClose>
            <Button type="button" onClick={handleLocationConfirm}><BilingualText en="Confirm Location" hi="स्थान की पुष्टि करें" lang={currentLang}/></Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}

