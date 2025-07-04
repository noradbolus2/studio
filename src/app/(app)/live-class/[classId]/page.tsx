
// src/app/(app)/live-class/[classId]/page.tsx
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Pencil, Eraser, Trash2, Palette, Minus, Plus, VideoOff, MicOff, MessageSquare, BarChart, Send, Users, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { BilingualText } from '@/components/shared/BilingualText';
import Whiteboard, { type WhiteboardHandle } from '@/components/live-class/Whiteboard';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";


const colorPalette = ['#000000', '#EF4444', '#3B82F6', '#22C55E', '#F97316', '#8B5CF6'];

export default function LiveClassPage() {
  const params = useParams();
  const classId = params.classId as string;
  const router = useRouter();
  const whiteboardRef = useRef<WhiteboardHandle>(null);
  
  const [tool, setTool] = React.useState<'pen' | 'eraser'>('pen');
  const [color, setColor] = React.useState('#000000');
  const [lineWidth, setLineWidth] = React.useState(5);

  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this feature.',
        });
      }
    };

    getCameraPermission();
  }, [toast]);


  const clearCanvas = () => {
    if (whiteboardRef.current) {
      whiteboardRef.current.clearCanvas();
    }
  };

  const increaseLineWidth = () => setLineWidth(prev => Math.min(prev + 2, 50));
  const decreaseLineWidth = () => setLineWidth(prev => Math.max(prev - 2, 1));

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] bg-muted/30 rounded-lg">
      <header className="flex items-center justify-between p-3 border-b bg-card rounded-t-lg">
        <div className="flex items-center gap-2">
           <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-8 w-8"><ArrowLeft size={18}/></Button>
           <div>
              <h1 className="text-lg font-bold text-primary">Live Class: Kinematics Lecture 1</h1>
              <p className="text-xs text-muted-foreground">Class ID: {classId}</p>
           </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8"><Users size={16} className="mr-1.5"/> 25 Students</Button>
          <Button variant="destructive" size="sm" className="h-8"><VideoOff size={16} className="mr-1.5"/> End Class</Button>
        </div>
      </header>

      <div className="flex flex-grow overflow-hidden">
        {/* Main Content: Whiteboard and Toolbar */}
        <main className="flex-grow flex flex-col p-3">
          <div className="relative flex-grow">
             <Whiteboard ref={whiteboardRef} tool={tool} color={color} lineWidth={lineWidth} />
             {/* Drawing Toolbar */}
             <div className="absolute top-2 left-1/2 -translate-x-1/2 flex items-center gap-2 p-1.5 bg-card border rounded-lg shadow-md">
               <Button variant={tool === 'pen' ? 'secondary' : 'ghost'} size="icon" onClick={() => setTool('pen')} className="h-9 w-9"><Pencil size={18}/></Button>
               <Button variant={tool === 'eraser' ? 'secondary' : 'ghost'} size="icon" onClick={() => setTool('eraser')} className="h-9 w-9"><Eraser size={18}/></Button>
               <Popover>
                    <PopoverTrigger asChild>
                       <Button variant="ghost" size="icon" className="h-9 w-9"><Palette size={18}/></Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-2">
                        <div className="flex gap-1">
                            {colorPalette.map(c => (
                                <button key={c} onClick={() => setColor(c)} style={{backgroundColor: c}} className={cn("h-6 w-6 rounded-full border-2", color === c ? 'border-primary' : 'border-transparent')}/>
                            ))}
                        </div>
                    </PopoverContent>
               </Popover>
               <div className="flex items-center gap-1">
                 <Button variant="ghost" size="icon" onClick={decreaseLineWidth} className="h-8 w-8"><Minus size={16}/></Button>
                 <span className="text-xs font-mono w-4 text-center">{lineWidth}</span>
                 <Button variant="ghost" size="icon" onClick={increaseLineWidth} className="h-8 w-8"><Plus size={16}/></Button>
               </div>
               <Button variant="ghost" size="icon" onClick={clearCanvas} className="h-9 w-9 text-destructive"><Trash2 size={18}/></Button>
             </div>
          </div>
        </main>
        
        {/* Right Sidebar: Video, Chat, and Polls */}
        <aside className="w-80 border-l bg-card flex flex-col">
          <Card className="flex-shrink-0 border-0 border-b rounded-none shadow-none">
            <CardContent className="p-2">
              <div className="aspect-video bg-black rounded-md relative flex items-center justify-center text-white">
                 <video ref={videoRef} className="w-full h-full object-cover rounded-md" autoPlay muted playsInline />
                <div className="absolute bottom-2 left-2 right-2 flex justify-center items-center gap-2">
                  <Button variant="secondary" size="icon" className="h-9 w-9 rounded-full bg-black/50 hover:bg-black/70 border-0">
                    <MicOff size={18} />
                  </Button>
                  <Button variant="destructive" size="icon" className="h-9 w-9 rounded-full">
                    <VideoOff size={18} />
                  </Button>
                </div>
              </div>
               { !hasCameraPermission && (
                  <Alert variant="destructive" className="mt-2">
                      <AlertTitle>Camera Access Required</AlertTitle>
                      <AlertDescription>
                          Please allow camera access to use this feature.
                      </AlertDescription>
                  </Alert>
              )}
            </CardContent>
          </Card>

          <Card className="flex-grow flex flex-col border-0 rounded-none shadow-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-md"><MessageSquare size={18}/> Live Chat</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow p-2 space-y-3 bg-muted/50 overflow-y-auto">
               {/* Chat messages placeholder */}
               <div className="text-xs p-2 bg-card rounded"><span className="font-semibold">Riya:</span> Sir, can you explain that again?</div>
               <div className="text-xs p-2 bg-card rounded"><span className="font-semibold">Amit:</span> Got it! Thanks.</div>
            </CardContent>
            <CardFooter className="p-2 border-t">
              <div className="flex w-full gap-2">
                 <Input placeholder="Type a message..." className="h-9"/>
                 <Button size="icon" className="h-9 w-9 shrink-0"><Send size={16}/></Button>
              </div>
            </CardFooter>
          </Card>
          <Card className="flex-shrink-0 border-0 border-t rounded-none shadow-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-md"><BarChart size={18}/> Live Poll</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-center text-muted-foreground p-4">Polls feature coming soon!</p>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
