
"use client";

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, ArrowLeft, Camera as CameraIcon, Mic } from 'lucide-react';
import { BilingualText } from "@/components/shared/BilingualText";
import { generateBrainFitnessReport, type BrainScanInput } from '@/ai/flows/brain-scan-report';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";


export default function BrainScanSimplifiedPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    const getPermissions = async () => {
      // Check if mediaDevices is supported
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
    
    // Cleanup function to stop the camera and mic stream when the component unmounts
    return () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    };
  }, [toast]);


  const handleSubmit = async () => {
    setIsLoading(true);
    // In a real app, studentName would come from the logged-in user's profile
    const studentName = "Aarav S."; 
    // Since we're simulating the analysis, we'll use placeholder scores.
    // In a real implementation, these would be derived from ML analysis of the video/audio stream.
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

      // Explicitly stop the camera/mic tracks before navigating
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
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading || hasPermission !== true}>
            {isLoading ? <LoadingSpinner /> : <BilingualText en="Start AI Analysis" hi="एआई विश्लेषण शुरू करें" />}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
    
