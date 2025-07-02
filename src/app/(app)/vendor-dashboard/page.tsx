
// src/app/(app)/vendor-dashboard/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Briefcase, PackageCheck, PackagePlus, IndianRupee, ArrowRight, ListChecks, ShoppingBag, BarChart3, Bell, MessageSquare, UploadCloud, Edit } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import type { ProfileFormData as VendorProfileFormData } from '../edit-profile/page'; 
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Badge } from "@/components/ui/badge"; 

const vendorStats = [
  { id: "pending_orders", labelEn: "Pending Orders", labelHi: "लंबित आदेश", value: "12", icon: ListChecks, color: "text-orange-500" },
  { id: "active_listings", labelEn: "Active Listings", labelHi: "सक्रिय लिस्टिंग", value: "150+", icon: PackageCheck, color: "text-blue-500" },
  { id: "total_revenue", labelEn: "Monthly Revenue", labelHi: "मासिक राजस्व", value: "INR 25,600", icon: IndianRupee, color: "text-green-500" },
];

const vendorActions = [
  { id: "manage_products", labelEn: "Manage Products", labelHi: "उत्पाद प्रबंधित करें", icon: UploadCloud, href: "/vendor-dashboard/products" },
  { id: "view_orders", labelEn: "View Orders", labelHi: "आदेश देखें", icon: ShoppingBag, href: "/vendor-dashboard/orders" },
  { id: "reports_analytics", labelEn: "Sales Reports", labelHi: "बिक्री रिपोर्ट", icon: BarChart3, href: "/vendor-dashboard/reports" },
  { id: "notifications", labelEn: "Notifications", labelHi: "सूचनाएं", icon: Bell, href: "/vendor-dashboard/notifications" },
  { id: "customer_queries", labelEn: "Customer Queries", labelHi: "ग्राहक प्रश्न", icon: MessageSquare, href: "/vendor-dashboard/queries" },
];

interface RecentOrder {
    id: string;
    items: number;
    amount: number;
    status: "Pending" | "Processing" | "Shipped";
}

const mockRecentOrders: RecentOrder[] = [
    { id: "ORD78923", items: 3, amount: 245, status: "Pending" },
    { id: "ORD78924", items: 1, amount: 99, status: "Processing" },
    { id: "ORD78925", items: 5, amount: 550, status: "Shipped" },
];


export default function VendorDashboardPage() {
  const router = useRouter();
  const [vendorProfile, setVendorProfile] = useState<VendorProfileFormData | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedProfileString = localStorage.getItem('userProfileData');
      if (storedProfileString) {
        try {
          const parsedProfile = JSON.parse(storedProfileString);
          if (parsedProfile.role === 'vendor') {
            setVendorProfile(parsedProfile);
          }
        } catch (e) {
          console.error("Failed to parse vendor profile from localStorage", e);
        }
      }
    }
    setLoadingProfile(false);
  }, []);

  const handleActionClick = (href: string) => {
    router.push(href);
  };
  
  if (loadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <LoadingSpinner size={48} />
        <p className="ml-4">Loading dashboard...</p>
      </div>
    );
  }


  return (
    <div className="space-y-8">
      <header className="text-center">
        <Briefcase className="h-12 w-12 text-primary mx-auto mb-2" />
        <h1 className="text-3xl font-bold font-headline text-primary">
          {vendorProfile?.businessName || <BilingualText en="Vendor Dashboard" hi="विक्रेता डैशबोर्ड" />}
        </h1>
        <p className="text-muted-foreground">
          <BilingualText en="Manage your products, orders, and earnings efficiently." hi="अपने उत्पादों, आदेशों और कमाई का कुशलतापूर्वक प्रबंधन करें।" />
        </p>
         <Button asChild variant="outline" size="sm" className="mt-2">
            <Link href="/edit-profile?role=vendor">
                <Edit className="mr-2 h-4 w-4"/>
                <BilingualText en="Edit Vendor Info" hi="विक्रेता जानकारी संपादित करें" />
            </Link>
        </Button>
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
                    onClick={() => handleActionClick(action.href)}
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
        <CardContent className="space-y-3">
            {mockRecentOrders.length > 0 ? mockRecentOrders.map(order => (
                <Card key={order.id} className="p-3 bg-muted/30 flex justify-between items-center">
                    <div>
                        <p className="text-sm font-medium text-foreground">Order #{order.id}</p>
                        <p className="text-xs text-muted-foreground">{order.items} items - INR {order.amount.toFixed(2)}</p>
                    </div>
                    <Badge variant={order.status === "Shipped" ? "default" : order.status === "Processing" ? "secondary" : "outline"}
                           className={order.status === "Shipped" ? "bg-green-500 text-white" : order.status === "Processing" ? "bg-blue-500 text-white" : ""}>
                        {order.status}
                    </Badge>
                </Card>
            )) : (
                 <p className="text-muted-foreground text-sm text-center py-4">
                    <BilingualText en="No recent orders." hi="कोई हालिया आदेश नहीं।" />
                </p>
            )}
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
