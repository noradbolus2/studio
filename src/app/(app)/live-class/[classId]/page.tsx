
// src/app/(app)/live-class/[classId]/page.tsx
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { Pencil, Eraser, Trash2, Palette, Minus, Plus, VideoOff, MicOff, MessageSquare, BarChart, Send, Users, ArrowLeft, ChevronLeft, ChevronRight, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { BilingualText } from '@/components/shared/BilingualText';
import Whiteboard, { type WhiteboardHandle } from '@/components/live-class/Whiteboard';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { type GeneratePptSlidesOutput } from '@/ai/flows/generate-ppt-slides-flow';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';


const colorPalette = ['#000000', '#EF4444', '#3B82F6', '#22C55E', '#F97316', '#8B5CF6'];

type Slide = GeneratePptSlidesOutput['slides'][0];

export default function LiveClassPage() {
  const { classId } = useParams() as { classId: string };
  const searchParams = useSearchParams();
  const router = useRouter();
  const whiteboardRef = useRef<WhiteboardHandle>(null);
  
  // Whiteboard state
  const [tool, setTool] = React.useState<'pen' | 'eraser'>('pen');
  const [color, setColor] = React.useState('#000000');
  const [lineWidth, setLineWidth] = React.useState(5);

  // Camera state
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  // New state for slide presentation mode
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [deck, setDeck] = useState<GeneratePptSlidesOutput | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isLoadingDeck, setIsLoadingDeck] = useState(true);

  useEffect(() => {
    const deckId = searchParams.get('deckId');
    if (deckId) {
        setIsPresentationMode(true);
        setIsLoadingDeck(true);
        try {
            const storedDeck = localStorage.getItem(deckId);
            if (storedDeck) {
                setDeck(JSON.parse(storedDeck));
            } else {
                toast({ title: "Error", description: "Could not find the slide deck for this class.", variant: "destructive" });
            }
        } catch (error) {
            toast({ title: "Error", description: "Failed to load slide deck.", variant: "destructive" });
        } finally {
            setIsLoadingDeck(false);
        }
    } else {
        setIsPresentationMode(false);
        setIsLoadingDeck(false);
    }
  }, [searchParams, toast]);

  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this feature.',
        });
      }
    };

    getCameraPermission();
  }, [toast]);


  const clearCanvas = () => {
    if (whiteboardRef.current) {
      whiteboardRef.current.clearCanvas();
    }
  };

  const increaseLineWidth = () => setLineWidth(prev => Math.min(prev + 2, 50));
  const decreaseLineWidth = () => setLineWidth(prev => Math.max(prev - 2, 1));

  // Slide navigation handlers
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

  const renderMainContent = () => {
    if (isLoadingDeck) {
        return <div className="flex-grow flex items-center justify-center bg-white rounded-lg shadow-inner border border-border"><LoadingSpinner/> <p className="ml-2">Loading Slides...</p></div>;
    }

    if (isPresentationMode) {
        if (!deck) {
            return <div className="flex-grow flex items-center justify-center bg-white rounded-lg shadow-inner border border-border text-destructive">Failed to load slide deck. Please go back.</div>;
        }
        return (
            <div className="relative flex-grow">
                <div className="w-full h-full bg-muted/50 rounded-lg p-6 flex flex-col justify-center items-center text-center shadow-inner border border-border">
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
                    ) : <p>Slide content not available.</p>}
                </div>
                {/* Slide Controls */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2 p-1.5 bg-card border rounded-lg shadow-md">
                   <Button variant="ghost" size="icon" onClick={handlePrevSlide} disabled={currentSlideIndex === 0} className="h-9 w-9"><ChevronLeft size={20}/></Button>
                   <span className="text-sm font-mono px-2">{currentSlideIndex + 1} / {deck.slides.length}</span>
                   <Button variant="ghost" size="icon" onClick={handleNextSlide} disabled={currentSlideIndex >= deck.slides.length - 1} className="h-9 w-9"><ChevronRight size={20}/></Button>
                </div>
            </div>
        );
    }

    // Fallback to whiteboard
    return (
        <div className="relative flex-grow">
             <Whiteboard ref={whiteboardRef} tool={tool} color={color} lineWidth={lineWidth} />
             {/* Drawing Toolbar */}
             <div className="absolute top-2 left-1/2 -translate-x-1/2 flex items-center gap-2 p-1.5 bg-card border rounded-lg shadow-md">
               <Button variant={tool === 'pen' ? 'secondary' : 'ghost'} size="icon" onClick={() => setTool('pen')} className="h-9 w-9"><Pencil size={18}/></Button>
               <Button variant={tool === 'eraser' ? 'secondary' : 'ghost'} size="icon" onClick={() => setTool('eraser')} className="h-9 w-9"><Eraser size={18}/></Button>
               <Popover>
                    <PopoverTrigger asChild>
                       <Button variant="ghost" size="icon" className="h-9 w-9"><Palette size={18}/></Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-2">
                        <div className="flex gap-1">
                            {colorPalette.map(c => (
                                <button key={c} onClick={() => setColor(c)} style={{backgroundColor: c}} className={cn("h-6 w-6 rounded-full border-2", color === c ? 'border-primary' : 'border-transparent')}/>
                            ))}
                        </div>
                    </PopoverContent>
               </Popover>
               <div className="flex items-center gap-1">
                 <Button variant="ghost" size="icon" onClick={decreaseLineWidth} className="h-8 w-8"><Minus size={16}/></Button>
                 <span className="text-xs font-mono w-4 text-center">{lineWidth}</span>
                 <Button variant="ghost" size="icon" onClick={increaseLineWidth} className="h-8 w-8"><Plus size={16}/></Button>
               </div>
               <Button variant="ghost" size="icon" onClick={clearCanvas} className="h-9 w-9 text-destructive"><Trash2 size={18}/></Button>
             </div>
        </div>
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] bg-muted/30 rounded-lg">
      <header className="flex items-center justify-between p-3 border-b bg-card rounded-t-lg">
        <div className="flex items-center gap-2">
           <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-8 w-8"><ArrowLeft size={18}/></Button>
           <div>
              <h1 className="text-lg font-bold text-primary">{deck ? deck.deckTitle : `Live Class: ${classId}`}</h1>
              {!deck && <p className="text-xs text-muted-foreground">Class ID: {classId}</p>}
           </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8"><Users size={16} className="mr-1.5"/> 25 Students</Button>
          <Button variant="destructive" size="sm" className="h-8"><VideoOff size={16} className="mr-1.5"/> End Class</Button>
        </div>
      </header>

      <div className="flex flex-grow overflow-hidden">
        {/* Main Content: Whiteboard or Slides */}
        <main className="flex-grow flex flex-col p-3">
          {renderMainContent()}
        </main>
        
        {/* Right Sidebar: Video, Chat, and Polls */}
        <aside className="w-80 border-l bg-card flex flex-col">
          <Card className="flex-shrink-0 border-0 border-b rounded-none shadow-none">
            <CardContent className="p-2">
              <div className="aspect-video bg-black rounded-md relative flex items-center justify-center text-white">
                 <video ref={videoRef} className="w-full h-full object-cover rounded-md" autoPlay muted playsInline />
                <div className="absolute bottom-2 left-2 right-2 flex justify-center items-center gap-2">
                  <Button variant="secondary" size="icon" className="h-9 w-9 rounded-full bg-black/50 hover:bg-black/70 border-0">
                    <MicOff size={18} />
                  </Button>
                  <Button variant="destructive" size="icon" className="h-9 w-9 rounded-full">
                    <VideoOff size={18} />
                  </Button>
                </div>
              </div>
               { !hasCameraPermission && (
                  <Alert variant="destructive" className="mt-2">
                      <AlertTitle>Camera Access Required</AlertTitle>
                      <AlertDescription>
                          Please allow camera access to use this feature.
                      </AlertDescription>
                  </Alert>
              )}
            </CardContent>
          </Card>

          <Card className="flex-grow flex flex-col border-0 rounded-none shadow-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-md"><MessageSquare size={18}/> Live Chat</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow p-2 space-y-3 bg-muted/50 overflow-y-auto">
               {/* Chat messages placeholder */}
               <div className="text-xs p-2 bg-card rounded"><span className="font-semibold">Riya:</span> Sir, can you explain that again?</div>
               <div className="text-xs p-2 bg-card rounded"><span className="font-semibold">Amit:</span> Got it! Thanks.</div>
            </CardContent>
            <CardFooter className="p-2 border-t">
              <div className="flex w-full gap-2">
                 <Input placeholder="Type a message..." className="h-9"/>
                 <Button size="icon" className="h-9 w-9 shrink-0"><Send size={16}/></Button>
              </div>
            </CardFooter>
          </Card>
          <Card className="flex-shrink-0 border-0 border-t rounded-none shadow-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-md"><BarChart size={18}/> Live Poll</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-center text-muted-foreground p-4">Polls feature coming soon!</p>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
