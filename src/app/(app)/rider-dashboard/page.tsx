
// src/app/(app)/rider-dashboard/page.tsx
import { BilingualText } from "@/components/shared/BilingualText";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Bike } from "lucide-react";

export default function RiderDashboardPage() {
  return (
    <div className="space-y-6">
      <header className="text-center">
        <Bike className="h-12 w-12 text-orange-600 mx-auto mb-2" />
        <h1 className="text-3xl font-bold font-headline text-orange-600">
          <BilingualText en="Rider Dashboard" hi="राइडर डैशबोर्ड" />
        </h1>
        <p className="text-muted-foreground">
          <BilingualText en="Manage your deliveries and earnings." hi="अपनी डिलीवरी और कमाई का प्रबंधन करें।" />
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle><BilingualText en="Active Deliveries" hi="सक्रिय डिलीवरी" /></CardTitle>
          <CardDescription><BilingualText en="View and manage ongoing deliveries." hi="चल रही डिलीवरी देखें और प्रबंधित करें।" /></CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground"><BilingualText en="Your current delivery tasks will appear here." hi="आपके वर्तमान डिलीवरी कार्य यहां दिखाई देंगे।" /></p>
        </CardContent>
      </Card>
       <Card>
        <CardHeader>
          <CardTitle><BilingualText en="Earnings" hi="कमाई" /></CardTitle>
          <CardDescription><BilingualText en="Track your delivery earnings." hi="अपनी डिलीवरी आय को ट्रैक करें।" /></CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground"><BilingualText en="Your earnings summary will be shown here." hi="आपकी कमाई का सारांश यहां दिखाया जाएगा।" /></p>
        </CardContent>
      </Card>
    </div>
  );
}

    