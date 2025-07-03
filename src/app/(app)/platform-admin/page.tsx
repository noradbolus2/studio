// src/app/(app)/platform-admin/page.tsx
"use client";

import { useState, useEffect, type FormEvent, useMemo } from 'react';
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
    ShieldCheck, Users, School, Briefcase, Sparkles, Package, BarChart3, Settings, FileCog, Eye, Bot, ArrowLeft, Link as LinkIcon, Bike, Landmark,
    CheckCircle, KeyRound, Download, Mail, TrendingUp, IndianRupee, Server, AlertTriangle, HeartPulse, Newspaper, Video, ThumbsUp, Lock, Power, ClipboardList,
    GitMerge, MapPin, Activity, Code2, ArrowRight, ExternalLink, PlusCircle, Search, MessageSquare
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
import { getPrBrandReputationData, type PrBrandReputationOutput } from '@/ai/flows/pr-brand-reputation-flow';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';


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

// --- Mock Data for Ecosystem Management ---
interface Student { id: string; name: string; schoolName: string; status: 'Active' | 'Inactive'; avatarUrl: string; dataAiHint: string; }
interface SchoolEntity { id: string; name: string; city: string; status: 'Verified' | 'Pending'; }
interface Vendor { id: string; name: string; category: string; status: 'Active' | 'On Hold'; }
interface Rider { id: string; name: string; location: string; status: 'Online' | 'Offline'; }
interface Creator { id: string; name: string; expertise: string; status: 'Active' | 'Pending'; }

const mockStudents: Student[] = [
    { id: 'S1001', name: 'Aarav Sharma', schoolName: 'DPS Noida', status: 'Active', avatarUrl: 'https://placehold.co/40x40.png', dataAiHint: 'student avatar' },
    { id: 'S1002', name: 'Priya Singh', schoolName: 'Modern School', status: 'Active', avatarUrl: 'https://placehold.co/40x40.png', dataAiHint: 'student avatar' },
];
const mockSchools: SchoolEntity[] = [
    { id: 'sch_123', name: 'DPS Noida', city: 'Noida', status: 'Verified' },
    { id: 'sch_456', name: 'Modern School, Barakhamba', city: 'Delhi', status: 'Verified' },
    { id: 'sch_789', name: 'Springdales School, Pusa Road', city: 'Delhi', status: 'Pending' },
];
const mockVendors: Vendor[] = [
    { id: 'VND001', name: 'Gupta Stationery', category: 'Stationery', status: 'Active' },
    { id: 'VND002', name: 'Anil Book Store', category: 'Books', status: 'Active' },
];
const mockRiders: Rider[] = [
    { id: 'RDR01', name: 'Suresh Kumar', location: 'Karol Bagh, Delhi', status: 'Online' },
    { id: 'RDR02', name: 'Mohit Sharma', location: 'Sector 18, Noida', status: 'Offline' },
];
const mockCreators: Creator[] = [
    { id: 'CRT01', name: 'ScienceWonders', expertise: 'Science Models', status: 'Active' },
    { id: 'CRT02', name: 'ArtfulScribe', expertise: 'Calligraphy, Art', status: 'Pending' },
];

