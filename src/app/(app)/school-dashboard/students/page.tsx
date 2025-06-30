// src/app/(app)/school-dashboard/students/page.tsx
"use client";
import { useState, useEffect, useMemo, type FormEvent } from "react";
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Users, PlusCircle, Search, Edit, Trash2, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

interface Student {
  id: string;
  name: string;
  class: string;
  section: string;
  rollNumber: string;
  parentName: string;
  status: "Active" | "Inactive";
}

const LOCAL_STORAGE_KEY = "schoolStudentsList";

const initialMockStudents: Student[] = [
  { id: "S1001", name: "Aarav Sharma", class: "10", section: "A", rollNumber: "10A01", parentName: "Mr. Rajesh Sharma", status: "Active" },
  { id: "S1002", name: "Priya Singh", class: "9", section: "B", rollNumber: "09B15", parentName: "Mrs. Sunita Singh", status: "Active" },
  { id: "S1003", name: "Rohan Verma", class: "10", section: "A", rollNumber: "10A02", parentName: "Mr. Anil Verma", status: "Active" },
  { id: "S1004", name: "Sneha Reddy", class: "8", section: "C", rollNumber: "08C05", parentName: "Mr. Mohan Reddy", status: "Inactive" },
  { id: "S1005", name: "Vikram Kumar", class: "9", section: "A", rollNumber: "09A10", parentName: "Mrs. Meena Kumar", status: "Active" },
];

