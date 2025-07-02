
// src/app/(app)/vendor-dashboard/orders/page.tsx
"use client";
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ShoppingBag, Search, Filter, Printer, AlertCircle, CheckCircle, Truck } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useState, useMemo, useEffect } from "react";
import { useToast } from '@/hooks/use-toast';

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customerName: string;
  date: string;
  items: OrderItem[];
  totalAmount: number;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
}

const VENDOR_ORDERS_KEY = "vendorOrders_mock";

const initialMockOrders: Order[] = [
  { id: "ORD78924", customerName: "Priya Singh", date: "2024-07-21", items: [{id: "art1", productName: "Color Pencils", quantity: 1, price: 150}], totalAmount: 150, status: "Processing" },
  { id: "ORD78925", customerName: "Rohan Verma", date: "2024-07-20", items: [{id: "book1", productName: "Science Book Cl 8", quantity: 1, price: 120}], totalAmount: 120, status: "Shipped" },
  { id: "ORD78926", customerName: "Sneha Reddy", date: "2024-07-19", items: [{id: "nb2", productName: "Spiral Notebook", quantity: 3, price: 70}], totalAmount: 210, status: "Delivered" },
  { id: "ORD78927", customerName: "Vikram Kumar", date: "2024-07-18", items: [{id: "pen2", productName: "Apsara Pencils", quantity: 1, price: 50}], totalAmount: 50, status: "Cancelled" },
];


export default function VendorOrdersPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Load orders from localStorage
    try {
        const storedOrdersString = localStorage.getItem(VENDOR_ORDERS_KEY);
        if (storedOrdersString) {
            setOrders(JSON.parse(storedOrdersString));
        } else {
            setOrders(initialMockOrders); // Fallback to mock if nothing in storage
        }
    } catch(e) {
        console.error("Failed to load orders from localStorage:", e);
        setOrders(initialMockOrders);
    }
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter(order => 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, orders]);

  const handleUpdateStatus = (orderId: string, newStatus: Order['status']) => {
    const updatedOrders = orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem(VENDOR_ORDERS_KEY, JSON.stringify(updatedOrders));
    toast({
        title: "Order Updated",
        description: `Order #${orderId} has been marked as ${newStatus}.`
    });
  };

  const getStatusBadge = (status: Order['status']) => {
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
          <BilingualText en="Manage Orders" hi="आदेश प्रबंधित करें" />
        </h1>
        <Button variant="outline" onClick={() => router.push('/vendor-dashboard')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          <BilingualText en="Back to Dashboard" hi="डैशबोर्ड पर वापस" />
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle><BilingualText en="Incoming Orders" hi="आने वाले आदेश" /></CardTitle>
          <CardDescription><BilingualText en="View, process, and track customer orders." hi="ग्राहक आदेश देखें, संसाधित करें और ट्रैक करें।" /></CardDescription>
        </CardHeader>
        <CardContent>
           <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-grow">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder_en="Search by Order ID or Customer Name..." 
                    placeholder_hi="ऑर्डर आईडी या ग्राहक के नाम से खोजें..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            {/* Add Filter for status or date range if needed */}
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
                  <TableHead>Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                    <TableCell>INR {order.totalAmount.toFixed(2)}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell className="text-right space-x-1">
                      {order.status === 'Pending' && (
                        <Button size="xs" onClick={() => handleUpdateStatus(order.id, 'Processing')}>Accept</Button>
                      )}
                      {order.status === 'Processing' && (
                        <Button size="xs" onClick={() => handleUpdateStatus(order.id, 'Shipped')}>Mark as Shipped</Button>
                      )}
                      <Button variant="ghost" size="icon" className="h-7 w-7"><Printer className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                )) : (
                     <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                           <BilingualText en="No orders found." hi="कोई आदेश नहीं मिला।" />
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
