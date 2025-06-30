
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
    GitMerge, MapPin, Activity, Code2
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from 'next/image';

const MissionControlStatCard = ({ titleEn, titleHi, value, icon: Icon, color, note, href }: { titleEn: string, titleHi: string, value: string, icon: React.ElementType, color: string, note?: string, href?: string }) => {
    const cardContent = (
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

    if (href) {
        return <Link href={href}>{cardContent}</Link>;
    }
    return cardContent;
};


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
              <MissionControlStatCard href="/platform-admin/users" titleEn="Active Students" titleHi="सक्रिय छात्र" value="12,45,820" icon={Users} color="text-blue-500" />
              <MissionControlStatCard href="/platform-admin/orders" titleEn="Orders in Progress" titleHi="प्रगति में आदेश" value="2,460" icon={Package} color="text-green-500" />
              <MissionControlStatCard href="/platform-admin/analytics" titleEn="Revenue Today" titleHi="आज का राजस्व" value="INR 18,75,600" icon={IndianRupee} color="text-yellow-500" />
              <MissionControlStatCard href="/platform-admin/analytics" titleEn="Learning Mins" titleHi="सीखने के मिनट" value="1,37,420" icon={BarChart3} color="text-purple-500" />
              <MissionControlStatCard href="/platform-admin/content-moderation" titleEn="Complaints Flagged" titleHi="शिकायतें" value="110" icon={AlertTriangle} color="text-red-500" note="30 critical" />
              <MissionControlStatCard titleEn="Uptime" titleHi="अपटाइम" value="99.98%" icon={Server} color="text-teal-500" note="Downtime: 0.02%" />
              <MissionControlStatCard href="/platform-admin/analytics" titleEn="Top City" titleHi="शीर्ष शहर" value="Lucknow" icon={MapPin} color="text-pink-500" note="29,300 active" />
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
                <TableRow><TableCell className="font-medium">Revenue Sources</TableCell><TableCell>Education INR 1.23 Cr, Delivery INR 75 L, Coaching INR 48 L</TableCell></TableRow>
                <TableRow><TableCell className="font-medium">Expense Breakdown</TableCell><TableCell>Server, Vendor Payouts, Riders, Marketing</TableCell></TableRow>
                <TableRow><TableCell className="font-medium">Net Profit (Monthly)</TableCell><TableCell className="text-green-600 font-bold">INR 52.1 Lakh</TableCell></TableRow>
                <TableRow><TableCell className="font-medium">MRR / ARR Tracker</TableCell><TableCell>View detailed chart</TableCell></TableRow>
                <TableRow><TableCell className="font-medium">Refund Rate</TableCell><TableCell>1.2% this month</TableCell></TableRow>
                <TableRow><TableCell className="font-medium text-destructive">Payout Pressure</TableCell><TableCell className="text-destructive">Due: INR 32 Lakh (Vendors, Creators, Riders)</TableCell></TableRow>
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
              <TabsContent value="students" className="pt-4"><Table><TableBody><TableRow><TableCell>New Signups Today</TableCell><TableCell>12,340</TableCell></TableRow><TableRow><TableCell>Retention Rate (Monthly)</TableCell><TableCell>88%</TableCell></TableRow><TableRow><TableCell>Top 3 Subjects</TableCell><TableCell>Physics, Maths, Biology</TableCell></TableRow></TableBody></Table></TabsContent>
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
             <CardFooter className="bg-muted/50 p-3 mt-4 rounded-b-lg">
                <p className="text-xs text-muted-foreground"><strong>Notes for Team:</strong> Push Pocket School to schools with no Wi-Fi. Build a Hindi UI fallback.</p>
            </CardFooter>
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
                        <TableRow><TableCell>Aura Map Bugs</TableCell><TableCell>None today</TableCell></TableRow>
                        <TableRow><TableCell>AI Notes Usage</TableCell><TableCell>82,000 this week</TableCell></TableRow>
                        <TableRow><TableCell>Smart Revision Feedback</TableCell><TableCell>92% found useful</TableCell></TableRow>
                    </TableBody>
                </Table>
            </CardContent>
             <CardFooter>
                <Button variant="secondary"><Download className="mr-2"/> Download AI Performance Report (PDF)</Button>
            </CardFooter>
        </Card>

        {/* Link Cards */}
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-lg flex items-center gap-2"><Code2 className="text-primary"/> CodeMate AI Agent</CardTitle>
            <CardDescription><BilingualText en="Auto-generate features and fix bugs with AI." hi="AI की मदद से स्वचालित रूप से सुविधाएँ बनाएँ और बग ठीक करें।" /></CardDescription>
          </CardHeader>
          <CardContent>
             <p className="text-sm text-muted-foreground">Give plain English instructions to CodeMate to get code, tests, and security rules generated.</p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
                <Link href="/codemate">
                    <BilingualText en="Go to CodeMate" hi="कोडमेट पर जाएं" />
                </Link>
            </Button>
          </CardFooter>
        </Card>
        
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
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Lock className="text-primary"/> Security Settings & Controls</CardTitle>
          <CardDescription>
            Manage roles, permissions, and platform-wide security configurations.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
           <Button asChild variant="outline">
                <Link href="/platform-admin/roles">
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    Manage Roles
                </Link>
            </Button>
            <Button asChild variant="outline">
                <Link href="/platform-admin/logs">
                    <Eye className="mr-2 h-4 w-4" />
                    View Access Logs
                </Link>
            </Button>
             <Button asChild variant="outline">
                <Link href="/platform-admin/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    System Settings
                </Link>
            </Button>
        </CardContent>
        <CardFooter>
             <p className="text-xs text-muted-foreground">
                Note: Biometric login and device restriction are configured at the backend/app level.
            </p>
        </CardFooter>
      </Card>

    </div>
  );
}
