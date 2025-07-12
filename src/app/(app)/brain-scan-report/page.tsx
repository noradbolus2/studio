
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { BilingualText } from "@/components/shared/BilingualText";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Brain, Zap, TrendingUp, TrendingDown, Smile, Sun, Lightbulb, Eye, RefreshCcw, Sparkles, ArrowLeft } from "lucide-react";
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import type { BrainScanOutput } from '@/ai/flows/brain-scan-report';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';


const auraZoneClasses: Record<string, string> = {
  blue: "border-primary bg-primary/10 animate-blue-pulse", // High Clarity
  red: "border-destructive bg-destructive/10 animate-red-flicker", // Stress
  green: "border-success bg-success/10 animate-green-pulse",   // Balance (Focus)
  yellow: "border-warning bg-warning/10 animate-yellow-pulse", // Low Attention
};

export default function AuraMapPage() {
  const [auraData, setAuraData] = useState<BrainScanOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    setIsLoading(true);
    const storedReport = localStorage.getItem('latestAuraReport');
    if (storedReport) {
        try {
            setAuraData(JSON.parse(storedReport));
        } catch (e) {
            console.error("Could not parse aura report from storage.", e);
            toast({ title: "Error", description: "Could not load your report. Please try scanning again.", variant: "destructive" });
        }
    }
    setIsLoading(false);
  }, [toast]);

  const handleScanAgain = () => {
    // Navigate to the simplified input page
    router.push('/brain-scan-simplified');
  };

  const handleParentViewToggle = () => {
    toast({ title: "Parent View (Coming Soon)", description: "This will switch to a simplified view for parents." });
  };
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><LoadingSpinner size={48} /></div>;
  }
  
  if (!auraData) {
      return (
          <div className="text-center space-y-4">
              <p className="text-muted-foreground">No report found. Let's start with a quick brain check!</p>
              <Button onClick={handleScanAgain}>
                  <Brain className="mr-2"/> Start Brain Check
              </Button>
          </div>
      );
  }

  const auraMetrics = [auraData.clarity, auraData.focus, auraData.attention, auraData.stress];

  return (
    <React.Fragment>
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-4">
            <Button variant="outline" size="sm" onClick={() => router.back()} className="text-xs h-8">
              <ArrowLeft size={14} className="mr-1.5"/> <BilingualText en="Back" hi="वापस"/>
            </Button>
            <div className="flex-grow flex items-center justify-center gap-1 text-xs text-muted-foreground">
                <Sparkles size={14} className="text-primary" />
                <span>Powered by OSO AI</span>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleScanAgain} className="text-xs h-8">
                    <RefreshCcw size={14} className={cn("mr-1.5")}/> <BilingualText en="Scan Again" hi="फिर से स्कैन करें"/>
                </Button>
                <Button variant="outline" size="sm" onClick={handleParentViewToggle} className="text-xs h-8">
                    <Eye size={14} className="mr-1.5"/> <BilingualText en="Parent View" hi="अभिभावक दृश्य"/>
                </Button>
            </div>
        </div>

        <header className="text-center">
          <h1 className="text-3xl font-bold font-headline text-primary">
            OSO Aura Map™
          </h1>
          <p className="text-muted-foreground">
            <BilingualText en={`Cognitive & Emotional Snapshot`} hi={`संज्ञानात्मक और भावनात्मक स्नैपशॉट`} />
          </p>
           <p className="text-sm text-muted-foreground"><BilingualText en={new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} hi={new Date().toLocaleDateString('hi-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} /></p>
        </header>

        <Card className="w-full max-w-lg mx-auto shadow-xl bg-card/80 border-border/30 backdrop-blur-sm">
          <CardHeader className="items-center text-center pb-2">
            <div className="relative w-64 h-64 md:w-72 md:h-72 mb-4 flex items-center justify-center">
              {/* Aura Rings */}
              {auraMetrics.map((metric, index) => (
                <div 
                  key={metric.labelEn}
                  className={cn(
                    "absolute rounded-full border-2",
                    auraZoneClasses[metric.color],
                    "opacity-70" 
                  )}
                  style={{ 
                    width: `${75 - index * 15}%`, 
                    height: `${75 - index * 15}%`,
                    animationDelay: `${index * 0.15}s`
                  }}
                />
              ))}
              <Brain className="w-16 h-16 md:w-20 md:h-20 text-primary z-10 opacity-90 filter drop-shadow-[0_0_8px_hsl(var(--primary))]"/>
            </div>
            <CardTitle className="text-2xl font-bold text-primary -mt-2">
                <BilingualText en="Brain Fitness Score" hi="ब्रेन फिटनेस स्कोर"/>: {Math.round(auraData.brainFitnessScore)}/100
            </CardTitle>
             <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs mt-2">
                {auraMetrics.map(metric => (
                    <span key={metric.labelEn} className={cn("font-medium p-1 rounded", `text-${metric.color}-400`)}>
                       <BilingualText en={metric.labelEn} hi={metric.labelHi}/>: {metric.value}%
                    </span>
                ))}
            </div>
          </CardHeader>
        </Card>

        <Card className="bg-card/80 border-border/30 backdrop-blur-sm">
            <CardHeader><CardTitle className="text-lg font-headline text-primary">AI Summary & Advice</CardTitle></CardHeader>
            <CardContent>
                <p className="italic text-foreground/80">"{auraData.reportSummary}"</p>
            </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-card/80 border-border/30 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-lg font-headline text-accent flex items-center gap-2">
                        <Lightbulb size={20}/> <BilingualText en="Daily Motivation" hi="दैनिक प्रेरणा"/>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="italic text-muted-foreground text-sm">
                        "<BilingualText en={auraData.dailyMotivationEn} hi={auraData.dailyMotivationHi}/>"
                    </p>
                </CardContent>
            </Card>

            <Card className="bg-card/80 border-border/30 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-lg font-headline text-primary flex items-center gap-2">
                        <Sparkles size={20}/> <BilingualText en="AI Suggestions" hi="एआई सुझाव"/>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1.5 text-sm">
                    {auraData.recommendations.map(sug => (
                        <div key={sug.id} className="p-1.5 bg-muted/50 rounded-md text-xs text-muted-foreground">
                            <BilingualText en={sug.textEn} hi={sug.textHi}/>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>

        <Card className="bg-card/80 border-border/30 backdrop-blur-sm">
            <CardHeader>
                 <CardTitle className="text-lg font-headline"><BilingualText en="Weekly Cognitive Trends" hi="साप्ताहिक संज्ञानात्मक रुझान"/></CardTitle>
                 <CardDescription><BilingualText en="Focus, Clarity & Stress levels over the past week." hi="पिछले सप्ताह में फोकस, स्पष्टता और तनाव का स्तर।" /></CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-48 w-full bg-muted/30 rounded-md flex items-center justify-center border border-dashed border-border/50">
                    <Image src="https://placehold.co/600x300.png" alt="Weekly Cognitive Trends Graph Placeholder" width={600} height={300} data-ai-hint="focus stress graph" className="opacity-50"/>
                </div>
            </CardContent>
        </Card>

      </div>
    </React.Fragment>
  );
}
