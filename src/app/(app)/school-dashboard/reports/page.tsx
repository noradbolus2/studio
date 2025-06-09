
// src/app/(app)/school-dashboard/reports/page.tsx
"use client";
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BarChart3 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SchoolReportsPage() {
  const router = useRouter();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-headline flex items-center gap-2">
          <BarChart3 className="h-7 w-7 text-primary" />
          <BilingualText en="View Reports" hi="रिपोर्ट देखें" />
        </h1>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          <BilingualText en="Back" hi="वापस" />
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle><BilingualText en="School Analytics & Reports" hi="स्कूल एनालिटिक्स और रिपोर्ट" /></CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            <BilingualText 
              en="This page will display various school reports, including student performance, attendance, financial summaries, and more. Feature coming soon!" 
              hi="यह पृष्ठ विभिन्न स्कूल रिपोर्ट प्रदर्शित करेगा, जिसमें छात्र प्रदर्शन, उपस्थिति, वित्तीय सारांश, और बहुत कुछ शामिल है। यह सुविधा जल्द ही आ रही है!" 
            />
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
