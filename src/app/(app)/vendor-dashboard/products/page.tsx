
// src/app/(app)/vendor-dashboard/products/page.tsx
"use client";
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, PackagePlus, Search, Edit, Trash2, Eye, FileUp, Camera } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState, useMemo, useEffect, type FormEvent } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  mrp: number;
  stock: number;
  status: "Active" | "Inactive";
  schoolName?: string;
  classTag?: string;
}

const VENDOR_PRODUCTS_KEY = "vendorProducts_mock";

const initialMockProducts: Product[] = [
  { id: "PROD001", name: "Classmate Notebook - Single Line (172 Pages)", category: "Notebooks", mrp: 50, price: 45, stock: 150, status: "Active" },
  { id: "PROD002", name: "Cello Gripper Ball Pen - Blue (Pack of 5)", category: "Pens", mrp: 50, price: 50, stock: 300, status: "Active" },
  { id: "PROD003", name: "Apsara Platinum Pencils (Box of 10)", category: "Pencils", mrp: 55, price: 50, stock: 8, status: "Active" },
  { id: "PROD004", name: "Fevicol MR Squeeze Bottle (100g)", category: "Adhesives", mrp: 35, price: 35, stock: 0, status: "Inactive" },
  { id: "UNI001", name: "Boys Shirt (Summer, White)", category: "School Uniforms", mrp: 500, price: 450, stock: 100, status: "Active", schoolName: "Delhi Public School, Noida", classTag: "6-10" },
];

