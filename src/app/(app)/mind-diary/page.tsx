
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Smile, Meh, Frown, Laugh, Angry, Rocket, Lightbulb } from 'lucide-react'; // Added more icons
import { BilingualText } from "@/components/shared/BilingualText";
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';

interface MoodEntry {
  mood: string;
  note: string;
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
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!selectedMood) {
      toast({ title: "Select a Mood", description: "Please select how you're feeling.", variant: "destructive" });
      return;
    }
    if (!motivationNote.trim()) {
      toast({ title: "Write a Note", description: "Please write a short motivational note.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    const entry: MoodEntry = { mood: selectedMood, note: motivationNote };
    console.log("Submitting Mind Diary Entry:", entry);

    // --- Placeholder for Firestore Save ---
    // try {
    //   // Example: await db.collection('mindDiaryEntries').add({ ...entry, userId: 'currentUser', timestamp: new Date() });
    //   toast({
    //     title: "Entry Saved!",
    //     description: "Your mind diary entry has been recorded.",
    //   });
    //   setSelectedMood(null);
    //   setMotivationNote('');
    // } catch (error) {
    //   console.error("Error saving mind diary entry:", error);
    //   toast({
    //     title: "Error",
    //     description: "Could not save your entry. Please try again.",
    //     variant: "destructive",
    //   });
    // } finally {
    //   setIsLoading(false);
    // }
    // --- End Placeholder ---
    
    // Simulating save
    await new Promise(resolve => setTimeout(resolve, 1000));
     toast({
      title: "Entry Saved (Simulated)",
      description: "Your mind diary entry has been recorded (Simulated). Connect Firestore to save.",
    });
    setSelectedMood(null);
    setMotivationNote('');
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <header className="text-center">
        <h1 className="text-3xl font-bold font-headline text-primary flex items-center justify-center gap-2">
          <Lightbulb className="h-8 w-8" />
          <BilingualText en="Mind Diary" hi="माइंड डायरी" />
        </h1>
        <p className="text-muted-foreground">
          <BilingualText en="Reflect on your day and set a positive tone." hi="अपने दिन पर चिंतन करें और सकारात्मक माहौल बनाएं।" />
        </p>
      </header>

      <Card className="w-full max-w-lg mx-auto shadow-lg">
        <CardHeader>
          <CardTitle><BilingualText en="How are you feeling?" hi="आप कैसा महसूस कर रहे हैं?" /></CardTitle>
          <CardDescription><BilingualText en="Select an emoji that best describes your current mood." hi="एक इमोजी चुनें जो आपकी वर्तमान मनोदशा का सबसे अच्छा वर्णन करता हो।" /></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-around items-center p-3 bg-muted rounded-lg">
            {moodOptions.map(mood => (
              <Button
                key={mood.name}
                variant="ghost"
                size="icon"
                className={cn(
                  "h-16 w-16 rounded-full flex flex-col items-center justify-center",
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
            <Label htmlFor="motivationNote" className="font-semibold">
              <BilingualText en="One-Line Motivational Note" hi="एक-पंक्ति प्रेरक नोट" />
            </Label>
            <Textarea
              id="motivationNote"
              value={motivationNote}
              onChange={(e) => setMotivationNote(e.target.value)}
              placeholder_en="e.g., I will achieve my goals today!"
              placeholder_hi="जैसे, आज मैं अपने लक्ष्य प्राप्त करूँगा!"
              className="mt-1 min-h-[60px]"
              maxLength={100}
            />
            <p className="text-xs text-muted-foreground mt-1 text-right">{motivationNote.length}/100</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
            <Rocket className="mr-2 h-5 w-5" />
            {isLoading ? <BilingualText en="Saving..." hi="सहेज रहा है..." /> : <BilingualText en="Save Entry" hi="प्रविष्टि सहेजें" />}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
