
"use client";

import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Bell, MessageSquare, UserCog, Settings } from "lucide-react"; // Added Settings
import Link from "next/link";

interface ActionItem {
  id: string;
  labelEn: string;
  labelHi: string;
  icon: React.ElementType;
  href: string;
}

interface StaffDashboardViewProps {
  staffName: string;
  designation: string;
  actions: ActionItem[];
}

export default function StaffDashboardView({ staffName, designation, actions }: StaffDashboardViewProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-xl">
            <BilingualText en={`Welcome, ${staffName}! (${designation})`} hi={`स्वागत है, ${staffName}! (${designation})`} />
          </CardTitle>
          <CardDescription>
            <BilingualText en="Your access point for school information and tools." hi="स्कूल की जानकारी और उपकरणों के लिए आपका एक्सेस प्वाइंट।" />
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle className="font-headline"><BilingualText en="Quick Links" hi="त्वरित लिंक"/></CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {actions.map(action => (
                <Button
                    key={action.id}
                    variant="outline"
                    className="h-auto py-4 flex flex-col items-center justify-center text-center gap-2 hover:bg-primary/5 hover:border-primary"
                    asChild
                >
                    <Link href={action.href}>
                        <action.icon className="h-7 w-7 text-primary mb-1"/>
                        <span className="text-xs font-medium"><BilingualText en={action.labelEn} hi={action.labelHi} /></span>
                    </Link>
                </Button>
            ))}
             <Button
                variant="outline"
                className="h-auto py-4 flex flex-col items-center justify-center text-center gap-2 hover:bg-primary/5 hover:border-primary"
                asChild
            >
                <Link href="/settings/app">
                    <Settings className="h-7 w-7 text-primary mb-1"/>
                    <span className="text-xs font-medium"><BilingualText en="App Settings" hi="ऐप सेटिंग्स" /></span>
                </Link>
            </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle className="font-headline"><BilingualText en="Recent School Announcements" hi="हाल की स्कूल घोषणाएँ"/></CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground text-sm">
                <BilingualText en="[Placeholder for announcements visible to this staff role]" hi="[इस स्टाफ भूमिका के लिए दृश्यमान घोषणाओं के लिए प्लेसहोल्डर]" />
            </p>
            <Button variant="link" className="p-0 h-auto mt-2" asChild>
                <Link href="/school-dashboard/announcements">
                    <BilingualText en="View All Announcements" hi="सभी घोषणाएँ देखें"/>
                </Link>
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
