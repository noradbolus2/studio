
"use client";

import { useState, useMemo } from 'react';
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ShoppingBag, Search, Filter, Eye, Truck, CheckCircle, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface PlatformOrder {
  id: string;
  type: 'Stationery' | 'Project Kit' | 'Course Access' | 'Creator Service';
  customerName: string;
  vendorOrCreator: string;
  date: string;
  totalAmount: number;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
}

const mockPlatformOrders: PlatformOrder[] = [
  { id: "ORD78923", type: "Stationery", customerName: "Aarav Sharma", vendorOrCreator: "Gupta Stationery", date: "2024-07-22", totalAmount: 140, status: "Pending" },
  { id: "ORD78924", type: "Project Kit", customerName: "Priya Singh", vendorOrCreator: "Science Wonders", date: "2024-07-21", totalAmount: 349, status: "Processing" },
  { id: "ORD78903", type: "Course Access", customerName: "Sneha Reddy", vendorOrCreator: "Intro to Python Course", date: "2024-07-13", totalAmount: 999, status: "Delivered" },
  { id: "ORD78904", type: "Creator Service", customerName: "Mohan Kumar", vendorOrCreator: "History Buffs Co.", date: "2024-07-12", totalAmount: 199, status: "Delivered" },
  { id: "ORD78926", type: "Stationery", customerName: "Vikram Kumar", vendorOrCreator: "Anil Book Store", date: "2024-07-18", totalAmount: 50, status: "Cancelled" },
];

export default function PlatformOrdersPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");


  const filteredOrders = useMemo(() => {
    return mockPlatformOrders.filter(order =>
      (order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
       order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
       order.vendorOrCreator.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterType === "all" || order.type === filterType) &&
      (filterStatus === "all" || order.status === filterStatus)
    );
  }, [searchTerm, filterType, filterStatus]);

  const getStatusBadge = (status: PlatformOrder['status']) => {
    switch(status) {
        case 'Pending': return <Badge variant="outline" className="bg-yellow-500/20 text-yellow-700 border-yellow-400 flex items-center gap-1"><AlertCircle size={12}/>{status}</Badge>;
        case 'Processing': return <Badge variant="outline" className="bg-blue-500/20 text-blue-700 border-blue-400">{status}</Badge>;
        case 'Shipped': return <Badge variant="outline" className="bg-purple-500/20 text-purple-700 border-purple-400 flex items-center gap-1"><Truck size={12}/>{status}</Badge>;
        case 'Delivered': return <Badge variant="default" className="bg-green-500/20 text-green-700 border-green-400 flex items-center gap-1"><CheckCircle size={12}/>{status}</Badge>;
        case 'Cancelled': return <Badge variant="destructive">{status}</Badge>;
        default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-headline flex items-center gap-2">
          <ShoppingBag className="h-7 w-7 text-primary" />
          <BilingualText en="Platform Orders" hi="प्लेटफ़ॉर्म ऑर्डर" />
        </h1>
        <Button variant="outline" onClick={() => router.push('/platform-admin')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          <BilingualText en="Back to Admin" hi="एडमिन पर वापस" />
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle><BilingualText en="All Orders" hi="सभी ऑर्डर" /></CardTitle>
          <CardDescription><BilingualText en="View and manage all orders across the OSO platform." hi="ओएसओ प्लेटफॉर्म पर सभी ऑर्डर देखें और प्रबंधित करें।" /></CardDescription>
        </CardHeader>
        <CardContent>
           <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-grow">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder_en="Search Order ID, Customer, Vendor..."
                    placeholder_hi="ऑर्डर आईडी, ग्राहक, विक्रेता खोजें..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            {/* Add Filter Selects if needed in future */}
            <Button variant="outline" className="w-full sm:w-auto">
                <Filter className="mr-2 h-4 w-4" />
                <BilingualText en="Filter Orders" hi="आदेश फ़िल्टर करें" />
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Vendor/Creator</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>{order.type}</TableCell>
                    <TableCell>{order.vendorOrCreator}</TableCell>
                    <TableCell>INR {order.totalAmount.toFixed(2)}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7"><Eye className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                )) : (
                     <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                           No orders found.
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
