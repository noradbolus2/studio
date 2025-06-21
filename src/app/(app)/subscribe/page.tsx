
"use client";

import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Gem, X } from "lucide-react";
import { cn } from "@/lib/utils";

const plans = [
  {
    nameEn: "Free Plan",
    nameHi: "मुफ्त योजना",
    priceEn: "₹0",
    priceHi: "₹0",
    priceDescriptionEn: "per month",
    priceDescriptionHi: "प्रति माह",
    features: [
      { textEn: "Limited AI Guruji Queries", textHi: "सीमित एआई गुरुजी प्रश्न", included: true },
      { textEn: "Basic Test Series Access", textHi: "बुनियादी टेस्ट सीरीज एक्सेस", included: true },
      { textEn: "Standard Brain Scan Report", textHi: "मानक ब्रेन स्कैन रिपोर्ट", included: true },
      { textEn: "Peer Matching", textHi: "सहकर्मी मिलान", included: true },
      { textEn: "Advanced Performance Analytics", textHi: "उन्नत प्रदर्शन विश्लेषण", included: false },
      { textEn: "Unlimited Live Doubt Solving", textHi: "असीमित लाइव शंका समाधान", included: false },
      { textEn: "Exclusive Course Content", textHi: "विशेष पाठ्यक्रम सामग्री", included: false },
    ],
    isPopular: false,
    ctaEn: "Your Current Plan",
    ctaHi: "आपकी वर्तमान योजना",
    disabled: true,
  },
  {
    nameEn: "Premium",
    nameHi: "प्रीमियम",
    priceEn: "₹499",
    priceHi: "₹४९९",
    priceDescriptionEn: "per month",
    priceDescriptionHi: "प्रति माह",
    features: [
      { textEn: "Unlimited AI Guruji Queries", textHi: "असीमित एआई गुरुजी प्रश्न", included: true },
      { textEn: "Full Test Series Access", textHi: "पूर्ण टेस्ट सीरीज एक्सेस", included: true },
      { textEn: "Advanced Brain Scan Report", textHi: "उन्नत ब्रेन स्कैन रिपोर्ट", included: true },
      { textEn: "Priority Peer Matching", textHi: "प्राथमिकता सहकर्मी मिलान", included: true },
      { textEn: "Advanced Performance Analytics", textHi: "उन्नत प्रदर्शन विश्लेषण", included: true },
      { textEn: "Unlimited Live Doubt Solving", textHi: "असीमित लाइव शंका समाधान", included: true },
      { textEn: "Exclusive Course Content", textHi: "विशेष पाठ्यक्रम सामग्री", included: true },
    ],
    isPopular: true,
    ctaEn: "Upgrade to Premium",
    ctaHi: "प्रीमियम में अपग्रेड करें",
    disabled: false,
  },
];

export default function SubscribePage() {
  return (
    <div className="space-y-8">
      <header className="text-center">
        <h1 className="text-3xl font-bold font-headline text-primary flex items-center justify-center gap-2">
          <Gem className="h-8 w-8" />
          <BilingualText en="OSO Premium Plans" hi="OSO प्रीमियम योजनाएं" />
        </h1>
        <p className="text-muted-foreground">
          <BilingualText en="Unlock your full potential with our premium features." hi="हमारी प्रीमियम सुविधाओं के साथ अपनी पूरी क्षमता को अनलॉक करें।" />
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {plans.map((plan, index) => (
          <Card key={index} className={cn("flex flex-col", plan.isPopular ? "border-primary shadow-lg shadow-primary/20" : "")}>
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
                  <li key={i} className="flex items-center text-sm">
                    {feature.included ? (
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                    ) : (
                      <X className="h-4 w-4 text-red-500 mr-2" />
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
