
// src/app/(app)/creator-dashboard/orders/[orderId]/page.tsx
"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BilingualText } from '@/components/shared/BilingualText';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ArrowLeft, Package, CheckCircle, User, CalendarDays, Link as LinkIcon, MessageSquare, UploadCloud } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

type OrderStatus = "Pending Acceptance" | "Accepted" | "In Progress" | "Dispatched" | "Completed" | "Cancelled";

interface ProjectOrderDetail {
  id: string;
  projectTitleEn: string;
  projectTitleHi: string;
  studentName: string;
  studentId: string;
  orderDate: string; 
  status: OrderStatus;
  deliveryType: "Digital" | "Physical Kit";
  amount: number;
  studentNotes?: string;
  deliverablesLink?: string; // For digital download
  shippingAddress?: string; // For physical kit
}

const mockOrderDetails: Record<string, ProjectOrderDetail> = {
  "ORD78901": { id: "ORD78901", projectTitleEn: "AI Story Generator", projectTitleHi: "एआई कहानी जनरेटर", studentName: "Riya Sharma", studentId: "USR101", orderDate: "2024-07-15", status: "Pending Acceptance", deliveryType: "Digital", amount: 499, studentNotes: "Need this for a school competition by next week." },
  "ORD78902": { id: "ORD78902", projectTitleEn: "Volcano Model Kit", projectTitleHi: "ज्वालामुखी मॉडल किट", studentName: "Amit Patel", studentId: "USR102", orderDate: "2024-07-14", status: "Accepted", deliveryType: "Physical Kit", amount: 349, shippingAddress: "123 Science Lane, Innovation City" },
  "ORD78903": { id: "ORD78903", projectTitleEn: "AI Story Generator", projectTitleHi: "एआई कहानी जनरेटर", studentName: "Sneha Reddy", studentId: "USR103", orderDate: "2024-07-13", status: "In Progress", deliveryType: "Digital", amount: 499, deliverablesLink: "#" },
  "ORD78904": { id: "ORD78904", projectTitleEn: "Indus Valley Diorama", projectTitleHi: "सिंधु घाटी डायोरमा", studentName: "Mohan Kumar", studentId: "USR104", orderDate: "2024-07-12", status: "Dispatched", deliveryType: "Digital", amount: 199, deliverablesLink: "#" },
  "ORD78905": { id: "ORD78905", projectTitleEn: "Volcano Model Kit", projectTitleHi: "ज्वालामुखी मॉडल किट", studentName: "Priya Singh", studentId: "USR105", orderDate: "2024-07-11", status: "Completed", deliveryType: "Physical Kit", amount: 349, shippingAddress: "456 Learning Drive, Knowledge Town" },
};


