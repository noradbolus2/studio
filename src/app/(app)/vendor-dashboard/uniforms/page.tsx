
// src/app/(app)/vendor-dashboard/uniforms/page.tsx
"use client";
import { useState, useMemo, type FormEvent } from "react";
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowLeft, School, PlusCircle, Search, Edit, Trash2, Camera } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface UniformProduct {
  id: string;
  schoolId: string;
  type: string;
  gender: string;
  classMap: string;
  size: string;
  price: number;
  stock: number;
  status: "Active" | "Inactive";
}

const mockSchools = [
  { id: "dps_noida", name: "Delhi Public School, Noida" },
  { id: "modern_delhi", name: "Modern School, Barakhamba Road" },
  { id: "lps_lucknow", name: "Lucknow Public School" },
];

const VENDOR_UNIFORMS_KEY = "vendorUniforms_mock";

const initialMockUniforms: UniformProduct[] = [
  { id: "UNI001", schoolId: "dps_noida", type: "Shirt", gender: "Boys", classMap: "6-10", size: "28", price: 450, stock: 50, status: "Active" },
  { id: "UNI002", schoolId: "dps_noida", type: "Skirt", gender: "Girls", classMap: "6-8", size: "26", price: 400, stock: 0, status: "Inactive" },
  { id: "UNI003", schoolId: "modern_delhi", type: "Blazer", gender: "Unisex", classMap: "9-12", size: "M", price: 1200, stock: 30, status: "Active" },
];

