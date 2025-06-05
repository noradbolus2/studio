import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Smile, Meh, Frown, Laugh, HeartPulse, Music2 } from "lucide-react";
import { BilingualText } from "./BilingualText";

const moodEmojis = [
  { icon: Laugh, labelEn: "Joyful", labelHi: "आनंदित", color: "text-green-500" },
  { icon: Smile, labelEn: "Happy", labelHi: "खुश", color: "text-yellow-500" },
  { icon: Meh, labelEn: "Okay", labelHi: "ठीक", color: "text-blue-500" },
  { icon: Frown, labelEn: "Sad", labelHi: "दुखी", color: "text-purple-500" },
];

export function MindDiaryCard() {
  // In a real app, this would come from a service or state
  const dailyQuote = {
    en: "Believe you can and you're halfway there.",
    hi: "विश्वास करो कि तुम कर सकते हो और तुम आधे रास्ते पर हो।",
    audioSrc: "#" // Placeholder for audio file
  };

  return (
    <Card className="w-full shadow-lg_override">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <HeartPulse className="h-7 w-7 text-primary" />
          <BilingualText en="OSO Mind Diary™" hi="OSO माइंड डायरी™" />
        </CardTitle>
        <CardDescription>
          <BilingualText en="Your space for emotional well-being and reflection." hi="आपकी भावनात्मक भलाई और चिंतन के लिए आपका स्थान।" />
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <p className="mb-2 font-medium"><BilingualText en="How are you feeling today?" hi="आज आप कैसा महसूस कर रहे हैं?" /></p>
          <div className="flex justify-around p-2 bg-muted rounded-lg">
            {moodEmojis.map((mood) => (
              <Button key={mood.labelEn} variant="ghost" size="icon" className={`h-12 w-12 ${mood.color} hover:bg-primary/10`} aria-label={mood.labelEn}>
                <mood.icon size={28} />
              </Button>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="reflection"><BilingualText en="Self-Reflection Space" hi="आत्म-चिंतन स्थान" /></Label>
          <Textarea id="reflection" placeholder_en="Write your thoughts here..." placeholder_hi="अपने विचार यहाँ लिखें..." className="mt-1 min-h-[80px]" />
          <Button variant="outline" size="sm" className="mt-2">
            <BilingualText en="Save Entry" hi="प्रविष्टि सहेजें" />
          </Button>
        </div>

        <div className="p-4 bg-accent/20 rounded-lg">
          <h4 className="font-semibold mb-2"><BilingualText en="Daily Motivation" hi="दैनिक प्रेरणा" /></h4>
          <blockquote className="italic text-sm text-accent-foreground/80">
            <BilingualText en={`"${dailyQuote.en}"`} hi={`"${dailyQuote.hi}"`} className="block"/>
          </blockquote>
          <Button variant="link" size="sm" className="p-0 h-auto mt-2 text-accent-foreground hover:text-primary">
            <Music2 size={16} className="mr-1" />
            <BilingualText en="Listen to audio" hi="ऑडियो सुनें" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Add placeholder to Textarea component for bilingual support
declare module 'react' {
    interface TextareaHTMLAttributes<T> extends HTMLAttributes<T> {
      placeholder_en?: string;
      placeholder_hi?: string;
    }
  }
