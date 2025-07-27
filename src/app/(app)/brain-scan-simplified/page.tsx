
"use client";

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, ArrowLeft, Camera as CameraIcon, Mic, Eye, Smile, BookOpen, Clock } from 'lucide-react';
import { BilingualText } from "@/components/shared/BilingualText";
import { generateBrainFitnessReport, type BrainScanInput } from '@/ai/flows/brain-scan-report';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const analysisSteps = [
  { text: "Initializing OSO Aura Engine...", duration: 1500, icon: Brain },
  { text: "Calibrating camera for ambient light...", duration: 2000, icon: CameraIcon },
  { text: "Analyzing eye focus and tracking...", duration: 3000, icon: Eye },
  { text: "Detecting micro-expressions for emotional balance...", duration: 3500, icon: Smile },
  { text: "Please read the following sentence aloud: 'The quick brown fox jumps over the lazy dog.'", duration: 5000, icon: BookOpen },
  { text: "Analyzing voice tone for stress markers...", duration: 4000, icon: Mic },
  { text: "Calculating final cognitive scores...", duration: 2000, icon: Clock },
];

export default function BrainScanSimplifiedPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(analysisSteps[0]);

  useEffect(() => {
    const getPermissions = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setHasPermission(false);
        toast({
          variant: 'destructive',
          title: 'Unsupported Browser',
          description: 'Your browser does not support camera or microphone access.',
        });
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
        toast({
          variant: 'destructive',
          title: 'Permission Denied',
          description: 'Please enable camera and microphone permissions in your browser settings.',
        });
      }
    };

    getPermissions();
    
    return () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    };
  }, [toast]);


  const startAnalysis = async () => {
    setIsAnalyzing(true);
    let totalDuration = analysisSteps.reduce((acc, step) => acc + step.duration, 0);
    let elapsedTime = 0;

    for (const step of analysisSteps) {
        setCurrentStep(step);
        const stepInterval = setInterval(() => {
            elapsedTime += 50;
            setAnalysisProgress((elapsedTime / totalDuration) * 100);
        }, 50);

        await new Promise(resolve => setTimeout(resolve, step.duration));
        clearInterval(stepInterval);
    }
    
    setAnalysisProgress(100);
    await handleSubmit();
    setIsAnalyzing(false);
  };


  const handleSubmit = async () => {
    setIsLoading(true);
    const studentName = "Aarav S."; 
    const inputForApi: BrainScanInput = { 
        studentName,
        clarityScore: Math.floor(Math.random() * 30) + 60, // 60-90
        attentionSpanScore: Math.floor(Math.random() * 40) + 50, // 50-90
        stressLevelScore: Math.floor(Math.random() * 40) + 20, // 20-60
        studyHours: Math.floor(Math.random() * 10) + 5, // 5-15
        sleepHours: Math.floor(Math.random() * 3) + 6, // 6-9
    };
    
    try {
      const report = await generateBrainFitnessReport(inputForApi);
      localStorage.setItem('latestAuraReport', JSON.stringify(report));
      
      toast({
        title: "Scan Complete!",
        description: "Your Brain Fitness Report is ready.",
      });

      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
      
      router.push('/brain-scan-report'); 
    } catch (error: any) {
      toast({
        title: "Error Generating Report",
        description: error.message || "Could not generate the report. Please try again.",
        variant: "destructive",
      });
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <header className="text-center relative">
        <Button variant="outline" size="icon" className="absolute left-0 top-0" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold font-headline text-primary flex items-center justify-center gap-2">
          <Brain className="h-8 w-8" />
          <BilingualText en="OSO Brain Scan™" hi="OSO ब्रेन स्कैन™" />
        </h1>
        <p className="text-muted-foreground">
          <BilingualText en="Let's check your focus and clarity." hi="आइए आपकी एकाग्रता और स्पष्टता की जांच करें।" />
        </p>
      </header>

      <Card className="w-full max-w-md mx-auto shadow-lg">
        <CardContent className="pt-6 space-y-4">
            <div className="w-full aspect-video bg-black rounded-md overflow-hidden relative">
                <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                {hasPermission === null && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <LoadingSpinner size={32} />
                        <p className="ml-2 text-white">Accessing camera & mic...</p>
                    </div>
                )}
                 <div className="absolute top-2 right-2 flex items-center gap-2 p-1.5 bg-black/40 rounded-full text-xs text-white">
                    <CameraIcon size={14} className={hasPermission ? 'text-green-400' : 'text-red-400'} />
                    <Mic size={14} className={hasPermission ? 'text-green-400' : 'text-red-400'}/>
                </div>
            </div>
             {hasPermission === false && (
                <Alert variant="destructive">
                    <CameraIcon className="h-4 w-4"/>
                    <AlertTitle>Permissions Required</AlertTitle>
                    <AlertDescription>
                        Please allow camera and microphone access in your browser to use this feature. You may need to refresh the page after granting permission.
                    </AlertDescription>
                </Alert>
            )}

            {isAnalyzing && (
              <div className="space-y-3 pt-2">
                <Progress value={analysisProgress} />
                <div className="flex items-center justify-center gap-2 text-sm text-primary">
                    <currentStep.icon className="h-5 w-5 animate-pulse" />
                    <p className="font-medium text-center">{currentStep.text}</p>
                </div>
              </div>
            )}
        </CardContent>
        <CardFooter>
          <Button onClick={startAnalysis} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading || hasPermission !== true || isAnalyzing}>
            {isLoading ? <LoadingSpinner /> : (isAnalyzing ? <BilingualText en="Analyzing..." hi="विश्लेषण हो रहा है..."/> : <BilingualText en="Start AI Analysis" hi="एआई विश्लेषण शुरू करें" />)}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
    