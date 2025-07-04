// src/app/(app)/vendor-dashboard/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
    Briefcase, PackageCheck, PackagePlus, IndianRupee, ArrowRight, ListChecks, ShoppingBag, BarChart3, Bell, MessageSquare, UploadCloud, Edit, Power, Radio, Users, Lightbulb, Clock, School
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import type { ProfileFormData as VendorProfileFormData } from '../edit-profile/page'; 
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Switch } from "@/components/ui/switch";
import { Label } from '@/components/ui/label';

const vendorActions = [
  { id: "manage_products", labelEn: "Manage Products", labelHi: "उत्पाद प्रबंधित करें", icon: UploadCloud, href: "/vendor-dashboard/products" },
  { id: "view_orders", labelEn: "View Orders", labelHi: "आदेश देखें", icon: ShoppingBag, href: "/vendor-dashboard/orders" },
  { id: "uniforms", labelEn: "School Uniforms", labelHi: "स्कूल यूनिफ़ॉर्म", icon: School, href: "/vendor-dashboard/uniforms" },
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
  const [isStoreOpen, setIsStoreOpen] = useState(true);

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
      <header className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
            <Briefcase className="h-10 w-10 text-primary hidden sm:block" />
            <div>
              <h1 className="text-2xl font-bold font-headline text-primary text-center sm:text-left">
                {vendorProfile?.businessName || <BilingualText en="Vendor Dashboard" hi="विक्रेता डैशबोर्ड" />}
              </h1>
              <p className="text-muted-foreground text-center sm:text-left">
                <BilingualText en="Manage your store and orders efficiently." hi="अपने स्टोर और ऑर्डर को कुशलतापूर्वक प्रबंधित करें।" />
              </p>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <div className="flex items-center space-x-2">
              <Label htmlFor="store-status" className="text-sm font-medium text-muted-foreground"><BilingualText en="Store Status:" hi="स्टोर स्थिति:" /></Label>
              <Switch id="store-status" checked={isStoreOpen} onCheckedChange={setIsStoreOpen} />
              <span className={`text-sm font-bold ${isStoreOpen ? 'text-green-600' : 'text-red-600'}`}>
                {isStoreOpen ? <BilingualText en="Open" hi="खुला" /> : <BilingualText en="Paused" hi="रोका हुआ" />}
              </span>
            </div>
             <Button asChild variant="outline" size="sm">
                <Link href="/edit-profile?role=vendor">
                    <Edit className="mr-1.5 h-3 w-3"/>
                    <span className="hidden sm:inline"><BilingualText en="Edit Info" hi="जानकारी संपादित करें" /></span>
                </Link>
            </Button>
        </div>
      </header>
      
      {/* Today's Snapshot & Earnings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
                <CardTitle className="text-lg font-headline flex items-center gap-2"><Clock className="text-primary"/> Today's Snapshot</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-center">
                <div><p className="text-2xl font-bold">12</p><p className="text-xs text-muted-foreground">Orders Received</p></div>
                <div><p className="text-2xl font-bold">6 <span className="text-lg">min</span></p><p className="text-xs text-muted-foreground">Avg. Dispatch Time</p></div>
                <div><p className="text-2xl font-bold text-red-500">3</p><p className="text-xs text-muted-foreground">Items Low on Stock</p></div>
                <div><p className="text-2xl font-bold">0</p><p className="text-xs text-muted-foreground">Returns / Issues</p></div>
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
                <CardTitle className="text-lg font-headline flex items-center gap-2"><IndianRupee className="text-green-500"/> Earnings Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="grid grid-cols-2 gap-4 text-center">
                    <div><p className="text-2xl font-bold">INR 1,250</p><p className="text-xs text-muted-foreground">Today's Earnings</p></div>
                    <div><p className="text-2xl font-bold">INR 8,700</p><p className="text-xs text-muted-foreground">This Week</p></div>
                 </div>
                 <Button className="w-full">Withdraw Now</Button>
                 <p className="text-xs text-center text-muted-foreground">Next Payout: Friday</p>
            </CardContent>
          </Card>
      </div>

       <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
            <CardTitle className="font-headline text-primary flex items-center gap-2"><Lightbulb/> AI Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
            <p>"90% of students nearby are buying Class 11 Practical Files – <Link href="/vendor-dashboard/products" className="font-semibold underline">Add now?</Link>"</p>
            <p>"5 New School Orders from OSO Partner Schools – <Link href="/vendor-dashboard/school-orders" className="font-semibold underline">View now?</Link>"</p>
        </CardContent>
      </Card>


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
                    asChild
                >
                    <Link href={action.href}>
                        <action.icon className="h-7 w-7 text-primary mb-1"/>
                        <span className="text-xs font-medium"><BilingualText en={action.labelEn} hi={action.labelHi} /></span>
                    </Link>
                </Button>
            ))}
        </CardContent>
      </Card>
    </div>
  );
}
