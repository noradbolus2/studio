
"use client";

import { useState } from "react";
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Gem, X, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const freePlan = {
  nameEn: "Free Plan",
  nameHi: "मुफ्त योजना",
  priceEn: "INR 0",
  priceHi: "INR 0",
  priceDescriptionEn: "per month",
  priceDescriptionHi: "प्रति माह",
  features: [
    { textEn: "Basic AI Guruji Access", textHi: "बेसिक एआई गुरुजी एक्सेस", included: true },
    { textEn: "Basic Brainmate Access", textHi: "बेसिक ब्रेनमेट एक्सेस", included: true },
    { textEn: "Mind Diary Access", textHi: "माइंड डायरी एक्सेस", included: true },
    { textEn: "Purchase Courses Individually", textHi: "व्यक्तिगत रूप से पाठ्यक्रम खरीदें", included: true },
    { textEn: "Live Classes (Separate Purchase)", textHi: "लाइव कक्षाएं (अलग से खरीदें)", included: true },
    { textEn: "Kalam AI™ Handwriting", textHi: "कलम AI™ हस्तलेखन", included: false },
    { textEn: "Limited Recorded Video Access", textHi: "सीमित रिकॉर्डेड वीडियो एक्सेस", included: false },
    { textEn: "Download for Offline", textHi: "ऑफ़लाइन के लिए डाउनलोड करें", included: false },
    { textEn: "Smart Progress Tracker", textHi: "स्मार्ट प्रगति ट्रैकर", included: false },
    { textEn: "Bonus Doubt Sessions", textHi: "बोनस शंका समाधान सत्र", included: false },
  ],
  isPopular: false,
  ctaEn: "Your Current Plan",
  ctaHi: "आपकी वर्तमान योजना",
  disabled: true,
};

const premiumPlan = {
  nameEn: "Premium",
  nameHi: "प्रीमियम",
  isPopular: true,
  billingOptions: {
    monthly: {
      priceEn: "INR 149",
      priceHi: "INR १४९",
      priceDescriptionEn: "per month",
      priceDescriptionHi: "प्रति माह",
      ctaEn: "Choose Monthly",
      ctaHi: "मासिक चुनें",
    },
    yearly: {
      priceEn: "INR 999",
      priceHi: "INR ९९९",
      priceDescriptionEn: "per year",
      priceDescriptionHi: "प्रति वर्ष",
      ctaEn: "Choose Yearly & Save",
      ctaHi: "वार्षिक चुनें और बचाएं",
    },
  },
  features: [
      { textEn: "Advanced AI Guruji Access", textHi: "उन्नत एआई गुरुजी एक्सेस", included: true },
      { textEn: "Advanced Brainmate Access", textHi: "उन्नत ब्रेनमेट एक्सेस", included: true },
      { textEn: "Kalam AI™ Handwriting", textHi: "कलम AI™ हस्तलेखन", included: true },
      { textEn: "Mind Diary Access", textHi: "माइंड डायरी एक्सेस", included: true },
      { textEn: "Live Classes (Separate Purchase)", textHi: "लाइव कक्षाएं (अलग से खरीदें)", included: true },
      { textEn: "Unlimited Video Replays", textHi: "असीमित वीडियो रिप्ले", included: true },
      { textEn: "Full Notes & Assignments", textHi: "पूर्ण नोट्स और असाइनमेंट", included: true },
      { textEn: "Download for Offline", textHi: "ऑफ़लाइन के लिए डाउनलोड करें", included: true },
      { textEn: "Smart Progress Tracker", textHi: "स्मार्ट प्रगति ट्रैकर", included: true },
      { textEn: "Bonus Doubt Sessions", textHi: "बोनस शंका समाधान सत्र", included: true },
  ],
};


