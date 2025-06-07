
// src/app/(app)/creator-dashboard/page.tsx
"use client";

import { useState } from 'react';
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, PackageCheck, PackagePlus, IndianRupee, ArrowRight, CheckCircle, XCircle, Edit, UploadCloud, Eye, ListFilter, Hourglass } from "lucide-react";
import Link from "next/link";
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type OrderStatus = "Pending Acceptance" | "Accepted" | "In Progress" | "Dispatched" | "Completed" | "Cancelled";

interface ProjectOrder {
  id: string;
  projectId: string;
  projectTitleEn: string;
  projectTitleHi: string;
  studentName: string;
  studentId: string;
  orderDate: string; // ISO string or formatted
  status: OrderStatus;
  deliveryType: "Digital" | "Physical Kit";
  amount: number;
}

const mockProjectOrders: ProjectOrder[] = [
  { id: "ORD78901", projectId: "cp1", projectTitleEn: "AI Story Generator", projectTitleHi: "एआई कहानी जनरेटर", studentName: "Riya Sharma", studentId: "USR101", orderDate: "2024-07-15", status: "Pending Acceptance", deliveryType: "Digital", amount: 499 },
  { id: "ORD78902", projectId: "cp2", projectTitleEn: "Volcano Model Kit", projectTitleHi: "ज्वालामुखी मॉडल किट", studentName: "Amit Patel", studentId: "USR102", orderDate: "2024-07-14", status: "Accepted", deliveryType: "Physical Kit", amount: 349 },
  { id: "ORD78903", projectId: "cp1", projectTitleEn: "AI Story Generator", projectTitleHi: "एआई कहानी जनरेटर", studentName: "Sneha Reddy", studentId: "USR103", orderDate: "2024-07-13", status: "In Progress", deliveryType: "Digital", amount: 499 },
  { id: "ORD78904", projectId: "cp3", projectTitleEn: "Indus Valley Diorama", projectTitleHi: "सिंधु घाटी डायोरमा", studentName: "Mohan Kumar", studentId: "USR104", orderDate: "2024-07-12", status: "Dispatched", deliveryType: "Digital", amount: 199 },
  { id: "ORD78905", projectId: "cp2", projectTitleEn: "Volcano Model Kit", projectTitleHi: "ज्वालामुखी मॉडल किट", studentName: "Priya Singh", studentId: "USR105", orderDate: "2024-07-11", status: "Completed", deliveryType: "Physical Kit", amount: 349 },
];

const creatorStats = {
    pendingOrders: mockProjectOrders.filter(o => o.status === "Pending Acceptance").length,
    activeProjects: mockProjectOrders.filter(o => o.status === "Accepted" || o.status === "In Progress").length,
    totalRevenue: mockProjectOrders.filter(o => o.status === "Completed").reduce((sum, o) => sum + o.amount, 0),
};

