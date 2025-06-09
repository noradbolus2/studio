
// src/app/(app)/school-dashboard/staff/page.tsx
"use client";
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, UserCog } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SchoolStaffPage() {
  const router = useRouter();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-headline flex items-center gap-2">
          <UserCog className="h-7 w-7 text-primary" />
          <BilingualText en="Staff Management" hi="कर्मचारी प्रबंधन" />
        </h1>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          <BilingualText en="Back" hi="वापस" />
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle><BilingualText en="Staff Overview" hi="कर्मचारी अवलोकन" /></CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            <BilingualText 
              en="This page will display staff lists, role assignments, payroll information, and other staff-related management tools. Feature coming soon!" 
              hi="यह पृष्ठ कर्मचारी सूचियाँ, भूमिका असाइनमेंट, पेरोल जानकारी और अन्य कर्मचारी-संबंधित प्रबंधन उपकरण प्रदर्शित करेगा। यह सुविधा जल्द ही आ रही है!" 
            />
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
