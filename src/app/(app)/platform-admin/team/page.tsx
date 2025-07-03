// src/app/(app)/platform-admin/team/page.tsx
"use client";

import { useState, useMemo } from 'react';
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Users, Search, Filter, Edit, Trash2, ShieldCheck, PlusCircle, UserCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'On Leave' | 'Terminated';
  joinDate?: string;
  avatarUrl?: string;
  dataAiHint?: string;
}

const departmentLabels = {
    leadership: "Leadership",
    technical: "Technical",
    academic: "Content & Academic",
    field_partnerships: "Field & Partnerships",
    marketing: "Marketing & Branding",
    support: "Support",
    logistics: "Logistics & Fulfilment",
};

const departmentOrder: (keyof typeof departmentLabels)[] = ["leadership", "technical", "academic", "field_partnerships", "marketing", "support", "logistics"];


const teamData: Record<keyof typeof departmentLabels, TeamMember[]> = {
    leadership: [
        { id: "TM001", name: "Abhishek verma", email: "abhishek.ceo@oso.com", role: "Founder & CEO", status: "Active", avatarUrl: "https://images.unsplash.com/photo-1724414768978-21ee5420b925?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxtYWxlJTIwcHJvZmVzc2lvbmFsfGVufDB8fHx8MTc1MTU3MDUyN3ww&ixlib=rb-4.1.0&q=80&w=1080", dataAiHint: "male professional" },
        { id: "TM002", name: "Rohini Sharma", email: "rohini.cto@oso.com", role: "CTO", status: "Active", avatarUrl: "https://images.unsplash.com/photo-1590649880765-91b1956b8276?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHxmZW1hbGUlMjBwcm9mZXNzaW9uYWx8ZW58MHx8fHwxNzUxNTcwNTI3fDA&ixlib=rb-4.1.0&q=80&w=1080", dataAiHint: "female professional" },
        { id: "TM003", name: "Aakash Singh", email: "aakash.coo@oso.com", role: "COO", status: "Active", avatarUrl: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxtYWxlJTIwcHJvZmVzc2lvbmFsfGVufDB8fHx8MTc1MTU3MDUyN3ww&ixlib=rb-4.1.0&q=80&w=1080", dataAiHint: "male professional" },
        { id: "TM006", name: "Neha Gupta", email: "neha.cfo@oso.com", role: "CFO", status: "Active", avatarUrl: "https://images.unsplash.com/photo-1590649880765-91b1956b8276?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHxmZW1hbGUlMjBwcm9mZXNzaW9uYWx8ZW58MHx8fHwxNzUxNTcwNTI3fDA&ixlib=rb-4.1.0&q=80&w=1080", dataAiHint: "female professional" },
    ],
    technical: [
        { id: "TM004", name: "Priya Sharma", email: "priya.dev@oso.com", role: "App Development Lead", status: "Active", avatarUrl: "https://images.unsplash.com/photo-1743705392857-81fddd3f9fdc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxmZW1hbGUlMjBkZXZlbG9wZXJ8ZW58MHx8fHwxNzUxNTcwNTI3fDA&ixlib=rb-4.1.0&q=80&w=1080", dataAiHint: "female developer" },
        { id: "TM007", name: "Rajesh Kumar", email: "rajesh.backend@oso.com", role: "Backend Architect", status: "Active", avatarUrl: "https://images.unsplash.com/photo-1565687981296-535f09db714e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxtYWxlJTIwZGV2ZWxvcGVyfGVufDB8fHx8MTc1MTU3MDUyN3ww&ixlib=rb-4.1.0&q=80&w=1080", dataAiHint: "male developer" },
        { id: "TM009", name: "Anjali Mehta", email: "anjali.qa@oso.com", role: "QA Engineer", status: "Active", avatarUrl: "https://images.unsplash.com/photo-1531496730074-83b638c0a7ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxmZW1hbGUlMjBkZXZlbG9wZXJ8ZW58MHx8fHwxNzUxNTcwNTI3fDA&ixlib=rb-4.1.0&q=80&w=1080", dataAiHint: "female developer" },
        { id: "TM010", name: "Karan Desai", email: "karan.ai@oso.com", role: "AI Engineer", status: "On Leave", avatarUrl: "https://images.unsplash.com/photo-1732209556836-511e26d982da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxtYWxlJTIwZGV2ZWxvcGVyfGVufDB8fHx8MTc1MTU3MDUyN3ww&ixlib.rb-4.1.0&q=80&w=1080", dataAiHint: "male developer" },
    ],
    academic: [
        { id: "AC001", name: "Dr. Vidya Nair", email: "vidya.cao@oso.com", role: "Chief Academic Officer", status: "Active", avatarUrl: "https://images.unsplash.com/photo-1639213286884-9925686c26b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMHx8ZmVtYWxlJTIwYWNhZGVtaWN8ZW58MHx8fHwxNzUxNTcwNTI3fDA&ixlib.rb-4.1.0&q=80&w=1080", dataAiHint: "female academic" },
        { id: "AC002", name: "Ravi Kumar", email: "ravi.content@oso.com", role: "Content Curator (Physics)", status: "Active", avatarUrl: "https://images.unsplash.com/photo-1688829388910-8c43a88d85a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHxtYWxlJTIwYWNhZGVtaWN8ZW58MHx8fHwxNzUxNTcwNTI3fDA&ixlib.rb-4.1.0&q=80&w=1080", dataAiHint: "male academic" },
        { id: "AC003", name: "Sunita Joshi", email: "sunita.video@oso.com", role: "Video Production Head", status: "Active", avatarUrl: "https://images.unsplash.com/photo-1629507313712-f21468afdf2e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMHx8ZmVtYWxlJTIwcHJvZmVzc2lvbmFsfGVufDB8fHx8MTc1MTU3MDUyN3ww&ixlib.rb-4.1.0&q=80&w=1080", dataAiHint: "female professional" },
        { id: "AC004", name: "Gaurav Singh", email: "gaurav.training@oso.com", role: "Guruji Training Head", status: "Active", avatarUrl: "https://images.unsplash.com/photo-1524538198441-241ff79d153b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxtYWxlJTIwcHJvZmVzc2lvbmFsfGVufDB8fHx8MTc1MTU3MDUyN3ww&ixlib.rb-4.1.0&q=80&w=1080", dataAiHint: "male professional" },
    ],
    field_partnerships: [
        { id: "FP001", name: "Sanjay Verma", email: "sanjay.sales@oso.com", role: "B2B Sales Head", status: "Active", avatarUrl: "https://images.unsplash.com/photo-1649424219286-56af1d8ee0cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMHx8bWFsZSUyMHNhbGVzfGVufDB8fHx8MTc1MTU3MDUyN3ww&ixlib.rb-4.1.0&q=80&w=1080", dataAiHint: "male sales" },
        { id: "FP002", name: "Meera Iyer", email: "meera.partner@oso.com", role: "School Partner Executive", status: "Active", avatarUrl: "https://images.unsplash.com/photo-1648824572410-2e15e187084c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxmZW1hbGUlMjBzYWxlc3xlbnwwfHx8fDE3NTE1NzA1Mjd8MA&ixlib.rb-4.1.0&q=80&w=1080", dataAiHint: "female sales" },
        { id: "FP003", name: "Amit Patel", email: "amit.deliveryzone@oso.com", role: "Delivery Zone Executive", status: "Active", avatarUrl: "https://images.unsplash.com/photo-1618362429923-7816759a79c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxtYWxlJTIwcHJvZmVzc2lvbmFsfGVufDB8fHx8MTc1MTU3MDUyN3ww&ixlib.rb-4.1.0&q=80&w=1080", dataAiHint: "male professional" },
    ],
    marketing: [
        { id: "MKT01", name: "Alisha Khan", email: "alisha.mktg@oso.com", role: "Digital Marketing Head", status: "Active", avatarUrl: "https://images.unsplash.com/photo-1591343395902-1adcb454c4e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHxmZW1hbGUlMjBtYXJrZXRpbmd8ZW58MHx8fHwxNzUxNTcwNTI3fDA&ixlib.rb-4.1.0&q=80&w=1080", dataAiHint: "female marketing" },
        { id: "MKT02", name: "Arjun Das", email: "arjun.community@oso.com", role: "Community Manager", status: "Active", avatarUrl: "https://images.unsplash.com/photo-1576607781729-2fff849130c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw5fHxtYWxlJTIwbWFya2V0aW5nfGVufDB8fHx8MTc1MTU3MDUyN3ww&ixlib.rb-4.1.0&q=80&w=1080", dataAiHint: "male marketing" },
        { id: "MKT03", name: "Riya Kapoor", email: "riya.offline@oso.com", role: "Offline Marketing Manager", status: "Active", avatarUrl: "https://images.unsplash.com/photo-1694023445909-8752bb171a00?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw5fHxmZW1hbGUlMjBtYXJrZXRpbmd8ZW58MHx8fHwxNzUxNTcwNTI3fDA&ixlib.rb-4.1.0&q=80&w=1080", dataAiHint: "female marketing" },
        { id: "MKT04", name: "Sameer Shah", email: "sameer.campus@oso.com", role: "Campus Brand Ambassador", status: "Active", avatarUrl: "https://images.unsplash.com/photo-1529068755536-a5ade0dcb4e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxtYWxlJTIwc3R1ZGVudHxlbnwwfHx8fDE3NTE1NzA1Mjd8MA&ixlib.rb-4.1.0&q=80&w=1080", dataAiHint: "male student" },
    ],
    support: [
        { id: "SUP01", name: "Vikram Singh", email: "vikram.support@oso.com", role: "Support Lead", status: "Active", avatarUrl: "https://images.unsplash.com/photo-1579565708212-4cd3b994daf5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxtYWxlJTIwc3VwcG9ydHxlbnwwfHx8fDE3NTE1NzA1Mjd8MA&ixlib.rb-4.1.0&q=80&w=1080", dataAiHint: "male support" },
        { id: "SUP02", name: "Pooja Mehta", email: "pooja.support@oso.com", role: "Customer Support Executive", status: "Active", avatarUrl: "https://images.unsplash.com/photo-1739302750691-59c12d251139?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBzdXBwb3J0fGVufDB8fHx8MTc1MTU3MDUyN3ww&ixlib.rb-4.1.0&q=80&w=1080", dataAiHint: "female support" },
    ],
    logistics: [
        { id: "LOG01", name: "Sunita Devi", email: "sunita.logistics@oso.com", role: "Logistics Head", status: "Active", avatarUrl: "https://images.unsplash.com/photo-1662568804208-5872bd7d9477?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHxmZW1hbGUlMjBsb2dpc3RpY3N8ZW58MHx8fHwxNzUxNTcwNTI3fDA&ixlib.rb-4.1.0&q=80&w=1080", dataAiHint: "female logistics" },
        { id: "LOG02", name: "Manish Kumar", email: "manish.warehouse@oso.com", role: "Dark Store In-Charge", status: "Active", avatarUrl: "https://images.unsplash.com/photo-1563986768817-257bf91c5753?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxtYWxlJTIwd29ya2VyfGVufDB8fHx8MTc1MTU3MDUyN3ww&ixlib.rb-4.1.0&q=80&w=1080", dataAiHint: "male worker" },
        { id: "LOG03", name: "Deepak Sharma", email: "deepak.inventory@oso.com", role: "Inventory Manager", status: "Active", avatarUrl: "https://images.unsplash.com/photo-1543060829-a0029874b174?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxtYWxlJTIwd29ya2VyfGVufDB8fHx8MTc1MTU3MDUyN3ww&ixlib.rb-4.1.0&q=80&w=1080", dataAiHint: "male worker" },
        { id: "LOG04", name: "Anil Yadav", email: "anil.packaging@oso.com", role: "Packaging & QC Head", status: "Active", avatarUrl: "https://images.unsplash.com/photo-1663082075715-f9f0395f2d5d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxtYWxlJTIwd29ya2VyfGVufDB8fHx8MTc1MTU3MDUyN3ww&ixlib.rb-4.1.0&q=80&w=1080", dataAiHint: "male worker" },
    ],
};


export default function TeamManagementPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTeamData = useMemo(() => {
    if (!searchTerm) return teamData;

    const lowercasedFilter = searchTerm.toLowerCase();
    const filtered: typeof teamData = { leadership: [], technical: [], academic: [], field_partnerships: [], marketing: [], support: [], logistics: [] };
    
    departmentOrder.forEach(key => {
        const department = teamData[key];
        const filteredMembers = department.filter(member =>
            member.name.toLowerCase().includes(lowercasedFilter) ||
            member.email.toLowerCase().includes(lowercasedFilter) ||
            member.role.toLowerCase().includes(lowercasedFilter)
        );
        if (filteredMembers.length > 0) {
            filtered[key] = filteredMembers;
        }
    });

    return filtered;
  }, [searchTerm]);

  const getStatusBadgeVariant = (status: TeamMember['status']) => {
    switch (status) {
      case "Active": return "bg-green-500/20 text-green-700 border-green-400";
      case "On Leave": return "bg-yellow-500/20 text-yellow-700 border-yellow-400";
      case "Terminated": return "bg-red-500/20 text-red-700 border-red-400";
      default: return "outline";
    }
  };

  const TeamTable = ({ members }: { members: TeamMember[] }) => (
    <div className="rounded-md border-t">
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {members.length > 0 ? members.map((member) => (
                <TableRow key={member.id}>
                    <TableCell className="font-medium flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={member.avatarUrl} data-ai-hint={member.dataAiHint} />
                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p>{member.name}</p>
                            <p className="text-xs text-muted-foreground">{member.email}</p>
                        </div>
                    </TableCell>
                    <TableCell>{member.role}</TableCell>
                    <TableCell><Badge variant="outline" className={getStatusBadgeVariant(member.status)}>{member.status}</Badge></TableCell>
                    <TableCell className="text-right space-x-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7"><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                    </TableCell>
                </TableRow>
                )) : (
                    <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                        No team members found in this department.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-headline flex items-center gap-2">
          <Users className="h-7 w-7 text-primary" />
          <BilingualText en="Team Management" hi="टीम प्रबंधन" />
        </h1>
        <Button variant="outline" onClick={() => router.push('/platform-admin')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          <BilingualText en="Back to Admin" hi="एडमिन पर वापस" />
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle><BilingualText en="Internal Team Directory" hi="आंतरिक टीम निर्देशिका" /></CardTitle>
          <CardDescription><BilingualText en="Manage employee access, roles, and view activity logs by department." hi="विभाग के अनुसार कर्मचारी पहुंच, भूमिकाएं और गतिविधि लॉग प्रबंधित करें।" /></CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder_en="Search by name, email, or role..." 
                        placeholder_hi="नाम, ईमेल या भूमिका से खोजें..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                 <Button asChild>
                    <Link href="/platform-admin/roles">
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        <BilingualText en="Manage Roles" hi="भूमिकाएँ प्रबंधित करें" />
                    </Link>
                </Button>
                 <Button className="w-full sm:w-auto">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    <BilingualText en="Add Member" hi="सदस्य जोड़ें" />
                </Button>
            </div>
            
             <div className="space-y-6 mt-6">
                {departmentOrder.map((key) => {
                    const departmentKey = key as keyof typeof filteredTeamData;
                    if (filteredTeamData[departmentKey].length === 0) return null;
                    return (
                        <Card key={departmentKey} className="overflow-hidden">
                            <CardHeader className="bg-muted/30">
                                <CardTitle className="text-lg font-semibold capitalize">
                                    {departmentLabels[departmentKey]}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                               <TeamTable members={filteredTeamData[departmentKey]} />
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
            
             {Object.values(filteredTeamData).every(arr => arr.length === 0) && (
                <div className="text-center py-10 text-muted-foreground">
                    <p>No results found for "{searchTerm}".</p>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}

declare module 'react' {
    interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
      placeholder_en?: string;
      placeholder_hi?: string;
    }
}
