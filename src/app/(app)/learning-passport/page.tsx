
"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, BookCheck, Brain, Smile, Award, Download, QrCode, Filter, TrendingUp, AlertTriangle } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useToast } from "@/hooks/use-toast";

const mockPassportData = {
    student: {
        name: "Aarav Sharma",
        class: "11th Science",
        school: "OSO Public School, Lucknow",
        avatarUrl: "https://placehold.co/80x80.png",
        dataAiHint: "student avatar",
    },
    skillTimeline: [
        { subject: "Physics", clarity: 85, color: "hsl(var(--chart-1))" },
        { subject: "Chemistry", clarity: 72, color: "hsl(var(--chart-2))" },
        { subject: "Maths", clarity: 91, color: "hsl(var(--chart-3))" },
        { subject: "Biology", clarity: 68, color: "hsl(var(--chart-4))" },
    ],
    brainTracker: {
        focus: { value: 78, trend: 'up' },
        stress: { value: 45, trend: 'down' },
        clarity: { value: 82, trend: 'up' },
    },
    mindLog: [
        { day: 'Mon', mood: 'Happy' }, { day: 'Tue', mood: 'Okay' }, { day: 'Wed', mood: 'Happy' },
        { day: 'Thu', mood: 'Sad' }, { day: 'Fri', mood: 'Stressed' }, { day: 'Sat', mood: 'Happy' }, { day: 'Sun', mood: 'Happy' }
    ],
    achievements: [
        { id: 'b1', name: "Week 1 Streak", icon: Award },
        { id: 'b2', name: "Perfect Score: Physics", icon: Award },
        { id: 'b3', name: "Mindful Student", icon: Award },
    ]
};

const moodColors: { [key: string]: string } = {
    'Happy': 'bg-green-500',
    'Okay': 'bg-blue-500',
    'Sad': 'bg-purple-500',
    'Stressed': 'bg-orange-500',
    'Joyful': 'bg-yellow-400',
};

export default function LearningPassportPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [passportData] = useState(mockPassportData);

    const handleExport = (type: 'PDF' | 'QR') => {
        toast({
            title: `Generating ${type}... (Simulated)`,
            description: `Your OSO Passport is being prepared for export.`,
        });
    };

    return (
        <div className="space-y-6">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
                        <BookCheck className="h-8 w-8 text-primary" />
                        <BilingualText en="OSO Learning Passport™" hi="OSO लर्निंग पासपोर्ट™" />
                    </h1>
                    <p className="text-muted-foreground">
                        <BilingualText en="Your unified academic & cognitive identity." hi="आपकी एकीकृत शैक्षणिक और संज्ञानात्मक पहचान।" />
                    </p>
                </div>
                <Button variant="outline" size="sm" onClick={() => router.back()}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    <BilingualText en="Back" hi="वापस" />
                </Button>
            </header>

            <Card className="shadow-lg">
                <CardContent className="p-4 flex items-center gap-4">
                    <Avatar className="h-16 w-16 border-2 border-primary">
                        <AvatarImage src={passportData.student.avatarUrl} alt={passportData.student.name} data-ai-hint={passportData.student.dataAiHint} />
                        <AvatarFallback>{passportData.student.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h2 className="text-lg font-bold">{passportData.student.name}</h2>
                        <p className="text-sm text-muted-foreground">{passportData.student.class}</p>
                        <p className="text-sm text-muted-foreground">{passportData.student.school}</p>
                    </div>
                </CardContent>
            </Card>

            <Tabs defaultValue="timeline">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
                    <TabsTrigger value="timeline" className="py-2"><BookCheck className="mr-2 h-4 w-4"/> Skill Timeline</TabsTrigger>
                    <TabsTrigger value="brain" className="py-2"><Brain className="mr-2 h-4 w-4"/> Brain Tracker</TabsTrigger>
                    <TabsTrigger value="mind" className="py-2"><Smile className="mr-2 h-4 w-4"/> Mind Log</TabsTrigger>
                    <TabsTrigger value="achievements" className="py-2"><Award className="mr-2 h-4 w-4"/> Achievements</TabsTrigger>
                </TabsList>

                <TabsContent value="timeline" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>AI Topic Clarity</CardTitle>
                            <CardDescription>Your understanding level across different subjects, powered by OSO Turbo Tracker.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {passportData.skillTimeline.map(skill => (
                                <div key={skill.subject}>
                                    <div className="flex justify-between mb-1 text-sm">
                                        <span className="font-medium">{skill.subject}</span>
                                        <span className="text-primary font-semibold">{skill.clarity}%</span>
                                    </div>
                                    <Progress value={skill.clarity} style={{ '--primary': skill.color } as React.CSSProperties} className="h-2 [&>div]:bg-[var(--primary)]" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="brain" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Cognitive Trends (Aura Map™)</CardTitle>
                            <CardDescription>Weekly trends from your OSO Brain Scan results.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <div className="h-[250px]">
                                <ChartContainer config={{}} className="w-full h-full">
                                    <BarChart data={[passportData.brainTracker]} layout="vertical" margin={{ left: 10 }}>
                                        <CartesianGrid horizontal={false} />
                                        <XAxis type="number" domain={[0, 100]} unit="%" />
                                        <YAxis dataKey="name" type="category" hide/>
                                        <RechartsTooltip content={<ChartTooltipContent />} />
                                        <Bar dataKey="focus.value" name="Focus" fill="hsl(var(--chart-2))" radius={4} />
                                        <Bar dataKey="stress.value" name="Stress" fill="hsl(var(--chart-3))" radius={4} />
                                        <Bar dataKey="clarity.value" name="Clarity" fill="hsl(var(--chart-1))" radius={4} />
                                    </BarChart>
                                </ChartContainer>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="mind" className="mt-4">
                    <Card>
                         <CardHeader>
                            <CardTitle>7-Day Mind Log</CardTitle>
                            <CardDescription>Your emotional check-ins from the Mind Diary.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex justify-around items-center p-4 bg-muted/50 rounded-lg">
                           {passportData.mindLog.map(log => (
                               <div key={log.day} className="flex flex-col items-center gap-1 text-center" title={log.mood}>
                                   <div className={`w-8 h-8 rounded-full ${moodColors[log.mood]}`}></div>
                                   <span className="text-xs text-muted-foreground">{log.day}</span>
                               </div>
                           ))}
                        </CardContent>
                    </Card>
                </TabsContent>
                
                <TabsContent value="achievements" className="mt-4">
                    <Card>
                         <CardHeader>
                            <CardTitle>Achievements & Badges</CardTitle>
                            <CardDescription>Milestones from your learning journey.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {passportData.achievements.map(badge => (
                                <div key={badge.id} className="flex flex-col items-center text-center p-3 border rounded-lg bg-muted/40">
                                    <badge.icon className="w-10 h-10 text-yellow-500 mb-2"/>
                                    <p className="text-xs font-medium">{badge.name}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
            
            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Export Passport</CardTitle>
                    <CardDescription>Share your progress with schools, colleges, or parents.</CardDescription>
                </CardHeader>
                <CardFooter className="flex flex-col sm:flex-row gap-2">
                    <Button variant="outline" className="w-full" onClick={() => handleExport('PDF')}>
                        <Download className="mr-2 h-4 w-4"/> Download as PDF
                    </Button>
                     <Button variant="outline" className="w-full" onClick={() => handleExport('QR')}>
                        <QrCode className="mr-2 h-4 w-4"/> Generate Sharable QR Code
                    </Button>
                </CardFooter>
            </Card>

        </div>
    );
}