export default function CreatorOrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.orderId as string;
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState<ProjectOrderDetail | null>(null);

  useEffect(() => {
    if (orderId) {
      setIsLoading(true);
      // Simulate fetching order details
      setTimeout(() => {
        const foundOrder = mockOrderDetails[orderId];
        setOrder(foundOrder || null);
        setIsLoading(false);
      }, 800);
    } else {
      setIsLoading(false);
    }
  }, [orderId]);
  
  const getStatusBadgeColor = (status: OrderStatus): string => {
     switch (status) {
      case "Pending Acceptance": return "bg-blue-500 text-blue-50";
      case "Accepted": return "bg-yellow-500 text-yellow-50";
      case "In Progress": return "bg-orange-500 text-orange-50";
      case "Dispatched": return "bg-purple-500 text-purple-50";
      case "Completed": return "bg-green-500 text-green-50";
      case "Cancelled": return "bg-red-500 text-red-50";
      default: return "bg-gray-500 text-gray-50";
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
        <LoadingSpinner size={48} />
        <p className="mt-4 text-muted-foreground"><BilingualText en="Loading order details..." hi="ऑर्डर विवरण लोड हो रहा है..." /></p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="space-y-6 text-center">
        <h1 className="text-2xl font-bold font-headline text-destructive">
          <BilingualText en="Order Not Found" hi="ऑर्डर नहीं मिला" />
        </h1>
        <p className="text-muted-foreground">
            <BilingualText en={`The order with ID #${orderId} could not be found.`} hi={`ऑर्डर आईडी #${orderId} नहीं मिला।`} />
        </p>
        <Button variant="outline" onClick={() => router.push('/creator-dashboard')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> <BilingualText en="Back to Dashboard" hi="डैशबोर्ड पर वापस" />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-headline text-primary flex items-center gap-2">
            <Package className="h-7 w-7" />
            <BilingualText en="Order Details" hi="ऑर्डर विवरण" />
          </h1>
          <p className="text-muted-foreground">
            <BilingualText en={`Order ID: #${order.id}`} hi={`ऑर्डर आईडी: #${order.id}`} />
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => router.push('/creator-dashboard')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          <BilingualText en="Back to Dashboard" hi="डैशबोर्ड पर वापस" />
        </Button>
      </header>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl"><BilingualText en={order.projectTitleEn} hi={order.projectTitleHi} /></CardTitle>
            <Badge className={getStatusBadgeColor(order.status)}>{order.status}</Badge>
          </div>
          <CardDescription className="text-sm">
            <BilingualText en={`For: ${order.studentName} (ID: ${order.studentId})`} hi={`किसके लिए: ${order.studentName} (आईडी: ${order.studentId})`} />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
            <p><strong className="font-medium"><CalendarDays size={14} className="inline mr-1.5 text-muted-foreground"/> <BilingualText en="Ordered On:" hi="ऑर्डर की तारीख:" /></strong> {new Date(order.orderDate).toLocaleDateString()}</p>
            <p><strong className="font-medium"><BilingualText en="Type:" hi="प्रकार:" /></strong> {order.deliveryType}</p>
            <p><strong className="font-medium"><BilingualText en="Amount:" hi="राशि:" /></strong> INR {order.amount}</p>
            {order.studentNotes && <p><strong className="font-medium"><BilingualText en="Student Notes:" hi="छात्र नोट्स:" /></strong> {order.studentNotes}</p>}
            {order.shippingAddress && <p><strong className="font-medium"><BilingualText en="Shipping Address:" hi="शिपिंग पता:" /></strong> {order.shippingAddress}</p>}
            {order.deliverablesLink && (
                <Button asChild variant="link" className="p-0 h-auto text-primary">
                    <a href={order.deliverablesLink} target="_blank" rel="noopener noreferrer">
                        <LinkIcon size={14} className="inline mr-1.5"/> <BilingualText en="View/Download Deliverables" hi="वितरण योग्य देखें/डाउनलोड करें"/>
                    </a>
                </Button>
            )}
        </CardContent>
      </Card>

      {order.status === "In Progress" && (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg font-headline"><BilingualText en="Upload Deliverables" hi="वितरण योग्य अपलोड करें"/></CardTitle>
                <CardDescription><BilingualText en="Upload files for digital delivery or mark as dispatched for physical kits." hi="डिजिटल डिलीवरी के लिए फ़ाइलें अपलोड करें या भौतिक किट के लिए प्रेषित के रूप में चिह्नित करें।" /></CardDescription>
            </CardHeader>
            <CardContent>
                <Button className="w-full" onClick={() => toast({title: "Upload Action (Simulated)", description: "File uploader would open here."})}>
                    <UploadCloud className="mr-2 h-5 w-5"/>
                    <BilingualText en="Upload Files" hi="फ़ाइलें अपलोड करें"/>
                </Button>
            </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-headline flex items-center gap-2">
            <MessageSquare className="h-6 w-6"/> <BilingualText en="Communication" hi="संचार" />
          </CardTitle>
          <CardDescription><BilingualText en="Chat with the student regarding this order." hi="इस आदेश के संबंध में छात्र से चैट करें।" /></CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea placeholder_en="Type your message to the student..." placeholder_hi="छात्र को अपना संदेश लिखें..." className="min-h-[80px]" />
        </CardContent>
        <CardFooter>
          <Button className="ml-auto" onClick={() => toast({title: "Message Sent (Simulated)"})}>
            <BilingualText en="Send Message" hi="संदेश भेजें" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

declare module 'react' {
    interface TextareaHTMLAttributes<T> extends HTMLAttributes<T> {
      placeholder_en?: string;
      placeholder_hi?: string;
    }
}

