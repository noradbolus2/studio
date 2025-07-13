
"use client";

import { useState, type FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Type, BookOpen, FileText } from "lucide-react";
import Link from 'next/link';
import { format } from 'date-fns'; 
import type { ProfileFormData } from '../../edit-profile/page';

interface Note {
  id: string;
  title: string;
  subject: string;
  date: string;
  excerpt: string;
  content: string; // Full content
  // Fields for role-based filtering
  teacherId?: string;
  teacherName?: string;
  schoolId?: string;
  classId?: string;
}

const LOCAL_STORAGE_NOTES_KEY = "userNotesOSOApp";

export default function NewNotePage() {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [profileData, setProfileData] = useState<ProfileFormData | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Load profile data from localStorage to associate the note with the creator
    if (typeof window !== "undefined") {
      const storedProfile = localStorage.getItem('userProfileData');
      if (storedProfile) {
        try {
          setProfileData(JSON.parse(storedProfile) as ProfileFormData);
        } catch (err) {
          console.warn("Could not parse profile data from localStorage:", err);
        }
      }
    }
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Missing Fields",
        description: "Please provide a title and some content for your note.",
        variant: "destructive",
      });
      return;
    }

    const currentDate = format(new Date(), 'yyyy-MM-dd');
    const newNote: Note = {
      id: Date.now().toString(),
      title: title.trim(),
      subject: subject.trim(),
      date: currentDate,
      content: content.trim(),
      excerpt: content.trim().substring(0, 100) + (content.trim().length > 100 ? "..." : ""),
      // --- Add Teacher/School info for filtering ---
      teacherId: profileData?.email || 'teacher_unknown',
      teacherName: profileData?.fullName || 'OSO Teacher',
      schoolId: profileData?.schoolId || 'all_schools',
      classId: profileData?.className || 'all_classes'
    };

    try {
      const storedNotesString = localStorage.getItem(LOCAL_STORAGE_NOTES_KEY);
      const existingNotes: Note[] = storedNotesString ? JSON.parse(storedNotesString) : [];
      const updatedNotes = [newNote, ...existingNotes];
      localStorage.setItem(LOCAL_STORAGE_NOTES_KEY, JSON.stringify(updatedNotes));

      toast({
        title: "Note Saved",
        description: `Your note "${newNote.title}" has been saved successfully.`,
      });
      
      const destination = profileData?.role === 'teacher' ? '/coaching-panel/notes' : '/study/my-notes';
      router.push(destination); 

    } catch (error) {
      console.error("Error saving note to localStorage:", error);
      toast({
        title: "Error Saving Note",
        description: "Could not save your note. Please try again.",
        variant: "destructive",
      });
    }
  };

  const backLink = profileData?.role === 'teacher' ? '/coaching-panel/notes' : '/study/my-notes';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-headline flex items-center gap-2">
          <FileText className="h-7 w-7 text-primary" />
          <BilingualText en="Create New Note" hi="नया नोट बनाएं" />
        </h1>
        <Button variant="outline" size="sm" asChild>
          <Link href={backLink}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            <BilingualText en="Back to Notes" hi="नोट्स पर वापस" />
          </Link>
        </Button>
      </div>

      <Card className="w-full max-w-xl mx-auto">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle><BilingualText en="Note Details" hi="नोट विवरण" /></CardTitle>
            <CardDescription><BilingualText en="Fill in the information for your new study note." hi="अपने नए अध्ययन नोट के लिए जानकारी भरें।" /></CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title" className="flex items-center gap-1.5">
                <Type className="h-4 w-4 text-muted-foreground" /> <BilingualText en="Title" hi="शीर्षक" />*
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder_en="e.g., Important Formulas - Chapter 5"
                placeholder_hi="उदा., महत्वपूर्ण सूत्र - अध्याय 5"
                required
              />
            </div>
            <div>
              <Label htmlFor="subject" className="flex items-center gap-1.5">
                <BookOpen className="h-4 w-4 text-muted-foreground" /> <BilingualText en="Subject (Optional)" hi="विषय (वैकल्पिक)" />
              </Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder_en="e.g., Physics, History"
                placeholder_hi="उदा., भौतिकी, इतिहास"
              />
            </div>
            <div>
              <Label htmlFor="content" className="flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-muted-foreground" /> <BilingualText en="Content" hi="सामग्री" />*
              </Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder_en="Start writing your notes here..."
                placeholder_hi="अपने नोट्स यहाँ लिखना शुरू करें..."
                className="min-h-[200px]"
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              <Save className="mr-2 h-5 w-5" />
              <BilingualText en="Save Note" hi="नोट सहेजें" />
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

declare module 'react' {
    interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
      placeholder_en?: string;
      placeholder_hi?: string;
    }
    interface TextareaHTMLAttributes<T> extends HTMLAttributes<T> {
        placeholder_en?: string;
        placeholder_hi?: string;
    }
}
