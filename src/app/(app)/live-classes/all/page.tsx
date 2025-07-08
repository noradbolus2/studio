
"use client";

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { CalendarDays, PlayCircle, PlusCircle, ArrowLeft, Video, Clock, Users, RadioTower, CheckCircle } from 'lucide-react';
import { ClassCard, type LiveClass } from '@/components/live-class/ClassCard'; 

const LIVE_CLASSES_KEY = "liveClasses_mock";

export default function AllLiveClassesPage() {
    const router = useRouter();
    const [allClasses, setAllClasses] = useState<LiveClass[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedClassesString = localStorage.getItem(LIVE_CLASSES_KEY);
            if (storedClassesString) {
                setAllClasses(JSON.parse(storedClassesString));
            }
        }
        setIsLoading(false);
    }, []);

    const sortedClasses = useMemo(() => {
        return allClasses.sort((a, b) => new Date(b.dateTime!).getTime() - new Date(a.dateTime!).getTime());
    }, [allClasses]);

    const liveClasses = sortedClasses.filter(c => c.status === 'live');
    const upcomingClasses = sortedClasses.filter(c => c.status === 'upcoming');
    const pastClasses = sortedClasses.filter(c => c.status === 'recorded');

    if (isLoading) {
        return <LoadingSpinner/>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold font-headline flex items-center gap-2">
                    <CalendarDays className="h-7 w-7 text-primary" />
                    <BilingualText en="All Live Classes" hi="सभी लाइव कक्षाएं" />
                </h1>
                <Button variant="outline" onClick={() => router.back()}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    <BilingualText en="Back" hi="वापस"/>
                </Button>
            </div>
            
            {liveClasses.length > 0 && (
                <section>
                    <h2 className="text-xl font-semibold mb-3 flex items-center gap-2 text-destructive">
                        <RadioTower size={20} className="animate-pulse"/> Live Now
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {liveClasses.map(cls => <ClassCard key={cls.id} classInfo={cls} />)}
                    </div>
                </section>
            )}

             {upcomingClasses.length > 0 && (
                <section>
                    <h2 className="text-xl font-semibold mb-3">Upcoming Classes</h2>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {upcomingClasses.map(cls => <ClassCard key={cls.id} classInfo={cls} />)}
                    </div>
                </section>
            )}

             {pastClasses.length > 0 && (
                <section>
                    <h2 className="text-xl font-semibold mb-3">Past Recordings</h2>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {pastClasses.map(cls => <ClassCard key={cls.id} classInfo={cls} />)}
                    </div>
                </section>
            )}
            
            {allClasses.length === 0 && (
                <Card>
                    <CardContent className="text-center py-10">
                        <p className="text-muted-foreground">There are no scheduled classes yet.</p>
                    </CardContent>
                </Card>
            )}

        </div>
    )
}
