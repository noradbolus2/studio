
// src/app/(app)/creator-dashboard/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, PackageCheck, PackagePlus, IndianRupee, ArrowRight, CheckCircle, XCircle, Edit, UploadCloud, Eye, ListFilter, Hourglass, Video } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from '@/hooks/use-toast';
import type { ProfileFormData as CreatorProfileFormData } from '../edit-profile/page';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


type OrderStatus = "Pending Acceptance" | "Accepted" | "In Progress" | "Dispatched" | "Completed" | "Cancelled";

interface ProjectOrder {
  id: string;
  projectId: string;
  projectTitleEn: string;
  projectTitleHi: string;
  studentName: string;
  studentId: string;
  orderDate: string; 
  status: OrderStatus;
  deliveryType: "Digital" | "Physical Kit" | "Live Class Access";
  amount: number;
}

const mockProjectOrders: ProjectOrder[] = [
  { id: "ORD78901", projectId: "cp1", projectTitleEn: "AI Story Generator Template", projectTitleHi: "एआई कहानी जनरेटर टेम्पलेट", studentName: "Riya Sharma", studentId: "USR101", orderDate: "2024-07-15", status: "Pending Acceptance", deliveryType: "Digital", amount: 499 },
  { id: "ORD78902", projectId: "cp2", projectTitleEn: "Volcano Model Kit Guide", projectTitleHi: "ज्वालामुखी मॉडल किट गाइड", studentName: "Amit Patel", studentId: "USR102", orderDate: "2024-07-14", status: "Accepted", deliveryType: "Physical Kit", amount: 349 },
  { id: "ORD78903", projectId: "course1", projectTitleEn: "Intro to Python Course", projectTitleHi: "पायथन कोर्स का परिचय", studentName: "Sneha Reddy", studentId: "USR103", orderDate: "2024-07-13", status: "In Progress", deliveryType: "Digital", amount: 999 },
  { id: "ORD78904", projectId: "cp3", projectTitleEn: "Indus Valley Diorama Plan", projectTitleHi: "सिंधु घाटी डायोरमा योजना", studentName: "Mohan Kumar", studentId: "USR104", orderDate: "2024-07-12", status: "Dispatched", deliveryType: "Digital", amount: 199 },
  { id: "ORD78905", projectId: "liveclass2", projectTitleEn: "Live Physics Masterclass", projectTitleHi: "लाइव भौतिकी मास्टरक्लास", studentName: "Priya Singh", studentId: "USR105", orderDate: "2024-07-11", status: "Completed", deliveryType: "Live Class Access", amount: 299 },
  { id: "ORD78906", projectId: "cp1", projectTitleEn: "AI Story Generator Template", projectTitleHi: "एआई कहानी जनरेटर टेम्पलेट", studentName: "Karan Mehra", studentId: "USR106", orderDate: "2024-07-16", status: "Cancelled", deliveryType: "Digital", amount: 499 },
];

