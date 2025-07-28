
"use client";

import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowLeft, Handshake, Building, Package, Bike, ArrowRight } from "lucide-react";
import type { LucideIcon } from 'lucide-react';
import { useRouter } from "next/navigation";
import Link from "next/link";

interface PartnerCardProps {
  titleEn: string;
  titleHi: string;
  descriptionEn: string;
  descriptionHi: string;
  icon: LucideIcon;
  ctaEn: string;
  ctaHi: string;
  ctaLink: string;
}

const PartnerCard = ({ titleEn, titleHi, descriptionEn, descriptionHi, icon: Icon, ctaEn, ctaHi, ctaLink }: PartnerCardProps) => (
  <Card className="flex flex-col text-center hover:shadow-xl transition-shadow">
    <CardHeader className="items-center">
      <div className="p-4 bg-primary/10 rounded-full mb-3">
        <Icon className="h-8 w-8 text-primary" />
      </div>
      <CardTitle className="font-headline text-xl">
        <BilingualText en={titleEn} hi={titleHi} />
      </CardTitle>
      <CardDescription>
        <BilingualText en={descriptionEn} hi={descriptionHi} />
      </CardDescription>
    </CardHeader>
    <CardContent className="flex-grow">
      {/* Can add more details here later */}
    </CardContent>
    <CardFooter>
      <Button asChild className="w-full">
        <Link href={ctaLink}>
          <BilingualText en={ctaEn} hi={ctaHi} /> <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </CardFooter>
  </Card>
);

const partnerData: PartnerCardProps[] = [
  {
    titleEn: "For Schools",
    titleHi: "स्कूलों के लिए",
    descriptionEn: "Digitize your campus with OSO's ERP, smart attendance, and communication tools.",
    descriptionHi: "OSO के ERP, स्मार्ट अटेंडेंस और संचार उपकरणों के साथ अपने परिसर को डिजिटल बनाएं।",
    icon: Building,
    ctaEn: "Onboard Your School",
    ctaHi: "अपना स्कूल ऑनबोर्ड करें",
    ctaLink: "/auth?role=school"
  },
  {
    titleEn: "For Vendors",
    titleHi: "विक्रेताओं के लिए",
    descriptionEn: "Expand your reach. Sell stationery, books, and uniforms to thousands of students on the OSO app.",
    descriptionHi: "अपनी पहुंच बढ़ाएं। OSO ऐप पर हजारों छात्रों को स्टेशनरी, किताबें और यूनिफॉर्म बेचें।",
    icon: Package,
    ctaEn: "Become a Vendor",
    ctaHi: "विक्रेता बनें",
    ctaLink: "/auth?role=vendor"
  },
  {
    titleEn: "For Riders",
    titleHi: "राइडर्स के लिए",
    descriptionEn: "Join our delivery fleet. Earn flexibly by delivering academic essentials to students in your city.",
    descriptionHi: "हमारे डिलीवरी बेड़े में शामिल हों। अपने शहर में छात्रों को शैक्षणिक आवश्यक वस्तुएं पहुंचाकर लचीले ढंग से कमाएं।",
    icon: Bike,
    ctaEn: "Join as a Rider",
    ctaHi: "राइडर के रूप में शामिल हों",
    ctaLink: "/auth?role=rider"
  },
];

export default function PartnerWithUsPage() {
    const router = useRouter();

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
                    <Handshake className="h-8 w-8 text-primary" />
                    <BilingualText en="Partner with OSO" hi="OSO के साथ भागीदार बनें" />
                </h1>
                 <Button variant="outline" onClick={() => router.back()}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    <BilingualText en="Back" hi="वापस"/>
                </Button>
            </div>
            
            <p className="text-muted-foreground max-w-2xl">
              <BilingualText 
                en="Join the fastest-growing education and delivery ecosystem in India. We provide the technology and platform for you to grow your business and reach more students." 
                hi="भारत में सबसे तेजी से बढ़ते शिक्षा और वितरण पारिस्थितिकी तंत्र में शामिल हों। हम आपको अपना व्यवसाय बढ़ाने और अधिक छात्रों तक पहुंचने के लिए प्रौद्योगिकी और मंच प्रदान करते हैं।"
              />
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {partnerData.map(partner => <PartnerCard key={partner.ctaLink} {...partner} />)}
            </div>
        </div>
    );
}
