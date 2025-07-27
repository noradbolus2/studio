
"use client";

import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Rocket, CheckCircle, School, Package, Bike, Briefcase, Wand2, Calendar, Brain, Heart, Users, Link as LinkIcon, Flag } from "lucide-react";
import { useRouter } from "next/navigation";
import type { LucideIcon } from 'lucide-react';
import Link from "next/link";

interface SectionCardProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  children: React.ReactNode;
}

const SectionCard = ({ title, description, icon: Icon, children }: SectionCardProps) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-3 font-headline text-xl">
        <Icon className="h-7 w-7 text-primary" />
        {title}
      </CardTitle>
      {description && <CardDescription>{description}</CardDescription>}
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

const aboutData = {
  about: {
    title: "About OSO",
    icon: Rocket,
    content: [
      "OSO App – India’s 1st Edu + Delivery SuperApp",
      "OSO is a next-gen education technology company designed for Bharat.",
      "We combine learning, delivery, brain wellness, and local fulfillment into one single smart app."
    ]
  },
  vision: {
    title: "Vision",
    icon: Flag,
    content: ["To make learning faster, accessible, and emotionally intelligent for every student in India."]
  },
  divisions: {
    title: "Core Divisions",
    icon: Briefcase,
    content: [
      "OSO EduCore™ – AI study tools, LMS, test engine",
      "OSO Fulfill™ – 45-minute academic delivery (notes, books)",
      "OSO BrainOS™ – Brain Scan, Mind Diary, Aura Map",
      "OSO PartnerGrid™ – Vendor App, School Panel, Rider App",
      "OSO Infra Cloud™ – School ERP, large-scale assessment systems"
    ]
  },
  services: {
    title: "Our Services",
    icon: Wand2,
    content: [
      "OSO Lite – Free for students: notes, tests, AI learning",
      "OSO SchoolX – For schools: smart dashboards, ERP",
      "OSO VendorPro – For local vendors: order/payout system",
      "OSO RiderEdge – For delivery partners",
      "OSO Cloud B2B – For education enterprises & government"
    ]
  },
  roadmap: {
    title: "Our Launch Plan",
    icon: Calendar,
    content: [
      "Aug–Sep: OSO Test Public School – Beta launch in Lucknow",
      "Oct: Onboard 10+ schools, 1000+ students",
      "Nov: Add 100+ vendors, 30+ riders, ERP pilot in 3 institutions"
    ]
  },
  unique: {
    title: "Why OSO is Unique",
    icon: Brain,
    content: [
      "Learn instantly using AI",
      "Get books, notes, pens in 45 minutes",
      "Monitor brain clarity, attention, and emotion",
      "Build local study pods using OSO Circle",
      "Reflect and grow with OSO Mind Diary"
    ]
  },
  partner: {
    title: "Partner With OSO",
    icon: Users,
    content: [
      { title: "For Schools", text: "Get OSO SchoolX Panel with library + student progress tools", icon: School, href: "/login?role=school" },
      { title: "For Vendors", text: "Sell academic items on OSO, get daily payouts", icon: Package, href: "/login?role=vendor" },
      { title: "For Riders", text: "Work flexibly, get bonuses for timely deliveries", icon: Bike, href: "/login?role=rider" }
    ]
  },
  next: {
    title: "What’s Next",
    icon: Heart,
    content: [
      "State-level LMS for govt tenders",
      "AI + Coding courses in regional languages",
      "OSO Live: Real-time tutoring + delivery sync",
      "5-City expansion by March 2026"
    ]
  }
};


export default function AboutPage() {
    const router = useRouter();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
                    <Rocket className="h-8 w-8 text-primary" />
                    <BilingualText en="About OSO" hi="OSO के बारे में" />
                </h1>
                 <Button variant="outline" onClick={() => router.back()}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    <BilingualText en="Back" hi="वापस"/>
                </Button>
            </div>

            <SectionCard title={aboutData.about.title} icon={aboutData.about.icon}>
                <p className="text-muted-foreground">{aboutData.about.content[1]}</p>
                <p className="mt-2 text-muted-foreground">{aboutData.about.content[2]}</p>
            </SectionCard>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <SectionCard title={aboutData.vision.title} icon={aboutData.vision.icon}>
                    <p className="font-semibold text-primary">{aboutData.vision.content[0]}</p>
                </SectionCard>
                 <SectionCard title={aboutData.divisions.title} icon={aboutData.divisions.icon}>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                        {aboutData.divisions.content.map((item, index) => <li key={index}>{item}</li>)}
                    </ul>
                </SectionCard>
            </div>

            <SectionCard title={aboutData.services.title} icon={aboutData.services.icon}>
                <ul className="space-y-2 text-sm text-muted-foreground">
                    {aboutData.services.content.map((item, index) => <li key={index} className="font-medium">{item}</li>)}
                </ul>
            </SectionCard>

            <SectionCard title={aboutData.roadmap.title} icon={aboutData.roadmap.icon}>
                 <ul className="space-y-1 text-sm text-muted-foreground">
                    {aboutData.roadmap.content.map((item, index) => <li key={index}>{item}</li>)}
                </ul>
            </SectionCard>

            <SectionCard title={aboutData.unique.title} icon={aboutData.unique.icon}>
                 <ul className="space-y-2 text-sm text-muted-foreground">
                    {aboutData.unique.content.map((item, index) => (
                        <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            </SectionCard>

            <SectionCard title={aboutData.partner.title} icon={aboutData.partner.icon}>
                <div className="space-y-4">
                    {aboutData.partner.content.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <Link key={index} href={item.href} className="block hover:bg-muted/70 rounded-lg transition-colors">
                                <div className="p-3 bg-muted/50 rounded-lg">
                                    <h4 className="font-semibold flex items-center gap-2 text-primary"><Icon className="h-5 w-5"/> {item.title}</h4>
                                    <p className="text-sm text-muted-foreground ml-7">{item.text}</p>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </SectionCard>

            <SectionCard title={aboutData.next.title} icon={aboutData.next.icon}>
                <ul className="space-y-1 text-sm text-muted-foreground">
                    {aboutData.next.content.map((item, index) => <li key={index}>{item}</li>)}
                </ul>
            </SectionCard>
        </div>
    );
}
