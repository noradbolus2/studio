
// src/app/(app)/school-dashboard/students/page.tsx
"use client";
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Users } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SchoolStudentsPage() {
  const router = useRouter();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-headline flex items-center gap-2">
          <Users className="h-7 w-7 text-primary" />
          <BilingualText en="Student Management" hi="छात्र प्रबंधन" />
        </h1>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          <BilingualText en="Back" hi="वापस" />
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle><BilingualText en="Students Overview" hi="छात्र अवलोकन" /></CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            <BilingualText 
              en="This page will display student lists, registration forms, attendance tracking, and other student-related management tools. Feature coming soon!" 
              hi="यह पृष्ठ छात्र सूचियाँ, पंजीकरण फॉर्म, उपस्थिति ट्रैकिंग और अन्य छात्र-संबंधित प्रबंधन उपकरण प्रदर्शित करेगा। यह सुविधा जल्द ही आ रही है!" 
            />
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
