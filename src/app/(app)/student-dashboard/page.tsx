
"use client";

import { useState, useRef, useEffect, type FormEvent } from 'react';
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { School, BookOpen, MessageSquare, ShoppingCart, ArrowRight, Send, Loader2 } from "lucide-react";
import Link from "next/link";
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from '@/lib/utils';
import { askGuruji, type GurujiInput, type GurujiOutput } from '@/ai/flows/ai-guruji-flow';

interface ChatMessage {
  id: string;
  role: 'user' | 'guru';
  text: string; // Single text field
  timestamp: Date;
}

export default function StudentDashboardPage() {
  const [gurujiInputValue, setGurujiInputValue] = useState('');
  const [gurujiMessages, setGurujiMessages] = useState<ChatMessage[]>([]);
  const [isGurujiLoading, setIsGurujiLoading] = useState(false);
  const gurujiScrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setGurujiMessages([
      {
        id: 'guruji-initial-dash',
        role: 'guru',
        text: "Namaste! How can I assist you on your dashboard today?",
        timestamp: new Date(),
      }
    ]);
  }, []);

  useEffect(() => {
    if (gurujiScrollAreaRef.current) {
      gurujiScrollAreaRef.current.scrollTo({ top: gurujiScrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [gurujiMessages]);

  const handleGurujiSubmit = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    const trimmedInput = gurujiInputValue.trim();
    if (!trimmedInput || isGurujiLoading) return;

    const userMessage: ChatMessage = {
      id: `user-dash-${Date.now()}`,
      role: 'user',
      text: trimmedInput,
      timestamp: new Date(),
    };
    setGurujiMessages(prev => [...prev, userMessage]);
    setGurujiInputValue('');
    setIsGurujiLoading(true);

    try {
      const gurujiApiInput: GurujiInput = { userInput: trimmedInput };
      const response = await askGuruji(gurujiApiInput);
      
      if (!response || typeof response.responseText !== 'string' || !response.respondedInLanguage) {
        const errorResponse: ChatMessage = {
          id: `guru-dash-error-structure-${Date.now()}`,
          role: 'guru',
          text: "I had a slight issue formulating my thoughts. Could you try asking differently?",
          timestamp: new Date(),
        };
        setGurujiMessages(prev => [...prev, errorResponse]);
        return;
      }

      const guruResponse: ChatMessage = {
        id: `guru-dash-${Date.now()}`,
        role: 'guru',
        text: response.responseText,
        timestamp: new Date(),
      };
      setGurujiMessages(prev => [...prev, guruResponse]);

    } catch (error) {
      console.error("Student Dashboard Guruji Error:", error);
      const errorResponse: ChatMessage = {
        id: `guru-dash-error-catch-${Date.now()}`,
        role: 'guru',
        text: "Sorry, an unexpected hiccup occurred. Please try again.",
        timestamp: new Date(),
      };
      setGurujiMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsGurujiLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <header className="text-center">
        <School className="h-12 w-12 text-primary mx-auto mb-2" />
        <h1 className="text-3xl font-bold font-headline text-primary">
          <BilingualText en="Student Dashboard" hi="छात्र डैशबोर्ड" />
        </h1>
        <p className="text-muted-foreground">
          <BilingualText en="Welcome! Access your learning tools here." hi="आपका स्वागत है! अपने शिक्षण उपकरण यहाँ एक्सेस करें।" />
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <BookOpen className="text-accent h-6 w-6" />
              <BilingualText en="Latest Books" hi="नवीनतम पुस्तकें" />
            </CardTitle>
            <CardDescription>
              <BilingualText en="Explore new arrivals and recommended reads." hi="नए आगमन और अनुशंसित पुस्तकें देखें।" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
                <BilingualText en="[Placeholder for book carousels or featured books]" hi="[पुस्तक हिंडोला या विशेष रुप से प्रदर्शित पुस्तकों के लिए प्लेसहोल्डर]" />
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href="/class-6-12-books">
                <BilingualText en="Browse Books" hi="पुस्तकें ब्राउज़ करें" /> <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-lg transition-shadow md:col-span-2 flex flex-col max-h-[500px]">
          <CardHeader className="flex-shrink-0">
            <div className="flex items-center gap-2">
              <Avatar className="h-10 w-10">
                <AvatarImage src="https://placehold.co/100x100.png" alt="Guru Avatar" data-ai-hint="monk teaching"/>
                <AvatarFallback>GU</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="font-headline">
                  <BilingualText en="Ask Guruji" hi="गुरुजी से पूछें" />
                </CardTitle>
                <CardDescription>
                  <BilingualText en="Get your doubts cleared instantly." hi="अपनी शंकाओं का तुरंत समाधान पाएं।" />
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <ScrollArea ref={gurujiScrollAreaRef} className="flex-grow p-4 space-y-3 bg-muted/20">
            {gurujiMessages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "p-2.5 rounded-lg max-w-[85%] shadow-sm text-sm flex flex-col",
                  msg.role === 'user' ? "bg-primary text-primary-foreground self-end ml-auto" : "bg-card text-card-foreground self-start mr-auto border"
                )}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>
            ))}
            {isGurujiLoading && (
              <div className="flex justify-start">
                <div className="bg-card text-card-foreground self-start mr-auto p-2.5 rounded-lg shadow-sm inline-flex items-center space-x-2 border">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <p className="text-xs text-muted-foreground"><BilingualText en="Guruji is pondering..." hi="गुरुजी विचार कर रहे हैं..."/></p>
                </div>
              </div>
            )}
          </ScrollArea>
          <CardFooter className="p-3 border-t bg-card flex-shrink-0">
            <form onSubmit={handleGurujiSubmit} className="flex items-center space-x-2 w-full">
              <Textarea
                placeholder_en="Ask Guruji anything..."
                placeholder_hi="गुरुजी से कुछ भी पूछें..."
                className="flex-grow resize-none min-h-[40px] max-h-[100px] text-sm"
                rows={1}
                value={gurujiInputValue}
                onChange={(e) => setGurujiInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleGurujiSubmit();
                  }
                }}
                disabled={isGurujiLoading}
              />
              <Button type="submit" size="icon" className="bg-primary hover:bg-primary/90 text-primary-foreground shrink-0" disabled={isGurujiLoading || !gurujiInputValue.trim()}>
                {isGurujiLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                <span className="sr-only"><BilingualText en="Send" hi="भेजें"/></span>
              </Button>
            </form>
          </CardFooter>
        </Card>


        <Card className="hover:shadow-lg transition-shadow md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <ShoppingCart className="text-green-500 h-6 w-6" />
              <BilingualText en="Order Now" hi="अभी आर्डर करें" />
            </CardTitle>
            <CardDescription>
              <BilingualText en="Get stationery and supplies delivered quickly." hi="स्टेशनरी और आपूर्ति शीघ्रता से प्राप्त करें।" />
            </CardDescription>
          </CardHeader>
          <CardContent>
             <p className="text-muted-foreground text-sm">
                <BilingualText en="[Placeholder for quick order links or featured items]" hi="[त्वरित ऑर्डर लिंक या विशेष रुप से प्रदर्शित वस्तुओं के लिए प्लेसहोल्डर]" />
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="secondary" className="w-full">
              <Link href="/delivery">
                <BilingualText en="Go to Delivery" hi="डिलीवरी पर जाएं" /> <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

// Add placeholder to Textarea component for bilingual support if not already done globally
declare module 'react' {
    interface TextareaHTMLAttributes<T> extends HTMLAttributes<T> {
      placeholder_en?: string;
      placeholder_hi?: string;
    }
  }

