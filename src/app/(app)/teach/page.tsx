
// src/app/(app)/teach/page.tsx
"use client";

import { BilingualText } from "@/components/shared/BilingualText";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, PlusCircle, ListChecks, MessageCircleQuestion, BarChart3 } from "lucide-react";
import Link from "next/link";

export default function TeachDashboardPlaceholderPage() {
  return (
    <div className="space-y-8">
      <header className="text-center">
        <GraduationCap className="h-12 w-12 text-primary mx-auto mb-2" />
        <h1 className="text-3xl font-bold font-headline text-primary">
          <BilingualText en="OSO Coaching Panel" hi="OSO कोचिंग पैनल" />
        </h1>
        <p className="text-muted-foreground">
          <BilingualText en="Empowering educators to reach students across India." hi="शिक्षकों को पूरे भारत में छात्रों तक पहुंचने के लिए सशक्त बनाना।" />
        </p>
      </header>

      <Card className="text-center">
        <CardHeader>
          <CardTitle><BilingualText en="Coming Soon!" hi="जल्द आ रहा है!" /></CardTitle>
          <CardDescription>
            <BilingualText 
              en="This section is under active development. Soon, teachers will be able to create profiles, launch courses, and manage their student interactions here." 
              hi="यह अनुभाग सक्रिय विकास के अधीन है। जल्द ही, शिक्षक यहां प्रोफाइल बना सकेंगे, पाठ्यक्रम शुरू कर सकेंगे और अपने छात्र इंटरैक्शन का प्रबंधन कर सकेंगे।" 
            />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            <BilingualText 
              en="Key features will include:" 
              hi="मुख्य विशेषताओं में शामिल होंगे:" 
            />
          </p>
          <ul className="list-disc list-inside text-left text-muted-foreground max-w-md mx-auto text-sm space-y-1">
            <li><BilingualText en="Teacher Profile Management" hi="शिक्षक प्रोफ़ाइल प्रबंधन" /></li>
            <li><BilingualText en="Course Creation (Live & Recorded)" hi="पाठ्यक्रम निर्माण (लाइव और रिकॉर्डेड)" /></li>
            <li><BilingualText en="Doubt Solving Portal" hi="शंका समाधान पोर्टल" /></li>
            <li><BilingualText en="Exam-Specific Resource Hub" hi="परीक्षा-विशिष्ट संसाधन केंद्र" /></li>
            <li><BilingualText en="Performance Analytics" hi="प्रदर्शन एनालिटिक्स" /></li>
          </ul>
           <Button className="mt-6" asChild>
            <Link href="/">
                <BilingualText en="Back to Home" hi="होम पर वापस"/>
            </Link>
           </Button>
        </CardContent>
      </Card>
    </div>
  );
}
