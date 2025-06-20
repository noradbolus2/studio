
"use client";

import { useState, useEffect } from 'react';
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { GraduationCap, PlusCircle, Edit, Video, MessageCircleQuestion, BookOpen, BarChart3 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ProfileFormData } from '../edit-profile/page';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

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
          if (parsedProfile.role === 'teacher' || parsedProfile.creatorName) { // Allow creatorName as proxy for teacher name
            setTeacherProfile(parsedProfile);
          }
        } catch (e) {
          console.error("Failed to parse teacher profile from localStorage", e);
        }
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
  const activeExam = teacherProfile?.examTarget || "Not Set";

  return (
    <div className="space-y-8">
      <header className="text-center">
        <GraduationCap className="h-12 w-12 text-primary mx-auto mb-2" />
        <h1 className="text-3xl font-bold font-headline text-primary">
          <BilingualText en="OSO Coaching Panel" hi="OSO कोचिंग पैनल" />
        </h1>
        <p className="text-muted-foreground">
          <BilingualText en={`Welcome, ${teacherName}! Manage your teaching activities.`} hi={`स्वागत है, ${teacherName}! अपनी शिक्षण गतिविधियाँ प्रबंधित करें।`} />
        </p>
        <Button asChild variant="link" size="sm" className="mt-1 text-accent">
            <Link href={`/edit-profile?role=teacher`}>
                <Edit className="mr-1.5 h-3 w-3"/>
                <BilingualText en="Edit Profile" hi="प्रोफ़ाइल संपादित करें" />
            </Link>
        </Button>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline"><BilingualText en="Quick Actions" hi="त्वरित कार्रवाइयां" /></CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <Button asChild variant="outline" className="h-auto py-4 flex flex-col items-center justify-center text-center gap-2 hover:bg-primary/5">
            <Link href="/schedule-class">
              <Video className="h-7 w-7 text-primary mb-1" />
              <span className="text-xs font-medium"><BilingualText en="Schedule Live Class" hi="लाइव क्लास शेड्यूल करें" /></span>
            </Link>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center text-center gap-2 hover:bg-primary/5">
            <PlusCircle className="h-7 w-7 text-primary mb-1" />
            <span className="text-xs font-medium"><BilingualText en="Create Course Content" hi="कोर्स सामग्री बनाएं" /></span>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center text-center gap-2 hover:bg-primary/5">
            <BookOpen className="h-7 w-7 text-primary mb-1" />
            <span className="text-xs font-medium"><BilingualText en="My Courses & Classes" hi="मेरे पाठ्यक्रम और कक्षाएं" /></span>
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center justify-between">
            <span><BilingualText en="Active Exam Dashboard" hi="सक्रिय परीक्षा डैशबोर्ड" />: <span className="text-primary">{activeExam}</span></span>
            <Button variant="outline" size="sm" className="text-xs"><BilingualText en="Switch Exam" hi="परीक्षा बदलें" /></Button>
          </CardTitle>
          <CardDescription><BilingualText en="Exam-specific resources and student data." hi="परीक्षा-विशिष्ट संसाधन और छात्र डेटा।" /></CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">Syllabus, News, Top Books for <span className="font-semibold">{activeExam}</span> will appear here.</p>
            {/* Placeholder for exam resources */}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline"><BilingualText en="Upcoming Live Classes" hi="आगामी लाइव कक्षाएं" /></CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm"><BilingualText en="No upcoming classes scheduled yet." hi="अभी तक कोई आगामी कक्षाएं निर्धारित नहीं हैं।" /></p>
            {/* Placeholder for list of upcoming classes */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline"><BilingualText en="Student Doubts" hi="छात्र शंकाएँ" /></CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm"><BilingualText en="No pending doubts from students." hi="छात्रों से कोई लंबित शंकाएँ नहीं हैं।" /></p>
            {/* Placeholder for doubt box */}
          </CardContent>
           <CardFooter>
                <Button variant="outline" className="w-full">
                    <MessageCircleQuestion className="mr-2 h-4 w-4"/> <BilingualText en="Open Doubt Portal" hi="शंका समाधान पोर्टल खोलें"/>
                </Button>
           </CardFooter>
        </Card>
      </div>
       <Card>
            <CardHeader>
                <CardTitle className="font-headline"><BilingualText en="Performance & Earnings" hi="प्रदर्शन और कमाई" /></CardTitle>
                 <CardDescription><BilingualText en="Track your course engagement and revenue." hi="अपने पाठ्यक्रम की व्यस्तता और राजस्व को ट्रैक करें।" /></CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground text-sm">Analytics and earnings summary coming soon.</p>
            </CardContent>
             <CardFooter>
                <Button variant="outline" className="w-full">
                    <BarChart3 className="mr-2 h-4 w-4"/> <BilingualText en="View Detailed Analytics" hi="विस्तृत एनालिटिक्स देखें"/>
                </Button>
           </CardFooter>
        </Card>
    </div>
  );
}
