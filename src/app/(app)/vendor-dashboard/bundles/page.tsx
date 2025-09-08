
// src/app/(app)/vendor-dashboard/bundles/page.tsx
"use client";
import { useState } from "react";
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowLeft, Gift, PlusCircle, Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface Bundle {
  id: string;
  title: string;
  items: string[];
  price: number;
  category: 'Exam' | 'Festival' | 'Admission';
}

const mockBundles: Bundle[] = [];

export default function VendorBundlesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [bundles, setBundles] = useState<Bundle[]>(mockBundles);
  // ... state for dialog and new bundle form

  const handleDeleteBundle = (bundleId: string, bundleTitle: string) => {
    // ... logic to delete
    setBundles(prev => prev.filter(b => b.id !== bundleId));
    toast({ title: "Bundle Deleted", description: `"${bundleTitle}" has been removed.`});
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-headline flex items-center gap-2">
          <Gift className="h-7 w-7 text-primary" />
          <BilingualText en="Manage Bundles & Kits" hi="बंडल और किट प्रबंधित करें" />
        </h1>
        <Button variant="outline" onClick={() => router.push('/vendor-dashboard')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          <BilingualText en="Back to Dashboard" hi="डैशबोर्ड पर वापस" />
        </Button>
      </div>
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
            <div>
                <CardTitle><BilingualText en="Your Custom Bundles" hi="आपके कस्टम बंडल" /></CardTitle>
                <CardDescription><BilingualText en="Create and manage seasonal or exam-based kits." hi="मौसमी या परीक्षा-आधारित किट बनाएं और प्रबंधित करें।" /></CardDescription>
            </div>
            <Button><PlusCircle className="mr-2 h-4 w-4"/> Create Bundle</Button>
        </CardHeader>
        <CardContent className="space-y-3">
            {bundles.length > 0 ? bundles.map(bundle => (
                <Card key={bundle.id} className="p-4 flex justify-between items-center">
                    <div>
                        <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{bundle.title}</h4>
                            <Badge variant="secondary">{bundle.category}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{bundle.items.join(', ')}</p>
                        <p className="font-bold text-primary mt-1">INR {bundle.price}</p>
                    </div>
                    <div className="flex gap-1">
                        <Button variant="ghost" size="icon"><Edit className="h-4 w-4"/></Button>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDeleteBundle(bundle.id, bundle.title)}>
                            <Trash2 className="h-4 w-4"/>
                        </Button>
                    </div>
                </Card>
            )) : (
              <div className="text-center py-10 text-muted-foreground">
                <p><BilingualText en="No bundles created yet. Click 'Create Bundle' to start." hi="अभी तक कोई बंडल नहीं बनाया गया है। आरंभ करने के लिए 'बंडल बनाएं' पर क्लिक करें।" /></p>
              </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
