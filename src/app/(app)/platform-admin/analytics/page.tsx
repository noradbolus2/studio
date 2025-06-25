
"use client";

import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BarChart3 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PlatformAnalyticsPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-headline flex items-center gap-2">
          <BarChart3 className="h-7 w-7 text-primary" />
          <BilingualText en="Platform Analytics" hi="प्लेटफ़ॉर्म एनालिटिक्स" />
        </h1>
        <Button variant="outline" onClick={() => router.push('/platform-admin')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          <BilingualText en="Back to Admin" hi="एडमिन पर वापस" />
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle><BilingualText en="Analytics Dashboard" hi="एनालिटिक्स डैशबोर्ड" /></CardTitle>
          <CardDescription><BilingualText en="View key metrics and insights about the platform's performance." hi="प्लेटफ़ॉर्म के प्रदर्शन के बारे में प्रमुख मीट्रिक्स और अंतर्दृष्टि देखें।" /></CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground text-center py-8">
                <BilingualText en="This feature is under construction. Check back soon!" hi="यह सुविधा निर्माणाधीन है। जल्द ही वापस देखें!" />
            </p>
        </CardContent>
      </Card>
    </div>
  );
}
