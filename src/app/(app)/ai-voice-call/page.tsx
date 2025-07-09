
"use client";

import { useState, useEffect, useRef, useCallback, type FormEvent, type ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PhoneOff, Mic, MicOff, MessageCircle, Send, Paperclip, XCircle, FileText, Image as ImageIcon } from 'lucide-react';
import { BilingualText } from '@/components/shared/BilingualText';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { chatWithOsoVaani, type OsoVaaniInput, type OsoVaaniOutput } from '@/ai/flows/ai-voice-call-flow';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import type { ProfileFormData } from '../edit-profile/page'; 

type CallStatus = 'connecting' | 'active' | 'ended';
type TranscriptEntry = {
  speaker: 'AI' | 'User';
  text: string;
};

interface AttachmentPreview {
  name: string;
  type: string;
  dataUri: string | null;
  isImage: boolean;
}

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const ALLOWED_DOC_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
const ALLOWED_FILE_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOC_TYPES];

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

  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const [textInputValue, setTextInputValue] = useState('');
  const [attachmentPreview, setAttachmentPreview] = useState<AttachmentPreview | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getVoices = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
        return window.speechSynthesis.getVoices();
    }
    return [];
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = getVoices;
    }
    return () => {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            window.speechSynthesis.onvoiceschanged = null;
        }
    };
  }, [getVoices]);


  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening && !isAiThinking && callStatus === 'active' && !(window.speechSynthesis && window.speechSynthesis.speaking)) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.warn("Speech recognition couldn't start, possibly already active.", e);
      }
    }
  }, [isListening, isAiThinking, callStatus]);

  const playBrowserSpeech = useCallback((text: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
        if (utteranceIntervalRef.current) {
            clearInterval(utteranceIntervalRef.current);
        }
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        
        let allVoices = getVoices();
        
        let preferredVoice = allVoices.find(v => v.lang === 'hi-IN' && v.name.includes('Google'));
        if (!preferredVoice) preferredVoice = allVoices.find(v => v.lang.startsWith('en-IN'));
        if (!preferredVoice) preferredVoice = allVoices.find(v => v.lang.startsWith('en-'));

        if (preferredVoice) {
            utterance.voice = preferredVoice;
        } else {
            console.warn("Preferred Hindi/English voice not found. Using browser default.");
        }

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => {
            setIsSpeaking(false);
            if (utteranceIntervalRef.current) {
                clearInterval(utteranceIntervalRef.current);
            }
            startListening();
        };
        
        utterance.onerror = (event) => {
            if (event.error === 'interrupted') {
                console.warn("Browser TTS was interrupted, likely by a new speech request.");
                return;
            }

            console.error("Browser TTS Error:", event.error);
            toast({ title: "Voice Error", description: `The browser's built-in voice failed: ${event.error}`, variant: "destructive" });
            setIsSpeaking(false);
             if (utteranceIntervalRef.current) {
                clearInterval(utteranceIntervalRef.current);
            }
            startListening();
        };

        window.speechSynthesis.speak(utterance);
        
        utteranceIntervalRef.current = setInterval(() => {
            if (window.speechSynthesis.speaking) {
                window.speechSynthesis.pause();
                window.speechSynthesis.resume();
            } else if (utteranceIntervalRef.current) {
                clearInterval(utteranceIntervalRef.current);
            }
        }, 14000);

    } else {
        toast({ title: "Audio Error", description: "Your browser does not support voice synthesis.", variant: "destructive" });
        startListening();
    }
  }, [startListening, toast, getVoices]);
  
  const getAiResponse = useCallback(async (userInput: string, attachment: AttachmentPreview | null) => {
    setIsAiThinking(true);
    setSuggestedReplies([]);
    const history = transcript.map(entry => ({
        role: entry.speaker === 'AI' ? 'model' : 'user',
        text: entry.text,
    }));
    
    let profileContext: Partial<ProfileFormData> = {};
    if (typeof window !== "undefined") {
      const storedProfile = localStorage.getItem('userProfileData');
      if (storedProfile) {
        try {
          const parsedProfile = JSON.parse(storedProfile) as ProfileFormData;
          profileContext = {
            className: parsedProfile.className,
            board: parsedProfile.board,
            stream: parsedProfile.stream,
            examTarget: parsedProfile.examTarget,
          };
        } catch (err) {
          console.warn("Could not parse profile data from localStorage for Vaani context:", err);
        }
      }
    }
    
    const inputForFlow: OsoVaaniInput = { 
        userInput, 
        history,
        studentClass: profileContext.className,
        studentBoard: profileContext.board,
        studentStream: profileContext.stream,
        studentExamTarget: profileContext.examTarget,
    };
    
    if (attachment) {
        inputForFlow.attachmentInfo = {
            name: attachment.name,
            type: attachment.type,
            isImage: attachment.isImage,
        };
        if (attachment.isImage && attachment.dataUri) {
            inputForFlow.attachmentDataUri = attachment.dataUri;
        }
    }
    
    try {
      const response = await chatWithOsoVaani(inputForFlow);
      setTranscript(prev => [...prev, { speaker: 'AI', text: response.aiResponse }]);
      playBrowserSpeech(response.aiResponse);

      if (response.suggestedReplies.length > 0) {
        setSuggestedReplies(response.suggestedReplies);
      } else {
        setTimeout(() => setCallStatus('ended'), 2000);
      }

    } catch (error: any) {
        let errorMessage = "I'm sorry, I'm having technical difficulties. Please try again later.";
        const errorString = error.message?.toLowerCase() || '';

        if (errorString.includes('503') || errorString.includes('overloaded')) {
            errorMessage = "My circuits are a bit busy right now. Please ask me again in a few seconds!";
        }
        
        toast({ title: "Conversation Error", description: errorMessage, variant: "destructive" });
        const errorEntry = { speaker: 'AI' as const, text: errorMessage};
        setTranscript(prev => [...prev, errorEntry]);
        playBrowserSpeech(errorEntry.text);
        setSuggestedReplies([]);
    } finally {
        setIsAiThinking(false);
    }
  }, [transcript, toast, playBrowserSpeech]);
  
  const handleUserSpeechResponse = useCallback((responseText: string) => {
      setTranscript(prev => [...prev, { speaker: 'User', text: responseText }]);
      getAiResponse(responseText, null); // Speech input does not carry attachments
  }, [getAiResponse]);

  const removeAttachment = useCallback(() => {
    setAttachmentPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = textInputValue.trim();
    if ((!trimmedInput && !attachmentPreview) || isAiThinking || isSpeaking || isListening) return;
    
    setTranscript(prev => [...prev, { speaker: 'User', text: trimmedInput }]);
    getAiResponse(trimmedInput, attachmentPreview);
    
    setTextInputValue('');
    removeAttachment();
  };

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        toast({ title: "File Too Large", description: `Please select a file smaller than ${MAX_FILE_SIZE_MB}MB.`, variant: "destructive"});
        setAttachmentPreview(null);
        if(fileInputRef.current) fileInputRef.current.value = ""; 
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
          dataUri: isImage ? reader.result as string : null, 
          isImage: isImage,
        });
      };
      reader.onerror = () => {
        toast({ title: "Error Reading File", description: "Could not read the selected file.", variant: "destructive"});
        setAttachmentPreview(null);
        if(fileInputRef.current) fileInputRef.current.value = "";
      };
      reader.readAsDataURL(file); 
    }
  };


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

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);

        recognition.onerror = (event: any) => {
          if (event.error !== 'no-speech' && event.error !== 'aborted') {
            toast({ title: "Mic Error", description: `Could not recognize speech: ${event.error}`, variant: "destructive" });
          }
          setIsListening(false);
        };

        recognition.onresult = (event: any) => {
          const transcriptResult = event.results[0][0].transcript;
          handleUserSpeechResponse(transcriptResult);
        };
      } else {
        toast({ title: "Mic Not Supported", description: "Your browser does not support speech recognition.", variant: "destructive" });
      }
    }
  }, [toast, handleUserSpeechResponse]);

  // This effect runs only once on mount to simulate connection and fetch the initial greeting.
  useEffect(() => {
    const initialGreeting = async () => {
        await new Promise(resolve => setTimeout(resolve, 1500));
        setCallStatus('active');
        // Initial call will be made from getAiResponse which is triggered by button or speech
        setIsAiThinking(true);
        try {
            const response = await chatWithOsoVaani({ userInput: '', history: [] });
            setTranscript(prev => [...prev, { speaker: 'AI', text: response.aiResponse }]);
            playBrowserSpeech(response.aiResponse);
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

    // Cleanup on unmount
    return () => {
        if (utteranceIntervalRef.current) {
            clearInterval(utteranceIntervalRef.current);
        }
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
    };
    
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
  
  const handleManualMicToggle = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      if (!isSpeaking && !isAiThinking) {
        startListening();
      }
    }
  };

  const endCall = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    if(recognitionRef.current && isListening) {
        recognitionRef.current.stop();
    }
     if (utteranceIntervalRef.current) {
        clearInterval(utteranceIntervalRef.current);
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
                <Button key={index} variant="outline" className="w-full bg-gray-700 border-gray-600 hover:bg-gray-600 justify-start text-left h-auto py-2.5" onClick={() => handleUserSpeechResponse(reply)} disabled={isSpeaking || isAiThinking}>
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

        {callStatus === 'active' && (
          <div className="w-full mt-6 space-y-2">
            {attachmentPreview && (
                <div className="p-2 border border-gray-600 rounded-md flex justify-between items-center bg-gray-800/50">
                    <div className="flex items-center gap-2 overflow-hidden">
                    {attachmentPreview.isImage ? 
                        <ImageIcon className="h-4 w-4 text-cyan-400 shrink-0" /> : 
                        <FileText className="h-4 w-4 text-cyan-400 shrink-0" />
                    }
                    <span className="text-xs text-gray-300 truncate">{attachmentPreview.name}</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={removeAttachment} className="h-6 w-6 text-gray-400 hover:text-destructive">
                    <XCircle size={16} />
                    </Button>
                </div>
            )}
            <form onSubmit={handleTextSubmit} className="w-full flex items-center gap-2">
                <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept={ALLOWED_FILE_TYPES.join(',')}/>
                <Button type="button" size="icon" variant="ghost" className="text-cyan-400 hover:bg-gray-700 flex-shrink-0" onClick={() => fileInputRef.current?.click()}>
                    <Paperclip size={20}/>
                </Button>
                <Input
                    placeholder="Type your message..."
                    className="bg-gray-800 border-gray-600 focus:ring-primary text-white"
                    value={textInputValue}
                    onChange={(e) => setTextInputValue(e.target.value)}
                    disabled={isAiThinking || isSpeaking || isListening}
                />
                <Button 
                    type="submit" 
                    size="icon" 
                    className="bg-primary hover:bg-primary/90 text-primary-foreground flex-shrink-0"
                    disabled={(!textInputValue.trim() && !attachmentPreview) || isAiThinking || isSpeaking || isListening}
                >
                    <Send size={20} />
                </Button>
            </form>
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
                disabled={isAiThinking || isSpeaking}
            >
                {isListening ? <MicOff size={28}/> : <Mic size={28}/>}
            </Button>
            <Button variant="destructive" className="rounded-full h-16 w-16" onClick={endCall}>
                <PhoneOff size={28} />
            </Button>
        </div>
        {callStatus === 'ended' && (
             <Button variant="outline" className="mt-8" onClick={() => router.push('/')}>
                Back to Home
            </Button>
        )}
      </div>
    </div>
  );
}
