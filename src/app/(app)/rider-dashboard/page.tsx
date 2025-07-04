
"use client";

import { useState, useMemo, useEffect } from 'react';
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
    Bike, Map, Wallet, UserCircle, ListChecks, CheckCircle, XCircle, MapPin, Clock, Phone, Package,
    Backpack, Shirt, Printer, Power, Settings, LineChart, HelpCircle, History as HistoryIcon, ShieldCheck, AlertTriangle, School as SchoolIconLucide, Mic,
    Zap, BatteryWarning, WifiOff, UserCheck, TrendingUp, Star, Trophy, Leaf, GitMerge
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Label } from '@/components/ui/label';
import { StudentIdScanDialog } from '@/components/delivery/StudentIdScanDialog';


type RiderStatus = 'Online' | 'Offline' | 'On Break';
type OrderStatus = 'Pending Pickup' | 'Processing' | 'Ready for Pickup' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
type DeliveryType = 'Stationery' | 'Uniform' | 'Print Order' | 'Kit Combo';

interface OrderItem {
  name: string;
  quantity: number;
}

interface Order {
  id: string;
  status: OrderStatus;
  type: DeliveryType;
  pickupLocation: string;
  pickupDistance: string;
  pickupReadyBy?: string;
  deliveryTo: string;
  deliveryLocation: string;
  deliveryInstructions?: string;
  deliveryWindow?: string;
  deliveryOtp?: string;
  items: OrderItem[];
  totalAmount: number;
  isPriority?: boolean;
  priorityDetails?: {
    bonus: number;
    countdownMins: number;
    reason: string;
  };
  clusterId?: string;
  clusterSize?: number;
}

const VENDOR_ORDERS_KEY = "vendorOrders_mock";

const initialMockOrders: Order[] = [
  { 
    id: "OSO19451", 
    status: "Pending Pickup", 
    type: 'Stationery', 
    pickupLocation: 'Gupta Stationery', 
    pickupDistance: '0.5 km', 
    pickupReadyBy: '11:55 AM', 
    deliveryTo: 'Priya (Class 8)', 
    deliveryLocation: 'Modern School, Barakhamba Road', 
    deliveryInstructions: 'Drop at Gate 2 - Ask Mr. Tripathi (Security)',
    deliveryWindow: "9:30–11:00 AM",
    items: [{name: 'Class 10 Biology Practical File', quantity: 1}], 
    totalAmount: 120,
    isPriority: true,
    priorityDetails: {
      bonus: 20,
      countdownMins: 20,
      reason: "Submission today"
    }
  },
  { id: "OSO19452", status: "Pending Pickup", type: 'Stationery', pickupLocation: 'Anil Book Store', pickupDistance: '0.8 km', pickupReadyBy: '12:15 PM', deliveryTo: 'Riya (Class 8)', deliveryLocation: 'Modern School, Barakhamba Road', deliveryInstructions: 'Drop at Main Gate Reception', deliveryWindow: "9:30–11:00 AM", items: [{name: 'Notebook Pack', quantity: 5}, {name:'Pen Box', quantity:1}], totalAmount: 350, clusterId: "CL-998", clusterSize: 2 },
  { id: "OSO19453", status: "Pending Pickup", type: 'Print Order', pickupLocation: 'Anil Book Store', pickupDistance: '0.8 km', pickupReadyBy: '12:15 PM', deliveryTo: 'Karan (Class 8)', deliveryLocation: 'Modern School, Barakhamba Road', deliveryInstructions: 'Drop at Main Gate Reception', deliveryWindow: "9:30–11:00 AM", items: [{name: 'Project Report Printout', quantity: 1}], totalAmount: 50, clusterId: "CL-998", clusterSize: 2 },
  { id: "OSO19448", status: "Out for Delivery", type: 'Print Order', pickupLocation: 'PrintFast', pickupDistance: '2.5 km', deliveryTo: 'Mohan (Class 12)', deliveryLocation: 'Springdales School', deliveryInstructions: 'Reception Desk', deliveryWindow: "10:00 AM - 1:00 PM", deliveryOtp: '7432', items: [{name: 'Physics Notes Spiral', quantity: 1}], totalAmount: 150 },
  { id: "OSO19445", status: "Delivered", type: 'Kit Combo', pickupLocation: 'Hobby Hub', pickupDistance: '3.1 km', deliveryTo: 'Sneha (Class 6)', deliveryLocation: 'Amity International', items: [{name: 'Art Project Kit', quantity: 1}], totalAmount: 499 },
  { id: "OSO19440", status: "Cancelled", type: 'Stationery', pickupLocation: 'Gupta Stationery', pickupDistance: '1.5 km', deliveryTo: 'Karan (Class 9)', deliveryLocation: 'Ryan International', items: [{name: 'Geometry Box', quantity: 1}], totalAmount: 80 },
];

