
"use client";

import React, { useState, useEffect, useRef, useMemo, type FormEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; 
import {
  MapPin, Search as SearchIcon, BookOpen as BookIcon, Brain, ShoppingCart, Bot,
  FlaskConical, Package as PackageIcon, Smile, Target, ChevronRight, ChevronLeft, Hand, Star, Users, Briefcase, Bike, FileText, Award, CalendarDays, ClipboardList, Home as HomeIconLucide, Truck, Settings, User as UserIcon, Sparkles, MessageCircleHeart, Youtube, Library, Cookie, PackageSearch, LocateFixed, Mic, Lightbulb, Music2, GraduationCap, Video,
  RadioTower,
  Timer,    
  PlaySquare,
  Gem, // Added for premium card
  ArrowRight, // Added for premium card button
  FileSignature,
  History,
  Palette,
  Gift,
  LogOut,
  LifeBuoy,
} from 'lucide-react';
import { BrainCircuit } from '@/components/shared/LoadingSpinner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { BilingualText } from '@/components/shared/BilingualText';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';
import { ClassCard, type LiveClass } from '@/components/live-class/ClassCard';
import type { ProfileFormData } from './edit-profile/page'; 
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DynamicQuoteCard } from '@/components/dashboard/DynamicQuoteCard';

// Mock data
const defaultUser = {
  name: 'Abhishek Verma',
  avatarUrl: 'https://images.unsplash.com/photo-1635194936300-08a36d3a90de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHxzdHVkZW50JTIwYXZhdGFyfGVufDB8fHx8MTc1MTE1NDgyM3ww&ixlib=rb-4.1.0&q=80&w=1080',
  dataAiHint: 'student avatar'
};

const heroSlides = [
  { id: 1, titleEn: "1-Click Project Help", titleHi: "1-क्लिक प्रोजेक्ट सहायता", descriptionEn: "AI assistance & material kits", descriptionHi: "एआई सहायता और सामग्री किट", imageUrl: "https://images.unsplash.com/photo-1640955785023-1854685dae05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxwcm9qZWN0JTIwaGVscCUyMHRlY2hub2xvZ3l8ZW58MHx8fHwxNzUxMTU0ODIzfDA&ixlib=rb-4.1.0&q=80&w=1080", dataAiHint: "project help technology", href:"/creator-marketplace" },
  { id: 2, titleEn: "Study Material in 30 Mins!", titleHi: "30 मिनट में अध्ययन सामग्री!", descriptionEn: "Notes, books & stationery, delivered fast", descriptionHi: "नोट्स, किताबें और स्टेशनरी, तेजी से डिलीवर", imageUrl: "https://images.unsplash.com/photo-1646920912229-bc0d5d94e68b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxmYXN0JTIwZGVsaXZlcnklMjBib29rc3xlbnwwfHx8fDE3NTExNTQ4MjN8MA&ixlib.rb-4.1.0&q=80&w=1080", dataAiHint: "fast delivery books", href:"/delivery" },
  { id: 3, titleEn: "OSO Guruji is Online", titleHi: "OSO गुरुजी ऑनलाइन हैं", descriptionEn: "Your 24/7 study partner", descriptionHi: "आपका 24/7 अध्ययन भागीदार", imageUrl: "https://images.unsplash.com/photo-1538491247542-5da27794bc65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxhaSUyMHJvYm90JTIwdGVhY2hpbmd8ZW58MHx8fHwxNzUxMTU0ODIzfDA&ixlib.rb-4.1.0&q=80&w=1080", dataAiHint: "ai robot teaching", href:"/ai-guruji" },
];

