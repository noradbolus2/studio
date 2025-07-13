
// src/app/(app)/school-dashboard/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { 
    School, Users, UserCog, Bell, CalendarDays, FileText, ArrowRight, BarChart3, Edit, Activity, CheckCircle,
    BookOpen as LibraryIcon, IndianRupee as RupeeIcon, MessageSquare as InquiryIcon, Settings as GenericStaffIcon, Briefcase, LogOut, SendHorizonal, X
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import type { ProfileFormData as SchoolProfileFormData } from '../edit-profile/page';
import { cn } from '@/lib/utils';
import TeacherDashboardView from '@/components/school/TeacherDashboardView';
import LibrarianDashboardView from '@/components/school/LibrarianDashboardView'; 
import AccountantDashboardView from '@/components/school/AccountantDashboardView'; 
import StaffDashboardView from '@/components/school/StaffDashboardView'; 

const schoolStatsPlaceholders = [
  { id: "students", labelEn: "Total Students", labelHi: "कुल छात्र", value: "0", icon: Users, color: "text-blue-500" },
  { id: "staff", labelEn: "Total Staff", labelHi: "कुल कर्मचारी", value: "0", icon: UserCog, color: "text-green-500" },
  { id: "events", labelEn: "Upcoming Events", labelHi: "आगामी कार्यक्रम", value: "0", icon: CalendarDays, color: "text-orange-500" },
];

// Actions for Principal/Admin
const schoolActionsPrincipal = [
  { id: "manage_students", labelEn: "Student Management", labelHi: "छात्र प्रबंधन", icon: Users, href: "/school-dashboard/students" },
  { id: "manage_staff", labelEn: "Staff Management", labelHi: "कर्मचारी प्रबंधन", icon: UserCog, href: "/school-dashboard/staff" },
  { id: "announcements", labelEn: "Post Announcements", labelHi: "घोषणाएँ पोस्ट करें", icon: Bell, href: "/school-dashboard/announcements" },
  { id: "timetable", labelEn: "Manage Timetable", labelHi: "समय सारिणी प्रबंधित करें", icon: CalendarDays, href: "/school-dashboard/timetable" },
  { id: "fees", labelEn: "Fee Collection", labelHi: "शुल्क संग्रह", icon: RupeeIcon, href: "/school-dashboard/fees" },
  { id: "reports", labelEn: "View Reports", labelHi: "रिपोर्ट देखें", icon: BarChart3, href: "/school-dashboard/reports" },
];

// Actions for Teacher
const schoolActionsTeacher = [
  { id: "my_classes", labelEn: "My Classes", labelHi: "मेरी कक्षाएं", icon: Users, href: "/school-dashboard/teacher/my-classes" },
  { id: "my_timetable", labelEn: "My Timetable", labelHi: "मेरी समय सारिणी", icon: CalendarDays, href: "/school-dashboard/teacher/timetable" },
  { id: "student_attendance", labelEn: "Student Attendance", labelHi: "छात्र उपस्थिति", icon: CheckCircle, href: "/school-dashboard/teacher/attendance" },
  { id: "assignments", labelEn: "Assignments", labelHi: "असाइनमेंट", icon: LibraryIcon, href: "/school-dashboard/teacher/assignments" },
  { id: "view_announcements_teacher", labelEn: "School Announcements", labelHi: "स्कूल घोषणाएँ", icon: Bell, href: "/school-dashboard/announcements" },
];

// Actions for Librarian
const schoolActionsLibrarian = [
  { id: "manage_books", labelEn: "Manage Books", labelHi: "पुस्तकें प्रबंधित करें", icon: LibraryIcon, href: "/school-dashboard/librarian/books" },
  { id: "issue_return", labelEn: "Issue/Return", labelHi: "जारी/वापस करें", icon: ArrowRight, href: "/school-dashboard/librarian/issue-return" },
  { id: "library_reports", labelEn: "Library Reports", labelHi: "पुस्तकालय रिपोर्ट", icon: BarChart3, href: "/school-dashboard/librarian/reports" },
  { id: "view_announcements_librarian", labelEn: "School Announcements", labelHi: "स्कूल घोषणाएँ", icon: Bell, href: "/school-dashboard/announcements" },
];

