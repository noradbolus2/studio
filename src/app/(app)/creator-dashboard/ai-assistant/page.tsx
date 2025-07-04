
"use client";
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, TestTube2, Mic, Palette, FileText, Upload, Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const promptCards = [
  { id: "mcq", labelEn: "Generate 20 MCQs on Class 10 Chemistry", labelHi: "कक्षा 10 रसायन विज्ञान पर 20 MCQ बनाएं", icon: TestTube2 },
  { id: "voiceover", labelEn: "Convert PDF notes into Hinglish Voice", labelHi: "पीडीएफ नोट्स को हिंग्लिश आवाज में बदलें", icon: Mic },
  { id: "thumbnail", labelEn: "Create Thumbnail for Chapter 4 Notes", labelHi: "अध्याय 4 नोट्स के लिए थंबनेल बनाएं", icon: Palette },
  { id: "format", labelEn: "Auto-format handwritten notes into clean PDF", labelHi: "हस्तलिखित नोट्स को साफ पीडीएफ में ऑटो-प्रारूपित करें", icon: FileText },
];

export default function AiAssistantPage() {
  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center gap-2">
            <Bot className="h-7 w-7 text-primary" />
            <BilingualText en="AI Creator Studio" hi="एआई क्रिएटर स्टूडियो" />
          </CardTitle>
          <CardDescription>
            <BilingualText en="What would you like help with?" hi="आप किस बारे में मदद चाहेंगे?" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            {promptCards.map(prompt => (
              <Button key={prompt.id} variant="outline" className="h-auto justify-start gap-3 p-3 text-left">
                <prompt.icon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <span className="text-sm"><BilingualText en={prompt.labelEn} hi={prompt.labelHi} /></span>
              </Button>
            ))}
          </div>
          <div className="mt-6 space-y-2">
            <Textarea placeholder="Or write your own prompt..." className="min-h-[80px]" />
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Button variant="ghost" size="sm"><Upload className="mr-2 h-4 w-4"/> Upload File</Button>
                <Button variant="ghost" size="sm"><Mic className="mr-2 h-4 w-4"/> Use Voice</Button>
              </div>
              <Button><Send className="mr-2 h-4 w-4"/> Send</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
