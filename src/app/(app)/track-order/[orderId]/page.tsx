
"use client";

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react'; 
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BilingualText } from '@/components/shared/BilingualText';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ArrowLeft, Package, CheckCircle, Truck, Home as HomeIcon, MapPin, ShoppingBag } from 'lucide-react'; 
import { Progress } from '@/components/ui/progress';
import { MapDisplay } from '@/components/tracking/MapDisplay';
import { cn } from '@/lib/utils';

interface TrackingStep {
  id: string;
  statusEn: string;
  statusHi: string;
  timestamp?: string;
  completed: boolean;
  icon: React.ElementType;
}

interface MapMarkerConfig { 
  id: string;
  position: { lat: number; lng: number };
  label?: string;
  iconUrl?: string;
  iconSize?: { width: number; height: number };
}

const mockTrackingData: TrackingStep[] = [
  { id: 'placed', statusEn: 'Order Placed', statusHi: 'ऑर्डर दिया गया', icon: ShoppingBag, completed: false },
  { id: 'confirmed', statusEn: 'Order Confirmed by Vendor', statusHi: 'विक्रेता द्वारा ऑर्डर की पुष्टि', icon: CheckCircle, completed: false },
  { id: 'preparing', statusEn: 'Preparing Your Order', statusHi: 'आपका ऑर्डर तैयार हो रहा है', icon: Package, completed: false },
  { id: 'out_for_delivery', statusEn: 'Rider En Route', statusHi: 'राइडर रास्ते में है', icon: Truck, completed: false },
  { id: 'delivered', statusEn: 'Delivered to Your Location', statusHi: 'आपके स्थान पर पहुंचाया गया', icon: HomeIcon, completed: false },
];

const mockClusteredOrderIds = ["ORD78924", "ORD78925"];


