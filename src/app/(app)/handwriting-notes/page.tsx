
"use client";

import { useState, type ChangeEvent, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BilingualText } from "@/components/shared/BilingualText";
import { UploadCloud, FileSignature, Sparkles, CheckCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';

export default function HandwritingNotesPage() {
  const [sampleFileName, setSampleFileName] = useState<string | null>(null);
  const [inputText, setInputText] = useState("");
  const [generatedText, setGeneratedText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({ title: "Invalid File", description: "Please upload an image of your handwriting.", variant: "destructive" });
        return;
      }
      setSampleFileName(file.name);
      toast({
        title: "Sample Uploaded (Simulated)",
        description: `${file.name} is ready. Now enter your text below.`,
        variant: "default"
      });
    }
  };

  const handleGenerate = () => {
    if (!sampleFileName) {
      toast({ title: "No Sample", description: "Please upload a handwriting sample first.", variant: "destructive" });
      return;
    }
    if (!inputText.trim()) {
      toast({ title: "No Text", description: "Please enter some text to generate.", variant: "destructive" });
      return;
    }
    setGeneratedText(inputText);
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
          <FileSignature className="h-8 w-8 text-primary" />
          <BilingualText en="Handwriting Notes" hi="हस्तलिखित नोट्स" />
        </h1>
        <p className="text-muted-foreground">
          <BilingualText en="Turn your typed text into your own handwriting." hi="अपने टाइप किए गए टेक्स्ट को अपनी लिखावट में बदलें।" />
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><UploadCloud className="text-accent" />1. Upload Sample</CardTitle>
          <CardDescription>Upload a clear photo of one page of your handwriting on a plain white background.</CardDescription>
        </CardHeader>
        <CardContent>
          <Input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden" 
          />
          <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="w-full">
            <BilingualText en="Choose Image File..." hi="छवि फ़ाइल चुनें..." />
          </Button>
          {sampleFileName && (
            <div className="mt-3 flex items-center justify-center gap-2 text-sm text-green-600">
              <CheckCircle size={16} />
              <p>Uploaded: <strong>{sampleFileName}</strong></p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Sparkles className="text-accent"/>2. Generate Notes</CardTitle>
          <CardDescription>Enter the text you want to convert into your handwriting.</CardDescription>
        </CardHeader>
        <CardContent>
          <Label htmlFor="inputText">Your Text</Label>
          <Textarea 
            id="inputText"
            placeholder="Type your notes here..."
            className="min-h-[150px] mt-1"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
        </CardContent>
        <CardFooter>
          <Button onClick={handleGenerate} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
            Generate Handwritten Notes
          </Button>
        </CardFooter>
      </Card>

      {generatedText && (
        <Card>
          <CardHeader>
            <CardTitle>Your Handwritten Notes (Prototype)</CardTitle>
            <CardDescription>This is a simulation using a pre-selected font. The final version will use your handwriting style.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 border rounded-md bg-white text-black font-handwriting text-xl leading-relaxed whitespace-pre-wrap">
              {generatedText}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="secondary" className="w-full">Download as PDF (Coming Soon)</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
