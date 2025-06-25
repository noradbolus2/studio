
// src/app/(app)/platform-admin/page.tsx
"use client";

import { useState, useEffect } from "react";
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
    ShieldCheck, Users, School, Briefcase, Sparkles, Package, RadioTower, BarChart3, Settings, FileCog, Eye, Bot, ArrowLeft, Link as LinkIcon, Bike, Landmark,
    CheckCircle,
    KeyRound
} from "lucide-react";
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
  { id: "school_partner", labelEn: "OSO School Partner", labelHi: "OSO स्कूल पार्टनर", icon: School, url: "https://9000-firebase-studio-1750860597047.cluster-zkm2jrwbnbd4awuedc2alqxrpk.cloudworkstations.dev" },
  { id: "vendor_app", labelEn: "KopyKart Vendor", labelHi: "कॉपीकार्ट विक्रेता", icon: Briefcase, url: "https://6000-studio-6108164853.cluster-iktsryn7xnhpexlu6255bftka4.cloudworkstations.dev/" },
  { id: "rider_app", labelEn: "OSO Rider App", labelHi: "OSO राइडर ऐप", icon: Bike, url: "https://9000-firebase-studio-1750860970812.cluster-nzwlpk54dvagsxetkvxzbvslyi.cloudworkstations.dev" },
  { id: "unipanel", labelEn: "OSO UniPanel", labelHi: "OSO यूनिपैनल", icon: Landmark, url: "https://6000-studio-9604609955.cluster-iktsryn7xnhpexlu6255bftka4.cloudworkstations.dev/" },
];

export default function PlatformAdminDashboardPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [pairingApp, setPairingApp] = useState<{ id: string; labelEn: string; labelHi: string; } | null>(null);
  const [isPairingDialogOpen, setIsPairingDialogOpen] = useState(false);
  const [pin, setPin] = useState("");
  const [pairedApps, setPairedApps] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const storedPairedApps = localStorage.getItem("pairedApps");
    if (storedPairedApps) {
      setPairedApps(JSON.parse(storedPairedApps));
    }
  }, []);

  const handleOpenPairingDialog = (app: typeof linkedApps[0]) => {
    setPairingApp(app);
    setPin("");
    setIsPairingDialogOpen(true);
  };

  const handlePairApp = () => {
    if (!pairingApp || !pin.trim() || pin.trim().length < 6) {
      toast({ title: "Error", description: "Please enter a valid 6-digit PIN.", variant: "destructive" });
      return;
    }

    const updatedPairedApps = { ...pairedApps, [pairingApp.id]: true };
    setPairedApps(updatedPairedApps);
    localStorage.setItem("pairedApps", JSON.stringify(updatedPairedApps));

    toast({
      title: "Pairing Successful",
      description: `Successfully paired with ${pairingApp.labelEn}. You can now access its panel.`,
    });

    setIsPairingDialogOpen(false);
    setPairingApp(null);
  };
  
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
            <BilingualText en="Linked OSO Applications" hi="युग्मित OSO एप्लिकेशन" />
          </CardTitle>
          <CardDescription>
            <BilingualText en="Pair and connect to other platforms in the OSO ecosystem using a PIN." hi="पिन का उपयोग करके OSO पारिस्थितिकी तंत्र में अन्य प्लेटफार्मों से युग्मित करें और कनेक्ट करें।" />
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {linkedApps.map(app => {
            const isPaired = pairedApps[app.id];
            
            const AppButtonContent = () => (
              <div>
                <app.icon className="h-7 w-7 text-primary mb-1 mx-auto"/>
                <span className="text-xs font-medium"><BilingualText en={app.labelEn} hi={app.labelHi} /></span>
                 {isPaired && (
                  <div className="flex items-center justify-center gap-1 mt-1 text-green-600">
                      <CheckCircle size={12}/>
                      <span className="text-xs font-semibold">Paired</span>
                  </div>
                )}
              </div>
            );

            return isPaired ? (
              <Button
                key={app.id}
                variant="outline"
                className="h-auto py-4 flex flex-col items-center justify-center text-center gap-2 hover:bg-primary/5 hover:border-primary"
                asChild
              >
                <Link href={app.url} target="_blank" rel="noopener noreferrer">
                  <AppButtonContent />
                </Link>
              </Button>
            ) : (
              <Button
                key={app.id}
                variant="outline"
                className="h-auto py-4 flex flex-col items-center justify-center text-center gap-2 hover:bg-primary/5 hover:border-primary"
                onClick={() => handleOpenPairingDialog(app)}
              >
                <AppButtonContent />
              </Button>
            );
          })}
        </CardContent>
      </Card>

      <Dialog open={isPairingDialogOpen} onOpenChange={setIsPairingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
                <BilingualText en={`Pair with ${pairingApp?.labelEn || 'Application'}`} hi={`${pairingApp?.labelHi || 'एप्लिकेशन'} के साथ युग्मित करें`} />
            </DialogTitle>
            <DialogDescription>
                <BilingualText en={`Enter the 6-digit PIN from the ${pairingApp?.labelEn} application to establish a secure connection.`} hi={`${pairingApp?.labelHi} एप्लिकेशन से 6-अंकीय पिन दर्ज करें ताकि एक सुरक्षित कनेक्शन स्थापित हो सके।`} />
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="pin" className="flex items-center mb-2">
                <KeyRound className="mr-2 h-4 w-4 text-muted-foreground"/>
                Pairing PIN
            </Label>
            <Input
                id="pin"
                type="text"
                maxLength={6}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 6-digit PIN"
                className="text-center text-lg tracking-widest font-mono"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPairingDialogOpen(false)}>Cancel</Button>
            <Button onClick={handlePairApp}>Pair</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