// Actions for Accountant
const schoolActionsAccountant = [
    { id: "fee_records", labelEn: "Fee Records", labelHi: "शुल्क रिकॉर्ड", icon: FileText, href: "/school-dashboard/fees" },
    { id: "expense_entry", labelEn: "Expense Management", labelHi: "व्यय प्रबंधन", icon: RupeeIcon, href: "/school-dashboard/accountant/expenses" },
    { id: "financial_reports_acc", labelEn: "Financial Reports", labelHi: "वित्तीय रिपोर्ट", icon: BarChart3, href: "/school-dashboard/accountant/reports" },
    { id: "view_announcements_accountant", labelEn: "School Announcements", labelHi: "स्कूल घोषणाएँ", icon: Bell, href: "/school-dashboard/announcements" },
];

// Actions for Admin Staff / Other
const schoolActionsGenericStaff = [
    { id: "view_announcements_staff", labelEn: "School Announcements", labelHi: "स्कूल घोषणाएँ", icon: Bell, href: "/school-dashboard/announcements" },
    { id: "student_inquiries_staff", labelEn: "Student Inquiries", labelHi: "छात्र पूछताछ", icon: InquiryIcon, href: "/school-dashboard/staff/inquiries" },
    { id: "my_profile_staff", labelEn: "My Profile", labelHi: "मेरी प्रोफ़ाइल", icon: UserCog, href: "/edit-profile?role=school" }, 
    { id: "it_support_generic", labelEn: "IT Support Request", labelHi: "आईटी सहायता अनुरोध", icon: GenericStaffIcon, href: "/school-dashboard/staff/it-support"},
];

interface TransferRequest {
  id: string;
  studentName: string;
  studentOsoId: string;
  fromSchool: string;
}

const mockTransferRequests: TransferRequest[] = [
  { id: "req123", studentName: "Aarav Sharma", studentOsoId: "OSO-SCH-UP1039", fromSchool: "OSO Public School, Lucknow" },
  { id: "req124", studentName: "Riya Gupta", studentOsoId: "OSO-SCH-DL5821", fromSchool: "Springdales, Pusa Road" },
];


