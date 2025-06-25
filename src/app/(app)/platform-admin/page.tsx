
"use client";

import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ShieldCheck, Users, School, Briefcase, Sparkles, Package, RadioTower, BarChart3, Settings, FileCog, Eye, Bot, ArrowLeft, Link as LinkIcon, Bike, Landmark } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const platformStats = [
  { id: "total_users", labelEn: "Total Users", labelHi: "कुल उपयोगकर्ता", value: "10,250+", icon: Users, color: "text-blue-500" },
  { id: "schools", labelEn: "Registered Schools", labelHi: "पंजीकृत स्कूल", value: "52", icon: School, color: "text-green-500" },
  { id: "vendors", labelEn: "Active Vendors", labelHi: "सक्रिय विक्रेता", value: "180+", icon: Briefcase, color: "text-purple-500" },
  { id: "creators", labelEn: "Content Creators", labelHi: "सामग्री निर्माता", value: "115", icon: Sparkles, color: "text-pink-500" },
  { id: "live_classes", labelEn: "Active Live Classes", labelHi: "सक्रिय लाइव कक्षाएं", value: "23", icon: RadioTower, color: "text-orange-500" },
  { id: "content_items", labelEn: "Total Content Items", labelHi: "कुल सामग्री आइटम", value: "5000+", icon: Package, color: "text-teal-500" },
];

const adminActions = [
  { id: "codemate_agent", labelEn: "CodeMate AI Agent", labelHi: "कोडमेट एआई एजेंट", icon: Bot, href: "/codemate" },
  { id: "manage_users", labelEn: "User Management", labelHi: "उपयोगकर्ता प्रबंधन", icon: Users, href: "/platform-admin/users" },
  { id: "content_moderation", labelEn: "Content Moderation", labelHi: "सामग्री मॉडरेशन", icon: FileCog, href: "/platform-admin/content-moderation" },
  { id: "platform_analytics", labelEn: "Platform Analytics", labelHi: "प्लेटफ़ॉर्म एनालिटिक्स", icon: BarChart3, href: "/platform-admin/analytics" },
  { id: "system_settings", labelEn: "System Settings", labelHi: "सिस्टम सेटिंग्स", icon: Settings, href: "/platform-admin/settings" },
  { id: "view_logs", labelEn: "System Logs", labelHi: "सिस्टम लॉग", icon: Eye, href: "/platform-admin/logs" },
  { id: "manage_roles", labelEn: "Role Management", labelHi: "भूमिका प्रबंधन", icon: ShieldCheck, href: "/platform-admin/roles"},
];

const linkedApps = [
  { id: "school_partner", labelEn: "OSO School Partner", labelHi: "OSO स्कूल पार्टनर", icon: School, href: "https://studio-8881667168.cluster-iktsryn7xnhpexlu6255bftka4.cloudworkstations.dev/" },
  { id: "vendor_app", labelEn: "KopyKart Vendor", labelHi: "कॉपीकार्ट विक्रेता", icon: Briefcase, href: "https://studio-6108164853.cluster-iktsryn7xnhpexlu6255bftka4.cloudworkstations.dev/" },
  { id: "rider_app", labelEn: "OSO Rider App", labelHi: "OSO राइडर ऐप", icon: Bike, href: "https://studio-6479543659.cluster-iktsryn7xnhpexlu6255bftka4.cloudworkstations.dev/" },
  { id: "unipanel", labelEn: "OSO UniPanel", labelHi: "OSO यूनिपैनल", icon: Landmark, href: "https://studio-9604609955.cluster-iktsryn7xnhpexlu6255bftka4.cloudworkstations.dev/" },
];

export default function PlatformAdminDashboardPage() {
  const router = useRouter();

  return (
    <div className="space-y-8">
      <header className="text-center relative">
        <Button variant="outline" size="icon" className="absolute left-0 top-0" onClick={() => router.push('/')}>
            <ArrowLeft className="h-5 w-5" />
        </Button>
        <ShieldCheck className="h-12 w-12 text-primary mx-auto mb-2" />
        <h1 className="text-3xl font-bold font-headline text-primary">
          <BilingualText en="Platform Administration" hi="प्लेटफ़ॉर्म प्रशासन" />
        </h1>
        <p className="text-muted-foreground">
          <BilingualText en="Oversee and manage the OSO Application." hi="ओएसओ एप्लिकेशन का निरीक्षण और प्रबंधन करें।" />
        </p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {platformStats.map(stat => (
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
            <CardTitle className="font-headline"><BilingualText en="Administrative Actions" hi="प्रशासनिक कार्रवाइयां"/></CardTitle>
            <CardDescription><BilingualText en="Access key platform management modules." hi="प्रमुख प्लेटफ़ॉर्म प्रबंधन मॉड्यूल तक पहुंचें।" /></CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {adminActions.map(action => (
                <Button
                    key={action.id}
                    variant="outline"
                    className="h-auto py-4 flex flex-col items-center justify-center text-center gap-2 hover:bg-primary/5 hover:border-primary"
                    asChild
                >
                    <Link href={action.href}>
                        <div>
                            <action.icon className="h-7 w-7 text-primary mb-1 mx-auto"/>
                            <span className="text-xs font-medium"><BilingualText en={action.labelEn} hi={action.labelHi} /></span>
                        </div>
                    </Link>
                </Button>
            ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <LinkIcon className="h-6 w-6 text-primary"/>
            <BilingualText en="Linked OSO Applications" hi="लिंक्ड OSO एप्लिकेशन" />
          </CardTitle>
          <CardDescription>
            <BilingualText en="Navigate to other platforms in the OSO ecosystem." hi="OSO पारिस्थितिकी तंत्र में अन्य प्लेटफार्मों पर नेविगेट करें।" />
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {linkedApps.map(app => (
            <Button
              key={app.id}
              variant="outline"
              className="h-auto py-4 flex flex-col items-center justify-center text-center gap-2 hover:bg-primary/5 hover:border-primary"
              asChild
            >
              <Link href={app.href} target="_blank" rel="noopener noreferrer">
                <div>
                  <app.icon className="h-7 w-7 text-primary mb-1 mx-auto"/>
                  <span className="text-xs font-medium"><BilingualText en={app.labelEn} hi={app.labelHi} /></span>
                </div>
              </Link>
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