export default function TrackOrderPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.orderId as string;

  const [isLoading, setIsLoading] = useState(true);
  const [trackingSteps, setTrackingSteps] = useState<TrackingStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const vendorLocation = useMemo(() => ({ lat: 28.63576, lng: 77.22445 }), []); 
  const riderLocation = useMemo(() => ({ lat: 28.6250, lng: 77.2150 }), []); 
  const deliveryLocation = useMemo(() => ({ lat: 28.6139, lng: 77.2090 }), []); 

  const mapMarkers: MapMarkerConfig[] = [
    { id: 'vendor', position: vendorLocation, label: 'V', iconUrl: '/assets/icons/store-marker.png', iconSize: { width: 30, height: 30 } },
    { id: 'rider', position: riderLocation, label: 'R', iconUrl: '/assets/icons/rider-marker.png', iconSize: { width: 30, height: 30 } },
    { id: 'delivery', position: deliveryLocation, label: 'H', iconUrl: '/assets/icons/home-marker.png', iconSize: { width: 30, height: 30 } },
  ];
  
  const mapCenter = useMemo(() => ({
    lat: (vendorLocation.lat + deliveryLocation.lat) / 2,
    lng: (vendorLocation.lng + deliveryLocation.lng) / 2,
  }), [vendorLocation, deliveryLocation]);

  const isClustered = mockClusteredOrderIds.includes(orderId);


  useEffect(() => {
    if (orderId) {
      setIsLoading(true);
      
      const interval = setInterval(() => {
        setTrackingSteps(prevSteps => {
          const newSteps = [...prevSteps];
          let newStepIndex = -1;
          for(let i=0; i<newSteps.length; i++){
            if(!newSteps[i].completed){
              newStepIndex = i;
              break;
            }
          }

          if(newStepIndex !== -1){
            newSteps[newStepIndex].completed = true;
            newSteps[newStepIndex].timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            setCurrentStepIndex(newStepIndex);
          } else {
            clearInterval(interval);
          }
          return newSteps;
        });
      }, 3000); // Progress every 3 seconds
      
      // Initialize steps
      setTrackingSteps(mockTrackingData);
      setIsLoading(false);

      return () => clearInterval(interval);
    } else {
      setIsLoading(false);
    }
  }, [orderId]); 

  const progressValue = trackingSteps.length > 0 ? ((currentStepIndex + (trackingSteps[currentStepIndex]?.completed ? 1: 0) ) / trackingSteps.length) * 100 : 0;


  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
        <LoadingSpinner size={48} />
        <p className="mt-4 text-muted-foreground"><BilingualText en="Loading order details..." hi="ऑर्डर विवरण लोड हो रहा है..." /></p>
      </div>
    );
  }

  if (!orderId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
        <p className="text-destructive"><BilingualText en="No order ID provided or order not found." hi="कोई ऑर्डर आईडी प्रदान नहीं की गई या ऑर्डर नहीं मिला।" /></p>
        <Button variant="outline" onClick={() => router.push('/')} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> <BilingualText en="Back to Home" hi="होम पर वापस जाएं" />
        </Button>
      </div>
    );
  }

  const getCurrentStatusText = () => {
    if (trackingSteps.length === 0) {
      return 'Loading...';
    }
    const currentActiveStep = trackingSteps[currentStepIndex];
    if (currentActiveStep?.completed && currentStepIndex === trackingSteps.length - 1) {
        return currentActiveStep.statusEn;
    }
    if(currentActiveStep?.completed && trackingSteps[currentStepIndex + 1]) {
        return trackingSteps[currentStepIndex + 1].statusEn;
    }
    return currentActiveStep?.statusEn || 'Loading...';
  };


  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-headline text-primary flex items-center gap-2">
            <Truck className="h-7 w-7" />
            <BilingualText en="Track Your Order" hi="अपने ऑर्डर को ट्रैक करें" />
          </h1>
          <p className="text-muted-foreground">
            <BilingualText en={`Order ID: #${orderId}`} hi={`ऑर्डर आईडी: #${orderId}`} />
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => router.push('/')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          <BilingualText en="Home" hi="होम" />
        </Button>
      </header>
      
      {isClustered && (
        <Card className="bg-green-500/10 border-green-500/30">
            <CardContent className="p-4 text-center">
                <h3 className="font-bold text-green-700">🎉 OSO Smart Delivery Applied!</h3>
                <p className="text-sm text-muted-foreground">Your order has been clubbed with nearby deliveries.</p>
                <p className="text-sm font-semibold">Delivery Charges: ₹0</p>
            </CardContent>
        </Card>
      )}

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle><BilingualText en="Live Location & Route" hi="लाइव लोकेशन और मार्ग" /></CardTitle>
          <CardDescription><BilingualText en="See the current locations on the map." hi="मानचित्र पर वर्तमान स्थान देखें।" /></CardDescription>
        </CardHeader>
        <CardContent>
          <MapDisplay 
            mapCenter={mapCenter} 
            markers={mapMarkers}
            zoom={12} 
          />
          <div className="grid grid-cols-3 gap-2 mt-3 text-xs text-muted-foreground text-center">
            <p><ShoppingBag size={12} className="inline mr-1 text-blue-500"/> Vendor Location (V)</p>
            <p><Truck size={12} className="inline mr-1 text-red-500"/> Rider Location (R)</p>
            <p><HomeIcon size={12} className="inline mr-1 text-green-500"/> Your Location (H)</p>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle><BilingualText en="Current Status" hi="वर्तमान स्थिति" />: {getCurrentStatusText()}</CardTitle>
          <CardDescription><BilingualText en="Estimated Delivery: Within 45 minutes from confirmation." hi="अनुमानित डिलीवरी: पुष्टि से 45 मिनट के भीतर।" /></CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 pt-2">
          <Progress value={progressValue} className="w-full h-3" />
          <div className="space-y-6">
            {trackingSteps.map((step, index) => (
              <div key={step.id} className="flex items-start gap-4">
                <div className={cn(
                  "flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center border-2",
                  step.completed ? "bg-primary border-primary text-primary-foreground" : "bg-muted border-border text-muted-foreground"
                )}>
                  <step.icon size={20} />
                </div>
                <div className={cn("pt-1.5", step.completed || index === currentStepIndex ? "opacity-100" : "opacity-50")}>
                  <p className={cn("font-semibold", step.completed && index <= currentStepIndex ? "text-primary" : "")}>
                    <BilingualText en={step.statusEn} hi={step.statusHi} />
                  </p>
                  {step.completed && step.timestamp && (
                    <p className="text-xs text-muted-foreground">{step.timestamp}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="justify-center">
             <p className="text-sm text-muted-foreground"><BilingualText en="Thank you for your order!" hi="आपके आदेश के लिए धन्यवाद!"/></p>
        </CardFooter>
      </Card>
    </div>
  );
}
