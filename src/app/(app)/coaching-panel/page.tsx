// src/app/(app)/coaching-panel/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { 
    CalendarDays,
    FileText as SlidesIcon,
    UploadCloud,
    Edit,
    Star,
    IndianRupee,
    BookOpen,
    PlayCircle,
    Wand2,
    Briefcase,
    MessageSquare,
    Link as LinkIcon,
    Users
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ProfileFormData } from '../edit-profile/page';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const teacherStats = {
  activeCourse: "Physics 12",
  nextClassTime: "Today @ 4:00 PM",
  studyKitsCount: 5,
  monthlyEarnings: "₹13,800",
  avgRating: 4.8,
  ratingCount: 122,
};

const nextClassDetails = {
    topic: "Human Circulatory System",
    slidesCount: 8,
};

const latestKit = {
    name: "Organic Chemistry Short Notes",
    sales: 740,
};

const earningsDetails = {
    lastClass: 499,
    voicePack: 99,
    kitDownload: 199,
};

const recentReviews = [
    "Sir slides se class lena bahut easy lagta hai!",
    "Loved your Science crash kit.",
];

const quickActions = [
  { id: "gen_slide", labelEn: "Generate Slide", labelHi: "स्लाइड बनाएं", buttonTextEn: "Text to PPT", buttonTextHi: "टेक्स्ट से पीपीटी", icon: Wand2, href: "/coaching-panel/smart-slide-class" },
  { id: "start_class", labelEn: "Start Class", labelHi: "कक्षा शुरू करें", buttonTextEn: "Go Live Now", buttonTextHi: "अभी लाइव जाएं", icon: PlayCircle, href: "/coaching-panel/live-classes" },
  { id: "upload_notes", labelEn: "Upload Notes", labelHi: "नोट्स अपलोड करें", buttonTextEn: "Add Material", buttonTextHi: "सामग्री जोड़ें", icon: UploadCloud, href: "/coaching-panel/create-course" },
  { id: "create_kit", labelEn: "Create Kit", labelHi: "किट बनाएं", buttonTextEn: "Build Study Kit", buttonTextHi: "स्टडी किट बनाएं", icon: Briefcase, href: "/coaching-panel/create-course" },
  { id: "bookings", labelEn: "1:1 Booking", labelHi: "1:1 बुकिंग", buttonTextEn: "Manage Sessions", buttonTextHi: "सत्र प्रबंधित करें", icon: Users, href: "#" },
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
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold font-headline text-primary">
          👋 <BilingualText en={`Welcome, ${teacherName}!`} hi={`स्वागत है, ${teacherName}!`} />
        </h1>
        <p className="text-muted-foreground">Here's your dashboard overview for today.</p>
      </header>
      
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                {/* Next Class Overview */}
                <Card className="shadow-lg rounded-2xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 font-headline"><CalendarDays className="text-primary"/> Next Scheduled Class</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <p className="text-lg font-semibold">{nextClassDetails.topic}</p>
                        <p className="text-sm text-muted-foreground">Time: {teacherStats.nextClassTime}</p>
                        <p className="text-sm text-muted-foreground">Slides: {nextClassDetails.slidesCount} Slides Loaded (<Link href="#" className="text-primary underline">View Deck</Link>)</p>
                    </CardContent>
                    <CardFooter className="gap-2">
                        <Button className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white"><PlayCircle className="mr-2"/> Join Class</Button>
                        <Button variant="outline" asChild><Link href="/coaching-panel/smart-slide-class"><Wand2 className="mr-2"/> Edit Slides</Link></Button>
                        <Button variant="outline" asChild><Link href="/coaching-panel/create-course"><UploadCloud className="mr-2"/> Upload New PPT</Link></Button>
                    </CardFooter>
                </Card>
                {/* Quick Action Panel */}
                <Card className="shadow-md rounded-2xl">
                    <CardHeader><CardTitle className="font-headline">Quick Actions</CardTitle></CardHeader>
                    <CardContent>
                         <Table>
                            <TableBody>
                                {quickActions.map(action => (
                                <TableRow key={action.id}>
                                    <TableCell className="font-medium flex items-center gap-2"><action.icon className="text-primary"/> <BilingualText en={action.labelEn} hi={action.labelHi}/></TableCell>
                                    <TableCell className="text-right">
                                        <Button asChild className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                                            <Link href={action.href}><BilingualText en={action.buttonTextEn} hi={action.buttonTextHi}/></Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-1 space-y-6">
                {/* Smart Slide Generator */}
                <Card className="shadow-md rounded-2xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 font-headline text-sm"><Wand2 className="text-primary"/> Smart Slide Generator</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div>
                            <Label htmlFor="slide-topic" className="text-xs">Topic</Label>
                            <Input id="slide-topic" placeholder="e.g., Reflection of Light" />
                        </div>
                        <div>
                            <Label htmlFor="slide-notes" className="text-xs">Input Notes</Label>
                            <Textarea id="slide-notes" placeholder="Paste or type bullet points..." rows={3}/>
                        </div>
                    </CardContent>
                    <CardFooter className="gap-2">
                         <Button asChild className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white"><Link href="/coaching-panel/smart-slide-class"><Wand2 className="mr-2"/> Generate</Link></Button>
                         <Button asChild variant="outline"><Link href="/coaching-panel/smart-slide-class"><Edit className="mr-2"/> Open Editor</Link></Button>
                    </CardFooter>
                </Card>
                {/* Study Kit Status */}
                <Card className="shadow-md rounded-2xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 font-headline text-sm"><Briefcase className="text-primary"/> Study Kit Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1 text-sm">
                        <p><strong>Total Kits Uploaded:</strong> {teacherStats.studyKitsCount}</p>
                        <p><strong>Last Kit:</strong> "{latestKit.name}"</p>
                        <p><strong>Sales This Month:</strong> ₹{latestKit.sales}</p>
                    </CardContent>
                    <CardFooter className="gap-2">
                        <Button variant="outline" className="flex-1">View My Storefront</Button>
                        <Button asChild className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white"><Link href="/coaching-panel/create-course">+</Link></Button>
                    </CardFooter>
                </Card>
                {/* Earnings Snapshot */}
                <Card className="shadow-md rounded-2xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 font-headline text-sm"><IndianRupee className="text-primary"/> Earnings Snapshot</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1 text-sm">
                        <p><strong>This Month:</strong> {teacherStats.monthlyEarnings}</p>
                        <p><strong>Last Class:</strong> ₹{earningsDetails.lastClass}</p>
                        <p><strong>Voice Pack Sale:</strong> ₹{earningsDetails.voicePack}</p>
                        <p><strong>Kit Download:</strong> ₹{earningsDetails.kitDownload}</p>
                    </CardContent>
                    <CardFooter>
                        <Button asChild variant="outline" className="w-full"><Link href="/coaching-panel/earnings">Full Earnings Report</Link></Button>
                    </CardFooter>
                </Card>
                 {/* Ratings + Reviews */}
                <Card className="shadow-md rounded-2xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 font-headline text-sm"><Star className="text-primary"/> Ratings + Reviews</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <p><strong>Avg. Rating:</strong> {teacherStats.avgRating} from {teacherStats.ratingCount} Students</p>
                        <blockquote className="border-l-2 pl-2 italic">“{recentReviews[0]}”</blockquote>
                        <blockquote className="border-l-2 pl-2 italic">“{recentReviews[1]}”</blockquote>
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