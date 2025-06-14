
"use client";

import React, { useState, useEffect, useRef, type FormEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; 
import {
  MapPin, Search as SearchIcon, BookOpen as BookIcon, Brain, ShoppingBag, Bot,
  FlaskConical, Package as PackageIcon, Smile, Target, ChevronRight, ChevronLeft, Hand, Star, Users, Briefcase, Bike, FileText, Award, CalendarDays, ClipboardList, Home as HomeIconLucide, Truck, Settings, User as UserIcon, Sparkles, MessageCircleHeart, Youtube, Library, Cookie, PackageSearch, LocateFixed, Mic, Lightbulb, Music2, GraduationCap, Video,
  RadioTower,
  Timer,    
  PlaySquare 
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
import { ClassCard, type LiveClass } from '@/components/live-class/ClassCard';


// Mock data
const user = {
  name: 'Abhishek',
  avatarUrl: 'https://placehold.co/40x40.png',
  dataAiHint: 'student avatar male'
};

const heroSlides = [
  { id: 1, titleEn: "1-Click Project Help", titleHi: "1-क्लिक प्रोजेक्ट सहायता", descriptionEn: "AI assistance & material kits", descriptionHi: "एआई सहायता और सामग्री किट", imageUrl: "https://placehold.co/800x300.png", dataAiHint: "project help technology", href:"/services/projects" },
  { id: 2, titleEn: "Study Material in 30 Mins!", titleHi: "30 मिनट में अध्ययन सामग्री!", descriptionEn: "Notes, books & stationery, delivered fast", descriptionHi: "नोट्स, किताबें और स्टेशनरी, तेजी से डिलीवर", imageUrl: "https://placehold.co/800x300.png", dataAiHint: "fast delivery books", href:"/delivery" },
  { id: 3, titleEn: "OSO Guruji is Online", titleHi: "OSO गुरुजी ऑनलाइन हैं", descriptionEn: "Your 24/7 study partner", descriptionHi: "आपका 24/7 अध्ययन भागीदार", imageUrl: "https://placehold.co/800x300.png", dataAiHint: "ai robot teaching", href:"/ai-guruji" },
];

const quickCategories = [
  { id: 'books', labelEn: 'Books', labelHi: 'किताबें', icon: BookIcon, href: '/class-6-12-books', color: 'text-accent', bgColor: 'bg-accent/10 hover:bg-accent/20' },
  { id: 'projects', labelEn: 'Projects', labelHi: 'प्रोजेक्ट', icon: FlaskConical, href: '/services/projects', color: 'text-accent', bgColor: 'bg-accent/10 hover:bg-accent/20' },
  { id: 'stationery', labelEn: 'Stationery', labelHi: 'स्टेशनरी', icon: PackageIcon, href: '/delivery', color: 'text-accent', bgColor: 'bg-accent/10 hover:bg-accent/20' },
  { id: 'guruji', labelEn: 'Guruji', labelHi: 'गुरुजी', icon: Bot, href: '/ai-guruji', color: 'text-primary', bgColor: 'bg-primary/10 hover:bg-primary/20' }, // Primary for AI
  { id: 'mind_diary', labelEn: 'Mind Diary', labelHi: 'माइंड डायरी', icon: Smile, href: '/mind-diary', color: 'text-accent', bgColor: 'bg-accent/10 hover:bg-accent/20' },
  { id: 'test_series', labelEn: 'Test Series', labelHi: 'टेस्ट सीरीज़', icon: Target, href: '/test-series', color: 'text-accent', bgColor: 'bg-accent/10 hover:bg-accent/20' },
  { id: 'brain_scan', labelEn: 'Brain Scan', labelHi: 'ब्रेन स्कैन', icon: Brain, href: '/brain-scan-report', color: 'text-primary', bgColor: 'bg-primary/10 hover:bg-primary/20' }, // Primary for AI feature
  { id: 'oso_circle', labelEn: 'OSO Circle', labelHi: 'OSO सर्कल', icon: Users, href: '/circle', color: 'text-accent', bgColor: 'bg-accent/10 hover:bg-accent/20' },
  { id: 'college_predictor', labelEn: 'College Predictor', labelHi: 'कॉलेज भविष्यवक्ता', icon: GraduationCap, href: '/college-predictor', color: 'text-primary', bgColor: 'bg-primary/10 hover:bg-primary/20' }, // Primary for AI feature
  { id: 'competitive_bookstore', labelEn: 'Exam Books', labelHi: 'परीक्षा पुस्तकें', icon: Award, href: '/competitive-bookstore', color: 'text-accent', bgColor: 'bg-accent/10 hover:bg-accent/20' },
  { id: 'study_dashboard', labelEn: 'Study Space', labelHi: 'अध्ययन स्थान', icon: ClipboardList, href: '/study-dashboard', color: 'text-accent', bgColor: 'bg-accent/10 hover:bg-accent/20' },
  { id: 'schedule_class', labelEn: 'Schedule Class', labelHi: 'कक्षा शेड्यूल करें', icon: Video, href: '/schedule-class', color: 'text-accent', bgColor: 'bg-accent/10 hover:bg-accent/20' },
];

const recommendations = [
  { id: 'rec1', typeEn: 'Book', typeHi: 'किताब', titleEn: 'Class 10 - Lakhmir Singh Science', titleHi: 'कक्षा 10 - लखमीर सिंह विज्ञान', imageUrl: 'https://placehold.co/150x200.png', dataAiHint: "science textbook", href: '/class-6-12-books', priceEn: 'INR 450', priceHi: 'INR 450' },
  { id: 'rec2', typeEn: 'Project', typeHi: 'प्रोजेक्ट', titleEn: 'Volcano Model Kit', titleHi: 'ज्वालामुखी मॉडल किट', descriptionEn: 'Get All Materials', descriptionHi: 'सभी सामग्री प्राप्त करें', imageUrl: 'https://placehold.co/150x200.png', dataAiHint: "volcano model kit", href: '/services/projects', priceEn: 'INR 299', priceHi: 'INR 299' },
  { id: 'rec3', typeEn: 'Guruji Advice', typeHi: 'गुरुजी सलाह', titleEn: 'Ask Guruji: NEET Doubts', titleHi: 'गुरुजी से पूछें: NEET शंकाएँ', descriptionEn: 'Clear your concepts', descriptionHi: 'अपनी अवधारणाएँ स्पष्ट करें', imageUrl: 'https://placehold.co/150x200.png', dataAiHint: "ai chat exam", href: '/ai-guruji', priceEn: 'Free', priceHi: 'निःशुल्क' },
  { id: 'rec4', typeEn: 'Test', typeHi: 'टेस्ट', titleEn: 'JEE Main Mock Test', titleHi: 'JEE मुख्य मॉक टेस्ट', descriptionEn: 'Full Syllabus', descriptionHi: 'पूर्ण पाठ्यक्रम', imageUrl: 'https://placehold.co/150x200.png', dataAiHint: "online test interface", href: '/test-series', priceEn: 'INR 99', priceHi: 'INR 99' },
];

const deliveryDeals = [
  { id: 'deal1', titleEn: "Charts in 20 mins!", titleHi: "20 मिनट में चार्ट!", descriptionEn: "All sizes & types", descriptionHi: "सभी आकार और प्रकार", icon: FileText, bgColor: "bg-accent/80", textColor: "text-accent-foreground", dataAiHint:"charts diagram" },
  { id: 'deal2', titleEn: "INR 10 Off School Kits", titleHi: "स्कूल किट पर INR 10 की छूट", descriptionEn: "Notebooks, Pens & More", descriptionHi: "नोटबुक, पेन और भी बहुत कुछ", icon: PackageSearch, bgColor: "bg-primary/80", textColor: "text-primary-foreground", dataAiHint:"school supplies kit" },
  { id: 'deal3', titleEn: "Project Emergency?", titleHi: "प्रोजेक्ट इमरजेंसी?", descriptionEn: "Materials in a Jiffy!", descriptionHi: "सामान झटपट!", icon: Brain, bgColor: "bg-destructive/80", textColor: "text-destructive-foreground", dataAiHint:"project materials box" },
];

const studyBoosters = [
  { id: 'sb1', titleEn: "Guruji Doubt Solver", titleHi: "गुरुजी शंका समाधान", descriptionEn: "Clear concepts 24/7", descriptionHi: "अवधारणाएँ 24/7 स्पष्ट करें", icon: Lightbulb, bgColor: "bg-primary/80", textColor: "text-primary-foreground", dataAiHint:"ai learning lightbulb", href: "/ai-guruji" },
  { id: 'sb2', titleEn: "Quick Revision Notes", titleHi: "त्वरित रिवीजन नोट्स", descriptionEn: "Key topics summarized", descriptionHi: "मुख्य विषय सारांशित", icon: ClipboardList, bgColor: "bg-success/80", textColor: "text-success-foreground", dataAiHint:"notes study checklist", href: "/study/my-notes" },
  { id: 'sb3', titleEn: "Focus Zone Music", titleHi: "फोकस ज़ोन संगीत", descriptionEn: "Beats for deep study", descriptionHi: "गहन अध्ययन के लिए बीट्स", icon: Music2, bgColor: "bg-secondary/80", textColor: "text-secondary-foreground", dataAiHint:"headphones music study", href: "/study/focus-music" },
];

const searchIcons = [
    {labelEn: "Books", labelHi: "किताबें", icon: BookIcon, href:"/class-6-12-books"},
    {labelEn: "Projects", labelHi: "प्रोजेक्ट", icon: Brain, href:"/services/projects"},
    {labelEn: "Stationery", labelHi: "स्टेशनरी", icon: PackageIcon, href:"/delivery"},
    {labelEn: "Guruji", labelHi: "गुरुजी", icon: Bot, href:"/ai-guruji"},
];

const mockLocations = [
    // Personalized
    { id: "myhome_noida", name: "My Home - Sector 15, Noida", type: "Home" },
    { id: "current_loc", name: "My Current Location", type: "Current" },

    // Delhi Schools & Areas
    { id: "del_modern", name: "Modern School, Barakhamba Road, Delhi", type: "School" },
    { id: "del_dps_rkp", name: "DPS, R.K. Puram, New Delhi", type: "School" },
    { id: "del_sardar_patel", name: "Sardar Patel Vidyalaya, New Delhi", type: "School" },
    { id: "del_vasant_valley", name: "Vasant Valley School, New Delhi", type: "School" },
    { id: "del_shriram_school", name: "The Shri Ram School, Vasant Vihar, New Delhi", type: "School" },
    { id: "del_st_columbas", name: "St. Columba's School, Delhi", type: "School" },
    { id: "del_springdales_pusa", name: "Springdales School, Pusa Road, New Delhi", type: "School" },
    { id: "del_mother_intl", name: "The Mother's International School, New Delhi", type: "School" },
    { id: "del_cp", name: "Connaught Place, New Delhi", type: "Area" },
    { id: "del_karol_bagh", name: "Karol Bagh, Delhi", type: "Area" },
    { id: "del_south_ex", name: "South Extension, New Delhi", type: "Area" },
    { id: "del_saket", name: "Saket, New Delhi", type: "Area" },
    { id: "del_dwarka", name: "Dwarka, New Delhi", type: "Area" },
    { id: "del_rohini", name: "Rohini, Delhi", type: "Area" },
    { id: "del_pitampura", name: "Pitampura, Delhi", type: "Area" },
    { id: "del_janakpuri", name: "Janakpuri, New Delhi", type: "Area" },
    { id: "del_greater_kailash", name: "Greater Kailash, New Delhi", type: "Area" },
    { id: "del_chandni_chowk", name: "Chandni Chowk, Delhi", type: "Area" },
    { id: "ncr_gurgaon_dlf", name: "DLF Cyber City, Gurgaon", type: "Area" },
    { id: "ncr_gurgaon_shriram_aravali", name: "The Shri Ram School, Aravali, Gurgaon", type: "School" },
    { id: "ncr_gurgaon_pathways", name: "Pathways World School, Aravali, Gurgaon", type: "School" },
    { id: "ncr_noida_sec18", name: "Sector 18, Noida", type: "Area" },
    { id: "ncr_noida_genesis_global", name: "Genesis Global School, Noida", type: "School" },
    { id: "ncr_noida_step_by_step", name: "Step by Step School, Noida", type: "School" },
    { id: "ncr_ghaziabad_dps", name: "DPS Ghaziabad, Vasundhara", type: "School" },
    { id: "ncr_faridabad_apeejay", name: "Apeejay School, Faridabad", type: "School" },


    // Mumbai Schools & Areas
    { id: "mum_dais", name: "Dhirubhai Ambani International School, Mumbai", type: "School" },
    { id: "mum_cathedral", name: "Cathedral and John Connon School, Mumbai", type: "School" },
    { id: "mum_scottish", name: "Bombay Scottish School, Mahim, Mumbai", type: "School" },
    { id: "mum_jb_petit", name: "J.B. Petit High School for Girls, Mumbai", type: "School" },
    { id: "mum_cnms", name: "CNM School, Vile Parle, Mumbai", type: "School" },
    { id: "mum_ecole_mondiale", name: "École Mondiale World School, Mumbai", type: "School" },
    { id: "mum_jamnabai_narsee", name: "Jamnabai Narsee School, Mumbai", type: "School" },
    { id: "mum_bandra", name: "Bandra West, Mumbai", type: "Area" },
    { id: "mum_andheri", name: "Andheri East, Mumbai", type: "Area" },
    { id: "mum_juhu", name: "Juhu, Mumbai", type: "Area" },
    { id: "mum_worli", name: "Worli, Mumbai", type: "Area" },
    { id: "mum_thane", name: "Thane West, Thane", type: "Area" },
    { id: "mum_navi_vashi", name: "Vashi, Navi Mumbai", type: "Area" },
    { id: "mum_colaba", name: "Colaba, Mumbai", type: "Area" },
    { id: "mum_powai", name: "Powai, Mumbai", type: "Area" },
    { id: "mum_dadar", name: "Dadar, Mumbai", type: "Area" },

    // Bangalore Schools & Areas
    { id: "blr_valley", name: "The Valley School, Bengaluru", type: "School" },
    { id: "blr_bishops", name: "Bishop Cotton Boys' School, Bengaluru", type: "School" },
    { id: "blr_nps_ind", name: "National Public School, Indiranagar, Bengaluru", type: "School" },
    { id: "blr_maiya_intl", name: "Mallya Aditi International School, Bengaluru", type: "School" },
    { id: "blr_inventure", name: "Inventure Academy, Bengaluru", type: "School" },
    { id: "blr_greenwood_high", name: "Greenwood High International School, Bengaluru", type: "School" },
    { id: "blr_indus_intl", name: "Indus International School, Bengaluru", type: "School" },
    { id: "blr_indiranagar", name: "Indiranagar, Bengaluru", type: "Area" },
    { id: "blr_koramangala", name: "Koramangala, Bengaluru", type: "Area" },
    { id: "blr_jpnagar", name: "J.P. Nagar, Bengaluru", type: "Area" },
    { id: "blr_whitefield", name: "Whitefield, Bengaluru", type: "Area" },
    { id: "blr_electronic_city", name: "Electronic City, Bengaluru", type: "Area" },
    { id: "blr_mg_road", name: "MG Road, Bengaluru", type: "Area" },
    { id: "blr_jayanagar", name: "Jayanagar, Bengaluru", type: "Area" },
    { id: "blr_malleshwaram", name: "Malleshwaram, Bengaluru", type: "Area" },

    // Chennai Schools & Areas
    { id: "chn_psbb_nung", name: "Padma Seshadri Bala Bhavan (PSBB), Nungambakkam, Chennai", type: "School" },
    { id: "chn_sishya", name: "Sishya School, Adyar, Chennai", type: "School" },
    { id: "chn_chems_gg", name: "Chettinad Vidyashram, R.A. Puram, Chennai", type: "School" },
    { id: "chn_dav_mogappair", name: "D.A.V. Boys Senior Secondary School, Mogappair, Chennai", type: "School" },
    { id: "chn_good_shepherd", name: "Good Shepherd Matriculation Higher Secondary School, Chennai", type: "School" },
    { id: "chn_american_intl", name: "American International School, Chennai", type: "School" },
    { id: "chn_adyar", name: "Adyar, Chennai", type: "Area" },
    { id: "chn_anna_nagar", name: "Anna Nagar, Chennai", type: "Area" },
    { id: "chn_tnagar", name: "T. Nagar, Chennai", type: "Area" },
    { id: "chn_mylapore", name: "Mylapore, Chennai", type: "Area" },
    { id: "chn_velachery", name: "Velachery, Chennai", type: "Area" },
    { id: "chn_nungambakkam", name: "Nungambakkam, Chennai", type: "Area" },

    // Kolkata Schools & Areas
    { id: "kol_lm_boys", name: "La Martiniere For Boys, Kolkata", type: "School" },
    { id: "kol_lm_girls", name: "La Martiniere For Girls, Kolkata", type: "School" },
    { id: "kol_south_point", name: "South Point High School, Kolkata", type: "School" },
    { id: "kol_modern_high_girls", name: "Modern High School for Girls, Kolkata", type: "School" },
    { id: "kol_don_bosco", name: "Don Bosco School, Park Circus, Kolkata", type: "School" },
    { id: "kol_st_xaviers", name: "St. Xavier's Collegiate School, Kolkata", type: "School" },
    { id: "kol_park_street", name: "Park Street Area, Kolkata", type: "Area" },
    { id: "kol_salt_lake", name: "Salt Lake City (Bidhannagar), Kolkata", type: "Area" },
    { id: "kol_gariahat", name: "Gariahat, Kolkata", type: "Area" },
    { id: "kol_howrah", name: "Howrah AC Market, Howrah", type: "Area" },
    { id: "kol_new_town", name: "New Town, Kolkata", type: "Area" },
    { id: "kol_alipore", name: "Alipore, Kolkata", type: "Area" },

    // Hyderabad Schools & Areas
    { id: "hyd_hps_begumpet", name: "Hyderabad Public School, Begumpet, Hyderabad", type: "School" },
    { id: "hyd_chirec", name: "CHIREC International School, Hyderabad", type: "School" },
    { id: "hyd_oakridge_gach", name: "Oakridge International School, Gachibowli, Hyderabad", type: "School" },
    { id: "hyd_nasr_school", name: "Nasr School, Khairatabad, Hyderabad", type: "School" },
    { id: "hyd_geetanjali_devshala", name: "Geetanjali Devshala, Secunderabad", type: "School" },
    { id: "hyd_jubilee_hills", name: "Jubilee Hills, Hyderabad", type: "Area" },
    { id: "hyd_banjara_hills", name: "Banjara Hills, Hyderabad", type: "Area" },
    { id: "hyd_gachibowli", name: "Gachibowli, Hyderabad", type: "Area" },
    { id: "hyd_secunderabad", name: "Secunderabad Clock Tower Area", type: "Area" },
    { id: "hyd_hitech_city", name: "HITEC City, Hyderabad", type: "Area" },
    { id: "hyd_kondapur", name: "Kondapur, Hyderabad", type: "Area" },
    
    // Pune Schools & Areas
    { id: "pun_bishops_camp", name: "The Bishop's School, Camp, Pune", type: "School" },
    { id: "pun_st_marys", name: "St. Mary's School, Pune", type: "School" },
    { id: "pun_symbiosis_intl", name: "Symbiosis International School, Pune", type: "School" },
    { id: "pun_mercedes_benz_intl", name: "Mercedes-Benz International School, Pune", type: "School" },
    { id: "pun_vibgyor_high", name: "VIBGYOR High, Balewadi, Pune", type: "School" },
    { id: "pun_koregaon_park", name: "Koregaon Park, Pune", type: "Area" },
    { id: "pun_deccan", name: "Deccan Gymkhana, Pune", type: "Area" },
    { id: "pun_hinjewadi", name: "Hinjewadi IT Park, Pune", type: "Area" },
    { id: "pun_viman_nagar", name: "Viman Nagar, Pune", type: "Area" },
    { id: "pun_aundh", name: "Aundh, Pune", type: "Area" },

    // Ahmedabad Schools & Areas
    { id: "amd_st_xaviers_loyola", name: "St. Xavier's High School, Loyola Hall, Ahmedabad", type: "School" },
    { id: "amd_anand_niketan_shilaj", name: "Anand Niketan, Shilaj Campus, Ahmedabad", type: "School" },
    { id: "amd_udgam_school", name: "Udgam School For Children, Ahmedabad", type: "School" },
    { id: "amd_cg_road", name: "C.G. Road, Ahmedabad", type: "Area" },
    { id: "amd_vastrapur", name: "Vastrapur, Ahmedabad", type: "Area" },
    { id: "amd_satellite", name: "Satellite, Ahmedabad", type: "Area" },

    // Jaipur Schools & Areas
    { id: "jpr_mayo_college_ajmer", name: "Mayo College, Ajmer (near Jaipur)", type: "School" },
    { id: "jpr_mayo_college_girls_ajmer", name: "Mayo College Girls' School, Ajmer (near Jaipur)", type: "School" },
    { id: "jpr_jphs", name: "Jayshree Periwal High School, Jaipur", type: "School" },
    { id: "jpr_sms_vidyalaya", name: "Sawai Man Singh Vidyalaya, Jaipur", type: "School" },
    { id: "jpr_c_scheme", name: "C-Scheme, Jaipur", type: "Area" },
    { id: "jpr_vaishali_nagar", name: "Vaishali Nagar, Jaipur", type: "Area" },
    { id: "jpr_malviya_nagar", name: "Malviya Nagar, Jaipur", type: "Area" },

    // Lucknow Schools & Areas
    { id: "lko_lm_college", name: "La Martiniere College, Lucknow", type: "School" },
    { id: "lko_cms_gomti", name: "City Montessori School (CMS), Gomti Nagar, Lucknow", type: "School" },
    { id: "lko_seth_mr_jaipuria", name: "Seth M.R. Jaipuria School, Lucknow", type: "School" },
    { id: "lko_hazratganj", name: "Hazratganj, Lucknow", type: "Area" },
    { id: "lko_gomti_nagar", name: "Gomti Nagar, Lucknow", type: "Area" },
    { id: "lko_aliganj", name: "Aliganj, Lucknow", type: "Area" },

    // Chandigarh Schools & Areas
    { id: "chd_vivek_high", name: "Vivek High School, Chandigarh", type: "School" },
    { id: "chd_st_johns", name: "St. John's High School, Chandigarh", type: "School" },
    { id: "chd_carmel_convent", name: "Carmel Convent School, Chandigarh", type: "School" },
    { id: "chd_sector_17", name: "Sector 17 Market, Chandigarh", type: "Area" },
    { id: "chd_sector_35", name: "Sector 35, Chandigarh", type: "Area" },

    // Dehradun Schools
    { id: "ddn_doon_school", name: "The Doon School, Dehradun", type: "School"},
    { id: "ddn_welham_boys", name: "Welham Boys' School, Dehradun", type: "School"},
    { id: "ddn_welham_girls", name: "Welham Girls' School, Dehradun", type: "School"},
    { id: "ddn_asian_school", name: "The Asian School, Dehradun", type: "School"},

    // Other Major City Areas
    { id: "sur_athwa", name: "Athwalines, Surat", type: "Area" },
    { id: "pat_boring_road", name: "Boring Road, Patna", type: "Area" },
    { id: "ind_vijay_nagar", name: "Vijay Nagar, Indore", type: "Area" },
    { id: "bho_mp_nagar", name: "MP Nagar, Bhopal", type: "Area" },
    { id: "ludh_sarabha_nagar", name: "Sarabha Nagar, Ludhiana", type: "Area" },
    { id: "kochi_mg_road", name: "MG Road, Kochi", type: "Area" },
    { id: "vskp_rk_beach", name: "RK Beach Area, Visakhapatnam", type: "Area" },
];


const mockLiveClasses: LiveClass[] = [
  { id: 'live1', titleEn: 'Live: Solving Complex Equations', titleHi: 'लाइव: जटिल समीकरणों का समाधान', subjectEn: 'Maths', subjectHi: 'गणित', creatorNameEn: 'Prof. Algebra', creatorNameHi: 'प्रो. बीजगणित', thumbnailUrl: 'https://placehold.co/300x168.png', dataAiHintThumbnail: 'maths equation live', status: 'live', dateTime: new Date().toISOString(), viewers: 102, classLevel: 'JEE', creatorAvatarUrl: 'https://placehold.co/40x40.png', dataAiHintAvatar: 'math teacher avatar' },
  { id: 'upcoming1', titleEn: 'Organic Chemistry Basics', titleHi: 'कार्बनिक रसायन विज्ञान की मूल बातें', subjectEn: 'Chemistry', subjectHi: 'रसायन विज्ञान', creatorNameEn: 'Dr. Chem', creatorNameHi: 'डॉ. केम', thumbnailUrl: 'https://placehold.co/300x168.png', dataAiHintThumbnail: 'chemistry lecture', status: 'upcoming', countdown: 'Tomorrow 6 PM', dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), classLevel: 'NEET', creatorAvatarUrl: 'https://placehold.co/40x40.png', dataAiHintAvatar: 'chemistry teacher' },
  { id: 'upcoming2', titleEn: 'Physics: Laws of Motion', titleHi: 'भौतिकी: गति के नियम', subjectEn: 'Physics', subjectHi: 'भौतिकी', creatorNameEn: 'Newton Jr.', creatorNameHi: 'न्यूटन जूनियर', thumbnailUrl: 'https://placehold.co/300x168.png', dataAiHintThumbnail: 'physics gravity apple', status: 'upcoming', countdown: 'In 2 hours', dateTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), classLevel: 'Class 11', creatorAvatarUrl: 'https://placehold.co/40x40.png', dataAiHintAvatar: 'physics professor' },
  { id: 'recorded1', titleEn: 'Intro to Python Programming', titleHi: 'पायथन प्रोग्रामिंग का परिचय', subjectEn: 'Computer Science', subjectHi: 'कंप्यूटर विज्ञान', creatorNameEn: 'Code Master', creatorNameHi: 'कोड मास्टर', thumbnailUrl: 'https://placehold.co/300x168.png', dataAiHintThumbnail: 'python code screen', status: 'recorded', duration: '55min', dateTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), classLevel: 'All Ages', creatorAvatarUrl: 'https://placehold.co/40x40.png', dataAiHintAvatar: 'coder avatar' },
];

