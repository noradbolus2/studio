
// src/app/(app)/school-dashboard/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { School, Users, UserCog, Bell, CalendarDays, FileText, ArrowRight, BarChart3, Edit, Activity, AlertCircle, CheckCircle, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import type { SchoolProfileFormData } from '../edit-school-profile/page';
import { cn } from '@/lib/utils';


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

interface ActivityItem {
  id: string;
  textEn: string;
  textHi: string;
  timestamp: string; // e.g., "2 hours ago", "Yesterday"
  icon: React.ElementType;
  iconColor?: string;
}

const mockActivities: ActivityItem[] = [
  { id: "act1", textEn: "New student 'Riya Sharma' enrolled in Class 9A.", textHi: "नई छात्रा 'रिया शर्मा' कक्षा 9A में नामांकित हुई।", timestamp: "1 hour ago", icon: UserPlus, iconColor: "text-green-500" },
  { id: "act2", textEn: "Parent-Teacher Meeting for Class 10 scheduled.", textHi: "कक्षा 10 के लिए अभिभावक-शिक्षक बैठक निर्धारित।", timestamp: "3 hours ago", icon: CalendarDays, iconColor: "text-blue-500" },
  { id: "act3", textEn: "Fee reminder sent for overdue payments.", textHi: "अतिदेय भुगतानों के लिए शुल्क अनुस्मारक भेजा गया।", timestamp: "Yesterday", icon: AlertCircle, iconColor: "text-yellow-500" },
  { id: "act4", textEn: "Staff meeting minutes uploaded.", textHi: "कर्मचारी बैठक के मिनट्स अपलोड किए गए।", timestamp: "2 days ago", icon: FileText, iconColor: "text-purple-500" },
  { id: "act5", textEn: "Annual Sports Day successfully conducted.", textHi: "वार्षिक खेल दिवस सफलतापूर्वक आयोजित किया गया।", timestamp: "3 days ago", icon: CheckCircle, iconColor: "text-green-500" },
];


export default function SchoolDashboardPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [schoolProfile, setSchoolProfile] = useState<SchoolProfileFormData | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedProfileString = localStorage.getItem('schoolProfileData');
      if (storedProfileString) {
        try {
          setSchoolProfile(JSON.parse(storedProfileString));
        } catch (e) {
          console.error("Failed to parse school profile from localStorage", e);
        }
      }
    }
    setLoadingProfile(false);
  }, []);


  const handleActionClick = (href: string, labelEn: string) => {
    router.push(href);
  };

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
        <School className="h-12 w-12 text-primary mx-auto mb-2" />
        <h1 className="text-3xl font-bold font-headline text-primary">
          {schoolProfile?.schoolName ? schoolProfile.schoolName : <BilingualText en="School Dashboard" hi="स्कूल डैशबोर्ड" />}
        </h1>
        <p className="text-muted-foreground">
          <BilingualText en="Oversee and manage your institution effectively." hi="अपने संस्थान का प्रभावी ढंग से निरीक्षण और प्रबंधन करें।" />
        </p>
         <Button asChild variant="outline" size="sm" className="mt-2">
            <Link href="/edit-school-profile">
                <Edit className="mr-2 h-4 w-4"/>
                <BilingualText en="Edit School Info" hi="स्कूल जानकारी संपादित करें" />
            </Link>
        </Button>
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
            <CardTitle className="font-headline flex items-center gap-2">
                <Activity className="h-6 w-6 text-primary"/>
                <BilingualText en="Recent Activity" hi="हाल की गतिविधि" />
            </CardTitle>
            <CardDescription><BilingualText en="Latest updates and notifications from the school." hi="स्कूल से नवीनतम अपडेट और सूचनाएं।" /></CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
            {mockActivities.length > 0 ? mockActivities.slice(0, 3).map(activity => ( // Show top 3 activities
                <div key={activity.id} className="flex items-start gap-3 p-2.5 bg-muted/30 rounded-md">
                    <activity.icon className={cn("h-5 w-5 mt-0.5 shrink-0", activity.iconColor || "text-muted-foreground")} />
                    <div className="flex-grow">
                        <p className="text-sm text-foreground"><BilingualText en={activity.textEn} hi={activity.textHi} /></p>
                        <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                    </div>
                </div>
            )) : (
                <p className="text-muted-foreground text-sm text-center py-4">
                    <BilingualText en="No recent activity." hi="कोई हाल की गतिविधि नहीं।" />
                </p>
            )}
            {mockActivities.length > 3 && (
                 <Button variant="link" className="w-full justify-center p-0 mt-2 text-primary">
                    <BilingualText en="View All Activity" hi="सभी गतिविधियाँ देखें" /> <ArrowRight className="ml-1 h-4 w-4"/>
                 </Button>
            )}
        </CardContent>
      </Card>
    </div>
  );
}

