
"use client";

import { useState, type FormEvent } from 'react';
import { generateBrainFitnessReport, type BrainScanInput, type BrainScanOutput } from '@/ai/flows/brain-scan-report';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { BrainLoadingAnimation, LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Brain, Zap } from 'lucide-react';
import { BilingualText } from '@/components/shared/BilingualText';

export function BrainScan() {
  const [formData, setFormData] = useState<BrainScanInput>({
    studentName: 'Student', // Default or fetch from user profile
    clarityScore: 70,
    attentionSpanScore: 60,
    stressLevelScore: 50,
    studyHours: 10,
    sleepHours: 7,
  });
  const [report, setReport] = useState<BrainScanOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === 'studentName' ? value : Number(value) }));
  };

  const handleSliderChange = (name: keyof BrainScanInput, value: number[]) => {
    setFormData((prev) => ({ ...prev, [name]: value[0] }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setReport(null);
    try {
      const result = await generateBrainFitnessReport(formData);
      setReport(result);
    } catch (err) {
      setError('Failed to generate report. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <BrainLoadingAnimation />;
  }

  if (report) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline">
            <Brain className="text-primary h-7 w-7" />
            <BilingualText en="Brain Fitness Report" hi="ब्रेन फिटनेस रिपोर्ट" />
          </CardTitle>
          <CardDescription>
            <BilingualText en={`For ${formData.studentName}`} hi={`${formData.studentName} के लिए`} />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold"><BilingualText en="Summary" hi="सारांश" />:</h3>
            <p className="text-sm text-foreground">{report.reportSummary}</p>
          </div>
          <div>
            <h3 className="font-semibold"><BilingualText en="Recommendations" hi="सिफारिशें" />:</h3>
            <p className="text-sm text-foreground">{report.recommendations}</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={() => setReport(null)} variant="outline" className="w-full">
            <BilingualText en="Start New Scan" hi="नया स्कैन शुरू करें" />
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
            <Zap className="text-accent h-7 w-7" />
            <BilingualText en="OSO Brain Scan™" hi="OSO ब्रेन स्कैन™" />
        </CardTitle>
        <CardDescription>
            <BilingualText en="Assess your clarity, attention, and stress levels." hi="अपनी स्पष्टता, ध्यान और तनाव के स्तर का आकलन करें।" />
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertTitle><BilingualText en="Error" hi="त्रुटि" /></AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div>
            <Label htmlFor="studentName"><BilingualText en="Student Name" hi="छात्र का नाम" /></Label>
            <Input id="studentName" name="studentName" value={formData.studentName} onChange={handleInputChange} placeholder="Enter your name" />
          </div>
          
          {[
            { id: 'clarityScore', labelEn: 'Clarity Score', labelHi: 'स्पष्टता स्कोर', value: formData.clarityScore },
            { id: 'attentionSpanScore', labelEn: 'Attention Span Score', labelHi: 'ध्यान अवधि स्कोर', value: formData.attentionSpanScore },
            { id: 'stressLevelScore', labelEn: 'Stress Level (0-Low, 100-High)', labelHi: 'तनाव स्तर (0-कम, 100-उच्च)', value: formData.stressLevelScore },
          ].map(item => (
            <div key={item.id} className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor={item.id}><BilingualText en={item.labelEn} hi={item.labelHi} /></Label>
                <span className="text-sm text-primary font-semibold">{item.value}</span>
              </div>
              <Slider
                id={item.id}
                name={item.id}
                min={0} max={100} step={1}
                value={[item.value]}
                onValueChange={(val) => handleSliderChange(item.id as keyof BrainScanInput, val)}
                className="[&>span:first-child]:h-3 [&>span>span]:h-3 [&>span+span]:h-5 [&>span+span]:w-5"
              />
            </div>
          ))}

          <div>
            <Label htmlFor="studyHours"><BilingualText en="Weekly Study Hours" hi="साप्ताहिक अध्ययन घंटे" /></Label>
            <Input id="studyHours" name="studyHours" type="number" value={formData.studyHours} onChange={handleInputChange} placeholder="e.g., 15" />
          </div>
          <div>
            <Label htmlFor="sleepHours"><BilingualText en="Nightly Sleep Hours" hi="रात में नींद के घंटे" /></Label>
            <Input id="sleepHours" name="sleepHours" type="number" value={formData.sleepHours} onChange={handleInputChange} placeholder="e.g., 8" />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
            {isLoading ? <LoadingSpinner size={20} /> : <BilingualText en="Generate Report" hi="रिपोर्ट तैयार करें" />}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
