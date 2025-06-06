
"use client";

import { useState, useRef, useEffect, type FormEvent } from 'react';
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mic, Send, Loader2 } from "lucide-react";
import { askAiGuruji, type AiGurujiInput, type AiGurujiOutput } from '@/ai/flows/ai-guruji-flow';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'guru';
  text: string; // Single text field for the message content
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
    text: "Namaste! How can I help you with your studies today?", // Default to English
    timestamp: new Date(),
  };

  useEffect(() => {
    console.log("AI Guruji UI: Setting initial message.");
    setMessages([initialGuruMessage]);
  }, []);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    console.log('AI Guruji UI: handleSubmit called. InputValue:', `"${inputValue}"`, 'IsLoading:', isLoading);

    const trimmedInput = inputValue.trim();
    if (!trimmedInput || isLoading) {
      console.log('AI Guruji UI: handleSubmit aborted. Reason: empty input or already loading.');
      return;
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: trimmedInput,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    console.log('AI Guruji UI: User message added to state. Input cleared. isLoading set to true.');

    try {
      console.log('AI Guruji UI: Preparing to call askAiGuruji with input:', trimmedInput);
      const gurujiInput: AiGurujiInput = { userInput: trimmedInput };
      const response = await askAiGuruji(gurujiInput);
      console.log('AI Guruji UI: Received response from askAiGuruji:', response);
      
      if (!response || typeof response.responseText !== 'string' || !response.respondedInLanguage) {
        console.error('AI Guruji UI: Invalid response structure from askAiGuruji:', response);
        const errorResponse: Message = {
          id: `guru-error-structure-${Date.now()}`,
          role: 'guru',
          text: "I apologize, I seem to have formulated my thoughts a bit unusually. Could you ask again?",
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorResponse]);
        return;
      }

      const guruResponse: Message = {
        id: `guru-${Date.now()}`,
        role: 'guru',
        text: response.responseText,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, guruResponse]);
      console.log('AI Guruji UI: Guru response message added to state.');

    } catch (error) {
      console.error("AI Guruji UI: Error encountered while calling AI Guruji flow:", error);
      const errorResponse: Message = {
        id: `guru-error-catch-${Date.now()}`,
        role: 'guru',
        text: "I'm sorry, I encountered an unexpected hiccup. Could you please try asking again?",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorResponse]);
      console.log('AI Guruji UI: Error response message added to state due to catch block.');
    } finally {
      setIsLoading(false);
      console.log('AI Guruji UI: isLoading set to false in finally block.');
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-4rem)] max-h-[700px] bg-background rounded-lg shadow-xl border">
      <header className="p-4 border-b text-center bg-card rounded-t-lg">
        <div className="flex items-center justify-center space-x-3">
           <Avatar className="h-10 w-10">
            <AvatarImage src="https://placehold.co/100x100.png" alt="Guru Avatar" data-ai-hint="monk teaching" />
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
            <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
          </Card>
        ))}
         {isLoading && (
          <div className="flex justify-start">
            <Card className="bg-card text-card-foreground self-start mr-auto p-3 rounded-lg shadow-sm inline-flex items-center space-x-2 border">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground"><BilingualText en="AI Guruji is pondering..." hi="एआई गुरुजी विचार कर रहे हैं..."/></p>
            </Card>
          </div>
        )}
      </ScrollArea>

      <footer className="p-3 border-t bg-card rounded-b-lg">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <Textarea
            placeholder="Ask Guruji anything..."
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
