
// src/app/(app)/platform-admin/growth/page.tsx
"use client";

import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowLeft, BarChart3, TrendingUp, Users, Star, MapPin, BadgePercent, Share2, MessageSquare, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const growthStats = [
  { id: "roi", titleEn: "Ad Spend ROI", titleHi: "विज्ञापन खर्च ROI", value: "INR 1 ➔ INR 7.8", icon: BadgePercent, note: "Last 30 days" },
  { id: "referrals", titleEn: "Referrals Today", titleHi: "आज के रेफरल", value: "1,223", icon: Share2, note: "From 4 active campaigns" },
  { id: "rating", titleEn: "App Store Rating", titleHi: "ऐप स्टोर रेटिंग", value: "4.5 ⭐", icon: Star, note: "Based on 1.2k reviews" },
  { id: "sentiment", titleEn: "Social Sentiment", titleHi: "सामाजिक भावना", value: "8.7/10", icon: MessageSquare, note: "Positive mentions" },
];

const trafficHeatmapData = [
    { city: "Lucknow", trend: "rising" },
    { city: "Bhopal", trend: "rising" },
    { city: "Nagpur", trend: "rising" },
    { city: "Patna", trend: "stable" },
    { city: "Jaipur", trend: "stable" },
];

export default function GrowthAnalyticsPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-headline flex items-center gap-2">
          <TrendingUp className="h-7 w-7 text-primary" />
          <BilingualText en="Growth Engine" hi="ग्रोथ इंजन" />
        </h1>
        <Button variant="outline" onClick={() => router.push('/platform-admin')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          <BilingualText en="Back to Admin" hi="एडमिन पर वापस" />
        </Button>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Key Performance Indicators</CardTitle>
            <CardDescription>A high-level overview of marketing and growth metrics.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {growthStats.map(stat => (
            <Card key={stat.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium"><BilingualText en={stat.titleEn} hi={stat.titleHi}/></CardTitle>
                    <stat.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">{stat.note}</p>
                </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><MapPin/> Traffic Heatmap</CardTitle>
                <CardDescription>Cities with the highest user engagement and growth.</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
                    <Image src="https://placehold.co/600x300.png" alt="Traffic Heatmap Placeholder" width={600} height={300} data-ai-hint="city map traffic" className="opacity-50"/>
                </div>
                 <ul className="space-y-1 text-sm">
                    {trafficHeatmapData.map(item => (
                         <li key={item.city} className="flex justify-between items-center">
                            <span>{item.city}</span>
                            <span className={`font-semibold ${item.trend === 'rising' ? 'text-green-500' : 'text-muted-foreground'}`}>
                                {item.trend.charAt(0).toUpperCase() + item.trend.slice(1)}
                            </span>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
         <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Users/> Influencer Collaborations</CardTitle>
                <CardDescription>Tracking active and potential influencer campaigns.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground text-sm">
                    This section will display active influencer campaigns, their performance metrics (reach, engagement, signups), and a list of potential collaborators. Integration with social media APIs or a manual tracking system is required.
                </p>
            </CardContent>
             <CardFooter>
                <Button variant="secondary" className="w-full">
                    <Download className="mr-2 h-4 w-4"/> Download Campaign Report
                </Button>
            </CardFooter>
        </Card>
      </div>

       <Card>
            <CardHeader>
                <CardTitle>OSO Launch Plan</CardTitle>
                <CardDescription>Gantt chart view of weekly milestones and launch progress.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-muted-foreground text-sm p-4 text-center border border-dashed rounded-lg">
                    [Gantt Chart Placeholder]
                    <p>A visual timeline of the launch plan would be displayed here, showing tasks, progress, and dependencies. This requires a dedicated charting library or custom component.</p>
                </div>
            </CardContent>
        </Card>

    </div>
  );
}
