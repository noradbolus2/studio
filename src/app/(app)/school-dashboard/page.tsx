// src/app/(app)/school-dashboard/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { School, Users, UserCog, Bell, CalendarDays, FileText, ArrowRight, BarChart3, Edit, Activity, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import type { ProfileFormData as SchoolProfileFormData } from '../edit-profile/page';
import { cn } from '@/lib/utils';
import TeacherDashboardView from '@/components/school/TeacherDashboardView'; // Import the new component

const schoolStatsPlaceholders = [
  { id: "students", labelEn: "Total Students", labelHi: "कुल छात्र", value: "N/A", icon: Users, color: "text-blue-500" },
  { id: "staff", labelEn: "Total Staff", labelHi: "कुल कर्मचारी", value: "N/A", icon: UserCog, color: "text-green-500" },
  { id: "events", labelEn: "Upcoming Events", labelHi: "आगामी कार्यक्रम", value: "0", icon: CalendarDays, color: "text-orange-500" },
];

const schoolActionsPrincipal = [ // For Admin/Principal
  { id: "manage_students", labelEn: "Student Management", labelHi: "छात्र प्रबंधन", icon: Users, href: "/school-dashboard/students" },
  { id: "manage_staff", labelEn: "Staff Management", labelHi: "कर्मचारी प्रबंधन", icon: UserCog, href: "/school-dashboard/staff" },
  { id: "announcements", labelEn: "Post Announcements", labelHi: "घोषणाएँ पोस्ट करें", icon: Bell, href: "/school-dashboard/announcements" },
  { id: "timetable", labelEn: "Manage Timetable", labelHi: "समय सारिणी प्रबंधित करें", icon: CalendarDays, href: "/school-dashboard/timetable" },
  { id: "fees", labelEn: "Fee Collection", labelHi: "शुल्क संग्रह", icon: FileText, href: "/school-dashboard/fees" },
  { id: "reports", labelEn: "View Reports", labelHi: "रिपोर्ट देखें", icon: BarChart3, href: "/school-dashboard/reports" },
];

// Actions relevant for a Teacher might be different or a subset
const schoolActionsTeacher = [
  { id: "my_classes", labelEn: "My Classes", labelHi: "मेरी कक्षाएं", icon: Users, href: "/school-dashboard/teacher/my-classes" }, // Example link
  { id: "my_timetable", labelEn: "My Timetable", labelHi: "मेरी समय सारिणी", icon: CalendarDays, href: "/school-dashboard/teacher/timetable" },
  { id: "view_announcements", labelEn: "View Announcements", labelHi: "घोषणाएँ देखें", icon: Bell, href: "/school-dashboard/announcements" },
  { id: "student_attendance", labelEn: "Student Attendance", labelHi: "छात्र उपस्थिति", icon: CheckCircle, href: "/school-dashboard/teacher/attendance" },
];


export default function SchoolDashboardPage() {
  const router = useRouter();
  const [schoolProfile, setSchoolProfile] = useState<SchoolProfileFormData | null>(null);
  const [loggedInUser, setLoggedInUser] = useState<{role?: string; designation?: string; fullName?: string; email?:string} | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const specificProfileString = localStorage.getItem('schoolProfileData');
      const genericProfileString = localStorage.getItem('userProfileData');
      const loggedInUserString = localStorage.getItem('loggedInUser');
      
      let profileToUse: SchoolProfileFormData | null = null;
      if (specificProfileString) {
        try {
          profileToUse = JSON.parse(specificProfileString);
        } catch (e) { console.error("Failed to parse schoolProfileData", e); }
      }
      if (!profileToUse && genericProfileString) {
         try {
          const parsedGeneric = JSON.parse(genericProfileString);
          if (parsedGeneric.role === 'school') {
            profileToUse = parsedGeneric;
            // Optionally re-save to schoolProfileData if it's the definitive key for school context
            // localStorage.setItem('schoolProfileData', JSON.stringify(parsedGeneric));
          }
        } catch (e) { console.error("Failed to parse userProfileData as school profile", e); }
      }
      setSchoolProfile(profileToUse);

      if (loggedInUserString) {
        try {
          setLoggedInUser(JSON.parse(loggedInUserString));
        } catch (e) { console.error("Failed to parse loggedInUser", e); }
      }
    }
    setLoadingData(false);
  }, []);


  const handleActionClick = (href: string, labelEn: string) => {
    // For prototype, directly navigate. In real app, might check permissions.
    router.push(href);
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <LoadingSpinner size={48} />
        <p className="ml-4 text-muted-foreground"><BilingualText en="Loading Dashboard..." hi="डैशबोर्ड लोड हो रहा है..."/></p>
      </div>
    );
  }

  const userDesignation = loggedInUser?.designation?.toLowerCase();

  // Determine which actions to show based on designation
  let currentSchoolActions = schoolActionsPrincipal; // Default to Principal actions
  if (userDesignation === 'teacher') {
    currentSchoolActions = schoolActionsTeacher; // This list should be defined with teacher-specific actions
  } // Add more else if for other roles like 'Accountant', 'Admin Staff' etc.

  return (
    <div className="space-y-8">
      <header className="text-center">
        <School className="h-12 w-12 text-primary mx-auto mb-2" />
        <h1 className="text-3xl font-bold font-headline text-primary">
          {schoolProfile?.schoolName ? schoolProfile.schoolName : <BilingualText en="School Dashboard" hi="स्कूल डैशबोर्ड" />}
        </h1>
        <p className="text-muted-foreground">
          {loggedInUser?.designation ? 
            <BilingualText en={`Welcome, ${loggedInUser.fullName || 'User'} (${loggedInUser.designation})`} hi={`स्वागत है, ${loggedInUser.fullName || 'उपयोगकर्ता'} (${loggedInUser.designation})`} />
            : <BilingualText en="Oversee and manage your institution effectively." hi="अपने संस्थान का प्रभावी ढंग से निरीक्षण और प्रबंधन करें।" />
          }
        </p>
         <Button asChild variant="outline" size="sm" className="mt-2">
            <Link href={`/edit-profile?role=school&email=${loggedInUser?.email || ''}&name=${loggedInUser?.fullName || ''}&designation=${loggedInUser?.designation || ''}`}>
                <Edit className="mr-2 h-4 w-4"/>
                <BilingualText en="Edit Your Profile" hi="अपनी प्रोफ़ाइल संपादित करें" />
            </Link>
        </Button>
      </header>

      {/* Conditional Rendering based on Designation */}
      {userDesignation === 'teacher' ? (
        <TeacherDashboardView teacherName={loggedInUser?.fullName || "Teacher"} />
      ) : (
        <>
          {/* Principal/Admin View - Existing Full Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {schoolStatsPlaceholders.map(stat => (
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
                {currentSchoolActions.map(action => ( // Uses the correct action list
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
                <p className="text-muted-foreground text-sm text-center py-4">
                    <BilingualText en="No recent activity to display. This feed will update with important school events and notifications." hi="प्रदर्शित करने के लिए कोई हालिया गतिविधि नहीं है। यह फ़ीड महत्वपूर्ण स्कूल घटनाओं और सूचनाओं के साथ अपडेट होगी।" />
                </p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

    