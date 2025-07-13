// src/app/(app)/coaching-panel/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { 
    CalendarDays,
    UploadCloud,
    Edit,
    Star,
    IndianRupee,
    PlayCircle,
    Wand2,
    Briefcase,
    Lightbulb,
    LogOut,
    PlusCircle,
    BarChart3,
    BadgePercent
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ProfileFormData } from '../edit-profile/page';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';


const teacherStats = {
  activeCourse: "Physics 12",
  nextClassTime: "Today @ 4:00 PM",
  studyKitsCount: 5,
  monthlyEarnings: "₹13,800",
  avgRating: 4.8,
  ratingCount: 122,
};

const quickActions = [
  { id: "create_course", labelEn: "Create New Course", labelHi: "नया कोर्स बनाएं", icon: PlusCircle, href: "/coaching-panel/create-course" },
  { id: "manage_classes", labelEn: "Manage Live Classes", labelHi: "लाइव कक्षाएं प्रबंधित करें", icon: CalendarDays, href: "/coaching-panel/live-classes" },
  { id: "student_analytics", labelEn: "Student Analytics", labelHi: "छात्र एनालिटिक्स", icon: BarChart3, href: "/coaching-panel/analytics" },
  { id: "earnings", labelEn: "Earnings & Payouts", labelHi: "कमाई और भुगतान", icon: IndianRupee, href: "/coaching-panel/earnings" },
  { id: "promotions", labelEn: "Promotions", labelHi: "प्रचार", icon: BadgePercent, href: "/coaching-panel/promotions" },
  { id: "edit_profile", labelEn: "Edit My Profile", labelHi: "मेरी प्रोफ़ाइल संपादित करें", icon: Edit, href: "/edit-profile?role=teacher" },
];


export default function CoachingPanelPage() {
  const router = useRouter();
  const { toast } = useToast();
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

  const handleLogout = () => {
    if (typeof window !== "undefined") {
        localStorage.removeItem('loggedInUser'); 
        localStorage.removeItem('userProfileData'); 
    }
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out from the Coaching Panel.",
    });
    router.push('/login');
  };

  if (loadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <LoadingSpinner size={48} />
        <p className="ml-4 text-muted-foreground">Loading Teacher Dashboard...</p>
      </div>
    );
  }

  const teacherName = teacherProfile?.creatorName || teacherProfile?.fullName || "Teacher";
  const nextClassTopic = teacherProfile?.examTarget ? `${teacherProfile.examTarget}: ${teacherProfile.expertise}` : "Your Next Topic";
  
  return (
    <div className="space-y-6 min-h-screen bg-muted/30 p-4 sm:p-6 md:p-8">
      <header className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold font-headline text-primary">
            👋 <BilingualText en={`Welcome, ${teacherName}!`} hi={`स्वागत है, ${teacherName}!`} />
            </h1>
            <p className="text-muted-foreground">Here's your dashboard overview for today.</p>
        </div>
        <Button variant="ghost" onClick={handleLogout} className="text-muted-foreground">
            <LogOut className="mr-2 h-4 w-4"/> Logout
        </Button>
      </header>
      
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                
                <Card className="shadow-lg rounded-xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 font-headline"><CalendarDays className="text-primary"/> Next Scheduled Class</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <p className="text-lg font-semibold">{nextClassTopic}</p>
                        <p className="text-sm text-muted-foreground">Time: {teacherStats.nextClassTime}</p>
                    </CardContent>
                    <CardFooter className="gap-2">
                        <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white"><PlayCircle className="mr-2"/> Join Class</Button>
                        <Button variant="outline" asChild><Link href="/coaching-panel/smart-slide-class"><Wand2 className="mr-2"/> AI Slides</Link></Button>
                    </CardFooter>
                </Card>

                <Card className="bg-primary/5 border-primary/20">
                  <CardHeader>
                      <CardTitle className="font-headline text-primary flex items-center gap-2"><Lightbulb/> <BilingualText en="AI Insights" hi="एआई अंतर्दृष्टि" /></CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                      <p>
                        "
                        {teacherProfile?.examTarget && teacherProfile.expertise ? (
                            <BilingualText 
                                en={`Based on your focus on '${teacherProfile.expertise}' for '${teacherProfile.examTarget}', we've noticed high student interest in practice tests. Consider `} 
                                hi={`'${teacherProfile.examTarget}' के लिए '${teacherProfile.expertise}' पर आपके फोकस के आधार पर, हमने प्रैक्टिस टेस्ट में छात्रों की उच्च रुचि देखी है। `} 
                            />
                        ) : (
                            <BilingualText 
                                en="Students are struggling with 'Rotational Motion'. Consider scheduling a " 
                                hi="छात्र 'घूर्णी गति' में संघर्ष कर रहे हैं। एक " 
                            />
                        )}
                        <Link href="/coaching-panel/live-classes" className="font-semibold underline">
                            <BilingualText en="scheduling a live class?" hi="लाइव क्लास शेड्यूल करें?" />
                        </Link>
                        "
                      </p>
                  </CardContent>
                </Card>

                <Card className="shadow-md rounded-xl">
                    <CardHeader><CardTitle className="font-headline">Quick Actions</CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {quickActions.map(action => (
                            <Button
                                key={action.id}
                                variant="outline"
                                className="h-auto py-4 flex flex-col items-center justify-center text-center gap-2 hover:bg-primary/5 hover:border-primary"
                                asChild
                            >
                                <Link href={action.href}>
                                    <action.icon className="h-7 w-7 text-primary mb-1"/>
                                    <span className="text-xs font-medium"><BilingualText en={action.labelEn} hi={action.labelHi} /></span>
                                </Link>
                            </Button>
                        ))}
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-1 space-y-6">
                <Card className="shadow-md rounded-xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 font-headline text-sm"><IndianRupee className="text-primary"/> Earnings Snapshot</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1 text-sm">
                        <p><strong>This Month:</strong> {teacherStats.monthlyEarnings}</p>
                        <p><strong>Last Class:</strong> ₹499</p>
                    </CardContent>
                    <CardFooter>
                        <Button asChild variant="outline" className="w-full"><Link href="/coaching-panel/earnings">Full Earnings Report</Link></Button>
                    </CardFooter>
                </Card>
                 <Card className="shadow-md rounded-xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 font-headline text-sm"><Star className="text-primary"/> Ratings + Reviews</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <p><strong>Avg. Rating:</strong> {teacherStats.avgRating} from {teacherStats.ratingCount} Students</p>
                        <blockquote className="border-l-2 pl-2 italic">“Sir your teaching style is amazing!”</blockquote>
                    </CardContent>
                    <CardFooter>
                        <Button asChild variant="outline" className="w-full"><Link href="/coaching-panel/promotions">See All Feedback</Link></Button>
                    </CardFooter>
                </Card>
            </div>
       </div>

    </div>
  );
}
