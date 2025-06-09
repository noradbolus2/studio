
// src/app/(app)/school-dashboard/timetable/page.tsx
"use client";
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SchoolTimetablePage() {
  const router = useRouter();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-headline flex items-center gap-2">
          <CalendarDays className="h-7 w-7 text-primary" />
          <BilingualText en="Manage Timetable" hi="समय सारिणी प्रबंधित करें" />
        </h1>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          <BilingualText en="Back" hi="वापस" />
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle><BilingualText en="Class Timetables" hi="कक्षा समय सारिणी" /></CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            <BilingualText 
              en="This page will allow creating and managing class schedules, teacher assignments, and viewing timetables. Feature coming soon!" 
              hi="यह पृष्ठ कक्षा शेड्यूल, शिक्षक असाइनमेंट बनाने और प्रबंधित करने और समय सारिणी देखने की अनुमति देगा। यह सुविधा जल्द ही आ रही है!" 
            />
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