const riderData = {
    name: 'Pankaj Kumar',
    id: '#R7381',
    avatarUrl: 'https://placehold.co/40x40.png',
    dataAiHint: 'delivery person avatar',
    contact: '8883XXXX78',
    rating: 4.9,
    activeOrders: initialMockOrders.filter(o => o.status === 'Pending Pickup' || o.status === 'Out for Delivery').length,
    todaysEarnings: 310,
    avgDeliveryTime: 27,
};

interface Mission {
  id: string;
  titleEn: string;
  titleHi: string;
  descriptionEn: string;
  descriptionHi: string;
  progress: number;
  target: number;
  progressUnit: string;
  bonus: string;
  icon: React.ElementType;
}

const mockMissions: Mission[] = [
  {
    id: "m1",
    titleEn: "School Spirit",
    titleHi: "स्कूल स्पिरिट",
    descriptionEn: "Complete 5 orders to students of Modern School",
    descriptionHi: "मॉडर्न स्कूल के छात्रों को 5 ऑर्डर पूरे करें",
    progress: 2,
    target: 5,
    progressUnit: "orders",
    bonus: "₹50",
    icon: SchoolIconLucide,
  },
  {
    id: "m2",
    titleEn: "Speed Demon",
    titleHi: "स्पीड डीमन",
    descriptionEn: "Complete 3 orders within 1 hour",
    descriptionHi: "1 घंटे के भीतर 3 ऑर्डर पूरे करें",
    progress: 1,
    target: 3,
    progressUnit: "orders",
    bonus: "Speed Bonus",
    icon: Zap,
  },
  {
    id: "m3",
    titleEn: "Combo Master",
    titleHi: "कॉम्बो मास्टर",
    descriptionEn: "Deliver 2 Uniforms + 2 Printouts",
    descriptionHi: "2 यूनिफॉर्म + 2 प्रिंटआउट डिलीवर करें",
    progress: 1,
    target: 4,
    progressUnit: "deliveries",
    bonus: "Combo Bonus",
    icon: Package,
  }
];


const deliveryTypeIcons: Record<DeliveryType, React.ElementType> = {
    'Stationery': Backpack,
    'Uniform': Shirt,
    'Print Order': Printer,
    'Kit Combo': Package
};

