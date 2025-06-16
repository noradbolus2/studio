
"use client";

import { useState, useEffect, type FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Type, BookOpen, FileText, AlertTriangle } from "lucide-react";
import Link from 'next/link';
import { format } from 'date-fns';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

interface Note {
  id: string;
  title: string;
  subject: string;
  date: string;
  excerpt: string;
  content: string;
}

const LOCAL_STORAGE_NOTES_KEY = "userNotesOSOApp";

export default function EditNotePage() {
  const router = useRouter();
  const { noteId } = useParams<{ noteId: string }>(); // Changed here

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [originalNote, setOriginalNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (noteId) {
      setIsLoading(true);
      try {
        const storedNotesString = localStorage.getItem(LOCAL_STORAGE_NOTES_KEY);
        if (storedNotesString) {
          const existingNotes: Note[] = JSON.parse(storedNotesString);
          const noteToEdit = existingNotes.find(note => note.id === noteId);
          if (noteToEdit) {
            setOriginalNote(noteToEdit);
            setTitle(noteToEdit.title);
            setSubject(noteToEdit.subject);
            setContent(noteToEdit.content);
          } else {
            setError("Note not found.");
          }
        } else {
          setError("No notes found in storage.");
        }
      } catch (e) {
        console.error("Error loading note for editing:", e);
        setError("Could not load the note.");
      }
      setIsLoading(false);
    }
  }, [noteId]);

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

    const currentDate = format(new Date(), 'yyyy-MM-dd'); // Update date on edit
    const updatedNote: Note = {
      ...originalNote!, // Assume originalNote is loaded if we reach here
      id: noteId,
      title: title.trim(),
      subject: subject.trim(),
      date: currentDate,
      content: content.trim(),
      excerpt: content.trim().substring(0, 100) + (content.trim().length > 100 ? "..." : ""),
    };

    try {
      const storedNotesString = localStorage.getItem(LOCAL_STORAGE_NOTES_KEY);
      let existingNotes: Note[] = storedNotesString ? JSON.parse(storedNotesString) : [];
      const noteIndex = existingNotes.findIndex(note => note.id === noteId);

      if (noteIndex > -1) {
        existingNotes[noteIndex] = updatedNote;
        localStorage.setItem(LOCAL_STORAGE_NOTES_KEY, JSON.stringify(existingNotes));
        toast({
          title: "Note Updated",
          description: `Your note "${updatedNote.title}" has been updated successfully.`,
        });
        router.push('/study/my-notes');
      } else {
        toast({
          title: "Error Updating Note",
          description: "Could not find the original note to update.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error saving updated note to localStorage:", error);
      toast({
        title: "Error Saving Note",
        description: "Could not save your changes. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
        <LoadingSpinner size={32} />
        <p className="ml-2 text-muted-foreground">Loading note...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
        <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
        <p className="text-destructive mb-4">{error}</p>
        <Button asChild variant="outline">
          <Link href="/study/my-notes">
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back to My Notes
          </Link>
        </Button>
      </div>
    );
  }

  if (!originalNote) {
     return ( // Should ideally be caught by error state, but as a fallback
      <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
        <p className="text-muted-foreground">Could not load note data.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-headline flex items-center gap-2">
          <FileText className="h-7 w-7 text-primary" />
          <BilingualText en="Edit Note" hi="नोट संपादित करें" />
        </h1>
        <Button variant="outline" size="sm" asChild>
          <Link href="/study/my-notes">
            <ArrowLeft className="mr-2 h-4 w-4" />
            <BilingualText en="Cancel" hi="रद्द करें" />
          </Link>
        </Button>
      </div>

      <Card className="w-full max-w-xl mx-auto">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle><BilingualText en="Modify Your Note" hi="अपना नोट संशोधित करें" /></CardTitle>
            <CardDescription><BilingualText en="Update the details of your study note." hi="अपने अध्ययन नोट का विवरण अपडेट करें।" /></CardDescription>
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
              <BilingualText en="Save Changes" hi="परिवर्तन सहेजें" />
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
