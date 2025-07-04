// src/app/(app)/vendor-dashboard/coaching-kits/page.tsx
"use client";
import { useState } from "react";
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowLeft, PackagePlus, Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface CoachingKit {
  id: string;
  title: string;
  coachingCenterName: string;
  items: string[];
  price: number;
}

const mockKits: CoachingKit[] = [
  { id: "KIT001", title: "XYZ NEET Coaching Class Kit", coachingCenterName: "XYZ Classes", items: ["Physics Vol 1", "Chemistry Notes", "Biology Question Bank"], price: 1499 },
  { id: "KIT002", title: "ABC JEE Foundation Kit", coachingCenterName: "ABC Academy", items: ["Maths Foundation", "Physics Concepts", "Practice File"], price: 1299 },
];

export default function CoachingKitsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [kits, setKits] = useState<CoachingKit[]>(mockKits);
  // ... state for dialog and new kit form

  const handleDeleteKit = (kitId: string, kitTitle: string) => {
    // ... logic to delete
    setKits(prev => prev.filter(k => k.id !== kitId));
    toast({ title: "Kit Deleted", description: `"${kitTitle}" has been removed.`});
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-headline flex items-center gap-2">
          <PackagePlus className="h-7 w-7 text-primary" />
          <BilingualText en="Coaching Kits & Packs" hi="कोचिंग किट और पैक" />
        </h1>
        <Button variant="outline" onClick={() => router.push('/vendor-dashboard')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          <BilingualText en="Back to Dashboard" hi="डैशबोर्ड पर वापस" />
        </Button>
      </div>
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
            <div>
                <CardTitle><BilingualText en="Manage Institute Kits" hi="संस्थान किट प्रबंधित करें" /></CardTitle>
                <CardDescription><BilingualText en="Create and manage study kits for specific coaching centers." hi="विशिष्ट कोचिंग केंद्रों के लिए अध्ययन किट बनाएं और प्रबंधित करें।" /></CardDescription>
            </div>
            <Button><PlusCircle className="mr-2 h-4 w-4"/> Create Kit</Button>
        </CardHeader>
        <CardContent className="space-y-3">
            {kits.map(kit => (
                <Card key={kit.id} className="p-4 flex justify-between items-center">
                    <div>
                        <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{kit.title}</h4>
                            <Badge variant="secondary">{kit.coachingCenterName}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{kit.items.join(', ')}</p>
                        <p className="font-bold text-primary mt-1">₹{kit.price}</p>
                    </div>
                    <div className="flex gap-1">
                        <Button variant="ghost" size="icon"><Edit className="h-4 w-4"/></Button>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDeleteKit(kit.id, kit.title)}>
                            <Trash2 className="h-4 w-4"/>
                        </Button>
                    </div>
                </Card>
            ))}
        </CardContent>
      </Card>
    </div>
  );
}
