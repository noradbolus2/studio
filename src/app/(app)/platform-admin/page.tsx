// src/app/(app)/platform-admin/page.tsx
"use client";

import { useState, useEffect, type FormEvent } from 'react';
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
    ShieldCheck, Users, School, Briefcase, Sparkles, Package, BarChart3, Settings, FileCog, Eye, Bot, ArrowLeft, Link as LinkIcon, Bike, Landmark,
    CheckCircle, KeyRound, Download, Mail, TrendingUp, IndianRupee, Server, AlertTriangle, HeartPulse, Newspaper, Video, ThumbsUp, Lock, Power, ClipboardList,
    GitMerge, MapPin, Activity, Code2, ArrowRight, ExternalLink, PlusCircle
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { StaffMember } from '@/types/school-staff'; 
import type { ProfileFormData } from '../../edit-profile/page';


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

const coreTeam = [
  { name: "Abhishek verma (CEO)", avatar: "https://images.unsplash.com/photo-1737568120928-3600286a297d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxtYWxlJTIwY2VvfGVufDB8fHx8MTc1MTQ3NzY1N3ww&ixlib=rb-4.1.0&q=80&w=1080", dataAiHint: "male ceo" },
  { name: "Rohini (CTO)", avatar: "https://images.unsplash.com/photo-1582201943155-606a5f4e7941?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBjdG98ZW58MHx8fHwxNzUxNDc3NjU3fDA&ixlib=rb-4.1.0&q=80&w=1080", dataAiHint: "female cto" },
  { name: "Aakash (COO)", avatar: "https://images.unsplash.com/photo-1619959706197-ab0a94d4947b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHxtYWxlJTIwY29vfGVufDB8fHx8MTc1MTQ3NzY1N3ww&ixlib=rb-4.1.0&q=80&w=1080", dataAiHint: "male coo" },
  { name: "Priya (Product Head)", avatar: "https://images.unsplash.com/photo-1659353219716-699803846194?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxmZW1hbGUlMjBwcm9kdWN0JTIwbWFuYWdlcnxlbnwwfHx8fDE3NTE0Nzc2NTd8MA&ixlib=rb-4.1.0&q=80&w=1080", dataAiHint: "female product manager" },
];

const platformAdminLinks = [
    { href: "/platform-admin/analytics", icon: BarChart3, titleEn: "Platform Analytics", titleHi: "प्लेटफ़ॉर्म एनालिटिक्स" },
    { href: "/platform-admin/users", icon: Users, titleEn: "User Management", titleHi: "उपयोगकर्ता प्रबंधन" },
    { href: "/platform-admin/orders", icon: Package, titleEn: "All Orders", titleHi: "सभी ऑर्डर" },
    { href: "/platform-admin/team", icon: KeyRound, titleEn: "Team & Roles", titleHi: "टीम और भूमिकाएँ" },
    { href: "/platform-admin/content-moderation", icon: FileCog, titleEn: "Content Moderation", titleHi: "सामग्री मॉडरेशन" },
    { href: "/platform-admin/growth", icon: TrendingUp, titleEn: "Growth Engine", titleHi: "ग्रोथ इंजन" },
    { href: "/platform-admin/pr-brand", icon: Newspaper, titleEn: "PR & Brand", titleHi: "पीआर और ब्रांड" },
    { href: "/platform-admin/logs", icon: Eye, titleEn: "System Logs", titleHi: "सिस्टम लॉग" },
    { href: "/platform-admin/settings", icon: Settings, titleEn: "System Settings", titleHi: "सिस्टम सेटिंग्स" },
    { href: "/codemate", icon: Code2, titleEn: "CodeMate AI Agent", titleHi: "कोडमेट एआई एजेंट" },
];

const schoolDesignations = ["Principal", "Vice Principal", "Coordinator", "Teacher", "Accountant", "Admin Staff", "Librarian", "IT Support", "Other"];