export default function VendorUniformsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [uniforms, setUniforms] = useState<UniformProduct[]>(initialMockUniforms);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newUniform, setNewUniform] = useState<Omit<UniformProduct, 'id' | 'status'>>({
    schoolId: '', type: '', gender: '', classMap: '', size: '', price: 0, stock: 0
  });

  const handleAddNewUniform = (e: FormEvent) => {
    e.preventDefault();
    if (!newUniform.schoolId || !newUniform.type || !newUniform.size || !newUniform.price) {
        toast({ title: "Invalid Data", description: "Please fill all required fields for the uniform.", variant: "destructive" });
        return;
    }
    const uniformToAdd: UniformProduct = {
        id: `UNI${Date.now()}`,
        ...newUniform,
        status: newUniform.stock > 0 ? "Active" : "Inactive"
    };
    setUniforms(prev => [uniformToAdd, ...prev]);
    // In a real app, save to backend. For now, just state.
    toast({ title: "Uniform Added!", description: `New uniform for ${mockSchools.find(s=>s.id === newUniform.schoolId)?.name} has been added.`});
    setIsAddDialogOpen(false);
    setNewUniform({ schoolId: '', type: '', gender: '', classMap: '', size: '', price: 0, stock: 0 });
  };
  
  const groupedUniforms = useMemo(() => {
    const filtered = uniforms.filter(u => 
        u.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (mockSchools.find(s => s.id === u.schoolId)?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered.reduce((acc, uniform) => {
        const schoolName = mockSchools.find(s => s.id === uniform.schoolId)?.name || "Unknown School";
        if (!acc[schoolName]) {
            acc[schoolName] = [];
        }
        acc[schoolName].push(uniform);
        return acc;
    }, {} as Record<string, UniformProduct[]>);
  }, [uniforms, searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-headline flex items-center gap-2">
          <School className="h-7 w-7 text-primary" />
          <BilingualText en="School Uniforms" hi="स्कूल यूनिफ़ॉर्म" />
        </h1>
        <Button variant="outline" onClick={() => router.push('/vendor-dashboard')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          <BilingualText en="Back to Dashboard" hi="डैशबोर्ड पर वापस" />
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle><BilingualText en="Uniform Inventory" hi="यूनिफ़ॉर्म सूची" /></CardTitle>
          <CardDescription><BilingualText en="Manage uniform stock for different OSO partner schools." hi="विभिन्न OSO भागीदार स्कूलों के लिए यूनिफ़ॉर्म स्टॉक प्रबंधित करें।" /></CardDescription>
        </CardHeader>
        <CardContent>
           <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder_en="Search by uniform type or school name..." 
                        placeholder_hi="यूनिफ़ॉर्म प्रकार या स्कूल के नाम से खोजें..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button className="w-full sm:w-auto" onClick={() => setIsAddDialogOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    <BilingualText en="Add New Uniform" hi="नई यूनिफ़ॉर्म जोड़ें" />
                </Button>
            </div>

             <Accordion type="multiple" defaultValue={Object.keys(groupedUniforms)}>
                {Object.keys(groupedUniforms).length > 0 ? Object.entries(groupedUniforms).map(([schoolName, items]) => (
                    <AccordionItem key={schoolName} value={schoolName}>
                        <AccordionTrigger className="hover:no-underline">
                            <h3 className="font-semibold text-md">{schoolName} <Badge variant="secondary" className="ml-2">{items.length} items</Badge></h3>
                        </AccordionTrigger>
                        <AccordionContent className="p-2 space-y-2">
                             {items.map(uniform => (
                                <Card key={uniform.id} className="grid grid-cols-5 items-center p-2">
                                    <div className="col-span-3 sm:col-span-2">
                                        <p className="font-medium text-sm">{uniform.type} ({uniform.gender}, {uniform.classMap}, Size: {uniform.size})</p>
                                    </div>
                                    <div className="text-center text-sm font-semibold">INR {uniform.price}</div>
                                    <div className={`text-center text-sm font-bold ${uniform.stock === 0 ? 'text-destructive' : ''}`}>{uniform.stock}</div>
                                    <div className="col-span-5 sm:col-span-1 mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0 flex justify-end items-center gap-2">
                                        <Button variant="ghost" size="icon" className="h-7 w-7"><Edit className="h-4 w-4" /></Button>
                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                                    </div>
                                </Card>
                            ))}
                        </AccordionContent>
                    </AccordionItem>
                )) : <p className="text-center text-muted-foreground py-6">No uniform products found.</p>}
             </Accordion>
        </CardContent>
      </Card>
      
       <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Uniform Product</DialogTitle>
                    <DialogDescription>Fill in the details for the new school-specific uniform.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddNewUniform}>
                    <div className="space-y-4 py-3">
                        <div>
                            <Label htmlFor="schoolId">School*</Label>
                            <Select onValueChange={(val) => setNewUniform(p => ({...p, schoolId: val}))} required>
                                <SelectTrigger id="schoolId"><SelectValue placeholder="Select a school" /></SelectTrigger>
                                <SelectContent>{mockSchools.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="type">Uniform Type*</Label>
                                <Select onValueChange={(val) => setNewUniform(p => ({...p, type: val}))} required>
                                    <SelectTrigger id="type"><SelectValue placeholder="e.g., Shirt"/></SelectTrigger>
                                    <SelectContent>
                                        {['Shirt', 'Pant', 'Skirt', 'Tie', 'Belt', 'Blazer', 'Sweater'].map(t=><SelectItem key={t} value={t}>{t}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="gender">Gender*</Label>
                                 <Select onValueChange={(val) => setNewUniform(p => ({...p, gender: val}))} required>
                                    <SelectTrigger id="gender"><SelectValue placeholder="e.g., Boys"/></SelectTrigger>
                                    <SelectContent>
                                        {['Boys', 'Girls', 'Unisex'].map(g=><SelectItem key={g} value={g}>{g}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="classMap">Class Group*</Label>
                                <Input id="classMap" value={newUniform.classMap} onChange={(e) => setNewUniform(p => ({...p, classMap: e.target.value}))} placeholder="e.g., 6-8" required />
                            </div>
                            <div>
                                <Label htmlFor="size">Size*</Label>
                                <Input id="size" value={newUniform.size} onChange={(e) => setNewUniform(p => ({...p, size: e.target.value}))} placeholder="e.g., 28 or M" required />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="price">Price (INR)*</Label>
                                <Input id="price" type="number" value={newUniform.price || ''} onChange={(e) => setNewUniform(p => ({...p, price: parseFloat(e.target.value) || 0}))} required />
                            </div>
                            <div>
                                <Label htmlFor="stock">Stock*</Label>
                                <Input id="stock" type="number" value={newUniform.stock || ''} onChange={(e) => setNewUniform(p => ({...p, stock: parseInt(e.target.value) || 0}))} required />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                        <Button type="submit">Add Uniform Item</Button>
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
