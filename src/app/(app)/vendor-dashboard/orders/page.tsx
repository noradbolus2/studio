
// src/app/(app)/vendor-dashboard/orders/page.tsx
"use client";
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowLeft, ShoppingBag, Search, Clock, Check, Package, Bike, XCircle, CheckCircle, Truck, Info, RefreshCw, Languages, AlertTriangle, GitMerge } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useState, useMemo, useEffect } from "react";
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { cn } from "@/lib/utils";

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
  status: "Pending" | "Processing" | "Ready for Pickup" | "Dispatched" | "Completed" | "Cancelled";
  distance?: string; 
  deliveryTime?: string; 
  isPriority?: boolean;
  deliveryInstructions?: string;
  deliveryWindow?: string;
  clusterId?: string; // New field for cluster ID
  clusterSize?: number; // New field for total orders in cluster
}

const VENDOR_ORDERS_KEY = "vendorOrders_mock";

const initialMockOrders: Order[] = [
  { id: "ORD78923", customerName: "Aarav Sharma", date: "2024-07-22", items: [{id: "nb1", productName: "Notebook", quantity: 2, price: 45}, {id: 'geo1', productName: "Geometry Kit", quantity: 1, price: 80}], totalAmount: 245, status: "Pending", distance: "1.2 km", deliveryTime: "35 mins", isPriority: true, deliveryInstructions: "Drop at Gate 2 - Ask for Mr. Tripathi (Security)", deliveryWindow: "9:30–11:00 AM" },
  { id: "ORD78924", customerName: "Priya Singh", date: "2024-07-21", items: [{id: "art1", productName: "Color Pencils", quantity: 1, price: 150}], totalAmount: 150, status: "Processing", clusterId: "CL-XYZ", clusterSize: 2 },
  { id: "ORD78925", customerName: "Rohan Verma", date: "2024-07-20", items: [{id: "book1", productName: "Science Book Cl 8", quantity: 1, price: 120}], totalAmount: 120, status: "Ready for Pickup", clusterId: "CL-XYZ", clusterSize: 2 },
  { id: "ORD78926", customerName: "Sneha Reddy", date: "2024-07-19", items: [{id: "nb2", productName: "Spiral Notebook", quantity: 3, price: 70}], totalAmount: 210, status: "Dispatched" },
  { id: "ORD78927", customerName: "Vikram Kumar", date: "2024-07-18", items: [{id: "pen2", productName: "Apsara Pencils", quantity: 1, price: 50}], totalAmount: 50, status: "Completed" },
  { id: "ORD78928", customerName: "Anika Desai", date: "2024-07-17", items: [{id: "snack1", productName: "Roasted Almonds", quantity: 2, price: 90}], totalAmount: 180, status: "Cancelled" },
];