export default function CreatorDashboardPage() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<ProjectOrder[]>(mockProjectOrders);

  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prevOrders => prevOrders.map(order => order.id === orderId ? { ...order, status: newStatus } : order));
    toast({
      title: `Order ${orderId} Updated`,
      description: `Status changed to ${newStatus}.`,
    });
  };

  const getStatusBadgeVariant = (status: OrderStatus): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "Pending Acceptance": return "default"; 
      case "Accepted": return "secondary"; 
      case "In Progress": return "outline"; 
      case "Dispatched": return "secondary"; 
      case "Completed": return "default"; 
      case "Cancelled": return "destructive";
      default: return "outline";
    }
  };
  
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

  return (
    <div className="space-y-8">
      <header className="text-center">
        <Briefcase className="h-12 w-12 text-primary mx-auto mb-2" />
        <h1 className="text-3xl font-bold font-headline text-primary">
          <BilingualText en="Creator Dashboard" hi="क्रिएटर डैशबोर्ड" />
        </h1>
        <p className="text-muted-foreground">
          <BilingualText en="Manage your projects, orders, and earnings." hi="अपने प्रोजेक्ट, ऑर्डर और कमाई का प्रबंधन करें।" />
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium"><BilingualText en="Pending Orders" hi="लंबित आदेश"/></CardTitle>
                <Hourglass className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{creatorStats.pendingOrders}</div>
                <p className="text-xs text-muted-foreground"><BilingualText en="Require your attention" hi="आपका ध्यान आवश्यक है"/></p>
            </CardContent>
        </Card>
         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium"><BilingualText en="Active Projects" hi="सक्रिय परियोजनाएं"/></CardTitle>
                <PackageCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{creatorStats.activeProjects}</div>
                <p className="text-xs text-muted-foreground"><BilingualText en="Currently in progress" hi="वर्तमान में प्रगति पर है"/></p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium"><BilingualText en="Total Revenue" hi="कुल राजस्व"/></CardTitle>
                <IndianRupee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">INR {creatorStats.totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground"><BilingualText en="From completed orders" hi="पूर्ण आदेशों से"/></p>
            </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
            <Link href="/creator-dashboard/upload-project">
                <PackagePlus className="mr-2 h-5 w-5" />
                <BilingualText en="Upload New Project" hi="नया प्रोजेक्ट अपलोड करें" />
            </Link>
        </Button>
        <Button variant="outline" className="flex-1" asChild>
             <Link href="/creator-dashboard/my-projects">
                <Edit className="mr-2 h-5 w-5" />
                <BilingualText en="Manage My Projects" hi="मेरे प्रोजेक्ट प्रबंधित करें" />
            </Link>
        </Button>
      </div>


      <Tabs defaultValue="pending_acceptance" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-5 mb-4">
          <TabsTrigger value="pending_acceptance"><BilingualText en="Pending" hi="लंबित"/></TabsTrigger>
          <TabsTrigger value="accepted"><BilingualText en="Accepted" hi="स्वीकृत"/></TabsTrigger>
          <TabsTrigger value="in_progress"><BilingualText en="In Progress" hi="प्रगति पर"/></TabsTrigger>
          <TabsTrigger value="dispatched_completed"><BilingualText en="Shipped/Done" hi="भेजा/पूर्ण"/></TabsTrigger>
          <TabsTrigger value="all"><BilingualText en="All Orders" hi="सभी आदेश"/></TabsTrigger>
        </TabsList>

        {(["pending_acceptance", "accepted", "in_progress", "dispatched_completed", "all"] as const).map(tabStatus => {
          let filteredOrders: ProjectOrder[];
          if (tabStatus === "pending_acceptance") filteredOrders = orders.filter(o => o.status === "Pending Acceptance");
          else if (tabStatus === "accepted") filteredOrders = orders.filter(o => o.status === "Accepted");
          else if (tabStatus === "in_progress") filteredOrders = orders.filter(o => o.status === "In Progress");
          else if (tabStatus === "dispatched_completed") filteredOrders = orders.filter(o => o.status === "Dispatched" || o.status === "Completed");
          else filteredOrders = orders;

          return (
            <TabsContent key={tabStatus} value={tabStatus}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span><BilingualText en="Incoming Project Orders" hi="आने वाले प्रोजेक्ट ऑर्डर" /> ({filteredOrders.length})</span>
                    <Button variant="ghost" size="sm"><ListFilter className="mr-1.5 h-4 w-4"/> Filter</Button>
                  </CardTitle>
                  <CardDescription>
                    <BilingualText en="Review and manage orders for your projects." hi="अपने प्रोजेक्ट के लिए ऑर्डर की समीक्षा करें और प्रबंधित करें।" />
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {filteredOrders.length > 0 ? filteredOrders.map(order => (
                    <Card key={order.id} className="bg-card border hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-md font-semibold">
                                    <BilingualText en={order.projectTitleEn} hi={order.projectTitleHi} />
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    <BilingualText en={`Order ID: ${order.id} | For: ${order.studentName}`} hi={`ऑर्डर आईडी: ${order.id} | किसके लिए: ${order.studentName}`} />
                                </CardDescription>
                            </div>
                            <Badge variant={getStatusBadgeVariant(order.status)} className={getStatusBadgeColor(order.status)}>{order.status}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="text-sm space-y-1 pb-3">
                        <p><BilingualText en="Ordered on:" hi="ऑर्डर की तारीख:" /> {new Date(order.orderDate).toLocaleDateString()}</p>
                        <p><BilingualText en="Type:" hi="प्रकार:" /> {order.deliveryType}</p>
                        <p><BilingualText en="Amount:" hi="राशि:" /> INR {order.amount}</p>
                      </CardContent>
                      <CardFooter className="flex flex-wrap gap-2 justify-end pt-3 border-t">
                        {order.status === "Pending Acceptance" && (
                          <>
                            <Button size="sm" variant="outline" className="border-red-500 text-red-500 hover:bg-red-500/10 hover:text-red-500" onClick={() => handleUpdateOrderStatus(order.id, "Cancelled")}>
                              <XCircle className="mr-1 h-4 w-4" /> <BilingualText en="Reject" hi="अस्वीकार" />
                            </Button>
                            <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white" onClick={() => handleUpdateOrderStatus(order.id, "Accepted")}>
                              <CheckCircle className="mr-1 h-4 w-4" /> <BilingualText en="Accept Order" hi="ऑर्डर स्वीकार करें" />
                            </Button>
                          </>
                        )}
                        {order.status === "Accepted" && (
                           <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white" onClick={() => handleUpdateOrderStatus(order.id, "In Progress")}>
                             <Hourglass className="mr-1 h-4 w-4" /> <BilingualText en="Mark In Progress" hi="प्रगति पर चिह्नित करें" />
                           </Button>
                        )}
                         {order.status === "In Progress" && (
                          <>
                            <Button size="sm" variant="outline" onClick={() => toast({title: "Upload Deliverables (Simulated)", description: "File upload UI would appear here."})}>
                                <UploadCloud className="mr-1 h-4 w-4" /> <BilingualText en="Upload Files" hi="फ़ाइलें अपलोड करें"/>
                            </Button>
                            <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white" onClick={() => handleUpdateOrderStatus(order.id, "Dispatched")}>
                              <PackageCheck className="mr-1 h-4 w-4" /> <BilingualText en="Mark Dispatched" hi="प्रेषित चिह्नित करें"/>
                            </Button>
                          </>
                        )}
                        {(order.status === "Dispatched" || order.status === "Completed" || order.status === "Cancelled") && (
                            <Button size="sm" variant="ghost" asChild>
                                <Link href={`/creator-dashboard/orders/${order.id}`}><Eye className="mr-1 h-4 w-4"/><BilingualText en="View Details" hi="विवरण देखें"/></Link>
                            </Button>
                        )}
                      </CardFooter>
                    </Card>
                  )) : (
                    <p className="text-muted-foreground text-sm text-center py-6">
                      <BilingualText en={`No orders with status: ${tabStatus.replace("_"," ")}.`} hi={`स्थिति के साथ कोई आदेश नहीं: ${tabStatus.replace("_"," ")}।`} />
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  );
}

    