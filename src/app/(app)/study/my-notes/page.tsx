
"use client";

import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"; 
import { Edit, PlusCircle, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast"; // Added useToast

interface Note {
  id: string;
  title: string;
  subject: string;
  date: string;
  excerpt: string;
}

const mockNotes: Note[] = [
  { id: "note1", title: "Chapter 5: Light - Key Formulas", subject: "Physics", date: "2024-07-20", excerpt: "Reflection: angle i = angle r. Refraction: Snell's Law n1*sin(i) = n2*sin(r)..." },
  { id: "note2", title: "Dates: Indian Independence Movement", subject: "History", date: "2024-07-18", excerpt: "1857: First War of Independence. 1915: Gandhi returns to India. 1942: Quit India Movement..." },
  { id: "note3", title: "Important Chemical Reactions", subject: "Chemistry", date: "2024-07-15", excerpt: "Combustion: CH4 + 2O2 -> CO2 + 2H2O. Neutralization: HCl + NaOH -> NaCl + H2O..." },
];

export default function MyNotesPage() {
  const [notes, setNotes] = useState<Note[]>(mockNotes);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast(); // Initialized useToast

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteNote = (noteId: string, noteTitle: string) => {
    // In a real app, this would also involve API calls or state management updates
    setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));
    toast({
      title: "Note Deleted (Simulated)",
      description: `"${noteTitle}" has been removed from your notes.`,
      variant: "destructive"
    });
  };

  const handleEditNote = (noteId: string) => {
    // For now, just a toast. Later, navigate to an edit page: router.push(`/study/my-notes/edit/${noteId}`);
    toast({
      title: "Edit Note (Coming Soon)",
      description: `Editing functionality for note ID ${noteId} will be available soon.`,
    });
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
            <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
                <Edit className="h-8 w-8 text-primary" />
                <BilingualText en="My Notes" hi="मेरे नोट्स" />
            </h1>
            <p className="text-muted-foreground">
                <BilingualText en="Organize and access your study notes efficiently." hi="अपने अध्ययन नोट्स को कुशलतापूर्वक व्यवस्थित करें और एक्सेस करें।" />
            </p>
        </div>
        <Button asChild>
            <Link href="/study/my-notes/new">
                <PlusCircle className="mr-2 h-5 w-5" />
                <BilingualText en="Create New Note" hi="नया नोट बनाएं" />
            </Link>
        </Button>
      </header>

      <Card>
        <CardHeader>
            <CardTitle><BilingualText en="All Your Notes" hi="आपके सभी नोट्स" /></CardTitle>
            <CardDescription>
                <BilingualText en="Search, view, or edit your saved notes." hi="अपने सहेजे गए नोट्स खोजें, देखें या संपादित करें।" />
            </CardDescription>
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
                                <Badge variant="outline" className="text-xs">{note.subject}</Badge>
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
                    <BilingualText en="No notes found matching your search or you haven't created any notes yet." hi="आपकी खोज से मेल खाने वाले कोई नोट्स नहीं मिले या आपने अभी तक कोई नोट्स नहीं बनाए हैं।" />
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
