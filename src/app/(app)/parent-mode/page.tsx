
"use client";

import { useState } from "react";
import { BilingualText } from "@/components/shared/BilingualText";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ShieldCheck, Eye, User, LogOut, ArrowLeftRight, Bell, Languages, Brain, Smile, Meh, Frown, Zap,
  Package, BookOpen, TrendingUp, AlertTriangle, Award, Download, MessageSquare, CalendarCheck2, Printer, FileText, Notebook, PencilLine,
  ExternalLink, RadioTower, Clock, Edit, HeartPulse, Truck, CheckCircle, Target,
  ArrowLeft
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";


// Mock data
const parentData = { name: "Mr. Sharma" };
const childData = {
  name: "Aanya Sharma",
  class: "8th",
  avatarUrl: "https://placehold.co/40x40.png",
  dataAiHint: "student girl avatar"
};

const brainScanData = {
  cognitiveClarity: 87,
  attentionSpan: "Improving",
  stressLevel: "Medium",
  stressEmoji: "😟",
  lastScan: "Monday",
  clarity: { value: 85, color: "blue", labelEn: "Clarity", labelHi: "स्पष्टता" },
  focus: { value: 70, color: "green", labelEn: "Focus", labelHi: "फोकस" },
  attention: { value: 40, color: "yellow", labelEn: "Attention", labelHi: "ध्यान" },
  stress: { value: 65, color: "red", labelEn: "Stress", labelHi: "तनाव" },
};

const mindDiaryData = [
  { date: "Mon", emoji: <Smile size={24} className="text-yellow-400"/>, label: "Happy" },
  { date: "Tue", emoji: <Meh size={24} className="text-blue-400"/>, label: "Neutral" },
  { date: "Wed", emoji: <Smile size={24} className="text-yellow-400"/>, label: "Happy" },
  { date: "Thu", emoji: <Frown size={24} className="text-purple-400"/>, label: "Sad" },
  { date: "Fri", emoji: <Zap size={24} className="text-orange-400"/>, label: "Stressed" },
  { date: "Sat", emoji: <Smile size={24} className="text-yellow-400"/>, label: "Happy" },
  { date: "Sun", emoji: <Smile size={24} className="text-yellow-400"/>, label: "Happy" },
];

const orderData = [
  { id: "OSO78901", itemEn: "Notebook Pack (Classmate, 5 units)", itemHi: "नोटबुक पैक (क्लासमेट, 5 यूनिट)", statusEn: "Delivered", statusHi: "डिलीवर हो गया", icon: Notebook, date:"Jul 15, 2024"},
  { id: "OSO78902", itemEn: "Gel Pens (Trimax Gold, Set of 3)", itemHi: "जेल पेन (ट्राइमैक्स गोल्ड, 3 का सेट)", statusEn: "On the way", statusHi: "रास्ते में", icon: PencilLine, date: "Expected by 4PM Today"},
];

const studySummaryData = {
  chaptersCompleted: 3,
  topicsUnclear: 2,
  avgStudyTime: "42 mins/day",
};

const testPerformanceData = {
  testName: "Mock Test 1 (Physics)",
  score: 65,
  weakAreas: "Organic Chemistry, Algebra", 
  gurujiSuggestion: "Revise concepts with AI notes & practice more numericals.",
};

const goalsData = {
  studyStreak: 5,
  currentGoal: "Finish Physics Chapter 4",
  badgeUnlocked: "Early Bird Learner",
  progress: 70, 
};

const parentAlertsData = [
  { id: "alert1", textEn: "Aanya didn’t study yesterday. Check study plan.", textHi: "आन्या ने कल पढ़ाई नहीं की। अध्ययन योजना जांचें।", type: "warning", icon: AlertTriangle },
  { id: "alert2", textEn: "AI reports Aanya is improving in Maths!", textHi: "एआई की रिपोर्ट है कि आन्या गणित में सुधार कर रही है!", type: "success", icon: TrendingUp },
  { id: "alert3", textEn: "Aanya scored 72% in the last Science quiz.", textHi: "आन्या ने पिछली विज्ञान प्रश्नोत्तरी में 72% अंक प्राप्त किए।", type: "info", icon: Award },
];