export default function CreatorDashboardPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [orders, setOrders] = useState<ProjectOrder[]>(mockProjectOrders);
  const [creatorProfile, setCreatorProfile] = useState<CreatorProfileFormData | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const creatorStats = {
    pendingOrders: orders.filter(o => o.status === "Pending Acceptance").length,
    activeContent: 5, // Mock: Total active projects/courses
    totalRevenue: orders.filter(o => o.status === "Completed").reduce((sum, o) => sum + o.amount, 0),
  };
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedProfileString = localStorage.getItem('creatorProfileData');
      if (storedProfileString) {
        try {
          setCreatorProfile(JSON.parse(storedProfileString));
        } catch (e) {
          console.error("Failed to parse creator profile from localStorage", e);
        }
      }
    }
    setLoadingProfile(false);
  }, []);


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
  
  if (loadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <LoadingSpinner size={48} />
        <p className="ml-4">Loading dashboard...</p>
      </div>
    );
  }


  return (
    <div className="space-y-8">
      <header className="text-center">
        <Briefcase className="h-12 w-12 text-primary mx-auto mb-2" />
        <h1 className="text-3xl font-bold font-headline text-primary">
          {creatorProfile?.creatorName || creatorProfile?.contactPersonName || <BilingualText en="Creator Dashboard" hi="क्रिएटर डैशबोर्ड" />}
        </h1>
        <p className="text-muted-foreground">
          <BilingualText en="Manage your content, orders, and earnings." hi="अपनी सामग्री, ऑर्डर और कमाई का प्रबंधन करें।" />
        </p>
         <Button asChild variant="outline" size="sm" className="mt-2">
            <Link href="/edit-profile?role=creator">
                <Edit className="mr-2 h-4 w-4"/>
                <BilingualText en="Edit Creator Info" hi="निर्माता जानकारी संपादित करें" />
            </Link>
        </Button>
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
                <CardTitle className="text-sm font-medium"><BilingualText en="Active Content" hi="सक्रिय सामग्री"/></CardTitle>
                <PackageCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{creatorStats.activeContent}</div>
                <p className="text-xs text-muted-foreground"><BilingualText en="Projects & Courses" hi="परियोजनाएं और पाठ्यक्रम"/></p>
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
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
            <Link href="/creator-dashboard/upload-project">
                <PackagePlus className="mr-2 h-5 w-5" />
                <BilingualText en="Upload New Content" hi="नई सामग्री अपलोड करें" />
            </Link>
        </Button>
        <Button variant="outline" className="flex-1" asChild>
             <Link href="/creator-dashboard/my-projects">
                <Edit className="mr-2 h-5 w-5" />
                <BilingualText en="Manage My Content" hi="मेरी सामग्री प्रबंधित करें" />
            </Link>
        </Button>
        <Button variant="outline" className="flex-1" asChild>
             <Link href="/schedule-class">
                <Video className="mr-2 h-5 w-5" />
                <BilingualText en="Schedule Live Class" hi="लाइव क्लास शेड्यूल करें" />
            </Link>
        </Button>
      </div>


      <Tabs defaultValue="pending_acceptance" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6 mb-4">
          <TabsTrigger value="pending_acceptance"><BilingualText en="Pending" hi="लंबित"/></TabsTrigger>
          <TabsTrigger value="accepted"><BilingualText en="Accepted" hi="स्वीकृत"/></TabsTrigger>
          <TabsTrigger value="in_progress"><BilingualText en="In Progress" hi="प्रगति पर"/></TabsTrigger>
          <TabsTrigger value="dispatched_completed"><BilingualText en="Done" hi="पूर्ण"/></TabsTrigger>
          <TabsTrigger value="cancelled"><BilingualText en="Cancelled" hi="रद्द"/></TabsTrigger>
          <TabsTrigger value="all"><BilingualText en="All Orders" hi="सभी आदेश"/></TabsTrigger>
        </TabsList>

        {(["pending_acceptance", "accepted", "in_progress", "dispatched_completed", "cancelled", "all"] as const).map(tabStatus => {
          let filteredOrders: ProjectOrder[];
          if (tabStatus === "pending_acceptance") filteredOrders = orders.filter(o => o.status === "Pending Acceptance");
          else if (tabStatus === "accepted") filteredOrders = orders.filter(o => o.status === "Accepted");
          else if (tabStatus === "in_progress") filteredOrders = orders.filter(o => o.status === "In Progress");
          else if (tabStatus === "dispatched_completed") filteredOrders = orders.filter(o => o.status === "Dispatched" || o.status === "Completed");
          else if (tabStatus === "cancelled") filteredOrders = orders.filter(o => o.status === "Cancelled");
          else filteredOrders = orders;

          return (
            <TabsContent key={tabStatus} value={tabStatus}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span><BilingualText en="Incoming Orders" hi="आने वाले ऑर्डर" /> ({filteredOrders.length})</span>
                    <Button variant="ghost" size="sm"><ListFilter className="mr-1.5 h-4 w-4"/> Filter</Button>
                  </CardTitle>
                  <CardDescription>
                    <BilingualText en="Review and manage orders for your content and classes." hi="अपनी सामग्री और कक्षाओं के लिए ऑर्डर की समीक्षा करें और प्रबंधित करें।" />
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
                                    <BilingualText en={`Order ID: ${order.id} | Student: ${order.studentName} (${order.studentId})`} hi={`ऑर्डर आईडी: ${order.id} | छात्र: ${order.studentName} (${order.studentId})`} />
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
                        <Button size="sm" variant="ghost" asChild>
                            <Link href={`/creator-dashboard/orders/${order.id}`}><Eye className="mr-1 h-4 w-4"/><BilingualText en="View Details" hi="विवरण देखें"/></Link>
                        </Button>
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
                         {order.status === "In Progress" && order.deliveryType !== "Live Class Access" && (
                          <>
                            <Button size="sm" variant="outline" onClick={() => toast({title: "Upload Deliverables (Simulated)", description: "File upload UI would appear here."})}>
                                <UploadCloud className="mr-1 h-4 w-4" /> <BilingualText en="Upload Files" hi="फ़ाइलें अपलोड करें"/>
                            </Button>
                            <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white" onClick={() => handleUpdateOrderStatus(order.id, "Dispatched")}>
                              <PackageCheck className="mr-1 h-4 w-4" /> <BilingualText en="Mark Dispatched" hi="प्रेषित चिह्नित करें"/>
                            </Button>
                          </>
                        )}
                         {order.status === "In Progress" && order.deliveryType === "Live Class Access" && (
                            <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white" onClick={() => handleUpdateOrderStatus(order.id, "Completed")}>
                              <CheckCircle className="mr-1 h-4 w-4" /> <BilingualText en="Mark Class Completed" hi="कक्षा पूर्ण चिह्नित करें"/>
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

    
