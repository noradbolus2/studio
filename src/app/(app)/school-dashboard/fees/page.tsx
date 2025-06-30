// src/app/(app)/school-dashboard/fees/page.tsx
"use client";
import { useState } from "react";
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText, IndianRupee, Search, Filter, FilePlus2, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface FeeRecord {
  id: string;
  studentName: string;
  class: string;
  rollNumber: string;
  amountDue: number;
  status: "Paid" | "Due" | "Overdue" | "Partial";
  dueDate: string;
  lastPaidDate?: string;
}

const mockFeeRecords: FeeRecord[] = [
  { id: "FEE001", studentName: "Aarav Sharma", class: "10A", rollNumber: "10A01", amountDue: 0, status: "Paid", dueDate: "2024-07-10", lastPaidDate: "2024-07-05" },
  { id: "FEE002", studentName: "Priya Singh", class: "9B", rollNumber: "09B15", amountDue: 2500, status: "Due", dueDate: "2024-08-10" },
  { id: "FEE003", studentName: "Rohan Verma", class: "10A", rollNumber: "10A02", amountDue: 5000, status: "Overdue", dueDate: "2024-06-10" },
  { id: "FEE004", studentName: "Sneha Reddy", class: "8C", rollNumber: "08C05", amountDue: 1500, status: "Partial", dueDate: "2024-07-15", lastPaidDate: "2024-07-10 (Paid 1000)"},
];

const classesForFilter = ["All", "10A", "9B", "8C"]; // Example classes

export default function SchoolFeesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterClass, setFilterClass] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  const filteredRecords = mockFeeRecords.filter(record => {
    return (
      (record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || record.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterClass === "All" || record.class === filterClass) &&
      (filterStatus === "All" || record.status === filterStatus)
    );
  });

  const getStatusBadgeVariant = (status: FeeRecord['status']) => {
    switch (status) {
      case "Paid": return "bg-green-500/20 text-green-700 border-green-400";
      case "Due": return "bg-yellow-500/20 text-yellow-700 border-yellow-400";
      case "Overdue": return "bg-red-500/20 text-red-700 border-red-400";
      case "Partial": return "bg-blue-500/20 text-blue-700 border-blue-400";
      default: return "bg-gray-500/20 text-gray-700 border-gray-400";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-headline flex items-center gap-2">
          <IndianRupee className="h-7 w-7 text-primary" />
          <BilingualText en="Fee Collection" hi="शुल्क संग्रह" />
        </h1>
        <Button variant="outline" onClick={() => router.push('/school-dashboard')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          <BilingualText en="Back to Dashboard" hi="डैशबोर्ड पर वापस" />
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle><BilingualText en="Fee Management" hi="शुल्क प्रबंधन" /></CardTitle>
          <CardDescription><BilingualText en="Track payments, send reminders, and generate fee receipts." hi="भुगतानों को ट्रैक करें, अनुस्मारक भेजें और शुल्क रसीदें उत्पन्न करें।" /></CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder_en="Search by student name or roll no..." 
                placeholder_hi="छात्र का नाम या रोल नंबर से खोजें..." 
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterClass} onValueChange={setFilterClass}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder_en="Filter by Class" placeholder_hi="कक्षा से फ़िल्टर करें"/>
              </SelectTrigger>
              <SelectContent>
                {classesForFilter.map(c => <SelectItem key={c} value={c}>{c === "All" ? <BilingualText en="All Classes" hi="सभी कक्षाएं"/> : c}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder_en="Filter by Status" placeholder_hi="स्थिति से फ़िल्टर करें"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All"><BilingualText en="All Status" hi="सभी स्थितियाँ"/></SelectItem>
                <SelectItem value="Paid"><BilingualText en="Paid" hi="भुगतान किया गया"/></SelectItem>
                <SelectItem value="Due"><BilingualText en="Due" hi="बकाया"/></SelectItem>
                <SelectItem value="Overdue"><BilingualText en="Overdue" hi="अतिदेय"/></SelectItem>
                <SelectItem value="Partial"><BilingualText en="Partial" hi="आंशिक"/></SelectItem>
              </SelectContent>
            </Select>
             <Button className="w-full sm:w-auto">
                <FilePlus2 className="mr-2 h-4 w-4" />
                <BilingualText en="Record Payment" hi="भुगतान रिकॉर्ड करें" />
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead><BilingualText en="Roll No." hi="रोल नंबर" /></TableHead>
                  <TableHead><BilingualText en="Student Name" hi="छात्र का नाम" /></TableHead>
                  <TableHead><BilingualText en="Class" hi="कक्षा" /></TableHead>
                  <TableHead><BilingualText en="Amount Due" hi="बकाया राशि" /></TableHead>
                  <TableHead><BilingualText en="Status" hi="स्थिति" /></TableHead>
                  <TableHead><BilingualText en="Due Date" hi="नियत तारीख" /></TableHead>
                  <TableHead className="text-right"><BilingualText en="Actions" hi="कार्रवाइयां" /></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.length > 0 ? filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.rollNumber}</TableCell>
                    <TableCell className="font-medium">{record.studentName}</TableCell>
                    <TableCell>{record.class}</TableCell>
                    <TableCell>₹{record.amountDue.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusBadgeVariant(record.status)}>{record.status}</Badge>
                    </TableCell>
                    <TableCell>{record.dueDate}</TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7"><FileText className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7"><Send className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                )) : (
                    <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                        <BilingualText en="No fee records found." hi="कोई शुल्क रिकॉर्ड नहीं मिला।" />
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

    
