
"use client";

import { useState, useEffect, useMemo } from 'react';
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
    Activity, 
    AlertTriangle, 
    CheckCircle, 
    BrainCircuit, 
    Bot, 
    BookOpen, 
    ListChecks, 
    MessageSquareQuote, 
    Headphones, 
    Edit, 
    Video, 
    FileText as NoteIcon, 
    HelpCircle as QuizIcon,
    Lock,
    Target
} from "lucide-react"; 
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { ProfileFormData } from '../edit-profile/page';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Badge } from '@/components/ui/badge';

interface LessonItem {
  id: string;
  titleEn: string;
  titleHi: string;
  type: 'video' | 'quiz' | 'notes';
  completed: boolean;
  locked: boolean;
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

const mockChaptersData: Omit<Chapter, 'lessons'> & { lessons: Omit<LessonItem, 'locked'>[] }[] = [
  {
    id: "ch1",
    titleEn: "Chapter 1: Chemical Reactions and Equations",
    titleHi: "अध्याय 1: रासायनिक अभिक्रियाएँ एवं समीकरण",
    isCurrent: true,
    lessons: [
      { id: "l1a", titleEn: "Video 1: Types of Reactions", titleHi: "वीडियो 1: अभिक्रियाओं के प्रकार", type: 'video', completed: false, replays_played: 0, max_replays: 10 },
      { id: "l1b", titleEn: "Video 2: Balancing Equations", titleHi: "वीडियो 2: समीकरणों को संतुलित करना", type: 'video', completed: false, replays_played: 0, max_replays: 10 },
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
      { id: "l2c", titleEn: "Quiz: Chapter 2", titleHi: "प्रश्नोत्तरी: अध्याय 2", type: 'quiz', completed: false },
    ],
  },
   {
    id: "ch3",
    titleEn: "Chapter 3: Metals and Non-metals",
    titleHi: "अध्याय 3: धातु एवं अधातु",
    lessons: [
      { id: "l3a", titleEn: "Video: Physical Properties", titleHi: "वीडियो: भौतिक गुणधर्म", type: 'video', completed: false, replays_played: 0, max_replays: 10 },
      { id: "l3b", titleEn: "Video: Chemical Properties", titleHi: "वीडियो: रासायनिक गुणधर्म", type: 'video', completed: false, replays_played: 0, max_replays: 10 },
      { id: "l3c", titleEn: "Notes: Reactivity Series", titleHi: "नोट्स: सक्रियता श्रेणी", type: 'notes', completed: false },
    ],
  },
];

const mockPendingTasks: PendingTask[] = [
  { id: "task1", descriptionEn: "Complete Ch.1 Redox Reactions Quiz", descriptionHi: "अध्याय 1 रेडॉक्स अभिक्रिया प्रश्नोत्तरी पूरी करें", dueDate: "Tomorrow", type: 'quiz' },
  { id: "task2", descriptionEn: "Read Chapter 2 - Acids & Bases", descriptionHi: "अध्याय 2 पढ़ें - अम्ल और क्षारक", type: 'reading' },
];

const mockWeakTopics: string[] = ["Balancing Complex Equations", "Thermodynamics concepts"];

function LessonRow({ lesson, onLessonClick }: { lesson: LessonItem, onLessonClick: () => void }) {
    const getLessonIcon = (type: LessonItem['type']) => {
        switch (type) {
            case 'video': return <Video className="h-5 w-5 text-pink-500" />;
            case 'notes': return <NoteIcon className="h-5 w-5 text-blue-500" />;
            case 'quiz': return <QuizIcon className="h-5 w-5 text-green-500" />;
            default: return <BookOpen className="h-5 w-5 text-gray-500" />;
        }
    };
    
    const isReplayLimitReached = lesson.type === 'video' && (lesson.replays_played ?? 0) >= (lesson.max_replays ?? Infinity);

    let buttonTextEn = "Start";
    let buttonTextHi = "शुरू करें";
    if (lesson.type === 'video') { buttonTextEn = "Watch Video"; buttonTextHi = "वीडियो देखें"; }
    if (lesson.type === 'notes') { buttonTextEn = "Read Notes"; buttonTextHi = "नोट्स पढ़ें"; }
    if (lesson.type === 'quiz') { buttonTextEn = "Take Quiz"; buttonTextHi = "क्विज़ दें"; }

    return (
        <div className={cn(
            "flex items-center justify-between p-3 rounded-lg transition-all",
            lesson.locked ? "bg-muted/30 opacity-60" : "bg-muted/50 hover:bg-muted/70",
            lesson.completed && "bg-green-500/10"
        )}>
            <div className="flex items-center gap-3">
                {lesson.locked ? <Lock className="h-6 w-6 text-muted-foreground flex-shrink-0"/> : 
                 lesson.completed ? <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" /> : getLessonIcon(lesson.type)}
                <div>
                    <p className={cn("text-sm font-medium", lesson.completed && "text-muted-foreground line-through")}>
                      <BilingualText en={lesson.titleEn} hi={lesson.titleHi} />
                    </p>
                    {lesson.type === 'video' && lesson.max_replays && (
                         <p className="text-xs text-muted-foreground">Replays left: {lesson.max_replays - (lesson.replays_played || 0)}/{lesson.max_replays}</p>
                    )}
                </div>
            </div>
             <Button 
                size="sm" 
                variant={lesson.completed ? "ghost" : "default"} 
                onClick={onLessonClick}
                disabled={lesson.locked || isReplayLimitReached}
            >
                {lesson.locked ? <BilingualText en="Locked" hi="लॉक"/> :
                 lesson.completed ? <BilingualText en="Review" hi="समीक्षा"/> : 
                 <BilingualText en={buttonTextEn} hi={buttonTextHi}/>}
            </Button>
        </div>
    );
}

export default function StudyDashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [weakTopics, setWeakTopics] = useState<string[]>(mockWeakTopics);
  const [showAiHelp, setShowAiHelp] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState<ProfileFormData | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsLoading(true);
      const storedProfile = localStorage.getItem('userProfileData');
      if (storedProfile) {
        try {
          setProfileData(JSON.parse(storedProfile) as ProfileFormData);
        } catch (err) { console.warn("Could not parse profile for Study Dashboard:", err); }
      }

      // Initialize lesson states based on completion status
      const updatedChapters: Chapter[] = mockChaptersData.map(ch => ({ ...ch, lessons: ch.lessons.map(l => ({ ...l, locked: true })) }));
      let firstUnlocked = false;
      for (const chapter of updatedChapters) {
          for (const lesson of chapter.lessons) {
              if (!lesson.completed) {
                  lesson.locked = false;
                  firstUnlocked = true;
                  break;
              }
          }
          if (firstUnlocked) break;
      }
      // If all are completed, unlock all
      if (!firstUnlocked && updatedChapters.length > 0) {
          updatedChapters.forEach(ch => ch.lessons.forEach(l => l.locked = false));
      }
      setChapters(updatedChapters);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const hasStrugglingVideo = chapters.some(ch => ch.lessons.some(l => l.type === 'video' && (l.replays_played ?? 0) >= 5));
    const hasWeakTopics = weakTopics.length > 0;

    if(hasStrugglingVideo || hasWeakTopics) {
        const timer = setTimeout(() => setShowAiHelp(true), 2000);
        return () => clearTimeout(timer);
    } else {
        setShowAiHelp(false);
    }
  }, [chapters, weakTopics]);

  const handleLessonClick = (chapterId: string, lessonId: string) => {
      let chapterIndex = -1, lessonIndex = -1;
      chapters.forEach((ch, cIdx) => {
        const lIdx = ch.lessons.findIndex(l => l.id === lessonId);
        if (lIdx !== -1) {
          chapterIndex = cIdx;
          lessonIndex = lIdx;
        }
      });
      if (chapterIndex === -1 || lessonIndex === -1) return;
      const lesson = chapters[chapterIndex].lessons[lessonIndex];

      if(lesson.locked) {
          toast({ title: "Lesson Locked", description: "Please complete the previous lesson to unlock this one."});
          return;
      }
      
      const isReplayLimitReached = lesson.type === 'video' && (lesson.replays_played ?? 0) >= (lesson.max_replays ?? Infinity);
      if (isReplayLimitReached) {
          toast({ title: "Replay Limit Reached", description: "Unlock unlimited replays with OSO Premium.", variant: "destructive"});
          return;
      }
      
      toast({ title: "Starting Lesson...", description: `Loading "${lesson.titleEn}"`});

      setTimeout(() => {
         setChapters(prevChapters => {
            const newChapters = JSON.parse(JSON.stringify(prevChapters)); 

            // Mark current lesson as complete
            newChapters[chapterIndex].lessons[lessonIndex].completed = true;
            if (newChapters[chapterIndex].lessons[lessonIndex].type === 'video') {
                 newChapters[chapterIndex].lessons[lessonIndex].replays_played = (newChapters[chapterIndex].lessons[lessonIndex].replays_played || 0) + 1;
            }

            // Unlock next lesson in the same chapter
            if (lessonIndex + 1 < newChapters[chapterIndex].lessons.length) {
                newChapters[chapterIndex].lessons[lessonIndex + 1].locked = false;
            } 
            // Or unlock the first lesson of the next chapter
            else if (chapterIndex + 1 < newChapters.length) {
                newChapters[chapterIndex + 1].lessons[0].locked = false;
            }

            return newChapters;
        });
         toast({ title: "Lesson Completed!", description: "Great job! The next lesson is now unlocked."});
      }, 1500);
  };

  const overallProgress = useMemo(() => {
    const totalLessons = chapters.reduce((sum, chapter) => sum + chapter.lessons.length, 0);
    const completedLessons = chapters.reduce((sum, chapter) => sum + chapter.lessons.filter(l => l.completed).length, 0);
    return totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
  }, [chapters]);

  const currentChapterForDisplay = useMemo(() => {
    return chapters.find(ch => ch.lessons.some(l => !l.completed && !l.locked)) || chapters[0];
  }, [chapters]);

  if (isLoading) {
      return (
          <div className="flex items-center justify-center h-64">
              <LoadingSpinner />
              <p className="ml-2">Loading your dashboard...</p>
          </div>
      );
  }

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

      {currentChapterForDisplay && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BookOpen className="text-accent"/> <BilingualText en={`Current: ${currentChapterForDisplay.titleEn}`} hi={`वर्तमान: ${currentChapterForDisplay.titleHi}`} /></CardTitle>
            <CardDescription><BilingualText en="Complete your lessons to move forward." hi="आगे बढ़ने के लिए अपने पाठ पूरे करें।" /></CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {currentChapterForDisplay.lessons.map(lesson => (
              <LessonRow key={lesson.id} lesson={lesson} onLessonClick={() => handleLessonClick(currentChapterForDisplay.id, lesson.id)} />
            ))}
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
            <CardTitle className="flex items-center gap-2"><AlertTriangle className="text-destructive"/> <BilingualText en="AI-Flagged Weak Topics" hi="एआई-चिह्नित कमजोर विषय" /></CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {weakTopics.length > 0 ? weakTopics.map((topic, index) => (
              <div key={index} className="text-xs flex justify-between items-center p-1.5 bg-destructive/10 text-destructive-foreground rounded-md border border-destructive/30">
                <span>{topic}</span>
                <Button variant="link" size="sm" className="p-0 h-auto text-xs text-destructive hover:underline" onClick={() => router.push(`/brainmate?query=${encodeURIComponent('Explain ' + topic)}`)}><BilingualText en="Get Help" hi="मदद लें"/></Button>
              </div>
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
                    {chapters.filter(ch => ch.id !== currentChapterForDisplay?.id).map(chapter => {
                         const chapterProgress = chapter.lessons.length > 0 ? (chapter.lessons.filter(l => l.completed).length / chapter.lessons.length) * 100 : 0;
                         return (
                            <Card key={chapter.id} className="bg-muted/40">
                                <CardHeader className="py-3 px-4">
                                    <CardTitle className="text-sm font-medium">
                                        <BilingualText en={chapter.titleEn} hi={chapter.titleHi}/>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="py-2 px-4 text-xs text-muted-foreground space-y-1">
                                    <p><BilingualText en={`${chapter.lessons.filter(t=>t.completed).length} / ${chapter.lessons.length} lessons completed`} hi={`${chapter.lessons.length} में से ${chapter.lessons.filter(t=>t.completed).length} पाठ पूर्ण`}/></p>
                                    <Progress value={chapterProgress} className="h-1.5"/>
                                </CardContent>
                            </Card>
                         )
                    })}
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
