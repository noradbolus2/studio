// src/app/(app)/vendor-dashboard/hardware/page.tsx
"use client";
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowLeft, Printer, ScanBarcode, QrCode } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function HardwareIntegrationPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleConfigure = (featureName: string) => {
    toast({
      title: "Configuration (Coming Soon)",
      description: `Settings for ${featureName} will be available in a future update.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-headline flex items-center gap-2">
          <Printer className="h-7 w-7 text-primary" />
          <BilingualText en="Hardware Integration" hi="हार्डवेयर एकीकरण" />
        </h1>
        <Button variant="outline" onClick={() => router.push('/vendor-dashboard')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          <BilingualText en="Back to Dashboard" hi="डैशबोर्ड पर वापस" />
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle><BilingualText en="Connect Your Devices" hi="अपने डिवाइस कनेक्ट करें" /></CardTitle>
          <CardDescription><BilingualText en="Integrate printers, scanners, and other hardware for a seamless workflow." hi="एक सहज कार्यप्रवाह के लिए प्रिंटर, स्कैनर और अन्य हार्डवेयर को एकीकृत करें।" /></CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <Printer className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-lg">Thermal Printer</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Connect a Bluetooth or USB thermal printer for fast receipt and invoice printing.
              </p>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => handleConfigure('Thermal Printer')}>Configure</Button>
            </CardFooter>
          </Card>
           <Card>
            <CardHeader>
              <ScanBarcode className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-lg">Barcode Scanner</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Integrate a barcode scanner for faster product entry and stock management.
              </p>
            </CardContent>
             <CardFooter>
              <Button className="w-full" onClick={() => handleConfigure('Barcode Scanner')}>Configure</Button>
            </CardFooter>
          </Card>
           <Card>
            <CardHeader>
              <QrCode className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-lg">QR Code Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Generate QR codes for uniform lists or quick product lookups for students.
              </p>
            </CardContent>
             <CardFooter>
              <Button className="w-full" onClick={() => handleConfigure('QR Code Tools')}>Generate</Button>
            </CardFooter>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
