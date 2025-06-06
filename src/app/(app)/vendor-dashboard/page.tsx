
// src/app/(app)/vendor-dashboard/page.tsx
import { BilingualText } from "@/components/shared/BilingualText";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Briefcase } from "lucide-react";

export default function VendorDashboardPage() {
  return (
    <div className="space-y-6">
      <header className="text-center">
        <Briefcase className="h-12 w-12 text-green-600 mx-auto mb-2" />
        <h1 className="text-3xl font-bold font-headline text-green-600">
          <BilingualText en="Vendor Dashboard" hi="विक्रेता डैशबोर्ड" />
        </h1>
        <p className="text-muted-foreground">
          <BilingualText en="Manage your products and orders." hi="अपने उत्पादों और आदेशों का प्रबंधन करें।" />
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle><BilingualText en="Product Listings" hi="उत्पाद सूची" /></CardTitle>
          <CardDescription><BilingualText en="View and manage your inventory." hi="अपनी इन्वेंट्री देखें और प्रबंधित करें।" /></CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground"><BilingualText en="Your product management tools will be here." hi="आपके उत्पाद प्रबंधन उपकरण यहां होंगे।" /></p>
        </CardContent>
      </Card>
       <Card>
        <CardHeader>
          <CardTitle><BilingualText en="Orders" hi="आदेश" /></CardTitle>
          <CardDescription><BilingualText en="Process and track customer orders." hi="ग्राहक आदेशों को संसाधित और ट्रैक करें।" /></CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground"><BilingualText en="Order management system will be displayed here." hi="ऑर्डर प्रबंधन प्रणाली यहां प्रदर्शित की जाएगी।" /></p>
        </CardContent>
      </Card>
    </div>
  );
}

    