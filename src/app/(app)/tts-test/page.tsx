
"use client";

import React, { useState } from "react";
import { generateSpeech } from "@/ai/flows/text-to-speech-flow";
import { useVoicePlayer } from "@/hooks/use-voice-player";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Volume2 } from "lucide-react";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

// Helper to convert data URI to Blob
const dataURIToBlob = (dataURI: string): Blob => {
  const splitDataURI = dataURI.split(',');
  const byteString = atob(splitDataURI[1]);
  const mimeString = splitDataURI[0].split(':')[1].split(';')[0];
  const ia = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ia], { type: mimeString });
};

export default function OSOBuddyVoiceTestPage() {
  const [text, setText] = useState("नमस्ते, क्या मैं आपकी मदद कर सकता हूँ?");
  const { playVoice, isPlaying } = useVoicePlayer();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleClick = async () => {
    if (!text.trim()) {
      toast({ title: "Error", description: "Please enter some text to speak.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      const { audioDataUri } = await generateSpeech({ text });
      const audioBlob = dataURIToBlob(audioDataUri);
      await playVoice(audioBlob);
    } catch (err: any) {
      console.error("TTS failed:", err);
      toast({ title: "TTS Error", description: err.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 flex justify-center items-start pt-10">
      <Card className="w-full max-w-lg">
        <CardHeader>
            <CardTitle>TTS Test Page</CardTitle>
            <CardDescription>Test the self-hosted voice generation engine.</CardDescription>
        </CardHeader>
        <CardContent>
            <Textarea
                placeholder="Enter text to speak..."
                value={text}
                onChange={e => setText(e.target.value)}
                className="border p-2 rounded min-h-[100px]"
            />
        </CardContent>
        <CardFooter>
            <Button onClick={handleClick} className="w-full" disabled={isLoading || isPlaying}>
                {isLoading ? <LoadingSpinner/> : <Volume2 className="mr-2 h-5 w-5"/>}
                {isPlaying ? 'Playing...' : isLoading ? 'Generating...' : 'Speak'}
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
