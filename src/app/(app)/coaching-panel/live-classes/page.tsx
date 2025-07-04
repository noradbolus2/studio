// src/app/(app)/coaching-panel/live-classes/page.tsx
"use client";

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { BilingualText } from "@/components/shared/BilingualText";
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { CalendarDays, PlayCircle, PlusCircle, ArrowLeft, Video, Clock, Users, RadioTower, CheckCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import type { LiveClass } from '@/components/live-class/ClassCard';
import type { ProfileFormData } from '../../edit-profile/page';
import { Badge } from '@/components/ui/badge';
import { format, isPast, isFuture } from 'date-fns';

const LIVE_CLASSES_KEY = "liveClasses_mock";

export default function ManageLiveClassesPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [myClasses, setMyClasses] = useState<LiveClass[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [profileData, setProfileData] = useState<ProfileFormData | null>(null);

    useEffect(() => {
        let profile: ProfileFormData | null = null;
        if (typeof window !== "undefined") {
            const storedProfile = localStorage.getItem('userProfileData');
            if (storedProfile) {
                profile = JSON.parse(storedProfile);
                setProfileData(profile);
            }

            const storedClassesString = localStorage.getItem(LIVE_CLASSES_KEY);
            if (storedClassesString) {
                const all_classes: LiveClass[] = JSON.parse(storedClassesString);
                // Filter classes created by the current teacher
                const teacherName = profile?.creatorName || profile?.fullName;
                if (teacherName) {
                    const filteredClasses = all_classes.filter(c => c.creatorNameEn === teacherName);
                    setMyClasses(filteredClasses);
                } else {
                     setMyClasses(all_classes); // fallback for demo
                }
            }
        }
        setIsLoading(false);
    }, []);

    const handleStartClass = (classId: string) => {
        toast({
            title: `Starting Class ${classId}`,
            description: "You are now live! (Simulated)"
        });
        // In a real app, you would update the class status to 'live'
        const updatedClasses = myClasses.map(c => c.id === classId ? { ...c, status: 'live' as const } : c);
        setMyClasses(updatedClasses);
        localStorage.setItem(LIVE_CLASSES_KEY, JSON.stringify(updatedClasses));
    };

    const sortedClasses = useMemo(() => {
        return myClasses.sort((a, b) => new Date(b.dateTime!).getTime() - new Date(a.dateTime!).getTime());
    }, [myClasses]);

    const upcomingClasses = sortedClasses.filter(c => c.status === 'upcoming' && isFuture(new Date(c.dateTime!)));
    const liveClasses = sortedClasses.filter(c => c.status === 'live');
    const pastClasses = sortedClasses.filter(c => c.status === 'recorded' || isPast(new Date(c.dateTime!)));

    const renderClassCard = (cls: LiveClass) => (
        <Card key={cls.id}>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-md">{cls.titleEn}</CardTitle>
                        <CardDescription className="text-xs">{cls.subjectEn} - {cls.classLevel}</CardDescription>
                    </div>
                    <Badge variant={cls.status === 'live' ? 'destructive' : 'secondary'}>{cls.status.toUpperCase()}</Badge>
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-sm flex items-center gap-1.5"><Clock size={14}/> {format(new Date(cls.dateTime!), 'PPP p')}</p>
            </CardContent>
            <CardFooter>
                 {cls.status === 'upcoming' && (
                    <Button className="w-full" onClick={() => handleStartClass(cls.id)}>
                        <PlayCircle className="mr-2 h-4 w-4"/> Start Class Now
                    </Button>
                )}
                 {cls.status === 'live' && (
                    <Button variant="destructive" className="w-full">
                        <RadioTower className="mr-2 h-4 w-4 animate-pulse"/> Join Live Session
                    </Button>
                )}
                {(cls.status === 'recorded' || isPast(new Date(cls.dateTime!))) && (
                     <Button variant="outline" className="w-full">
                        <Video className="mr-2 h-4 w-4"/> View Recording
                    </Button>
                )}
            </CardFooter>
        </Card>
    );

    if (isLoading) {
        return <LoadingSpinner/>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold font-headline flex items-center gap-2">
                    <CalendarDays className="h-7 w-7 text-primary" />
                    <BilingualText en="Manage Live Classes" hi="लाइव कक्षाएं प्रबंधित करें" />
                </h1>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => router.push('/coaching-panel')}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        <BilingualText en="Dashboard" hi="डैशबोर्ड"/>
                    </Button>
                    <Button asChild>
                        <Link href="/schedule-class">
                            <PlusCircle className="mr-2 h-4 w-4"/>
                            <BilingualText en="Schedule New" hi="नया शेड्यूल करें"/>
                        </Link>
                    </Button>
                </div>
            </div>
            
            {liveClasses.length > 0 && (
                <section>
                    <h2 className="text-xl font-semibold mb-3">Live Now</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {liveClasses.map(renderClassCard)}
                    </div>
                </section>
            )}

             {upcomingClasses.length > 0 && (
                <section>
                    <h2 className="text-xl font-semibold mb-3">Upcoming Classes</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {upcomingClasses.map(renderClassCard)}
                    </div>
                </section>
            )}

             {pastClasses.length > 0 && (
                <section>
                    <h2 className="text-xl font-semibold mb-3">Past Classes</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {pastClasses.map(renderClassCard)}
                    </div>
                </section>
            )}
            
            {myClasses.length === 0 && (
                <Card>
                    <CardContent className="text-center py-10">
                        <p className="text-muted-foreground">You have not scheduled any classes yet.</p>
                        <Button asChild className="mt-4">
                             <Link href="/schedule-class">Schedule Your First Class</Link>
                        </Button>
                    </CardContent>
                </Card>
            )}

        </div>
    )
}
