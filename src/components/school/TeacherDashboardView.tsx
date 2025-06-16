
"use client";

import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BookOpen, CalendarDays, CheckCircle, Users, Bell, MessageSquare } from "lucide-react";
import Link from "next/link";

interface TeacherDashboardViewProps {
  teacherName: string;
}

const teacherQuickActions = [
  { id: "my_classes", labelEn: "My Classes & Students", labelHi: "मेरी कक्षाएं और छात्र", icon: Users, href: "/school-dashboard/teacher/my-classes" },
  { id: "my_timetable", labelEn: "View Timetable", labelHi: "समय सारिणी देखें", icon: CalendarDays, href: "/school-dashboard/teacher/timetable" },
  { id: "mark_attendance", labelEn: "Mark Attendance", labelHi: "उपस्थिति दर्ज करें", icon: CheckCircle, href: "/school-dashboard/teacher/attendance" },
  { id: "assignments", labelEn: "Assignments", labelHi: "असाइनमेंट", icon: BookOpen, href: "/school-dashboard/teacher/assignments" },
  { id: "announcements", labelEn: "School Announcements", labelHi: "स्कूल घोषणाएँ", icon: Bell, href: "/school-dashboard/announcements" },
  { id: "chat_parents", labelEn: "Chat with Parents", labelHi: "अभिभावकों के साथ चैट करें", icon: MessageSquare, href: "/school-dashboard/teacher/chat" },
];

export default function TeacherDashboardView({ teacherName }: TeacherDashboardViewProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-xl">
            <BilingualText en={`Welcome, ${teacherName}!`} hi={`स्वागत है, ${teacherName}!`} />
          </CardTitle>
          <CardDescription>
            <BilingualText en="Your personalized dashboard for managing your classes and students." hi="अपनी कक्षाओं और छात्रों के प्रबंधन के लिए आपका व्यक्तिगत डैशबोर्ड।" />
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle className="font-headline"><BilingualText en="Teacher Quick Actions" hi="शिक्षक त्वरित कार्रवाइयां"/></CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {teacherQuickActions.map(action => (
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle className="font-headline">
                <BilingualText en="Upcoming Classes Today" hi="आज की आगामी कक्षाएं" />
            </CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground text-sm">
                <BilingualText en="[Placeholder for today's class schedule specific to the teacher]" hi="[शिक्षक के लिए आज की कक्षा अनुसूची के लिए प्लेसहोल्डर]" />
            </p>
        </CardContent>
      </Card>
       <Card>
        <CardHeader>
            <CardTitle className="font-headline">
                <BilingualText en="Pending Assignments/Tasks" hi="लंबित असाइनमेंट/कार्य" />
            </CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground text-sm">
                <BilingualText en="[Placeholder for tasks like grading, pending approvals etc.]" hi="[ग्रेडिंग, लंबित अनुमोदन आदि जैसे कार्यों के लिए प्लेसहोल्डर]" />
            </p>
        </CardContent>
      </Card>
    </div>
  );
}

    