export default function SubscribePage() {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <div className="space-y-8">
      <header className="text-center relative">
        <Button variant="outline" size="icon" className="absolute left-0 top-0" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold font-headline text-primary flex items-center justify-center gap-2">
          <Gem className="h-8 w-8" />
          <BilingualText en="OSO Premium Plans" hi="OSO प्रीमियम योजनाएं" />
        </h1>
        <p className="text-muted-foreground">
          <BilingualText en="Unlock your full potential with our premium features." hi="हमारी प्रीमियम सुविधाओं के साथ अपनी पूरी क्षमता को अनलॉक करें।" />
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start max-w-4xl mx-auto">
        {/* Free Plan Card */}
        <Card className="flex flex-col h-full">
            <CardHeader>
              <CardTitle className="text-2xl font-headline"><BilingualText en={freePlan.nameEn} hi={freePlan.nameHi} /></CardTitle>
              <CardDescription>
                <span className="text-4xl font-bold"><BilingualText en={freePlan.priceEn} hi={freePlan.priceHi} /></span>
                <span className="text-muted-foreground">/ <BilingualText en={freePlan.priceDescriptionEn} hi={freePlan.priceDescriptionHi} /></span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-grow">
              <ul className="space-y-3">
                {freePlan.features.map((feature, i) => (
                  <li key={i} className={cn("flex items-start text-sm", !feature.included && "text-muted-foreground")}>
                    {feature.included ? (
                      <Check className="h-4 w-4 text-green-500 mr-2 shrink-0 mt-0.5" />
                    ) : (
                      <X className="h-4 w-4 text-red-500 mr-2 shrink-0 mt-0.5" />
                    )}
                    <BilingualText en={feature.textEn} hi={feature.textHi} />
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" disabled={freePlan.disabled}>
                <BilingualText en={freePlan.ctaEn} hi={freePlan.ctaHi} />
              </Button>
            </CardFooter>
        </Card>

        {/* Premium Plan Card */}
        <Card className={cn("flex flex-col h-full border-primary shadow-lg shadow-primary/20")}>
            {premiumPlan.isPopular && <div className="bg-primary text-primary-foreground text-xs font-bold text-center py-1 rounded-t-lg"><BilingualText en="Most Popular" hi="सबसे लोकप्रिय" /></div>}
            <CardHeader className="items-center">
              <CardTitle className="text-2xl font-headline"><BilingualText en={premiumPlan.nameEn} hi={premiumPlan.nameHi} /></CardTitle>
              <div className="inline-flex items-center justify-center rounded-md bg-muted p-1 text-muted-foreground my-3">
                <Button
                    onClick={() => setBillingCycle('monthly')}
                    variant="ghost"
                    className={cn(
                        "px-6 py-1 h-auto text-sm transition-all",
                        billingCycle === 'monthly' 
                            ? 'bg-background text-foreground shadow-sm' 
                            : 'bg-transparent text-muted-foreground hover:bg-background/50'
                    )}
                >
                    <BilingualText en="Monthly" hi="मासिक" />
                </Button>
                <Button
                    onClick={() => setBillingCycle('yearly')}
                    variant="ghost"
                    className={cn(
                        "px-6 py-1 h-auto text-sm transition-all",
                        billingCycle === 'yearly' 
                            ? 'bg-background text-foreground shadow-sm' 
                            : 'bg-transparent text-muted-foreground hover:bg-background/50'
                    )}
                >
                    <BilingualText en="Yearly" hi="वार्षिक" />
                </Button>
              </div>
              <CardDescription>
                <span className="text-4xl font-bold text-foreground">
                    <BilingualText 
                        en={premiumPlan.billingOptions[billingCycle].priceEn} 
                        hi={premiumPlan.billingOptions[billingCycle].priceHi} 
                    />
                </span>
                <span className="text-muted-foreground">
                    / <BilingualText 
                        en={premiumPlan.billingOptions[billingCycle].priceDescriptionEn} 
                        hi={premiumPlan.billingOptions[billingCycle].priceDescriptionHi} 
                    />
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-grow">
              <ul className="space-y-3">
                {premiumPlan.features.map((feature, i) => (
                  <li key={i} className="flex items-start text-sm">
                    {feature.included ? (
                      <Check className="h-4 w-4 text-green-500 mr-2 shrink-0 mt-0.5" />
                    ) : (
                      <X className="h-4 w-4 text-red-500 mr-2 shrink-0 mt-0.5" />
                    )}
                    <BilingualText en={feature.textEn} hi={feature.textHi} />
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                <BilingualText 
                    en={premiumPlan.billingOptions[billingCycle].ctaEn} 
                    hi={premiumPlan.billingOptions[billingCycle].ctaHi} 
                />
              </Button>
            </CardFooter>
          </Card>
      </div>
    </div>
  );
}

