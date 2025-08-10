
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookMarked, Bot, Target, Edit, History, Brain, Presentation, FileSignature, Lightbulb, ArrowRight } from "lucide-react";
import { BilingualText } from "@/components/shared/BilingualText";
import { PocketSchoolLoadingAnimation } from "@/components/shared/LoadingSpinner";
import Link from "next/link";

const studySections = [
  { titleEn: "AI Teacher", titleHi: "एआई शिक्षक", descriptionEn: "Interactive video lessons with AI avatars.", descriptionHi: "एआई अवतारों के साथ इंटरैक्टिव वीडियो पाठ।", icon: Presentation, ctaEn: "Start Learning", ctaHi: "सीखना शुरू करें", href: "/ai-teacher" },
  { titleEn: "Courses", titleHi: "पाठ्यक्रम", descriptionEn: "AI, Coding, NCERT & more", descriptionHi: "एआई, कोडिंग, एनसीईआरटी और अधिक", icon: BookMarked, ctaEn: "Explore Courses", ctaHi: "पाठ्यक्रम देखें", href: "/study/courses" },
  { titleEn: "Test Series", titleHi: "टेस्ट सीरीज़", descriptionEn: "AI Mocks & PYQs", descriptionHi: "एआई मॉक्स और पीवाईक्यू", icon: Target, ctaEn: "Attempt Tests", ctaHi: "टेस्ट दें", href: "/test-series" },
  { titleEn: "My Notes", titleHi: "मेरे नोट्स", descriptionEn: "Access your saved notes", descriptionHi: "अपने सहेजे गए नोट्स तक पहुंचें", icon: Edit, ctaEn: "View Notes", ctaHi: "नोट्स देखें", href: "/study/my-notes" },
  { titleEn: "Revision Vault", titleHi: "रिवीजन वॉल्ट", descriptionEn: "Review marked topics & ask doubts", descriptionHi: "चिह्नित विषय देखें और शंकाएं पूछें", icon: History, ctaEn: "Open Vault", ctaHi: "वॉल्ट खोलें", href: "/study/revision-vault" },
  { titleEn: "Brainmate™", titleHi: "ब्रेनमेट™", descriptionEn: "Concept Explanations", descriptionHi: "अवधारणा स्पष्टीकरण", icon: Brain, ctaEn: "Ask Brainmate", ctaHi: "ब्रेनमेट से पूछें", href: "/brainmate" },
  { titleEn: "Presentation Coach", titleHi: "प्रस्तुति कोच", descriptionEn: "Practice your public speaking skills.", descriptionHi: "अपने सार्वजनिक बोलने के कौशल का अभ्यास करें।", icon: Presentation, ctaEn: "Start Practice", ctaHi: "अभ्यास शुरू करें", href: "/presentation-coach" },
  { titleEn: "Kalam AI™ Handwriting", titleHi: "कलम AI™ हस्तलेखन", descriptionEn: "Convert typed text to your handwriting.", descriptionHi: "टाइप किए गए टेक्स्ट को अपनी लिखावट में बदलें।", icon: FileSignature, ctaEn: "Start Writing", ctaHi: "लिखना शुरू करें", href: "/handwriting-notes" },
  { titleEn: "Aura Map", titleHi: "ऑरा मैप", descriptionEn: "Check your Brain Fitness Score.", descriptionHi: "अपना ब्रेन फिटनेस स्कोर जांचें।", icon: Lightbulb, ctaEn: "View Aura Map", ctaHi: "ऑरा मैप देखें", href: "/brain-scan-report" },
];


export default function StudyPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
            <BilingualText en="Study Zone" hi="अध्ययन क्षेत्र" />
        </h1>
        <p className="text-muted-foreground">
            <BilingualText en="All your learning tools in one place." hi="आपके सभी शिक्षण उपकरण एक ही स्थान पर।" />
        </p>
      </header>

      <section>
        <h2 className="text-xl font-semibold mb-4 font-headline"><BilingualText en="Learning Sections" hi="शिक्षण अनुभाग" /></h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {studySections.map((section) => (
            <Card key={section.titleEn} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                    <section.icon className="h-7 w-7 text-primary" />
                    <CardTitle className="text-lg font-headline"><BilingualText en={section.titleEn} hi={section.titleHi} /></CardTitle>
                </div>
                <CardDescription><BilingualText en={section.descriptionEn} hi={section.descriptionHi} /></CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link href={section.href}>
                    <BilingualText en={section.ctaEn} hi={section.ctaHi} />
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      
    </div>
  );
}
