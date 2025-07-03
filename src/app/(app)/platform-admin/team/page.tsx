
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'; // Import Avatar components

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'On Leave' | 'Terminated';
  joinDate: string;
  avatarUrl?: string;
  dataAiHint?: string;
}

const teamData = {
    leadership: [
        { id: "TM001", name: "Abhishek verma", email: "abhishek.ceo@oso.com", role: "Founder & CEO", status: "Active", joinDate: "2022-01-01", avatarUrl: "https://placehold.co/40x40.png", dataAiHint: "male professional" },
        { id: "TM002", name: "Rohini Sharma", email: "rohini.cto@oso.com", role: "CTO", status: "Active", joinDate: "2022-03-15", avatarUrl: "https://placehold.co/40x40.png", dataAiHint: "female professional" },
        { id: "TM003", name: "Aakash Singh", email: "aakash.coo@oso.com", role: "COO", status: "Active", joinDate: "2022-05-20", avatarUrl: "https://placehold.co/40x40.png", dataAiHint: "male professional" },
        { id: "TM006", name: "Neha Gupta", email: "neha.cfo@oso.com", role: "CFO", status: "Active", joinDate: "2022-08-01", avatarUrl: "https://placehold.co/40x40.png", dataAiHint: "female professional" },
    ],
    technical: [
        { id: "TM004", name: "Priya Sharma", email: "priya.dev@oso.com", role: "App Development Lead", status: "Active", joinDate: "2022-11-01", avatarUrl: "https://placehold.co/40x40.png", dataAiHint: "female developer" },
        { id: "TM007", name: "Rajesh Kumar", email: "rajesh.backend@oso.com", role: "Backend Architect", status: "Active", joinDate: "2023-01-20", avatarUrl: "https://placehold.co/40x40.png", dataAiHint: "male developer" },
        { id: "TM009", name: "Anjali Mehta", email: "anjali.qa@oso.com", role: "QA Engineer", status: "Active", joinDate: "2023-03-10", avatarUrl: "https://placehold.co/40x40.png", dataAiHint: "female developer" },
        { id: "TM010", name: "Karan Desai", email: "karan.ai@oso.com", role: "AI Engineer", status: "On Leave", joinDate: "2023-05-01", avatarUrl: "https://placehold.co/40x40.png", dataAiHint: "male developer" },
    ],
    operations: [
        { id: "TM011", name: "Sanjay Verma", email: "sanjay.sales@oso.com", role: "B2B Sales Head", status: "Active", joinDate: "2022-09-05", avatarUrl: "https://placehold.co/40x40.png", dataAiHint: "male professional" },
        { id: "TM005", name: "Vikram Singh", email: "vikram.support@oso.com", role: "Support Lead", status: "Active", joinDate: "2023-02-10", avatarUrl: "https://placehold.co/40x40.png", dataAiHint: "male support" },
        { id: "TM008", name: "Sunita Devi", email: "sunita.logistics@oso.com", role: "Logistics Head", status: "Active", joinDate: "2023-04-11", avatarUrl: "https://placehold.co/40x40.png", dataAiHint: "female logistics" },
        { id: "TM012", name: "Ravi Kumar", email: "ravi.marketing@oso.com", role: "Digital Marketing Head", status: "Active", joinDate: "2023-06-15", avatarUrl: "https://placehold.co/40x40.png", dataAiHint: "male professional" },
    ]
};


export default function TeamManagementPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTeamData = useMemo(() => {
    if (!searchTerm) return teamData;

    const lowercasedFilter = searchTerm.toLowerCase();
    const filtered: typeof teamData = { leadership: [], technical: [], operations: [] };
    
    (Object.keys(teamData) as Array<keyof typeof teamData>).forEach(key => {
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
                {Object.keys(filteredTeamData).map((key) => {
                    const departmentKey = key as keyof typeof filteredTeamData;
                    if (filteredTeamData[departmentKey].length === 0) return null;
                    return (
                        <Card key={departmentKey} className="overflow-hidden">
                            <CardHeader className="bg-muted/30">
                                <CardTitle className="text-lg font-semibold capitalize">
                                    {departmentKey.replace('_', ' & ')}
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
