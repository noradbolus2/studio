
"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BilingualText } from '@/components/shared/BilingualText';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ArrowLeft, Package, CheckCircle, Truck, Home as HomeIcon } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface TrackingStep {
  id: string;
  statusEn: string;
  statusHi: string;
  timestamp?: string;
  completed: boolean;
  icon: React.ElementType;
}

export default function TrackOrderPage() {
  const router = useRouter();
  const { orderId: rawOrderId } = useParams(); // Destructure directly
  const orderId = rawOrderId as string;

  const [isLoading, setIsLoading] = useState(true);
  const [trackingSteps, setTrackingSteps] = useState<TrackingStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const mockTrackingData: TrackingStep[] = [
    { id: 'placed', statusEn: 'Order Placed', statusHi: 'ऑर्डर दिया गया', icon: Package, completed: false },
    { id: 'confirmed', statusEn: 'Order Confirmed', statusHi: 'ऑर्डर की पुष्टि हुई', icon: CheckCircle, completed: false },
    { id: 'preparing', statusEn: 'Preparing Your Order', statusHi: 'आपका ऑर्डर तैयार हो रहा है', icon: Package, completed: false },
    { id: 'out_for_delivery', statusEn: 'Out for Delivery', statusHi: 'डिलीवरी के लिए निकला', icon: Truck, completed: false },
    { id: 'delivered', statusEn: 'Delivered', statusHi: 'पहुंचा दिया गया', icon: HomeIcon, completed: false },
  ];

  useEffect(() => {
    if (orderId) {
      setIsLoading(true);
      // Simulate fetching order status
      setTimeout(() => {
        const steps = [...mockTrackingData];
        const randomProgress = Math.floor(Math.random() * (steps.length +1)); // 0 to 5
        
        let tempCurrentStepIndex = 0;
        for (let i = 0; i < steps.length; i++) {
          if (i < randomProgress) {
            steps[i].completed = true;
            steps[i].timestamp = new Date(Date.now() - (steps.length - 1 - i) * 5 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            if (steps[i].completed) {
                tempCurrentStepIndex = i;
            }
          }
        }
        // If all steps are completed, currentStepIndex should be last step.
        // If no steps completed, it's 0.
        // If some steps completed, it's the index of the last completed step.
        if (randomProgress === steps.length) {
             tempCurrentStepIndex = steps.length -1;
        }


        setTrackingSteps(steps);
        setCurrentStepIndex(tempCurrentStepIndex);
        setIsLoading(false);
      }, 1200);
    } else {
      // If no orderId, stop loading and potentially show an error or redirect
      setIsLoading(false);
      // Consider redirecting or showing a message if orderId is missing
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
    if (trackingSteps.length === 0 || !trackingSteps[currentStepIndex]) {
      return 'Loading...';
    }
    // If the current step is completed AND it's not the last step, show the next step's status as current.
    if (trackingSteps[currentStepIndex].completed && currentStepIndex < trackingSteps.length - 1) {
      return trackingSteps[currentStepIndex + 1].statusEn;
    }
    // Otherwise, show the current step's status.
    return trackingSteps[currentStepIndex].statusEn;
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
                <div className={cn("pt-1.5", step.completed ? "opacity-100" : "opacity-60")}>
                  <p className={cn("font-semibold", step.completed && index === currentStepIndex ? "text-primary" : "")}>
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
