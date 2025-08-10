
"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { BilingualText } from '@/components/shared/BilingualText';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ArrowLeft, Play, Pause, RotateCcw, Volume2, Mic, Bot } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Lesson {
  id: string;
  title: string;
  script: string[];
  slides: string[];
  avatarUrl: string;
  dataAiHint: string;
  voiceLang: 'en-US' | 'hi-IN';
}

const mockLessons: Record<string, Lesson> = {
  "gravity-101": {
    id: "gravity-101",
    title: "Physics - Introduction to Gravity",
    script: [
      "Hello students! Welcome to your first lesson on gravity.",
      "Today, we will learn about the fundamental force that keeps us on the ground and governs the motion of planets.",
      "Gravity is the force by which a planet or other body draws objects toward its center.",
      "The force of gravity keeps all of the planets in orbit around the sun.",
      "Let's look at our first slide to understand Newton's Law of Universal Gravitation.",
      "The law states that every particle attracts every other particle in the universe with a force which is directly proportional to the product of their masses...",
      "...and inversely proportional to the square of the distance between their centers.",
      "That's all for today's introduction. Please review the key points."
    ],
    slides: [
      "https://placehold.co/1280x720.png?text=Gravity",
      "https://placehold.co/1280x720.png?text=Newton's+Law",
      "https://placehold.co/1280x720.png?text=Formula",
      "https://placehold.co/1280x720.png?text=Summary"
    ],
    avatarUrl: "https://images.unsplash.com/photo-1679983412046-3f1ae6e2a24d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxhaSUyMHRlYWNoZXJ8ZW58MHx8fHwxNzUzNTkyMDY0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    dataAiHint: "ai teacher",
    voiceLang: 'en-US'
  },
   "prakash-101": {
    id: "prakash-101",
    title: "विज्ञान - प्रकाश का परिचय",
    script: [
        "नमस्ते छात्रों! प्रकाश पर आपके पहले पाठ में आपका स्वागत है।",
        "आज, हम उस मौलिक अवधारणा के बारे में जानेंगे जो हमें दुनिया को देखने में मदद करती है।",
        "प्रकाश ऊर्जा का एक रूप है, जो हमें वस्तुओं को देखने में सक्षम बनाता है।",
        "यह सीधी रेखाओं में यात्रा करता है और इसकी गति बहुत तेज होती है।",
        "आइए परावर्तन और अपवर्तन को समझने के लिए हमारी पहली स्लाइड देखें।",
        "परावर्तन तब होता है जब प्रकाश किसी सतह से टकराकर वापस लौटता है।",
        "अपवर्तन तब होता है जब प्रकाश एक माध्यम से दूसरे माध्यम में जाने पर मुड़ जाता है।",
        "आज के लिए बस इतना ही। कृपया मुख्य बिंदुओं की समीक्षा करें।"
    ],
    slides: [
        "https://placehold.co/1280x720.png?text=Prakash",
        "https://placehold.co/1280x720.png?text=Paravartan",
        "https://placehold.co/1280x720.png?text=Apvartan",
        "https://placehold.co/1280x720.png?text=Saaransh"
    ],
    avatarUrl: "https://images.unsplash.com/photo-1694039832815-3435b839335a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxmZW1hbGUlMjBhaSUyMHRlYWNoZXJ8ZW58MHx8fHwxNzUzNTkyMDY0fDA&ixlib.rb-4.1.0&q=80&w=1080",
    dataAiHint: "female ai teacher",
    voiceLang: 'hi-IN'
  },
};

