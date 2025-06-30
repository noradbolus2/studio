// src/app/(app)/platform-admin/page.tsx
"use client";

import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
    ShieldCheck, Users, School, Briefcase, Sparkles, Package, BarChart3, Settings, FileCog, Eye, Bot, ArrowLeft, Link as LinkIcon, Bike, Landmark,
    CheckCircle, KeyRound, Download, Mail, TrendingUp, IndianRupee, Server, AlertTriangle, HeartPulse, Newspaper, Video, ThumbsUp, Lock, Power, ClipboardList,
    GitMerge, MapPin, Activity
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from 'next/image';

const MissionControlStatCard = ({ titleEn, titleHi, value, icon: Icon, color, note }: { titleEn: string, titleHi: string, value: string, icon: React.ElementType, color: string, note?: string }) => (
    <Card className="glass-card hover:-translate-y-1 transition-transform">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium"><BilingualText en={titleEn} hi={titleHi}/></CardTitle>
            <Icon className={`h-5 w-5 ${color}`} />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            {note && <p className="text-xs text-muted-foreground">{note}</p>}
        </CardContent>
    </Card>
);


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
          <BilingualText en="Mission Control" hi="मिशन कंट्रोल" />
        </h1>
        <p className="text-muted-foreground">
          <BilingualText en="Oversee and manage the OSO Application." hi="ओएसओ एप्लिकेशन का निरीक्षण और प्रबंधन करें।" />
        </p>
      </header>
      
       {/* 1. Mission Control Dashboard */}
      <Card className="col-span-1 lg:col-span-3">
          <CardHeader>
              <CardTitle className="font-headline text-lg flex items-center gap-2"><Activity className="text-primary"/> Live Pulse</CardTitle>
              <CardDescription>High-level, real-time platform metrics.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <MissionControlStatCard titleEn="Active Students" titleHi="सक्रिय छात्र" value="1,24,582" icon={Users} color="text-blue-500" />
              <MissionControlStatCard titleEn="Orders in Progress" titleHi="प्रगति में आदेश" value="246" icon={Package} color="text-green-500" />
              <MissionControlStatCard titleEn="Revenue Today" titleHi="आज का राजस्व" value="₹1,87,560" icon={IndianRupee} color="text-yellow-500" />
              <MissionControlStatCard titleEn="Learning Mins" titleHi="सीखने के मिनट" value="13,742" icon={BarChart3} color="text-purple-500" />
              <MissionControlStatCard titleEn="Complaints Flagged" titleHi="शिकायतें" value="11" icon={AlertTriangle} color="text-red-500" note="3 critical" />
              <MissionControlStatCard titleEn="Uptime" titleHi="अपटाइम" value="99.98%" icon={Server} color="text-teal-500" note="Downtime: 0.02%" />
              <MissionControlStatCard titleEn="Top City" titleHi="शीर्ष शहर" value="Lucknow" icon={MapPin} color="text-pink-500" note="2,930 active" />
              <Card className="flex items-center justify-center p-4">
                  <Button variant="outline" size="sm" className="mr-2"><Download size={14} className="mr-1"/>XLS</Button>
                  <Button variant="outline" size="sm" className="mr-2">Snapshot</Button>
                  <Button variant="outline" size="sm"><Mail size={14} className="mr-1"/>Mail</Button>
              </Card>
          </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
        {/* 2. Finance Panel */}
        <Card className="lg:col-span-2">
          <CardHeader>
              <CardTitle className="font-headline text-lg flex items-center gap-2"><IndianRupee className="text-primary"/> Finance & Profitability</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                <TableRow><TableCell className="font-medium">Revenue Sources</TableCell><TableCell>Education ₹12.3L, Delivery ₹7.5L, Coaching ₹4.8L</TableCell></TableRow>
                <TableRow><TableCell className="font-medium">Expense Breakdown</TableCell><TableCell>Server, Vendor Payouts, Riders, Marketing</TableCell></TableRow>
                <TableRow><TableCell className="font-medium">Net Profit (Monthly)</TableCell><TableCell className="text-green-600 font-bold">₹5.21 Lakh</TableCell></TableRow>
                <TableRow><TableCell className="font-medium">MRR / ARR Tracker</TableCell><TableCell>View detailed chart</TableCell></TableRow>
                <TableRow><TableCell className="font-medium">Refund Rate</TableCell><TableCell>1.2% this month</TableCell></TableRow>
                <TableRow><TableCell className="font-medium text-destructive">Payout Pressure</TableCell><TableCell className="text-destructive">Due: ₹3.2 Lakh (Vendors, Creators, Riders)</TableCell></TableRow>
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            <Button variant="secondary"><Download className="mr-2"/> Download Tally/Quickbooks Export</Button>
          </CardFooter>
        </Card>

        {/* 10. Quick Action Center */}
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-lg flex items-center gap-2"><Power className="text-primary"/> Quick Action Center</CardTitle>
                <CardDescription>CEO-level shortcuts for critical actions.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
                <Button variant="destructive"><AlertTriangle className="mr-2"/>Emergency Push</Button>
                <Button variant="destructive"><Lock className="mr-2"/>Lock Vendor System</Button>
                <Button variant="secondary" className="col-span-2"><Download className="mr-2"/>Export All Metrics (XLS)</Button>
                <Button variant="secondary" className="col-span-2"><Mail className="mr-2"/>Send Mail to All Schools</Button>
                <Button variant="secondary" className="col-span-2"><TrendingUp className="mr-2"/>Boost a Course/Creator</Button>
                <Button variant="secondary" className="col-span-2"><MapPin className="mr-2"/>Set City Expansion Plan</Button>
            </CardContent>
        </Card>

        {/* 3. Ecosystem Health */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="font-headline text-lg flex items-center gap-2"><HeartPulse className="text-primary"/> Ecosystem Health Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="students">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="students">Students</TabsTrigger>
                <TabsTrigger value="schools">Schools</TabsTrigger>
                <TabsTrigger value="vendors">Vendors</TabsTrigger>
                <TabsTrigger value="riders">Riders</TabsTrigger>
                <TabsTrigger value="creators">Creators</TabsTrigger>
              </TabsList>
              <TabsContent value="students" className="pt-4"><Table><TableBody><TableRow><TableCell>New Signups Today</TableCell><TableCell>1,234</TableCell></TableRow><TableRow><TableCell>Retention Rate (Monthly)</TableCell><TableCell>88%</TableCell></TableRow><TableRow><TableCell>Top 3 Subjects</TableCell><TableCell>Physics, Maths, Biology</TableCell></TableRow></TableBody></Table></TabsContent>
              <TabsContent value="schools" className="pt-4"><Table><TableBody><TableRow><TableCell>Total Verified</TableCell><TableCell>52</TableCell></TableRow><TableRow><TableCell>Active This Week</TableCell><TableCell>48</TableCell></TableRow></TableBody></Table></TabsContent>
              <TabsContent value="vendors" className="pt-4"><Table><TableBody><TableRow><TableCell>Fulfilment Rate</TableCell><TableCell>98.5%</TableCell></TableRow><TableRow><TableCell>Cancellation Rate</TableCell><TableCell>0.8%</TableCell></TableRow></TableBody></Table></TabsContent>
              <TabsContent value="riders" className="pt-4"><Table><TableBody><TableRow><TableCell>Avg. Delivery Time (Today)</TableCell><TableCell>28 mins</TableCell></TableRow><TableRow><TableCell>On-time %</TableCell><TableCell>96%</TableCell></TableRow></TableBody></Table></TabsContent>
              <TabsContent value="creators" className="pt-4"><Table><TableBody><TableRow><TableCell>New Courses Today</TableCell><TableCell>7</TableCell></TableRow><TableRow><TableCell>Best-Selling Course</TableCell><TableCell>JEE Physics Masterclass</TableCell></TableRow></TableBody></Table></TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* 4. Live Ops Monitor */}
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle className="font-headline text-lg flex items-center gap-2"><MapPin className="text-primary"/> Live Ops Monitor</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <Image src="https://placehold.co/600x300.png" alt="Live Map Placeholder" width={600} height={300} data-ai-hint="live city map" className="opacity-50"/>
                </div>
                <p className="text-xs text-muted-foreground text-center mt-2">Live map placeholder. Integration with a mapping service is required.</p>
            </CardContent>
        </Card>
        
        {/* 9. Vision Control Center */}
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-lg flex items-center gap-2"><GitMerge className="text-primary"/> Vision Control (Moonshots)</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableBody>
                        <TableRow><TableCell>OSO Circle (Study Pods)</TableCell><TableCell><Badge variant="outline">Phase 2 Testing</Badge></TableCell></TableRow>
                        <TableRow><TableCell>OSO Mind Diary</TableCell><TableCell>27% Usage - Improve</TableCell></TableRow>
                        <TableRow><TableCell>OSO Pocket School</TableCell><TableCell><Badge>Launching July 10</Badge></TableCell></TableRow>
                        <TableRow><TableCell>Coaching+Creators</TableCell><TableCell>82 Active</TableCell></TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
        
         {/* 7. AI & OSO Brain Engine Monitor */}
        <Card className="lg:col-span-3">
            <CardHeader>
                <CardTitle className="font-headline text-lg flex items-center gap-2"><Bot className="text-primary"/> AI & OSO Brain Engine Monitor</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableBody>
                        <TableRow><TableCell>Brain Scan Health (Avg. Clarity)</TableCell><TableCell>72%</TableCell></TableRow>
                        <TableRow><TableCell className="text-destructive">Stress Spike Alerts</TableCell><TableCell className="text-destructive">3 cities under mental load</TableCell></TableRow>
                        <TableRow><TableCell>AI Notes Usage</TableCell><TableCell>8,200 this week</TableCell></TableRow>
                        <TableRow><TableCell>Smart Revision Feedback</TableCell><TableCell>92% found useful</TableCell></TableRow>
                    </TableBody>
                </Table>
            </CardContent>
             <CardFooter>
                <Button variant="secondary"><Download className="mr-2"/> Download AI Performance Report (PDF)</Button>
            </CardFooter>
        </Card>
        
        {/* Functional Links to Other Admin Pages */}
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-lg flex items-center gap-2"><Users className="text-primary"/> Team Access</CardTitle>
            <CardDescription><BilingualText en="Manage internal team and access permissions." hi="आंतरिक टीम और एक्सेस अनुमतियों का प्रबंधन करें।" /></CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">View employee lists, set roles, and control platform access.</p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
                <Link href="/platform-admin/team">
                    <BilingualText en="Go to Team Management" hi="टीम प्रबंधन पर जाएं" />
                </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-lg flex items-center gap-2"><TrendingUp className="text-primary"/> Growth Engine</CardTitle>
             <CardDescription><BilingualText en="Track marketing KPIs, referrals, and user acquisition." hi="मार्केटिंग KPIs, रेफरल और उपयोगकर्ता अधिग्रहण को ट्रैक करें।" /></CardDescription>
          </CardHeader>
          <CardContent>
             <p className="text-sm text-muted-foreground">Monitor Ad Spend ROI, referrals, app ratings, and influencer campaigns.</p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
                <Link href="/platform-admin/growth">
                    <BilingualText en="Go to Growth Dashboard" hi="ग्रोथ डैशबोर्ड पर जाएं" />
                </Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-lg flex items-center gap-2"><Newspaper className="text-primary"/> PR & Brand</CardTitle>
            <CardDescription><BilingualText en="Monitor social sentiment and media mentions." hi="सामाजिक भावना और मीडिया उल्लेखों की निगरानी करें।" /></CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Track app reviews, social media sentiment, and news mentions.</p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
                <Link href="/platform-admin/pr-brand">
                    <BilingualText en="Go to PR Dashboard" hi="पीआर डैशबोर्ड पर जाएं" />
                </Link>
            </Button>
          </CardFooter>
        </Card>

      </div>
      
      {/* Security Layer note */}
      <Card className="border-destructive/50">
          <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive"><Lock/> Security Layer</CardTitle>
              <CardDescription>Security features like Biometric login, device restriction, and access logging are critical backend implementations.</CardDescription>
          </CardHeader>
      </Card>

    </div>
  );
}
