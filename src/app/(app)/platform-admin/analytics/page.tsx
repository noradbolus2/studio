
"use client";

import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowLeft, BarChart3, Users, IndianRupee, PieChart as PieChartIcon, Download, Activity, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, XAxis, YAxis, CartesianGrid, Line, Pie, Cell, Tooltip as RechartsTooltip, PieChart } from "recharts";
import { BarChart, LineChart } from "recharts";


const userGrowthData = [
  { month: "Jan", users: 18600 },
  { month: "Feb", users: 30500 },
  { month: "Mar", users: 23700 },
  { month: "Apr", users: 17300 },
  { month: "May", users: 20900 },
  { month: "Jun", users: 25000 },
];

const monthlyRevenueData = [
  { month: "Jan", revenue: 9800000 },
  { month: "Feb", revenue: 12000000 },
  { month: "Mar", revenue: 11000000 },
  { month: "Apr", revenue: 13500000 },
  { month: "May", revenue: 15500000 },
  { month: "Jun", revenue: 18756000 },
];

const topCitiesData = [
  { city: "Delhi", users: 120000 },
  { city: "Mumbai", users: 95000 },
  { city: "Bengaluru", users: 88000 },
  { city: "Pune", users: 76000 },
  { city: "Lucknow", users: 85000 },
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

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <IndianRupee className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold">INR 1.25 Cr</div>
                  <p className="text-xs text-muted-foreground">+20.1% from last month</p>
              </CardContent>
          </Card>
           <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold">25,20,450</div>
                  <p className="text-xs text-muted-foreground">+180.1% from last year</p>
              </CardContent>
          </Card>
           <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Daily Active Users</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold">1,50,000+</div>
                  <p className="text-xs text-muted-foreground">+19% from yesterday</p>
              </CardContent>
          </Card>
           <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Active Users</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold">8,00,000+</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
          </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5"/> New User Signups</CardTitle>
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
                <CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5"/> Monthly Revenue Trend</CardTitle>
                <CardDescription>Monthly revenue growth over time.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={{}} className="h-[250px] w-full">
                    <LineChart data={monthlyRevenueData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis tickFormatter={(value) => `₹${value / 100000}L`} />
                        <RechartsTooltip formatter={(value: number) => `INR ${value.toLocaleString()}`} content={<ChartTooltipContent />} />
                        <Line type="monotone" dataKey="revenue" stroke="hsl(var(--accent))" strokeWidth={2} />
                    </LineChart>
                </ChartContainer>
            </CardContent>
          </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><PieChartIcon className="h-5 w-5"/> Feature Engagement</CardTitle>
                    <CardDescription>Distribution of user interactions.</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                    <ChartContainer config={{}} className="h-[250px] w-full max-w-xs">
                       <PieChart>
                          <RechartsTooltip content={<ChartTooltipContent nameKey="name" />} />
                          <Pie data={engagementData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                            {engagementData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                        </PieChart>
                    </ChartContainer>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5"/> Top 5 Cities by Users</CardTitle>
                    <CardDescription>User distribution across major cities.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={{}} className="h-[250px] w-full">
                        <BarChart data={topCitiesData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis dataKey="city" type="category" width={80} tickLine={false} axisLine={false} />
                            <RechartsTooltip content={<ChartTooltipContent />} cursor={{fill: 'hsl(var(--muted))'}} />
                            <Bar dataKey="users" fill="hsl(var(--chart-3))" radius={4} />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
      </div>
      <Card>
          <CardFooter className="pt-6">
            <Button variant="outline" className="w-full">
                <Download className="mr-2 h-4 w-4"/> <BilingualText en="Download Full Analytics Report" hi="पूरी एनालिटिक्स रिपोर्ट डाउनलोड करें" />
            </Button>
          </CardFooter>
      </Card>
    </div>
  );
}
