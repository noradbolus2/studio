
// src/app/(app)/vendor-dashboard/page.tsx
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Briefcase, PackageCheck, PackagePlus, IndianRupee, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function VendorDashboardPage() {
  return (
    <div className="space-y-8">
      <header className="text-center">
        <Briefcase className="h-12 w-12 text-green-600 mx-auto mb-2" />
        <h1 className="text-3xl font-bold font-headline text-green-600">
          <BilingualText en="Vendor Dashboard" hi="विक्रेता डैशबोर्ड" />
        </h1>
        <p className="text-muted-foreground">
          <BilingualText en="Manage your products and orders efficiently." hi="अपने उत्पादों और आदेशों का कुशलतापूर्वक प्रबंधन करें।" />
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <PackageCheck className="text-primary h-6 w-6" />
              <BilingualText en="New Orders" hi="नए आदेश" />
            </CardTitle>
            <CardDescription>
              <BilingualText en="View and process incoming customer orders." hi="आने वाले ग्राहक आदेश देखें और संसाधित करें।" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
                <BilingualText en="You have 5 new orders waiting for processing." hi="आपके पास 5 नए ऑर्डर प्रोसेसिंग के लिए इंतजार कर रहे हैं।" />
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href="#">
                <BilingualText en="View Orders" hi="आदेश देखें" /> <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <PackagePlus className="text-accent h-6 w-6" />
              <BilingualText en="Stock Update" hi="स्टॉक अपडेट" />
            </CardTitle>
            <CardDescription>
              <BilingualText en="Manage your inventory and add new products." hi="अपनी इन्वेंट्री प्रबंधित करें और नए उत्पाद जोड़ें।" />
            </CardDescription>
          </CardHeader>
          <CardContent>
             <p className="text-muted-foreground text-sm">
                <BilingualText en="Update stock levels or add new items to your store." hi="स्टॉक स्तर अपडेट करें या अपने स्टोर में नए आइटम जोड़ें।" />
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="#">
                <BilingualText en="Manage Products" hi="उत्पाद प्रबंधित करें" /> <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <IndianRupee className="text-green-500 h-6 w-6" />
              <BilingualText en="Earnings" hi="कमाई" />
            </CardTitle>
            <CardDescription>
              <BilingualText en="Track your sales and revenue." hi="अपनी बिक्री और राजस्व को ट्रैक करें।" />
            </CardDescription>
          </CardHeader>
          <CardContent>
             <p className="text-muted-foreground text-sm">
                <BilingualText en="Total earnings this month: INR 12,500" hi="इस महीने की कुल कमाई: INR 12,500" />
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="secondary" className="w-full">
              <Link href="#">
                <BilingualText en="View Reports" hi="रिपोर्ट देखें" /> <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

