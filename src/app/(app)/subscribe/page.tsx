"use client";

import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Gem, X, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const plans = [
  {
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
      { textEn: "AI Handwriting Notes", textHi: "एआई हैंडराइटिंग नोट्स", included: false },
      { textEn: "Limited Recorded Video Access", textHi: "सीमित रिकॉर्डेड वीडियो एक्सेस", included: false },
      { textEn: "Download for Offline", textHi: "ऑफ़लाइन के लिए डाउनलोड करें", included: false },
      { textEn: "Smart Progress Tracker", textHi: "स्मार्ट प्रगति ट्रैकर", included: false },
      { textEn: "Bonus Doubt Sessions", textHi: "बोनस शंका समाधान सत्र", included: false },
    ],
    isPopular: false,
    ctaEn: "Your Current Plan",
    ctaHi: "आपकी वर्तमान योजना",
    disabled: true,
  },
  {
    nameEn: "Premium Monthly",
    nameHi: "प्रीमियम मासिक",
    priceEn: "INR 149",
    priceHi: "INR १४९",
    priceDescriptionEn: "per month",
    priceDescriptionHi: "प्रति माह",
    features: [
      { textEn: "Advanced AI Guruji Access", textHi: "उन्नत एआई गुरुजी एक्सेस", included: true },
      { textEn: "Advanced Brainmate Access", textHi: "उन्नत ब्रेनमेट एक्सेस", included: true },
      { textEn: "AI Handwriting Notes", textHi: "एआई हैंडराइटिंग नोट्स", included: true },
      { textEn: "Mind Diary Access", textHi: "माइंड डायरी एक्सेस", included: true },
      { textEn: "Live Classes (Separate Purchase)", textHi: "लाइव कक्षाएं (अलग से खरीदें)", included: true },
      { textEn: "Unlimited Video Replays", textHi: "असीमित वीडियो रिप्ले", included: true },
      { textEn: "Full Notes & Assignments", textHi: "पूर्ण नोट्स और असाइनमेंट", included: true },
      { textEn: "Download for Offline", textHi: "ऑफ़लाइन के लिए डाउनलोड करें", included: true },
      { textEn: "Smart Progress Tracker", textHi: "स्मार्ट प्रगति ट्रैकर", included: true },
      { textEn: "Bonus Doubt Sessions", textHi: "बोनस शंका समाधान सत्र", included: true },
    ],
    isPopular: true,
    ctaEn: "Choose Monthly",
    ctaHi: "मासिक चुनें",
    disabled: false,
  },
  {
    nameEn: "Premium Yearly",
    nameHi: "प्रीमियम वार्षिक",
    priceEn: "INR 999",
    priceHi: "INR ९९९",
    priceDescriptionEn: "per year",
    priceDescriptionHi: "प्रति वर्ष",
    features: [
      { textEn: "Advanced AI Guruji Access", textHi: "उन्नत एआई गुरुजी एक्सेस", included: true },
      { textEn: "Advanced Brainmate Access", textHi: "उन्नत ब्रेनमेट एक्सेस", included: true },
      { textEn: "AI Handwriting Notes", textHi: "एआई हैंडराइटिंग नोट्स", included: true },
      { textEn: "Mind Diary Access", textHi: "माइंड डायरी एक्सेस", included: true },
      { textEn: "Live Classes (Separate Purchase)", textHi: "लाइव कक्षाएं (अलग से खरीदें)", included: true },
      { textEn: "Unlimited Video Replays", textHi: "असीमित वीडियो रिप्ले", included: true },
      { textEn: "Full Notes & Assignments", textHi: "पूर्ण नोट्स और असाइनमेंट", included: true },
      { textEn: "Download for Offline", textHi: "ऑफ़लाइन के लिए डाउनलोड करें", included: true },
      { textEn: "Smart Progress Tracker", textHi: "स्मार्ट प्रगति ट्रैकर", included: true },
      { textEn: "Bonus Doubt Sessions", textHi: "बोनस शंका समाधान सत्र", included: true },
    ],
    isPopular: false,
    ctaEn: "Choose Yearly & Save",
    ctaHi: "वार्षिक चुनें और बचाएं",
    disabled: false,
  },
];

export default function SubscribePage() {
  const router = useRouter();

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {plans.map((plan, index) => (
          <Card key={index} className={cn("flex flex-col h-full", plan.isPopular ? "border-primary shadow-lg shadow-primary/20" : "")}>
            {plan.isPopular && <div className="bg-primary text-primary-foreground text-xs font-bold text-center py-1 rounded-t-lg"><BilingualText en="Most Popular" hi="सबसे लोकप्रिय" /></div>}
            <CardHeader>
              <CardTitle className="text-2xl font-headline"><BilingualText en={plan.nameEn} hi={plan.nameHi} /></CardTitle>
              <CardDescription>
                <span className="text-4xl font-bold"><BilingualText en={plan.priceEn} hi={plan.priceHi} /></span>
                <span className="text-muted-foreground">/ <BilingualText en={plan.priceDescriptionEn} hi={plan.priceDescriptionHi} /></span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-grow">
              <ul className="space-y-3">
                {plan.features.map((feature, i) => (
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
              <Button className={cn("w-full", !plan.disabled && "bg-primary text-primary-foreground hover:bg-primary/90")} disabled={plan.disabled}>
                <BilingualText en={plan.ctaEn} hi={plan.ctaHi} />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
