
"use client";

import { useState, useEffect, useMemo } from 'react';
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Activity, AlertTriangle, CheckCircle, BrainCircuit, Lightbulb, Target, Bot, BookOpen, ChevronDown, ChevronUp, ListChecks, Sparkles, MessageSquareQuestion } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { ProfileFormData } from '../edit-profile/page';

interface Topic {
  id: string;
  titleEn: string;
  titleHi: string;
  completed: boolean;
  clarity?: 'high' | 'medium' | 'low'; // Optional: from Aura Map
}

interface Chapter {
  id: string;
  titleEn: string;
  titleHi: string;
  topics: Topic[];
  isCurrent?: boolean;
}

interface PendingTask {
  id: string;
  descriptionEn: string;
  descriptionHi: string;
  dueDate?: string;
  type: 'assignment' | 'quiz' | 'reading';
}

const mockChapters: Chapter[] = [
  {
    id: "ch1",
    titleEn: "Chapter 1: Chemical Reactions and Equations",
    titleHi: "अध्याय 1: रासायनिक अभिक्रियाएँ एवं समीकरण",
    isCurrent: true,
    topics: [
      { id: "t1a", titleEn: "Introduction to Chemical Reactions", titleHi: "रासायनिक अभिक्रियाओं का परिचय", completed: true, clarity: 'high' },
      { id: "t1b", titleEn: "Types of Chemical Reactions", titleHi: "रासायनिक अभिक्रियाओं के प्रकार", completed: false, clarity: 'medium' },
      { id: "t1c", titleEn: "Balancing Chemical Equations", titleHi: "रासायनिक समीकरणों को संतुलित करना", completed: false },
      { id: "t1d", titleEn: "Redox Reactions", titleHi: "रेडॉक्स अभिक्रियाएँ", completed: false, clarity: 'low' },
    ],
  },
  {
    id: "ch2",
    titleEn: "Chapter 2: Acids, Bases, and Salts",
    titleHi: "अध्याय 2: अम्ल, क्षारक एवं लवण",
    topics: [
      { id: "t2a", titleEn: "Properties of Acids and Bases", titleHi: "अम्ल एवं क्षारक के गुणधर्म", completed: false },
      { id: "t2b", titleEn: "pH Scale and Importance", titleHi: "pH स्केल एवं महत्व", completed: false },
      { id: "t2c", titleEn: "Common Salts", titleHi: "सामान्य लवण", completed: false },
    ],
  },
];

const mockPendingTasks: PendingTask[] = [
  { id: "task1", descriptionEn: "Complete Ch.1 Redox Reactions Quiz", descriptionHi: "अध्याय 1 रेडॉक्स अभिक्रिया प्रश्नोत्तरी पूरी करें", dueDate: "Tomorrow", type: 'quiz' },
  { id: "task2", descriptionEn: "Read Chapter 2 - Acids & Bases", descriptionHi: "अध्याय 2 पढ़ें - अम्ल और क्षारक", type: 'reading' },
];

const mockWeakTopics: string[] = ["Redox Reactions", "Balancing Complex Equations"];

