
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Brain, Zap, ShieldAlert, ArrowLeft } from 'lucide-react';
import { BilingualText } from "@/components/shared/BilingualText";
import { generateBrainFitnessReport, type BrainScanInput, type BrainScanOutput } from '@/ai/flows/brain-scan-report';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

export default function BrainScanSimplifiedPage() {
  const [formData, setFormData] = useState<Omit<BrainScanInput, 'studentName'>>({
    clarityScore: 70,
    attentionSpanScore: 60,
    stressLevelScore: 50,
    studyHours: 10,
    sleepHours: 7,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSliderChange = (name: keyof typeof formData, value: number[]) => {
    setFormData((prev) => ({ ...prev, [name]: value[0] }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    // In a real app, studentName would come from the logged-in user's profile
    const studentName = "Aarav S."; 
    const inputForApi: BrainScanInput = { ...formData, studentName };
    
    try {
      const report = await generateBrainFitnessReport(inputForApi);
      // In a real app, you'd save this report to Firestore and then navigate
      // to the report page with the report ID.
      // For this prototype, we'll pass the data via localStorage as a simple bridge.
      localStorage.setItem('latestAuraReport', JSON.stringify(report));
      
      toast({
        title: "Report Generated!",
        description: "Your Brain Fitness Report is ready.",
      });
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
          <BilingualText en="Quick Brain Check" hi="त्वरित ब्रेन चेक" />
        </h1>
        <p className="text-muted-foreground">
          <BilingualText en="Rate your current state (0-100)." hi="अपनी वर्तमान स्थिति को रेट करें (0-100)।" />
        </p>
      </header>

      <Card className="w-full max-w-md mx-auto shadow-lg">
        <CardContent className="pt-6 space-y-8">
           {[
            { id: 'clarityScore', labelEn: 'Clarity Score', labelHi: 'स्पष्टता स्कोर', value: formData.clarityScore, icon: Brain },
            { id: 'attentionSpanScore', labelEn: 'Attention / Focus', labelHi: 'ध्यान / फोकस', value: formData.attentionSpanScore, icon: Zap },
            { id: 'stressLevelScore', labelEn: 'Stress Level', labelHi: 'तनाव स्तर', value: formData.stressLevelScore, icon: ShieldAlert },
          ].map(item => (
            <div key={item.id} className="space-y-2">
              <div className="flex justify-between items-center mb-1">
                <Label htmlFor={item.id} className="text-lg flex items-center gap-2">
                  <item.icon className="h-5 w-5 text-primary" />
                  <BilingualText en={item.labelEn} hi={item.labelHi} />
                </Label>
                <span className="text-xl font-bold text-primary">{item.value}</span>
              </div>
              <Slider
                id={item.id}
                min={0} max={100} step={1}
                value={[item.value]}
                onValueChange={(val) => handleSliderChange(item.id as keyof typeof formData, val)}
                className="[&>span:first-child]:h-3 [&>span>span]:h-3 [&>span+span]:h-6 [&>span+span]:w-6"
              />
            </div>
          ))}
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
            {isLoading ? <LoadingSpinner /> : <BilingualText en="Get My AI Report" hi="मेरी एआई रिपोर्ट प्राप्त करें" />}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
    
