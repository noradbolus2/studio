// src/app/(app)/vendor-dashboard/reports/page.tsx
"use client";
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowLeft, BarChart3, IndianRupee, Package, TrendingUp, Users, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Cell } from "recharts";


const salesData = [
    { date: "Mon", sales: 2200 }, { date: "Tue", sales: 3400 }, { date: "Wed", sales: 1800 },
    { date: "Thu", sales: 4100 }, { date: "Fri", sales: 3800 }, { date: "Sat", sales: 5200 },
    { date: "Sun", sales: 4500 },
];
const topProductsData = [
    { name: "Notebooks", sold: 120, fill: "hsl(var(--chart-1))" },
    { name: "Pens", sold: 98, fill: "hsl(var(--chart-2))" },
    { name: "Pencils", sold: 75, fill: "hsl(var(--chart-3))" },
    { name: "Art Supplies", sold: 40, fill: "hsl(var(--chart-4))" },
    { name: "Adhesives", sold: 30, fill: "hsl(var(--chart-5))" },
];


export default function VendorReportsPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-headline flex items-center gap-2">
          <BarChart3 className="h-7 w-7 text-primary" />
          <BilingualText en="Sales Reports & Analytics" hi="बिक्री रिपोर्ट और एनालिटिक्स" />
        </h1>
        <Button variant="outline" onClick={() => router.push('/vendor-dashboard')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          <BilingualText en="Back to Dashboard" hi="डैशबोर्ड पर वापस" />
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle><BilingualText en="Business Performance Insights" hi="व्यापार प्रदर्शन अंतर्दृष्टि" /></CardTitle>
          <CardDescription><BilingualText en="Generate and view analytical reports to understand your sales." hi="अपनी बिक्री को समझने के लिए विश्लेषणात्मक रिपोर्ट तैयार करें और देखें।" /></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">This Week's Revenue</CardTitle></CardHeader>
                    <CardContent><p className="text-2xl font-bold">₹8,700</p></CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">This Week's Orders</CardTitle></CardHeader>
                    <CardContent><p className="text-2xl font-bold">75</p></CardContent>
                </Card>
                 <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Top Selling Category</CardTitle></CardHeader>
                    <CardContent><p className="text-2xl font-bold">Notebooks</p></CardContent>
                </Card>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><TrendingUp/> Sales Timeline</CardTitle>
                    <CardDescription>Weekly sales performance.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={{}} className="h-[250px] w-full">
                        <LineChart data={salesData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis tickFormatter={(value) => `₹${value/1000}k`}/>
                            <RechartsTooltip content={<ChartTooltipContent />} />
                            <Line type="monotone" dataKey="sales" stroke="hsl(var(--primary))" strokeWidth={2} />
                        </LineChart>
                    </ChartContainer>
                </CardContent>
             </Card>
              <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Package/> Top Selling Products</CardTitle>
                    <CardDescription>Products sold the most in the last 30 days.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={{}} className="h-[250px] w-full">
                       <BarChart data={topProductsData} layout="vertical" margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                         <CartesianGrid strokeDasharray="3 3" />
                         <XAxis type="number" />
                         <YAxis dataKey="name" type="category" width={80} tickLine={false} axisLine={false} />
                         <RechartsTooltip content={<ChartTooltipContent />} cursor={{fill: 'hsl(var(--muted))'}} />
                         <Bar dataKey="sold" radius={4}>
                            {topProductsData.map(entry => <Cell key={entry.name} fill={entry.fill} />)}
                         </Bar>
                       </BarChart>
                    </ChartContainer>
                </CardContent>
             </Card>
        </CardContent>
        <CardFooter>
            <Button variant="secondary" className="w-full">
                <Download className="mr-2 h-4 w-4"/> Download GST Ready Report (PDF)
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
