
// src/app/(app)/student-dashboard/page.tsx
import { BilingualText } from "@/components/shared/BilingualText";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { School } from "lucide-react";

export default function StudentDashboardPage() {
  return (
    <div className="space-y-6">
      <header className="text-center">
        <School className="h-12 w-12 text-primary mx-auto mb-2" />
        <h1 className="text-3xl font-bold font-headline text-primary">
          <BilingualText en="Student Dashboard" hi="छात्र डैशबोर्ड" />
        </h1>
        <p className="text-muted-foreground">
          <BilingualText en="Welcome, Student! Access your learning tools here." hi="आपका स्वागत है, छात्र! अपने शिक्षण उपकरण यहाँ एक्सेस करें।" />
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle><BilingualText en="My Courses" hi="मेरे पाठ्यक्रम" /></CardTitle>
          <CardDescription><BilingualText en="Continue your learning journey." hi="अपनी सीखने की यात्रा जारी रखें।" /></CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground"><BilingualText en="Your enrolled courses will appear here." hi="आपके नामांकित पाठ्यक्रम यहां दिखाई देंगे।" /></p>
        </CardContent>
      </Card>
       <Card>
        <CardHeader>
          <CardTitle><BilingualText en="Progress" hi="प्रगति" /></CardTitle>
          <CardDescription><BilingualText en="Track your academic performance." hi="अपने शैक्षणिक प्रदर्शन को ट्रैक करें।" /></CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground"><BilingualText en="Your progress reports and analytics will be shown here." hi="आपकी प्रगति रिपोर्ट और एनालिटिक्स यहां दिखाए जाएंगे।" /></p>
        </CardContent>
      </Card>
    </div>
  );
}

    