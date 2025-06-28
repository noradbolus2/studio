
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, History, PlayCircle, MessageCircleQuestion, CheckCircle, HelpCircle } from "lucide-react";
import type { RevisionVaultItem } from '@/types/revision-vault';
import type { DoubtInboxItem } from '@/types/doubt-inbox';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { ProfileFormData } from '../../edit-profile/page';

const mockRevisionItems: RevisionVaultItem[] = [
  { id: 'rev1', lectureId: "phy_motion_01", lectureTitle: "Physics - Newton’s 2nd Law", timestamp: "00:10:12", note: "Acceleration = net force / mass — derivation samajh nahi aaya", subject: "Physics", chapter: "Motion Ch 1", topic: "Newton's 2nd Law", status: 'revision' },
  { id: 'rev2', lectureId: "maths_trigo_02", lectureTitle: "Maths - Trigonometry Part 2", timestamp: "00:14:58", note: "tan(A) ka derivation logic samajh nahi aaya", subject: "Maths", chapter: "Trigonometry", topic: "tan(A) Derivation", status: 'revision' },
  { id: 'rev3', lectureId: "bio_cells_01", lectureTitle: "Biology - Cell Structure", timestamp: "00:08:22", note: "Mitochondria function needs more clarity.", subject: "Biology", chapter: "The Cell", topic: "Mitochondria", status: 'doubt_asked' },
  { id: 'rev4', lectureId: "chem_organic_04", lectureTitle: "Chemistry - Alkanes", timestamp: "00:21:05", subject: "Chemistry", chapter: "Organic Chemistry", topic: "Nomenclature", status: 'resolved', teacherResponse: { type: 'text', content: 'Remember the IUPAC rules for the longest chain. Shared a PDF in your notes.' } },
];

const DOUBT_INBOX_KEY = "doubtInbox_mock";

export default function RevisionVaultPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [vaultItems, setVaultItems] = useState<RevisionVaultItem[]>(mockRevisionItems);
  const [profileData, setProfileData] = useState<ProfileFormData | null>(null);

  useEffect(() => {
    // Load profile data to get student's name
    if (typeof window !== "undefined") {
      const storedProfile = localStorage.getItem('userProfileData');
      if (storedProfile) {
        setProfileData(JSON.parse(storedProfile));
      }
    }
  }, []);

  const handleAskTeacher = (itemId: string) => {
    const itemToUpdate = vaultItems.find(item => item.id === itemId);
    if (!itemToUpdate || !profileData) {
      toast({ title: "Error", description: "Could not find the item or user profile.", variant: "destructive" });
      return;
    }

    // 1. Create the doubt item for the teacher's inbox
    const doubtItem: DoubtInboxItem = {
      id: itemId,
      studentId: profileData.email || 'student_unknown', // Using email as a unique studentId for proto
      studentName: profileData.fullName || 'A Student',
      lectureId: itemToUpdate.lectureId,
      lectureTitle: itemToUpdate.lectureTitle,
      timestamp: itemToUpdate.timestamp,
      note: itemToUpdate.note || 'No specific note provided.',
      subject: itemToUpdate.subject,
      chapter: itemToUpdate.chapter,
      topic: itemToUpdate.topic,
      status: 'pending',
      doubtAskedAt: new Date().toISOString(),
    };

    // 2. Add to localStorage (simulating backend push)
    try {
      const storedInboxString = localStorage.getItem(DOUBT_INBOX_KEY);
      const existingInbox: DoubtInboxItem[] = storedInboxString ? JSON.parse(storedInboxString) : [];
      const updatedInbox = [...existingInbox, doubtItem];
      localStorage.setItem(DOUBT_INBOX_KEY, JSON.stringify(updatedInbox));
    } catch (e) {
      console.error("Failed to update mock doubt inbox:", e);
      toast({ title: "Simulation Error", description: "Could not send doubt to mock inbox.", variant: "destructive" });
      return;
    }

    // 3. Update the local state of the vault item
    setVaultItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, status: 'doubt_asked' } : item
      )
    );

    // 4. Notify user
    toast({
      title: "Doubt Sent!",
      description: "Your question has been sent to the teacher's dashboard.",
    });
  };

  const getStatusBadge = (status: RevisionVaultItem['status']) => {
    switch (status) {
      case 'revision': return <Badge variant="outline">Marked for Revision</Badge>;
      case 'doubt_asked': return <Badge variant="secondary" className="bg-yellow-400 text-yellow-900">Doubt Asked</Badge>;
      case 'resolved': return <Badge variant="default" className="bg-green-500 text-white">Resolved</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-headline flex items-center gap-2">
          <History className="h-7 w-7 text-primary" />
          <BilingualText en="My Revision Vault" hi="मेरा रिवीजन वॉल्ट" />
        </h1>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          <BilingualText en="Back to Study Zone" hi="स्टडी जोन पर वापस" />
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle><BilingualText en="Your Saved Moments" hi="आपके सहेजे गए क्षण" /></CardTitle>
          <CardDescription>
            <BilingualText en="Review topics you marked, rewatch clips, or ask your teacher for help." hi="अपने चिह्नित विषयों की समीक्षा करें, क्लिप फिर से देखें, या अपने शिक्षक से मदद मांगें।" />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {vaultItems.length > 0 ? vaultItems.map(item => (
            <Card key={item.id} className={cn("p-4", item.status === 'resolved' ? 'bg-green-500/10 border-green-500/30' : 'bg-muted/50')}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-primary">{item.subject}: {item.lectureTitle}</h3>
                  <p className="text-sm text-muted-foreground">Marked at: <span className="font-mono">{item.timestamp}</span> ({item.topic})</p>
                </div>
                {getStatusBadge(item.status)}
              </div>
              <p className="text-sm my-2 p-2 bg-background rounded-md border italic">"{item.note}"</p>
              {item.status === 'resolved' && item.teacherResponse && (
                <div className="p-2 border-l-4 border-primary bg-primary/10 text-primary-foreground/90 rounded-r-md mt-2">
                    <p className="text-xs font-bold">Teacher's Response:</p>
                    <p className="text-sm">{item.teacherResponse.content}</p>
                </div>
              )}
              <div className="flex gap-2 mt-3">
                <Button variant="outline" size="sm">
                  <PlayCircle className="mr-1.5 h-4 w-4" /> Replay Clip
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => handleAskTeacher(item.id)} 
                  disabled={item.status !== 'revision'}
                  className={item.status !== 'revision' ? 'opacity-50 cursor-not-allowed' : ''}
                >
                  {item.status === 'revision' ? <MessageCircleQuestion className="mr-1.5 h-4 w-4" /> : item.status === 'doubt_asked' ? <HelpCircle className="mr-1.5 h-4 w-4" /> : <CheckCircle className="mr-1.5 h-4 w-4"/>}
                  {item.status === 'revision' ? 'Ask Teacher' : item.status === 'doubt_asked' ? 'Doubt Sent' : 'Resolved'}
                </Button>
              </div>
            </Card>
          )) : (
            <p className="text-center text-muted-foreground py-6"><BilingualText en="Your revision vault is empty. Mark topics in lectures to save them here." hi="आपका रिवीजन वॉल्ट खाली है। विषयों को यहां सहेजने के लिए लेक्चर में चिह्नित करें।" /></p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
