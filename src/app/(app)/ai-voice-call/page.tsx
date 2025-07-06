
"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Phone, PhoneOff, Mic, MicOff, AlertTriangle } from 'lucide-react';
import { BilingualText } from '@/components/shared/BilingualText';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { textToSpeech, type TextToSpeechOutput } from '@/ai/flows/text-to-speech-flow';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type CallStatus = 'connecting' | 'active' | 'ended';
type TranscriptEntry = {
  speaker: 'AI' | 'User';
  text: string;
};
type ScriptStage = 'initial_greeting' | 'ask_order_issue' | 'provide_eta' | 'ask_human' | 'transferring' | 'end_call';

export default function AiVoiceCallPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [callStatus, setCallStatus] = useState<CallStatus>('connecting');
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [currentStage, setCurrentStage] = useState<ScriptStage>('initial_greeting');
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const script: Record<ScriptStage, { text: string; userOptions?: { text: string; nextStage: ScriptStage }[] }> = {
    initial_greeting: {
      text: "Hi! I'm OSO Buddy. How can I help you today?",
      userOptions: [
        { text: "My order is late.", nextStage: 'provide_eta' },
        { text: "I want to talk to a human.", nextStage: 'transferring' },
      ],
    },
    provide_eta: {
      text: "I see your order #ORD123 is delayed due to high traffic. The new estimated time of arrival is 11 minutes. Is there anything else I can help with?",
      userOptions: [
        { text: "No, that's all.", nextStage: 'end_call' },
        { text: "I need more help.", nextStage: 'transferring' },
      ],
    },
    transferring: {
      text: "Sure, please hold while I connect you to a live agent.",
    },
    end_call: {
      text: "Thank you for calling OSO Support. Goodbye!",
    },
    ask_order_issue: { text: '' }, // Not used directly
  };

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

  const advanceScript = useCallback((stage: ScriptStage) => {
    const currentScript = script[stage];
    if (currentScript) {
      setTranscript(prev => [...prev, { speaker: 'AI', text: currentScript.text }]);
      playAiSpeech(currentScript.text);
      
      if (stage === 'end_call' || stage === 'transferring') {
        setTimeout(() => setCallStatus('ended'), 2000);
      }
    }
    setCurrentStage(stage);
  }, [playAiSpeech]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCallStatus('active');
      advanceScript('initial_greeting');
    }, 2000); // Simulate connection time

    return () => clearTimeout(timer);
  }, [advanceScript]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (callStatus === 'active') {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callStatus]);
  
  const handleUserResponse = (nextStage: ScriptStage) => {
      const userText = script[currentStage]?.userOptions?.find(opt => opt.nextStage === nextStage)?.text;
      if (userText) {
          setTranscript(prev => [...prev, { speaker: 'User', text: userText }]);
      }
      advanceScript(nextStage);
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
        </div>

        {callStatus === 'active' && (
          <div className="w-full space-y-3">
            {script[currentStage]?.userOptions?.map((option, index) => (
                <Button key={index} variant="outline" className="w-full bg-gray-700 border-gray-600 hover:bg-gray-600" onClick={() => handleUserResponse(option.nextStage)} disabled={isAudioPlaying}>
                    {option.text}
                </Button>
            ))}
            {currentStage === 'transferring' && <div className="text-center p-4"><LoadingSpinner /> <p className="mt-2 text-sm text-gray-400">Connecting to agent...</p></div>}
          </div>
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
