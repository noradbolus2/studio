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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function CreatorDashboardPage() {
  const creatorStats = {
      avgRating: 4.9,
      monthlyEarnings: "₹12,540",
      activeTasks: 5,
      responseRate: "98%",
  }

  const taskOverviewData = [
    { task: "Doubts", pending: 2, inProgress: 1, completed: 6 },
    { task: "Flashcards", pending: 1, inProgress: 0, completed: 3 },
    { task: "Voiceovers", pending: 0, inProgress: 0, completed: 4 },
    { task: "MCQs", pending: 1, inProgress: 1, completed: 7 },
  ];

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Task Overview</CardTitle>
                    <CardDescription>A summary of your current workload.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Task Type</TableHead>
                                <TableHead>Pending</TableHead>
                                <TableHead>In Progress</TableHead>
                                <TableHead>Completed</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {taskOverviewData.map((row) => (
                                <TableRow key={row.task}>
                                    <TableCell className="font-medium">{row.task}</TableCell>
                                    <TableCell>{row.pending}</TableCell>
                                    <TableCell>{row.inProgress}</TableCell>
                                    <TableCell>{row.completed}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Your most common actions.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                    <Button>Start New Task</Button>
                    <Button variant="secondary">Submit Completed Work</Button>
                    <Button variant="outline">View Earnings Report</Button>
                    <Button variant="ghost">Switch Role</Button>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
