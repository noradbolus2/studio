
// src/app/(app)/vendor-dashboard/notifications/page.tsx
"use client";
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Bell, Package, AlertTriangle, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

interface Notification {
  id: string;
  titleEn: string;
  titleHi: string;
  messageEn: string;
  messageHi: string;
  date: string;
  read: boolean;
  type: "order" | "stock" | "system";
}

const mockNotifications: Notification[] = [
  { id: "N001", titleEn: "New Order Received", titleHi: "नया ऑर्डर प्राप्त हुआ", messageEn: "Order #ORD78923 for 3 items has been placed.", messageHi: "3 आइटम के लिए ऑर्डर #ORD78923 दिया गया है।", date: "2024-07-22 10:30 AM", read: false, type: "order" },
  { id: "N002", titleEn: "Low Stock Alert", titleHi: "कम स्टॉक अलर्ट", messageEn: "Fevicol MR Squeeze Bottle (100g) is now out of stock.", messageHi: "फेविकोल एमआर स्क्वीज़ बोतल (100 ग्राम) अब स्टॉक में नहीं है।", date: "2024-07-21 05:00 PM", read: false, type: "stock" },
  { id: "N003", titleEn: "Payment Processed", titleHi: "भुगतान संसाधित", messageEn: "Payment for order #ORD78920 (₹120) successful.", messageHi: "ऑर्डर #ORD78920 (₹120) के लिए भुगतान सफल।", date: "2024-07-20 11:00 AM", read: true, type: "order" },
  { id: "N004", titleEn: "Platform Update", titleHi: "प्लेटफ़ॉर्म अपडेट", messageEn: "New features added to vendor dashboard. Check them out!", messageHi: "विक्रेता डैशबोर्ड में नई सुविधाएँ जोड़ी गईं। उन्हें देखें!", date: "2024-07-19 09:00 AM", read: true, type: "system" },
];

export default function VendorNotificationsPage() {
  const router = useRouter();

  const getNotificationIcon = (type: Notification['type']) => {
    switch(type) {
        case "order": return <Package className="h-5 w-5 text-blue-500"/>;
        case "stock": return <AlertTriangle className="h-5 w-5 text-yellow-500"/>;
        case "system": return <Bell className="h-5 w-5 text-purple-500"/>;
        default: return <Bell className="h-5 w-5"/>;
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-headline flex items-center gap-2">
          <Bell className="h-7 w-7 text-primary" />
          <BilingualText en="Notifications" hi="सूचनाएं" />
        </h1>
        <Button variant="outline" onClick={() => router.push('/vendor-dashboard')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          <BilingualText en="Back to Dashboard" hi="डैशबोर्ड पर वापस" />
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle><BilingualText en="Recent Alerts & Updates" hi="हालिया अलर्ट और अपडेट" /></CardTitle>
          <CardDescription><BilingualText en="Stay informed about your store's activity." hi="अपने स्टोर की गतिविधि के बारे में सूचित रहें।" /></CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {mockNotifications.length > 0 ? mockNotifications.map(notif => (
            <Card key={notif.id} className={`p-3 ${!notif.read ? 'bg-primary/5 border-primary/30' : 'bg-muted/30'}`}>
              <div className="flex items-start gap-3">
                <div className="mt-1">{getNotificationIcon(notif.type)}</div>
                <div className="flex-grow">
                    <h4 className={`text-sm font-semibold ${!notif.read ? 'text-primary' : ''}`}>
                        <BilingualText en={notif.titleEn} hi={notif.titleHi} />
                    </h4>
                    <p className="text-xs text-muted-foreground"><BilingualText en={notif.messageEn} hi={notif.messageHi} /></p>
                    <p className="text-xs text-muted-foreground mt-0.5">{notif.date}</p>
                </div>
                {!notif.read && <Badge variant="default" className="text-xs h-5 px-1.5 py-0">New</Badge>}
              </div>
            </Card>
          )) : (
            <p className="text-muted-foreground text-center py-6"><BilingualText en="No new notifications." hi="कोई नई सूचना नहीं।" /></p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
