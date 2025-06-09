
// src/app/(app)/school-dashboard/announcements/page.tsx
"use client";
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Bell } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SchoolAnnouncementsPage() {
  const router = useRouter();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-headline flex items-center gap-2">
          <Bell className="h-7 w-7 text-primary" />
          <BilingualText en="Post Announcements" hi="घोषणाएँ पोस्ट करें" />
        </h1>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          <BilingualText en="Back" hi="वापस" />
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle><BilingualText en="Manage Announcements" hi="घोषणाएँ प्रबंधित करें" /></CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            <BilingualText 
              en="This page will allow creating, scheduling, and viewing school-wide announcements. Feature coming soon!" 
              hi="यह पृष्ठ स्कूल-व्यापी घोषणाएँ बनाने, शेड्यूल करने और देखने की अनुमति देगा। यह सुविधा जल्द ही आ रही है!" 
            />
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