const baseQuickCategories = [
  { id: 'oso_library', labelEn: 'OSO Library', labelHi: 'OSO पुस्तकालय', icon: Library, href: '/class-6-12-books', color: 'text-primary', bgColor: 'bg-primary/10 hover:bg-primary/20', keywords: ["book", "library", "ncert", "textbook", "syllabus", "class", "exam book", "competitive", "preparation"] },
  { id: 'projects', labelEn: 'Creator Projects', labelHi: 'निर्माता प्रोजेक्ट', icon: Users, href: '/creator-marketplace', color: 'text-accent-foreground', bgColor: 'bg-accent/20 hover:bg-accent/30', keywords: ["project", "model", "assignment", "homework", "creator", "marketplace"] },
  { id: 'stationery', labelEn: 'Stationery', labelHi: 'स्टेशनरी', icon: PackageIcon, href: '/delivery', color: 'text-primary', bgColor: 'bg-primary/10 hover:bg-primary/20', keywords: ["stationery", "pen", "notebook", "delivery"] },
  { id: 'brainmate', labelEn: 'Brainmate', labelHi: 'ब्रेनमेट', icon: BrainCircuit, href: '/brainmate', color: 'text-accent-foreground', bgColor: 'bg-accent/20 hover:bg-accent/30', keywords: ["brainmate", "concept", "explain", "ai"] },
  { id: 'oso_vaani', labelEn: 'OSO Vaani', labelHi: 'OSO वाणी', icon: Bot, href: '/ai-voice-call', color: 'text-primary', bgColor: 'bg-primary/10 hover:bg-primary/20', keywords: ["vaani", "buddy", "support", "call", "voice", "help"] },
  { id: 'revision_vault', labelEn: 'Revision Vault', labelHi: 'रिवीजन वॉल्ट', icon: History, href: '/study/revision-vault', color: 'text-primary', bgColor: 'bg-primary/10 hover:bg-primary/20', keywords: ["revision", "vault", "doubts", "marked", "history"] },
  { id: 'mind_diary', labelEn: 'Mind Diary', labelHi: 'माइंड डायरी', icon: Smile, href: '/mind-diary', color: 'text-accent-foreground', bgColor: 'bg-accent/20 hover:bg-accent/30', keywords: ["mind", "mood", "diary", "stress"] },
  { id: 'handwriting_notes', labelEn: 'Handwriting', labelHi: 'हस्तलेखन', icon: FileSignature, href: '/handwriting-notes', color: 'text-primary', bgColor: 'bg-primary/10 hover:bg-primary/20', keywords: ["handwriting", "notes", "writing", "script"] },
  { id: 'test_series', labelEn: 'Test Series', labelHi: 'टेस्ट सीरीज़', icon: Target, href: '/test-series', color: 'text-accent-foreground', bgColor: 'bg-accent/20 hover:bg-accent/30', keywords: ["test", "mock", "exam", "neet", "jee", "upsc", "cat", "competitive"] },
  { id: 'brain_scan', labelEn: 'Aura Map', labelHi: 'ऑरा मैप', icon: Brain, href: '/brain-scan-report', color: 'text-primary', bgColor: 'bg-primary/10 hover:bg-primary/20', keywords: ["brain", "focus", "stress", "attention", "aura"] },
  { id: 'oso_circle', labelEn: 'OSO Circle', labelHi: 'OSO सर्कल', icon: Users, href: '/circle', color: 'text-accent-foreground', bgColor: 'bg-accent/20 hover:bg-accent/30', keywords: ["peer", "circle", "connect", "group"] },
  { id: 'college_predictor', labelEn: 'College Predictor', labelHi: 'कॉलेज भविष्यवक्ता', icon: GraduationCap, href: '/college-predictor', color: 'text-primary', bgColor: 'bg-primary/10 hover:bg-primary/20', keywords: ["college", "admission", "predictor", "university"] },
  { id: 'study_dashboard', labelEn: 'Study Dashboard', labelHi: 'अध्ययन डैशबोर्ड', icon: ClipboardList, href: '/study-dashboard', color: 'text-accent-foreground', bgColor: 'bg-accent/20 hover:bg-accent/30', keywords: ["study", "dashboard", "notes", "offline", "tracker", "progress"] },
  { id: 'schedule_class', labelEn: 'Live Classes', labelHi: 'लाइव कक्षाएं', icon: Video, href: '/live-classes/all', color: 'text-primary', bgColor: 'bg-primary/10 hover:bg-primary/20', keywords: ["class", "live", "schedule", "online class"] },
];

