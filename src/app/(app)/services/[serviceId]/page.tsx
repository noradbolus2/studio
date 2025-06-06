
"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; // Correct hook for App Router
// STEP 1: Import Firebase and your db instance.
// Make sure you have created `src/lib/firebase.ts` as described in the instructions.
// import { db } from '@/lib/firebase'; 
// import { doc, getDoc } from 'firebase/firestore';

import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { BilingualText } from '@/components/shared/BilingualText';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

// Define a type for your service data for better type safety
interface ServiceData {
  name: string;
  type: string;
  description?: string;
  data?: any; // This can be more specific based on your needs
}

const INFO_PREFIX = "INFO: ";

export default function ServicePage() {
  const params = useParams();
  const serviceId = params.serviceId as string; // Get serviceId from URL

  const [serviceData, setServiceData] = useState<ServiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (serviceId) {
      const fetchServiceData = async () => {
        setLoading(true);
        setError(null);
        try {
          // STEP 2: Replace this with actual Firebase fetching logic
          // Ensure you have initialized Firebase and imported 'db' and Firestore functions.
          // const docRef = doc(db, "services", serviceId);
          // const docSnap = await getDoc(docRef);

          // if (docSnap.exists()) {
          //   setServiceData(docSnap.data() as ServiceData);
          // } else {
          //   console.log(`Document ${serviceId} does not exist in services collection.`);
          //   setError(`${INFO_PREFIX}Content for "${serviceId}" is not available yet in Firestore.`);
          //   setServiceData(null); 
          // }

          // --- Mock data for demonstration until Firebase is connected ---
          console.log(`Fetching mock data for serviceId: ${serviceId}`);
          await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
          const mockData: { [key: string]: ServiceData } = {
            elibrary: { name: "E-Library", type: "books_list_page", description: "Access NCERT and reference books.", data: { redirectTo: "/class-6-12-books" } },
            guruji: { name: "AI Guruji", type: "chat_interface", description: "Your personal AI study assistant.", data: { avatarUrl: "https://placehold.co/100x100.png", initialGreetingEn: "Namaste! How can I help?", initialGreetingHi: "नमस्ते! मैं कैसे मदद कर सकता हूँ?"}},
            stationery: { name: "Stationery", type: "product_listing", description: "Order pens, notebooks, and more.", data: { category: "stationery_essentials" }},
            // Add more mock data entries for other serviceIds as needed
          };

          if (mockData[serviceId]) {
            setServiceData(mockData[serviceId]);
          } else {
             setError(`${INFO_PREFIX}Content not available yet for the '${serviceId}' service. Please ensure it is configured in Firestore or mock data.`);
             setServiceData(null);
          }
          // --- End of mock data ---

        } catch (err) {
          console.error("Error fetching service data:", err);
          setError("Failed to load content. Please try again."); // This is a real error
          setServiceData(null);
        } finally {
          setLoading(false);
        }
      };

      fetchServiceData();
    }
  }, [serviceId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
        <LoadingSpinner size={48} />
        <p className="mt-4 text-muted-foreground">
          <BilingualText en="Loading content..." hi="सामग्री लोड हो रही है..." />
        </p>
      </div>
    );
  }

  if (error && !serviceData) {
    const isInfoError = error.startsWith(INFO_PREFIX);
    const displayMessage = isInfoError ? error.substring(INFO_PREFIX.length) : error;
    
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] p-4">
        <Alert variant={isInfoError ? "default" : "destructive"} className="max-w-md text-center">
          <AlertTitle>
            {isInfoError ? (
              <BilingualText en="Content Information" hi="सामग्री जानकारी" />
            ) : (
              <BilingualText en="Error" hi="त्रुटि" />
            )}
          </AlertTitle>
          <AlertDescription>{displayMessage}</AlertDescription>
        </Alert>
         <Button asChild variant="outline" className="mt-4">
            <Link href="/">
                <BilingualText en="Go to Home" hi="होम पर जाएं"/>
            </Link>
        </Button>
      </div>
    );
  }
  
  if (!serviceData) { // Fallback if error is somehow not set but data is null
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] p-4">
        <Alert className="max-w-md text-center">
          <AlertTitle><BilingualText en="Content Unavailable" hi="सामग्री अनुपलब्ध" /></AlertTitle>
          <AlertDescription>
            <BilingualText 
              en={`The content for "${serviceId}" could not be loaded. Please check back later.`} 
              hi={`"${serviceId}" के लिए सामग्री लोड नहीं की जा सकी। कृपया बाद में देखें।`} />
          </AlertDescription>
        </Alert>
        <Button asChild variant="outline" className="mt-4">
            <Link href="/">
                <BilingualText en="Go to Home" hi="होम पर जाएं"/>
            </Link>
        </Button>
      </div>
    );
  }


  // Render content based on serviceData.type
  const renderServiceContent = () => {
    switch (serviceData.type) {
      case 'books_list_page':
        if (serviceData.data?.redirectTo) {
          return (
            <div className="text-center">
              <p className="mb-4"><BilingualText en={`This section will take you to ${serviceData.name}.`} hi={`यह अनुभाग आपको ${serviceData.name} पर ले जाएगा।`} /></p>
              <Button asChild>
                <Link href={serviceData.data.redirectTo}>
                  <BilingualText en={`Go to ${serviceData.name}`} hi={`${serviceData.name} पर जाएं`} />
                </Link>
              </Button>
            </div>
          );
        }
        return <p><BilingualText en="Book listing will appear here." hi="पुस्तक सूची यहाँ दिखाई देगी।" /></p>;
      
      case 'chat_interface':
        return (
          <div className="border p-4 rounded-md bg-muted/50 min-h-[300px] flex flex-col justify-between">
            <p className="text-center text-lg font-semibold">
              <BilingualText en={`Welcome to ${serviceData.name}!`} hi={`${serviceData.name} में आपका स्वागत है!`} />
            </p>
            <p className="text-center text-sm text-muted-foreground">{serviceData.description}</p>
            <div className="mt-4 p-3 bg-primary/10 rounded text-primary text-center">
                {serviceData.data?.initialGreetingEn || "AI Chat Interface Placeholder"}
            </div>
            <Input type="text" placeholder="Ask something..." className="mt-auto"/>
          </div>
        );

      case 'product_listing':
         return <p><BilingualText en={`Products for ${serviceData.name} will be listed here.`} hi={`${serviceData.name} के लिए उत्पाद यहां सूचीबद्ध किए जाएंगे।`} /></p>;
      
      default:
        return <p><BilingualText en="Content is being prepared." hi="सामग्री तैयार की जा रही है।" /></p>;
    }
  };

  return (
    <div className="space-y-6">
      <header className="py-4">
        <h1 className="text-3xl font-bold font-headline text-primary">
          <BilingualText en={serviceData.name} hi={serviceData.name} />
        </h1>
        {serviceData.description && (
          <p className="text-muted-foreground">
            <BilingualText en={serviceData.description} hi={serviceData.description} />
          </p>
        )}
      </header>

      <Card>
        <CardContent className="pt-6">
          {/* If error occurred during content rendering step, it could be shown here too if needed */}
          {renderServiceContent()}
        </CardContent>
      </Card>
       <div className="text-center mt-8">
            <Button asChild variant="outline">
                <Link href="/">
                    <BilingualText en="Back to Home" hi="होम पर वापस जाएं"/>
                </Link>
            </Button>
        </div>
    </div>
  );
}
