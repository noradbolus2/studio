
// src/app/(app)/vendor-dashboard/school-forms/page.tsx
"use client";
import { useState } from "react";
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowLeft, ClipboardList, PlusCircle, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface SchoolFormOrder {
  id: string;
  studentName: string;
  schoolName: string;
  formType: string;
  quantity: number;
  status: "New" | "Processing" | "Ready";
  date: string;
}

const mockFormOrders: SchoolFormOrder[] = [];

export default function SchoolFormsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [orders, setOrders] = useState<SchoolFormOrder[]>(mockFormOrders);
  
  const handleProcessOrder = (orderId: string, currentStatus: SchoolFormOrder['status']) => {
    let nextStatus: SchoolFormOrder['status'] | null = null;
    if (currentStatus === 'New') nextStatus = 'Processing';
    if (currentStatus === 'Processing') nextStatus = 'Ready';

    if (nextStatus) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: nextStatus! } : o));
        toast({ title: "Order Updated", description: `Order ${orderId} is now ${nextStatus}.` });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-headline flex items-center gap-2">
          <ClipboardList className="h-7 w-7 text-primary" />
          <BilingualText en="School Forms & Printing" hi="स्कूल फॉर्म और प्रिंटिंग" />
        </h1>
        <Button variant="outline" onClick={() => router.push('/vendor-dashboard')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          <BilingualText en="Back to Dashboard" hi="डैशबोर्ड पर वापस" />
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle><BilingualText en="Incoming Form Requests" hi="आने वाले फॉर्म अनुरोध" /></CardTitle>
          <CardDescription><BilingualText en="Manage requests for printed school materials like TCs, Admission Forms, etc." hi="टीसी, प्रवेश पत्र आदि जैसे मुद्रित स्कूल सामग्री के लिए अनुरोधों का प्रबंधन करें।" /></CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {orders.length > 0 ? orders.map(order => (
                <Card key={order.id} className="bg-muted/50">
                    <CardHeader className="pb-2 flex flex-row items-start justify-between">
                        <div>
                            <CardTitle className="text-md">{order.formType} (x{order.quantity})</CardTitle>
                            <CardDescription className="text-xs">For: {order.studentName} - {order.schoolName}</CardDescription>
                        </div>
                        <Badge variant={order.status === "New" ? "default" : "secondary"}>{order.status}</Badge>
                    </CardHeader>
                    <CardContent className="pb-3 text-xs text-muted-foreground">
                        Date: {order.date}
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2 border-t pt-2">
                        {order.status !== 'Ready' && (
                            <Button size="sm" onClick={() => handleProcessOrder(order.id, order.status)}>
                                {order.status === 'New' && "Start Processing"}
                                {order.status === 'Processing' && "Mark as Ready"}
                            </Button>
                        )}
                         {order.status === 'Ready' && (
                            <span className="text-sm text-green-600 flex items-center gap-1"><CheckCircle size={14}/> Ready for Pickup</span>
                        )}
                    </CardFooter>
                </Card>
            )) : (
              <div className="text-center py-6 text-muted-foreground">
                <BilingualText en="No new form requests." hi="कोई नया फॉर्म अनुरोध नहीं।" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
       <Card>
        <CardHeader>
          <CardTitle><BilingualText en="Manage Form Templates" hi="फॉर्म टेम्प्लेट प्रबंधित करें" /></CardTitle>
          <CardDescription><BilingualText en="Upload and manage templates provided by schools." hi="स्कूलों द्वारा प्रदान किए गए टेम्प्लेट अपलोड और प्रबंधित करें।" /></CardDescription>
        </CardHeader>
        <CardContent>
             <p className="text-muted-foreground text-sm text-center py-4">
                [Template management interface placeholder]
            </p>
        </CardContent>
         <CardFooter>
            <Button variant="outline"><PlusCircle className="mr-2 h-4 w-4"/> Upload New Template</Button>
        </CardFooter>
      </Card>

    </div>
  );
}
