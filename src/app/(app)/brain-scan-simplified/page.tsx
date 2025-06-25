
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Brain, Zap, ShieldAlert, ArrowLeft } from 'lucide-react'; // Clarity, Focus, Stress icons
import { BilingualText } from "@/components/shared/BilingualText";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';

interface BrainScanData {
  clarity: number;
  focus: number;
  stress: number;
}

export default function BrainScanSimplifiedPage() {
  const [clarity, setClarity] = useState(5);
  const [focus, setFocus] = useState(5);
  const [stress, setStress] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async () => {
    setIsLoading(true);
    const dataToSave: BrainScanData = { clarity, focus, stress };
    console.log("Submitting Brain Scan Data:", dataToSave);

    // --- Placeholder for Firestore Save ---
    // try {
    //   // Example: await db.collection('simplifiedBrainScans').add({ ...dataToSave, userId: 'currentUser', timestamp: new Date() });
    //   toast({
    //     title: "Scan Submitted!",
    //     description: "Your brain scan data has been recorded.",
    //   });
    // } catch (error) {
    //   console.error("Error saving brain scan data:", error);
    //   toast({
    //     title: "Error",
    //     description: "Could not save your brain scan data. Please try again.",
    //     variant: "destructive",
    //   });
    // } finally {
    //   setIsLoading(false);
    // }
    // --- End Placeholder ---

    // Simulating save
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({
      title: "Scan Submitted (Simulated)",
      description: "Your brain scan data has been recorded (Simulated). Connect Firestore to save.",
    });
    setIsLoading(false);
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
          <BilingualText en="Rate your current state (0-10)." hi="अपनी वर्तमान स्थिति को रेट करें (0-10)।" />
        </p>
      </header>

      <Card className="w-full max-w-md mx-auto shadow-lg">
        <CardContent className="pt-6 space-y-8">
          {[
            { id: 'clarity', labelEn: 'Clarity', labelHi: 'स्पष्टता', value: clarity, setter: setClarity, icon: Brain },
            { id: 'focus', labelEn: 'Focus', labelHi: 'फोकस', value: focus, setter: setFocus, icon: Zap },
            { id: 'stress', labelEn: 'Stress', labelHi: 'तनाव', value: stress, setter: setStress, icon: ShieldAlert },
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
                min={0} max={10} step={1}
                value={[item.value]}
                onValueChange={(val) => item.setter(val[0])}
                className="[&>span:first-child]:h-3 [&>span>span]:h-3 [&>span+span]:h-6 [&>span+span]:w-6"
              />
            </div>
          ))}
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
            {isLoading ? <BilingualText en="Submitting..." hi="सबमिट हो रहा है..." /> : <BilingualText en="Submit Scan" hi="स्कैन सबमिट करें" />}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