export default function AiTeacherLessonPage() {
  const router = useRouter();
  const params = useParams();
  const lessonId = params.lessonId as string;
  const { toast } = useToast();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechRate, setSpeechRate] = useState(1);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const currentSlideIndex = Math.min(Math.floor(currentSentenceIndex / 2), (lesson?.slides.length ?? 1) - 1);

  const speak = useCallback((index: number) => {
    if (!lesson || typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    
    const textToSpeak = lesson.script[index];
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utteranceRef.current = utterance;

    const voices = window.speechSynthesis.getVoices();
    const desiredVoice = voices.find(voice => voice.lang === lesson.voiceLang);
    if (desiredVoice) {
      utterance.voice = desiredVoice;
    }

    utterance.rate = speechRate;
    utterance.onend = () => {
      if (index < lesson.script.length - 1) {
        setCurrentSentenceIndex(index + 1);
      } else {
        setIsPlaying(false);
      }
    };
    utterance.onerror = (e) => {
      console.error("SpeechSynthesis Error:", e);
      toast({title: "Voice Error", description: "Could not play audio.", variant: "destructive"});
      setIsPlaying(false);
    }
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  }, [lesson, speechRate, toast]);

  useEffect(() => {
    if (lessonId) {
      const data = mockLessons[lessonId];
      if (data) {
        setLesson(data);
      }
      setIsLoading(false);
    }
    
    return () => {
       if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [lessonId]);

  useEffect(() => {
    if (isPlaying) {
      speak(currentSentenceIndex);
    }
  }, [currentSentenceIndex, isPlaying, speak]);

  const handlePlayPause = () => {
    if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
    } else {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      } else {
        speak(currentSentenceIndex);
      }
      setIsPlaying(true);
    }
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setCurrentSentenceIndex(0);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><LoadingSpinner /></div>;
  }
  
  if (!lesson) {
    return <div className="text-center p-8">Lesson not found.</div>;
  }
  
  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
      <header className="flex items-center justify-between p-3 border-b bg-card">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft />
        </Button>
        <h1 className="text-lg font-bold text-primary truncate">{lesson.title}</h1>
        <div className="w-10"></div> {/* Spacer */}
      </header>

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 overflow-hidden">
        {/* Left: Avatar & Slides */}
        <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex-grow bg-black rounded-lg relative overflow-hidden">
                <Image src={lesson.slides[currentSlideIndex]} alt={`Slide ${currentSlideIndex + 1}`} layout="fill" objectFit="contain" className="transition-opacity duration-500" />
                <div className="absolute bottom-4 left-4 h-32 w-24 rounded-lg overflow-hidden border-2 border-primary shadow-lg">
                    <Image src={lesson.avatarUrl} alt="AI Teacher" layout="fill" objectFit="cover" data-ai-hint={lesson.dataAiHint} />
                </div>
            </div>
        </div>

        {/* Right: Script & Controls */}
        <div className="lg:col-span-1 flex flex-col bg-card rounded-lg border">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Mic/> Lesson Script</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow overflow-y-auto pr-2">
                <div className="space-y-3 text-sm">
                    {lesson.script.map((sentence, index) => (
                        <p key={index} className={index === currentSentenceIndex && isPlaying ? "text-primary font-bold" : "text-muted-foreground"}>
                            {sentence}
                        </p>
                    ))}
                </div>
            </CardContent>
             <CardFooter className="flex-col gap-4 pt-4 border-t">
                 <div className="w-full space-y-2">
                    <Label htmlFor="speed-control" className="text-xs">Playback Speed: {speechRate.toFixed(1)}x</Label>
                    <Slider id="speed-control" value={[speechRate]} onValueChange={(val) => setSpeechRate(val[0])} min={0.5} max={2} step={0.1} />
                </div>
                <div className="flex items-center justify-center gap-3">
                    <Button variant="ghost" size="icon" onClick={handleStop} className="h-14 w-14">
                        <RotateCcw className="h-7 w-7"/>
                    </Button>
                    <Button size="icon" onClick={handlePlayPause} className="h-20 w-20 rounded-full bg-primary text-primary-foreground shadow-lg">
                        {isPlaying ? <Pause className="h-10 w-10"/> : <Play className="h-10 w-10"/>}
                    </Button>
                     <Button variant="ghost" size="icon" onClick={() => toast({title: "Feature coming soon!"})} className="h-14 w-14">
                        <Bot className="h-7 w-7"/>
                    </Button>
                </div>
             </CardFooter>
        </div>
      </main>
    </div>
  );
}

