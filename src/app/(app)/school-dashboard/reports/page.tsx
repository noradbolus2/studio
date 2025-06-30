// src/app/(app)/school-dashboard/reports/page.tsx
"use client";
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BarChart3, Users, BookOpen, Percent, IndianRupee, CalendarCheck, FileSpreadsheet } from "lucide-react";
import { useRouter } from "next/navigation";

const reportTypes = [
  { id: "attendance", titleEn: "Student Attendance", titleHi: "छात्र उपस्थिति", icon: CalendarCheck, descriptionEn: "Daily, weekly, and monthly attendance summaries.", descriptionHi: "दैनिक, साप्ताहिक और मासिक उपस्थिति सारांश।" },
  { id: "academic", titleEn: "Academic Performance", titleHi: "शैक्षणिक प्रदर्शन", icon: Percent, descriptionEn: "Exam results, subject-wise analysis, and progress tracking.", descriptionHi: "परीक्षा परिणाम, विषयवार विश्लेषण, और प्रगति ट्रैकिंग।" },
  { id: "fees", titleEn: "Fee Collection Summary", titleHi: "शुल्क संग्रह सारांश", icon: IndianRupee, descriptionEn: "Track collected, due, and overdue fees.", descriptionHi: "एकत्रित, बकाया और अतिदेय शुल्क ट्रैक करें।" },
  { id: "enrollment", titleEn: "Enrollment Statistics", titleHi: "नामांकन सांख्यिकी", icon: Users, descriptionEn: "New admissions, withdrawals, and class strength.", descriptionHi: "नए प्रवेश, निकासी, और कक्षा की ताकत।" },
  { id: "library", titleEn: "Library Usage", titleHi: "पुस्तकालय उपयोग", icon: BookOpen, descriptionEn: "Book issuance, popular books, and overdue items.", descriptionHi: "पुस्तक जारी करना, लोकप्रिय पुस्तकें और अतिदेय आइटम।" },
  { id: "staff_performance", titleEn: "Staff Reports", titleHi: "कर्मचारी रिपोर्ट", icon: FileSpreadsheet, descriptionEn: "Teacher workload, attendance, and other staff metrics.", descriptionHi: "शिक्षक कार्यभार, उपस्थिति, और अन्य कर्मचारी मीट्रिक।" },
];

export default function SchoolReportsPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-headline flex items-center gap-2">
          <BarChart3 className="h-7 w-7 text-primary" />
          <BilingualText en="School Reports & Analytics" hi="स्कूल रिपोर्ट और एनालिटिक्स" />
        </h1>
        <Button variant="outline" onClick={() => router.push('/school-dashboard')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          <BilingualText en="Back to Dashboard" hi="डैशबोर्ड पर वापस" />
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle><BilingualText en="Comprehensive School Insights" hi="व्यापक स्कूल अंतर्दृष्टि" /></CardTitle>
          <CardDescription><BilingualText en="Generate and view various analytical reports for effective school management." hi="प्रभावी स्कूल प्रबंधन के लिए विभिन्न विश्लेषणात्मक रिपोर्ट तैयार करें और देखें।" /></CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportTypes.map(report => (
            <Card key={report.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3 mb-1">
                  <report.icon className="h-6 w-6 text-primary" />
                  <CardTitle className="text-md font-semibold"><BilingualText en={report.titleEn} hi={report.titleHi} /></CardTitle>
                </div>
                <CardDescription className="text-xs"><BilingualText en={report.descriptionEn} hi={report.descriptionHi} /></CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" size="sm" className="w-full">
                  <BilingualText en="View Report" hi="रिपोर्ट देखें" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
