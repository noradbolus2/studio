
"use client";

import { useState, useEffect, useMemo } from 'react';
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Activity, AlertTriangle, CheckCircle, BrainCircuit, Lightbulb, Target, Bot, BookOpen, ChevronDown, ChevronUp, ListChecks, Sparkles, MessageSquareQuote, Headphones, Edit, Video, FileText as NoteIcon, HelpCircle as QuizIcon } from "lucide-react"; // Changed MessageSquareQuestion to MessageSquareQuote
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { ProfileFormData } from '../edit-profile/page';

interface LessonItem {
  id: string;
  titleEn: string;
  titleHi: string;
  type: 'video' | 'quiz' | 'notes';
  completed: boolean;
  replays_played?: number;
  max_replays?: number;
}

interface Chapter {
  id: string;
  titleEn: string;
  titleHi: string;
  lessons: LessonItem[];
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
    lessons: [
      { id: "l1a", titleEn: "Video 1: Types of Reactions", titleHi: "वीडियो 1: अभिक्रियाओं के प्रकार", type: 'video', completed: true, replays_played: 2, max_replays: 10 },
      { id: "l1b", titleEn: "Video 2: Balancing Equations", titleHi: "वीडियो 2: समीकरणों को संतुलित करना", type: 'video', completed: false, replays_played: 9, max_replays: 10 },
      { id: "l1c", titleEn: "Notes: Redox Reactions", titleHi: "नोट्स: रेडॉक्स अभिक्रियाएँ", type: 'notes', completed: false },
      { id: "l1d", titleEn: "Quiz: Chapter 1", titleHi: "प्रश्नोत्तरी: अध्याय 1", type: 'quiz', completed: false },
    ],
  },
  {
    id: "ch2",
    titleEn: "Chapter 2: Acids, Bases, and Salts",
    titleHi: "अध्याय 2: अम्ल, क्षारक एवं लवण",
    lessons: [
      { id: "l2a", titleEn: "Video: Properties of Acids", titleHi: "वीडियो: अम्ल के गुणधर्म", type: 'video', completed: false, replays_played: 0, max_replays: 10 },
      { id: "l2b", titleEn: "Notes: pH Scale", titleHi: "नोट्स: पीएच स्केल", type: 'notes', completed: false },
    ],
  },
];

const mockPendingTasks: PendingTask[] = [
  { id: "task1", descriptionEn: "Complete Ch.1 Redox Reactions Quiz", descriptionHi: "अध्याय 1 रेडॉक्स अभिक्रिया प्रश्नोत्तरी पूरी करें", dueDate: "Tomorrow", type: 'quiz' },
  { id: "task2", descriptionEn: "Read Chapter 2 - Acids & Bases", descriptionHi: "अध्याय 2 पढ़ें - अम्ल और क्षारक", type: 'reading' },
];

const mockWeakTopics: string[] = ["Balancing Complex Equations"];

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
  }, []);


  const handleLessonCompletion = (chapterId: string, lessonId: string, completed: boolean) => {
    setChapters(prevChapters =>
      prevChapters.map(chapter =>
        chapter.id === chapterId
          ? {
              ...chapter,
              lessons: chapter.lessons.map(lesson =>
                lesson.id === lessonId ? { ...lesson, completed } : lesson
              ),
            }
          : chapter
      )
    );
    if (completed) {
      toast({ title: "Lesson Completed!", description: "Great job keeping up!"});
    }
  };
  
  const getLessonIcon = (type: LessonItem['type']) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4 text-muted-foreground" />;
      case 'notes': return <NoteIcon className="h-4 w-4 text-muted-foreground" />;
      case 'quiz': return <QuizIcon className="h-4 w-4 text-muted-foreground" />;
      default: return <BookOpen className="h-4 w-4 text-muted-foreground" />;
    }
  }

  const overallProgress = useMemo(() => {
    const totalLessons = chapters.reduce((sum, chapter) => sum + chapter.lessons.length, 0);
    const completedLessons = chapters.reduce((sum, chapter) => sum + chapter.lessons.filter(l => l.completed).length, 0);
    return totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
  }, [chapters]);

  const currentChapterForDisplay = chapters.find(ch => ch.isCurrent) || chapters[0];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
          <Activity className="h-8 w-8 text-primary" />
          <BilingualText en="My Course Dashboard" hi="मेरा कोर्स डैशबोर्ड" />
        </h1>
        <p className="text-muted-foreground">
          <BilingualText en="Track your progress and stay on top of your courses." hi="अपनी प्रगति को ट्रैक करें और अपने पाठ्यक्रमों में शीर्ष पर रहें।" />
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
                en={`${chapters.reduce((sum, chapter) => sum + chapter.lessons.filter(t => t.completed).length, 0)} of ${chapters.reduce((sum, chapter) => sum + chapter.lessons.length, 0)} lessons completed.`} 
                hi={`${chapters.reduce((sum, chapter) => sum + chapter.lessons.length, 0)} में से ${chapters.reduce((sum, chapter) => sum + chapter.lessons.filter(t => t.completed).length, 0)} पाठ पूरे हुए।`}
            />
          </p>
        </CardContent>
      </Card>

      {currentChapterForDisplay && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BookOpen className="text-accent"/> <BilingualText en={`Current: ${currentChapterForDisplay.titleEn}`} hi={`वर्तमान: ${currentChapterForDisplay.titleHi}`} /></CardTitle>
            <CardDescription><BilingualText en="Track your progress through the lessons." hi="पाठों के माध्यम से अपनी प्रगति को ट्रैक करें।" /></CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {currentChapterForDisplay.lessons.map(lesson => (
              <div key={lesson.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id={`lesson-${lesson.id}`}
                    checked={lesson.completed}
                    onCheckedChange={(checked) => handleLessonCompletion(currentChapterForDisplay.id, lesson.id, !!checked)}
                    className="border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                  />
                  <div className="flex items-center gap-2">
                    {getLessonIcon(lesson.type)}
                    <Label htmlFor={`lesson-${lesson.id}`} className={cn("text-sm cursor-pointer", lesson.completed && "line-through text-muted-foreground")}>
                      <BilingualText en={lesson.titleEn} hi={lesson.titleHi} />
                    </Label>
                  </div>
                </div>
                {lesson.type === 'video' && lesson.max_replays && (
                  <div className={cn("text-xs font-medium", (lesson.replays_played || 0) >= lesson.max_replays ? 'text-destructive' : 'text-muted-foreground')}>
                     {(lesson.replays_played || 0) >= lesson.max_replays && <AlertTriangle className="inline h-3 w-3 mr-1"/>}
                     <BilingualText en={`Played ${lesson.replays_played}/${lesson.max_replays}`} hi={`देखा गया ${lesson.replays_played}/${lesson.max_replays}`} />
                  </div>
                )}
              </div>
            ))}
             <Button asChild variant="link" className="w-full mt-2">
                <Link href="/subscribe">
                    <BilingualText en="Replays over? Unlock Unlimited with Premium" hi="रिप्ले खत्म? प्रीमियम के साथ अनलिमिटेड अनलॉक करें"/>
                </Link>
            </Button>
          </CardContent>
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
                    <MessageSquareQuote className="mr-2"/> <BilingualText en="Chat with Guruji" hi="गुरुजी से चैट करें"/>
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
                                <BilingualText en={`${chapter.lessons.filter(t=>t.completed).length} / ${chapter.lessons.length} lessons completed`} hi={`${chapter.lessons.length} में से ${chapter.lessons.filter(t=>t.completed).length} पाठ पूर्ण`}/>
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