const downloadsData = [
  { id: "doc1", nameEn: "School Circular - Summer Camp", nameHi: "स्कूल परिपत्र - ग्रीष्मकालीन शिविर", type: "PDF", icon: FileText },
  { id: "doc2", nameEn: "Aanya's Term 1 Report Card", nameHi: "आन्या की पहली टर्म की रिपोर्ट कार्ड", type: "PDF", icon: FileText },
];

const auraZoneClasses: Record<string, string> = {
  blue: "border-primary bg-primary/10 animate-blue-pulse", // Clarity
  green: "border-success bg-success/10 animate-green-pulse", // Focus
  yellow: "border-warning bg-warning/10 animate-yellow-pulse", // Attention
  red: "border-destructive bg-destructive/10 animate-red-flicker", // Stress
};

const colorMap: Record<string, string> = {
    blue: 'bg-primary',
    green: 'bg-success',
    yellow: 'bg-warning',
    red: 'bg-destructive',
};

export default function ParentDashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentLang, setCurrentLang] = useState<'en' | 'hi'>('en');
  const auraMetrics = [brainScanData.clarity, brainScanData.focus, brainScanData.attention, brainScanData.stress];

  const handleLanguageToggle = () => {
    setCurrentLang(prevLang => (prevLang === 'en' ? 'hi' : 'en'));
  };

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out from Parent Mode.",
    });
    router.push('/login');
  };

  const handleSwitchToStudentMode = () => {
    toast({
      title: "Switching Mode",
      description: "Returning to Student Dashboard.",
    });
    router.push('/');
  };
  
  const getStressEmojiIcon = (level: string) => {
    if (level.toLowerCase() === 'low') return <Smile size={18} className="text-success"/>;
    if (level.toLowerCase() === 'medium') return <Meh size={18} className="text-warning"/>;
    if (level.toLowerCase() === 'high') return <Frown size={18} className="text-destructive"/>;
    return <Meh size={18} className="text-muted-foreground"/>; // Default
  }

  const handleMockAction = (actionName: string, link?: string) => {
    if (link) {
        router.push(link);
    } else {
        toast({
            title: `${actionName} (Simulated)`,
            description: `This feature is coming soon or the specific link needs to be implemented!`,
        });
    }
  };

  return (
    <div className="space-y-6 perspective-1000">
      <header className="flex items-center justify-between py-1 sticky top-0 z-20 bg-background/80 backdrop-blur-sm -mx-4 px-4 shadow-sm border-b">
        <Button variant="ghost" size="icon" className="hover:bg-card/70 h-8 w-8" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 border-2 border-primary">
              <AvatarImage src={childData.avatarUrl} alt={childData.name} data-ai-hint={childData.dataAiHint} />
              <AvatarFallback>{childData.name.substring(0,1)}</AvatarFallback>
            </Avatar>
            <div>
                <p className="text-sm font-medium">{childData.name}</p>
                <p className="text-xs text-muted-foreground"><BilingualText en="Parent:" hi="अभिभावक:" lang={currentLang}/> {parentData.name}</p>
            </div>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleLanguageToggle} variant="ghost" size="sm" className="text-xs h-7 px-2 hover:bg-card/70">
            <Languages className="mr-1 h-3 w-3"/> {currentLang === 'en' ? 'हिन्दी' : 'English'}
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-card/70 relative h-8 w-8" onClick={() => handleMockAction("View Notifications")}>
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-400"></span>
            </span>
          </Button>
        </div>
      </header>

      {/* OSO Brain Scan Widget */}
      <Card 
        className="glass-card border-primary/20 shadow-lg shadow-primary/10 overflow-hidden transform-style-3d backface-hidden transition-all duration-500 hover:-translate-y-2 hover:rotate-x-[10deg] hover:shadow-2xl hover:shadow-primary/20 animate-float-in" 
        style={{ animationDelay: '100ms' }}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-headline text-primary">
            <RadioTower className="h-6 w-6 animate-pulse" /> OSO Brain Scan™
          </CardTitle>
          <CardDescription className="text-xs">
            <BilingualText en="Weekly AI Cognitive Snapshot" hi="साप्ताहिक एआई संज्ञानात्मक स्नैपशॉट" lang={currentLang} />
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center text-center">
            <div className="relative w-48 h-48 mb-4 flex items-center justify-center">
              {auraMetrics.map((metric, index) => (
                <div 
                  key={metric.labelEn}
                  className={cn(
                    "absolute rounded-full border-2",
                    auraZoneClasses[metric.color],
                  )}
                  style={{ 
                    width: `${90 - index * 20}%`, 
                    height: `${90 - index * 20}%`,
                    animationDelay: `${index * 0.15}s`
                  }}
                />
              ))}
              <Brain className="w-16 h-16 text-primary z-10 opacity-90 filter drop-shadow-[0_0_8px_hsl(var(--primary))]"/>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs w-full max-w-xs mb-2 text-left">
               {auraMetrics.map(metric => (
                    <div key={metric.labelEn} className="flex items-center gap-2">
                       <div className={cn("h-2 w-2 rounded-full", colorMap[metric.color])}></div>
                       <span className="font-medium"><BilingualText en={metric.labelEn} hi={metric.labelHi} lang={currentLang}/>:</span>
                       <span className="text-foreground/90">{metric.value}%</span>
                    </div>
                ))}
            </div>
        </CardContent>
        <CardFooter className="p-3 bg-muted/30 border-t">
            <Button asChild variant="outline" size="sm" className="w-full">
                <Link href="/brain-scan-report">
                    <BilingualText en="View Full Aura Map Report" hi="पूर्ण ऑरा मैप रिपोर्ट देखें" lang={currentLang}/> <ExternalLink size={12} className="ml-1"/>
                </Link>
            </Button>
        </CardFooter>
      </Card>
      
      {/* Parent Alerts Widget */}
      <Card 
        className="glass-card border-border transform-style-3d backface-hidden transition-all duration-500 hover:-translate-y-2 hover:rotate-x-[10deg] hover:shadow-2xl hover:shadow-primary/20 animate-float-in"
        style={{ animationDelay: '200ms' }}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-headline">
            <Bell className="h-6 w-6 text-yellow-400" /> <BilingualText en="Parent Alerts" hi="अभिभावक अलर्ट" lang={currentLang}/>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2.5">
          {parentAlertsData.map(alert => (
            <div key={alert.id} className={cn("flex items-start gap-3 p-2.5 rounded-md text-sm", alert.type === "warning" ? "bg-warning/15 text-warning-foreground border border-warning/30" : alert.type === "success" ? "bg-success/15 text-success-foreground border border-success/30" : "bg-muted/50")}>
              <alert.icon className={cn("h-5 w-5 mt-0.5 shrink-0", alert.type === "warning" ? "text-warning" : alert.type === "success" ? "text-success" : "text-primary" )} />
              <span className="flex-grow"><BilingualText en={alert.textEn} hi={alert.textHi} lang={currentLang}/></span>
            </div>
          ))}
        </CardContent>
      </Card>
      
      {/* Grid for multiple info cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* OSO Mind Diary Widget */}
        <Card 
          className="glass-card border-border transform-style-3d backface-hidden transition-all duration-500 hover:-translate-y-2 hover:rotate-x-[10deg] hover:shadow-2xl hover:shadow-primary/20 animate-float-in"
          style={{ animationDelay: '300ms' }}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-headline">
              <HeartPulse className="h-6 w-6 text-accent" /> Mind Diary
            </CardTitle>
             <CardDescription className="text-xs">7-Day Emotional Check-in</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-around items-end p-2 bg-muted/50 rounded-md min-h-[60px]">
              {mindDiaryData.map(day => (
                <div key={day.date} className="flex flex-col items-center text-center group" title={day.label}>
                  <div className="transition-transform group-hover:-translate-y-1">{day.emoji}</div>
                  <span className="text-[0.6rem] text-muted-foreground">{day.date}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* OSO Orders Widget */}
        <Card 
          className="glass-card border-border transform-style-3d backface-hidden transition-all duration-500 hover:-translate-y-2 hover:rotate-x-[10deg] hover:shadow-2xl hover:shadow-primary/20 animate-float-in"
          style={{ animationDelay: '400ms' }}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-headline">
              <Truck className="h-6 w-6 text-accent" /> OSO Orders
            </CardTitle>
             <CardDescription className="text-xs">Delivery Tracker</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {orderData.map(order => (
              <div key={order.id} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <order.icon className="h-5 w-5 text-muted-foreground"/>
                  <div>
                      <p className="font-medium"><BilingualText en={order.itemEn} hi={order.itemHi} lang={currentLang}/></p>
                      <p className="text-muted-foreground/80"><BilingualText en={order.statusEn} hi={order.statusHi} lang={currentLang}/> - {order.date}</p>
                  </div>
                </div>
                <Button asChild variant="link" size="sm" className="p-0 h-auto text-accent hover:underline">
                   <Link href={`/track-order/${order.id}`}>
                      <BilingualText en="Track" hi="ट्रैक" lang={currentLang}/>
                   </Link>
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Study Summary Widget */}
        <Card 
          className="glass-card border-border transform-style-3d backface-hidden transition-all duration-500 hover:-translate-y-2 hover:rotate-x-[10deg] hover:shadow-2xl hover:shadow-primary/20 animate-float-in"
          style={{ animationDelay: '500ms' }}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-headline">
              <BookOpen className="h-6 w-6 text-primary" /> <BilingualText en="Study Summary" hi="अध्ययन सारांश" lang={currentLang}/>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><CheckCircle size={14} className="inline mr-1 text-success"/> {studySummaryData.chaptersCompleted} <BilingualText en="chapters completed" hi="अध्याय पूरे हुए" lang={currentLang}/></p>
            <p><AlertTriangle size={14} className="inline mr-1 text-warning"/> {studySummaryData.topicsUnclear} <BilingualText en="topics unclear (AI Flagged)" hi="विषय अस्पष्ट (AI द्वारा चिह्नित)" lang={currentLang}/></p>
            <p><Clock size={14} className="inline mr-1 text-muted-foreground"/> <BilingualText en="Avg. study time:" hi="औसत अध्ययन समय:" lang={currentLang}/> {studySummaryData.avgStudyTime}</p>
          </CardContent>
        </Card>
        
        {/* Test Performance Widget */}
        <Card 
          className="glass-card border-border transform-style-3d backface-hidden transition-all duration-500 hover:-translate-y-2 hover:rotate-x-[10deg] hover:shadow-2xl hover:shadow-primary/20 animate-float-in"
          style={{ animationDelay: '600ms' }}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-headline">
              <TrendingUp className="h-6 w-6 text-success" /> <BilingualText en="Test Performance" hi="परीक्षा प्रदर्शन" lang={currentLang}/>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><FileText size={14} className="inline mr-1 text-muted-foreground"/> {testPerformanceData.testName}: <span className="font-bold">{testPerformanceData.score}%</span></p>
            <p><Zap size={14} className="inline mr-1 text-warning"/> <BilingualText en="Weak Areas:" hi="कमजोर क्षेत्र:" lang={currentLang}/> {testPerformanceData.weakAreas}</p>
            <p className="text-primary/90"><MessageSquare size={14} className="inline mr-1"/> <BilingualText en="Guruji's Suggestion:" hi="गुरुजी का सुझाव:" lang={currentLang}/> {testPerformanceData.gurujiSuggestion}</p>
          </CardContent>
        </Card>
       </div>
       
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Goals + Motivation Tracker Widget */}
        <Card 
          className="glass-card border-border transform-style-3d backface-hidden transition-all duration-500 hover:-translate-y-2 hover:rotate-x-[10deg] hover:shadow-2xl hover:shadow-primary/20 animate-float-in"
          style={{ animationDelay: '700ms' }}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-headline">
              <Award className="h-6 w-6 text-yellow-400" /> <BilingualText en="Goals & Motivation" hi="लक्ष्य और प्रेरणा" lang={currentLang}/>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p><CalendarCheck2 size={14} className="inline mr-1 text-yellow-400"/> {goalsData.studyStreak} <BilingualText en="days study streak" hi="दिनों की अध्ययन लकीर" lang={currentLang}/> 🔥</p>
            <div>
              <Label className="text-xs text-muted-foreground flex items-center"><Target size={12} className="mr-1"/> <BilingualText en="Current Goal" hi="वर्तमान लक्ष्य" lang={currentLang}/></Label>
              <p className="font-medium">{goalsData.currentGoal}</p>
              <Progress value={goalsData.progress} className="h-2 mt-1 [&>div]:bg-gradient-to-r [&>div]:from-yellow-400 [&>div]:to-orange-500" />
            </div>
            <p><ShieldCheck size={14} className="inline mr-1 text-success"/> <BilingualText en="Badge Unlocked:" hi="बैज अनलॉक किया गया:" lang={currentLang}/> <span className="font-semibold text-yellow-400">{goalsData.badgeUnlocked}</span></p>
          </CardContent>
        </Card>
        
        {/* Downloads + Documents Widget */}
        <Card 
          className="glass-card border-border transform-style-3d backface-hidden transition-all duration-500 hover:-translate-y-2 hover:rotate-x-[10deg] hover:shadow-2xl hover:shadow-primary/20 animate-float-in"
          style={{ animationDelay: '800ms' }}
        >
          <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-headline">
                  <Download className="h-6 w-6 text-muted-foreground"/> <BilingualText en="Downloads & Docs" hi="डाउनलोड और दस्तावेज़" lang={currentLang}/>
              </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
              {downloadsData.map(doc => (
                  <Button 
                      key={doc.id} 
                      variant="outline" 
                      className="w-full justify-start gap-2 hover:bg-card/70 text-sm"
                      onClick={() => handleMockAction(`Download: ${doc.nameEn}`)}
                  >
                      <doc.icon size={16}/>
                      <span><BilingualText en={doc.nameEn} hi={doc.nameHi} lang={currentLang}/> ({doc.type})</span>
                  </Button>
              ))}
          </CardContent>
        </Card>
      </div>

      <Card 
        className="glass-card border-border transform-style-3d backface-hidden transition-all duration-500 hover:-translate-y-2 hover:rotate-x-[10deg] hover:shadow-2xl hover:shadow-primary/20 animate-float-in"
        style={{ animationDelay: '900ms' }}
      >
        <CardHeader>
          <CardTitle className="text-lg font-headline"><BilingualText en="Quick Actions" hi="त्वरित कार्रवाई" lang={currentLang}/></CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3 text-sm">
          <Button variant="outline" className="justify-start gap-1.5" onClick={handleSwitchToStudentMode}>
            <ArrowLeftRight size={14}/> <BilingualText en="Student View" hi="छात्र दृश्य" lang={currentLang}/>
          </Button>
          <Button variant="outline" className="justify-start gap-1.5" onClick={() => handleMockAction("Chat Support")}>
            <MessageSquare size={14}/> <BilingualText en="Chat Support" hi="चैट सहायता" lang={currentLang}/>
          </Button>
           <Button variant="outline" className="justify-start gap-1.5" onClick={() => handleMockAction("Schedule PTM")}>
            <CalendarCheck2 size={14}/> <BilingualText en="Schedule PTM" hi="PTM शेड्यूल करें" lang={currentLang}/>
          </Button>
          <Button variant="outline" className="justify-start gap-1.5" onClick={() => handleMockAction("Print Report")}>
            <Printer size={14}/> <BilingualText en="Print Report" hi="रिपोर्ट प्रिंट करें" lang={currentLang}/>
          </Button>
          <Button variant="destructive" className="col-span-2 justify-start gap-1.5" onClick={handleLogout}>
            <LogOut size={14}/> <BilingualText en="Logout Parent Mode" hi="पेरेंट मोड लॉगआउट" lang={currentLang}/>
          </Button>
        </CardContent>
      </Card>

    </div>
  );
}