export default function RiderDashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [riderStatus, setRiderStatus] = useState<RiderStatus>('Online');
  const [orders, setOrders] = useState<Order[]>([]);
  const [isScanDialogOpen, setIsScanDialogOpen] = useState(false);
  const [currentOrderForScan, setCurrentOrderForScan] = useState<Order | null>(null);

   useEffect(() => {
    // Load orders from localStorage
    try {
        const storedOrdersString = localStorage.getItem(VENDOR_ORDERS_KEY);
        if (storedOrdersString) {
            setOrders(JSON.parse(storedOrdersString));
        } else {
            setOrders(initialMockOrders); // Fallback to initial mock if nothing in storage
        }
    } catch(e) {
        console.error("Failed to load orders from localStorage:", e);
        setOrders(initialMockOrders);
    }
  }, []);

  const clusteredOrders = useMemo(() => {
    const clusters: Record<string, Order[]> = {};
    const individualOrders: Order[] = [];

    orders.forEach(order => {
        if (order.clusterId) {
            if (!clusters[order.clusterId]) {
                clusters[order.clusterId] = [];
            }
            clusters[order.clusterId].push(order);
        } else {
            individualOrders.push(order);
        }
    });

    return { clusters, individualOrders };
  }, [orders]);


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

  const handleScanAndDeliver = (order: Order) => {
    setCurrentOrderForScan(order);
    setIsScanDialogOpen(true);
  };
  
  const handleConfirmDeliveryFromDialog = () => {
    if (currentOrderForScan) {
      handleUpdateStatus(currentOrderForScan.id, 'Delivered');
    }
    setIsScanDialogOpen(false);
    setCurrentOrderForScan(null);
  };

  const OrderCard = ({ order }: { order: Order }) => {
    const DeliveryIcon = deliveryTypeIcons[order.type];
    const isPickup = order.status === 'Pending Pickup';
    
    let actionButton;
    switch (order.status) {
      case 'Pending Pickup':
        actionButton = <Button className="w-full" onClick={() => handleUpdateStatus(order.id, 'Processing')}><CheckCircle className="mr-2 h-4 w-4"/> Accept & Go</Button>;
        break;
      case 'Processing':
        actionButton = <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => handleUpdateStatus(order.id, 'Ready for Pickup')}><Package className="mr-2 h-4 w-4"/> Mark Packed</Button>;
        break;
      case 'Ready for Pickup':
        actionButton = <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={() => handleUpdateStatus(order.id, 'Out for Delivery')}><Bike className="mr-2 h-4 w-4"/> Start Delivery</Button>;
        break;
      case 'Out for Delivery':
        actionButton = <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => handleScanAndDeliver(order)}><UserCheck className="mr-2 h-4 w-4"/> Scan & Deliver</Button>;
        break;
      default:
        actionButton = null;
    }

    return (
      <Card className={cn(
          "shadow-md border-l-4 transition-all", 
          order.isPriority && "border-destructive bg-destructive/10 shadow-lg shadow-destructive/20 animate-pulse",
          !order.isPriority && isPickup && "border-blue-500 bg-blue-500/5",
          !order.isPriority && !isPickup && order.status === 'Out for Delivery' && "border-orange-500 bg-orange-500/5"
      )}>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-md font-bold flex items-center gap-2">
                <DeliveryIcon className={cn("h-5 w-5", isPickup ? "text-blue-500" : "text-orange-500", order.isPriority && "text-destructive")} />
                #{order.id}
            </CardTitle>
            <Badge variant={isPickup ? "default" : "secondary"} className={cn(
                isPickup ? "bg-blue-500 text-white" : "bg-orange-500 text-white",
                order.isPriority && "bg-destructive text-white"
            )}>
              {order.isPriority ? "URGENT" : order.status}
            </Badge>
          </div>
          {order.isPriority && order.priorityDetails && (
            <div className="mt-2 p-2 rounded-md bg-destructive/20 text-destructive-foreground border border-destructive/30">
                <p className="text-sm font-bold flex items-center gap-1.5"><AlertTriangle size={16}/>{order.priorityDetails.reason}</p>
                <div className="flex justify-between items-center text-xs mt-1">
                    <span>Deliver within: <strong>{order.priorityDetails.countdownMins} mins</strong></span>
                    <span>Bonus: <strong>₹{order.priorityDetails.bonus}</strong></span>
                </div>
            </div>
          )}
          <CardDescription className="text-xs pt-1">
            {order.items.map(item => `${item.name} (x${item.quantity})`).join(', ')}
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-3 space-y-2 text-sm">
           {isPickup ? (
                <div>
                    <p className="flex items-center gap-1.5"><MapPin size={14}/> <strong>Pickup:</strong> {order.pickupLocation} ({order.pickupDistance})</p>
                    <p className="flex items-center gap-1.5"><Clock size={14}/> <strong>Ready by:</strong> {order.pickupReadyBy}</p>
                </div>
            ) : (
                <div className="space-y-1">
                    <p className="flex items-center gap-1.5"><MapPin size={14}/> <strong>Deliver to:</strong> {order.deliveryTo} @ {order.deliveryLocation}</p>
                    {order.deliveryWindow && <p className="flex items-start gap-1.5 text-amber-600"><Clock size={14} className="mt-0.5 shrink-0"/> Delivery Window: {order.deliveryWindow}</p>}
                    {order.deliveryInstructions && <p className="flex items-start gap-1.5 text-primary font-medium"><SchoolIconLucide size={14} className="mt-0.5 shrink-0"/> {order.deliveryInstructions}</p>}
                </div>
            )}
        </CardContent>
        {actionButton && (
            <CardFooter className="p-2 bg-muted/50 border-t flex gap-2">
                <Button variant="outline" className="flex-1"><Phone className="mr-2 h-4 w-4"/> CALL</Button>
                {actionButton}
            </CardFooter>
        )}
      </Card>
    );
  };
  
  const ClusterOrderCard = ({ clusterId, ordersInCluster }: { clusterId: string; ordersInCluster: Order[] }) => {
    const pickupLocations = [...new Set(ordersInCluster.map(o => o.pickupLocation))];
    const deliveryLocation = ordersInCluster[0].deliveryLocation;
    const deliveryInstructions = ordersInCluster[0].deliveryInstructions;

    return (
        <Card className="shadow-lg border-l-4 border-blue-500 bg-blue-500/10">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-md font-bold flex items-center gap-2">
                        <GitMerge className="h-5 w-5 text-blue-500" />
                        Batch Order #{clusterId}
                    </CardTitle>
                    <Badge className="bg-blue-500 text-white">{ordersInCluster.length} Orders</Badge>
                </div>
            </CardHeader>
            <CardContent className="pb-3 space-y-2 text-sm">
                <div>
                    <p className="font-semibold">Pickup Points: {pickupLocations.length}</p>
                    <ul className="list-disc list-inside text-xs text-muted-foreground">
                        {pickupLocations.map(loc => <li key={loc}>{loc}</li>)}
                    </ul>
                </div>
                 <div>
                    <p className="font-semibold">Delivery Point: 1</p>
                    <p className="text-xs text-muted-foreground">{deliveryLocation}</p>
                     {deliveryInstructions && <p className="text-xs text-primary font-medium mt-1">Instructions: {deliveryInstructions}</p>}
                </div>
            </CardContent>
            <CardFooter className="p-2 bg-muted/50 border-t flex gap-2">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <Bike className="mr-2 h-4 w-4" /> Start Pickup Trip
                </Button>
            </CardFooter>
        </Card>
    );
};

  
  const StatusSwitch = () => (
    <div className="flex items-center gap-1 rounded-full bg-muted p-1">
      {(['Online', 'On Break', 'Offline'] as const).map(status => {
        const isActive = riderStatus === status;
        let colorClass = '';
        if (isActive) {
          if (status === 'Online') colorClass = 'bg-green-500 text-white';
          if (status === 'On Break') colorClass = 'bg-yellow-500 text-white';
          if (status === 'Offline') colorClass = 'bg-red-500 text-white';
        }
        return (
          <Button
            key={status}
            onClick={() => setRiderStatus(status)}
            size="sm"
            className={cn("text-xs rounded-full flex-1 transition-all h-7", isActive ? colorClass : 'bg-transparent text-muted-foreground')}
          >
            {status}
          </Button>
        );
      })}
    </div>
  );
  
  return (
    <div className="min-h-screen bg-background text-foreground">
        <Tabs defaultValue="home" className="w-full">
            <div className="p-4 space-y-4">
                {/* === HOME TAB CONTENT === */}
                <TabsContent value="home" className="mt-0 space-y-6">
                    <header className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-bold">👋 Hello, {riderData.name}!</h1>
                            <p className="text-sm text-muted-foreground">Welcome to your dashboard.</p>
                        </div>
                        <StatusSwitch/>
                    </header>
                    
                    <div className="grid grid-cols-3 gap-3 text-center">
                        <Card><CardContent className="pt-4"><p className="text-2xl font-bold">{riderData.activeOrders}</p><p className="text-xs text-muted-foreground">Active Orders</p></CardContent></Card>
                        <Card><CardContent className="pt-4"><p className="text-2xl font-bold">₹{riderData.todaysEarnings}</p><p className="text-xs text-muted-foreground">Today's Earnings</p></CardContent></Card>
                        <Card><CardContent className="pt-4"><p className="text-2xl font-bold">{riderData.avgDeliveryTime}<span className="text-lg"> min</span></p><p className="text-xs text-muted-foreground">Avg. Time</p></CardContent></Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 font-headline text-md text-primary">
                                <Trophy size={18} /> Mission Mode™
                            </CardTitle>
                            <CardDescription>Complete daily missions for extra bonuses!</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {mockMissions.map(mission => (
                                <div key={mission.id} className="p-3 bg-muted/50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <mission.icon className="h-6 w-6 text-primary flex-shrink-0" />
                                        <div className="flex-grow">
                                            <p className="font-semibold text-sm">
                                                <BilingualText en={mission.titleEn} hi={mission.titleHi} />
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                <BilingualText en={mission.descriptionEn} hi={mission.descriptionHi} />
                                            </p>
                                        </div>
                                        <Badge variant="secondary" className="bg-yellow-400 text-yellow-900">
                                            {mission.bonus}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Progress value={(mission.progress / mission.target) * 100} className="h-2" />
                                        <span className="text-xs font-mono text-muted-foreground whitespace-nowrap">
                                            {mission.progress}/{mission.target}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 font-headline text-md text-primary">
                                <MapPin size={18} /> Delivery Hotspots
                            </CardTitle>
                            <CardDescription>AI-generated heat zones to help you choose where to go.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                                 <Image src="https://images.unsplash.com/photo-1694610018733-1053fcfb5289?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxtYXAlMjBsb2NhdGlvbiUyMHBvaW50c3xlbnwwfHx8fDE3NTE2Mzk3NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080" alt="Demand Heatmap" width={600} height={300} className="opacity-50 object-cover" data-ai-hint="map location points" />
                            </div>
                            <div className="space-y-3">
                                <div className="text-sm p-2 bg-red-500/10 rounded-md border border-red-500/20">
                                    <p className="font-bold text-red-700">Sector 9: High stationery demand!</p>
                                    <p className="text-xs text-red-600">3 pending orders right now.</p>
                                </div>
                                 <div className="text-sm p-2 bg-blue-500/10 rounded-md border border-blue-500/20">
                                    <p className="font-semibold text-blue-700 flex items-center gap-1.5"><TrendingUp size={16}/> Sector 3: Coaching kit deliveries rising.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 font-headline text-md text-primary">
                                <Map size={18} /> Live Map & Eco-Routes
                            </CardTitle>
                            <CardDescription>View your current route and earn Green Points!</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                                <Image src="https://images.unsplash.com/photo-1612721530870-48b8c7f3a837?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMHx8bWFwJTIwbmF2aWdhdGlvbiUyMHJvdXRlfGVufDB8fHx8MTc1MTYzOTc3N3ww&ixlib=rb-4.1.0&q=80&w=1080" alt="Live map placeholder" width={600} height={300} className="opacity-50 object-cover" data-ai-hint="map navigation route" />
                            </div>
                            <div className="p-3 bg-green-500/10 text-green-700 rounded-lg border border-green-500/20">
                              <h4 className="font-bold flex items-center gap-1.5"><Leaf size={16}/> Green Route Rewards™</h4>
                              <p className="text-xs mt-1">"Take the suggested 5-min walking route for order #OSO19451 and earn 10 Green Points!"</p>
                              <Button size="xs" variant="outline" className="mt-2 border-green-500/30 hover:bg-green-500/20 text-green-700">View Eco-Route</Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 font-headline text-md text-primary">
                                <Zap size={18} /> Smart Assistant
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center gap-3 p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                                <BatteryWarning className="h-6 w-6 text-yellow-500 flex-shrink-0" />
                                <div className="flex-grow">
                                    <p className="text-sm font-semibold">Low Battery</p>
                                    <p className="text-xs text-muted-foreground">Battery at 9%. Switch to low power mode?</p>
                                </div>
                                <Button size="xs" variant="outline" onClick={() => toast({ title: "Low Power Mode Activated (Simulated)" })}>Switch</Button>
                            </div>
                            <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-500/10 border border-gray-500/20">
                                <WifiOff className="h-6 w-6 text-gray-500 flex-shrink-0" />
                                <div className="flex-grow">
                                    <p className="text-sm font-semibold">Offline Mode Active</p>
                                    <p className="text-xs text-muted-foreground">Data will sync when network is back.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-primary/5 border-primary/20">
                      <CardHeader>
                          <CardTitle className="flex items-center gap-2 font-headline text-primary">
                              <Mic className="h-6 w-6" /> Guru-Bot Assistant
                          </CardTitle>
                          <CardDescription>Use your voice to manage deliveries.</CardDescription>
                      </CardHeader>
                      <CardContent className="text-center">
                          <Button 
                              size="icon" 
                              className="h-20 w-20 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90"
                              onClick={() => toast({ title: "Voice Assistant Activated", description: 'Listening... (Feature in development)' })}
                          >
                              <Mic className="h-10 w-10" />
                          </Button>
                          <p className="text-xs text-muted-foreground mt-2">Tap to speak. Try: "Order dikhao"</p>
                      </CardContent>
                    </Card>

                    <div className="grid grid-cols-2 gap-3">
                        <Button variant="outline" size="lg" className="h-14"><ListChecks className="mr-2"/> View Orders</Button>
                        <Button variant="outline" size="lg" className="h-14"><Map className="mr-2"/> Live Route</Button>
                    </div>
                </TabsContent>

                {/* === ORDERS TAB CONTENT === */}
                <TabsContent value="orders" className="mt-0 space-y-4">
                    <header>
                        <h1 className="text-xl font-bold">Your Deliveries</h1>
                        <p className="text-sm text-muted-foreground">Manage your assigned orders here.</p>
                    </header>
                    <div className="space-y-4">
                       <h3 className="font-semibold text-blue-500">Pickup Required</h3>
                       {Object.entries(clusteredOrders.clusters).map(([clusterId, ordersInCluster]) => (
                            <ClusterOrderCard key={clusterId} clusterId={clusterId} ordersInCluster={ordersInCluster} />
                        ))}

                       {clusteredOrders.individualOrders.filter(o => o.status === 'Pending Pickup' || o.status === 'Processing' || o.status === 'Ready for Pickup').sort((a,b) => (b.isPriority ? 1:0) - (a.isPriority ? 1:0)).map(order => <OrderCard key={order.id} order={order} />)}
                       
                       <h3 className="font-semibold text-orange-500 pt-2">In Transit</h3>
                       {clusteredOrders.individualOrders.filter(o => o.status === 'Out for Delivery').sort((a,b) => (b.isPriority ? 1:0) - (a.isPriority ? 1:0)).map(order => <OrderCard key={order.id} order={order} />)}
                    </div>
                </TabsContent>
                
                {/* === EARNINGS TAB CONTENT === */}
                <TabsContent value="earnings" className="mt-0 space-y-4">
                     <header>
                        <h1 className="text-xl font-bold">Your Earnings</h1>
                        <p className="text-sm text-muted-foreground">Track your income and bonuses.</p>
                    </header>
                     <Card>
                        <CardContent className="pt-6 grid grid-cols-2 gap-4 text-center">
                            <div><p className="text-2xl font-bold">₹{riderData.todaysEarnings}</p><p className="text-xs text-muted-foreground">Today (7 orders)</p></div>
                            <div><p className="text-2xl font-bold">₹2,850</p><p className="text-xs text-muted-foreground">This Week</p></div>
                            <div><p className="text-2xl font-bold text-green-500">₹150</p><p className="text-xs text-muted-foreground">Bonuses</p></div>
                            <div>
                                <p className="text-2xl font-bold text-primary">₹500</p>
                                <Progress value={(riderData.todaysEarnings / 500) * 100} className="h-1 mt-1"/>
                                <p className="text-xs text-muted-foreground">Daily Target</p>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-2">
                            <Button className="w-full bg-green-600 hover:bg-green-700">Withdraw to UPI</Button>
                            <Button variant="link" className="text-muted-foreground"><LineChart className="mr-2 h-4 w-4"/>Earnings History</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                {/* === PROFILE TAB CONTENT === */}
                <TabsContent value="profile" className="mt-0 space-y-4">
                     <header>
                        <h1 className="text-xl font-bold">Your Profile</h1>
                        <p className="text-sm text-muted-foreground">Manage your settings and availability.</p>
                    </header>
                    <Card>
                        <CardContent className="pt-6 space-y-4">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-16 w-16">
                                    <AvatarImage src={riderData.avatarUrl} data-ai-hint={riderData.dataAiHint}/>
                                    <AvatarFallback>{riderData.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h2 className="text-lg font-bold">{riderData.name}</h2>
                                    <p className="text-sm text-muted-foreground">ID: {riderData.id}</p>
                                    <div className="flex items-center gap-1 mt-1">
                                      {Array(Math.floor(riderData.rating)).fill(0).map((_, i) => <Star key={i} size={14} className="text-yellow-400 fill-yellow-400"/>)}
                                      {riderData.rating % 1 !== 0 && <Star size={14} className="text-yellow-400 fill-yellow-400" style={{ clipPath: 'inset(0 50% 0 0)'}}/>}
                                      <span className="text-xs font-semibold ml-1">{riderData.rating} / 5.0</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-sm space-y-2">
                                <div className="p-2 border rounded-md">
                                    <div className="flex items-center gap-2"><Phone size={14}/> {riderData.contact} <Badge variant="outline" className="bg-green-100 text-green-800 flex items-center gap-1 text-xs"><CheckCircle size={12}/> Verified</Badge></div>
                                </div>
                            </div>
                            <Button variant="outline" className="w-full" asChild><Link href="/edit-profile?role=rider"><Settings className="mr-2 h-4 w-4"/> Edit Profile & Bank Details</Link></Button>
                            <Button variant="outline" className="w-full"><HelpCircle className="mr-2 h-4 w-4"/> Help & Support</Button>
                             <Button variant="destructive" className="w-full"><Power className="mr-2 h-4 w-4"/> Logout</Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </div>
            
            {/* Main Bottom Nav */}
            <nav className="fixed bottom-0 left-0 right-0 h-16 bg-card/95 backdrop-blur-md border-t border-border shadow- ऊपर z-50">
                <TabsList className="grid w-full h-full grid-cols-4">
                    <TabsTrigger value="home" className="flex flex-col h-full gap-1"><Bike className="h-5 w-5"/> Home</TabsTrigger>
                    <TabsTrigger value="orders" className="flex flex-col h-full gap-1"><ListChecks className="h-5 w-5"/> Orders</TabsTrigger>
                    <TabsTrigger value="earnings" className="flex flex-col h-full gap-1"><Wallet className="h-5 w-5"/> Earnings</TabsTrigger>
                    <TabsTrigger value="profile" className="flex flex-col h-full gap-1"><UserCircle className="h-5 w-5"/> Profile</TabsTrigger>
                </TabsList>
            </nav>
        </Tabs>

        <StudentIdScanDialog 
            isOpen={isScanDialogOpen}
            onClose={() => setIsScanDialogOpen(false)}
            onConfirmDelivery={handleConfirmDeliveryFromDialog}
            studentName={currentOrderForScan?.deliveryTo || ''}
        />
    </div>
  );
}