const recommendationsMock = [
  { id: 'rec_book_neet', typeEn: 'Book', typeHi: 'किताब', titleEn: 'Objective Biology for NEET', titleHi: 'नीट के लिए वस्तुनिष्ठ जीवविज्ञान', imageUrl: 'https://images.unsplash.com/photo-1636959865743-f3999844bdff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxuZWV0JTIwYmlvbG9neSUyMGJvb2t8ZW58MHx8fHwxNzUxMTU0ODIzfDA&ixlib=rb-4.1.0&q=80&w=1080', dataAiHint: "neet biology book", href: '/competitive-bookstore', priceEn: 'INR 799', priceHi: 'INR 799', relevance: ['neet', 'medical'] },
  { id: 'rec_project_volcano', typeEn: 'Project', typeHi: 'प्रोजेक्ट', titleEn: 'Volcano Model Kit', titleHi: 'ज्वालामुखी मॉडल किट', descriptionEn: 'Get All Materials', descriptionHi: 'सभी सामग्री प्राप्त करें', imageUrl: 'https://images.unsplash.com/photo-1720210745848-5a47be4d5ac1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHx2b2xjYW5vJTIwbW9kZWwlMjBraXR8ZW58MHx8fHwxNzUxMTU0ODIzfDA&ixlib.rb-4.1.0&q=80&w=1080', dataAiHint: "volcano model kit", href: '/creator-marketplace', priceEn: 'INR 299', priceHi: 'INR 299', relevance: ['science', 'class 6', 'class 7', 'class 8'] },
  { id: 'rec_guruji_jee', typeEn: 'Guruji Advice', typeHi: 'गुरुजी सलाह', titleEn: 'Ask Guruji: JEE Physics Doubts', titleHi: 'गुरुजी से पूछें: JEE भौतिकी शंकाएँ', descriptionEn: 'Clear your concepts', descriptionHi: 'अपनी अवधारणाएँ स्पष्ट करें', imageUrl: 'https://images.unsplash.com/photo-1606479067834-db5efd9f2fe9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxhaSUyMGNoYXQlMjBleGFtfGVufDB8fHx8MTc1MTE1NDgyM3ww&ixlib.rb-4.1.0&q=80&w=1080', dataAiHint: "ai chat exam", href: '/ai-guruji', priceEn: 'Free', priceHi: 'निःशुल्क', relevance: ['jee', 'physics', 'engineering'] },
  { id: 'rec_test_jee', typeEn: 'Test', typeHi: 'टेस्ट', titleEn: 'JEE Main Mock Test Series', titleHi: 'JEE मुख्य मॉक टेस्ट सीरीज़', descriptionEn: 'Full Syllabus Coverage', descriptionHi: 'पूर्ण पाठ्यक्रम कवरेज', imageUrl: 'https://images.unsplash.com/photo-1665470909939-959569b20021?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMHx8b25saW5lJTIwdGVzdCUyMGludGVyZmFjZXxlbnwwfHx8fDE3NTExNTQ4MjN8MA&ixlib.rb-4.1.0&q=80&w=1080', dataAiHint: "online test interface", href: '/test-series', priceEn: 'INR 199', priceHi: 'INR 199', relevance: ['jee', 'engineering'] },
  { id: 'rec_book_class10_math', typeEn: 'Book', typeHi: 'किताब', titleEn: 'NCERT Maths Class 10 Exemplar', titleHi: 'एनसीईआरटी गणित कक्षा 10 उदाहरण', imageUrl: 'https://placehold.co/150x200.png', dataAiHint: "class 10 maths book", href: '/class-6-12-books', priceEn: 'INR 150', priceHi: 'INR 150', relevance: ['class 10', 'maths', 'cbse', 'ncert'] },
];

const deliveryDeals = [
  { id: 'deal1', titleEn: "Charts in 20 mins!", titleHi: "20 मिनट में चार्ट!", descriptionEn: "All sizes & types", descriptionHi: "सभी आकार और प्रकार", icon: FileText, iconColor: "text-accent-foreground", dataAiHint:"charts diagram", href: "/delivery" },
  { id: 'deal2', titleEn: "INR 10 Off School Kits", titleHi: "स्कूल किट पर INR 10 की छूट", descriptionEn: "Notebooks, Pens & More", descriptionHi: "नोटबुक, पेन और बहुत कुछ", icon: PackageSearch, iconColor: "text-primary", dataAiHint:"school supplies kit", href: "/delivery" },
  { id: 'deal3', titleEn: "Project Emergency?", titleHi: "प्रोजेक्ट इमरजेंसी?", descriptionEn: "Materials in a Jiffy!", descriptionHi: "सामान झटपट!", icon: Brain, iconColor: "text-destructive", dataAiHint:"project materials box", href: "/delivery" },
];

const studyFestivalKits = [
  { id: 'kit1', titleEn: "Board Exam Kit", titleHi: "बोर्ड परीक्षा किट", descriptionEn: "Pens, pads & more", descriptionHi: "पेन, पैड और बहुत कुछ", icon: Gift, iconColor: "text-primary", dataAiHint:"exam preparation kit", href: "/vendor-dashboard/bundles" },
  { id: 'kit2', titleEn: "Admission Starter", titleHi: "एडमिशन स्टार्टर", descriptionEn: "New bag, notebooks...", descriptionHi: "नया बैग, नोटबुक...", icon: PackageSearch, iconColor: "text-success", dataAiHint:"school supplies bag", href: "/vendor-dashboard/bundles" },
  { id: 'kit3', titleEn: "Creative Corner", titleHi: "रचनात्मक कॉर्नर", descriptionEn: "Art supplies combo", descriptionHi: "कला आपूर्ति कॉम्बो", icon: Palette, iconColor: "text-destructive", dataAiHint:"art supplies box", href: "/vendor-dashboard/bundles" },
];


const studyBoosters = [
  { id: 'sb1', titleEn: "Guruji Doubt Solver", titleHi: "गुरुजी शंका समाधान", descriptionEn: "Clear concepts 24/7", descriptionHi: "अवधारणाएँ 24/7 स्पष्ट करें", icon: Lightbulb, iconColor: "text-primary", dataAiHint:"ai learning lightbulb", href: "/ai-guruji" },
  { id: 'sb2', titleEn: "Quick Revision Notes", titleHi: "त्वरित रिवीजन नोट्स", descriptionEn: "Key topics summarized", descriptionHi: "मुख्य विषय सारांशित", icon: ClipboardList, iconColor: "text-success", dataAiHint:"notes study checklist", href: "/study/my-notes" },
  { id: 'sb3', titleEn: "Focus Zone Music", titleHi: "फोकस ज़ोन संगीत", descriptionEn: "Beats for deep study", descriptionHi: "गहन अध्ययन के लिए बीट्स", icon: Music2, iconColor: "text-secondary-foreground", dataAiHint:"headphones music study", href: "/study/focus-music" },
];