export default function SchoolStudentsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState<Omit<Student, 'id'>>({
      name: "", class: "", section: "", rollNumber: "", parentName: "", status: "Active"
  });

  useEffect(() => {
    try {
        const storedStudents = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (storedStudents) {
            setStudents(JSON.parse(storedStudents));
        } else {
            setStudents(initialMockStudents);
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialMockStudents));
        }
    } catch (error) {
        console.error("Failed to load students from storage:", error);
        setStudents(initialMockStudents);
    }
    setIsLoading(false);
  }, []);

  const saveStudentsToStorage = (updatedStudents: Student[]) => {
      try {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedStudents));
      } catch (error) {
          console.error("Failed to save students to storage:", error);
          toast({ title: "Error", description: "Could not save changes to your browser's storage.", variant: "destructive"});
      }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({...prev, [name]: value}));
  }

  const handleSelectChange = (name: keyof typeof formData, value: string) => {
      setFormData(prev => ({...prev, [name]: value as Student['status']}));
  }

  const handleAddNewClick = () => {
    setEditingStudent(null);
    setFormData({ name: "", class: "", section: "", rollNumber: "", parentName: "", status: "Active" });
    setIsDialogOpen(true);
  };
  
  const handleEditClick = (student: Student) => {
    setEditingStudent(student);
    setFormData(student);
    setIsDialogOpen(true);
  };
  
  const handleDeleteClick = (studentId: string, studentName: string) => {
    if (window.confirm(`Are you sure you want to delete ${studentName}?`)) {
        const updatedStudents = students.filter(s => s.id !== studentId);
        setStudents(updatedStudents);
        saveStudentsToStorage(updatedStudents);
        toast({ title: "Student Deleted", description: `${studentName} has been removed.`});
    }
  };

  const handleSaveChanges = (e: FormEvent) => {
      e.preventDefault();
      if (!formData.name || !formData.class || !formData.rollNumber) {
          toast({ title: "Missing Fields", description: "Name, Class, and Roll Number are required.", variant: "destructive"});
          return;
      }

      let updatedStudents;
      if (editingStudent) {
          updatedStudents = students.map(s => s.id === editingStudent.id ? { ...formData, id: s.id } : s);
          toast({ title: "Student Updated", description: `${formData.name}'s details have been updated.`});
      } else {
          const newStudent: Student = { ...formData, id: `S${Date.now()}`};
          updatedStudents = [newStudent, ...students];
          toast({ title: "Student Added", description: `${formData.name} has been added to the roster.`});
      }
      setStudents(updatedStudents);
      saveStudentsToStorage(updatedStudents);
      setIsDialogOpen(false);
  };

  const groupedAndFilteredStudents = useMemo(() => {
    const grouped = students.reduce((acc, student) => {
      const key = `Class ${student.class}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(student);
      return acc;
    }, {} as Record<string, Student[]>);

    Object.keys(grouped).forEach(classKey => {
        grouped[classKey] = grouped[classKey].filter(student => 
            (student.name.toLowerCase().includes(searchTerm.toLowerCase()) || student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (filterStatus === "all" || student.status === filterStatus)
        );
    });

    const sortedClasses = Object.keys(grouped).sort((a, b) => {
        const numA = parseInt(a.match(/\d+/)?.[0] || '0');
        const numB = parseInt(b.match(/\d+/)?.[0] || '0');
        return numA - numB;
    });

    return sortedClasses
      .map(key => ({
        className: key,
        students: grouped[key].sort((a, b) => a.rollNumber.localeCompare(b.rollNumber))
      }))
      .filter(group => group.students.length > 0);
  }, [students, searchTerm, filterStatus]);

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
             <Select value={filterStatus} onValueChange={(val) => setFilterStatus(val)}>
                <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder_en="Filter by Status" placeholder_hi="स्थिति से फ़िल्टर करें" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all"><BilingualText en="All Statuses" hi="सभी स्थितियाँ"/></SelectItem>
                    <SelectItem value="Active"><BilingualText en="Active" hi="सक्रिय"/></SelectItem>
                    <SelectItem value="Inactive"><BilingualText en="Inactive" hi="निष्क्रिय"/></SelectItem>
                </SelectContent>
            </Select>
            <Button className="w-full sm:w-auto" onClick={handleAddNewClick}>
                <PlusCircle className="mr-2 h-4 w-4" />
                <BilingualText en="Add New Student" hi="नया छात्र जोड़ें" />
            </Button>
          </div>
          
          <div className="space-y-6">
            {isLoading ? (
                <div className="h-24 text-center flex items-center justify-center"><LoadingSpinner/></div>
            ) : groupedAndFilteredStudents.length > 0 ? groupedAndFilteredStudents.map((group) => (
              <Card key={group.className} className="bg-muted/30">
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-md font-semibold">{group.className}</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead><BilingualText en="Roll No." hi="रोल नंबर" /></TableHead>
                          <TableHead><BilingualText en="Name" hi="नाम" /></TableHead>
                          <TableHead><BilingualText en="Parent" hi="अभिभावक" /></TableHead>
                          <TableHead><BilingualText en="Status" hi="स्थिति" /></TableHead>
                          <TableHead className="text-right"><BilingualText en="Actions" hi="कार्रवाइयां" /></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {group.students.map((student) => (
                          <TableRow key={student.id}>
                            <TableCell className="font-medium">{student.rollNumber}</TableCell>
                            <TableCell>{student.name}</TableCell>
                            <TableCell>{student.parentName}</TableCell>
                            <TableCell>
                                <Badge variant={student.status === "Active" ? "default" : "outline"} className={student.status === "Active" ? "bg-green-500/20 text-green-700 border-green-400" : "bg-red-500/10 text-red-700 border-red-400"}>
                                    <BilingualText en={student.status} hi={student.status === "Active" ? "सक्रिय" : "निष्क्रिय"}/>
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right space-x-1">
                              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEditClick(student)}><Edit className="h-4 w-4" /></Button>
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => handleDeleteClick(student.id, student.name)}><Trash2 className="h-4 w-4" /></Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">
                  <BilingualText en="No students found matching your criteria." hi="आपके मानदंडों से मेल खाने वाला कोई छात्र नहीं मिला।" />
                </p>
              </div>
            )}
          </div>

        </CardContent>
      </Card>
      
      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{editingStudent ? "Edit Student Details" : "Add New Student"}</DialogTitle>
                <DialogDescription>
                    {editingStudent ? "Update the student's information below." : "Enter the new student's details."}
                </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSaveChanges}>
                <div className="space-y-4 py-3">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" name="name" value={formData.name} onChange={handleFormChange} required />
                        </div>
                         <div>
                            <Label htmlFor="rollNumber">Roll Number</Label>
                            <Input id="rollNumber" name="rollNumber" value={formData.rollNumber} onChange={handleFormChange} required />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="class">Class</Label>
                            <Input id="class" name="class" value={formData.class} onChange={handleFormChange} required />
                        </div>
                        <div>
                            <Label htmlFor="section">Section</Label>
                            <Input id="section" name="section" value={formData.section} onChange={handleFormChange} />
                        </div>
                    </div>
                     <div>
                        <Label htmlFor="parentName">Parent's Name</Label>
                        <Input id="parentName" name="parentName" value={formData.parentName} onChange={handleFormChange} />
                    </div>
                     <div>
                        <Label htmlFor="status">Status</Label>
                        <Select value={formData.status} onValueChange={(val) => handleSelectChange('status', val)}>
                            <SelectTrigger id="status"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                    <Button type="submit">Save Changes</Button>
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
