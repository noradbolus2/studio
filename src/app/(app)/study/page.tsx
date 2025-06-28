
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MindDiaryCard } from "@/components/shared/MindDiaryCard";
import { BookMarked, Bot, MessageCircleQuestion, DownloadCloud, Users, Edit, Languages, PlaySquare, ArrowRight, Brain, History } from "lucide-react";
import { BilingualText } from "@/components/shared/BilingualText";
import { PocketSchoolLoadingAnimation } from "@/components/shared/LoadingSpinner";
import Link from "next/link"; // Added Link

const studySections = [
  { titleEn: "Courses", titleHi: "पाठ्यक्रम", descriptionEn: "AI, Coding, NCERT & more", descriptionHi: "एआई, कोडिंग, एनसीईआरटी और अधिक", icon: BookMarked, ctaEn: "Explore Courses", ctaHi: "पाठ्यक्रम देखें", href: "/study/courses" },
  { titleEn: "My Notes", titleHi: "मेरे नोट्स", descriptionEn: "Access your saved notes", descriptionHi: "अपने सहेजे गए नोट्स तक पहुंचें", icon: Edit, ctaEn: "View Notes", ctaHi: "नोट्स देखें", href: "/study/my-notes" },
  { titleEn: "Revision Vault", titleHi: "रिवीजन वॉल्ट", descriptionEn: "Review marked topics & ask doubts", descriptionHi: "चिह्नित विषय देखें और शंकाएं पूछें", icon: History, ctaEn: "Open Vault", ctaHi: "वॉल्ट खोलें", href: "/study/revision-vault" },
  { titleEn: "Brainmate™", titleHi: "ब्रेनमेट™", descriptionEn: "Concept Explanations", descriptionHi: "अवधारणा स्पष्टीकरण", icon: Brain, ctaEn: "Ask Brainmate", ctaHi: "ब्रेनमेट से पूछें", href: "/brainmate" },
  { titleEn: "AI Tools", titleHi: "एआई उपकरण", descriptionEn: "Smart learning assistants", descriptionHi: "स्मार्ट शिक्षण सहायक", icon: Bot, ctaEn: "Use AI Tools", ctaHi: "एआई उपकरण का प्रयोग करें", href: "/ai-guruji" },
  { titleEn: "Live Doubt Solving", titleHi: "लाइव शंका समाधान", descriptionEn: "Get expert help instantly", descriptionHi: "तुरंत विशेषज्ञ सहायता प्राप्त करें", icon: MessageCircleQuestion, ctaEn: "Join Session", ctaHi: "सत्र में शामिल हों", href: "/live-classes/all" },
];

const courseHighlights = [
    { titleEn: "AI + Coding for Kids", titleHi: "बच्चों के लिए AI + कोडिंग", icon: Bot, detailsEn: "Language toggle: English, Hinglish, Regional + English", detailsHi: "भाषा टॉगल: अंग्रेजी, हिंग्लिश, क्षेत्रीय + अंग्रेजी" },
    { titleEn: "NCERT & State Board", titleHi: "NCERT और राज्य बोर्ड", icon: BookMarked, detailsEn: "Full syllabus coverage", detailsHi: "पूर्ण पाठ्यक्रम कवरेज" },
    { titleEn: "Previous Year Papers", titleHi: "पिछले वर्ष के प्रश्नपत्र", icon: Edit, detailsEn: "Practice with real exam questions", detailsHi: "वास्तविक परीक्षा प्रश्नों के साथ अभ्यास करें" },
    { titleEn: "Smart Voice-to-Notes", titleHi: "स्मार्ट वॉयस-टू-नोट्स", icon: Languages, detailsEn: "Hinglish + Regional language support", detailsHi: "हिंग्लिश + क्षेत्रीय भाषा समर्थन" },
    { titleEn: "Parent Mode", titleHi: "अभिभावक मोड", icon: PlaySquare, detailsEn: "Explainer videos for kids", detailsHi: "बच्चों के लिए व्याख्याता वीडियो" }
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

      <MindDiaryCard />

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
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline">
            <BookMarked className="h-7 w-7 text-primary" />
            <BilingualText en="Courses Highlights" hi="पाठ्यक्रम की मुख्य विशेषताएं" />
          </CardTitle>
          <CardDescription><BilingualText en="Key features available in our courses." hi="हमारे पाठ्यक्रमों में उपलब्ध मुख्य विशेषताएं।" /></CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {courseHighlights.map(highlight => (
            <div key={highlight.titleEn} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <highlight.icon className="h-6 w-6 text-accent mt-1 shrink-0" />
              <div>
                <h4 className="font-semibold"><BilingualText en={highlight.titleEn} hi={highlight.titleHi} /></h4>
                <p className="text-sm text-muted-foreground"><BilingualText en={highlight.detailsEn} hi={highlight.detailsHi} /></p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline">
            <DownloadCloud className="h-7 w-7 text-accent" />
            <BilingualText en="OSO Pocket School™" hi="OSO पॉकेट स्कूल™" />
          </CardTitle>
          <CardDescription>
            <BilingualText en="Offline learning engine. Access lessons anywhere, anytime." hi="ऑफ़लाइन शिक्षण इंजन। पाठों तक कहीं भी, कभी भी पहुँचें।" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Placeholder for Pocket School content or loading animation */}
          <PocketSchoolLoadingAnimation />
          <Button className="w-full mt-4" variant="outline">
            <BilingualText en="Manage Offline Content" hi="ऑफ़लाइन सामग्री प्रबंधित करें" />
          </Button>
        </CardContent>
      </Card>

    </div>
  );
}
