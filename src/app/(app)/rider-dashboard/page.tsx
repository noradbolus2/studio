
// src/app/(app)/rider-dashboard/page.tsx
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Bike, ListChecks, CheckCircle, XCircle, MapPin, Wallet } from "lucide-react";
import Link from "next/link";

export default function RiderDashboardPage() {
  const activeDeliveries = [
    { id: "ORD123", items: 3, address: "123 Main St, Anytown", status: "Pending Pickup" },
    { id: "ORD456", items: 1, address: "456 Oak Ave, Anytown", status: "Out for Delivery" },
  ];

  return (
    <div className="space-y-8">
      <header className="text-center">
        <Bike className="h-12 w-12 text-orange-600 mx-auto mb-2" />
        <h1 className="text-3xl font-bold font-headline text-orange-600">
          <BilingualText en="Rider Dashboard" hi="राइडर डैशबोर्ड" />
        </h1>
        <p className="text-muted-foreground">
          <BilingualText en="Manage your deliveries and earnings on the go." hi="चलते-फिरते अपनी डिलीवरी और कमाई का प्रबंधन करें।" />
        </p>
      </header>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline">
            <ListChecks className="text-primary h-6 w-6" />
            <BilingualText en="Active Deliveries" hi="सक्रिय डिलीवरी" />
          </CardTitle>
          <CardDescription>
            <BilingualText en="View and manage ongoing deliveries." hi="चल रही डिलीवरी देखें और प्रबंधित करें।" />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {activeDeliveries.length > 0 ? activeDeliveries.map(delivery => (
            <Card key={delivery.id} className="bg-muted/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-md"><BilingualText en={`Order ID: ${delivery.id}`} hi={`ऑर्डर आईडी: ${delivery.id}`} /></CardTitle>
                <CardDescription>{delivery.address}</CardDescription>
              </CardHeader>
              <CardContent className="pb-3">
                <p className="text-sm"><BilingualText en={`${delivery.items} items`} hi={`${delivery.items} आइटम`} /> - <span className="font-medium text-orange-600">{delivery.status}</span></p>
              </CardContent>
              <CardFooter className="flex gap-2 justify-end">
                <Button size="sm" variant="outline" className="border-red-500 text-red-500 hover:bg-red-500/10 hover:text-red-500">
                  <XCircle className="mr-1 h-4 w-4" /> <BilingualText en="Reject" hi="अस्वीकार" />
                </Button>
                <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white">
                  <CheckCircle className="mr-1 h-4 w-4" /> <BilingualText en="Accept" hi="स्वीकार" />
                </Button>
              </CardFooter>
            </Card>
          )) : (
            <p className="text-muted-foreground text-sm text-center py-4">
              <BilingualText en="No active deliveries at the moment." hi="फिलहाल कोई सक्रिय डिलीवरी नहीं है।" />
            </p>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline">
                    <MapPin className="text-accent h-6 w-6" />
                    <BilingualText en="Delivery Map" hi="डिलीवरी मानचित्र" />
                </CardTitle>
                <CardDescription><BilingualText en="Real-time location of deliveries." hi="डिलीवरी का वास्तविक समय स्थान।" /></CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-48 bg-muted rounded-md flex items-center justify-center text-muted-foreground">
                    <BilingualText en="[Map Placeholder - Integration Required]" hi="[मानचित्र प्लेसहोल्डर - एकीकरण आवश्यक]" />
                </div>
            </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline">
                    <Wallet className="text-green-500 h-6 w-6" />
                    <BilingualText en="Earnings" hi="कमाई" />
                </CardTitle>
                <CardDescription><BilingualText en="Your current earnings and history." hi="आपकी वर्तमान कमाई और इतिहास।" /></CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-lg font-bold text-green-600">INR 250.00</p>
                <p className="text-xs text-muted-foreground"><BilingualText en="Today's Earnings" hi="आज की कमाई" /></p>
                <Button variant="link" className="p-0 h-auto mt-2 text-orange-600"><BilingualText en="View Earning History" hi="कमाई का इतिहास देखें" /></Button>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

