
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowLeft, PlayCircle, Bot } from 'lucide-react';
import Image from 'next/image';

const lessons = [
  { 
    id: "gravity-101", 
    titleEn: "Intro to Gravity", 
    titleHi: "गुरुत्वाकर्षण का परिचय", 
    subjectEn: "Physics", 
    subjectHi: "भौतिकी",
    imageUrl: "https://images.unsplash.com/photo-1634139229569-d3e5a5f6e520?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxncmF2aXR5JTIwbmV3dG9ufGVufDB8fHx8MTc1MzU5MjA2NHww&ixlib=rb-4.1.0&q=80&w=1080",
    dataAiHint: "gravity newton"
  },
  { 
    id: "prakash-101", 
    titleEn: "Intro to Light", 
    titleHi: "प्रकाश का परिचय", 
    subjectEn: "Science", 
    subjectHi: "विज्ञान",
    imageUrl: "https://images.unsplash.com/photo-1598387993441-2b0122953a8a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxpbnRyb2R1Y3Rpb24lMjB0byUyMGxpZ2h0fGVufDB8fHx8MTc1MzU5MjA2NXww&ixlib=rb-4.1.0&q=80&w=1080",
    dataAiHint: "introduction to light"
  },
];

export default function AiTeacherHomePage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
          <Bot className="h-8 w-8 text-primary" />
          <BilingualText en="AI Teacher" hi="एआई शिक्षक" />
        </h1>
        <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            <BilingualText en="Back" hi="वापस"/>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle><BilingualText en="Select a Lesson" hi="एक पाठ चुनें" /></CardTitle>
          <CardDescription><BilingualText en="Choose a topic to start your AI-powered learning session." hi="अपना एआई-संचालित शिक्षण सत्र शुरू करने के लिए एक विषय चुनें।" /></CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lessons.map(lesson => (
            <Card key={lesson.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="p-0">
                <div className="aspect-video relative w-full bg-muted">
                  <Image 
                    src={lesson.imageUrl} 
                    alt={lesson.titleEn}
                    layout="fill"
                    objectFit="cover"
                    data-ai-hint={lesson.dataAiHint}
                   />
                </div>
              </CardHeader>
              <CardContent className="p-3">
                <p className="text-xs font-semibold text-primary"><BilingualText en={lesson.subjectEn} hi={lesson.subjectHi} /></p>
                <h3 className="font-bold text-md"><BilingualText en={lesson.titleEn} hi={lesson.titleHi} /></h3>
              </CardContent>
              <CardFooter className="p-3 pt-0">
                 <Button asChild className="w-full">
                    <Link href={`/ai-teacher/${lesson.id}`}>
                        <PlayCircle className="mr-2 h-4 w-4"/>
                        <BilingualText en="Start Lesson" hi="पाठ शुरू करें"/>
                    </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
