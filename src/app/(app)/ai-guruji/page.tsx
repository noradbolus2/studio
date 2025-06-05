
// Placeholder for AI Guruji Voice Chat UI
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Mic, Send, Volume2 } from "lucide-react";
import Image from "next/image";

export default function AiGurujiPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-10rem)]"> {/* Adjust height as needed */}
      <header className="p-4 border-b text-center">
        <h1 className="text-2xl font-bold font-headline">
          <BilingualText en="AI Guruji" hi="एआई गुरुजी" />
        </h1>
        <p className="text-sm text-muted-foreground">
          <BilingualText en="Your personal AI study assistant" hi="आपका व्यक्तिगत एआई अध्ययन सहायक" />
        </p>
      </header>

      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {/* Chat messages will go here */}
        <div className="flex justify-center my-4">
            <Image src="https://placehold.co/100x100.png" alt="Guru Avatar" width={80} height={80} className="rounded-full data-ai-hint="guru avatar animated" />
        </div>
        <Card className="bg-primary/10 border-primary/20 self-start max-w-xs p-3 rounded-lg">
          <p className="text-sm">
            <BilingualText en="Namaste! How can I help you with your studies today?" hi="नमस्ते! आज मैं आपकी पढ़ाई में कैसे मदद कर सकता हूँ?" />
          </p>
           <Button variant="ghost" size="sm" className="mt-1 text-primary p-0 h-auto">
            <Volume2 className="mr-1 h-4 w-4" />
            <BilingualText en="Listen" hi="सुनें" />
          </Button>
        </Card>
        {/* Example user message */}
        <Card className="bg-muted self-end max-w-xs p-3 rounded-lg ml-auto">
             <p className="text-sm"><BilingualText en="Explain Newton's laws of motion." hi="न्यूटन के गति के नियम समझाएं।" /></p>
        </Card>
      </div>

      <footer className="p-4 border-t bg-background">
        <div className="flex items-center space-x-2">
          <Textarea 
            placeholder_en="Ask Guru Ji anything..." 
            placeholder_hi="गुरु जी से कुछ भी पूछें..." 
            className="flex-grow resize-none min-h-[40px] max-h-[100px]" 
            rows={1}
          />
          <Button size="icon" variant="ghost" className="text-primary hover:bg-primary/10">
            <Mic className="h-6 w-6" />
            <span className="sr-only"><BilingualText en="Use Voice" hi="आवाज का प्रयोग करें"/></span>
          </Button>
          <Button size="icon" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Send className="h-5 w-5" />
            <span className="sr-only"><BilingualText en="Send" hi="भेजें"/></span>
          </Button>
        </div>
      </footer>
    </div>
  );
}