type LangState = 'en' | 'hi' | 'hng';

export default function ModernHomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [currentLang, setCurrentLang] = useState<LangState>('en');
  const [location, setLocation] = useState("Modern School, Barakhamba Road, Delhi"); // Default
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [locationSearchTerm, setLocationSearchTerm] = useState("");
  const [selectedTempLocation, setSelectedTempLocation] = useState(location);
  const { toast } = useToast();
  const router = useRouter(); 
  const [searchQuery, setSearchQuery] = useState(''); 

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
      return 'en'; // 'hng' goes back to 'en'
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
    const detectedLocation = "My Current Area (Detected)"; // This would use geolocation API in real app
    setSelectedTempLocation(detectedLocation);
    toast({
      title: "Using Current Location (Simulated)",
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

  const liveNowClasses = mockLiveClasses.filter(c => c.status === 'live');
  const upcomingClasses = mockLiveClasses.filter(c => c.status === 'upcoming').sort((a,b) => new Date(a.dateTime!).getTime() - new Date(b.dateTime!).getTime());
  const recordedClasses = mockLiveClasses.filter(c => c.status === 'recorded').sort((a,b) => new Date(b.dateTime!).getTime() - new Date(a.dateTime!).getTime());


  return (
    <div className="space-y-6 pb-10 min-h-screen -m-4 p-4 bg-background">
      <header className="space-y-3 sticky top-0 bg-background/90 backdrop-blur-md z-40 py-3 -mx-4 px-4 shadow-sm border-b border-border">
        <div className="flex items-center justify-between">
         <Button variant="ghost" onClick={() => setIsLocationModalOpen(true)} className="flex items-center gap-1.5 text-sm text-muted-foreground p-1 h-auto hover:bg-card">
            <MapPin className="h-5 w-5 text-accent" />
            <span className="font-medium truncate max-w-[180px] sm:max-w-[220px] text-left text-foreground">{location}</span>
            <ChevronRight className="h-4 w-4 opacity-70 shrink-0" />
          </Button>
          <div className="flex items-center gap-2">
            <Button onClick={toggleLanguage} variant="outline" size="sm" className="text-xs h-7 px-2 border-border hover:bg-card text-muted-foreground">
              {getLanguageButtonText()}
            </Button>
            <Link href="/profile">
              <Avatar className="h-8 w-8 border-2 border-accent">
                <AvatarImage src={user.avatarUrl || 'https://placehold.co/40x40.png'} alt={user.name} data-ai-hint={user.dataAiHint || 'avatar'} />
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
        <div className="flex items-center gap-2">
          <div className="relative flex-grow">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
            <Input
              type="search"
              placeholder={currentLang === 'en' ? "Search for books, projects, stationery..." : currentLang === 'hi' ? "किताबें, प्रोजेक्ट, स्टेशनरी खोजें..." : "Search books, projects, stationery..."}
              className="pl-10 h-12 text-base border-border focus:border-primary focus:ring-primary rounded-lg shadow-sm bg-input placeholder:text-muted-foreground"
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
                <Link href={item.href} key={item.labelEn} className="flex flex-col items-center gap-1 hover:text-accent transition-colors">
                    <item.icon className="h-5 w-5"/>
                    <span><BilingualText en={item.labelEn} hi={item.labelHi} lang={currentLang} separator=" "/></span>
                </Link>
            ))}
        </div>
      </header>

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
              src={slide.imageUrl || 'https://placehold.co/800x300.png'} 
              alt={currentLang === 'en' ? slide.titleEn : slide.titleHi} 
              layout="fill" 
              objectFit="cover" 
              className="absolute inset-0 z-0 opacity-80" 
              data-ai-hint={slide.dataAiHint || 'hero image'} 
              priority={index === 0}
            />
            <Link href={slide.href} className="relative z-10 flex flex-col items-center justify-center h-full w-full bg-gradient-to-t from-black/50 via-transparent to-black/10 p-4">
              <div>
                <h2 className="text-2xl font-bold mb-1 text-shadow shadow-black/70"><BilingualText en={slide.titleEn} hi={slide.titleHi} lang={currentLang} /></h2>
                <p className="text-sm text-shadow-sm shadow-black/70"><BilingualText en={slide.descriptionEn} hi={slide.descriptionHi} lang={currentLang} /></p>
                 <Button variant="default" size="sm" className="mt-3 bg-accent text-accent-foreground hover:bg-accent/90 shadow-md shadow-glow-accent-pink/30">
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
              className={cn("h-2 w-2 rounded-full transition-all", currentSlide === index ? "w-4 bg-accent" : "bg-foreground/50 hover:bg-foreground/75")}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>
      
      <section>
        <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold text-foreground"><BilingualText en="Live Classes" hi="लाइव कक्षाएं" lang={currentLang}/></h2>
            <Link href="/live-classes/all" className="text-sm text-accent hover:underline">
                <BilingualText en="View All" hi="सभी देखें" lang={currentLang}/> <ChevronRight className="inline h-4 w-4"/>
            </Link>
        </div>
        {liveNowClasses.length > 0 && (
            <div className="mb-4">
                <h3 className="text-md font-medium text-destructive mb-2 flex items-center"> {}
                    <RadioTower size={18} className="mr-1.5 animate-pulse"/> <BilingualText en="Live Now" hi="अभी लाइव" lang={currentLang}/>
                </h3>
                <ScrollArea className="w-full whitespace-nowrap pb-2.5">
                    <div className="flex space-x-4">
                        {liveNowClasses.map(lc => <ClassCard key={lc.id} classInfo={{...lc, lang: currentLang}} lang={currentLang} className="min-w-[280px] max-w-[280px] glass-card"/>)}
                    </div>
                    <ScrollBar orientation="horizontal"/>
                </ScrollArea>
            </div>
        )}
        {upcomingClasses.length > 0 && (
             <div className="mb-4">
                <h3 className="text-md font-medium text-foreground mb-2 flex items-center">
                    <Timer size={18} className="mr-1.5 text-accent"/> <BilingualText en="Upcoming Classes" hi="आगामी कक्षाएं" lang={currentLang}/>
                </h3>
                <ScrollArea className="w-full whitespace-nowrap pb-2.5">
                    <div className="flex space-x-4">
                        {upcomingClasses.map(lc => <ClassCard key={lc.id} classInfo={{...lc, lang: currentLang}} lang={currentLang} className="min-w-[280px] max-w-[280px] glass-card"/>)}
                    </div>
                    <ScrollBar orientation="horizontal"/>
                </ScrollArea>
            </div>
        )}
        {recordedClasses.length > 0 && (
            <div>
                <h3 className="text-md font-medium text-foreground mb-2 flex items-center">
                     <PlaySquare size={18} className="mr-1.5 text-accent"/> <BilingualText en="Recently Completed" hi="हाल ही में संपन्न" lang={currentLang}/>
                </h3>
                 <ScrollArea className="w-full whitespace-nowrap pb-2.5">
                    <div className="flex space-x-4">
                        {recordedClasses.map(lc => <ClassCard key={lc.id} classInfo={{...lc, lang: currentLang}} lang={currentLang} className="min-w-[280px] max-w-[280px] glass-card"/>)}
                    </div>
                    <ScrollBar orientation="horizontal"/>
                </ScrollArea>
            </div>
        )}
         {liveNowClasses.length === 0 && upcomingClasses.length === 0 && recordedClasses.length === 0 && (
             <p className="text-sm text-muted-foreground text-center py-4"><BilingualText en="No live classes scheduled currently. Check back soon!" hi="वर्तमान में कोई लाइव कक्षाएं निर्धारित नहीं हैं। जल्द ही वापस देखें!" lang={currentLang}/></p>
         )}
      </section>


      <section>
        <h2 className="text-xl font-semibold text-foreground mb-3"><BilingualText en="Quick Categories" hi="त्वरित श्रेणियाँ" lang={currentLang}/></h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {quickCategories.map((category) => (
            <Link href={category.href} key={category.id}>
              <Card className={cn("text-center p-3 rounded-xl shadow-sm hover:shadow-lg transition-all h-full flex flex-col justify-center items-center glass-card", category.bgColor)}>
                <category.icon className={cn("h-6 w-6 mx-auto mb-1", category.color)} />
                <p className={cn("text-xs font-medium", category.color)}><BilingualText en={category.labelEn} hi={category.labelHi} lang={currentLang} separator=" "/></p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-foreground mb-3"><BilingualText en="Today's Recommendations" hi="आज की सिफारिशें" lang={currentLang}/></h2>
        <ScrollArea className="w-full whitespace-nowrap pb-3">
          <div className="flex space-x-4">
            {recommendations.map((item) => (
              <Link href={item.href} key={item.id} className="block min-w-[150px] max-w-[150px]">
                <Card className="overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow h-full flex flex-col glass-card">
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
                        <p className="text-xs font-semibold text-accent truncate"><BilingualText en={item.typeEn} hi={item.typeHi} lang={currentLang}/></p>
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

      <section>
        <h2 className="text-xl font-semibold text-foreground mb-3"><BilingualText en="Delivery Deals" hi="डिलीवरी डील्स" lang={currentLang}/></h2>
         <ScrollArea className="w-full whitespace-nowrap pb-3">
            <div className="flex space-x-3">
                {deliveryDeals.map((deal) => (
                <Card key={deal.id} className={cn("min-w-[200px] p-4 rounded-lg shadow-md flex items-center gap-3 glass-card", deal.bgColor, deal.textColor)}>
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
                  <Card className={cn("p-4 rounded-lg shadow-md flex items-center gap-3 h-full glass-card", booster.bgColor, booster.textColor)}>
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

      <Dialog open={isLocationModalOpen} onOpenChange={setIsLocationModalOpen}>
        <DialogContent className="sm:max-w-[425px] glass-card border-border">
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
                    <RadioGroupItem value={loc.name} id={loc.id} className="border-accent data-[state=checked]:border-accent data-[state=checked]:text-accent" />
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
              <Button type="button" variant="outline" className="border-border hover:bg-muted/20"><BilingualText en="Cancel" hi="रद्द करें" lang={currentLang}/></Button>
            </DialogClose>
            <Button type="button" onClick={handleLocationConfirm} className="bg-accent text-accent-foreground hover:bg-accent/90"><BilingualText en="Confirm Location" hi="स्थान की पुष्टि करें" lang={currentLang}/></Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}

