
// src/app/(app)/coaching-panel/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { 
    GraduationCap, Edit, Video, ArrowLeft, BarChart3, MessageCircleQuestion, Users, BookOpen, AlertCircle, Watch, PlayCircle, Send, CheckCircle, RefreshCw, PlusCircle, CalendarDays, LineChart
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ProfileFormData } from '../edit-profile/page';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from '@/hooks/use-toast';
import type { DoubtInboxItem } from '@/types/doubt-inbox';
import { formatDistanceToNow } from 'date-fns';

const DOUBT_INBOX_KEY = "doubtInbox_mock";

// Mock data for widgets
const mostConfusedTopics = [
    { subject: "Maths", topic: "Trigonometry - tan(A) Derivation", doubts: 36, revisions: 74 },
    { subject: "Biology", topic: "Photosynthesis - Light Reaction", doubts: 25, revisions: 61 },
    { subject: "Physics", topic: "Motion - Newton’s 2nd Law", doubts: 20, revisions: 49 },
];

const topicDrilldownData = [
    { subject: "Maths", chapter: "Trigonometry", subtopic: "tan(A) Derivation", marked: 74, doubts: 36 },
    { subject: "Science", chapter: "Biology - Ch 3", subtopic: "Light Reaction", marked: 61, doubts: 25 },
    { subject: "Physics", chapter: "Motion Ch 1", subtopic: "Newton’s 2nd Law", marked: 49, doubts: 20 },
    { subject: "Chemistry", chapter: "Acids & Bases", subtopic: "pH Scale", marked: 35, doubts: 15 },
];