export default function VendorOrdersPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentLang, setCurrentLang] = useState<'en' | 'hi' | 'hng'>('en');

  const toggleLanguage = () => {
    setCurrentLang(prev => {
        if (prev === 'en') return 'hi';
        if (prev === 'hi') return 'hng';
        return 'en';
    });
  };

  const getLanguageButtonText = () => {
    if (currentLang === 'en') return 'हिन्दी';
    if (currentLang === 'hi') return 'Hinglish';
    return 'English';
  };

  const loadOrders = () => {
    setIsLoading(true);
    try {
        const storedOrdersString = localStorage.getItem(VENDOR_ORDERS_KEY);
        if (storedOrdersString) {
            setOrders(JSON.parse(storedOrdersString));
        } else {
            setOrders(initialMockOrders); 
        }
    } catch(e) {
        console.error("Failed to load orders from localStorage:", e);
        setOrders(initialMockOrders);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const filteredOrders = (status: Order['status'] | 'All') => {
    return orders.filter(order => 
      (status === 'All' || order.status === status) &&
      (order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()))
    ).sort((a,b) => (b.isPriority ? 1 : 0) - (a.isPriority ? 1 : 0)); // Sort priority orders to the top
  };

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

  const statusTabs: { value: Order['status'] | 'All', labelEn: string, labelHi: string, labelHng: string }[] = [
    { value: 'Pending', labelEn: 'New', labelHi: 'नया', labelHng: 'New' },
    { value: 'Processing', labelEn: 'Packing', labelHi: 'पैकिंग', labelHng: 'Packing' },
    { value: 'Ready for Pickup', labelEn: 'Ready', labelHi: 'तैयार', labelHng: 'Ready' },
    { value: 'Dispatched', labelEn: 'Dispatched', labelHi: 'प्रेषित', labelHng: 'Dispatched' },
    { value: 'Completed', labelEn: 'Completed', labelHi: 'पूर्ण', labelHng: 'Completed' },
    { value: 'Cancelled', labelEn: 'Issues', labelHi: 'समस्याएं', labelHng: 'Issues' },
  ];

  const OrderCard = ({ order }: { order: Order }) => {
    let actionButton;
    switch (order.status) {
      case 'Pending':
        actionButton = <Button className="w-full" onClick={() => handleUpdateStatus(order.id, 'Processing')}><Check className="mr-2 h-4 w-4"/> <BilingualText en="Accept Order" hi="ऑर्डर स्वीकार करें" hng="Order Accept Karo" lang={currentLang}/></Button>;
        break;
      case 'Processing':
        actionButton = <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => handleUpdateStatus(order.id, 'Ready for Pickup')}><Package className="mr-2 h-4 w-4"/> <BilingualText en="Mark Packed" hi="पैक किया हुआ चिह्नित करें" hng="Packed Mark Karo" lang={currentLang}/></Button>;
        break;
      case 'Ready for Pickup':
        actionButton = <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={() => handleUpdateStatus(order.id, 'Dispatched')}><Bike className="mr-2 h-4 w-4"/> <BilingualText en="Ready for Pickup" hi="पिकअप के लिए तैयार" hng="Pickup ke liye Ready" lang={currentLang}/></Button>;
        break;
      default:
        actionButton = null;
    }

    return (
        <Card className={cn(
            "shadow-md",
            order.isPriority && "border-destructive bg-destructive/5 animate-pulse",
            order.clusterId && "border-blue-500 bg-blue-500/5"
        )}>
            <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-md font-bold">#{order.id}</CardTitle>
                    <div className="flex items-center gap-2">
                      {order.isPriority && <Badge variant="destructive">URGENT</Badge>}
                      {order.clusterId && <Badge variant="secondary" className="bg-blue-100 text-blue-800"><GitMerge size={12} className="mr-1"/> Batch #{order.clusterId.split('-')[1]}</Badge>}
                      {order.distance && <Badge variant="outline">{order.distance}</Badge>}
                    </div>
                </div>
                 <CardDescription>
                    {order.items.map(i => i.productName).join(', ')} ({order.items.length} <BilingualText en="items" hi="आइटम" lang={currentLang}/>)
                    {order.deliveryWindow && <p className="text-xs text-amber-700 font-medium mt-1">Window: {order.deliveryWindow}</p>}
                    {order.deliveryInstructions && <p className="text-xs text-primary font-medium mt-1">Instructions: {order.deliveryInstructions}</p>}
                 </CardDescription>
            </CardHeader>
            <CardContent className="pb-3">
                 <p className="font-semibold text-lg text-primary">INR {order.totalAmount.toFixed(2)}</p>
                 {order.deliveryTime && <p className="text-xs text-muted-foreground flex items-center gap-1"><Clock size={12}/> <BilingualText en="Delivery in" hi="डिलीवरी में" lang={currentLang} />: {order.deliveryTime}</p>}
                 {order.clusterId && <p className="text-xs text-blue-600 font-semibold mt-1">Pack together with {order.clusterSize! - 1} other order(s).</p>}
            </CardContent>
            {actionButton && (
                <CardFooter className="p-3 bg-muted/50 border-t">
                    {actionButton}
                </CardFooter>
            )}
        </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-headline flex items-center gap-2">
          <ShoppingBag className="h-7 w-7 text-primary" />
          <BilingualText en="Manage Orders" hi="आदेश प्रबंधित करें" lang={currentLang} />
        </h1>
        <div className="flex items-center gap-2">
            <Button onClick={toggleLanguage} variant="outline" size="sm" className="h-7 px-2">
                <Languages className="mr-1.5 h-4 w-4"/> {getLanguageButtonText()}
            </Button>
            <Button variant="outline" onClick={() => router.push('/vendor-dashboard')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              <BilingualText en="Back to Dashboard" hi="डैशबोर्ड पर वापस" lang={currentLang} />
            </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle><BilingualText en="Live Order Flow" hi="लाइव ऑर्डर फ्लो" lang={currentLang} /></CardTitle>
          <CardDescription><BilingualText en="View and process customer orders in real-time." hi="वास्तविक समय में ग्राहक आदेश देखें और संसाधित करें।" lang={currentLang} /></CardDescription>
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
            <Button variant="outline" className="w-full sm:w-auto" onClick={loadOrders} disabled={isLoading}>
                <RefreshCw className={cn("mr-2 h-4 w-4", isLoading && "animate-spin")} />
                <BilingualText en="Refresh" hi="रिफ्रेश" lang={currentLang} />
            </Button>
          </div>
          
          <Tabs defaultValue="Pending">
            <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 h-auto">
              {statusTabs.map(tab => (
                 <TabsTrigger key={tab.value} value={tab.value} className="text-xs sm:text-sm py-1.5 h-auto">
                   <BilingualText en={tab.labelEn} hi={tab.labelHi} hng={tab.labelHng} lang={currentLang}/>
                 </TabsTrigger>
              ))}
            </TabsList>
            {isLoading ? <div className="py-10"><LoadingSpinner/></div> : statusTabs.map(tab => (
              <TabsContent key={tab.value} value={tab.value}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {filteredOrders(tab.value as Order['status']).length > 0 ? (
                       filteredOrders(tab.value as Order['status']).map(order => <OrderCard key={order.id} order={order} />)
                    ) : (
                      <div className="col-span-full text-center py-8 text-muted-foreground">
                        <Info className="mx-auto mb-2 h-8 w-8"/>
                        <p><BilingualText en={`No orders in "${tab.labelEn}"`} hi={`"${tab.labelHi}" में कोई आदेश नहीं`} lang={currentLang}/></p>
                      </div>
                    )}
                  </div>
              </TabsContent>
            ))}
          </Tabs>

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
