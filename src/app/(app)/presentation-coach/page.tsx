
"use client";

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Presentation, ArrowLeft, Camera as CameraIcon, Mic, PlayCircle, StopCircle, RefreshCcw, Smile, Zap, Volume2, Target } from 'lucide-react';
import { BilingualText } from "@/components/shared/BilingualText";
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Progress } from '@/components/ui/progress';

type RecordingStatus = 'idle' | 'recording' | 'analyzing' | 'results';

const analysisSteps = [
    "Analyzing speech clarity and articulation...",
    "Calculating pace and rhythm...",
    "Detecting filler words (um, ah, like)...",
    "Assessing vocal confidence and tone modulation...",
    "Compiling final report..."
];

export default function PresentationCoachPage() {
    const [status, setStatus] = useState<RecordingStatus>('idle');
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const { toast } = useToast();
    const router = useRouter();

    const [recordingTime, setRecordingTime] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    
    const [analysisProgress, setAnalysisProgress] = useState(0);
    const [currentAnalysisStep, setCurrentAnalysisStep] = useState("");

    // Mock results
    const mockResults = {
        confidence: 85,
        clarity: 92,
        fillerWords: 3,
        pace: 150, // words per minute
        recommendations: [
            "Great overall confidence! Try to maintain eye contact even when thinking.",
            "Excellent clarity. Only a few words were slightly muffled.",
            "You used 'um' 3 times. Try pausing instead of using a filler word.",
            "Your pace is perfect for presentations. Keep it up!"
        ]
    };

    useEffect(() => {
        const getPermissions = async () => {
            if (!navigator.mediaDevices?.getUserMedia) {
                setHasPermission(false);
                toast({ title: 'Unsupported Browser', description: 'Your browser does not support camera/mic access.', variant: 'destructive' });
                return;
            }
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                setHasPermission(true);
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (error) {
                console.error('Error accessing media devices:', error);
                setHasPermission(false);
                toast({ title: 'Permission Denied', description: 'Please enable camera and microphone permissions.', variant: 'destructive' });
            }
        };
        getPermissions();
        
        return () => {
             if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [toast]);
    
    const startRecording = () => {
        setStatus('recording');
        setRecordingTime(0);
        timerRef.current = setInterval(() => {
            setRecordingTime(prev => prev + 1);
        }, 1000);
    };

    const stopRecording = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        setStatus('analyzing');
        runAnalysis();
    };
    
    const runAnalysis = async () => {
        for (let i = 0; i < analysisSteps.length; i++) {
            setCurrentAnalysisStep(analysisSteps[i]);
            setAnalysisProgress(((i + 1) / analysisSteps.length) * 100);
            await new Promise(resolve => setTimeout(resolve, 1200));
        }
        setStatus('results');
    };
    
    const reset = () => {
        setStatus('idle');
        setRecordingTime(0);
        setAnalysisProgress(0);
        setCurrentAnalysisStep("");
    };

    return (
        <div className="space-y-6">
            <header className="text-center relative">
                <Button variant="outline" size="icon" className="absolute left-0 top-0" onClick={() => router.back()}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-3xl font-bold font-headline text-primary flex items-center justify-center gap-2">
                    <Presentation className="h-8 w-8" />
                    <BilingualText en="AI Presentation Coach" hi="एआई प्रस्तुति कोच" />
                </h1>
                <p className="text-muted-foreground">
                    <BilingualText en="Practice your public speaking skills with AI." hi="एआई के साथ अपने सार्वजनिक बोलने के कौशल का अभ्यास करें।" />
                </p>
            </header>

            <Card className="w-full max-w-xl mx-auto shadow-lg">
                <CardContent className="pt-6 space-y-4">
                    <div className="w-full aspect-video bg-black rounded-md overflow-hidden relative">
                        <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                         {status === 'recording' && (
                            <div className="absolute top-2 right-2 flex items-center gap-2 p-1.5 bg-red-500/80 rounded-full text-xs text-white animate-pulse">
                                <Mic size={14} /> REC
                                <span className="font-mono w-10">{new Date(recordingTime * 1000).toISOString().substr(14, 5)}</span>
                            </div>
                        )}
                         {hasPermission === false && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                                <Alert variant="destructive" className="max-w-xs">
                                    <CameraIcon className="h-4 w-4"/>
                                    <AlertTitle>Permissions Required</AlertTitle>
                                    <AlertDescription>
                                        Please allow camera and mic access to use this feature.
                                    </AlertDescription>
                                </Alert>
                            </div>
                         )}
                    </div>
                     
                    {status === 'analyzing' && (
                        <div className="space-y-3 pt-2">
                            <h3 className="text-center font-semibold text-primary">Analyzing your speech...</h3>
                            <Progress value={analysisProgress} />
                            <p className="text-sm text-center text-muted-foreground h-4">{currentAnalysisStep}</p>
                        </div>
                    )}
                    
                    {status === 'results' && (
                        <div className="space-y-4 animate-fade-in">
                            <h3 className="text-lg font-bold text-center">Your Performance Report</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <ResultCard icon={Smile} title="Confidence" value={`${mockResults.confidence}%`} color="text-green-500"/>
                                <ResultCard icon={Zap} title="Clarity" value={`${mockResults.clarity}%`} color="text-blue-500"/>
                                <ResultCard icon={Volume2} title="Pace" value={`${mockResults.pace} WPM`} color="text-purple-500"/>
                                <ResultCard icon={Target} title="Filler Words" value={`${mockResults.fillerWords}`} color="text-orange-500"/>
                            </div>
                             <div>
                                <h4 className="font-semibold mb-2">AI Recommendations:</h4>
                                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                    {mockResults.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
                                </ul>
                            </div>
                        </div>
                    )}

                </CardContent>
                <CardFooter>
                    {status === 'idle' && (
                         <Button onClick={startRecording} className="w-full" disabled={hasPermission !== true}>
                            <PlayCircle className="mr-2"/> Start Recording
                        </Button>
                    )}
                     {status === 'recording' && (
                         <Button onClick={stopRecording} className="w-full" variant="destructive">
                            <StopCircle className="mr-2"/> Stop & Analyze
                        </Button>
                    )}
                    {(status === 'analyzing' || status === 'results') && (
                        <Button onClick={reset} className="w-full" variant="secondary" disabled={status==='analyzing'}>
                            <RefreshCcw className="mr-2"/> Record Again
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}

function ResultCard({ icon: Icon, title, value, color }: { icon: React.ElementType, title: string, value: string, color: string }) {
    return (
        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <Icon className={`h-8 w-8 ${color}`}/>
            <div>
                <p className="text-sm text-muted-foreground">{title}</p>
                <p className="text-lg font-bold">{value}</p>
            </div>
        </div>
    );
}