export default function SchoolDashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [schoolProfile, setSchoolProfile] = useState<SchoolProfileFormData | null>(null);
  const [loggedInUser, setLoggedInUser] = useState<{role?: string; designation?: string; fullName?: string; email?:string; schoolId?: string;} | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [transferRequests, setTransferRequests] = useState(mockTransferRequests);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const loggedInUserString = localStorage.getItem('loggedInUser');
      let userDetails = null;
      if (loggedInUserString) {
        try {
          userDetails = JSON.parse(loggedInUserString);
          setLoggedInUser(userDetails);
        } catch (e) { 
          console.error("Failed to parse loggedInUser", e); 
          setLoadingData(false);
          return;
        }
      } else {
          setLoadingData(false);
          return;
      }
      
      let profileToUse: SchoolProfileFormData | null = null;
      if (userDetails && userDetails.schoolId) {
        const schoolProfileKey = `schoolProfileData_${userDetails.schoolId}`;
        const specificProfileString = localStorage.getItem(schoolProfileKey);
        if (specificProfileString) {
          try {
            profileToUse = JSON.parse(specificProfileString);
          } catch (e) { console.error(`Failed to parse ${schoolProfileKey}`, e); }
        }
      }
      setSchoolProfile(profileToUse);
    }
    setLoadingData(false);
  }, []);

  const handleActionClick = (href: string, labelEn: string) => {
    router.push(href);
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
        localStorage.removeItem('loggedInUser'); 
        localStorage.removeItem('userProfileData'); 
        if (loggedInUser?.schoolId) {
            localStorage.removeItem(`schoolProfileData_${loggedInUser.schoolId}`);
        }
    }
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out from the School Dashboard.",
    });
    router.push('/login'); 
  };
  
  const handleTransferDecision = (requestId: string, studentName: string, decision: 'accept' | 'reject') => {
    setTransferRequests(prev => prev.filter(req => req.id !== requestId));
    toast({
        title: `Request ${decision === 'accept' ? 'Approved' : 'Rejected'}`,
        description: `Transfer request for ${studentName} has been ${decision === 'accept' ? 'approved' : 'rejected'}. The student's data is now available in your system.`,
        variant: decision === 'reject' ? 'destructive' : 'default',
    });
    // In a real app, you would make an API call here to update backend records.
  }

  if (loadingData) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <LoadingSpinner size={48} />
        <p className="ml-4 text-muted-foreground"><BilingualText en="Loading Dashboard..." hi="डैशबोर्ड लोड हो रहा है..."/></p>
      </div>
    );
  }

  const userDesignation = loggedInUser?.designation?.toLowerCase() || "";
  let specificDashboardView: React.ReactNode = null;
  let actionsToDisplay: typeof schoolActionsPrincipal = [];
  
  const transferRequestCard = (
    <Card>
        <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
                <SendHorizonal className="h-6 w-6 text-primary"/>
                <BilingualText en="Incoming Transfer Requests" hi="आने वाले स्थानांतरण अनुरोध" />
            </CardTitle>
            <CardDescription><BilingualText en="Review and approve new student admissions." hi="नए छात्र प्रवेश की समीक्षा और अनुमोदन करें।" /></CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
            {transferRequests.length > 0 ? transferRequests.map(req => (
                <div key={req.id} className="p-3 border rounded-md">
                    <p className="font-semibold text-sm">{req.studentName}</p>
                    <p className="text-xs text-muted-foreground">From: {req.fromSchool} ({req.studentOsoId})</p>
                    <div className="flex justify-end gap-2 mt-2">
                        <Button size="sm" variant="destructive" onClick={() => handleTransferDecision(req.id, req.studentName, 'reject')}><X className="h-4 w-4 mr-1"/> Reject</Button>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleTransferDecision(req.id, req.studentName, 'accept')}><CheckCircle className="h-4 w-4 mr-1"/> Accept</Button>
                    </div>
                </div>
            )) : (
                 <p className="text-muted-foreground text-sm text-center py-4">
                    <BilingualText en="No pending transfer requests." hi="कोई लंबित स्थानांतरण अनुरोध नहीं।" />
                </p>
            )}
        </CardContent>
    </Card>
  );

  if (userDesignation.includes('principal') || userDesignation.includes('vice principal') || userDesignation.includes('coordinator') || (userDesignation.includes('admin') && !userDesignation.includes('staff'))) {
    actionsToDisplay = schoolActionsPrincipal;
    specificDashboardView = ( 
      <>
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
        
        {transferRequestCard}

        <Card>
          <CardHeader>
              <CardTitle className="font-headline"><BilingualText en="Quick Actions" hi="त्वरित कार्रवाइयां"/></CardTitle>
              <CardDescription><BilingualText en="Access key school management modules." hi="प्रमुख स्कूल प्रबंधन मॉड्यूल तक पहुंचें।" /></CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {actionsToDisplay.map(action => (
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
    );
  } else if (userDesignation === 'teacher') {
    actionsToDisplay = schoolActionsTeacher;
    specificDashboardView = <TeacherDashboardView teacherName={loggedInUser?.fullName || "Teacher"} actions={actionsToDisplay} />;
  } else if (userDesignation === 'librarian') {
    actionsToDisplay = schoolActionsLibrarian;
    specificDashboardView = <LibrarianDashboardView librarianName={loggedInUser?.fullName || "Librarian"} actions={actionsToDisplay} />;
  } else if (userDesignation === 'accountant') {
    actionsToDisplay = schoolActionsAccountant;
    specificDashboardView = <AccountantDashboardView accountantName={loggedInUser?.fullName || "Accountant"} actions={actionsToDisplay} />;
  } else { 
    actionsToDisplay = schoolActionsGenericStaff;
    specificDashboardView = <StaffDashboardView staffName={loggedInUser?.fullName || "Staff Member"} designation={loggedInUser?.designation || "Staff"} actions={actionsToDisplay} />;
  }


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
        <div className="flex items-center justify-center gap-2 mt-3">
            <Button asChild variant="outline" size="sm">
                <Link href={`/edit-profile?role=school&email=${loggedInUser?.email || ''}&name=${encodeURIComponent(loggedInUser?.fullName || '')}&designation=${encodeURIComponent(loggedInUser?.designation || '')}`}>
                    <Edit className="mr-2 h-4 w-4"/>
                    <BilingualText en="Edit Your Profile" hi="अपनी प्रोफ़ाइल संपादित करें" />
                </Link>
            </Button>
            <Button variant="destructive" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4"/>
                <BilingualText en="Logout" hi="लॉग आउट"/>
            </Button>
        </div>
      </header>

      {specificDashboardView}
      
    </div>
  );
}