export default function PlatformAdminDashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isRegisterSchoolOpen, setIsRegisterSchoolOpen] = useState(false);
  const [newSchoolData, setNewSchoolData] = useState({
    schoolName: "",
    city: "",
    adminName: "",
    adminEmail: "",
    adminPassword: "",
    adminDesignation: "Principal",
  });

  const handleActionClick = (actionName: string) => {
    toast({
      title: "Action Triggered (Simulated)",
      description: `${actionName} has been initiated.`,
    });
  };

  const handleRegisterSchool = (e: FormEvent) => {
    e.preventDefault();
    if (!newSchoolData.schoolName || !newSchoolData.adminName || !newSchoolData.adminEmail || !newSchoolData.adminPassword) {
      toast({ title: "Error", description: "Please fill all required fields.", variant: "destructive" });
      return;
    }
    
    // 1. Generate unique School ID
    const schoolId = `sch_${Date.now()}`;
    
    // 2. Create School Profile object
    const schoolProfile: ProfileFormData = {
      schoolId: schoolId,
      schoolName: newSchoolData.schoolName,
      city: newSchoolData.city,
      principalName: newSchoolData.adminDesignation.toLowerCase().includes('principal') ? newSchoolData.adminName : '',
      contactPersonName: newSchoolData.adminName,
      contactPersonEmail: newSchoolData.adminEmail,
      schoolDesignation: newSchoolData.adminDesignation,
      role: 'school',
      fullName: newSchoolData.schoolName, // Using school name as the 'fullName' for the school entity profile
      email: newSchoolData.adminEmail, // Using admin email as the primary contact for the school entity
    };
    
    // 3. Create initial Admin Staff Member object
    const adminStaff: StaffMember = {
      id: `staff_${Date.now()}`,
      name: newSchoolData.adminName,
      email: newSchoolData.adminEmail,
      password: newSchoolData.adminPassword,
      role: newSchoolData.adminDesignation,
      subjectOrDepartment: "Administration",
      contact: "",
      status: "Active",
      schoolId: schoolId,
    };
    
    // 4. Save to localStorage
    try {
      localStorage.setItem(`schoolProfileData_${schoolId}`, JSON.stringify(schoolProfile));
      localStorage.setItem(`schoolStaff_${schoolId}`, JSON.stringify([adminStaff]));
    } catch (err) {
      toast({ title: "Storage Error", description: "Could not save school data to browser storage.", variant: "destructive" });
      return;
    }
    
    // 5. Show success and credentials
    toast({
      title: "School Registered Successfully!",
      description: (
        <div className="text-xs">
          <p>School: {newSchoolData.schoolName}</p>
          <p className="font-bold">School ID: {schoolId}</p>
          <p>Admin Email: {newSchoolData.adminEmail}</p>
          <p>Admin Password: {newSchoolData.adminPassword}</p>
          <p className="mt-2 text-destructive">Please securely share these credentials with the school administrator.</p>
        </div>
      ),
      duration: 15000,
    });
    
    setIsRegisterSchoolOpen(false);
    setNewSchoolData({ schoolName: "", city: "", adminName: "", adminEmail: "", adminPassword: "", adminDesignation: "Principal" });
  };
  
  return (
    <div className="space-y-8">
      <header className="text-center relative">
        <Button variant="outline" size="icon" className="absolute left-0 top-0" onClick={() => router.push('/')}>
            <ArrowLeft className="h-5 w-5" />
        </Button>
        <ShieldCheck className="h-12 w-12 text-primary mx-auto mb-2" />
        <h1 className="text-3xl font-bold font-headline text-primary">
          <BilingualText en="CEO Dashboard" hi="सीईओ डैशबोर्ड" />
        </h1>
        <p className="text-muted-foreground">
          <BilingualText en="Oversee and manage the OSO Application." hi="ओएसओ एप्लिकेशन का निरीक्षण और प्रबंधन करें।" />
        </p>
      </header>
      
       {/* 1. Live Pulse Stats Row */}
      <Card>
        <CardHeader>
            <CardTitle className="font-headline text-lg flex items-center gap-2"><Activity className="text-primary"/> Live Pulse</CardTitle>
            <CardDescription>High-level, real-time platform metrics.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <MissionControlStatCard href="/platform-admin/users" titleEn="Active Students" titleHi="सक्रिय छात्र" value="7.5 M+" icon={Users} color="text-blue-500" />
            <MissionControlStatCard href="/platform-admin/orders" titleEn="Orders in Progress" titleHi="प्रगति में आदेश" value="1,50,000+" icon={Package} color="text-green-500" />
            <MissionControlStatCard href="/platform-admin/analytics" titleEn="Revenue Today" titleHi="आज का राजस्व" value="INR 8.3 Cr" icon={IndianRupee} color="text-yellow-500" />
            <MissionControlStatCard titleEn="Pan-India Reach" titleHi="पैन-इंडिया पहुंच" value="28 States, 8 UTs" icon={MapPin} color="text-purple-500" note="Top cities: Delhi, Mumbai"/>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
            <Button variant="outline" size="sm"><Download className="mr-2 h-4 w-4"/>Download XLSSnapshot</Button>
            <Button variant="outline" size="sm"><Mail className="mr-2 h-4 w-4"/>Mail Daily Report</Button>
        </CardFooter>
      </Card>

      {/* 2. Main Panels Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Finance & Profitability Panel */}
          <Card className="lg:col-span-1">
              <CardHeader>
                  <CardTitle className="font-headline text-lg flex items-center gap-2"><IndianRupee className="text-primary"/> Finance & Profitability</CardTitle>
                  <CardDescription>Monthly financial overview.</CardDescription>
              </CardHeader>
              <CardContent>
                  <Table>
                      <TableBody>
                          <TableRow><TableCell className="font-medium">Total Revenue</TableCell><TableCell>INR 250 Cr</TableCell></TableRow>
                          <TableRow><TableCell className="font-medium">Net Profit</TableCell><TableCell className="text-green-600 font-bold">INR 50 Cr</TableCell></TableRow>
                           <TableRow>
                            <TableCell className="font-medium">Revenue Sources</TableCell>
                            <TableCell className="flex flex-wrap gap-1">
                                <Button asChild size="xs" variant="secondary" className="cursor-pointer"><Link href="/platform-admin/analytics?source=education"><Badge variant="secondary">Education: INR 100 Cr</Badge></Link></Button>
                                <Button asChild size="xs" variant="secondary" className="cursor-pointer"><Link href="/platform-admin/analytics?source=delivery"><Badge variant="secondary">Delivery: INR 80 Cr</Badge></Link></Button>
                                <Button asChild size="xs" variant="secondary" className="cursor-pointer"><Link href="/platform-admin/analytics?source=coaching"><Badge variant="secondary">Coaching: INR 40 Cr</Badge></Link></Button>
                                <Button asChild size="xs" variant="secondary" className="cursor-pointer"><Link href="/platform-admin/analytics?source=subscriptions"><Badge variant="secondary">Subscriptions: INR 30 Cr</Badge></Link></Button>
                            </TableCell>
                          </TableRow>
                          <TableRow><TableCell className="font-medium">Payout Pressure</TableCell>
                            <TableCell>
                                <Button asChild variant="link" className="p-0 h-auto font-normal text-destructive hover:text-destructive">
                                    <Link href="/platform-admin/orders">
                                        Due: INR 25 Cr (Vendors, Creators, Riders) <ExternalLink size={14} className="ml-2" />
                                    </Link>
                                </Button>
                            </TableCell>
                           </TableRow>
                          <TableRow><TableCell className="font-medium">MRR / ARR Tracker</TableCell>
                           <TableCell>
                                <Button asChild variant="link" className="p-0 h-auto font-normal">
                                  <Link href="/platform-admin/analytics">
                                      View detailed chart <ExternalLink size={14} className="ml-2" />
                                  </Link>
                                </Button>
                            </TableCell>
                          </TableRow>
                      </TableBody>
                  </Table>
              </CardContent>
              <CardFooter>
                  <Button asChild className="w-full">
                      <Link href="/platform-admin/analytics">
                          <BilingualText en="View Detailed Analytics" hi="विस्तृत एनालिटिक्स देखें" /> <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                  </Button>
              </CardFooter>
          </Card>

          {/* Core Team Panel */}
          <Card className="lg:col-span-1">
              <CardHeader>
                  <CardTitle className="font-headline text-lg flex items-center gap-2"><Users className="text-primary"/> Our Core Team</CardTitle>
                  <CardDescription>Key leadership driving the mission.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                  {coreTeam.map(member => (
                      <div key={member.name} className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                              <AvatarImage src={member.avatar} data-ai-hint={member.dataAiHint} />
                              <AvatarFallback>{member.name.substring(0,1)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-sm">{member.name}</span>
                      </div>
                  ))}
              </CardContent>
              <CardFooter>
                  <Button asChild className="w-full">
                      <Link href="/platform-admin/team">
                          <BilingualText en="Manage Full Team" hi="पूरी टीम प्रबंधित करें" /> <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                  </Button>
              </CardFooter>
          </Card>

          {/* Quick Action Center Panel */}
          <Card className="lg:col-span-1">
              <CardHeader>
                  <CardTitle className="font-headline text-lg flex items-center gap-2"><Power className="text-primary"/> Quick Action Center</CardTitle>
                  <CardDescription>CEO-level shortcuts for critical actions.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-2">
                 <Button variant="destructive" className="justify-start gap-2 h-auto py-2 text-left" onClick={() => handleActionClick("Emergency Push Notification")}>
                      <AlertTriangle className="h-4 w-4 shrink-0"/>
                      <span className="text-xs font-medium leading-tight"><BilingualText en="Emergency Push" hi="आपातकालीन पुश"/></span>
                  </Button>
                   <Button variant="destructive" className="justify-start gap-2 h-auto py-2 text-left" onClick={() => handleActionClick("Lock Vendor System")}>
                      <Lock className="h-4 w-4 shrink-0"/>
                      <span className="text-xs font-medium leading-tight"><BilingualText en="Lock Vendor System" hi="विक्रेता प्रणाली लॉक"/></span>
                  </Button>
                   <Button variant="secondary" className="justify-start gap-2 h-auto py-2 text-left" onClick={() => handleActionClick("Export All Metrics (XLS)")}>
                      <Download className="h-4 w-4 shrink-0"/>
                      <span className="text-xs font-medium leading-tight"><BilingualText en="Export All Metrics" hi="सभी मेट्रिक्स निर्यात"/></span>
                  </Button>
                  <Button variant="secondary" className="justify-start gap-2 h-auto py-2 text-left" onClick={() => handleActionClick("Send Mail to All Schools")}>
                      <Mail className="h-4 w-4 shrink-0"/>
                      <span className="text-xs font-medium leading-tight"><BilingualText en="Send Mail to Schools" hi="स्कूलों को मेल"/></span>
                  </Button>
              </CardContent>
          </Card>
      </div>

      {/* 3. Detailed Panels Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-1">
              <CardHeader>
                  <CardTitle className="font-headline text-lg flex items-center gap-2"><HeartPulse className="text-primary"/> Ecosystem Health</CardTitle>
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
                      <TabsContent value="students" className="pt-4"><Table><TableBody><TableRow><TableCell>New Signups Today</TableCell><TableCell>50,000+</TableCell></TableRow><TableRow><TableCell>Retention Rate (Monthly)</TableCell><TableCell>65%</TableCell></TableRow></TableBody></Table></TabsContent>
                      <TabsContent value="schools" className="pt-4"><Table><TableBody><TableRow><TableCell>Total Onboarded</TableCell><TableCell>1.4 M+ (~90%)</TableCell></TableRow><TableRow><TableCell>Verified & Active</TableCell><TableCell>92%</TableCell></TableRow></TableBody></Table><Button size="sm" className="w-full mt-2" onClick={() => setIsRegisterSchoolOpen(true)}><PlusCircle className="mr-2 h-4 w-4"/> Register New School</Button></TabsContent>
                      <TabsContent value="vendors" className="pt-4"><Table><TableBody><TableRow><TableCell>Total Onboarded</TableCell><TableCell>2.8 M+ (~90%)</TableCell></TableRow><TableRow><TableCell>Active This Week</TableCell><TableCell>95%</TableCell></TableRow></TableBody></Table><Button size="sm" className="w-full mt-2" variant="outline">Onboard New Vendor</Button></TabsContent>
                      <TabsContent value="riders" className="pt-4"><Table><TableBody><TableRow><TableCell>Avg. Delivery Time</TableCell><TableCell>28 mins</TableCell></TableRow><TableRow><TableCell>On-time %</TableCell><TableCell>96%</TableCell></TableRow></TableBody></Table><Button size="sm" className="w-full mt-2" variant="outline">Onboard New Rider</Button></TabsContent>
                      <TabsContent value="creators" className="pt-4"><Table><TableBody><TableRow><TableCell>New Courses Today</TableCell><TableCell>500+</TableCell></TableRow><TableRow><TableCell>Active Creators</TableCell><TableCell>82</TableCell></TableRow></TableBody></Table><Button size="sm" className="w-full mt-2" variant="outline">Onboard New Creator</Button></TabsContent>
                  </Tabs>
              </CardContent>
          </Card>

          <Card className="lg:col-span-1">
              <CardHeader>
                  <CardTitle className="font-headline text-lg flex items-center gap-2"><Bot className="text-primary"/> AI Engine Monitor</CardTitle>
              </CardHeader>
              <CardContent>
                  <Table>
                      <TableBody>
                          <TableRow><TableCell>Brain Scan Health (Avg. Clarity)</TableCell><TableCell>72%</TableCell></TableRow>
                          <TableRow><TableCell className="text-destructive">Stress Spike Alerts</TableCell><TableCell className="text-destructive">3 cities</TableCell></TableRow>
                          <TableRow><TableCell>AI Notes Usage (Weekly)</TableCell><TableCell>5,00,000+</TableCell></TableRow>
                          <TableRow><TableCell>Smart Revision Feedback</TableCell><TableCell>92% found useful</TableCell></TableRow>
                      </TableBody>
                  </Table>
              </CardContent>
          </Card>

          <Card className="lg:col-span-1">
              <CardHeader>
                  <CardTitle className="font-headline text-lg flex items-center gap-2"><GitMerge className="text-primary"/> Vision Control (Moonshots)</CardTitle>
              </CardHeader>
              <CardContent>
                  <Table>
                      <TableBody>
                          <TableRow><TableCell>OSO Circle (Study Pods)</TableCell><TableCell><Badge variant="outline">Phase 2</Badge></TableCell></TableRow>
                          <TableRow><TableCell>OSO Pocket School</TableCell><TableCell><Badge>Launched</Badge></TableCell></TableRow>
                          <TableRow><TableCell>Coaching+Creators</TableCell><TableCell>82 Active</TableCell></TableRow>
                          <TableRow><TableCell>Parent Mode v2</TableCell><TableCell><Badge variant="outline">Planning</Badge></TableCell></TableRow>
                      </TableBody>
                  </Table>
              </CardContent>
          </Card>
      </div>

      {/* 4. Admin Links Panel */}
      <Card>
          <CardHeader>
              <CardTitle className="font-headline text-lg flex items-center gap-2"><Settings className="text-primary"/> Management Panels</CardTitle>
              <CardDescription>Access all administrative dashboards and tools from one place.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {platformAdminLinks.map(link => (
                  <Button key={link.href} variant="outline" className="h-auto py-3 justify-start gap-2 hover:bg-muted/70" asChild>
                      <Link href={link.href}>
                          <link.icon className="h-5 w-5 text-muted-foreground" />
                          <span className="text-sm font-medium"><BilingualText en={link.titleEn} hi={link.titleHi} /></span>
                      </Link>
                  </Button>
              ))}
          </CardContent>
      </Card>
      
      {/* School Registration Dialog */}
       <Dialog open={isRegisterSchoolOpen} onOpenChange={setIsRegisterSchoolOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Register New School</DialogTitle>
                <DialogDescription>
                    Onboard a new school to the OSO platform. A unique School ID will be generated.
                </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleRegisterSchool}>
                <div className="space-y-4 py-3">
                    <h4 className="text-sm font-semibold">School Details</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="schoolName">School Name*</Label>
                            <Input id="schoolName" value={newSchoolData.schoolName} onChange={(e) => setNewSchoolData(p => ({...p, schoolName: e.target.value}))} required />
                        </div>
                        <div>
                            <Label htmlFor="city">City*</Label>
                            <Input id="city" value={newSchoolData.city} onChange={(e) => setNewSchoolData(p => ({...p, city: e.target.value}))} required/>
                        </div>
                    </div>
                     <hr/>
                    <h4 className="text-sm font-semibold pt-2">Initial Admin Account</h4>
                     <div>
                        <Label htmlFor="adminName">Admin Full Name*</Label>
                        <Input id="adminName" value={newSchoolData.adminName} onChange={(e) => setNewSchoolData(p => ({...p, adminName: e.target.value}))} required/>
                    </div>
                     <div>
                        <Label htmlFor="adminEmail">Admin Email (Login ID)*</Label>
                        <Input id="adminEmail" type="email" value={newSchoolData.adminEmail} onChange={(e) => setNewSchoolData(p => ({...p, adminEmail: e.target.value}))} required/>
                    </div>
                     <div>
                        <Label htmlFor="adminPassword">Set Initial Password*</Label>
                        <Input id="adminPassword" type="text" value={newSchoolData.adminPassword} onChange={(e) => setNewSchoolData(p => ({...p, adminPassword: e.target.value}))} required/>
                    </div>
                     <div>
                        <Label htmlFor="adminDesignation">Admin Designation*</Label>
                        <Select value={newSchoolData.adminDesignation} onValueChange={(val) => setNewSchoolData(p => ({...p, adminDesignation: val}))} required>
                            <SelectTrigger id="adminDesignation"><SelectValue /></SelectTrigger>
                            <SelectContent>{schoolDesignations.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                    <Button type="submit">Register School</Button>
                </DialogFooter>
            </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
