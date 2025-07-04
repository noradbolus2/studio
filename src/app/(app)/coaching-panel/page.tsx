
// src/app/(app)/coaching-panel/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { 
    Video, CalendarDays, Users, IndianRupee, UploadCloud, PlayCircle, BarChart3, Edit,
    Bell, UserPlus, LogOut as UserMinus, TrendingUp, Package, Lightbulb, BadgePercent, PlaySquare
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ProfileFormData } from '../edit-profile/page';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

const teacherStats = [
    { id: "courses", labelEn: "My Courses", value: "3", icon: Video, href: "/coaching-panel/create-course" },
    { id: "upcoming", labelEn: "Upcoming Classes", value: "2 Today", icon: CalendarDays, href: "/schedule-class" },
    { id: "students", labelEn: "My Students", value: "1,285", icon: Users, href: "/coaching-panel/analytics" },
    { id: "earnings", labelEn: "My Earnings", value: "INR 41,320", icon: IndianRupee, href: "/coaching-panel/earnings" },
];

const mockNotifications = [
    { id: 1, text: "Student Aniket joined your NEET 2025 Batch", icon: UserPlus, color: "text-green-500" },
    { id: 2, text: "Your course 'Modern Physics' is trending in Lucknow", icon: TrendingUp, color: "text-blue-500" },
    { id: 3, text: "5 students ordered your printed notes – Vendor notified", icon: Package, color: "text-orange-500" },
    { id: 4, text: "Student dropped out after Chapter 3 – Auto Feedback Requested", icon: UserMinus, color: "text-red-500" },
];

const mockAiSuggestions = [
    "Avg. student watch time is dropping. Consider uploading shorter revision videos.",
    "Add chapter-wise mock tests to 'NEET Chemistry 2025' to improve engagement.",
    "Offer 'Class 10 Foundation' as a low-cost add-on to attract more students."
];


export default function CoachingPanelPage() {
  const router = useRouter();
  const [teacherProfile, setTeacherProfile] = useState<ProfileFormData | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedProfileString = localStorage.getItem('userProfileData');
      if (storedProfileString) {
        try {
          const parsedProfile = JSON.parse(storedProfileString) as ProfileFormData;
          if (parsedProfile.role === 'teacher' || parsedProfile.creatorName) {
            setTeacherProfile(parsedProfile);
          }
        } catch (e) { console.error("Failed to parse teacher profile", e); }
      }
    }
    setLoadingProfile(false);
  }, []);

  if (loadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <LoadingSpinner size={48} />
        <p className="ml-4 text-muted-foreground">Loading Teacher Dashboard...</p>
      </div>
    );
  }

  const teacherName = teacherProfile?.creatorName || teacherProfile?.fullName || "Teacher";

  return (
    <div className="space-y-8">
      <header className="text-center relative">
        <h1 className="text-3xl font-bold font-headline text-primary">
          👋 <BilingualText en={`Welcome, ${teacherName}!`} hi={`स्वागत है, ${teacherName}!`} />
        </h1>
        <Button asChild variant="link" size="sm" className="mt-1 text-accent">
            <Link href={`/edit-profile?role=teacher`}>
                <Edit className="mr-1.5 h-3 w-3"/>
                <BilingualText en="Edit Profile" hi="प्रोफ़ाइल संपादित करें" />
            </Link>
        </Button>
      </header>
      
       <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
           <Button asChild size="lg" className="h-auto py-4 flex flex-col gap-2">
               <Link href="/coaching-panel/create-course">
                   <UploadCloud className="h-7 w-7"/>
                   <span className="font-semibold"><BilingualText en="Upload New Content" hi="नई सामग्री अपलोड करें"/></span>
               </Link>
           </Button>
            <Button asChild size="lg" className="h-auto py-4 flex flex-col gap-2">
               <Link href="/coaching-panel/live-classes">
                   <PlayCircle className="h-7 w-7"/>
                   <span className="font-semibold"><BilingualText en="Go Live" hi="लाइव जाएं"/></span>
               </Link>
           </Button>
            <Button asChild size="lg" className="h-auto py-4 flex flex-col gap-2">
               <Link href="/coaching-panel/analytics">
                   <BarChart3 className="h-7 w-7"/>
                   <span className="font-semibold"><BilingualText en="My Students" hi="मेरे छात्र"/></span>
               </Link>
           </Button>
            <Button asChild size="lg" className="h-auto py-4 flex flex-col gap-2">
              <Link href="/coaching-panel/promotions">
                  <BadgePercent className="h-7 w-7"/>
                  <span className="font-semibold"><BilingualText en="Promotions" hi="प्रचार"/></span>
              </Link>
          </Button>
          <Button asChild size="lg" className="h-auto py-4 flex flex-col gap-2 md:col-span-1 col-span-2">
              <Link href="/coaching-panel/smart-slide-class">
                  <PlaySquare className="h-7 w-7"/>
                  <span className="font-semibold"><BilingualText en="Smart Slide Class" hi="स्मार्ट स्लाइड क्लास"/></span>
              </Link>
          </Button>
       </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline">
            <Bell className="h-6 w-6 text-primary"/>
            <BilingualText en="Smart Notifications" hi="स्मार्ट सूचनाएं"/>
          </CardTitle>
          <CardDescription>
            <BilingualText en="Live updates about your courses and students." hi="आपके पाठ्यक्रमों और छात्रों के बारे में लाइव अपडेट।"/>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {mockNotifications.map(notification => (
            <div key={notification.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <notification.icon className={`h-5 w-5 mt-1 flex-shrink-0 ${notification.color}`} />
              <p className="text-sm text-foreground">{notification.text}</p>
            </div>
          ))}
        </CardContent>
      </Card>
      
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline text-primary">
            <Lightbulb className="h-6 w-6"/>
            <BilingualText en="GURU Mode™ AI Insights" hi="गुरु मोड™ एआई अंतर्दृष्टि"/>
          </CardTitle>
          <CardDescription>
            <BilingualText en="Data-based tips to improve your course performance." hi="अपने पाठ्यक्रम के प्रदर्शन को बेहतर बनाने के लिए डेटा-आधारित सुझाव।"/>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {mockAiSuggestions.map((suggestion, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-background/50 rounded-lg border border-primary/20">
              <p className="text-sm text-foreground">{suggestion}</p>
            </div>
          ))}
        </CardContent>
      </Card>

    </div>
  );
}
