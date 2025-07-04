// src/app/(app)/creator-dashboard/page.tsx
"use client";

import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
    Star,
    IndianRupee,
    ClipboardList,
    Zap
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function CreatorDashboardPage() {
  const creatorStats = {
      avgRating: 4.9,
      monthlyEarnings: "₹12,540",
      activeTasks: 5,
      responseRate: "98%",
  }

  return (
    <div className="space-y-6">
       <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="flex flex-row items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-primary">
                    <AvatarImage src="https://placehold.co/80x80.png" alt="Abhishek Verma" data-ai-hint="male professional"/>
                    <AvatarFallback>AV</AvatarFallback>
                </Avatar>
                <div>
                    <CardTitle className="text-2xl font-bold">👋 Welcome Back, Abhishek Verma</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                       <Badge variant="secondary">Doubt Solver</Badge>
                       <Badge variant="secondary">Flashcard Maker</Badge>
                       <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>
                    </CardDescription>
                </div>
            </CardHeader>
        </Card>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-1.5"><Star className="text-yellow-400"/> Avg. Rating</CardTitle>
                </CardHeader>
                <CardContent><p className="text-2xl font-bold">{creatorStats.avgRating}</p></CardContent>
            </Card>
             <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-1.5"><IndianRupee className="text-green-500"/> Monthly Earnings</CardTitle>
                </CardHeader>
                <CardContent><p className="text-2xl font-bold">{creatorStats.monthlyEarnings}</p></CardContent>
            </Card>
             <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-1.5"><ClipboardList className="text-blue-500"/> Active Tasks</CardTitle>
                </CardHeader>
                <CardContent><p className="text-2xl font-bold">{creatorStats.activeTasks}</p></CardContent>
            </Card>
             <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-1.5"><Zap className="text-purple-500"/> Response Rate</CardTitle>
                </CardHeader>
                <CardContent><p className="text-2xl font-bold">{creatorStats.responseRate}</p></CardContent>
            </Card>
        </div>

        {/* Placeholder for other dashboard widgets */}
        <Card>
            <CardHeader>
                <CardTitle>Active Tasks</CardTitle>
                <CardDescription>Tasks that require your attention.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">[Active Tasks List Placeholder]</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                 <CardDescription>Latest updates on your tasks and earnings.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">[Recent Activity Feed Placeholder]</p>
            </CardContent>
        </Card>
    </div>
  );
}