const searchIcons = [
    {labelEn: "Library", labelHi: "पुस्तकालय", icon: Library, href:"/class-6-12-books"},
    {labelEn: "Projects", labelHi: "प्रोजेक्ट", icon: Brain, href:"/creator-marketplace"},
    {labelEn: "Stationery", labelHi: "स्टेशनरी", icon: PackageIcon, href:"/delivery"},
    {labelEn: "Guruji", labelHi: "गुरुजी", icon: Bot, href:"/ai-guruji"},
];

const mockLocations = [
    { id: "myhome_noida", name: "My Home - Sector 15, Noida", type: "Home" },
    { id: "current_loc", name: "My Current Location", type: "Current" },
    { id: "del_modern", name: "Modern School, Barakhamba Road, Delhi", type: "School" },
];

const LIVE_CLASSES_KEY = "liveClasses_mock";

type LangState = 'en' | 'hi' | 'hng';

export default function ModernHomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [currentLang, setCurrentLang] = useState<LangState>('en');
  const [location, setLocation] = useState("Modern School, Barakhamba Road, Delhi");
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [locationSearchTerm, setLocationSearchTerm] = useState("");
  const [selectedTempLocation, setSelectedTempLocation] = useState(location);
  const { toast } = useToast();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [profileData, setProfileData] = useState<ProfileFormData | null>(null);
  const [displayName, setDisplayName] = useState(defaultUser.name);
  const [displayAvatar, setDisplayAvatar] = useState(defaultUser.avatarUrl);
  const [displayAvatarHint, setDisplayAvatarHint] = useState(defaultUser.dataAiHint);
  const [personalizedRecommendations, setPersonalizedRecommendations] = useState(recommendationsMock.slice(0,4)); // Show 4 by default
  const [allLiveClasses, setAllLiveClasses] = useState<LiveClass[]>([]);
  const [personalizedLiveClasses, setPersonalizedLiveClasses] = useState({ liveNow: [] as LiveClass[], upcoming: [] as LiveClass[], recorded: [] as LiveClass[] });

  const handleLogout = () => {
    if (typeof window !== "undefined") {
        localStorage.removeItem('loggedInUser'); 
        localStorage.removeItem('userProfileData'); 
    }
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    router.push('/login');
  };


  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedProfile = localStorage.getItem('userProfileData');
      if (storedProfile) {
        try {
          const parsedProfile = JSON.parse(storedProfile) as ProfileFormData;
          setProfileData(parsedProfile);
          if (parsedProfile.fullName) setDisplayName(parsedProfile.fullName);
          if (parsedProfile.avatarUrl) setDisplayAvatar(parsedProfile.avatarUrl);
          if (parsedProfile.dataAiHint) setDisplayAvatarHint(parsedProfile.dataAiHint);
        } catch (err) {
          console.warn("Could not parse profile data from localStorage for Home Page:", err);
        }
      }

      const storedClasses = localStorage.getItem(LIVE_CLASSES_KEY);
      if (storedClasses) {
        setAllLiveClasses(JSON.parse(storedClasses));
      }
    }
  }, []);

  useEffect(() => {
    // Personalize Recommendations
    if (profileData) {
      const profileKeywords = [
        profileData.examTarget?.toLowerCase(),
        profileData.className?.toLowerCase(),
        profileData.subject?.toLowerCase(),
        profileData.stream?.toLowerCase()
      ].filter(Boolean) as string[];

      if (profileKeywords.length > 0) {
        const filteredRecs = recommendationsMock.filter(rec =>
          profileKeywords.some(pk => rec.relevance.some(rr => rr.toLowerCase().includes(pk)))
        );
        setPersonalizedRecommendations(filteredRecs.length > 0 ? filteredRecs.slice(0, 4) : recommendationsMock.slice(0, 4));
      }
    }

    // Personalize Live Classes
    let liveNow: LiveClass[] = [];
    let upcoming: LiveClass[] = [];
    let recorded: LiveClass[] = [];
    let personalizedClassesFound = false;

    if (profileData) {
        const examTargetLower = profileData.examTarget?.toLowerCase();
        const classNameLower = profileData.className?.toLowerCase();

        allLiveClasses.forEach(lc => {
            let matches = false;
            if (examTargetLower && lc.classLevel?.toLowerCase().includes(examTargetLower)) {
                matches = true;
            } else if (classNameLower && lc.classLevel?.toLowerCase().includes(classNameLower)) {
                matches = true;
            }

            if (matches) {
                personalizedClassesFound = true;
                if (lc.status === 'live') liveNow.push(lc);
                else if (lc.status === 'upcoming') upcoming.push(lc);
                else if (lc.status === 'recorded') recorded.push(lc);
            }
        });
    }
    
    // If no profile or no personalized classes were found, show all classes.
    if (!profileData || !personalizedClassesFound) {
        allLiveClasses.forEach(lc => {
            if (lc.status === 'live' && !liveNow.find(c => c.id === lc.id)) liveNow.push(lc);
            else if (lc.status === 'upcoming' && !upcoming.find(c => c.id === lc.id)) upcoming.push(lc);
            else if (lc.status === 'recorded' && !recorded.find(c => c.id === lc.id)) recorded.push(lc);
        });
    }

    setPersonalizedLiveClasses({
        liveNow: liveNow.sort((a,b) => (b.viewers || 0) - (a.viewers || 0)),
        upcoming: upcoming.sort((a,b) => new Date(a.dateTime!).getTime() - new Date(b.dateTime!).getTime()),
        recorded: recorded.sort((a,b) => new Date(b.dateTime!).getTime() - new Date(a.dateTime!).getTime()),
    });

  }, [profileData, allLiveClasses]);


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
    setCurrentLang(prevLang => {
      if (prevLang === 'en') return 'hi';
      if (prevLang === 'hi') return 'hng';
      return 'en';
    });
  };

  const getLanguageButtonText = () => {
    if (currentLang === 'en') return 'हिन्दी';
    if (currentLang === 'hi') return 'Hinglish';
    return 'English';
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
    const detectedLocation = "My Current Area (Detected)";
    setSelectedTempLocation(detectedLocation);
    toast({
      title: "Using Current Location",
      description: `Location set to ${detectedLocation}. Confirm to save.`,
    });
  };

  const filteredLocations = mockLocations.filter(loc =>
    loc.name.toLowerCase().includes(locationSearchTerm.toLowerCase())
  );

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      router.push(`/search-results?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const quickCategories = useMemo(() => {
    if (!profileData) return baseQuickCategories.map(cat => ({ ...cat, isRecommended: false }));

    const { examTarget, className, stream, subject: profileSubject } = profileData;
    let targetKeywords: string[] = [];

    if (examTarget) targetKeywords.push(...examTarget.toLowerCase().split(/[\s(),/-]+/));
    if (className) targetKeywords.push(...className.toLowerCase().split(/[\s(),/-]+/));
    if (stream) targetKeywords.push(...stream.toLowerCase().split(/[\s(),/-]+/));
    if (profileSubject) targetKeywords.push(...profileSubject.toLowerCase().split(/[\s(),/-]+/));

    targetKeywords = targetKeywords.filter(Boolean).map(k => k.trim()).filter(k => k.length > 1);

    return baseQuickCategories.map(category => {
        const isRecommended = targetKeywords.some(keyword =>
            category.keywords.some(catKeyword => catKeyword.toLowerCase().includes(keyword) || keyword.includes(catKeyword.toLowerCase()))
        );
        return { ...category, isRecommended };
    });
  }, [profileData]);


  return (
    <div className="space-y-6 pb-10 min-h-screen -m-4 p-4 bg-background">
      <header className="space-y-3 sticky top-0 bg-gradient-to-br from-primary/10 via-background to-accent/10 z-40 py-3 -mx-4 px-4 shadow-sm border-b border-border/20">
        <div className="flex items-center justify-between">
         <Button variant="ghost" onClick={() => setIsLocationModalOpen(true)} className="flex items-center gap-1.5 text-sm text-muted-foreground p-1 h-auto hover:bg-card">
            <MapPin className="h-5 w-5 text-primary" />
            <span className="font-medium truncate max-w-[180px] sm:max-w-[220px] text-left text-foreground">{location}</span>
            <ChevronRight className="h-4 w-4 opacity-70 shrink-0" />
          </Button>
          <div className="flex items-center gap-2">
            <Button onClick={toggleLanguage} variant="outline" size="sm" className="text-xs h-7 px-2 border-border hover:bg-card text-muted-foreground">
              {getLanguageButtonText()}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
                  <Avatar className="h-8 w-8 border-2 border-primary">
                    <AvatarImage src={displayAvatar || 'https://images.unsplash.com/photo-1635194936300-08a36d3a90de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHxzdHVkZW50JTIwYXZhdGFyfGVufDB8fHx8MTc1MTE1NDgyM3ww&ixlib=rb-4.1.0&q=80&w=1080'} alt={displayName} data-ai-hint={displayAvatarHint || 'student avatar'} />
                    <AvatarFallback>{displayName.substring(0,1)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{displayName}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {profileData?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/help">
                    <LifeBuoy className="mr-2 h-4 w-4" />
                    <span>Help & Support</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                 <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="px-0">
            <h1 className="text-2xl font-bold text-foreground">
                <BilingualText en={`Hello, ${displayName}`} hi={`नमस्ते, ${displayName}`} hng={`Hello, ${displayName}`} lang={currentLang} /> <Hand className="inline h-6 w-6 text-yellow-400" />
            </h1>
            <p className="text-muted-foreground text-sm"><BilingualText en="Let's start your learning journey." hi="आइए आपकी सीखने की यात्रा शुरू करें।" hng="Chalo, learning journey start karte hain." lang={currentLang} /></p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex-grow">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
            <Input
              type="search"
              placeholder={currentLang === 'en' ? "Search for books, projects, stationery..." : currentLang === 'hi' ? "किताबें, प्रोजेक्ट, स्टेशनरी खोजें..." : "Search books, projects, stationery..."}
              className="pl-10 h-12 text-base border-border/50 focus:border-accent focus:ring-accent rounded-lg shadow-sm bg-background placeholder:text-muted-foreground"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearchSubmit();
                }
              }}
            />
          </div>
          <Button onClick={handleSearchSubmit} size="icon" className="h-12 w-12 flex-shrink-0 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground" aria-label={currentLang === 'en' ? "Search" : "खोजें"}>
            <SearchIcon className="h-5 w-5" />
          </Button>
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

      <DynamicQuoteCard lang={currentLang} />

      <section className="relative w-full h-48 md:h-64 overflow-hidden rounded-xl shadow-lg shadow-black/20">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000 ease-in-out flex items-center justify-center text-primary-foreground p-6 text-center",
              "bg-black/30",
              index === currentSlide ? "opacity-100 z-10" : "opacity-0"
            )}
          >
            <MemoizedImage
              src={slide.imageUrl || 'https://images.unsplash.com/photo-1640955785023-1854685dae05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxwcm9qZWN0JTIwaGVscCUyMHRlY2hub2xvZ3l8ZW58MHx8fHwxNzUxMTU0ODIzfDA&ixlib=rb-4.1.0&q=80&w=1080'}
              alt={currentLang === 'en' ? slide.titleEn : slide.titleHi}
              layout="fill"
              objectFit="cover"
              className="absolute inset-0 z-0 opacity-80"
              data-ai-hint={slide.dataAiHint || 'hero image'}
              priority={index === 0}
            />
            <Link href={slide.href} className="relative z-10 flex flex-col items-center justify-center h-full w-full bg-gradient-to-t from-black/50 via-transparent to-black/10 p-4">
              <div>
                <h2 className="text-2xl font-bold mb-1 drop-shadow-lg"><BilingualText en={slide.titleEn} hi={slide.titleHi} lang={currentLang} /></h2>
                <p className="text-sm drop-shadow-md"><BilingualText en={slide.descriptionEn} hi={slide.descriptionHi} lang={currentLang} /></p>
                 <Button variant="default" size="sm" className="mt-3 bg-accent text-accent-foreground hover:bg-accent/90 shadow-md">
                   <BilingualText en="Explore Now" hi="अभी एक्सप्लोर करें" lang={currentLang} />
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
              className={cn("h-2 w-2 rounded-full transition-all", currentSlide === index ? "w-4 bg-accent" : "bg-foreground/50 hover:bg-foreground/75")}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold text-foreground"><BilingualText en="Live Classes" hi="लाइव कक्षाएं" lang={currentLang}/></h2>
            <Link href="/live-classes/all" className="text-sm text-primary hover:underline">
                <BilingualText en="View All" hi="सभी देखें" lang={currentLang}/> <ChevronRight className="inline h-4 w-4"/>
            </Link>
        </div>
        {personalizedLiveClasses.liveNow.length > 0 && (
            <div className="mb-4">
                <h3 className="text-md font-medium text-destructive mb-2 flex items-center"> {}
                    <RadioTower size={18} className="mr-1.5 animate-pulse"/> <BilingualText en="Live Now" hi="अभी लाइव" lang={currentLang}/>
                </h3>
                <ScrollArea className="w-full whitespace-nowrap pb-2.5">
                    <div className="flex space-x-4">
                        {personalizedLiveClasses.liveNow.map(lc => <ClassCard key={lc.id} classInfo={{...lc, lang: currentLang}} lang={currentLang} className="min-w-[280px] max-w-[280px]"/>)}
                    </div>
                    <ScrollBar orientation="horizontal"/>
                </ScrollArea>
            </div>
        )}
        {personalizedLiveClasses.upcoming.length > 0 && (
             <div className="mb-4">
                <h3 className="text-md font-medium text-foreground mb-2 flex items-center">
                    <Timer size={18} className="mr-1.5 text-accent"/> <BilingualText en="Upcoming Classes" hi="आगामी कक्षाएं" lang={currentLang}/>
                </h3>
                <ScrollArea className="w-full whitespace-nowrap pb-2.5">
                    <div className="flex space-x-4">
                        {personalizedLiveClasses.upcoming.map(lc => <ClassCard key={lc.id} classInfo={{...lc, lang: currentLang}} lang={currentLang} className="min-w-[280px] max-w-[280px]"/>)}
                    </div>
                    <ScrollBar orientation="horizontal"/>
                </ScrollArea>
            </div>
        )}
        {personalizedLiveClasses.recorded.length > 0 && (
            <div>
                <h3 className="text-md font-medium text-foreground mb-2 flex items-center">
                     <PlaySquare size={18} className="mr-1.5 text-primary"/> <BilingualText en="Recently Completed" hi="हाल ही में संपन्न" lang={currentLang}/>
                </h3>
                 <ScrollArea className="w-full whitespace-nowrap pb-2.5">
                    <div className="flex space-x-4">
                        {personalizedLiveClasses.recorded.map(lc => <ClassCard key={lc.id} classInfo={{...lc, lang: currentLang}} lang={currentLang} className="min-w-[280px] max-w-[280px]"/>)}
                    </div>
                    <ScrollBar orientation="horizontal"/>
                </ScrollArea>
            </div>
        )}
         {personalizedLiveClasses.liveNow.length === 0 && personalizedLiveClasses.upcoming.length === 0 && personalizedLiveClasses.recorded.length === 0 && (
             <p className="text-sm text-muted-foreground text-center py-4"><BilingualText en="No live classes relevant to your profile right now. Check 'View All' for more!" hi="अभी आपकी प्रोफ़ाइल के लिए कोई प्रासंगिक लाइव कक्षाएं नहीं हैं। अधिक के लिए 'सभी देखें'!" lang={currentLang}/></p>
         )}
      </section>


      <section>
        <h2 className="text-xl font-semibold text-foreground mb-3"><BilingualText en="Quick Categories" hi="त्वरित श्रेणियाँ" lang={currentLang}/></h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {quickCategories.map((category) => (
            <Link href={category.href} key={category.id}>
              <Card className={cn(
                "text-center p-3 rounded-xl shadow-sm hover:shadow-lg transition-all h-full flex flex-col justify-center items-center relative overflow-hidden",
                category.bgColor,
                category.isRecommended && "border-2 border-accent shadow-accent/20"
              )}>
                {category.isRecommended && (
                    <Badge className="absolute top-1 right-1 text-xs px-1.5 py-0.5 bg-accent text-accent-foreground border-accent">
                       <BilingualText en="For You" hi="आपके लिए" lang={currentLang}/>
                    </Badge>
                )}
                <category.icon className={cn("h-6 w-6 mx-auto mb-1", category.color)} />
                <p className={cn("text-xs font-medium", category.color)}><BilingualText en={category.labelEn} hi={category.labelHi} lang={currentLang} separator=" "/></p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <Card className="bg-gradient-to-r from-primary/20 via-card to-primary/20 border-primary/30 shadow-lg hover:shadow-primary/20 transition-all">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-xl font-headline text-primary">
                        <BilingualText en="Unlock OSO Premium" hi="OSO प्रीमियम अनलॉक करें" />
                    </CardTitle>
                    <CardDescription className="text-primary/80 dark:text-primary/80">
                        <BilingualText en="Get unlimited access to all features." hi="सभी सुविधाओं तक असीमित पहुंच प्राप्त करें।" />
                    </CardDescription>
                </div>
                <Gem className="h-10 w-10 text-primary opacity-80" />
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                    <BilingualText en="Upgrade for unlimited AI Guruji chats, advanced analytics, and more! Plans start at INR 149/month or save with our yearly plan at INR 999." hi="असीमित एआई गुरुजी चैट, उन्नत विश्लेषण, और बहुत कुछ के लिए अपग्रेड करें! योजनाएं INR 149/माह से शुरू होती हैं या INR 999 की हमारी वार्षिक योजना के साथ बचत करें।" />
                </p>
            </CardContent>
            <CardFooter>
                 <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Link href="/subscribe">
                        <BilingualText en="View Premium Plans" hi="प्रीमियम योजनाएं देखें" /> <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    </section>

      <section>
        <h2 className="text-xl font-semibold text-foreground mb-3"><BilingualText en="Today's Recommendations" hi="आज की सिफारिशें" lang={currentLang}/></h2>
        {/* Developer Note: Personalization of these recommendations would ideally come from a dynamic backend based on user profile and activity.
            The current implementation shows a static or very simply filtered list from mock data.
        */}
        <ScrollArea className="w-full whitespace-nowrap pb-3">
          <div className="flex space-x-4">
            {personalizedRecommendations.map((item) => (
              <Link href={item.href} key={item.id} className="block min-w-[150px] max-w-[150px]">
                <Card className="overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow h-full flex flex-col">
                  <div className="aspect-[3/4] relative w-full">
                    <MemoizedImage
                      src={item.imageUrl || 'https://placehold.co/150x200.png'}
                      alt={currentLang === 'en' ? item.titleEn : item.titleHi}
                      layout="fill"
                      objectFit="cover"
                      data-ai-hint={item.dataAiHint || 'recommendation image'}
                    />
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
             {personalizedRecommendations.length === 0 && (
                <p className="text-sm text-muted-foreground p-4 text-center w-full">
                    <BilingualText en="No specific recommendations for you right now. Explore our categories!" hi="अभी आपके लिए कोई विशेष सिफारिशें नहीं हैं। हमारी श्रेणियां देखें!" lang={currentLang} />
                </p>
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-foreground mb-3"><BilingualText en="Study & Festival Kits" hi="अध्ययन और त्योहार किट" lang={currentLang}/></h2>
         <ScrollArea className="w-full whitespace-nowrap pb-3">
            <div className="flex space-x-3">
                {studyFestivalKits.map((kit) => (
                <Link href={kit.href} key={kit.id} className="block min-w-[200px] max-w-[240px] hover:opacity-90 transition-opacity">
                    <Card className="p-4 rounded-lg shadow-md flex items-center gap-3 h-full" data-ai-hint={kit.dataAiHint}>
                        <kit.icon className={cn("h-8 w-8 shrink-0", kit.iconColor)} />
                        <div>
                        <h3 className="text-sm font-bold text-foreground"><BilingualText en={kit.titleEn} hi={kit.titleHi} lang={currentLang}/></h3>
                        <p className="text-xs text-muted-foreground"><BilingualText en={kit.descriptionEn} hi={kit.descriptionHi} lang={currentLang}/></p>
                        </div>
                    </Card>
                </Link>
                ))}
            </div>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </section>
      
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
                  <Card className="p-4 rounded-lg shadow-md flex items-center gap-3 h-full" data-ai-hint={booster.dataAiHint}>
                    <booster.icon className={cn("h-8 w-8 shrink-0", booster.iconColor)} />
                    <div>
                      <h3 className="text-sm font-bold text-foreground"><BilingualText en={booster.titleEn} hi={booster.titleHi} lang={currentLang}/></h3>
                      <p className="text-xs text-muted-foreground"><BilingualText en={booster.descriptionEn} hi={booster.descriptionHi} lang={currentLang}/></p>
                    </div>
                  </Card>
                </CardWrapper>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </section>

      <Dialog open={isLocationModalOpen} onOpenChange={setIsLocationModalOpen}>
        <DialogContent className="sm:max-w-[425px] z-[150]">
          <DialogHeader>
            <DialogTitle><BilingualText en="Select Your Location" hi="अपना स्थान चुनें" lang={currentLang} /></DialogTitle>
            <DialogDescription>
              <BilingualText en="Choose your school or area for personalized content and faster delivery." hi="व्यक्तिगत सामग्री और तेजी से वितरण के लिए अपना स्कूल या क्षेत्र चुनें।" lang={currentLang} />
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Button variant="outline" onClick={handleUseCurrentLocation} className="w-full justify-start gap-2 hover:bg-accent/10 border-border">
              <LocateFixed className="h-4 w-4 text-accent" /> <BilingualText en="Use My Current Location" hi="मेरे वर्तमान स्थान का उपयोग करें" lang={currentLang}/>
            </Button>
            <div className="relative">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder={currentLang === 'en' ? "Search school or area..." : "स्कूल या क्षेत्र खोजें..."}
                value={locationSearchTerm}
                onChange={(e) => setLocationSearchTerm(e.target.value)}
                className="pl-8 bg-input placeholder:text-muted-foreground"
              />
            </div>
            <RadioGroup value={selectedTempLocation} onValueChange={setSelectedTempLocation}>
              <ScrollArea className="h-[200px] w-full rounded-md border border-border p-2 bg-background/50">
                {filteredLocations.length > 0 ? filteredLocations.map((loc) => (
                  <div key={loc.id} className="flex items-center space-x-2 p-2 hover:bg-accent/10 rounded-md">
                    <RadioGroupItem value={loc.name} id={loc.id} className="border-primary data-[state=checked]:border-primary data-[state=checked]:text-primary" />
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
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </RadioGroup>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <DialogClose asChild><Button type="button" variant="outline" className="border-border hover:bg-muted/20"><BilingualText en="Cancel" hi="रद्द करें" lang={currentLang}/></Button></DialogClose>
            <Button type="button" onClick={handleLocationConfirm} className="bg-primary text-primary-foreground hover:bg-primary/90"><BilingualText en="Confirm Location" hi="स्थान की पुष्टि करें" lang={currentLang}/></Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
