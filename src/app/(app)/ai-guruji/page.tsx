
"use client";

import { useState, useRef, useEffect, type FormEvent, type ChangeEvent } from 'react';
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mic, Send, Loader2, Paperclip, XCircle, FileText, Image as ImageIcon } from "lucide-react";
import { askGuruji, type GurujiInput, type GurujiOutput } from '@/ai/flows/guruji-flow';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  role: 'user' | 'guru';
  text: string; 
  attachmentPreview?: AttachmentPreview | null; // Add attachment info to message
  timestamp: Date;
}

interface AttachmentPreview {
  name: string;
  type: string; // MIME type
  dataUri: string | null; // Base64 data URI for images, null for other docs for now
  isImage: boolean;
}

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const ALLOWED_DOC_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
const ALLOWED_FILE_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOC_TYPES];


export default function AiGurujiPage() {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachmentPreview, setAttachmentPreview] = useState<AttachmentPreview | null>(null);
  const { toast } = useToast();

  const initialGuruMessage: Message = {
    id: 'guru-initial',
    role: 'guru',
    text: "Namaste! How can I help you with your studies today? You can also attach files if needed.",
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

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        toast({ title: "File Too Large", description: `Please select a file smaller than ${MAX_FILE_SIZE_MB}MB.`, variant: "destructive"});
        setAttachmentPreview(null);
        if(fileInputRef.current) fileInputRef.current.value = ""; // Reset file input
        return;
      }
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        toast({ title: "Invalid File Type", description: "Please select an image (JPG, PNG, GIF, WebP) or document (PDF, DOC, DOCX, TXT).", variant: "destructive"});
        setAttachmentPreview(null);
        if(fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      const reader = new FileReader();
      const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);

      reader.onloadend = () => {
        setAttachmentPreview({
          name: file.name,
          type: file.type,
          dataUri: isImage ? reader.result as string : null, // Only store data URI for images to send
          isImage: isImage,
        });
      };
      reader.onerror = () => {
        toast({ title: "Error Reading File", description: "Could not read the selected file.", variant: "destructive"});
        setAttachmentPreview(null);
        if(fileInputRef.current) fileInputRef.current.value = "";
      };
      reader.readAsDataURL(file); // Always read as data URL for simplicity, even if only images use it for AI
    }
  };

  const removeAttachment = () => {
    setAttachmentPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset the file input
    }
  };


  const handleSubmit = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    const trimmedInput = inputValue.trim();
    if (!trimmedInput && !attachmentPreview) { // Allow sending if only attachment exists
      toast({ title: "Empty Message", description: "Please type a message or attach a file.", variant: "default"});
      return;
    }
    if (isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: trimmedInput,
      attachmentPreview: attachmentPreview, // Save preview with message for display
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    // Do not clear attachmentPreview here, it will be cleared after successful send in finally block

    setIsLoading(true);

    try {
      const gurujiInput: GurujiInput = { userInput: trimmedInput };
      if (attachmentPreview) {
        gurujiInput.attachmentInfo = {
          name: attachmentPreview.name,
          type: attachmentPreview.type,
          isImage: attachmentPreview.isImage,
        };
        if (attachmentPreview.isImage && attachmentPreview.dataUri) {
          gurujiInput.attachmentDataUri = attachmentPreview.dataUri;
        }
      }
      
      const response = await askGuruji(gurujiInput);
      
      if (!response || typeof response.responseText !== 'string' || !response.respondedInLanguage) {
        console.error('Guruji UI: Invalid response structure from askGuruji:', response);
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

    } catch (error) {
      console.error("Guruji UI: Error encountered while calling Guruji flow:", error);
      const errorResponse: Message = {
        id: `guru-error-catch-${Date.now()}`,
        role: 'guru',
        text: "I'm sorry, I encountered an unexpected hiccup. Could you please try asking again?",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
      removeAttachment(); // Clear attachment after attempt (success or fail)
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-4rem)] max-h-[700px] bg-background rounded-lg shadow-xl border">
      <header className="p-4 border-b text-center bg-card rounded-t-lg">
        <div className="flex items-center justify-center space-x-3">
           <Avatar className="h-10 w-10">
            <AvatarImage src="https://placehold.co/100x100.png" alt="Guru Avatar" data-ai-hint="monk teaching" />
            <AvatarFallback>GU</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xl font-bold font-headline text-primary">
              <BilingualText en="Guruji" hi="गुरुजी" />
            </h1>
            <p className="text-xs text-muted-foreground">
              <BilingualText en="Your personal study assistant" hi="आपका व्यक्तिगत अध्ययन सहायक" />
            </p>
          </div>
        </div>
      </header>

      <ScrollArea ref={scrollAreaRef} className="flex-grow overflow-y-auto p-4 space-y-4 bg-muted/20">
        {messages.map((msg) => (
          <div key={msg.id} className={cn("flex flex-col", msg.role === 'user' ? 'items-end' : 'items-start')}>
            <Card
              className={cn(
                "p-3 rounded-lg max-w-[80%] sm:max-w-[70%] shadow-sm w-fit",
                msg.role === 'user' ? "bg-primary text-primary-foreground self-end ml-auto" : "bg-card text-card-foreground self-start mr-auto border"
              )}
            >
              {msg.text && <p className="text-sm whitespace-pre-wrap">{msg.text}</p>}
              {msg.attachmentPreview && (
                 <div className={cn("mt-2 p-2 rounded-md flex items-center gap-2", msg.role === 'user' ? 'bg-primary-foreground/10' : 'bg-muted/50')}>
                  {msg.attachmentPreview.isImage ? <ImageIcon className="h-4 w-4 opacity-70" /> : <FileText className="h-4 w-4 opacity-70" />}
                  <span className="text-xs truncate">{msg.attachmentPreview.name}</span>
                </div>
              )}
            </Card>
          </div>
        ))}
         {isLoading && (
          <div className="flex justify-start">
            <Card className="bg-card text-card-foreground self-start mr-auto p-3 rounded-lg shadow-sm inline-flex items-center space-x-2 border">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground"><BilingualText en="Guruji is pondering..." hi="गुरुजी विचार कर रहे हैं..."/></p>
            </Card>
          </div>
        )}
      </ScrollArea>

      <footer className="p-3 border-t bg-card rounded-b-lg">
        {attachmentPreview && (
          <div className="mb-2 p-2 border rounded-md flex justify-between items-center bg-muted/50">
            <div className="flex items-center gap-2 overflow-hidden">
              {attachmentPreview.isImage ? 
                <ImageIcon className="h-5 w-5 text-primary shrink-0" /> : 
                <FileText className="h-5 w-5 text-primary shrink-0" />
              }
              <span className="text-xs text-foreground truncate">{attachmentPreview.name}</span>
              <span className="text-xs text-muted-foreground whitespace-nowrap">({attachmentPreview.type})</span>
            </div>
            <Button variant="ghost" size="icon" onClick={removeAttachment} className="h-6 w-6 text-muted-foreground hover:text-destructive">
              <XCircle size={18} />
              <span className="sr-only">Remove attachment</span>
            </Button>
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileSelect}
            className="hidden"
            accept={ALLOWED_FILE_TYPES.join(',')}
          />
          <Button type="button" size="icon" variant="ghost" className="text-primary hover:bg-primary/10 shrink-0" disabled={isLoading} onClick={() => fileInputRef.current?.click()}>
            <Paperclip className="h-5 w-5" />
            <span className="sr-only"><BilingualText en="Attach File" hi="फ़ाइल संलग्न करें"/></span>
          </Button>
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
          <Button type="submit" size="icon" className="bg-primary hover:bg-primary/90 text-primary-foreground shrink-0" disabled={isLoading || (!inputValue.trim() && !attachmentPreview)}>
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            <span className="sr-only"><BilingualText en="Send" hi="भेजें"/></span>
          </Button>
        </form>
      </footer>
    </div>
  );
}

    
