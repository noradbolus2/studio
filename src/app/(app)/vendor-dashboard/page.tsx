
// src/app/(app)/vendor-dashboard/page.tsx
"use client";

import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Briefcase, PackageCheck, PackagePlus, IndianRupee, ArrowRight, ListChecks, ShoppingBag, BarChart3, Bell, MessageSquare, UploadCloud } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

const vendorStats = [
  { id: "pending_orders", labelEn: "Pending Orders", labelHi: "लंबित आदेश", value: "12", icon: ListChecks, color: "text-orange-500" },
  { id: "active_listings", labelEn: "Active Listings", labelHi: "सक्रिय लिस्टिंग", value: "150+", icon: PackageCheck, color: "text-blue-500" },
  { id: "total_revenue", labelEn: "Monthly Revenue", labelHi: "मासिक राजस्व", value: "₹25,600", icon: IndianRupee, color: "text-green-500" },
];

const vendorActions = [
  { id: "manage_products", labelEn: "Manage Products", labelHi: "उत्पाद प्रबंधित करें", icon: UploadCloud, href: "/vendor-dashboard/products" },
  { id: "view_orders", labelEn: "View Orders", labelHi: "आदेश देखें", icon: ShoppingBag, href: "/vendor-dashboard/orders" },
  { id: "reports_analytics", labelEn: "Sales Reports", labelHi: "बिक्री रिपोर्ट", icon: BarChart3, href: "/vendor-dashboard/reports" },
  { id: "notifications", labelEn: "Notifications", labelHi: "सूचनाएं", icon: Bell, href: "/vendor-dashboard/notifications" },
  { id: "customer_queries", labelEn: "Customer Queries", labelHi: "ग्राहक प्रश्न", icon: MessageSquare, href: "/vendor-dashboard/queries" },
];

export default function VendorDashboardPage() {
  const { toast } = useToast();

  const handleActionClick = (href: string, labelEn: string) => {
    toast({
        title: "Navigating (Simulated)",
        description: `This would navigate to ${labelEn}. Page not yet implemented.`,
    });
    // router.push(href); // Uncomment when pages are ready
  };

  return (
    <div className="space-y-8">
      <header className="text-center">
        <Briefcase className="h-12 w-12 text-primary mx-auto mb-2" />
        <h1 className="text-3xl font-bold font-headline text-primary">
          <BilingualText en="Vendor Dashboard" hi="विक्रेता डैशबोर्ड" />
        </h1>
        <p className="text-muted-foreground">
          <BilingualText en="Manage your products, orders, and earnings efficiently." hi="अपने उत्पादों, आदेशों और कमाई का कुशलतापूर्वक प्रबंधन करें।" />
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {vendorStats.map(stat => (
          <Card key={stat.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium"><BilingualText en={stat.labelEn} hi={stat.labelHi} /></CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              {/* <p className="text-xs text-muted-foreground">+5 from yesterday</p> */}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
            <CardTitle className="font-headline"><BilingualText en="Quick Actions" hi="त्वरित कार्रवाइयां"/></CardTitle>
            <CardDescription><BilingualText en="Access key vendor modules." hi="प्रमुख विक्रेता मॉड्यूल तक पहुंचें।" /></CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
             {vendorActions.map(action => (
                <Button 
                    key={action.id} 
                    variant="outline" 
                    className="h-auto py-4 flex flex-col items-center justify-center text-center gap-2 hover:bg-primary/5 hover:border-primary"
                    onClick={() => handleActionClick(action.href, action.labelEn)}
                >
                    <action.icon className="h-7 w-7 text-primary mb-1"/>
                    <span className="text-xs font-medium"><BilingualText en={action.labelEn} hi={action.labelHi} /></span>
                </Button>
            ))}
        </CardContent>
      </Card>

       <Card>
        <CardHeader>
            <CardTitle className="font-headline"><BilingualText en="Recent Orders" hi="हाल के आदेश" /></CardTitle>
            <CardDescription><BilingualText en="A quick look at your latest incoming orders." hi="आपके नवीनतम आने वाले आदेशों पर एक त्वरित नज़र।" /></CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground text-sm text-center py-4">
                <BilingualText en="[Order list placeholder - e.g., Order #123 - 3 items, Order #124 - 1 item]" hi="[ऑर्डर सूची प्लेसहोल्डर - जैसे, ऑर्डर #123 - 3 आइटम, ऑर्डर #124 - 1 आइटम]" />
            </p>
            <Button asChild variant="link" className="w-full justify-center p-0 mt-2">
                 <Link href="/vendor-dashboard/orders">
                    <BilingualText en="View All Orders" hi="सभी आदेश देखें" /> <ArrowRight className="ml-1 h-4 w-4"/>
                 </Link>
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
