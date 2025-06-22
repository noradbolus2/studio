
"use client";

import { useState, useRef, useEffect, type FormEvent } from 'react';
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mic, Send, Loader2, Brain, Sparkles, ChevronLeft } from "lucide-react";
import { askBrainmate, type BrainmateInput, type BrainmateOutput } from '@/ai/flows/brainmate-flow';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";
import type { ProfileFormData } from '../edit-profile/page';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';

interface BrainmateMessage {
  id: string;
  role: 'user' | 'brainmate';
  text: string;
  isFollowUp?: boolean;
  timestamp: Date;
}

export default function BrainmatePage() {
  const router = useRouter();
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<BrainmateMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTopic, setCurrentTopic] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [profileData, setProfileData] = useState<ProfileFormData | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedProfile = localStorage.getItem('userProfileData');
      if (storedProfile) {
        setProfileData(JSON.parse(storedProfile));
      }
    }
    setMessages([
      {
        id: 'brainmate-initial',
        role: 'brainmate',
        text: "Hello! I am OSO Brainmate™. Ask me to explain any concept, and I'll break it down for you in a simple way!",
        timestamp: new Date(),
      }
    ]);
  }, []);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    const trimmedInput = inputValue.trim();
    if (!trimmedInput || isLoading) return;
    if (!currentTopic.trim()) {
        toast({ title: "Topic Missing", description: "Please enter the subject or topic you're studying.", variant: "destructive" });
        return;
    }

    const userMessage: BrainmateMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: trimmedInput,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    const brainmateInput: BrainmateInput = {
      studentQuery: trimmedInput,
      studentClass: profileData?.className,
      studentBoard: profileData?.board,
      currentTopic: currentTopic,
    };

    try {
      const response = await askBrainmate(brainmateInput);

      const explanationMessage: BrainmateMessage = {
        id: `brainmate-exp-${Date.now()}`,
        role: 'brainmate',
        text: response.explanation,
        timestamp: new Date(),
      };
      const followUpMessage: BrainmateMessage = {
        id: `brainmate-fol-${Date.now()}`,
        role: 'brainmate',
        text: response.followUpQuestion,
        isFollowUp: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, explanationMessage, followUpMessage]);

    } catch (error: any) {
      console.error("Brainmate UI: Error encountered:", error);
      const errorResponse: BrainmateMessage = {
        id: `brainmate-error-${Date.now()}`,
        role: 'brainmate',
        text: error.message || "I'm having a little trouble thinking. Please try asking again in a moment.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-4rem)] max-h-[700px] bg-background rounded-lg shadow-xl border">
      <header className="p-4 border-b text-center bg-card rounded-t-lg">
        <div className="flex items-center justify-center space-x-2 relative">
            <Button variant="ghost" size="icon" className="absolute left-2" onClick={() => router.back()}>
                <ChevronLeft className="h-5 w-5"/>
            </Button>
            <Brain className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-xl font-bold font-headline text-primary">
              <BilingualText en="OSO Brainmate™" hi="OSO ब्रेनमेट™" />
            </h1>
            <p className="text-xs text-muted-foreground">
              <BilingualText en="Your Concept Explainer" hi="आपका कॉन्सेप्ट एक्सप्लेनर" />
            </p>
          </div>
        </div>
        <Input
            value={currentTopic}
            onChange={(e) => setCurrentTopic(e.target.value)}
            placeholder="What's your current subject/topic? (e.g., Class 8 Electricity)"
            className="mt-3 text-center h-9"
        />
      </header>

      <ScrollArea ref={scrollAreaRef} className="flex-grow overflow-y-auto p-4 space-y-4 bg-muted/20">
        {messages.map((msg) => (
          <div key={msg.id} className={cn("flex flex-col", msg.role === 'user' ? 'items-end' : 'items-start')}>
            <Card
              className={cn(
                "p-3 rounded-lg max-w-[85%] shadow-sm w-fit",
                msg.role === 'user' ? "bg-primary text-primary-foreground self-end ml-auto" : "bg-card text-card-foreground self-start mr-auto border",
                msg.isFollowUp && "bg-accent/10 border-accent/30"
              )}
            >
             {msg.isFollowUp && <p className="text-xs font-semibold mb-1 text-accent flex items-center gap-1.5"><Sparkles size={14}/> Follow-up Question:</p>}
              <p className="text-sm whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
            </Card>
          </div>
        ))}
         {isLoading && (
          <div className="flex justify-start">
            <Card className="bg-card text-card-foreground self-start mr-auto p-3 rounded-lg shadow-sm inline-flex items-center space-x-2 border">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground"><BilingualText en="Brainmate is thinking..." hi="ब्रेनमेट सोच रहा है..."/></p>
            </Card>
          </div>
        )}
      </ScrollArea>

      <footer className="p-3 border-t bg-card rounded-b-lg">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <Textarea
            placeholder="Ask to explain a concept... e.g., 'What is photosynthesis?'"
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
          <Button type="submit" size="icon" className="bg-primary hover:bg-primary/90 text-primary-foreground shrink-0" disabled={isLoading || !inputValue.trim() || !currentTopic.trim()}>
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            <span className="sr-only"><BilingualText en="Send" hi="भेजें"/></span>
          </Button>
        </form>
      </footer>
    </div>
  );
}