export default function StudyDashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [chapters, setChapters] = useState<Chapter[]>(mockChapters);
  const [showAiHelp, setShowAiHelp] = useState(false);
  const [profileData, setProfileData] = useState<ProfileFormData | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedProfile = localStorage.getItem('userProfileData');
      if (storedProfile) {
        try {
          setProfileData(JSON.parse(storedProfile) as ProfileFormData);
        } catch (err) { console.warn("Could not parse profile for Study Dashboard:", err); }
      }
    }
    // Simulate inactivity check
    const timer = setTimeout(() => {
      const currentChapter = chapters.find(ch => ch.isCurrent);
      if (currentChapter && currentChapter.topics.some(t => t.clarity === 'low' && !t.completed)) {
        setShowAiHelp(true);
      }
    }, 15000); // Show after 15 seconds if low clarity on current topic
    return () => clearTimeout(timer);
  }, [chapters]);


  const handleTopicCompletion = (chapterId: string, topicId: string, completed: boolean) => {
    setChapters(prevChapters =>
      prevChapters.map(chapter =>
        chapter.id === chapterId
          ? {
              ...chapter,
              topics: chapter.topics.map(topic =>
                topic.id === topicId ? { ...topic, completed } : topic
              ),
            }
          : chapter
      )
    );
    if (completed) {
      toast({ title: "Topic Completed!", description: "Great job! Consider a quick review quiz."});
    }
  };

  const overallProgress = useMemo(() => {
    const totalTopics = chapters.reduce((sum, chapter) => sum + chapter.topics.length, 0);
    const completedTopics = chapters.reduce((sum, chapter) => sum + chapter.topics.filter(t => t.completed).length, 0);
    return totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0;
  }, [chapters]);

  const currentChapterForDisplay = chapters.find(ch => ch.isCurrent) || chapters[0];

  const getClarityMeterColor = (clarity?: 'high' | 'medium' | 'low'): string => {
    if (clarity === 'high') return 'bg-green-500';
    if (clarity === 'medium') return 'bg-yellow-500';
    if (clarity === 'low') return 'bg-red-500';
    return 'bg-gray-300'; // Default if no clarity
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
          <Activity className="h-8 w-8 text-primary" />
          <BilingualText en="OSO Turbo Tracker" hi="OSO टर्बो ट्रैकर" />
        </h1>
        <p className="text-muted-foreground">
          <BilingualText en="Your smart learning activity dashboard." hi="आपका स्मार्ट लर्निंग एक्टिविटी डैशबोर्ड।" />
        </p>
      </header>

      <Card className="bg-card/70 backdrop-blur-sm border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><ListChecks className="text-primary"/> <BilingualText en="Overall Progress" hi="समग्र प्रगति" /></CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 mb-2">
            <Progress value={overallProgress} className="h-3 flex-grow" />
            <span className="text-sm font-semibold text-primary">{Math.round(overallProgress)}%</span>
          </div>
          <p className="text-xs text-muted-foreground">
            <BilingualText 
                en={`${chapters.reduce((sum, chapter) => sum + chapter.topics.filter(t => t.completed).length, 0)} of ${chapters.reduce((sum, chapter) => sum + chapter.topics.length, 0)} topics completed.`} 
                hi={`${chapters.reduce((sum, chapter) => sum + chapter.topics.length, 0)} में से ${chapters.reduce((sum, chapter) => sum + chapter.topics.filter(t => t.completed).length, 0)} विषय पूरे हुए।`}
            />
          </p>
        </CardContent>
      </Card>

      {currentChapterForDisplay && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BookOpen className="text-accent"/> <BilingualText en={`Current: ${currentChapterForDisplay.titleEn}`} hi={`वर्तमान: ${currentChapterForDisplay.titleHi}`} /></CardTitle>
            <CardDescription><BilingualText en="Track your progress through the topics." hi="विषयों के माध्यम से अपनी प्रगति को ट्रैक करें।" /></CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {currentChapterForDisplay.topics.map(topic => (
              <div key={topic.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id={`topic-${topic.id}`}
                    checked={topic.completed}
                    onCheckedChange={(checked) => handleTopicCompletion(currentChapterForDisplay.id, topic.id, !!checked)}
                    className="border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                  />
                  <Label htmlFor={`topic-${topic.id}`} className={cn("text-sm cursor-pointer", topic.completed && "line-through text-muted-foreground")}>
                    <BilingualText en={topic.titleEn} hi={topic.titleHi} />
                  </Label>
                </div>
                <div title={topic.clarity ? `Clarity: ${topic.clarity}` : 'Clarity not assessed'} className={cn("w-3 h-3 rounded-full", getClarityMeterColor(topic.clarity))}></div>
              </div>
            ))}
          </CardContent>
          <CardFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" className="flex-1" onClick={() => toast({title: "Quick Quiz (Simulated)", description:"Generating quiz for " + currentChapterForDisplay.titleEn})}>
                <Target className="mr-2"/> <BilingualText en="Quick Chapter Quiz" hi="त्वरित अध्याय प्रश्नोत्तरी"/>
            </Button>
            <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                <Link href="/study/my-notes/new">
                    <Lightbulb className="mr-2"/> <BilingualText en="Add Notes" hi="नोट्स जोड़ें"/>
                </Link>
            </Button>
          </CardFooter>
        </Card>
      )}

      {showAiHelp && (
        <Card className="bg-accent/10 border-accent/30 shadow-lg shadow-accent/20">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-accent"><Bot size={24}/> <BilingualText en="Need Some Help?" hi="कुछ मदद चाहिए?"/></CardTitle>
                <CardDescription><BilingualText en="Guruji noticed you might be finding some topics tricky or are revisiting content." hi="गुरुजी ने देखा कि आपको कुछ विषय कठिन लग रहे हैं या आप सामग्री को दोबारा देख रहे हैं।"/></CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm mb-3"><BilingualText en="Would you like to ask Guruji for clarification or a quick explanation?" hi="क्या आप गुरुजी से स्पष्टीकरण या त्वरित व्याख्या पूछना चाहेंगे?"/></p>
                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => router.push('/ai-guruji')}>
                    <MessageSquareQuestion className="mr-2"/> <BilingualText en="Chat with Guruji" hi="गुरुजी से चैट करें"/>
                </Button>
            </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ListChecks className="text-primary"/> <BilingualText en="Pending Tasks" hi="लंबित कार्य" /></CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {mockPendingTasks.length > 0 ? mockPendingTasks.map(task => (
              <div key={task.id} className="text-xs p-2 bg-muted/50 rounded-md">
                <p className="font-medium"><BilingualText en={task.descriptionEn} hi={task.descriptionHi} /></p>
                {task.dueDate && <p className="text-muted-foreground"><BilingualText en="Due:" hi="देय:" /> {task.dueDate}</p>}
              </div>
            )) : <p className="text-xs text-muted-foreground text-center py-2"><BilingualText en="No pending tasks. Well done!" hi="कोई लंबित कार्य नहीं। बहुत बढ़िया!"/></p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><AlertTriangle className="text-destructive"/> <BilingualText en="Weak Topic Alerts" hi="कमजोर विषय अलर्ट" /></CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {mockWeakTopics.length > 0 ? mockWeakTopics.map((topic, index) => (
              <p key={index} className="text-xs p-1.5 bg-destructive/10 text-destructive-foreground rounded-md border border-destructive/30">{topic}</p>
            )) : <p className="text-xs text-muted-foreground text-center py-2"><BilingualText en="No specific weak topics flagged. Keep it up!" hi="कोई विशिष्ट कमजोर विषय चिह्नित नहीं किया गया। इसे बनाए रखें!"/></p>}
          </CardContent>
        </Card>
      </div>
      
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="other-chapters">
                <AccordionTrigger className="text-md font-semibold hover:no-underline">
                    <BilingualText en="All Chapters / Modules" hi="सभी अध्याय / मॉड्यूल"/>
                </AccordionTrigger>
                <AccordionContent className="space-y-3">
                    {chapters.filter(ch => !ch.isCurrent).map(chapter => (
                        <Card key={chapter.id} className="bg-muted/40">
                            <CardHeader className="py-3 px-4">
                                <CardTitle className="text-sm font-medium">
                                    <BilingualText en={chapter.titleEn} hi={chapter.titleHi}/>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="py-2 px-4 text-xs text-muted-foreground">
                                <BilingualText en={`${chapter.topics.filter(t=>t.completed).length} / ${chapter.topics.length} topics completed`} hi={`${chapter.topics.length} में से ${chapter.topics.filter(t=>t.completed).length} विषय पूर्ण`}/>
                            </CardContent>
                        </Card>
                    ))}
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="integrations">
                <AccordionTrigger className="text-md font-semibold hover:no-underline">
                    <BilingualText en="Other Study Tools" hi="अन्य अध्ययन उपकरण"/>
                </AccordionTrigger>
                <AccordionContent className="grid grid-cols-2 gap-3 pt-2">
                    <Button variant="outline" asChild><Link href="/study/my-notes"><Edit className="mr-2"/> My Notes</Link></Button>
                    <Button variant="outline" asChild><Link href="/study/focus-music"><Headphones className="mr-2"/> Focus Music</Link></Button>
                    <Button variant="outline" asChild><Link href="/brain-scan-report"><BrainCircuit className="mr-2"/> Aura Map</Link></Button>
                    <Button variant="outline" asChild><Link href="/test-series"><Target className="mr-2"/> Test Series</Link></Button>
                </AccordionContent>
            </AccordionItem>
        </Accordion>

    </div>
  );
}

declare module 'react' {
    interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
      placeholder_en?: string;
      placeholder_hi?: string;
    }
    interface TextareaHTMLAttributes<T> extends HTMLAttributes<T> {
        placeholder_en?: string;
        placeholder_hi?: string;
    }
}
declare module "@radix-ui/react-select" {
  interface SelectValueProps {
    placeholder_en?: string;
    placeholder_hi?: string;
  }
}
