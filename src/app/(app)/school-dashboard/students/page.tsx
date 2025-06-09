
// src/app/(app)/school-dashboard/students/page.tsx
"use client";
import { useState } from "react";
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Users, PlusCircle, Search, Filter, Edit, Trash2, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface Student {
  id: string;
  name: string;
  class: string;
  section: string;
  rollNumber: string;
  parentName: string;
  status: "Active" | "Inactive";
}

const mockStudents: Student[] = [
  { id: "S1001", name: "Aarav Sharma", class: "10", section: "A", rollNumber: "10A01", parentName: "Mr. Rajesh Sharma", status: "Active" },
  { id: "S1002", name: "Priya Singh", class: "9", section: "B", rollNumber: "09B15", parentName: "Mrs. Sunita Singh", status: "Active" },
  { id: "S1003", name: "Rohan Verma", class: "10", section: "A", rollNumber: "10A02", parentName: "Mr. Anil Verma", status: "Active" },
  { id: "S1004", name: "Sneha Reddy", class: "8", section: "C", rollNumber: "08C05", parentName: "Mr. Mohan Reddy", status: "Inactive" },
  { id: "S1005", name: "Vikram Kumar", class: "9", section: "A", rollNumber: "09A10", parentName: "Mrs. Meena Kumar", status: "Active" },
];

export default function SchoolStudentsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterClass, setFilterClass] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredStudents = mockStudents.filter(student => {
    return (
      (student.name.toLowerCase().includes(searchTerm.toLowerCase()) || student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterClass === "all" || student.class === filterClass) &&
      (filterStatus === "all" || student.status.toLowerCase() === filterStatus)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-headline flex items-center gap-2">
          <Users className="h-7 w-7 text-primary" />
          <BilingualText en="Student Management" hi="छात्र प्रबंधन" />
        </h1>
        <Button variant="outline" onClick={() => router.push('/school-dashboard')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          <BilingualText en="Back to Dashboard" hi="डैशबोर्ड पर वापस" />
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle><BilingualText en="Student Roster" hi="छात्र रोस्टर" /></CardTitle>
          <CardDescription><BilingualText en="Manage student information, attendance, and records." hi="छात्र जानकारी, उपस्थिति और रिकॉर्ड प्रबंधित करें।" /></CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-grow">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder_en="Search by name or roll no..." 
                    placeholder_hi="नाम या रोल नंबर से खोजें..." 
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <Select value={filterClass} onValueChange={setFilterClass}>
                <SelectTrigger className="w-full sm:w-[150px]">
                    <SelectValue placeholder_en="Filter by Class" placeholder_hi="कक्षा से फ़िल्टर करें" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all"><BilingualText en="All Classes" hi="सभी कक्षाएं"/></SelectItem>
                    {[...new Set(mockStudents.map(s => s.class))].sort().map(c => <SelectItem key={c} value={c}><BilingualText en={`Class ${c}`} hi={`कक्षा ${c}`}/></SelectItem>)}
                </SelectContent>
            </Select>
             <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-[150px]">
                    <SelectValue placeholder_en="Filter by Status" placeholder_hi="स्थिति से फ़िल्टर करें" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all"><BilingualText en="All Status" hi="सभी स्थितियाँ"/></SelectItem>
                    <SelectItem value="active"><BilingualText en="Active" hi="सक्रिय"/></SelectItem>
                    <SelectItem value="inactive"><BilingualText en="Inactive" hi="निष्क्रिय"/></SelectItem>
                </SelectContent>
            </Select>
            <Button className="w-full sm:w-auto">
                <PlusCircle className="mr-2 h-4 w-4" />
                <BilingualText en="Add New Student" hi="नया छात्र जोड़ें" />
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead><BilingualText en="Roll No." hi="रोल नंबर" /></TableHead>
                  <TableHead><BilingualText en="Name" hi="नाम" /></TableHead>
                  <TableHead><BilingualText en="Class" hi="कक्षा" /></TableHead>
                  <TableHead><BilingualText en="Parent" hi="अभिभावक" /></TableHead>
                  <TableHead><BilingualText en="Status" hi="स्थिति" /></TableHead>
                  <TableHead className="text-right"><BilingualText en="Actions" hi="कार्रवाइयां" /></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length > 0 ? filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.rollNumber}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.class}-{student.section}</TableCell>
                    <TableCell>{student.parentName}</TableCell>
                    <TableCell>
                        <Badge variant={student.status === "Active" ? "default" : "outline"} className={student.status === "Active" ? "bg-green-500/20 text-green-700 border-green-400" : "bg-red-500/10 text-red-700 border-red-400"}>
                            <BilingualText en={student.status} hi={student.status === "Active" ? "सक्रिय" : "निष्क्रिय"}/>
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
                      <BilingualText en="No students found matching your criteria." hi="आपके मानदंडों से मेल खाने वाला कोई छात्र नहीं मिला।" />
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

    