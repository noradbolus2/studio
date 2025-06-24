"use client";

import { useState, type ChangeEvent, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BilingualText } from "@/components/shared/BilingualText";
import { UploadCloud, FileSignature, Sparkles, CheckCircle, Download, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function HandwritingNotesPage() {
  const [sampleFileName, setSampleFileName] = useState<string | null>(null);
  const [inputText, setInputText] = useState("");
  const [generatedText, setGeneratedText] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const notesRef = useRef<HTMLDivElement>(null); // Ref for the notes container
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

  const handleDownloadPdf = async () => {
    if (!notesRef.current) {
        toast({ title: "Error", description: "Cannot find the notes to download.", variant: "destructive"});
        return;
    }
    setIsDownloading(true);
    try {
        const canvas = await html2canvas(notesRef.current, {
            scale: 2, // Improve resolution
            backgroundColor: '#ffffff', // Ensure background is white
        });
        const imgData = canvas.toDataURL('image/png');
        
        // A4 page dimensions in mm: 210 x 297
        const pdf = new jsPDF({
            orientation: 'p', // portrait
            unit: 'mm',
            format: 'a4'
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const canvasAspectRatio = canvasWidth / canvasHeight;

        // Maintain aspect ratio within PDF page, with small margin
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
            <div ref={notesRef} className="p-4 border rounded-md bg-white text-black font-handwriting text-xl leading-relaxed whitespace-pre-wrap">
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
