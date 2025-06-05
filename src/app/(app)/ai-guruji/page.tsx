
"use client";

import { useState, useRef, useEffect, type FormEvent } from 'react';
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mic, Send, Volume2, Loader2 } from "lucide-react";
import Image from "next/image";
import { askAiGuruji, type AiGurujiInput, type AiGurujiOutput } from '@/ai/flows/ai-guruji-flow';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'guru';
  textEn: string;
  textHi?: string; // Optional for user, will be present for Guru
  timestamp: Date;
}

export default function AiGurujiPage() {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const initialGuruMessage: Message = {
    id: 'guru-initial',
    role: 'guru',
    textEn: "Namaste! How can I help you with your studies today?",
    textHi: "नमस्ते! आज मैं आपकी पढ़ाई में कैसे मदद कर सकता हूँ?",
    timestamp: new Date(),
  };

  useEffect(() => {
    setMessages([initialGuruMessage]);
  }, []);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      textEn: inputValue,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const gurujiInput: AiGurujiInput = { userInput: userMessage.textEn };
      const response = await askAiGuruji(gurujiInput);
      
      const guruResponse: Message = {
        id: `guru-${Date.now()}`,
        role: 'guru',
        textEn: response.responseTextEn,
        textHi: response.responseTextHi,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, guruResponse]);

    } catch (error) {
      console.error("Error calling AI Guruji:", error);
      const errorResponse: Message = {
        id: `guru-error-${Date.now()}`,
        role: 'guru',
        textEn: "I'm sorry, I encountered a little hiccup. Could you please try asking again?",
        textHi: "क्षमा करें, मुझे थोड़ी सी परेशानी हुई। क्या आप कृपया दोबारा पूछ सकते हैं?",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-4rem)] max-h-[700px] bg-background rounded-lg shadow-xl border"> {/* Adjust height as needed */}
      <header className="p-4 border-b text-center bg-card rounded-t-lg">
        <div className="flex items-center justify-center space-x-3">
           <Avatar className="h-10 w-10">
            <AvatarImage src="https://placehold.co/100x100.png" alt="Guru Avatar" data-ai-hint="guru avatar spiritual" />
            <AvatarFallback>AG</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xl font-bold font-headline text-primary">
              <BilingualText en="AI Guruji" hi="एआई गुरुजी" />
            </h1>
            <p className="text-xs text-muted-foreground">
              <BilingualText en="Your personal AI study assistant" hi="आपका व्यक्तिगत एआई अध्ययन सहायक" />
            </p>
          </div>
        </div>
      </header>

      <ScrollArea ref={scrollAreaRef} className="flex-grow overflow-y-auto p-4 space-y-4 bg-muted/20">
        {messages.map((msg) => (
          <Card
            key={msg.id}
            className={cn(
              "p-3 rounded-lg max-w-[80%] sm:max-w-[70%] shadow-sm",
              msg.role === 'user' ? "bg-primary text-primary-foreground self-end ml-auto" : "bg-card text-card-foreground self-start mr-auto border"
            )}
          >
            <p className="text-sm whitespace-pre-wrap">{msg.textEn}</p>
            {msg.role === 'guru' && msg.textHi && (
              <>
                <p className="text-sm whitespace-pre-wrap mt-1 opacity-90">{msg.textHi}</p>
                <Button variant="ghost" size="sm" className={cn("mt-1 p-0 h-auto text-xs", msg.role === 'user' ? "text-primary-foreground/80 hover:text-primary-foreground" : "text-primary/80 hover:text-primary")}>
                  <Volume2 className="mr-1 h-3 w-3" />
                  <BilingualText en="Listen" hi="सुनें" />
                </Button>
              </>
            )}
          </Card>
        ))}
         {isLoading && (
          <div className="flex justify-start">
            <Card className="bg-card text-card-foreground self-start mr-auto p-3 rounded-lg shadow-sm inline-flex items-center space-x-2">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground"><BilingualText en="Guruji is thinking..." hi="गुरुजी सोच रहे हैं..."/></p>
            </Card>
          </div>
        )}
      </ScrollArea>

      <footer className="p-3 border-t bg-card rounded-b-lg">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <Textarea
            placeholder_en="Ask Guru Ji anything..."
            placeholder_hi="गुरु जी से कुछ भी पूछें..."
            className="flex-grow resize-none min-h-[40px] max-h-[120px] text-sm"
            rows={1}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            disabled={isLoading}
          />
          <Button type="button" size="icon" variant="ghost" className="text-primary hover:bg-primary/10 shrink-0" disabled={isLoading}>
            <Mic className="h-5 w-5" />
            <span className="sr-only"><BilingualText en="Use Voice" hi="आवाज का प्रयोग करें"/></span>
          </Button>
          <Button type="submit" size="icon" className="bg-primary hover:bg-primary/90 text-primary-foreground shrink-0" disabled={isLoading || !inputValue.trim()}>
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            <span className="sr-only"><BilingualText en="Send" hi="भेजें"/></span>
          </Button>
        </form>
      </footer>
    </div>
  );
}
