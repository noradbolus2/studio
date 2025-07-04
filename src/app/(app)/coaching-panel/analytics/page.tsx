// src/app/(app)/coaching-panel/analytics/page.tsx
"use client";

import { useState } from "react";
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowLeft, Users, CheckCircle, Clock, AlertTriangle, Lightbulb, Send, Download, BarChart3 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip, Cell } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const courseAnalyticsData = {
  "neet_chem_2025": {
    enrolled: 850,
    completionRate: 72,
    avgWatchTime: 29,
    dropOffPoint: "Chapter 6 – Thermodynamics",
    aiSuggestion: "Upload a quick revision video for Chapter 6 to address the drop-off.",
    studentProgress: [
      { name: "Aarav S.", progress: 95, fill: "hsl(var(--chart-1))" },
      { name: "Priya M.", progress: 88, fill: "hsl(var(--chart-1))" },
      { name: "Rohan V.", progress: 75, fill: "hsl(var(--chart-2))" },
      { name: "Sneha P.", progress: 60, fill: "hsl(var(--chart-2))" },
      { name: "Karan J.", progress: 45, fill: "hsl(var(--chart-3))" },
      { name: "Anika B.", progress: 30, fill: "hsl(var(--chart-4))" },
    ]
  },
  "jee_phys_2025": {
    enrolled: 1200,
    completionRate: 65,
    avgWatchTime: 35,
    dropOffPoint: "Chapter 4 – Rotational Motion",
    aiSuggestion: "Consider hosting a live doubt-solving session for Rotational Motion.",
     studentProgress: [
      { name: "Aditya R.", progress: 98, fill: "hsl(var(--chart-1))" },
      { name: "Meera K.", progress: 91, fill: "hsl(var(--chart-1))" },
      { name: "Vivek N.", progress: 82, fill: "hsl(var(--chart-2))" },
      { name: "Isha S.", progress: 70, fill: "hsl(var(--chart-2))" },
      { name: "Nitin G.", progress: 55, fill: "hsl(var(--chart-3))" },
      { name: "Tanvi P.", progress: 40, fill: "hsl(var(--chart-4))" },
    ]
  }
};

const courses = [
    { id: "neet_chem_2025", name: "NEET Chemistry 2025" },
    { id: "jee_phys_2025", name: "JEE Physics 2025" },
];

export default function StudentAnalyticsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [selectedCourseId, setSelectedCourseId] = useState<keyof typeof courseAnalyticsData>("neet_chem_2025");
  
  const currentData = courseAnalyticsData[selectedCourseId];

  const handleSendMessage = () => {
    toast({
        title: "Message Sent (Simulated)",
        description: "A motivational message has been sent to inactive students."
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-headline flex items-center gap-2">
          <BarChart3 className="h-7 w-7 text-primary" />
          <BilingualText en="Student Analytics" hi="छात्र एनालिटिक्स" />
        </h1>
        <Button variant="outline" onClick={() => router.push('/coaching-panel')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          <BilingualText en="Back to Dashboard" hi="डैशबोर्ड पर वापस" />
        </Button>
      </div>

       <Card>
        <CardHeader>
          <CardTitle><BilingualText en="Select Course" hi="कोर्स चुनें"/></CardTitle>
          <Select value={selectedCourseId} onValueChange={(val) => setSelectedCourseId(val as keyof typeof courseAnalyticsData)}>
            <SelectTrigger><SelectValue/></SelectTrigger>
            <SelectContent>{courses.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
          </Select>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium flex items-center gap-1.5"><Users size={16}/> Enrolled</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{currentData.enrolled}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium flex items-center gap-1.5"><CheckCircle size={16}/> Avg. Completion</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{currentData.completionRate}%</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium flex items-center gap-1.5"><Clock size={16}/> Avg. Watch Time</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{currentData.avgWatchTime} min</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium flex items-center gap-1.5"><AlertTriangle size={16} className="text-destructive"/> Drop-off Point</CardTitle></CardHeader><CardContent><p className="text-md font-bold">{currentData.dropOffPoint}</p></CardContent></Card>
      </div>
      
      <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary"><Lightbulb/> AI Suggestion</CardTitle>
          </CardHeader>
          <CardContent>
              <p className="italic">"{currentData.aiSuggestion}"</p>
          </CardContent>
          <CardFooter className="flex-col sm:flex-row gap-2">
              <Button onClick={handleSendMessage} variant="outline" className="w-full sm:w-auto"><Send className="mr-2 h-4 w-4"/> Send Motivational Message</Button>
              <Button variant="secondary" className="w-full sm:w-auto"><Download className="mr-2 h-4 w-4"/> Download Report</Button>
          </CardFooter>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle><BilingualText en="Student-wise Progress" hi="छात्र-वार प्रगति"/></CardTitle>
            <CardDescription><BilingualText en="Completion rate for top and bottom-performing students." hi="शीर्ष और निम्न-प्रदर्शन करने वाले छात्रों के लिए पूर्णता दर।" /></CardDescription>
        </CardHeader>
        <CardContent>
            <ChartContainer config={{}} className="h-[300px] w-full">
                <BarChart data={currentData.studentProgress} layout="vertical" margin={{ left: 10, right: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" dataKey="progress" unit="%" />
                    <YAxis dataKey="name" type="category" width={80} tickLine={false} axisLine={false} />
                    <RechartsTooltip cursor={{fill: 'hsl(var(--muted))'}} content={<ChartTooltipContent />} />
                    <Bar dataKey="progress" radius={4}>
                       {currentData.studentProgress.map((entry) => <Cell key={entry.name} fill={entry.fill} />)}
                    </Bar>
                </BarChart>
            </ChartContainer>
        </CardContent>
      </Card>

    </div>
  );
}
