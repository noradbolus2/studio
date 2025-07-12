
"use client";

import { useState } from 'react';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ArrowLeft, Star, FileSignature, Award, MessageCircle, Edit3 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface CreatorProfile {
  id: string;
  nameEn: string;
  nameHi: string;
  expertise: string[];
  avatarUrl: string; 
  dataAiHint: string;
  rating: number;
  reviewCount: number;
  completedProjects: number;
  bio: string;
  handwritingSampleUrl: string;
  dataAiHintHandwriting: string;
  portfolio: { id: string; title: string; imageUrl: string; dataAiHint: string }[];
  reviews: { id: string; studentName: string; rating: number; comment: string }[];
}

const mockCreatorProfile: CreatorProfile = {
  id: 'creator1',
  nameEn: 'Priya\'s Projects',
  nameHi: 'प्रिया के प्रोजेक्ट्स',
  expertise: ['Science Models', 'Dioramas', 'Art & Craft'],
  avatarUrl: 'https://images.unsplash.com/photo-1694638278223-4c3907aa2354?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHxmZW1hbGUlMjBjcmVhdG9yfGVufDB8fHx8MTc1MjMwNjc0N3ww&ixlib=rb-4.1.0&q=80&w=1080',
  dataAiHint: 'female creator',
  rating: 4.9,
  reviewCount: 42,
  completedProjects: 55,
  bio: "Experienced in creating detailed and accurate science models for students from Class 6 to 10. I focus on making learning fun and tangible. All projects are built with care and precision to help you get the best grades!",
  handwritingSampleUrl: 'https://images.unsplash.com/photo-1605141311642-215cc21e68eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw5fHxuZWF0JTIwaGFuZHdyaXRpbmclMjBzYW1wbGV8ZW58MHx8fHwxNzUyMzA2NzQ4fDA&ixlib=rb-4.1.0&q=80&w=1080',
  dataAiHintHandwriting: 'neat handwriting sample',
  portfolio: [
    { id: 'p1', title: 'Volcano Model', imageUrl: 'https://images.unsplash.com/photo-1642668463269-2c10e2db6c7b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHx2b2xjYW5vJTIwbW9kZWx8ZW58MHx8fHwxNzUyMzA2NzQ3fDA&ixlib=rb-4.1.0&q=80&w=1080', dataAiHint: 'volcano model' },
    { id: 'p2', title: 'Solar System Diorama', imageUrl: 'https://images.unsplash.com/photo-1684996141218-01d297b7c7fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw5fHxzb2xhciUyMHN5c3RlbSUyMG1vZGVsfGVufDB8fHx8MTc1MjMwNjc0OHww&ixlib=rb-4.1.0&q=80&w=1080', dataAiHint: 'solar system model' },
    { id: 'p3', title: 'Cell Structure Chart', imageUrl: 'https://images.unsplash.com/photo-1738082956220-a1f20a8632ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxjZWxsJTIwZGlhZ3JhbSUyMGNoYXJ0fGVufDB8fHx8MTc1MjMwNjc0OHww&ixlib.rb-4.1.0&q=80&w=1080', dataAiHint: 'cell diagram chart' },
  ],
  reviews: [
    { id: 'r1', studentName: 'Aarav S.', rating: 5, comment: 'Amazing work on the hydraulic lift project! Got full marks.' },
    { id: 'r2', studentName: 'Sneha P.', rating: 5, comment: 'The diorama was beautiful and delivered on time.' },
  ]
};

export default function CreatorProfilePage() {
  const router = useRouter();
  const params = useParams();
  const creatorId = params.creatorId as string;
  const creator = mockCreatorProfile; // In a real app, you'd fetch this based on creatorId

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
          <Users className="h-8 w-8 text-primary" />
          <BilingualText en="Creator Profile" hi="निर्माता प्रोफ़ाइल" />
        </h1>
        <Button variant="outline" onClick={() => router.push('/creator-marketplace')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            <BilingualText en="Back to Creators" hi="निर्माताओं पर वापस"/>
        </Button>
      </div>

       <Card className="shadow-lg">
        <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
          <Image 
            src={creator.avatarUrl} 
            alt={creator.nameEn} 
            width={120} 
            height={120} 
            className="rounded-full border-4 border-primary object-cover" 
            data-ai-hint={creator.dataAiHint} 
          />
          <div className="flex-grow text-center md:text-left">
            <CardTitle className="text-2xl font-bold"><BilingualText en={creator.nameEn} hi={creator.nameHi} /></CardTitle>
            <div className="flex flex-wrap gap-1.5 my-2 justify-center md:justify-start">
              {creator.expertise.map(exp => <Badge key={exp} variant="secondary">{exp}</Badge>)}
            </div>
            <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Star className="h-4 w-4 text-yellow-400 fill-yellow-400" /> {creator.rating} ({creator.reviewCount} reviews)</span>
              <span className="flex items-center gap-1"><Award className="h-4 w-4 text-green-500" /> {creator.completedProjects} Projects</span>
            </div>
          </div>
          <Button asChild size="lg" className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href={`/creator-marketplace/order/${creator.id}`}>
                <BilingualText en="Hire This Creator" hi="इस निर्माता को काम पर रखें" />
            </Link>
          </Button>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Edit3 size={20}/> About Me</CardTitle></CardHeader>
            <CardContent><p className="text-sm text-muted-foreground">{creator.bio}</p></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><FileSignature size={20}/> Handwriting Sample</CardTitle></CardHeader>
            <CardContent>
              <Image src={creator.handwritingSampleUrl} alt="Handwriting Sample" width={600} height={200} className="rounded-md border object-cover" data-ai-hint={creator.dataAiHintHandwriting} />
            </CardContent>
          </Card>
      </div>

       <Card>
        <CardHeader><CardTitle>Past Work (Portfolio)</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {creator.portfolio.map(item => (
            <div key={item.id} className="group relative">
                <Image src={item.imageUrl} alt={item.title} width={300} height={200} className="rounded-lg object-cover aspect-video" data-ai-hint={item.dataAiHint}/>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <p className="text-white font-bold text-center">{item.title}</p>
                </div>
            </div>
          ))}
        </CardContent>
      </Card>
      
       <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><MessageCircle size={20}/> Student Reviews</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {creator.reviews.map(review => (
            <div key={review.id} className="p-3 border rounded-md bg-muted/50">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm">{review.studentName}</span>
                <div className="flex items-center gap-1">
                  {Array(review.rating).fill(0).map((_,i) => <Star key={i} size={12} className="text-yellow-400 fill-yellow-400"/>)}
                </div>
              </div>
              <p className="text-xs italic mt-1">"{review.comment}"</p>
            </div>
          ))}
        </CardContent>
      </Card>

    </div>
  );
}
