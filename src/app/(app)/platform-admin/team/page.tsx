// src/app/(app)/platform-admin/team/page.tsx
"use client";

import { useState, useMemo } from 'react';
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Users, Search, Filter, Edit, Trash2, ShieldCheck, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'On Leave' | 'Terminated';
  joinDate: string;
}

const mockTeam: TeamMember[] = [
  { id: "TM001", name: "Abhishek verma (CEO)", email: "abhishek.ceo@oso.com", role: "CEO", status: "Active", joinDate: "2022-01-01" },
  { id: "TM002", name: "Rohini (CTO)", email: "rohini.cto@oso.com", role: "Head of Engineering", status: "Active", joinDate: "2022-03-15" },
  { id: "TM003", name: "Aakash (COO)", email: "aakash.coo@oso.com", role: "Head of Operations", status: "Active", joinDate: "2022-05-20" },
  { id: "TM004", name: "Priya (Product Head)", email: "priya.product@oso.com", role: "Head of Product", status: "Active", joinDate: "2022-11-01" },
  { id: "TM005", name: "Vikram (Support Head)", email: "vikram.support@oso.com", role: "Head of Support", status: "Active", joinDate: "2023-02-10" },
  { id: "TM006", name: "Neha (CFO)", email: "neha.cfo@oso.com", role: "Head of Finance", status: "Active", joinDate: "2022-08-01" },
];


const teamRoles = ['CEO', 'Head of Engineering', 'Head of Operations', 'Head of Product', 'Head of Support', 'Head of Finance'];

export default function TeamManagementPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  const filteredTeam = useMemo(() => {
    return mockTeam.filter(member => 
      (member.name.toLowerCase().includes(searchTerm.toLowerCase()) || member.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterRole === "all" || member.role === filterRole)
    );
  }, [searchTerm, filterRole]);
  
  const getStatusBadgeVariant = (status: TeamMember['status']) => {
    switch (status) {
      case "Active": return "bg-green-500/20 text-green-700 border-green-400";
      case "On Leave": return "bg-yellow-500/20 text-yellow-700 border-yellow-400";
      case "Terminated": return "bg-red-500/20 text-red-700 border-red-400";
      default: return "outline";
    }
  };

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
          <CardTitle><BilingualText en="Internal Team" hi="आंतरिक टीम" /></CardTitle>
          <CardDescription><BilingualText en="Manage employee access, roles, and view activity logs." hi="कर्मचारी पहुंच, भूमिकाएं और गतिविधि लॉग प्रबंधित करें।" /></CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder_en="Search by name or email..." 
                        placeholder_hi="नाम या ईमेल से खोजें..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Select value={filterRole} onValueChange={setFilterRole}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Filter by Role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        {teamRoles.map(role => <SelectItem key={role} value={role}>{role}</SelectItem>)}
                    </SelectContent>
                </Select>
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

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Join Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredTeam.length > 0 ? filteredTeam.map((member) => (
                        <TableRow key={member.id}>
                            <TableCell className="font-medium">{member.name}</TableCell>
                            <TableCell>{member.email}</TableCell>
                            <TableCell>{member.role}</TableCell>
                            <TableCell><Badge variant="outline" className={getStatusBadgeVariant(member.status)}>{member.status}</Badge></TableCell>
                            <TableCell>{member.joinDate}</TableCell>
                            <TableCell className="text-right space-x-1">
                                <Button variant="ghost" size="icon" className="h-7 w-7"><Edit className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                            </TableCell>
                        </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                No team members found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
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
