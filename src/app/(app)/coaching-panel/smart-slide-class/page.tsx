
"use client";

import { useState, type FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ArrowLeft, Upload, Bot, FileText, PlaySquare, Edit, Eye, Trash2 } from "lucide-react";
import Link from 'next/link';
import { generatePptSlides, type GeneratePptSlidesInput, type GeneratePptSlidesOutput } from '@/ai/flows/generate-ppt-slides-flow';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type SlideDeck = GeneratePptSlidesOutput & { id: string };

export default function SmartSlideClassPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [topic, setTopic] = useState('');
  const [rawText, setRawText] = useState('');
  const [studentLevel, setStudentLevel] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [savedDecks, setSavedDecks] = useState<SlideDeck[]>([]);

  useEffect(() => {
    // Load saved decks from localStorage on component mount
    const decks: SlideDeck[] = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('slideDeck_')) {
            const item = localStorage.getItem(key);
            if (item) {
                try {
                    const deckData = JSON.parse(item);
                    decks.push({ id: key, ...deckData });
                } catch (e) {
                    console.error(`Failed to parse deck ${key}:`, e);
                }
            }
        }
    }
    setSavedDecks(decks.sort((a,b) => parseInt(b.id.split('_')[1]) - parseInt(a.id.split('_')[1])));
  }, []);

  const handleGenerate = async (e: FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || !rawText.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide a topic and some notes to generate slides.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);

    try {
      const input: GeneratePptSlidesInput = { topic, rawText, studentLevel };
      const result = await generatePptSlides(input);
      
      const newDeckId = `slideDeck_${Date.now()}`;
      localStorage.setItem(newDeckId, JSON.stringify(result));

      toast({
        title: "Slides Generated!",
        description: `Your deck "${result.deckTitle}" is ready. Redirecting...`,
      });
      router.push(`/coaching-panel/slide-deck/${newDeckId}`);

    } catch (error: any) {
      toast({
        title: "AI Generation Failed",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteDeck = (deckId: string) => {
    localStorage.removeItem(deckId);
    setSavedDecks(prev => prev.filter(d => d.id !== deckId));
    toast({
        title: "Deck Deleted",
        description: "The slide deck has been removed.",
        variant: "destructive"
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-headline flex items-center gap-2">
          <PlaySquare className="h-7 w-7 text-primary" />
          <BilingualText en="Smart Slide Class™" hi="स्मार्ट स्लाइड क्लास™" />
        </h1>
        <Button variant="outline" onClick={() => router.push('/coaching-panel')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          <BilingualText en="Back to Dashboard" hi="डैशबोर्ड पर वापस" />
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Bot className="text-primary"/> Generate PPT from Text</CardTitle>
                <CardDescription>Paste your notes and let AI create the slides for you.</CardDescription>
            </CardHeader>
            <form onSubmit={handleGenerate}>
                <CardContent className="space-y-4">
                     <div>
                        <Label htmlFor="topic">Topic / Chapter Title*</Label>
                        <Input id="topic" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., Newton's Laws of Motion" required />
                    </div>
                     <div>
                        <Label htmlFor="studentLevel">Target Audience (Optional)</Label>
                        <Input id="studentLevel" value={studentLevel} onChange={(e) => setStudentLevel(e.target.value)} placeholder="e.g., Class 9, NEET Aspirants" />
                    </div>
                    <div>
                        <Label htmlFor="rawText">Paste Your Notes Here*</Label>
                        <Textarea 
                            id="rawText"
                            value={rawText}
                            onChange={(e) => setRawText(e.target.value)}
                            placeholder="Paste your chapter content, bullet points, or any raw text..."
                            className="min-h-[150px] font-mono text-xs"
                            required
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={isLoading} className="w-full">
                        {isLoading ? <LoadingSpinner/> : <Bot className="mr-2 h-4 w-4"/>}
                        Generate Slides
                    </Button>
                </CardFooter>
            </form>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Upload className="text-primary"/> Upload Your Own PPT</CardTitle>
                <CardDescription>Already have a presentation? Upload it here.</CardDescription>
            </CardHeader>
            <CardContent>
                 <Button variant="outline" className="w-full h-32 border-dashed border-2 flex-col gap-2" onClick={() => toast({title: "Feature coming soon!"})}>
                    <Upload className="h-8 w-8 text-muted-foreground"/>
                    <span className="text-muted-foreground">Click to upload .ppt or .pdf</span>
                </Button>
            </CardContent>
        </Card>
      </div>
      
       <Card>
        <CardHeader>
          <CardTitle><BilingualText en="My Slide Decks" hi="मेरे स्लाइड डेक" /></CardTitle>
          <CardDescription><BilingualText en="Manage your saved presentations." hi="अपनी सहेजी गई प्रस्तुतियों का प्रबंधन करें।" /></CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
            {savedDecks.length > 0 ? savedDecks.map(deck => (
                <Card key={deck.id} className="p-3 flex justify-between items-center bg-muted/50">
                    <div>
                        <h4 className="font-semibold">{deck.deckTitle}</h4>
                        <p className="text-xs text-muted-foreground">{deck.slides.length} slides</p>
                    </div>
                    <div className="flex gap-1">
                        <Button variant="ghost" size="icon" asChild><Link href={`/coaching-panel/slide-deck/${deck.id}`}><Eye className="h-4 w-4"/></Link></Button>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDeleteDeck(deck.id)}><Trash2 className="h-4 w-4"/></Button>
                    </div>
                </Card>
            )) : (
                <p className="text-center text-muted-foreground py-4">You haven't generated any slide decks yet.</p>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
