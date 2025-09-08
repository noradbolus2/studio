
// src/app/(app)/vendor-dashboard/school-orders/page.tsx
"use client";
import { useState } from "react";
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowLeft, Briefcase, FileText, Calendar, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface B2BOrder {
  id: string;
  schoolName: string;
  items: { description: string; quantity: number }[];
  requestedDelivery: string;
  status: "Pending Quote" | "Quote Sent" | "Order Confirmed" | "Completed";
}

// MOCK DATA REMOVED
const mockB2BOrders: B2BOrder[] = [];

export default function SchoolOrdersPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [orders, setOrders] = useState<B2BOrder[]>(mockB2BOrders);
  
  const getStatusBadgeVariant = (status: B2BOrder['status']) => {
    switch (status) {
      case "Pending Quote": return "bg-yellow-500/20 text-yellow-700 border-yellow-400";
      case "Quote Sent": return "bg-blue-500/20 text-blue-700 border-blue-400";
      case "Order Confirmed": return "bg-purple-500/20 text-purple-700 border-purple-400";
      case "Completed": return "bg-green-500/20 text-green-700 border-green-400";
      default: return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-headline flex items-center gap-2">
          <Briefcase className="h-7 w-7 text-primary" />
          <BilingualText en="School & B2B Orders" hi="स्कूल और B2B ऑर्डर" />
        </h1>
        <Button variant="outline" onClick={() => router.push('/vendor-dashboard')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          <BilingualText en="Back to Dashboard" hi="डैशबोर्ड पर वापस" />
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle><BilingualText en="Bulk Order Requests" hi="बल्क ऑर्डर अनुरोध" /></CardTitle>
          <CardDescription><BilingualText en="Manage bulk orders from OSO partner schools and institutions." hi="OSO भागीदार स्कूलों और संस्थानों से बल्क ऑर्डर प्रबंधित करें।" /></CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
            {orders.length > 0 ? orders.map(order => (
                <Card key={order.id} className="bg-muted/50">
                    <CardHeader className="pb-3 flex flex-row items-start justify-between">
                        <div>
                            <CardTitle className="text-md">{order.schoolName}</CardTitle>
                            <CardDescription className="text-xs">Order #{order.id}</CardDescription>
                        </div>
                        <Badge variant="outline" className={getStatusBadgeVariant(order.status)}>{order.status}</Badge>
                    </CardHeader>
                    <CardContent className="pb-3 space-y-2">
                        <ul className="text-sm list-disc pl-5">
                            {order.items.map((item, index) => (
                                <li key={index}>{item.description} (Qty: {item.quantity})</li>
                            ))}
                        </ul>
                         <p className="text-xs text-muted-foreground pt-1 flex items-center gap-1.5"><Calendar size={12}/> Requested by: {order.requestedDelivery}</p>
                    </CardContent>
                     <CardFooter className="flex justify-end gap-2 border-t pt-2">
                        {order.status === 'Pending Quote' && (
                             <Button size="sm" onClick={() => toast({ title: "Action Coming Soon", description: "Functionality to send quotes will be added." })}>
                                <FileText className="mr-1.5 h-4 w-4" /> Send Quote
                            </Button>
                        )}
                         {order.status === 'Order Confirmed' && (
                             <Button size="sm" variant="secondary" onClick={() => toast({ title: "Action Coming Soon", description: "Functionality to manage dispatch will be added." })}>
                                <CheckCircle className="mr-1.5 h-4 w-4" /> Prepare for Dispatch
                            </Button>
                        )}
                        <Button size="sm" variant="outline">View Details</Button>
                    </CardFooter>
                </Card>
            )) : (
              <div className="text-center py-10 text-muted-foreground">
                  <p><BilingualText en="No B2B orders found." hi="कोई B2B ऑर्डर नहीं मिला।" /></p>
              </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
