
"use client";

import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"; 
import { Edit, PlusCircle, Search, Trash2, ArrowLeft, FileText, Bot, Volume2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation"; 
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import type { ProfileFormData } from '../../edit-profile/page';

interface Note {
  id: string;
  title: string;
  subject: string;
  date: string;
  excerpt: string;
  content: string;
  teacherId?: string;
  teacherName?: string;
  schoolId?: string;
  classId?: string;
}

const LOCAL_STORAGE_NOTES_KEY = "userNotesOSOApp";

const initialMockNotes: Note[] = [];


export default function MyNotesPage() {
  const [allNotes, setAllNotes] = useState<Note[]>([]);
  const [studentNotes, setStudentNotes] = useState<Note[]>([]); // This will hold notes created *by* the student
  const [teacherNotes, setTeacherNotes] = useState<Note[]>([]); // This will hold notes from teachers
  const [searchTerm, setSearchTerm] = useState("");
  const [profileData, setProfileData] = useState<ProfileFormData | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    let currentUser: ProfileFormData | null = null;
    if (typeof window !== "undefined") {
      const storedProfile = localStorage.getItem('userProfileData');
      if (storedProfile) {
        try {
          currentUser = JSON.parse(storedProfile);
          setProfileData(currentUser);
        } catch (err) {
          console.warn("Could not parse profile data:", err);
        }
      }

      const storedNotesString = localStorage.getItem(LOCAL_STORAGE_NOTES_KEY);
      const allStoredNotes = storedNotesString ? (JSON.parse(storedNotesString) as Note[]) : initialMockNotes;
      setAllNotes(allStoredNotes);
      
      // Filter notes based on the current user's role and context
      if (currentUser?.email) {
        // Notes created *by* the student
        setStudentNotes(allStoredNotes.filter(note => note.teacherId === currentUser?.email));
        
        // Notes visible *to* the student from teachers
        const visibleTeacherNotes = allStoredNotes.filter(note => 
          note.teacherId !== currentUser?.email && // Not their own note
          (note.classId === 'all_classes' || note.classId === currentUser?.className)
          // In a real app, you'd also check schoolId
        );
        setTeacherNotes(visibleTeacherNotes);
      } else {
        // Default view for a guest or user without profile data
        setTeacherNotes(allStoredNotes.filter(n => !n.teacherId?.includes('@'))); // Simple filter for demo
      }
    }
  }, []);

  const filteredStudentNotes = studentNotes.filter(note => 
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTeacherNotes = teacherNotes.filter(note => 
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteNote = (noteId: string, noteTitle: string) => {
    const updatedNotes = allNotes.filter(note => note.id !== noteId);
    setAllNotes(updatedNotes);
    setStudentNotes(prev => prev.filter(note => note.id !== noteId));
    localStorage.setItem(LOCAL_STORAGE_NOTES_KEY, JSON.stringify(updatedNotes));
    toast({
      title: "Note Deleted",
      description: `"${noteTitle}" has been removed from your notes.`,
      variant: "destructive"
    });
  };
  
  const handleReadAloud = (textToRead: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
        toast({ title: "TTS Not Supported", description: "Your browser does not support text-to-speech.", variant: "destructive" });
        return;
    }

    // Stop any previously playing speech
    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
    }

    const newUtterance = new SpeechSynthesisUtterance(textToRead);
    
    // Retrieve and apply saved settings
    const savedSettings = JSON.parse(localStorage.getItem('ttsSettings') || '{}');
    const voices = window.speechSynthesis.getVoices();
    if (savedSettings.voiceURI && voices.length > 0) {
        const selectedVoice = voices.find(v => v.voiceURI === savedSettings.voiceURI);
        if (selectedVoice) newUtterance.voice = selectedVoice;
    }
    newUtterance.rate = savedSettings.rate || 1;
    newUtterance.pitch = savedSettings.pitch || 1;
    
    utteranceRef.current = newUtterance;
    window.speechSynthesis.speak(newUtterance);
  };

  const handleEditNote = (noteId: string) => {
    router.push(`/study/my-notes/edit/${noteId}`);
  };
  
  const NoteCard = ({ note }: { note: Note }) => (
    <Card className="bg-muted/50 hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
                <CardTitle className="text-md font-semibold">{note.title}</CardTitle>
                {note.subject && <Badge variant="outline" className="text-xs">{note.subject}</Badge>}
            </div>
            <CardDescription className="text-xs">
                {note.teacherName ? `By: ${note.teacherName}` : `Last updated: ${note.date}`}
            </CardDescription>
        </CardHeader>
        <CardContent className="pb-3">
            <p className="text-sm text-muted-foreground line-clamp-2">{note.excerpt}</p>
        </CardContent>
        <CardFooter className="flex gap-2 justify-end text-xs pt-2 border-t">
            <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => handleReadAloud(note.content)}>
                <Volume2 className="mr-1 h-3 w-3"/> Read Aloud
            </Button>
            {note.teacherId === profileData?.email ? (
                <>
                    <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => handleEditNote(note.id)}>
                        <Edit className="mr-1 h-3 w-3"/> Edit
                    </Button>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 px-2 text-destructive hover:text-destructive"
                        onClick={() => handleDeleteNote(note.id, note.title)}
                    >
                        <Trash2 className="mr-1 h-3 w-3"/> Delete
                    </Button>
                </>
            ) : (
                 <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => toast({ title: "Viewing Note...", description: "This would open the full note."})}>
                    <BookOpen className="mr-1 h-3 w-3"/> Read More
                </Button>
            )}
        </CardFooter>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <header className="space-y-1">
          <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
            <Edit className="h-8 w-8 text-primary" />
            <BilingualText en="My Notes" hi="मेरे नोट्स" />
          </h1>
          <p className="text-muted-foreground">
            <BilingualText en="Organize and access your study notes efficiently." hi="अपने अध्ययन नोट्स को कुशलतापूर्वक व्यवस्थित करें और एक्सेस करें।" />
          </p>
        </header>
        <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            <BilingualText en="Back" hi="वापस"/>
        </Button>
      </div>

      <Card>
        <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle><BilingualText en="All Your Notes" hi="आपके सभी नोट्स" /></CardTitle>
                <CardDescription>
                    <BilingualText en="Search, view, or edit your saved notes." hi="अपने सहेजे गए नोट्स खोजें, देखें या संपादित करें।" />
                </CardDescription>
              </div>
              <Button asChild size="sm">
                <Link href="/study/my-notes/new">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    <BilingualText en="New Note" hi="नया नोट" />
                </Link>
              </Button>
            </div>
        </CardHeader>
        <CardContent>
            <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder_en="Search your notes..."
                    placeholder_hi="अपने नोट्स खोजें..."
                    className="pl-10 h-11"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            
            <div className="space-y-4">
                {/* Notes from Teachers */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Bot className="text-primary"/> Notes from Guruji & Teachers
                  </h3>
                   {filteredTeacherNotes.length > 0 ? (
                      <div className="space-y-3">
                        {filteredTeacherNotes.map(note => <NoteCard key={note.id} note={note} />)}
                      </div>
                  ) : (
                       <p className="text-muted-foreground text-center py-4 text-sm">
                          <BilingualText en="No notes from teachers found for your class yet." hi="आपकी कक्षा के लिए शिक्षकों से अभी तक कोई नोट्स नहीं मिले हैं।" />
                      </p>
                  )}
                </div>

                {/* Notes Created by Student */}
                <div>
                   <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <FileText /> My Personal Notes
                  </h3>
                  {filteredStudentNotes.length > 0 ? (
                      <div className="space-y-3">
                        {filteredStudentNotes.map(note => <NoteCard key={note.id} note={note} />)}
                      </div>
                  ) : (
                      <p className="text-muted-foreground text-center py-4 text-sm">
                          <BilingualText en="You haven't created any personal notes yet. Click 'New Note' to start!" hi="आपने अभी तक कोई व्यक्तिगत नोट्स नहीं बनाए हैं। शुरू करने के लिए 'नया नोट' पर क्लिक करें!" />
                      </p>
                  )}
                </div>
            </div>

        </CardContent>
      </Card>
    </div>
  );
}

declare module 'react' {
    interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
      placeholder_en?: string;
      placeholder_hi?: string;
    }
}
