
"use client";

import Link from 'next/link';
import Image from 'next/image';
import type { LucideIcon } from 'lucide-react';
import { BrainCircuit, BookCopy, Target, Mic, Library, ArrowRight, ChevronLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BilingualText } from "@/components/shared/BilingualText";
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';

interface Course {
  id: string;
  titleEn: string;
  titleHi: string;
  descriptionEn: string;
  descriptionHi: string;
  icon: LucideIcon;
  tags: string[];
  imageUrl?: string;
  dataAiHint?: string;
  href: string;
}

const mockCourses: Course[] = [
  { 
    id: "ai_coding", 
    titleEn: "AI & Coding Fundamentals", 
    titleHi: "एआई और कोडिंग मूल बातें", 
    descriptionEn: "Unlock the world of Artificial Intelligence and programming. Suitable for beginners and school students.", 
    descriptionHi: "कृत्रिम बुद्धिमत्ता और प्रोग्रामिंग की दुनिया को अनलॉक करें। शुरुआती और स्कूली छात्रों के लिए उपयुक्त।", 
    icon: BrainCircuit, 
    tags: ["AI", "Python", "Coding", "Beginner", "Robotics Basics"], 
    imageUrl: "https://placehold.co/300x200.png", 
    dataAiHint: "ai robot code", 
    href: "/study/courses/ai-coding" 
  },
  { 
    id: "ncert_mastery", 
    titleEn: "NCERT Syllabus Mastery", 
    titleHi: "एनसीईआरटी पाठ्यक्रम महारत", 
    descriptionEn: "Comprehensive coverage of NCERT syllabus for classes 6-12, including key concepts and question banks.", 
    descriptionHi: "कक्षा 6-12 के लिए एनसीईआरटी पाठ्यक्रम का व्यापक कवरेज, जिसमें प्रमुख अवधारणाएं और प्रश्न बैंक शामिल हैं।", 
    icon: BookCopy, 
    tags: ["NCERT", "School Syllabus", "All Subjects", "Revision"], 
    imageUrl: "https://placehold.co/300x200.png", 
    dataAiHint: "textbooks ncert study", 
    href: "/study/courses/ncert-mastery" 
  },
  { 
    id: "exam_prep_found", 
    titleEn: "Competitive Exam Foundation", 
    titleHi: "प्रतियोगी परीक्षा फाउंडेशन", 
    descriptionEn: "Build a strong base for JEE, NEET, CUET, and other competitive exams with expert-led sessions.", 
    descriptionHi: "विशेषज्ञ के नेतृत्व वाले सत्रों के साथ जेईई, नीट, सीयूईटी और अन्य प्रतियोगी परीक्षाओं के लिए एक मजबूत आधार बनाएं।", 
    icon: Target, 
    tags: ["JEE", "NEET", "Foundation", "CUET", "Competitive"], 
    imageUrl: "https://placehold.co/300x200.png", 
    dataAiHint: "exam preparation target", 
    href: "/study/courses/exam-foundation" 
  },
  { 
    id: "voice_notes_pro", 
    titleEn: "Voice-to-Notes Pro", 
    titleHi: "वॉयस-टू-नोट्स प्रो", 
    descriptionEn: "Learn to effectively use the voice-to-notes feature for Hinglish and regional languages. Maximize your study efficiency.", 
    descriptionHi: "हिंग्लिश और क्षेत्रीय भाषाओं के लिए वॉयस-टू-नोट्स सुविधा का प्रभावी ढंग से उपयोग करना सीखें। अपनी अध्ययन दक्षता को अधिकतम करें।", 
    icon: Mic, 
    tags: ["Productivity", "Study Skills", "AI Tool", "Note Taking"], 
    imageUrl: "https://placehold.co/300x200.png", 
    dataAiHint: "microphone audio wave", 
    href: "/study/my-notes" // Link to notes page where this feature would be used
  },
];

export default function CoursesPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
            <Library className="h-8 w-8 text-primary" />
            <BilingualText en="Our Courses" hi="हमारे पाठ्यक्रम" />
          </h1>
          <p className="text-muted-foreground">
            <BilingualText en="Explore a wide range of courses to boost your learning." hi="अपनी शिक्षा को बढ़ावा देने के लिए पाठ्यक्रमों की एक विस्तृत श्रृंखला का अन्वेषण करें।" />
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ChevronLeft className="mr-1 h-4 w-4"/> Back
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockCourses.map((course) => (
          <Card key={course.id} className="overflow-hidden shadow-sm hover:shadow-lg transition-shadow flex flex-col">
            <CardHeader className="p-0">
              <div className="aspect-video relative w-full bg-muted/30">
                <Image 
                  src={course.imageUrl || `https://placehold.co/300x200.png`} 
                  alt={course.titleEn} 
                  layout="fill" 
                  objectFit="cover" 
                  data-ai-hint={course.dataAiHint || 'course image'} 
                />
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-2 flex-grow">
              <div className="flex items-center gap-2 mb-1">
                <course.icon className="h-6 w-6 text-primary" />
                <CardTitle className="text-lg font-semibold leading-tight">
                  <BilingualText en={course.titleEn} hi={course.titleHi} />
                </CardTitle>
              </div>
              <CardDescription className="text-sm h-16 overflow-hidden line-clamp-3">
                <BilingualText en={course.descriptionEn} hi={course.descriptionHi} />
              </CardDescription>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {course.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href={course.href}>
                  <BilingualText en="View Details" hi="विवरण देखें" /> <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
