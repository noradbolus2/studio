
"use client";

import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileCog } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ContentModerationPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-headline flex items-center gap-2">
          <FileCog className="h-7 w-7 text-primary" />
          <BilingualText en="Content Moderation" hi="सामग्री मॉडरेशन" />
        </h1>
        <Button variant="outline" onClick={() => router.push('/platform-admin')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          <BilingualText en="Back to Admin" hi="एडमिन पर वापस" />
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle><BilingualText en="Review Content" hi="सामग्री की समीक्षा करें" /></CardTitle>
          <CardDescription><BilingualText en="Review and manage user-generated content, courses, and projects." hi="उपयोगकर्ता-जनित सामग्री, पाठ्यक्रम और परियोजनाओं की समीक्षा और प्रबंधन करें।" /></CardDescription>
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
