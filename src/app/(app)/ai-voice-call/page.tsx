
"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Phone, PhoneOff, Mic, MicOff, AlertTriangle, MessageCircle } from 'lucide-react';
import { BilingualText } from '@/components/shared/BilingualText';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { textToSpeech } from '@/ai/flows/text-to-speech-flow';
// New import
import { chatWithOsoBuddy } from '@/ai/flows/ai-voice-call-flow';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type CallStatus = 'connecting' | 'active' | 'ended';
type TranscriptEntry = {
  speaker: 'AI' | 'User';
  text: string;
};

export default function AiVoiceCallPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [callStatus, setCallStatus] = useState<CallStatus>('connecting');
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [suggestedReplies, setSuggestedReplies] = useState<string[]>([]);
  const [isAiThinking, setIsAiThinking] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playAiSpeech = useCallback(async (text: string) => {
    setIsAudioPlaying(true);
    try {
      const response = await textToSpeech(text);
      if (audioRef.current && response.audioDataUri) {
        audioRef.current.src = response.audioDataUri;
        await audioRef.current.play();
      }
    } catch (error) {
      console.error("TTS Error:", error);
      toast({ title: "Audio Error", description: "Could not play AI voice.", variant: "destructive" });
    } finally {
      setIsAudioPlaying(false);
    }
  }, [toast]);
  
  const getAiResponse = useCallback(async (userInput: string) => {
    setIsAiThinking(true);
    setSuggestedReplies([]);
    const history = transcript.map(entry => ({
        role: entry.speaker === 'AI' ? 'model' : 'user',
        text: entry.text,
    }));
    
    try {
      const response = await chatWithOsoBuddy({ userInput, history });
      setTranscript(prev => [...prev, { speaker: 'AI', text: response.aiResponse }]);
      playAiSpeech(response.aiResponse);

      if (response.suggestedReplies.length > 0) {
        setSuggestedReplies(response.suggestedReplies);
      } else {
        setTimeout(() => setCallStatus('ended'), 2000);
      }

    } catch (error: any) {
        toast({ title: "Conversation Error", description: error.message || "The AI is unable to respond right now.", variant: "destructive" });
        const errorEntry = { speaker: 'AI' as const, text: "I'm sorry, I'm having technical difficulties. Please hang up and try again later."};
        setTranscript(prev => [...prev, errorEntry]);
        playAiSpeech(errorEntry.text);
        setSuggestedReplies([]);
    } finally {
        setIsAiThinking(false);
    }
  }, [transcript, playAiSpeech, toast]);


  useEffect(() => {
    // Initial connection simulation and greeting
    const timer = setTimeout(() => {
      setCallStatus('active');
      getAiResponse(''); // Initial empty input to get greeting
    }, 2000); 

    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (callStatus === 'active') {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callStatus]);
  
  const handleUserResponse = (responseText: string) => {
      setTranscript(prev => [...prev, { speaker: 'User', text: responseText }]);
      getAiResponse(responseText);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <audio ref={audioRef} hidden />
      <div className="w-full max-w-sm flex flex-col items-center">
        <Avatar className="h-28 w-28 mb-4 border-4 border-primary/50">
          <AvatarImage src="https://placehold.co/100x100.png" alt="OSO Buddy" data-ai-hint="friendly robot mascot" />
          <AvatarFallback>🤖</AvatarFallback>
        </Avatar>
        <h2 className="text-2xl font-bold">OSO Buddy</h2>
        
        {callStatus === 'connecting' && <p className="text-gray-400 mt-1">Connecting...</p>}
        {callStatus === 'active' && <p className="text-green-400 mt-1 font-mono">{formatDuration(callDuration)}</p>}
        {callStatus === 'ended' && <p className="text-red-400 mt-1">Call Ended</p>}

        <div className="w-full h-40 bg-gray-800/50 rounded-lg my-6 p-3 overflow-y-auto">
            {transcript.map((entry, index) => (
                <p key={index} className={cn("text-sm", entry.speaker === 'AI' ? 'text-cyan-300' : 'text-gray-300 text-right')}>
                    <span className="font-semibold">{entry.speaker}:</span> {entry.text}
                </p>
            ))}
            {isAiThinking && (
                 <p className="text-sm text-cyan-300 italic">OSO Buddy is thinking...</p>
            )}
        </div>

        {callStatus === 'active' && !isAiThinking && (
          <div className="w-full space-y-3">
            {suggestedReplies.map((reply, index) => (
                <Button key={index} variant="outline" className="w-full bg-gray-700 border-gray-600 hover:bg-gray-600 justify-start text-left h-auto py-2.5" onClick={() => handleUserResponse(reply)} disabled={isAudioPlaying || isAiThinking}>
                    <MessageCircle className="h-4 w-4 mr-2 shrink-0"/>
                    <span className="flex-grow">{reply}</span>
                </Button>
            ))}
          </div>
        )}
        
        {callStatus === 'active' && isAiThinking && (
            <div className="text-center p-4"><LoadingSpinner /> <p className="mt-2 text-sm text-gray-400">OSO Buddy is responding...</p></div>
        )}


        <div className="flex justify-center items-center gap-6 mt-8">
            <Button variant="ghost" className="rounded-full h-16 w-16 bg-gray-700/80 hover:bg-gray-700" onClick={() => setIsMuted(!isMuted)}>
                {isMuted ? <MicOff size={28}/> : <Mic size={28}/>}
            </Button>
            <Button variant="destructive" className="rounded-full h-16 w-16" onClick={() => setCallStatus('ended')}>
                <PhoneOff size={28} />
            </Button>
        </div>
        {callStatus === 'ended' && (
             <Button variant="outline" className="mt-8" onClick={() => router.push('/help')}>
                Back to Help Center
            </Button>
        )}
      </div>
    </div>
  );
}
