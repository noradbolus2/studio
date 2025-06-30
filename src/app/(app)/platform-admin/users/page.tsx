
"use client";

import { useState, useMemo } from 'react';
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Users, Search, Filter, Edit, Trash2, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface PlatformUser {
  id: string;
  name: string;
  email: string;
  role: 'Student' | 'Parent' | 'Teacher' | 'School Admin' | 'Vendor' | 'Creator' | 'Rider';
  status: 'Active' | 'Suspended' | 'Pending';
  joinDate: string;
}

const mockUsers: PlatformUser[] = [
  { id: "USR101", name: "Riya Sharma", email: "riya.s@example.com", role: "Student", status: "Active", joinDate: "2024-07-15" },
  { id: "USR102", name: "Amit Patel", email: "amit.p@example.com", role: "Student", status: "Active", joinDate: "2024-07-14" },
  { id: "VND001", name: "Gupta Stationery", email: "gupta.stat@example.com", role: "Vendor", status: "Active", joinDate: "2024-06-20" },
  { id: "TCH005", name: "Anjali Gupta", email: "anjali.g@example.com", role: "Teacher", status: "Active", joinDate: "2024-05-10" },
  { id: "CRT002", name: "ScienceWonders", email: "contact@sciencewonders.com", role: "Creator", status: "Suspended", joinDate: "2024-06-25" },
  { id: "SCH001", name: "DPS Noida Admin", email: "admin@dpsnoida.com", role: "School Admin", status: "Active", joinDate: "2024-04-01" },
  { id: "PAR003", name: "Mr. Kumar", email: "mkumar@example.com", role: "Parent", status: "Pending", joinDate: "2024-07-22" },
];

const userRoles = ["Student", "Parent", "Teacher", "School Admin", "Vendor", "Creator", "Rider"];

export default function UserManagementPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  const filteredUsers = useMemo(() => {
    return mockUsers.filter(user => 
      (user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterRole === "all" || user.role === filterRole)
    );
  }, [searchTerm, filterRole]);
  
  const getStatusBadgeVariant = (status: PlatformUser['status']) => {
    switch (status) {
      case "Active": return "bg-green-500/20 text-green-700 border-green-400";
      case "Suspended": return "bg-red-500/20 text-red-700 border-red-400";
      case "Pending": return "bg-yellow-500/20 text-yellow-700 border-yellow-400";
      default: return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-headline flex items-center gap-2">
          <Users className="h-7 w-7 text-primary" />
          <BilingualText en="User Management" hi="उपयोगकर्ता प्रबंधन" />
        </h1>
        <Button variant="outline" onClick={() => router.push('/platform-admin')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          <BilingualText en="Back to Admin" hi="एडमिन पर वापस" />
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle><BilingualText en="All Users" hi="सभी उपयोगकर्ता" /></CardTitle>
          <CardDescription><BilingualText en="View, search, and manage all users across the platform." hi="प्लेटफ़ॉर्म पर सभी उपयोगकर्ताओं को देखें, खोजें और प्रबंधित करें।" /></CardDescription>
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
                        {userRoles.map(role => <SelectItem key={role} value={role}>{role}</SelectItem>)}
                    </SelectContent>
                </Select>
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
                        {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.role}</TableCell>
                            <TableCell><Badge variant="outline" className={getStatusBadgeVariant(user.status)}>{user.status}</Badge></TableCell>
                            <TableCell>{user.joinDate}</TableCell>
                            <TableCell className="text-right space-x-1">
                                <Button variant="ghost" size="icon" className="h-7 w-7"><Eye className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7"><Edit className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                            </TableCell>
                        </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                No users found.
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
