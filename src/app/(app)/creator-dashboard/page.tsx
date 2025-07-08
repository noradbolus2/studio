// src/app/(app)/creator-dashboard/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
    Star,
    IndianRupee,
    ClipboardList,
    Zap,
    Store,
    Link as LinkIcon,
    Edit,
    Eye,
    Bot,
    Wallet
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ProfileFormData } from '../edit-profile/page';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useToast } from "@/hooks/use-toast";

const creatorStats = {
  avgRating: 4.9,
  monthlyEarnings: "INR 12,540",
  activeTasks: 5,
  responseRate: "98%",
};

const taskOverviewData = [
  { task: "Doubts", pending: 2, inProgress: 1, completed: 6 },
  { task: "Flashcards", pending: 1, inProgress: 0, completed: 3 },
  { task: "Voiceovers", pending: 0, inProgress: 0, completed: 4 },
  { task: "MCQs", pending: 1, inProgress: 1, completed: 7 },
];

const quickActions = [
    { id: "my_tasks", labelEn: "My Active Tasks", labelHi: "मेरे सक्रिय कार्य", icon: ClipboardList, href: "/creator-dashboard/my-projects" },
    { id: "earnings", labelEn: "Earnings Report", labelHi: "कमाई रिपोर्ट", icon: Wallet, href: "/creator-dashboard/earnings" },
    { id: "ai_assistant", labelEn: "AI Assistant", labelHi: "एआई सहायक", icon: Bot, href: "/creator-dashboard/ai-assistant" },
    { id: "storefront", labelEn: "Edit Storefront", labelHi: "स्टोरफ्रंट संपादित करें", icon: Store, href: "/edit-profile?role=creator" },
];


export default function CreatorDashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [creatorProfile, setCreatorProfile] = useState<ProfileFormData | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedProfileString = localStorage.getItem('userProfileData');
      if (storedProfileString) {
        try {
          const parsedProfile = JSON.parse(storedProfileString) as ProfileFormData;
          if (parsedProfile.role === 'creator' || parsedProfile.role === 'teacher') {
            setCreatorProfile(parsedProfile);
          }
        } catch (e) { console.error("Failed to parse creator profile", e); }
      }
    }
    setLoadingProfile(false);
  }, []);

  const handleCopyLink = () => {
    const link = `https://osoapp.in/@${creatorProfile?.creatorName?.replace(/\s+/g, '').toLowerCase() || 'creator'}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Link Copied!",
      description: "Your storefront link has been copied to the clipboard.",
    });
  };

  const handlePreview = () => {
    const url = `https://osoapp.in/@${creatorProfile?.creatorName?.replace(/\s+/g, '').toLowerCase() || 'creator'}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    toast({
      title: "Opening Preview",
      description: "Opening your public storefront in a new tab.",
    });
  };

  if (loadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <LoadingSpinner size={48} />
        <p className="ml-4 text-muted-foreground">Loading Creator Dashboard...</p>
      </div>
    );
  }

  const creatorName = creatorProfile?.creatorName || "Creator";
  const creatorExpertise = creatorProfile?.expertise?.split(',').map(e => e.trim()) || ["Doubt Solver", "Flashcard Maker"];

  return (
    <div className="space-y-6">
       <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="flex flex-row items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-primary">
                    <AvatarImage src={creatorProfile?.avatarUrl || "https://placehold.co/80x80.png"} alt={creatorName} data-ai-hint={creatorProfile?.dataAiHint || "creator avatar"}/>
                    <AvatarFallback>{creatorName.substring(0,2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                    <CardTitle className="text-2xl font-bold">👋 Welcome Back, {creatorName}</CardTitle>
                    <CardDescription className="flex flex-wrap items-center gap-2 mt-1">
                       {creatorExpertise.map(exp => (
                           <Badge key={exp} variant="secondary">{exp}</Badge>
                       ))}
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
                    {quickActions.map(action => (
                         <Button key={action.id} asChild variant="outline" className="justify-start gap-3">
                            <Link href={action.href}>
                                <action.icon className="h-5 w-5 text-muted-foreground"/>
                                <BilingualText en={action.labelEn} hi={action.labelHi}/>
                            </Link>
                         </Button>
                    ))}
                </CardContent>
            </Card>
        </div>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline">
                    <Store className="h-6 w-6 text-primary"/> My Public Storefront
                </CardTitle>
                <CardDescription>
                    This is how your profile appears to students seeking your services.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between p-2 bg-muted rounded-md">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <LinkIcon className="h-4 w-4"/>
                        <span className="font-mono">osoapp.in/@{creatorProfile?.creatorName?.replace(/\s+/g, '').toLowerCase() || 'creator'}</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleCopyLink}>Copy</Button>
                </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
                <Button variant="ghost" onClick={handlePreview}><Eye className="mr-2 h-4 w-4"/> Preview as Student</Button>
                 <Button asChild>
                    <Link href="/edit-profile?role=creator">
                        <Edit className="mr-2 h-4 w-4"/> Edit Storefront
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    </div>
  );
}
