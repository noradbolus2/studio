
"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PartyPopper } from "lucide-react";
import Image from "next/image";
import { BilingualText } from "./BilingualText";

interface WelcomeMessageCardProps {
  onGetStarted: () => void;
}

export function WelcomeMessageCard({ onGetStarted }: WelcomeMessageCardProps) {
  return (
    <Card className="w-full max-w-md text-center shadow-xl">
      <CardHeader className="items-center">
        <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full border-2 border-primary bg-primary text-5xl font-bold text-primary-foreground shadow-xl">
            OSO
        </div>
        <CardTitle className="text-3xl font-headline text-primary">
            <BilingualText en="Welcome to OSO!" hi="OSO में आपका स्वागत है!" />
        </CardTitle>
        <CardDescription className="text-lg">
          <BilingualText en="Your all-in-one app for learning and supplies." hi="सीखने और आपूर्ति के लिए आपका ऑल-इन-वन ऐप।" />
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center">
            <PartyPopper className="h-12 w-12 text-accent animate-bounce" />
        </div>
        <p className="text-muted-foreground">
            <BilingualText 
                en="We're excited to have you on board. Let's make learning smarter and easier, together!" 
                hi="हम आपको अपने साथ पाकर उत्साहित हैं। आइए, मिलकर सीखने को और भी स्मार्ट और आसान बनाएं!" 
            />
        </p>
        <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6" onClick={onGetStarted}>
            <BilingualText en="Let's Get Started" hi="चलिए शुरू करते हैं" />
        </Button>
      </CardContent>
    </Card>
  );
}