const coreTeam = [
  { name: "Abhishek verma (CEO)", avatar: "https://images.unsplash.com/photo-1737568120928-3600286a297d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxtYWxlJTIwY2VvfGVufDB8fHx8MTc1MTQ3NzY1N3ww&ixlib=rb-4.1.0&q=80&w=1080", dataAiHint: "male ceo" },
  { name: "Rohini (CTO)", avatar: "https://images.unsplash.com/photo-1582201943155-606a5f4e7941?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBjdG98ZW58MHx8fHwxNzUxNDc3NjU3fDA&ixlib=rb-4.1.0&q=80&w=1080", dataAiHint: "female cto" },
  { name: "Aakash (COO)", avatar: "https://images.unsplash.com/photo-1619959706197-ab0a94dceb68946?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHxtYWxlJTIwY29vfGVufDB8fHx8MTc1MTQ3NzY1N3ww&ixlib=rb-4.1.0&q=80&w=1080", dataAiHint: "male coo" },
  { name: "Priya (Product Head)", avatar: "https://images.unsplash.com/photo-1659353219716-699803846194?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxmZW1hbGUlMjBwcm9kdWN0JTIwbWFuYWdlcnxlbnwwfHx8f17NTE0Nzc2NTd8MA&ixlib=rb-4.1.0&q=80&w=1080", dataAiHint: "female product manager" },
];


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
  const [ecosystemSearch, setEcosystemSearch] = useState("");
  const [prData, setPrData] = useState<PrBrandReputationOutput | null>(null);
  const [isLoadingPr, setIsLoadingPr] = useState(true);

  useEffect(() => {
    const fetchPrData = async () => {
        setIsLoadingPr(true);
        try {
            const result = await getPrBrandReputationData();
            setPrData(result);
        } catch (error) {
            console.error("Failed to fetch PR & Brand data:", error);
            toast({
                title: "AI Error",
                description: "Could not fetch PR & Brand data from the AI.",
                variant: "destructive"
            });
        } finally {
            setIsLoadingPr(false);
        }
    };
    fetchPrData();
  }, [toast]);

  const handleRegisterSchool = (e: FormEvent) => {
    e.preventDefault();
    if (!newSchoolData.schoolName || !newSchoolData.adminName || !newSchoolData.adminEmail || !newSchoolData.adminPassword) {
      toast({ title: "Error", description: "Please fill all required fields.", variant: "destructive" });
      return;
    }
    
    const schoolId = `sch_${Date.now()}`;
    const schoolProfile: ProfileFormData = {
      schoolId: schoolId,
      schoolName: newSchoolData.schoolName,
      city: newSchoolData.city,
      principalName: newSchoolData.adminDesignation.toLowerCase().includes('principal') ? newSchoolData.adminName : '',
      contactPersonName: newSchoolData.adminName,
      contactPersonEmail: newSchoolData.adminEmail,
      schoolDesignation: newSchoolData.adminDesignation,
      role: 'school',
      fullName: newSchoolData.schoolName,
      email: newSchoolData.adminEmail,
    };
    
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
    
    try {
      localStorage.setItem(`schoolProfileData_${schoolId}`, JSON.stringify(schoolProfile));
      localStorage.setItem(`schoolStaff_${schoolId}`, JSON.stringify([adminStaff]));
    } catch (err) {
      toast({ title: "Storage Error", description: "Could not save school data to browser storage.", variant: "destructive" });
      return;
    }
    
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
  
    const filteredStudents = useMemo(() => mockStudents.filter(s => s.name.toLowerCase().includes(ecosystemSearch.toLowerCase()) || s.schoolName.toLowerCase().includes(ecosystemSearch.toLowerCase())), [ecosystemSearch]);
    const filteredSchools = useMemo(() => mockSchools.filter(s => s.name.toLowerCase().includes(ecosystemSearch.toLowerCase()) || s.city.toLowerCase().includes(ecosystemSearch.toLowerCase())), [ecosystemSearch]);
    const filteredVendors = useMemo(() => mockVendors.filter(v => v.name.toLowerCase().includes(ecosystemSearch.toLowerCase()) || v.category.toLowerCase().includes(ecosystemSearch.toLowerCase())), [ecosystemSearch]);
    const filteredRiders = useMemo(() => mockRiders.filter(r => r.name.toLowerCase().includes(ecosystemSearch.toLowerCase()) || r.location.toLowerCase().includes(ecosystemSearch.toLowerCase())), [ecosystemSearch]);
    const filteredCreators = useMemo(() => mockCreators.filter(c => c.name.toLowerCase().includes(ecosystemSearch.toLowerCase()) || c.expertise.toLowerCase().includes(ecosystemSearch.toLowerCase())), [ecosystemSearch]);


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
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
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
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-lg flex items-center gap-2"><HeartPulse className="text-primary"/> Ecosystem Management</CardTitle>
                    <CardDescription>Search and manage all entities on the platform.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="students">
                        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
                            <TabsTrigger value="students">Students</TabsTrigger>
                            <TabsTrigger value="schools">Schools</TabsTrigger>
                            <TabsTrigger value="vendors">Vendors</TabsTrigger>
                            <TabsTrigger value="riders">Riders</TabsTrigger>
                            <TabsTrigger value="creators">Creators</TabsTrigger>
                        </TabsList>
                        <div className="relative mt-4 mb-2">
                           <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                           <Input placeholder="Search across this category..." className="pl-8" value={ecosystemSearch} onChange={(e) => setEcosystemSearch(e.target.value)} />
                        </div>
                        <TabsContent value="students" className="mt-4">
                            <Table><TableHeader><TableRow><TableHead>Name</TableHead><TableHead>School</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                            <TableBody>{filteredStudents.map(s=><TableRow key={s.id}><TableCell className="font-medium flex items-center gap-2"><Avatar className="h-6 w-6"><AvatarImage src={s.avatarUrl} data-ai-hint={s.dataAiHint}/><AvatarFallback>{s.name.charAt(0)}</AvatarFallback></Avatar> {s.name}</TableCell><TableCell>{s.schoolName}</TableCell><TableCell><Badge variant={s.status === 'Active' ? 'default' : 'outline'} className={s.status === 'Active' ? 'bg-green-100 text-green-800' : ''}>{s.status}</Badge></TableCell></TableRow>)}</TableBody></Table>
                        </TabsContent>
                        <TabsContent value="schools" className="mt-4">
                            <Table><TableHeader><TableRow><TableHead>School Name</TableHead><TableHead>City</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                            <TableBody>{filteredSchools.map(s=><TableRow key={s.id}><TableCell className="font-medium">{s.name}</TableCell><TableCell>{s.city}</TableCell><TableCell><Badge variant={s.status === 'Verified' ? 'default' : 'outline'} className={s.status === 'Verified' ? 'bg-green-100 text-green-800' : ''}>{s.status}</Badge></TableCell></TableRow>)}</TableBody></Table>
                            <Button size="sm" className="w-full mt-2" onClick={() => setIsRegisterSchoolOpen(true)}><PlusCircle className="mr-2 h-4 w-4"/> Register New School</Button>
                        </TabsContent>
                        <TabsContent value="vendors" className="mt-4">
                            <Table><TableHeader><TableRow><TableHead>Vendor Name</TableHead><TableHead>Category</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                            <TableBody>{filteredVendors.map(v=><TableRow key={v.id}><TableCell className="font-medium">{v.name}</TableCell><TableCell>{v.category}</TableCell><TableCell><Badge variant={v.status === 'Active' ? 'default' : 'outline'} className={v.status === 'Active' ? 'bg-green-100 text-green-800' : ''}>{v.status}</Badge></TableCell></TableRow>)}</TableBody></Table>
                        </TabsContent>
                        <TabsContent value="riders" className="mt-4">
                           <Table><TableHeader><TableRow><TableHead>Rider Name</TableHead><TableHead>Location</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                            <TableBody>{filteredRiders.map(r=><TableRow key={r.id}><TableCell className="font-medium">{r.name}</TableCell><TableCell>{r.location}</TableCell><TableCell><Badge variant={r.status === 'Online' ? 'default' : 'outline'} className={r.status === 'Online' ? 'bg-green-100 text-green-800' : ''}>{r.status}</Badge></TableCell></TableRow>)}</TableBody></Table>
                        </TabsContent>
                        <TabsContent value="creators" className="mt-4">
                            <Table><TableHeader><TableRow><TableHead>Creator Name</TableHead><TableHead>Expertise</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                            <TableBody>{filteredCreators.map(c=><TableRow key={c.id}><TableCell className="font-medium">{c.name}</TableCell><TableCell>{c.expertise}</TableCell><TableCell><Badge variant={c.status === 'Active' ? 'default' : 'outline'} className={c.status === 'Active' ? 'bg-green-100 text-green-800' : ''}>{c.status}</Badge></TableCell></TableRow>)}</TableBody></Table>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-lg flex items-center gap-2"><Newspaper className="text-primary"/> PR & Brand Reputation</CardTitle>
                    <CardDescription>AI-driven summary of brand health.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoadingPr ? <div className="h-24 flex items-center justify-center"><LoadingSpinner/></div> : prData ? (
                        <div className="space-y-3">
                           <div className="p-3 bg-muted/50 rounded-lg">
                                <h4 className="font-semibold flex items-center gap-1.5 text-sm"><MessageSquare size={16}/> Social Sentiment</h4>
                                <p className="text-xl font-bold text-green-500">{prData.socialSentiment.score}</p>
                            </div>
                             <div className="p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                                 <h4 className="font-semibold flex items-center gap-1.5 text-sm text-destructive"><AlertTriangle size={16}/> Flagged Review</h4>
                                <p className="text-xs italic truncate">"{prData.flaggedReviews[0]?.comment}"</p>
                                 <p className="text-xs text-muted-foreground">Source: {prData.flaggedReviews[0]?.source}</p>
                            </div>
                        </div>
                    ) : <p className="text-sm text-muted-foreground">Could not load PR data.</p>}
                </CardContent>
                <CardFooter>
                   <Button variant="outline" size="sm" asChild>
                        <Link href="/platform-admin/pr-brand">View Full Report <ArrowRight className="ml-2 h-4 w-4"/></Link>
                   </Button>
                </CardFooter>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-lg flex items-center gap-2"><KeyRound className="text-primary"/> Core Team</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {coreTeam.map(member => (
                        <div key={member.name} className="flex items-center gap-3 p-2 bg-muted/50 rounded-md">
                            <Avatar className="h-9 w-9">
                                <AvatarImage src={member.avatar} data-ai-hint={member.dataAiHint}/>
                                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <p className="text-sm font-medium">{member.name}</p>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
      </div>
      
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
