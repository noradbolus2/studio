
// src/app/(app)/vendor-dashboard/products/page.tsx
"use client";
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, PackagePlus, Search, Filter, Edit, Trash2, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: "Active" | "Inactive";
}

const mockProducts: Product[] = [
  { id: "PROD001", name: "Classmate Notebook - Single Line (172 Pages)", category: "Notebooks", price: 45, stock: 150, status: "Active" },
  { id: "PROD002", name: "Cello Gripper Ball Pen - Blue (Pack of 5)", category: "Pens", price: 50, stock: 300, status: "Active" },
  { id: "PROD003", name: "Apsara Platinum Pencils (Box of 10)", category: "Pencils", price: 50, stock: 200, status: "Active" },
  { id: "PROD004", name: "Fevicol MR Squeeze Bottle (100g)", category: "Adhesives", price: 35, stock: 0, status: "Inactive" },
  { id: "PROD005", name: "Camel Poster Colors (12 Shades)", category: "Art Supplies", price: 120, stock: 75, status: "Active" },
];

export default function VendorProductsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = mockProducts.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-headline flex items-center gap-2">
          <PackagePlus className="h-7 w-7 text-primary" />
          <BilingualText en="Manage Products" hi="उत्पाद प्रबंधित करें" />
        </h1>
        <Button variant="outline" onClick={() => router.push('/vendor-dashboard')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          <BilingualText en="Back to Dashboard" hi="डैशबोर्ड पर वापस" />
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle><BilingualText en="Product Listings" hi="उत्पाद सूची" /></CardTitle>
          <CardDescription><BilingualText en="Add, edit, and manage your product inventory." hi="अपने उत्पाद सूची को जोड़ें, संपादित करें और प्रबंधित करें।" /></CardDescription>
        </CardHeader>
        <CardContent>
           <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-grow">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder_en="Search by product name or category..." 
                    placeholder_hi="उत्पाद का नाम या श्रेणी से खोजें..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            {/* Add Filter button or Select components here if needed */}
            <Button className="w-full sm:w-auto">
                <PackagePlus className="mr-2 h-4 w-4" />
                <BilingualText en="Add New Product" hi="नया उत्पाद जोड़ें" />
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead><BilingualText en="Name" hi="नाम" /></TableHead>
                  <TableHead><BilingualText en="Category" hi="श्रेणी" /></TableHead>
                  <TableHead><BilingualText en="Price" hi="मूल्य" /></TableHead>
                  <TableHead><BilingualText en="Stock" hi="भंडार" /></TableHead>
                  <TableHead><BilingualText en="Status" hi="स्थिति" /></TableHead>
                  <TableHead className="text-right"><BilingualText en="Actions" hi="कार्रवाइयां" /></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length > 0 ? filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>₹{product.price.toFixed(2)}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>
                        <Badge variant={product.status === "Active" ? "default" : "outline"} className={product.status === "Active" ? "bg-green-500/20 text-green-700 border-green-400" : "bg-red-500/10 text-red-700 border-red-400"}>
                           {product.status}
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
                           <BilingualText en="No products found." hi="कोई उत्पाद नहीं मिला।" />
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
