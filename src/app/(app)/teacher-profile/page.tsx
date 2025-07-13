
"use client";

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Star, BookOpen, UserPlus, Bell, Layers, Download, PlayCircle, RadioTower, History } from "lucide-react";
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

const mockTeacherProfile = {
  name: "Abhishek Verma",
  title: "Physics Expert (NEET + Class 11–12)",
  institution: "Ex-Faculty at Aakash Institute",
  avatarUrl: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxtYWxlJTIwdGVhY2hlcnxlbnwwfHx8fDE3NTI1NzU2NzF8MA&ixlib=rb-4.1.0&q=80&w=1080",
  dataAiHint: "male teacher",
  bio: "With over 10 years of experience, I simplify complex Physics concepts to help students excel in NEET and board exams. My teaching philosophy focuses on building a strong foundation and problem-solving skills.",
  subjects: ["Physics", "NEET Prep", "Class 11", "Class 12", "JEE Physics"],
  rating: 4.8,
  followers: 2340,
};

const mockCourses = [
  { id: "C1", title: "Complete Physics for Class 12", price: "₹2,499" },
  { id: "C2", title: "NEET Physics Crash Course", price: "₹1,999" },
  { id: "C3", title: "Mastering Electromagnetism (JEE)", price: "₹999" },
];

const mockLiveClasses = [
    { id: "LC1", title: "Doubt Solving Session - Ch 5", status: 'Upcoming', date: 'Tomorrow @ 5 PM' },
    { id: "LC2", title: "Wave Optics - Part 2", status: 'Previous', date: '2 Days Ago' },
];

const mockNotes = [
    { id: "N1", title: "Chapter 4 - Moving Charges & Magnetism Notes", type: "PDF" },
    { id: "N2", title: "All Important Formulas (Class 12)", type: "PDF" },
];

export default function TeacherProfilePage() {
  const router = useRouter();
  const [isFollowing, setIsFollowing] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
          <BilingualText en="Educator Profile" hi="शिक्षक प्रोफ़ाइल" />
        </h1>
        <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            <BilingualText en="Back" hi="वापस"/>
        </Button>
      </div>

       <Card className="shadow-lg">
        <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
          <Avatar className="h-28 w-28 border-4 border-primary">
            <AvatarImage src={mockTeacherProfile.avatarUrl} alt={mockTeacherProfile.name} data-ai-hint={mockTeacherProfile.dataAiHint} />
            <AvatarFallback>{mockTeacherProfile.name.substring(0,2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-grow text-center md:text-left">
            <CardTitle className="text-2xl font-bold">{mockTeacherProfile.name}</CardTitle>
            <p className="text-md text-primary font-semibold">{mockTeacherProfile.title}</p>
            <CardDescription className="text-sm mt-1">{mockTeacherProfile.institution}</CardDescription>
            <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground mt-2">
              <span className="flex items-center gap-1"><Star className="h-4 w-4 text-yellow-400 fill-yellow-400" /> {mockTeacherProfile.rating}/5.0</span>
              <span className="font-semibold">{mockTeacherProfile.followers.toLocaleString()} Followers</span>
            </div>
          </div>
          <Button size="lg" onClick={() => setIsFollowing(!isFollowing)} className="w-full md:w-auto">
            <UserPlus className="mr-2 h-5 w-5"/> {isFollowing ? 'Following' : 'Follow'}
          </Button>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
             <Card>
                <CardHeader><CardTitle>About Me</CardTitle></CardHeader>
                <CardContent><p className="text-sm text-muted-foreground">{mockTeacherProfile.bio}</p></CardContent>
             </Card>
             <Card>
                <CardHeader><CardTitle>Subjects & Expertise</CardTitle></CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {mockTeacherProfile.subjects.map(sub => <Badge key={sub} variant="secondary">{sub}</Badge>)}
                </CardContent>
             </Card>
             <Card>
                <CardHeader><CardTitle>Courses by {mockTeacherProfile.name.split(' ')[0]}</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {mockCourses.map(course => (
                    <div key={course.id} className="p-3 border rounded-md flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold">{course.title}</h4>
                        <p className="text-sm text-primary">{course.price}</p>
                      </div>
                      <Button asChild><Link href="#">View Details</Link></Button>
                    </div>
                  ))}
                </CardContent>
             </Card>
          </div>
          <div className="lg:col-span-1 space-y-6">
            <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Bell size={20}/> Live Classes</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                   {mockLiveClasses.map(cls => (
                     <div key={cls.id} className="text-sm p-2 rounded-md bg-muted/50 flex items-center gap-2">
                        {cls.status === 'Upcoming' ? <RadioTower size={16} className="text-destructive animate-pulse"/> : <History size={16} />}
                        <div>
                            <p className="font-medium">{cls.title}</p>
                            <p className="text-xs text-muted-foreground">{cls.date}</p>
                        </div>
                     </div>
                   ))}
                </CardContent>
            </Card>
             <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Layers size={20}/> Notes & Resources</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                   {mockNotes.map(note => (
                     <Button key={note.id} variant="outline" size="sm" className="w-full justify-start gap-2">
                        <Download size={14}/> {note.title} ({note.type})
                     </Button>
                   ))}
                </CardContent>
            </Card>
          </div>
      </div>
    </div>
  );
}
