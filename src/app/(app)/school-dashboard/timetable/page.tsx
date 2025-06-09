
// src/app/(app)/school-dashboard/timetable/page.tsx
"use client";
import { useState } from "react";
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CalendarDays, Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const classes = ["6A", "7B", "8A", "9C", "10B", "11 Science", "12 Commerce"];
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const periods = ["1st (9-10)", "2nd (10-11)", "3rd (11-12)", "Lunch", "4th (1-2)", "5th (2-3)", "6th (3-4)"];

interface TimetableEntry {
  subject: string;
  teacher?: string;
}

// Sample data for Class 10B
const sampleTimetableData: Record<string, Record<string, TimetableEntry>> = {
  "Mon": { "1st (9-10)": {subject: "Maths"}, "2nd (10-11)": {subject: "Science"}, "3rd (11-12)": {subject: "English"}, "4th (1-2)": {subject:"Social St."}, "5th (2-3)": {subject: "Hindi"}, "6th (3-4)": {subject: "Physics Lab"} },
  "Tue": { "1st (9-10)": {subject: "Science"}, "2nd (10-11)": {subject: "Maths"}, "3rd (11-12)": {subject: "Hindi"}, "4th (1-2)": {subject:"English"}, "5th (2-3)": {subject: "Social St."}, "6th (3-4)": {subject: "Games"} },
  "Wed": { "1st (9-10)": {subject: "English"}, "2nd (10-11)": {subject: "Hindi"}, "3rd (11-12)": {subject: "Maths"}, "4th (1-2)": {subject:"Science"}, "5th (2-3)": {subject: "Computer"}, "6th (3-4)": {subject: "Chemistry Lab"} },
  "Thu": { "1st (9-10)": {subject: "Hindi"}, "2nd (10-11)": {subject: "English"}, "3rd (11-12)": {subject: "Science"}, "4th (1-2)": {subject:"Maths"}, "5th (2-3)": {subject: "Social St."}, "6th (3-4)": {subject: "Library"} },
  "Fri": { "1st (9-10)": {subject: "Maths"}, "2nd (10-11)": {subject: "Science"}, "3rd (11-12)": {subject: "English"}, "4th (1-2)": {subject:"Social St."}, "5th (2-3)": {subject: "Hindi"}, "6th (3-4)": {subject: "Art/Music"} },
  "Sat": { "1st (9-10)": {subject: "Revision"}, "2nd (10-11)": {subject: "Test"}, "3rd (11-12)": {subject: "Activities"}, "4th (1-2)": {subject:"-"}, "5th (2-3)": {subject: "-"}, "6th (3-4)": {subject: "-"} },
};


export default function SchoolTimetablePage() {
  const router = useRouter();
  const [selectedClass, setSelectedClass] = useState("10B"); // Default to 10B as we have data for it

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-headline flex items-center gap-2">
          <CalendarDays className="h-7 w-7 text-primary" />
          <BilingualText en="Manage Timetable" hi="समय सारिणी प्रबंधित करें" />
        </h1>
        <Button variant="outline" onClick={() => router.push('/school-dashboard')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          <BilingualText en="Back to Dashboard" hi="डैशबोर्ड पर वापस" />
        </Button>
      </div>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
            <div>
                <CardTitle><BilingualText en="Class Timetables" hi="कक्षा समय सारिणी" /></CardTitle>
                <CardDescription><BilingualText en="View and manage class schedules and teacher assignments." hi="कक्षा शेड्यूल और शिक्षक असाइनमेंट देखें और प्रबंधित करें।" /></CardDescription>
            </div>
            <div className="flex gap-2 items-center">
                 <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder_en="Select Class" placeholder_hi="कक्षा चुनें" />
                    </SelectTrigger>
                    <SelectContent>
                        {classes.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                </Select>
                <Button variant="outline">
                    <Edit className="mr-2 h-4 w-4" />
                    <BilingualText en="Edit" hi="संपादित करें"/>
                </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {selectedClass ? (
            <div className="rounded-md border overflow-x-auto">
              <Table className="min-w-[700px]">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]"><BilingualText en="Day/Period" hi="दिन/अवधि" /></TableHead>
                    {periods.map(period => (
                      <TableHead key={period} className="text-center text-xs sm:text-sm whitespace-nowrap">
                        {period === "Lunch" ? <BilingualText en="Lunch" hi="लंच"/> : period}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {days.map(day => (
                    <TableRow key={day}>
                      <TableCell className="font-medium">{day}</TableCell>
                      {periods.map(period => (
                        <TableCell key={`${day}-${period}`} className="text-center text-xs p-1.5 sm:p-2">
                            {period === "Lunch" ? (
                                <span className="font-semibold text-muted-foreground"><BilingualText en="LUNCH" hi="लंच"/></span>
                            ) : (
                                (sampleTimetableData[day]?.[period]?.subject || "-")
                            )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-6"><BilingualText en="Please select a class to view its timetable." hi="कृपया समय सारिणी देखने के लिए एक कक्षा चुनें।" /></p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

declare module "@radix-ui/react-select" {
  interface SelectValueProps {
    placeholder_en?: string;
    placeholder_hi?: string;
  }
}

    