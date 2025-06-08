
// src/app/(app)/school-dashboard/page.tsx
"use client";

import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { School, Users, UserCog, Bell, CalendarDays, FileText, ArrowRight, BarChart3 } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

const schoolStats = [
  { id: "students", labelEn: "Total Students", labelHi: "कुल छात्र", value: "1250+", icon: Users, color: "text-blue-500" },
  { id: "staff", labelEn: "Total Staff", labelHi: "कुल कर्मचारी", value: "75+", icon: UserCog, color: "text-green-500" },
  { id: "events", labelEn: "Upcoming Events", labelHi: "आगामी कार्यक्रम", value: "3", icon: CalendarDays, color: "text-orange-500" },
];

const schoolActions = [
  { id: "manage_students", labelEn: "Student Management", labelHi: "छात्र प्रबंधन", icon: Users, href: "/school-dashboard/students" },
  { id: "manage_staff", labelEn: "Staff Management", labelHi: "कर्मचारी प्रबंधन", icon: UserCog, href: "/school-dashboard/staff" },
  { id: "announcements", labelEn: "Post Announcements", labelHi: "घोषणाएँ पोस्ट करें", icon: Bell, href: "/school-dashboard/announcements" },
  { id: "timetable", labelEn: "Manage Timetable", labelHi: "समय सारिणी प्रबंधित करें", icon: CalendarDays, href: "/school-dashboard/timetable" },
  { id: "fees", labelEn: "Fee Collection", labelHi: "शुल्क संग्रह", icon: FileText, href: "/school-dashboard/fees" },
  { id: "reports", labelEn: "View Reports", labelHi: "रिपोर्ट देखें", icon: BarChart3, href: "/school-dashboard/reports" },
];

export default function SchoolDashboardPage() {
  const { toast } = useToast();

  const handleActionClick = (href: string, labelEn: string) => {
    toast({
        title: "Navigating (Simulated)",
        description: `This would navigate to ${labelEn}. Page not yet implemented.`,
    });
    // router.push(href); // Uncomment when pages are ready
  };

  return (
    <div className="space-y-8">
      <header className="text-center">
        <School className="h-12 w-12 text-primary mx-auto mb-2" />
        <h1 className="text-3xl font-bold font-headline text-primary">
          <BilingualText en="School Dashboard" hi="स्कूल डैशबोर्ड" />
        </h1>
        <p className="text-muted-foreground">
          <BilingualText en="Oversee and manage your institution effectively." hi="अपने संस्थान का प्रभावी ढंग से निरीक्षण और प्रबंधन करें।" />
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {schoolStats.map(stat => (
          <Card key={stat.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium"><BilingualText en={stat.labelEn} hi={stat.labelHi} /></CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              {/* <p className="text-xs text-muted-foreground">+20.1% from last month</p> */}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
            <CardTitle className="font-headline"><BilingualText en="Quick Actions" hi="त्वरित कार्रवाइयां"/></CardTitle>
            <CardDescription><BilingualText en="Access key school management modules." hi="प्रमुख स्कूल प्रबंधन मॉड्यूल तक पहुंचें।" /></CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {schoolActions.map(action => (
                <Button 
                    key={action.id} 
                    variant="outline" 
                    className="h-auto py-4 flex flex-col items-center justify-center text-center gap-2 hover:bg-primary/5 hover:border-primary"
                    onClick={() => handleActionClick(action.href, action.labelEn)}
                >
                    <action.icon className="h-7 w-7 text-primary mb-1"/>
                    <span className="text-xs font-medium"><BilingualText en={action.labelEn} hi={action.labelHi} /></span>
                </Button>
            ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle className="font-headline"><BilingualText en="Recent Activity" hi="हाल की गतिविधि" /></CardTitle>
            <CardDescription><BilingualText en="Latest updates and notifications from the school." hi="स्कूल से नवीनतम अपडेट और सूचनाएं।" /></CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground text-sm text-center py-4">
                <BilingualText en="[Activity feed placeholder - e.g., New student enrollment, Staff leave request, Parent query]" hi="[गतिविधि फ़ीड प्लेसहोल्डर - जैसे, नया छात्र नामांकन, कर्मचारी अवकाश अनुरोध, अभिभावक प्रश्न]" />
            </p>
        </CardContent>
      </Card>
    </div>
  );
}