function LiveDoubtQueue() {
    const { toast } = useToast();
    const [doubts, setDoubts] = useState<DoubtInboxItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadDoubts = () => {
        setIsLoading(true);
        if (typeof window !== "undefined") {
            const storedDoubts = localStorage.getItem(DOUBT_INBOX_KEY);
            if (storedDoubts) {
                setDoubts(JSON.parse(storedDoubts).filter((d: DoubtInboxItem) => d.status === 'pending'));
            }
        }
        setIsLoading(false);
    };

    useEffect(() => {
        loadDoubts();
    }, []);

    const handleAnswerDoubt = (doubtId: string) => {
        const updatedInbox = JSON.parse(localStorage.getItem(DOUBT_INBOX_KEY) || '[]').map((d: DoubtInboxItem) => 
            d.id === doubtId ? { ...d, status: 'answered' } : d
        );
        localStorage.setItem(DOUBT_INBOX_KEY, JSON.stringify(updatedInbox));
        loadDoubts(); // Refresh the list
        toast({ title: "Doubt Answered", description: `Doubt ${doubtId} has been marked as answered.` });
    };

    return (
        <Card className="col-span-1 md:col-span-2">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle className="font-headline flex items-center gap-2">
                        <MessageCircleQuestion className="h-6 w-6 text-primary"/>
                        <BilingualText en="Live Doubt Queue" hi="लाइव शंका कतार"/>
                    </CardTitle>
                    <Button variant="ghost" size="icon" onClick={loadDoubts} className="h-7 w-7">
                        <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}/>
                    </Button>
                </div>
                <CardDescription>
                    <BilingualText en="Doubts submitted by students from the Revision Vault." hi="रिवीजन वॉल्ट से छात्रों द्वारा प्रस्तुत शंकाएं।"/>
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                {isLoading ? <LoadingSpinner /> : doubts.length > 0 ? doubts.map(doubt => (
                    <Card key={doubt.id} className="bg-muted/50 p-3">
                        <p className="text-xs text-muted-foreground">{doubt.subject} - {doubt.lectureTitle}</p>
                        <p className="text-xs text-muted-foreground">Marked at <span className="font-mono">{doubt.timestamp}</span> by <span className="font-semibold">{doubt.studentName}</span></p>
                        <p className="text-sm italic my-1">"{doubt.note}"</p>
                        <div className="flex items-center justify-between mt-2">
                             <p className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(doubt.doubtAskedAt), { addSuffix: true })}
                            </p>
                            <div className="flex gap-2">
                                <Button size="xs" variant="outline"><PlayCircle className="mr-1 h-3 w-3"/> Watch Clip</Button>
                                <Button size="xs" onClick={() => handleAnswerDoubt(doubt.id)}><CheckCircle className="mr-1 h-3 w-3"/> Mark Answered</Button>
                            </div>
                        </div>
                    </Card>
                )) : (
                    <p className="text-center text-sm text-muted-foreground py-6">The doubt queue is empty. Great job!</p>
                )}
            </CardContent>
        </Card>
    );
}


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
  const activeExam = teacherProfile?.examTarget || "Not Set";

  return (
    <div className="space-y-8">
      <header className="text-center relative">
        <Button variant="outline" size="icon" className="absolute left-0 top-0" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
        </Button>
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
      
      {/* Revision & Doubt Intelligence Panel */}
      <Card className="border-primary/30">
        <CardHeader>
            <CardTitle className="font-headline text-primary"><BilingualText en="Revision & Doubt Intelligence" hi="रिवीजन और शंका इंटेलिजेंस"/></CardTitle>
            <CardDescription><BilingualText en="Insights based on student revision marks and doubt submissions." hi="छात्र संशोधन चिह्नों और शंका प्रस्तुतियों पर आधारित अंतर्दृष्टि।" /></CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg font-headline flex items-center gap-2"><AlertCircle className="h-5 w-5 text-destructive"/>Most Confused Topics</CardTitle>
                    <CardDescription className="text-xs">Last 7 days</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                    {mostConfusedTopics.map(topic => (
                        <div key={topic.topic} className="text-sm p-2 bg-muted/50 rounded-md">
                            <p className="font-semibold">{topic.topic}</p>
                            <p className="text-xs text-muted-foreground">{topic.subject} | {topic.doubts} doubts, {topic.revisions} revisions</p>
                        </div>
                    ))}
                </CardContent>
            </Card>
            
            <LiveDoubtQueue />
            
            <Card className="col-span-1 md:col-span-2">
                 <CardHeader>
                    <CardTitle className="text-lg font-headline flex items-center gap-2"><BarChart3 className="h-5 w-5 text-primary"/>Topic Drilldown</CardTitle>
                 </CardHeader>
                 <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Subject</TableHead>
                                <TableHead>Topic</TableHead>
                                <TableHead className="text-center"># Revisions</TableHead>
                                <TableHead className="text-center"># Doubts</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {topicDrilldownData.map(row => (
                                <TableRow key={row.subtopic}>
                                    <TableCell className="text-xs">{row.subject}</TableCell>
                                    <TableCell className="font-medium text-xs">{row.subtopic}</TableCell>
                                    <TableCell className="text-center">{row.marked}</TableCell>
                                    <TableCell className="text-center font-semibold text-destructive">{row.doubts}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                 </CardContent>
            </Card>
        </CardContent>
      </Card>


      <Card>
        <CardHeader>
          <CardTitle className="font-headline"><BilingualText en="Quick Actions" hi="त्वरित कार्रवाइयां" /></CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <Button asChild variant="outline" className="h-auto py-4 flex flex-col items-center justify-center text-center gap-2 hover:bg-primary/5">
            <Link href="/coaching-panel/create-course">
              <PlusCircle className="h-7 w-7 text-primary mb-1" />
              <span className="text-xs font-medium"><BilingualText en="Create New Course" hi="नया कोर्स बनाएं" /></span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-auto py-4 flex flex-col items-center justify-center text-center gap-2 hover:bg-primary/5">
            <Link href="/coaching-panel/my-courses">
              <BookOpen className="h-7 w-7 text-primary mb-1" />
              <span className="text-xs font-medium"><BilingualText en="Manage My Courses" hi="मेरे कोर्स प्रबंधित करें" /></span>
            </Link>
          </Button>
           <Button asChild variant="outline" className="h-auto py-4 flex flex-col items-center justify-center text-center gap-2 hover:bg-primary/5">
            <Link href="/coaching-panel/analytics">
              <LineChart className="h-7 w-7 text-primary mb-1" />
              <span className="text-xs font-medium"><BilingualText en="Student Analytics" hi="छात्र एनालिटिक्स" /></span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-auto py-4 flex flex-col items-center justify-center text-center gap-2 hover:bg-primary/5">
            <Link href="/coaching-panel/timetable">
              <CalendarDays className="h-7 w-7 text-primary mb-1" />
              <span className="text-xs font-medium"><BilingualText en="My Timetable" hi="मेरी समय-सारणी" /></span>
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// Added size="xs" to button variants for smaller buttons in doubt queue
declare module "@/components/ui/button" {
    interface ButtonProps {
        size?: 'default' | 'sm' | 'lg' | 'icon' | 'xs';
    }
}
