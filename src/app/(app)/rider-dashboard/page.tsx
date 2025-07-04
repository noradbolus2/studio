
"use client";

import { useState, useMemo } from 'react';
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
    Bike, Map, Wallet, UserCircle, ListChecks, CheckCircle, XCircle, MapPin, Clock, Phone, Package,
    Backpack, Shirt, Printer, Power, Settings, LineChart, HelpCircle, History as HistoryIcon, ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';


type RiderStatus = 'Online' | 'Offline' | 'On Break';
type OrderStatus = 'Pending Pickup' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
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
  deliveryLocation: string;
  deliveryTo: string;
  deliveryGate?: string;
  deliveryOtp?: string;
  items: OrderItem[];
  totalAmount: number;
}

const mockOrders: Order[] = [
  { id: "OSO19451", status: "Pending Pickup", type: 'Uniform', pickupLocation: 'Sharma Stationery', pickupDistance: '1.2 km', pickupReadyBy: '12:10 PM', deliveryTo: 'Ayush (Class 10)', deliveryLocation: 'OSO Public School', deliveryGate: 'Gate 2', items: [{name: 'Class 10 Uniform Kit', quantity: 1}], totalAmount: 1250 },
  { id: "OSO19452", status: "Pending Pickup", type: 'Stationery', pickupLocation: 'Anil Book Store', pickupDistance: '0.8 km', pickupReadyBy: '12:15 PM', deliveryTo: 'Riya (Class 8)', deliveryLocation: 'Modern School', deliveryGate: 'Gate 1', items: [{name: 'Notebook Pack', quantity: 5}, {name:'Pen Box', quantity:1}], totalAmount: 350 },
  { id: "OSO19448", status: "Out for Delivery", type: 'Print Order', pickupLocation: 'PrintFast', pickupDistance: '2.5 km', deliveryTo: 'Mohan (Class 12)', deliveryLocation: 'Springdales School', deliveryGate: 'Reception', deliveryOtp: '7432', items: [{name: 'Physics Notes Spiral', quantity: 1}], totalAmount: 150 },
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
    activeOrders: mockOrders.filter(o => o.status === 'Pending Pickup' || o.status === 'Out for Delivery').length,
    todaysEarnings: 310,
    avgDeliveryTime: 27,
};

const deliveryTypeIcons: Record<DeliveryType, React.ElementType> = {
    'Stationery': Backpack,
    'Uniform': Shirt,
    'Print Order': Printer,
    'Kit Combo': Package
};

export default function RiderDashboardPage() {
  const router = useRouter();
  const [riderStatus, setRiderStatus] = useState<RiderStatus>('Online');
  const [orders, setOrders] = useState<Order[]>(mockOrders);

  const OrderCard = ({ order }: { order: Order }) => {
    const DeliveryIcon = deliveryTypeIcons[order.type];
    const isPickup = order.status === 'Pending Pickup';
    
    return (
      <Card className={cn(
          "shadow-md border-l-4 transition-all", 
          isPickup ? "border-blue-500 bg-blue-500/5" : "border-orange-500 bg-orange-500/5"
      )}>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-md font-bold flex items-center gap-2">
                <DeliveryIcon className={cn("h-5 w-5", isPickup ? "text-blue-500" : "text-orange-500")} />
                #{order.id}
            </CardTitle>
            <Badge variant={isPickup ? "default" : "secondary"} className={isPickup ? "bg-blue-500 text-white" : "bg-orange-500 text-white"}>{order.status}</Badge>
          </div>
          <CardDescription className="text-xs">
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
                <div>
                    <p className="flex items-center gap-1.5"><MapPin size={14}/> <strong>Deliver to:</strong> {order.deliveryTo} @ {order.deliveryLocation} {order.deliveryGate && `(${order.deliveryGate})`}</p>
                    {order.deliveryOtp && <p className="font-bold text-lg text-center my-2 text-primary">OTP: {order.deliveryOtp}</p>}
                </div>
            )}
        </CardContent>
        <CardFooter className="p-2 bg-muted/50 border-t flex gap-2">
            <Button variant="outline" className="flex-1"><Map className="mr-2 h-4 w-4"/> MAP</Button>
            <Button variant="outline" className="flex-1"><Phone className="mr-2 h-4 w-4"/> CALL</Button>
            {isPickup ? (
                <Button className="flex-1" onClick={() => {}}><CheckCircle className="mr-2 h-4 w-4"/> PICKED</Button>
            ) : (
                <Button className="flex-1" onClick={() => {}}><CheckCircle className="mr-2 h-4 w-4"/> DELIVERED</Button>
            )}
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
                       {orders.filter(o => o.status === 'Pending Pickup').map(order => <OrderCard key={order.id} order={order} />)}
                       <h3 className="font-semibold text-orange-500 pt-2">In Transit</h3>
                       {orders.filter(o => o.status === 'Out for Delivery').map(order => <OrderCard key={order.id} order={order} />)}
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
                                    <Badge variant="outline" className="mt-1 bg-yellow-100 text-yellow-800 border-yellow-300">⭐ {riderData.rating} / 5.0</Badge>
                                </div>
                            </div>
                            <div className="text-sm space-y-2">
                                <div className="flex items-center gap-2"><Phone size={14}/> {riderData.contact} <Badge variant="outline" className="bg-green-100 text-green-800">Verified</Badge></div>
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
    </div>
  );
}
