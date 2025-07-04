
"use client";

import { useState, useEffect, type ReactNode } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { BilingualText } from '@/components/shared/BilingualText';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ArrowLeft, ChevronLeft, ChevronRight, Video, Mic, Upload, Save, PlayCircle, Bot, ImageIcon, Pencil } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { type GeneratePptSlidesOutput } from '@/ai/flows/generate-ppt-slides-flow';
import Image from 'next/image';

type Slide = GeneratePptSlidesOutput['slides'][0];

export default function SlideDeckPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();

  const deckId = params.deckId as string;

  const [deck, setDeck] = useState<GeneratePptSlidesOutput | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (deckId) {
      setIsLoading(true);
      try {
        const storedDeck = localStorage.getItem(deckId);
        if (storedDeck) {
          setDeck(JSON.parse(storedDeck));
        } else {
          toast({ title: "Error", description: "Could not find the generated slide deck.", variant: "destructive" });
          router.push('/coaching-panel/smart-slide-class');
        }
      } catch (error) {
        toast({ title: "Error", description: "Failed to load slide deck data.", variant: "destructive" });
        console.error("Failed to parse slide deck from localStorage", error);
        router.push('/coaching-panel/smart-slide-class');
      }
      setIsLoading(false);
    }
  }, [deckId, router, toast]);

  const handleNextSlide = () => {
    if (deck && currentSlideIndex < deck.slides.length - 1) {
      setCurrentSlideIndex(prev => prev + 1);
    }
  };

  const handlePrevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1);
    }
  };
  
  const currentSlide: Slide | undefined = deck?.slides[currentSlideIndex];

  if (isLoading || !deck) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
        <LoadingSpinner size={48} />
        <p className="mt-4 text-muted-foreground">Loading Slide Deck...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex-grow min-w-0">
          <h1 className="text-2xl font-bold font-headline text-primary truncate">{deck.deckTitle}</h1>
          <p className="text-muted-foreground">
            <BilingualText en={`Slide ${currentSlideIndex + 1} of ${deck.slides.length}`} hi={`स्लाइड ${currentSlideIndex + 1} / ${deck.slides.length}`} />
          </p>
        </div>
        <div className="flex-shrink-0 flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => router.push('/coaching-panel/smart-slide-class')}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Decks
            </Button>
             <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                <PlayCircle className="mr-2 h-4 w-4"/> Go Live
            </Button>
        </div>
      </div>

      <Card className="w-full shadow-lg">
        <CardContent className="p-2 aspect-video flex flex-col md:flex-row gap-2">
            {/* Main Slide View */}
            <div className="flex-grow bg-muted/50 rounded-md p-6 flex flex-col justify-center items-center text-center">
                {currentSlide ? (
                    <div className="animate-fade-in">
                        <h2 className="text-3xl font-bold font-headline text-primary mb-6">{currentSlide.title}</h2>
                        <ul className="space-y-3 text-lg text-foreground/80 list-none">
                            {currentSlide.points.map((point, index) => (
                                <li key={index}>{point}</li>
                            ))}
                        </ul>
                         {currentSlide.diagramSuggestion && (
                            <div className="mt-8 p-3 bg-accent/10 border-l-4 border-accent rounded-md text-sm text-left">
                                <p className="font-bold flex items-center gap-2 text-accent"><Bot size={16}/> AI Diagram Suggestion:</p>
                                <p className="italic">"{currentSlide.diagramSuggestion}"</p>
                            </div>
                        )}
                    </div>
                ) : <p>No slide content.</p> }
            </div>

            {/* Teacher Camera & Editor Tools */}
            <div className="w-full md:w-56 flex-shrink-0 flex flex-col gap-2">
                <div className="aspect-video bg-black rounded-md text-white flex items-center justify-center">
                     <Image src="https://placehold.co/300x168.png" width={300} height={168} alt="Teacher Camera Placeholder" data-ai-hint="teacher camera" className="opacity-50"/>
                </div>
                <div className="space-y-1">
                    <Button variant="outline" size="sm" className="w-full justify-start gap-2"><Pencil size={14}/> Edit Slide Content</Button>
                    <Button variant="outline" size="sm" className="w-full justify-start gap-2"><ImageIcon size={14}/> Add Image/Diagram</Button>
                </div>
            </div>
        </CardContent>
         <CardFooter className="p-3 border-t flex justify-between items-center">
            <div className="flex items-center gap-2">
                <Button variant="outline" size="sm"><Mic className="mr-2 h-4 w-4"/> Mute</Button>
                <Button variant="outline" size="sm"><Video className="mr-2 h-4 w-4"/> Stop Video</Button>
            </div>
             <div className="flex items-center gap-2">
                <Button variant="secondary" onClick={handlePrevSlide} disabled={currentSlideIndex === 0}>
                    <ChevronLeft className="h-4 w-4 mr-1"/> Prev
                </Button>
                 <Button variant="secondary" onClick={handleNextSlide} disabled={currentSlideIndex >= deck.slides.length - 1}>
                    Next <ChevronRight className="h-4 w-4 ml-1"/>
                </Button>
            </div>
             <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => toast({title: "Feature coming soon!", description: "This will save the deck as a PDF."})}><Save className="mr-2 h-4 w-4"/> Save as PDF</Button>
            </div>
        </CardFooter>
      </Card>

    </div>
  );
}
