
"use client";

import { useState, type FormEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Smile, Meh, Frown, Laugh, Angry, Rocket, Lightbulb, Sparkles, Brain, ArrowLeft } from 'lucide-react'; // Added more icons
import { BilingualText } from "@/components/shared/BilingualText";
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';
import { getMindDiaryReflection, type MindDiaryReflectionInput, type MindDiaryReflectionOutput } from '@/ai/flows/mind-diary-reflection-flow';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Label } from "@/components/ui/label";
import { useRouter } from 'next/navigation';


interface MoodEntry {
  mood: string;
  note: string;
}

interface AiReflection {
  motivationalLine: string;
  actionableTip: string;
}

const moodOptions = [
  { name: 'Joyful', icon: Laugh, color: 'text-green-500', bgColor: 'hover:bg-green-500/10' },
  { name: 'Happy', icon: Smile, color: 'text-yellow-500', bgColor: 'hover:bg-yellow-500/10' },
  { name: 'Okay', icon: Meh, color: 'text-blue-500', bgColor: 'hover:bg-blue-500/10' },
  { name: 'Sad', icon: Frown, color: 'text-purple-500', bgColor: 'hover:bg-purple-500/10' },
  { name: 'Angry', icon: Angry, color: 'text-red-500', bgColor: 'hover:bg-red-500/10' },
];

export default function MindDiaryPage() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [motivationNote, setMotivationNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiReflection, setAiReflection] = useState<AiReflection | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedMood) {
      toast({ title: "Select a Mood", description: "Please select how you're feeling.", variant: "destructive" });
      return;
    }
    if (!motivationNote.trim()) {
      toast({ title: "Write a Note", description: "Please write a short motivational note.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    setIsAiLoading(true);
    setAiReflection(null); // Clear previous reflection
    const entry: MoodEntry = { mood: selectedMood, note: motivationNote };
    console.log("Submitting Mind Diary Entry:", entry);

    // Simulate saving entry (replace with actual Firestore save later)
    await new Promise(resolve => setTimeout(resolve, 500));
     toast({
      title: "Entry Logged (Simulated)",
      description: "Your mind diary entry has been noted. Getting some AI wisdom...",
    });
    setIsLoading(false); // Stop main loading, AI loading continues

    try {
      const reflectionInput: MindDiaryReflectionInput = { mood: selectedMood, studentNote: motivationNote };
      const reflectionOutput = await getMindDiaryReflection(reflectionInput);
      setAiReflection({
        motivationalLine: reflectionOutput.motivationalLine,
        actionableTip: reflectionOutput.actionableTip,
      });
      // Reset form for next entry
      // setSelectedMood(null); 
      // setMotivationNote('');
    } catch (error) {
      console.error("Error getting AI reflection:", error);
      toast({
        title: "AI Reflection Error",
        description: "Could not get AI wisdom at this time. Your entry is saved though!",
        variant: "destructive",
      });
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <header>
          <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
            <Lightbulb className="h-8 w-8" />
            <BilingualText en="Mind Diary" hi="माइंड डायरी" />
          </h1>
          <p className="text-muted-foreground">
            <BilingualText en="Reflect on your day and set a positive tone." hi="अपने दिन पर चिंतन करें और सकारात्मक माहौल बनाएं।" />
          </p>
        </header>
        <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            <BilingualText en="Back" hi="वापस"/>
        </Button>
      </div>

      <Card className="w-full max-w-lg mx-auto shadow-lg">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle><BilingualText en="How are you feeling?" hi="आप कैसा महसूस कर रहे हैं?" /></CardTitle>
            <CardDescription><BilingualText en="Select an emoji that best describes your current mood." hi="एक इमोजी चुनें जो आपकी वर्तमान मनोदशा का सबसे अच्छा वर्णन करता हो।" /></CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-around items-center p-3 bg-muted/30 rounded-lg">
              {moodOptions.map(mood => (
                <Button
                  key={mood.name}
                  type="button"
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-16 w-16 rounded-full flex flex-col items-center justify-center transition-all transform hover:scale-110",
                    mood.color,
                    mood.bgColor,
                    selectedMood === mood.name ? `ring-2 ring-offset-2 ${mood.color.replace('text-','ring-')}` : ''
                  )}
                  onClick={() => setSelectedMood(mood.name)}
                  aria-label={mood.name}
                >
                  <mood.icon size={32} />
                  <span className="text-xs mt-1"><BilingualText en={mood.name} hi={mood.name}/></span>
                </Button>
              ))}
            </div>

            <div>
              <Label htmlFor="motivationNote" className="font-semibold flex items-center gap-1.5">
                <Sparkles size={16} className="text-accent"/>
                <BilingualText en="One-Line Reflection / Motivation" hi="एक-पंक्ति चिंतन / प्रेरणा" />
              </Label>
              <Textarea
                id="motivationNote"
                value={motivationNote}
                onChange={(e) => setMotivationNote(e.target.value)}
                placeholder_en="e.g., Feeling good about today's progress!"
                placeholder_hi="जैसे, आज की प्रगति से अच्छा महसूस हो रहा है!"
                className="mt-1 min-h-[60px]"
                maxLength={150}
              />
              <p className="text-xs text-muted-foreground mt-1 text-right">{motivationNote.length}/150</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading || isAiLoading}>
              <Rocket className="mr-2 h-5 w-5" />
              {isLoading ? <BilingualText en="Logging..." hi="लॉग कर रहा है..." /> : 
               isAiLoading ? <BilingualText en="Getting Wisdom..." hi="ज्ञान प्राप्त हो रहा है..." /> : 
               <BilingualText en="Log Entry & Get AI Tip" hi="प्रविष्टि लॉग करें और AI टिप पाएं" />}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {isAiLoading && (
        <div className="flex flex-col items-center justify-center py-6">
          <LoadingSpinner size={32} />
          <p className="mt-2 text-muted-foreground">AI Guruji is preparing your personalized tip...</p>
        </div>
      )}

      {aiReflection && !isAiLoading && (
        <Card className="w-full max-w-lg mx-auto shadow-md bg-accent/10 border-accent/50">
          <CardHeader>
            <CardTitle className="text-lg font-headline text-accent flex items-center gap-2">
                <Brain size={22}/> Guruji's Wisdom For You (Hinglish)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
                <h4 className="font-semibold text-sm text-accent-foreground/90">Motivational Line:</h4>
                <p className="italic">"{aiReflection.motivationalLine}"</p>
            </div>
            <div>
                <h4 className="font-semibold text-sm text-accent-foreground/90">Actionable Tip:</h4>
                <p>{aiReflection.actionableTip}</p>
            </div>
          </CardContent>
           <CardFooter>
             <Button variant="outline" className="w-full" onClick={() => {setSelectedMood(null); setMotivationNote(''); setAiReflection(null);}}>
                <BilingualText en="Make New Entry" hi="नई प्रविष्टि करें"/>
             </Button>
           </CardFooter>
        </Card>
      )}
    </div>
  );
}

declare module 'react' {
    interface TextareaHTMLAttributes<T> extends HTMLAttributes<T> {
      placeholder_en?: string;
      placeholder_hi?: string;
    }
}
