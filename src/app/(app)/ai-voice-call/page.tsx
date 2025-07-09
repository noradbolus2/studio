
"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PhoneOff, Mic, MicOff, MessageCircle } from 'lucide-react';
import { BilingualText } from '@/components/shared/BilingualText';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { chatWithOsoVaani, type OsoVaaniInput, type OsoVaaniOutput } from '@/ai/flows/ai-voice-call-flow';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useVoicePlayer } from '@/hooks/use-voice-player';
import { generateSpeech } from '@/ai/flows/text-to-speech-flow';

type CallStatus = 'connecting' | 'active' | 'ended';
type TranscriptEntry = {
  speaker: 'AI' | 'User';
  text: string;
};

// Add SpeechRecognition type declaration for window object
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function AiVoiceCallPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [callStatus, setCallStatus] = useState<CallStatus>('connecting');
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [callDuration, setCallDuration] = useState(0);
  const [suggestedReplies, setSuggestedReplies] = useState<string[]>([]);
  const [isAiThinking, setIsAiThinking] = useState(false);
  
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
        const loadVoices = () => {
            setVoices(window.speechSynthesis.getVoices());
        };
        // Voices list is loaded asynchronously.
        window.speechSynthesis.onvoiceschanged = loadVoices;
        loadVoices(); // For browsers that load it immediately.

        return () => {
            window.speechSynthesis.onvoiceschanged = null;
        };
    }
  }, []);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening && !isAiThinking && callStatus === 'active') {
      recognitionRef.current.start();
    }
  }, [isListening, isAiThinking, callStatus]);

  const { playVoice, stopVoice, isPlaying: isAudioPlaying } = useVoicePlayer(startListening);

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


  const fetchAndPlayAiSpeech = useCallback(async (text: string) => {
    try {
      const { audioDataUri } = await generateSpeech({ text });
      const audioBlob = dataURIToBlob(audioDataUri);
      await playVoice(audioBlob);
    } catch (error: any) {
      console.error("TTS Error:", error);
      toast({ 
          title: "Using Fallback Voice", 
          description: "AI voice limit reached. Switching to standard browser voice.", 
          variant: "default" 
      });

      // Fallback to browser's built-in TTS
      if (typeof window !== 'undefined' && window.speechSynthesis) {
          const utterance = new SpeechSynthesisUtterance(text);
          
          let preferredVoice = voices.find(v => v.lang === 'hi-IN' && v.name.includes('Google'));
          if (!preferredVoice) preferredVoice = voices.find(v => v.lang === 'en-IN');
          if (preferredVoice) utterance.voice = preferredVoice;

          utterance.onend = () => {
              startListening();
          };
          
          utterance.onerror = (event) => {
              console.error("Browser TTS Error:", event.error);
              toast({ title: "Fallback Voice Error", description: "Browser's built-in voice also failed.", variant: "destructive" });
              startListening();
          };

          window.speechSynthesis.speak(utterance);
      } else {
          toast({ title: "Audio Error", description: "Could not play AI voice and no fallback is available.", variant: "destructive" });
          startListening();
      }
    }
  }, [playVoice, toast, startListening, voices]);
  
  const getAiResponse = useCallback(async (userInput: string) => {
    setIsAiThinking(true);
    setSuggestedReplies([]);
    const history = transcript.map(entry => ({
        role: entry.speaker === 'AI' ? 'model' : 'user',
        text: entry.text,
    }));
    
    try {
      const response = await chatWithOsoVaani({ userInput, history } as OsoVaaniInput);
      setTranscript(prev => [...prev, { speaker: 'AI', text: response.aiResponse }]);
      await fetchAndPlayAiSpeech(response.aiResponse);

      if (response.suggestedReplies.length > 0) {
        setSuggestedReplies(response.suggestedReplies);
      } else {
        setTimeout(() => setCallStatus('ended'), 2000);
      }

    } catch (error: any) {
        toast({ title: "Conversation Error", description: error.message || "The AI is unable to respond right now.", variant: "destructive" });
        const errorEntry = { speaker: 'AI' as const, text: "I'm sorry, I'm having technical difficulties. Please hang up and try again later."};
        setTranscript(prev => [...prev, errorEntry]);
        await fetchAndPlayAiSpeech(errorEntry.text);
        setSuggestedReplies([]);
    } finally {
        setIsAiThinking(false);
    }
  }, [transcript, toast, fetchAndPlayAiSpeech]);
  
  const handleUserResponse = useCallback((responseText: string) => {
      setTranscript(prev => [...prev, { speaker: 'User', text: responseText }]);
      getAiResponse(responseText);
  }, [getAiResponse]);

  // Setup Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        const recognition = recognitionRef.current;
        recognition.continuous = false;
        recognition.lang = 'en-IN';
        recognition.interimResults = false;

        recognition.onstart = () => {
          setIsListening(true);
          toast({ title: "Listening...", description: "Please speak now." });
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          toast({ title: "Mic Error", description: `Could not recognize speech: ${event.error}`, variant: "destructive" });
          setIsListening(false);
        };

        recognition.onresult = (event: any) => {
          const transcriptResult = event.results[0][0].transcript;
          handleUserResponse(transcriptResult);
        };
      } else {
        toast({ title: "Mic Not Supported", description: "Your browser does not support speech recognition.", variant: "destructive" });
      }
    }
  }, [toast, handleUserResponse]);

  // This effect runs only once on mount to simulate connection and fetch the initial greeting.
  useEffect(() => {
    const initialGreeting = async () => {
        await new Promise(resolve => setTimeout(resolve, 2000));
        setCallStatus('active');
        // Manually call the initial fetch logic without involving the full `getAiResponse` to avoid loops.
        setIsAiThinking(true);
        try {
            const response = await chatWithOsoVaani({ userInput: '', history: [] });
            setTranscript(prev => [...prev, { speaker: 'AI', text: response.aiResponse }]);
            await fetchAndPlayAiSpeech(response.aiResponse);
            if (response.suggestedReplies.length > 0) {
                setSuggestedReplies(response.suggestedReplies);
            }
        } catch (error: any) {
            toast({ title: "Initial Greeting Failed", description: "Could not connect to OSO Vaani.", variant: "destructive" });
        } finally {
            setIsAiThinking(false);
        }
    };
    
    initialGreeting();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchAndPlayAiSpeech, toast]); 

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (callStatus === 'active') {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callStatus]);
  
  const handleManualMicToggle = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      if (!isAudioPlaying && !isAiThinking) {
        startListening();
      }
    }
  };

  const endCall = () => {
    stopVoice();
    if(recognitionRef.current && isListening) {
        recognitionRef.current.stop();
    }
    setCallStatus('ended');
  }
  
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <div className="w-full max-w-sm flex flex-col items-center">
        <Avatar className="h-28 w-28 mb-4 border-4 border-primary/50">
          <AvatarImage src="https://placehold.co/100x100.png" alt="OSO Vaani" data-ai-hint="friendly female teacher" />
          <AvatarFallback>V</AvatarFallback>
        </Avatar>
        <h2 className="text-2xl font-bold">OSO Vaani</h2>
        
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
                 <p className="text-sm text-cyan-300 italic">OSO Vaani is thinking...</p>
            )}
        </div>

        {callStatus === 'active' && !isAiThinking && !isListening && (
          <div className="w-full space-y-3">
            {suggestedReplies.map((reply, index) => (
                <Button key={index} variant="outline" className="w-full bg-gray-700 border-gray-600 hover:bg-gray-600 justify-start text-left h-auto py-2.5" onClick={() => handleUserResponse(reply)} disabled={isAudioPlaying || isAiThinking}>
                    <MessageCircle className="h-4 w-4 mr-2 shrink-0"/>
                    <span className="flex-grow">{reply}</span>
                </Button>
            ))}
          </div>
        )}
        
        {callStatus === 'active' && isAiThinking && !isListening && (
            <div className="text-center p-4"><LoadingSpinner /> <p className="mt-2 text-sm text-gray-400">OSO Vaani is responding...</p></div>
        )}
        
        {callStatus === 'active' && isListening && (
            <div className="text-center p-4 space-y-2">
                <LoadingSpinner />
                <p className="text-sm text-cyan-400 animate-pulse">Listening...</p>
            </div>
        )}


        <div className="flex justify-center items-center gap-6 mt-8">
            <Button 
                variant="ghost" 
                className={cn(
                    "rounded-full h-16 w-16 bg-gray-700/80 hover:bg-gray-700",
                    isListening && "bg-cyan-500/80 hover:bg-cyan-500 animate-pulse"
                )} 
                onClick={handleManualMicToggle}
                disabled={isAiThinking || isAudioPlaying}
            >
                {isListening ? <MicOff size={28}/> : <Mic size={28}/>}
            </Button>
            <Button variant="destructive" className="rounded-full h-16 w-16" onClick={endCall}>
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
