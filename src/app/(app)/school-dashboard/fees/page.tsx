
// src/app/(app)/school-dashboard/fees/page.tsx
"use client";
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SchoolFeesPage() {
  const router = useRouter();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-headline flex items-center gap-2">
          <FileText className="h-7 w-7 text-primary" />
          <BilingualText en="Fee Collection" hi="शुल्क संग्रह" />
        </h1>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          <BilingualText en="Back" hi="वापस" />
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle><BilingualText en="Fee Management" hi="शुल्क प्रबंधन" /></CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            <BilingualText 
              en="This page will allow managing fee structures, tracking payments, sending reminders, and generating fee receipts. Feature coming soon!" 
              hi="यह पृष्ठ शुल्क संरचनाओं का प्रबंधन करने, भुगतानों को ट्रैक करने, अनुस्मारक भेजने और शुल्क रसीदें बनाने की अनुमति देगा। यह सुविधा जल्द ही आ रही है!" 
            />
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
