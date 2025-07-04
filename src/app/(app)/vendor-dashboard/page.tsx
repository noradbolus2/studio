// src/app/(app)/vendor-dashboard/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
    Briefcase, PackageCheck, PackagePlus, IndianRupee, ArrowRight, ListChecks, ShoppingBag, BarChart3, Bell, MessageSquare, UploadCloud, Edit, Power, Radio, Users, Lightbulb, Clock, School, Printer, ClipboardList, Gift,
    Trophy, Star, Rocket, Shield
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
  { id: "b2b_orders", labelEn: "School / B2B Orders", labelHi: "स्कूल / B2B ऑर्डर", icon: Briefcase, href: "/vendor-dashboard/school-orders" },
  { id: "print_on_demand", labelEn: "Print-on-Demand", labelHi: "प्रिंट-ऑन-डिमांड", icon: Printer, href: "/vendor-dashboard/print-on-demand" },
  { id: "school_forms", labelEn: "School Forms", labelHi: "स्कूल फॉर्म", icon: ClipboardList, href: "/vendor-dashboard/school-forms" },
  { id: "bundles", labelEn: "Study & Festival Kits", labelHi: "अध्ययन और त्योहार किट", icon: Gift, href: "/vendor-dashboard/bundles" },
  { id: "reports_analytics", labelEn: "Sales Reports", labelHi: "बिक्री रिपोर्ट", icon: BarChart3, href: "/vendor-dashboard/reports" },
  { id: "notifications", labelEn: "Notifications", labelHi: "सूचनाएं", icon: Bell, href: "/vendor-dashboard/notifications" },
  { id: "customer_queries", labelEn: "Customer Queries", labelHi: "ग्राहक प्रश्न", icon: MessageSquare, href: "/vendor-dashboard/queries" },
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

       <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <Trophy className="text-yellow-500" />
            <BilingualText en="Store Performance & Reputation" hi="स्टोर प्रदर्शन और प्रतिष्ठा" />
          </CardTitle>
          <CardDescription>
            <BilingualText en="Your current rating and earned badges." hi="आपकी वर्तमान रेटिंग और अर्जित बैज।" />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="text-center p-2 flex-shrink-0">
                    <p className="text-4xl font-bold text-yellow-500">4.8</p>
                    <div className="flex justify-center">
                        {[...Array(4)].map((_, i) => <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />)}
                        <Star className="h-4 w-4 text-yellow-400" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">(Based on 250+ ratings)</p>
                </div>
                <div className="flex-grow flex flex-wrap gap-2 justify-center sm:justify-start">
                     <Badge variant="outline" className="text-sm p-2 bg-green-500/10 text-green-700 border-green-300">
                        <Shield className="mr-1.5 h-4 w-4"/> Trusted by 10+ Schools
                    </Badge>
                     <Badge variant="outline" className="text-sm p-2 bg-blue-500/10 text-blue-700 border-blue-300">
                        <Rocket className="mr-1.5 h-4 w-4"/> Fast Dispatch Vendor
                    </Badge>
                     <Badge variant="outline" className="text-sm p-2 bg-purple-500/10 text-purple-700 border-purple-300">
                        <Printer className="mr-1.5 h-4 w-4"/> Printed 10,000+ Docs
                    </Badge>
                     <Badge variant="outline" className="text-sm p-2 bg-yellow-500/10 text-yellow-700 border-yellow-300">
                        <Trophy className="mr-1.5 h-4 w-4"/> Top Performer - June 2024
                    </Badge>
                </div>
            </div>
        </CardContent>
      </Card>

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
        <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
