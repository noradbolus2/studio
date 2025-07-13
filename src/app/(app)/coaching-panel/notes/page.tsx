
"use client";

import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"; 
import { Edit, PlusCircle, Search, Trash2, ArrowLeft, FileText } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation"; 
import { useState, useEffect } from "react";
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
  classId?: string;
}

const LOCAL_STORAGE_NOTES_KEY = "userNotesOSOApp";

export default function MyNotesPage() {
  const [allNotes, setAllNotes] = useState<Note[]>([]);
  const [teacherNotes, setTeacherNotes] = useState<Note[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [profileData, setProfileData] = useState<ProfileFormData | null>(null);
  const { toast } = useToast();
  const router = useRouter(); 

  useEffect(() => {
    let teacherEmail: string | null = null;
    if (typeof window !== "undefined") {
      const storedProfile = localStorage.getItem('userProfileData');
      if (storedProfile) {
        try {
          const parsedProfile = JSON.parse(storedProfile) as ProfileFormData;
          setProfileData(parsedProfile);
          teacherEmail = parsedProfile.email;
        } catch (err) {
          console.warn("Could not parse profile data:", err);
        }
      }

      const storedNotesString = localStorage.getItem(LOCAL_STORAGE_NOTES_KEY);
      if (storedNotesString) {
        try {
          const storedNotes = JSON.parse(storedNotesString) as Note[];
          setAllNotes(storedNotes);
          if (teacherEmail) {
            setTeacherNotes(storedNotes.filter(note => note.teacherId === teacherEmail));
          } else {
            setTeacherNotes([]);
          }
        } catch (error) {
          console.error("Error parsing notes from localStorage:", error);
          setTeacherNotes([]);
        }
      }
    }
  }, []);

  const filteredNotes = teacherNotes.filter(note => 
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteNote = (noteId: string, noteTitle: string) => {
    // Delete from all notes, then update both states
    const updatedAllNotes = allNotes.filter(note => note.id !== noteId);
    setAllNotes(updatedAllNotes);
    
    const updatedTeacherNotes = teacherNotes.filter(note => note.id !== noteId);
    setTeacherNotes(updatedTeacherNotes);
    
    localStorage.setItem(LOCAL_STORAGE_NOTES_KEY, JSON.stringify(updatedAllNotes));
    toast({
      title: "Note Deleted",
      description: `"${noteTitle}" has been removed.`,
      variant: "destructive"
    });
  };

  const handleEditNote = (noteId: string) => {
    // Navigate to the shared edit page
    router.push(`/study/my-notes/edit/${noteId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <header className="space-y-1">
          <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
            <FileText className="h-8 w-8 text-primary" />
            <BilingualText en="My Notes & Content" hi="मेरे नोट्स और सामग्री" />
          </h1>
          <p className="text-muted-foreground">
            <BilingualText en="Manage all the notes and study materials you have created." hi="आपके द्वारा बनाए गए सभी नोट्स और अध्ययन सामग्री का प्रबंधन करें।" />
          </p>
        </header>
        <Button variant="outline" onClick={() => router.push('/coaching-panel')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            <BilingualText en="Back to Dashboard" hi="डैशबोर्ड पर वापस"/>
        </Button>
      </div>

      <Card>
        <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle><BilingualText en="Your Uploaded Notes" hi="आपके अपलोड किए गए नोट्स" /></CardTitle>
                <CardDescription>
                    <BilingualText en="Search, view, or edit your saved notes." hi="अपने सहेजे गए नोट्स खोजें, देखें या संपादित करें।" />
                </CardDescription>
              </div>
              <Button asChild size="sm">
                <Link href="/study/my-notes/new">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    <BilingualText en="Create New Note" hi="नया नोट बनाएं" />
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

            {filteredNotes.length > 0 ? (
                <div className="space-y-3">
                {filteredNotes.map(note => (
                    <Card key={note.id} className="bg-muted/50 hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-md font-semibold">{note.title}</CardTitle>
                                {note.subject && <Badge variant="outline" className="text-xs">{note.subject}</Badge>}
                            </div>
                            <CardDescription className="text-xs">Last updated: {note.date}</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-3">
                            <p className="text-sm text-muted-foreground line-clamp-2">{note.excerpt}</p>
                        </CardContent>
                        <CardFooter className="flex gap-2 justify-end text-xs pt-2 border-t">
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
                        </CardFooter>
                    </Card>
                ))}
                </div>
            ) : (
                <p className="text-muted-foreground text-center py-6">
                    <BilingualText en="You haven't created any notes yet." hi="आपने अभी तक कोई नोट्स नहीं बनाए हैं।" />
                </p>
            )}
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