export default function VendorProductsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id' | 'status'>>({ name: '', category: '', mrp: 0, price: 0, stock: 0, schoolName: '', classTag: '' });

  useEffect(() => {
    try {
        const storedProducts = localStorage.getItem(VENDOR_PRODUCTS_KEY);
        if (storedProducts) {
            setProducts(JSON.parse(storedProducts));
        } else {
            setProducts(initialMockProducts);
            localStorage.setItem(VENDOR_PRODUCTS_KEY, JSON.stringify(initialMockProducts));
        }
    } catch (e) {
        console.error("Failed to load products from localStorage:", e);
        setProducts(initialMockProducts);
    }
  }, []);

  const saveProductsToStorage = (updatedProducts: Product[]) => {
      try {
          localStorage.setItem(VENDOR_PRODUCTS_KEY, JSON.stringify(updatedProducts));
      } catch (e) {
          console.error("Failed to save products to localStorage:", e);
          toast({ title: "Error", description: "Could not save product changes.", variant: "destructive" });
      }
  };

  const handleAddNewProduct = (e: FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.category || newProduct.price <= 0 || newProduct.mrp < newProduct.price) {
        toast({ title: "Invalid Data", description: "Please fill Name, Category, a valid Price, and ensure MRP is not less than selling price.", variant: "destructive" });
        return;
    }
    const productToAdd: Product = {
        id: `PROD${Date.now()}`,
        ...newProduct,
        status: newProduct.stock > 0 ? "Active" : "Inactive"
    };
    const updatedProducts = [productToAdd, ...products];
    setProducts(updatedProducts);
    saveProductsToStorage(updatedProducts);
    toast({ title: "Product Added!", description: `"${productToAdd.name}" has been added.`});
    setIsAddDialogOpen(false);
    setNewProduct({ name: '', category: '', mrp: 0, price: 0, stock: 0, schoolName: '', classTag: '' }); // Reset form
  };

  const handleDeleteProduct = (productId: string) => {
    const updatedProducts = products.filter(p => p.id !== productId);
    setProducts(updatedProducts);
    saveProductsToStorage(updatedProducts);
    toast({ title: "Product Deleted", description: "The product has been removed.", variant: "destructive" });
  };


  const groupedProducts = useMemo(() => {
    const filtered = products.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered.reduce((acc, product) => {
        const { category } = product;
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(product);
        return acc;
    }, {} as Record<string, Product[]>);
  }, [products, searchTerm]);

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
          <CardTitle><BilingualText en="Product Inventory" hi="उत्पाद सूची" /></CardTitle>
          <CardDescription><BilingualText en="Add, edit, and manage your product listings." hi="अपने उत्पाद सूची को जोड़ें, संपादित करें और प्रबंधित करें।" /></CardDescription>
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
             <Button variant="outline" className="w-full sm:w-auto" onClick={() => toast({ title: "Feature Coming Soon!", description: "Bulk product import via CSV/Excel will be available in a future update."})}>
                <FileUp className="mr-2 h-4 w-4"/> Bulk Import
            </Button>
            <Button className="w-full sm:w-auto" onClick={() => setIsAddDialogOpen(true)}>
                <PackagePlus className="mr-2 h-4 w-4" />
                <BilingualText en="Add New Product" hi="नया उत्पाद जोड़ें" />
            </Button>
          </div>

          <Accordion type="multiple" defaultValue={Object.keys(groupedProducts)}>
            {Object.keys(groupedProducts).length > 0 ? Object.entries(groupedProducts).map(([category, items]) => (
                <AccordionItem key={category} value={category}>
                    <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-md">{category}</h3>
                            <Badge variant="secondary">{items.length}</Badge>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="p-2 space-y-3">
                        {items.map(product => (
                            <Card key={product.id} className="grid grid-cols-5 items-center p-2">
                                <div className="col-span-3 sm:col-span-2">
                                    <p className="font-medium text-sm">{product.name}</p>
                                    {product.schoolName && <p className="text-xs text-muted-foreground">For: {product.schoolName}</p>}
                                    {product.classTag && <p className="text-xs text-muted-foreground">Class: {product.classTag}</p>}
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-muted-foreground">Price</p>
                                    <p className="text-sm font-semibold">₹{product.price.toFixed(2)}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-muted-foreground">Stock</p>
                                    <p className={`text-sm font-bold ${product.stock === 0 ? 'text-destructive' : product.stock < 10 ? 'text-yellow-500' : ''}`}>
                                        {product.stock}
                                    </p>
                                </div>
                                <div className="col-span-5 sm:col-span-1 mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0 flex justify-end items-center gap-2">
                                     <Badge variant={product.status === "Active" ? "default" : "outline"} className={product.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                                       {product.status}
                                    </Badge>
                                    <div className="flex-grow sm:hidden"/>
                                    <Button variant="ghost" size="icon" className="h-7 w-7"><Edit className="h-4 w-4" /></Button>
                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => handleDeleteProduct(product.id)}><Trash2 className="h-4 w-4" /></Button>
                                </div>
                            </Card>
                        ))}
                    </AccordionContent>
                </AccordionItem>
            )) : (
                 <div className="text-center py-10 text-muted-foreground">
                    <p><BilingualText en="No products found." hi="कोई उत्पाद नहीं मिला।" /></p>
                </div>
            )}
          </Accordion>
        </CardContent>
      </Card>

        {/* Add Product Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle><BilingualText en="Add New Product" hi="नया उत्पाद जोड़ें" /></DialogTitle>
                    <DialogDescription><BilingualText en="Enter the details for the new item. Use the AI suggestions for faster entry." hi="नए आइटम के लिए विवरण दर्ज करें। तेजी से प्रविष्टि के लिए एआई सुझावों का उपयोग करें।" /></DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddNewProduct}>
                    <div className="space-y-4 py-3">
                        <div className="p-2 bg-muted/50 rounded-lg flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">AI Auto-Suggest from Photo:</span>
                             <Button type="button" variant="secondary" size="sm" onClick={() => toast({ title: "Feature Coming Soon!", description: "AI-powered product detection from photo."})}>
                                <Camera className="mr-2 h-4 w-4"/> Snap Photo
                            </Button>
                        </div>
                        <div>
                            <Label htmlFor="name">Product Name*</Label>
                            <Input id="name" value={newProduct.name} onChange={(e) => setNewProduct(p => ({...p, name: e.target.value}))} required />
                        </div>
                         <div>
                            <Label htmlFor="category">Category*</Label>
                            <Input id="category" value={newProduct.category} onChange={(e) => setNewProduct(p => ({...p, category: e.target.value}))} required/>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div>
                                <Label htmlFor="schoolName">School Name (if uniform)</Label>
                                <Input id="schoolName" value={newProduct.schoolName || ''} onChange={(e) => setNewProduct(p => ({...p, schoolName: e.target.value}))} />
                            </div>
                            <div>
                                <Label htmlFor="classTag">Class Tag (e.g., 6-8)</Label>
                                <Input id="classTag" value={newProduct.classTag || ''} onChange={(e) => setNewProduct(p => ({...p, classTag: e.target.value}))} />
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <Label htmlFor="mrp">MRP (₹)*</Label>
                                <Input id="mrp" type="number" value={newProduct.mrp || ''} onChange={(e) => setNewProduct(p => ({...p, mrp: parseFloat(e.target.value) || 0}))} required />
                            </div>
                             <div>
                                <Label htmlFor="price">Selling Price (₹)*</Label>
                                <Input id="price" type="number" value={newProduct.price || ''} onChange={(e) => setNewProduct(p => ({...p, price: parseFloat(e.target.value) || 0}))} required />
                            </div>
                            <div>
                                <Label htmlFor="stock">Stock*</Label>
                                <Input id="stock" type="number" value={newProduct.stock || ''} onChange={(e) => setNewProduct(p => ({...p, stock: parseInt(e.target.value) || 0}))} required />
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground text-center">OSO Commission (Auto-Calculated): ₹{(newProduct.price * 0.1).toFixed(2)}</p>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                        <Button type="submit">Add Product</Button>
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
