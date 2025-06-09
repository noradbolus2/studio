
// src/app/(app)/school-dashboard/staff/page.tsx
"use client";
import { useState } from "react";
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, UserCog, PlusCircle, Search, Edit, Trash2, Eye, Phone, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface StaffMember {
  id: string;
  name: string;
  role: "Teacher" | "Admin" | "Support Staff" | "Principal";
  subjectOrDepartment: string;
  contact: string;
  email: string;
  status: "Active" | "On Leave";
}

const mockStaff: StaffMember[] = [
  { id: "T101", name: "Mrs. Anjali Desai", role: "Teacher", subjectOrDepartment: "Mathematics", contact: "9876543210", email: "anjali.d@school.com", status: "Active" },
  { id: "T102", name: "Mr. Vikram Singh", role: "Teacher", subjectOrDepartment: "Science", contact: "9876543211", email: "vikram.s@school.com", status: "Active" },
  { id: "A201", name: "Mr. Ramesh Gupta", role: "Admin", subjectOrDepartment: "Administration", contact: "9876543212", email: "ramesh.g@school.com", status: "Active" },
  { id: "P001", name: "Dr. Meera Sharma", role: "Principal", subjectOrDepartment: "School Head", contact: "9876543200", email: "principal@school.com", status: "Active" },
  { id: "S301", name: "Mr. Arjun Pawar", role: "Support Staff", subjectOrDepartment: "IT Support", contact: "9876543213", email: "arjun.p@school.com", status: "On Leave" },
];

export default function SchoolStaffPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  const filteredStaff = mockStaff.filter(staff => {
    return (
      (staff.name.toLowerCase().includes(searchTerm.toLowerCase()) || staff.subjectOrDepartment.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterRole === "all" || staff.role === filterRole)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-headline flex items-center gap-2">
          <UserCog className="h-7 w-7 text-primary" />
          <BilingualText en="Staff Management" hi="कर्मचारी प्रबंधन" />
        </h1>
        <Button variant="outline" onClick={() => router.push('/school-dashboard')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          <BilingualText en="Back to Dashboard" hi="डैशबोर्ड पर वापस" />
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle><BilingualText en="Staff Directory" hi="कर्मचारी निर्देशिका" /></CardTitle>
          <CardDescription><BilingualText en="Manage staff profiles, roles, and permissions." hi="कर्मचारी प्रोफ़ाइल, भूमिकाएँ और अनुमतियाँ प्रबंधित करें।" /></CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-grow">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder_en="Search by name or department..." 
                    placeholder_hi="नाम या विभाग द्वारा खोजें..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder_en="Filter by Role" placeholder_hi="भूमिका से फ़िल्टर करें" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all"><BilingualText en="All Roles" hi="सभी भूमिकाएँ"/></SelectItem>
                    {[...new Set(mockStaff.map(s => s.role))].map(role => <SelectItem key={role} value={role}>{role}</SelectItem>)}
                </SelectContent>
            </Select>
            <Button className="w-full sm:w-auto">
                <PlusCircle className="mr-2 h-4 w-4" />
                <BilingualText en="Add New Staff" hi="नया कर्मचारी जोड़ें" />
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead><BilingualText en="Name" hi="नाम" /></TableHead>
                  <TableHead><BilingualText en="Role" hi="भूमिका" /></TableHead>
                  <TableHead><BilingualText en="Department/Subject" hi="विभाग/विषय" /></TableHead>
                  <TableHead><BilingualText en="Contact" hi="संपर्क" /></TableHead>
                  <TableHead><BilingualText en="Status" hi="स्थिति" /></TableHead>
                  <TableHead className="text-right"><BilingualText en="Actions" hi="कार्रवाइयां" /></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStaff.length > 0 ? filteredStaff.map((staff) => (
                  <TableRow key={staff.id}>
                    <TableCell className="font-medium">{staff.name}</TableCell>
                    <TableCell>{staff.role}</TableCell>
                    <TableCell>{staff.subjectOrDepartment}</TableCell>
                    <TableCell>
                        <div className="text-xs">
                            <p className="flex items-center gap-1"><Phone size={12}/> {staff.contact}</p>
                            <p className="flex items-center gap-1"><Mail size={12}/> {staff.email}</p>
                        </div>
                    </TableCell>
                    <TableCell>
                        <Badge variant={staff.status === "Active" ? "default" : "outline"} className={staff.status === "Active" ? "bg-green-500/20 text-green-700 border-green-400" : "bg-yellow-500/20 text-yellow-700 border-yellow-400"}>
                            {staff.status}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7"><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7"><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                )) : (
                    <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                        <BilingualText en="No staff members found." hi="कोई कर्मचारी सदस्य नहीं मिला।" />
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
declare module "@radix-ui/react-select" {
  interface SelectValueProps {
    placeholder_en?: string;
    placeholder_hi?: string;
  }
}

    