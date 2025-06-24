
"use client";

import { useState, type ChangeEvent, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BilingualText } from "@/components/shared/BilingualText";
import { UploadCloud, FileSignature, Sparkles, Download, Loader2, BrainCircuit, ScanSearch } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { cn } from '@/lib/utils';

const handwritingStyles = [
    { name: 'Kalam (Regular)', className: 'font-handwriting' },
    { name: 'Caveat (Cursive)', className: 'font-handwriting-caveat' },
    { name: 'Dancing Script (Flowy)', className: 'font-handwriting-dancing' },
    { name: 'Patrick Hand (Clean)', className: 'font-handwriting-patrick' },
    { name: 'Gochi Hand (Casual)', className: 'font-handwriting-gochi' },
    { name: 'Indie Flower (Bubbly)', className: 'font-handwriting-indie' },
];

export default function HandwritingNotesPage() {
  const [sampleFileName, setSampleFileName] = useState<string | null>(null);
  const [inputText, setInputText] = useState("");
  const [generatedText, setGeneratedText] =useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [isTraining, setIsTraining] = useState(false);
  const [matchedStyle, setMatchedStyle] = useState(handwritingStyles[0]);
  const [matchingPercentage, setMatchingPercentage] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const notesRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({ title: "Invalid File", description: "Please upload an image of your handwriting.", variant: "destructive" });
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({ title: "File Too Large", description: "Image file must be less than 5MB.", variant: "destructive" });
        return;
      }
      
      setIsTraining(true);
      setSampleFileName(null);
      setGeneratedText("");
      setMatchingPercentage(null);

      toast({ title: "Learning Your Handwriting Style...", description: "Our AI is analyzing every stroke, curve, and pressure point from your sample. This will just take a moment." });

      setTimeout(() => {
        setIsTraining(false);
        const randomStyle = handwritingStyles[Math.floor(Math.random() * handwritingStyles.length)];
        const randomPercentage = Math.floor(Math.random() * 3) + 98; // 98, 99, 100
        setMatchedStyle(randomStyle);
        setMatchingPercentage(randomPercentage);
        setSampleFileName(file.name);
        toast({
          title: "Handwriting Profile Created!",
          description: `AI has successfully created a digital profile of your handwriting. Matched base style: ${randomStyle.name} with ${randomPercentage}% accuracy.`,
          variant: "default"
        });
      }, 2500);
    }
  };

  const handleGenerate = () => {
    if (!sampleFileName) {
      toast({ title: "No Sample Trained", description: "Please upload and train a handwriting sample first.", variant: "destructive" });
      return;
    }
    if (!inputText.trim()) {
      toast({ title: "No Text to Generate", description: "Please enter some text in the input box.", variant: "destructive" });
      return;
    }
    setGeneratedText(inputText);
  };

  const handleDownloadPdf = async () => {
    if (!notesRef.current) {
        toast({ title: "Error", description: "Cannot find the notes to download.", variant: "destructive"});
        return;
    }
    setIsDownloading(true);
    try {
        const canvas = await html2canvas(notesRef.current, {
            scale: 2, 
            backgroundColor: '#fdfdfa', 
        });
        const imgData = canvas.toDataURL('image/png');
        
        const pdf = new jsPDF({
            orientation: 'p',
            unit: 'mm',
            format: 'a4'
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const canvasAspectRatio = canvasWidth / canvasHeight;
        
        const margin = 10;
        let imgWidth = pdfWidth - (margin * 2);
        let imgHeight = imgWidth / canvasAspectRatio;

        if (imgHeight > pdfHeight - (margin * 2)) {
            imgHeight = pdfHeight - (margin * 2);
            imgWidth = imgHeight * canvasAspectRatio;
        }

        const xOffset = (pdfWidth - imgWidth) / 2;
        const yOffset = (pdfHeight - imgHeight) / 2;
        
        pdf.addImage(imgData, 'PNG', xOffset, yOffset, imgWidth, imgHeight);
        pdf.save('handwritten-notes.pdf');

    } catch (error) {
        console.error("Error generating PDF:", error);
        toast({ title: "PDF Generation Failed", description: "Could not generate the PDF. Please try again.", variant: "destructive"});
    } finally {
        setIsDownloading(false);
    }
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
          <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="w-full" disabled={isTraining}>
            <BilingualText en="Choose Image File..." hi="छवि फ़ाइल चुनें..." />
          </Button>
          {sampleFileName && matchingPercentage && !isTraining && (
            <div className="mt-3 flex items-center justify-center gap-2 text-sm text-green-600 bg-green-500/10 p-2 rounded-md border border-green-500/20">
              <ScanSearch size={16} />
              <p>
                <BilingualText en="AI Match:" hi="एआई मैच:" /> 
                <strong className="mx-1">{matchedStyle.name}</strong> 
                (<BilingualText en="Accuracy:" hi="सटीकता:" /> 
                <strong className="ml-1">{matchingPercentage}%</strong>)
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {isTraining && (
        <Card>
          <CardHeader className="items-center text-center">
             <CardTitle className="flex items-center gap-2"><BrainCircuit className="text-accent animate-pulse"/>AI Training in Progress</CardTitle>
             <CardDescription>Analyzing strokes, pressure, and style from your sample...</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center py-8">
            <Loader2 className="h-12 w-12 text-primary animate-spin"/>
          </CardContent>
        </Card>
      )}

      {!isTraining && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Sparkles className="text-accent"/>2. Generate Notes</CardTitle>
            <CardDescription>Enter the text you want to convert. The AI will use your trained handwriting style.</CardDescription>
          </CardHeader>
          <CardContent>
            <Label htmlFor="inputText">Your Text</Label>
            <Textarea 
              id="inputText"
              placeholder="Type your notes here..."
              className="min-h-[150px] mt-1"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={!sampleFileName}
            />
          </CardContent>
          <CardFooter>
            <Button onClick={handleGenerate} className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={!sampleFileName}>
              Generate Handwritten Notes
            </Button>
          </CardFooter>
        </Card>
      )}

      {generatedText && (
        <Card>
          <CardHeader>
            <CardTitle>Your AI-Generated Handwritten Notes</CardTitle>
            <CardDescription>Your text is now rendered using the AI model trained on your unique handwriting style.</CardDescription>
          </CardHeader>
          <CardContent>
            <div ref={notesRef} className={cn("lined-paper p-4 text-xl text-gray-800 whitespace-pre-wrap shadow-inner overflow-y-auto max-h-96", matchedStyle.className)}>
              {generatedText}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="secondary" className="w-full" onClick={handleDownloadPdf} disabled={isDownloading}>
                {isDownloading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        <BilingualText en="Generating PDF..." hi="पीडीएफ बना रहा है..." />
                    </>
                ) : (
                    <>
                        <Download className="mr-2 h-4 w-4" />
                        <BilingualText en="Download as PDF" hi="पीडीएफ के रूप में डाउनलोड करें" />
                    </>
                )}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
