
"use client";

import { useState } from 'react';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Star, BookOpen, UserPlus, MessageSquare, Layers, Download, PlayCircle, RadioTower, History, MapPin, Award } from "lucide-react";
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock Data - In a real app, this would be fetched based on teacherId
const mockTeacherProfile = {
  id: "teacher1", // matches one from the marketplace
  name: "Abhishek Verma",
  title: "Physics Expert | NEET",
  institution: "Ex-Faculty at Aakash Institute",
  location: "Lucknow",
  avatarUrl: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxtYWxlJTIwdGVhY2hlcnxlbnwwfHx8fDE3NTI1NzU2NzF8MA&ixlib=rb-4.1.0&q=80&w=1080",
  dataAiHint: "male teacher",
  bio: "With over 10 years of experience, I simplify complex Physics concepts to help students excel in NEET and board exams. My teaching philosophy focuses on building a strong foundation and problem-solving skills.",
  rating: 4.9,
  reviewCount: 1200,
  followers: 2340,
};

const mockCourses = [
  { id: "C1", title: "Complete Physics for Class 12", price: "₹2,499" },
  { id: "C2", title: "NEET Physics Crash Course", price: "₹1,999" },
  { id: "C3", title: "Mastering Electromagnetism (JEE)", price: "₹999" },
  { id: "C4", title: "Optics for NEET", price: "₹499" },
  { id: "C5", title: "Class 11 Foundation Physics", price: "₹2,199" },
  { id: "C6", title: "Modern Physics Explained", price: "₹799" },
];

const mockLiveClasses = [
    { id: "LC1", title: "Doubt Solving Session - Ch 5", status: 'Upcoming', date: 'Tomorrow @ 5 PM' },
    { id: "LC2", title: "Wave Optics - Part 2", status: 'Previous', date: '2 Days Ago' },
    { id: "LC3", title: "Thermodynamics Live Quiz", status: 'Upcoming', date: 'July 28 @ 7 PM' },
];

const mockNotes = [
    { id: "N1", title: "Chapter 4 - Moving Charges & Magnetism Notes", type: "PDF" },
    { id: "N2", title: "All Important Formulas (Class 12)", type: "PDF" },
    { id: "N3", title: "Quick Revision Notes - Gravitation", type: "PDF" },
];

const mockReviews = [
    { id: "R1", studentName: "Priya S.", rating: 5, comment: "Best teacher for Physics! All my concepts are clear now." },
    { id: "R2", studentName: "Aman K.", rating: 5, comment: "His way of explaining tough topics is just amazing. Highly recommend." },
    { id: "R3", studentName: "Ritu G.", rating: 4, comment: "Good course, but would love more practice problems." },
];

export default function DynamicTeacherProfilePage({ params }: { params: { teacherId: string } }) {
  const router = useRouter();
  const { teacherId } = params;
  const { toast } = useToast();
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(mockTeacherProfile.followers);

  // In a real app, you would fetch the teacher's data using the teacherId
  // For now, we'll just use the mock data.
  const teacher = mockTeacherProfile; 

  const handleFollowToggle = () => {
    setIsFollowing(prev => {
        const newFollowState = !prev;
        if (newFollowState) {
            setFollowerCount(prevCount => prevCount + 1);
            toast({
                title: "Followed!",
                description: `You'll now receive updates from ${teacher.name}.`
            });
        } else {
            setFollowerCount(prevCount => prevCount - 1);
        }
        return newFollowState;
    });
  };

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
        <CardContent className="p-4 flex flex-col items-center gap-4">
          <Avatar className="h-24 w-24 border-4 border-primary">
            <AvatarImage src={teacher.avatarUrl} alt={teacher.name} data-ai-hint={teacher.dataAiHint} />
            <AvatarFallback>{teacher.name.substring(0,2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="text-center">
            <CardTitle className="text-2xl font-bold">{teacher.name}</CardTitle>
            <p className="text-md text-primary font-semibold">{teacher.title}</p>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mt-2">
              <span className="flex items-center gap-1"><Star className="h-4 w-4 text-yellow-400 fill-yellow-400" /> {teacher.rating}/5.0 ({teacher.reviewCount/1000}k reviews)</span>
              <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {teacher.location}</span>
            </div>
             <p className="text-sm text-muted-foreground mt-1">{teacher.institution}</p>
          </div>
           <div className="flex flex-col sm:flex-row gap-2 w-full max-w-sm">
             <Button size="lg" onClick={handleFollowToggle} variant={isFollowing ? 'secondary' : 'default'} className="flex-1">
                <UserPlus className="mr-2 h-5 w-5"/> {isFollowing ? `Following (${followerCount.toLocaleString()})` : `Follow (${followerCount.toLocaleString()})`}
              </Button>
              <Button size="lg" variant="outline" className="flex-1" asChild>
                <Link href="/ai-guruji">
                    <MessageSquare className="mr-2 h-5 w-5"/> Message
                </Link>
              </Button>
            </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="courses" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="courses">📚 Courses ({mockCourses.length})</TabsTrigger>
          <TabsTrigger value="live">▶️ LIVE Sessions</TabsTrigger>
          <TabsTrigger value="notes">📄 Notes</TabsTrigger>
          <TabsTrigger value="reviews">💬 Reviews</TabsTrigger>
        </TabsList>
        <TabsContent value="courses" className="mt-4">
          <Card>
            <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockCourses.map(course => (
                <div key={course.id} className="p-3 border rounded-md flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold">{course.title}</h4>
                    <p className="text-sm text-primary">{course.price}</p>
                  </div>
                  <Button asChild variant="outline" size="sm"><Link href="#">View</Link></Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="live" className="mt-4">
            <Card>
                <CardContent className="p-4 space-y-3">
                   {mockLiveClasses.map(cls => (
                     <div key={cls.id} className="text-sm p-3 rounded-md bg-muted/50 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {cls.status === 'Upcoming' ? <RadioTower size={16} className="text-destructive animate-pulse"/> : <History size={16} />}
                          <div>
                              <p className="font-medium">{cls.title}</p>
                              <p className="text-xs text-muted-foreground">{cls.date}</p>
                          </div>
                        </div>
                        <Button variant="secondary" size="sm">Join</Button>
                     </div>
                   ))}
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="notes" className="mt-4">
            <Card>
                <CardContent className="p-4 space-y-2">
                   {mockNotes.map(note => (
                     <Button key={note.id} variant="outline" size="sm" className="w-full justify-start gap-2">
                        <Download size={14}/> {note.title} ({note.type})
                     </Button>
                   ))}
                </CardContent>
            </Card>
        </TabsContent>
         <TabsContent value="reviews" className="mt-4">
            <Card>
                <CardContent className="p-4 space-y-3">
                   {mockReviews.map(review => (
                     <div key={review.id} className="p-3 border rounded-md bg-muted/50">
                        <div className="flex items-center justify-between">
                            <span className="font-semibold text-sm">{review.studentName}</span>
                            <div className="flex items-center gap-1">
                                {Array(review.rating).fill(0).map((_,i) => <Star key={i} size={12} className="text-yellow-400 fill-yellow-400"/>)}
                                {Array(5-review.rating).fill(0).map((_,i) => <Star key={i} size={12} className="text-muted-foreground/30"/>)}
                            </div>
                        </div>
                        <p className="text-xs italic mt-1">"{review.comment}"</p>
                     </div>
                   ))}
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
      
    </div>
  );
}
