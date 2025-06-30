
"use client";

import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowLeft, BarChart3, Users, IndianRupee, PieChart as PieChartIcon, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, XAxis, YAxis, CartesianGrid, Line, Pie, Cell, Tooltip as RechartsTooltip, PieChart } from "recharts";
import { BarChart, LineChart } from "recharts";


const userGrowthData = [
  { month: "Jan", users: 186 },
  { month: "Feb", users: 305 },
  { month: "Mar", users: 237 },
  { month: "Apr", users: 73 },
  { month: "May", users: 209 },
  { month: "Jun", users: 214 },
];

const revenueData = [
  { category: "Courses", revenue: 45000 },
  { category: "Projects", revenue: 32000 },
  { category: "Stationery", revenue: 68000 },
  { category: "Subscriptions", revenue: 12000 },
];

const engagementData = [
  { name: "AI Guruji", value: 400, fill: "hsl(var(--chart-1))" },
  { name: "Test Series", value: 300, fill: "hsl(var(--chart-2))" },
  { name: "Live Classes", value: 300, fill: "hsl(var(--chart-3))" },
  { name: "Projects", value: 200, fill: "hsl(var(--chart-4))" },
];

export default function PlatformAnalyticsPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-headline flex items-center gap-2">
          <BarChart3 className="h-7 w-7 text-primary" />
          <BilingualText en="Platform Analytics" hi="प्लेटफ़ॉर्म एनालिटिक्स" />
        </h1>
        <Button variant="outline" onClick={() => router.push('/platform-admin')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          <BilingualText en="Back to Admin" hi="एडमिन पर वापस" />
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5"/> User Growth</CardTitle>
                <CardDescription>Monthly new user signups.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={{}} className="h-[250px] w-full">
                    <LineChart data={userGrowthData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <RechartsTooltip content={<ChartTooltipContent />} />
                        <Line type="monotone" dataKey="users" stroke="hsl(var(--primary))" strokeWidth={2} />
                    </LineChart>
                </ChartContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><IndianRupee className="h-5 w-5"/> Revenue by Category</CardTitle>
                <CardDescription>Revenue from different platform features.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={{}} className="h-[250px] w-full">
                    <BarChart data={revenueData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="category" type="category" width={80} tickLine={false} axisLine={false} />
                        <RechartsTooltip content={<ChartTooltipContent />} cursor={{fill: 'hsl(var(--muted))'}} />
                        <Bar dataKey="revenue" fill="hsl(var(--accent))" radius={4} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
          </Card>
          <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><PieChartIcon className="h-5 w-5"/> Feature Engagement</CardTitle>
                <CardDescription>Distribution of user interactions with key features.</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
                <ChartContainer config={{}} className="h-[300px] w-full max-w-sm">
                   <PieChart>
                      <RechartsTooltip content={<ChartTooltipContent nameKey="name" />} />
                      <Pie data={engagementData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                        {engagementData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
             <CardFooter>
                <Button variant="outline" className="w-full">
                    <Download className="mr-2 h-4 w-4"/> <BilingualText en="Download Full Report" hi="पूरी रिपोर्ट डाउनलोड करें" />
                </Button>
            </CardFooter>
          </Card>
      </div>
    </div>
  );
}
