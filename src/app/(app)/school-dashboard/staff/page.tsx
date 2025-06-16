
// src/app/(app)/school-dashboard/staff/page.tsx
"use client";
import { useState, type FormEvent, useEffect } from "react";
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, UserCog, PlusCircle, Search, Edit, Trash2, Eye, Phone, Mail, KeyRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const DEFAULT_SCHOOL_ID = "defaultSchool"; // For prototype simplicity
const schoolDesignations = ["Principal", "Vice Principal", "Coordinator", "Teacher", "Accountant", "Admin Staff", "Librarian", "IT Support", "Other"];


interface StaffMember {
  id: string;
  name: string;
  email: string; // Used for login
  password?: string; // For prototype, admin sets this. In real app, this would be hashed or invite-based.
  role: "Teacher" | "Admin" | "Support Staff" | "Principal" | "Librarian" | "Accountant" | string; // Allow string for "Other"
  subjectOrDepartment: string;
  contact: string;
  status: "Active" | "Inactive";
  schoolId: string;
}


export default function SchoolStaffPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  const [isAddStaffDialogOpen, setIsAddStaffDialogOpen] = useState(false);
  const [newStaffData, setNewStaffData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    designation: "",
    subjectOrDepartment: "",
    contact: "",
  });

  useEffect(() => {
    // Load staff from localStorage
    const storedStaffString = localStorage.getItem(`schoolStaff_${DEFAULT_SCHOOL_ID}`);
    if (storedStaffString) {
      setStaffList(JSON.parse(storedStaffString));
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewStaffData(prev => ({ ...prev, [name]: value }));
  };

  const handleDesignationChange = (value: string) => {
    setNewStaffData(prev => ({ ...prev, designation: value }));
  };

  const handleAddNewStaff = (e: FormEvent) => {
    e.preventDefault();
    if (newStaffData.password !== newStaffData.confirmPassword) {
        toast({ title: "Error", description: "Passwords do not match.", variant: "destructive"});
        return;
    }
    if (!newStaffData.name || !newStaffData.email || !newStaffData.password || !newStaffData.designation) {
        toast({ title: "Error", description: "Name, Email, Password and Designation are required.", variant: "destructive"});
        return;
    }

    const newStaffMember: StaffMember = {
        id: `staff_${Date.now()}`,
        name: newStaffData.name,
        email: newStaffData.email,
        password: newStaffData.password, // Store plaintext for prototype
        role: newStaffData.designation as StaffMember['role'],
        subjectOrDepartment: newStaffData.subjectOrDepartment,
        contact: newStaffData.contact,
        status: "Active",
        schoolId: DEFAULT_SCHOOL_ID,
    };

    const updatedStaffList = [...staffList, newStaffMember];
    setStaffList(updatedStaffList);
    localStorage.setItem(`schoolStaff_${DEFAULT_SCHOOL_ID}`, JSON.stringify(updatedStaffList));

    toast({ title: "Staff Added", description: `${newStaffData.name} has been added successfully.`});
    setIsAddStaffDialogOpen(false);
    setNewStaffData({ name: "", email: "", password: "", confirmPassword: "", designation: "", subjectOrDepartment: "", contact: "" }); // Reset form
  };


  const filteredStaff = staffList.filter(staff => {
    return (
      (staff.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
       staff.subjectOrDepartment.toLowerCase().includes(searchTerm.toLowerCase()) ||
       staff.email.toLowerCase().includes(searchTerm.toLowerCase())
      ) &&
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
                    placeholder_en="Search by name, email, or department..." 
                    placeholder_hi="नाम, ईमेल या विभाग द्वारा खोजें..."
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
                    {schoolDesignations.map(role => <SelectItem key={role} value={role}>{role}</SelectItem>)}
                </SelectContent>
            </Select>
            <Button className="w-full sm:w-auto" onClick={() => setIsAddStaffDialogOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                <BilingualText en="Add New Staff" hi="नया कर्मचारी जोड़ें" />
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead><BilingualText en="Name" hi="नाम" /></TableHead>
                  <TableHead><BilingualText en="Email (Login ID)" hi="ईमेल (लॉगिन आईडी)" /></TableHead>
                  <TableHead><BilingualText en="Role/Designation" hi="भूमिका/पदवी" /></TableHead>
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
                    <TableCell>{staff.email}</TableCell>
                    <TableCell>{staff.role}</TableCell>
                    <TableCell>{staff.subjectOrDepartment}</TableCell>
                    <TableCell>{staff.contact}</TableCell>
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
                        <TableCell colSpan={7} className="h-24 text-center">
                        <BilingualText en="No staff members found." hi="कोई कर्मचारी सदस्य नहीं मिला।" />
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add New Staff Dialog */}
      <Dialog open={isAddStaffDialogOpen} onOpenChange={setIsAddStaffDialogOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle><BilingualText en="Add New Staff Member" hi="नया कर्मचारी सदस्य जोड़ें" /></DialogTitle>
                <DialogDescription><BilingualText en="Enter details for the new staff and set their login credentials." hi="नए कर्मचारी के लिए विवरण दर्ज करें और उनके लॉगिन क्रेडेंशियल सेट करें।" /></DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddNewStaff}>
                <div className="space-y-4 py-3">
                    <div>
                        <Label htmlFor="staffName" className="flex items-center"><UserCog className="mr-1.5 h-4 w-4" /> <BilingualText en="Full Name" hi="पूरा नाम" /></Label>
                        <Input id="staffName" name="name" value={newStaffData.name} onChange={handleInputChange} required />
                    </div>
                    <div>
                        <Label htmlFor="staffEmail" className="flex items-center"><Mail className="mr-1.5 h-4 w-4" /> <BilingualText en="Email (Login ID)" hi="ईमेल (लॉगिन आईडी)" /></Label>
                        <Input id="staffEmail" name="email" type="email" value={newStaffData.email} onChange={handleInputChange} required />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <Label htmlFor="staffPassword"><KeyRound className="mr-1.5 h-4 w-4" /> <BilingualText en="Password" hi="पासवर्ड" /></Label>
                            <Input id="staffPassword" name="password" type="password" value={newStaffData.password} onChange={handleInputChange} required />
                        </div>
                        <div>
                            <Label htmlFor="staffConfirmPassword"><KeyRound className="mr-1.5 h-4 w-4" /> <BilingualText en="Confirm Password" hi="पासवर्ड की पुष्टि करें" /></Label>
                            <Input id="staffConfirmPassword" name="confirmPassword" type="password" value={newStaffData.confirmPassword} onChange={handleInputChange} required />
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="staffDesignation"><ShieldCheck className="mr-1.5 h-4 w-4" /> <BilingualText en="Designation" hi="पदवी" /></Label>
                        <Select name="designation" onValueChange={handleDesignationChange} value={newStaffData.designation} required>
                            <SelectTrigger id="staffDesignation"><SelectValue placeholder_en="Select Designation" placeholder_hi="पदवी चुनें" /></SelectTrigger>
                            <SelectContent>
                                {schoolDesignations.map(desig => (<SelectItem key={desig} value={desig}>{desig}</SelectItem>))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="staffDepartment"><Briefcase className="mr-1.5 h-4 w-4" /> <BilingualText en="Department/Subject" hi="विभाग/विषय" /></Label>
                        <Input id="staffDepartment" name="subjectOrDepartment" value={newStaffData.subjectOrDepartment} onChange={handleInputChange} />
                    </div>
                    <div>
                        <Label htmlFor="staffContact"><Phone className="mr-1.5 h-4 w-4" /> <BilingualText en="Contact Number" hi="संपर्क नंबर" /></Label>
                        <Input id="staffContact" name="contact" value={newStaffData.contact} onChange={handleInputChange} />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsAddStaffDialogOpen(false)}><BilingualText en="Cancel" hi="रद्द करें" /></Button>
                    <Button type="submit"><BilingualText en="Add Staff" hi="कर्मचारी जोड़ें" /></Button>
                </DialogFooter>
            </form>
        </DialogContent>
      </Dialog>
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
    