
"use client";

import { useState } from "react";
import { BilingualText } from "@/components/shared/BilingualText";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AreaChart, ShieldCheck, Eye, User, Users2, LogOut, ArrowLeftRight, Bell, Languages, Brain, Smile, Meh, Frown, Zap,
  Package, BookOpen, TrendingUp, AlertTriangle, Award, Download, MessageSquare, CalendarCheck2, Printer, FileText, Notebook, PencilLine,
  ExternalLink, RadioTower, Clock, Edit
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { cn } from "@/lib/utils";

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
  color: "purple-500", 
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
  { id: "alert1", textEn: "Aanya didn’t study yesterday. Check study plan.", textHi: "आन्या ने कल पढ़ाई नहीं की। अध्ययन योजना जांचें।", type: "warning", icon: AlertTriangle, glow: "shadow-glow-yellow-soft shadow-yellow-500/50" },
  { id: "alert2", textEn: "AI reports Aanya is improving in Maths!", textHi: "एआई की रिपोर्ट है कि आन्या गणित में सुधार कर रही है!", type: "success", icon: TrendingUp, glow: "shadow-glow-aqua-soft shadow-glow-aqua/50" },
  { id: "alert3", textEn: "Aanya scored 72% in the last Science quiz.", textHi: "आन्या ने पिछली विज्ञान प्रश्नोत्तरी में 72% अंक प्राप्त किए।", type: "info", icon: Award },
];

const downloadsData = [
  { id: "doc1", nameEn: "School Circular - Summer Camp", nameHi: "स्कूल परिपत्र - ग्रीष्मकालीन शिविर", type: "PDF", icon: FileText },
  { id: "doc2", nameEn: "Aanya's Term 1 Report Card", nameHi: "आन्या की पहली टर्म की रिपोर्ट कार्ड", type: "PDF", icon: FileText },
  { id: "doc3", nameEn: "Learning Plan - July", nameHi: "सीखने की योजना - जुलाई", type: "PDF", icon: Edit },
];


export default function ParentDashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentLang, setCurrentLang] = useState<'en' | 'hi'>('en');

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
    if (level.toLowerCase() === 'low') return <Smile size={18} className="text-green-400"/>;
    if (level.toLowerCase() === 'medium') return <Meh size={18} className="text-yellow-400"/>;
    if (level.toLowerCase() === 'high') return <Frown size={18} className="text-red-400"/>;
    return <Meh size={18} className="text-gray-400"/>; // Default
  }

  const handleMockAction = (actionName: string) => {
    toast({
        title: `${actionName} (Simulated)`,
        description: `This feature is coming soon!`,
    });
  };

  return (
    <div className="min-h-screen bg-deep-space-indigo text-gray-200 font-sans space-y-5 pb-10 -m-4 p-4">
      {/* Top Bar */}
      <header className="flex items-center justify-between py-3 px-1 sticky top-0 z-20 bg-deep-space-indigo/80 backdrop-blur-sm -mx-4 px-4 shadow-sm">
        <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 border-2 border-glow-aqua">
              <AvatarImage src={childData.avatarUrl} alt={childData.name} data-ai-hint={childData.dataAiHint} />
              <AvatarFallback>{childData.name.substring(0,1)}</AvatarFallback>
            </Avatar>
            <div>
                <p className="text-sm font-medium">{childData.name}</p>
                <p className="text-xs text-gray-400"><BilingualText en="Parent:" hi="अभिभावक:" lang={currentLang}/> {parentData.name}</p>
            </div>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleLanguageToggle} variant="ghost" size="sm" className="text-xs h-7 px-2 text-gray-300 hover:bg-dark-glass-card hover:text-glow-aqua">
            <Languages className="mr-1 h-3 w-3"/> {currentLang === 'en' ? 'हिन्दी' : 'English'}
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-300 hover:text-glow-aqua hover:bg-dark-glass-card relative h-8 w-8" onClick={() => handleMockAction("View Notifications")}>
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-glow-yellow opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-glow-yellow"></span>
            </span>
          </Button>
        </div>
      </header>

      {/* OSO Brain Scan Widget */}
      <Card className="bg-dark-glass-card border-glow-aqua/30 shadow-lg shadow-glow-aqua/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-headline text-glow-aqua">
            <RadioTower className="h-6 w-6 animate-pulse" /> OSO Brain Scan™
          </CardTitle>
          <CardDescription className="text-gray-400 text-xs">
            <BilingualText en="Weekly AI Report Card" hi="साप्ताहिक एआई रिपोर्ट कार्ड" lang={currentLang} />
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center text-center">
          <div className={`relative w-36 h-36 mb-4 rounded-full flex items-center justify-center border-2 border-${brainScanData.color}/50 shadow-md shadow-${brainScanData.color}/30 animate-brain-heatmap-pulse shadow-glow-purple-soft`}>
             <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-600/30 via-blue-500/20 to-pink-500/30 opacity-75"></div>
             <Brain className={`w-16 h-16 text-${brainScanData.color} z-10`} />
          </div>
          <div className="grid grid-cols-3 gap-x-2 text-xs w-full max-w-xs mb-2">
            <div>
              <p className="font-semibold">{brainScanData.cognitiveClarity}%</p>
              <p className="text-gray-400"><BilingualText en="Clarity" hi="स्पष्टता" lang={currentLang}/></p>
            </div>
            <div>
              <p className="font-semibold text-green-400">{brainScanData.attentionSpan}</p>
              <p className="text-gray-400"><BilingualText en="Attention" hi="ध्यान" lang={currentLang}/></p>
            </div>
            <div className="flex flex-col items-center">
              <div className="font-semibold flex items-center justify-center gap-1">
                {getStressEmojiIcon(brainScanData.stressLevel)} {brainScanData.stressLevel}
              </div>
              <p className="text-gray-400"><BilingualText en="Stress" hi="तनाव" lang={currentLang}/></p>
            </div>
          </div>
          <p className="text-xs text-gray-500"><BilingualText en="Last scan:" hi="अंतिम स्कैन:" lang={currentLang}/> {brainScanData.lastScan}</p>
        </CardContent>
        <CardFooter>
            <Button asChild variant="outline" size="sm" className="w-full border-glow-aqua/50 text-glow-aqua hover:bg-glow-aqua/10 hover:text-glow-aqua">
                <Link href="/brain-scan-report">
                    <BilingualText en="View Full Weekly Report" hi="पूरी साप्ताहिक रिपोर्ट देखें" lang={currentLang}/> <ExternalLink size={12} className="ml-1"/>
                </Link>
            </Button>
        </CardFooter>
      </Card>

      {/* OSO Mind Diary Widget */}
      <Card className="bg-dark-glass-card border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-headline text-gray-200">
            <HeartPulse className="h-6 w-6 text-yellow-400" /> OSO Mind Diary™
          </CardTitle>
          <CardDescription className="text-gray-400 text-xs"><BilingualText en="Past 7 Days Emotional Check-ins" hi="पिछले 7 दिनों के भावनात्मक चेक-इन" lang={currentLang}/></CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-around items-end p-2 bg-gray-900/30 rounded-md min-h-[60px]">
            {mindDiaryData.map(day => (
              <div key={day.date} className="flex flex-col items-center text-center" title={day.label}>
                {day.emoji}
                <span className="text-[0.6rem] text-gray-400">{day.date}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* OSO Orders Widget */}
      <Card className="bg-dark-glass-card border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-headline text-gray-200">
            <Truck className="h-6 w-6 text-orange-400" /> OSO Orders
          </CardTitle>
          <CardDescription className="text-gray-400 text-xs"><BilingualText en="Delivery Tracker for Study Items" hi="अध्ययन सामग्री के लिए डिलीवरी ट्रैकर" lang={currentLang}/></CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {orderData.map(order => (
            <div key={order.id} className="flex items-center justify-between p-2.5 bg-gray-900/30 rounded-md text-xs">
              <div className="flex items-center gap-2">
                <order.icon className="h-5 w-5 text-orange-400"/>
                <div>
                    <p className="font-medium"><BilingualText en={order.itemEn} hi={order.itemHi} lang={currentLang}/></p>
                    <p className="text-gray-400"><BilingualText en={order.statusEn} hi={order.statusHi} lang={currentLang}/> - {order.date}</p>
                </div>
              </div>
              <Button asChild variant="link" size="sm" className="p-0 h-auto text-orange-400 hover:underline">
                 <Link href={`/track-order/${order.id}`}>
                    <BilingualText en="Track" hi="ट्रैक" lang={currentLang}/>
                 </Link>
              </Button>
            </div>
          ))}
        </CardContent>
        <CardFooter>
            <Button variant="link" className="w-full text-orange-400 justify-start p-0 h-auto text-xs" onClick={() => handleMockAction("View Full Order History")}>
                 <BilingualText en="View Full Order History" hi="पूरा ऑर्डर इतिहास देखें" lang={currentLang}/> <ExternalLink size={12} className="ml-1"/>
            </Button>
        </CardFooter>
      </Card>

      {/* Study Summary Widget */}
      <Card className="bg-dark-glass-card border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-headline text-gray-200">
            <BookOpen className="h-6 w-6 text-blue-400" /> <BilingualText en="Study Summary" hi="अध्ययन सारांश" lang={currentLang}/>
          </CardTitle>
          <CardDescription className="text-gray-400 text-xs"><BilingualText en="Child's learning activity this week" hi="इस सप्ताह बच्चे की सीखने की गतिविधि" lang={currentLang}/></CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p><CheckCircle size={14} className="inline mr-1 text-green-400"/> {studySummaryData.chaptersCompleted} <BilingualText en="chapters completed" hi="अध्याय पूरे हुए" lang={currentLang}/></p>
          <p><AlertTriangle size={14} className="inline mr-1 text-yellow-400"/> {studySummaryData.topicsUnclear} <BilingualText en="topics unclear (AI Flagged)" hi="विषय अस्पष्ट (AI द्वारा चिह्नित)" lang={currentLang}/></p>
          <p><Clock size={14} className="inline mr-1 text-gray-400"/> <BilingualText en="Avg. study time:" hi="औसत अध्ययन समय:" lang={currentLang}/> {studySummaryData.avgStudyTime}</p>
        </CardContent>
         <CardFooter>
            <Button variant="link" className="w-full text-blue-400 justify-start p-0 h-auto text-xs" onClick={() => handleMockAction("View Learning Timeline")}>
                 <BilingualText en="View Learning Timeline" hi="सीखने की टाइमलाइन देखें" lang={currentLang}/> <ExternalLink size={12} className="ml-1"/>
            </Button>
        </CardFooter>
      </Card>

      {/* Test Performance Widget */}
      <Card className="bg-dark-glass-card border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-headline text-gray-200">
            <TrendingUp className="h-6 w-6 text-green-400" /> <BilingualText en="Test Performance" hi="परीक्षा प्रदर्शन" lang={currentLang}/>
          </CardTitle>
           <CardDescription className="text-gray-400 text-xs"><BilingualText en="Latest mock test results" hi="नवीनतम मॉक टेस्ट परिणाम" lang={currentLang}/></CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p><FileText size={14} className="inline mr-1 text-gray-400"/> {testPerformanceData.testName}: <span className="font-bold">{testPerformanceData.score}%</span></p>
          <p><Zap size={14} className="inline mr-1 text-yellow-400"/> <BilingualText en="Weak Areas:" hi="कमजोर क्षेत्र:" lang={currentLang}/> {testPerformanceData.weakAreas}</p>
          <p className="text-glow-aqua/90"><MessageSquare size={14} className="inline mr-1"/> <BilingualText en="Guruji's Suggestion:" hi="गुरुजी का सुझाव:" lang={currentLang}/> {testPerformanceData.gurujiSuggestion}</p>
        </CardContent>
         <CardFooter>
            <Button variant="link" className="w-full text-green-400 justify-start p-0 h-auto text-xs" onClick={() => handleMockAction("View Full Test Series Analysis")}>
                 <BilingualText en="View Full Test Series Analysis" hi="पूर्ण टेस्ट सीरीज़ विश्लेषण देखें" lang={currentLang}/> <ExternalLink size={12} className="ml-1"/>
            </Button>
        </CardFooter>
      </Card>

      {/* Goals + Motivation Tracker Widget */}
      <Card className="bg-dark-glass-card border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-headline text-gray-200">
            <Award className="h-6 w-6 text-yellow-400" /> <BilingualText en="Goals & Motivation" hi="लक्ष्य और प्रेरणा" lang={currentLang}/>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p><CalendarCheck2 size={14} className="inline mr-1 text-yellow-400"/> {goalsData.studyStreak} <BilingualText en="days study streak" hi="दिनों की अध्ययन लकीर" lang={currentLang}/> 🔥</p>
          <p><Target size={14} className="inline mr-1 text-gray-400"/> <BilingualText en="Goal:" hi="लक्ष्य:" lang={currentLang}/> {goalsData.currentGoal}</p>
          <Progress value={goalsData.progress} className="h-2.5 [&>div]:bg-gradient-to-r [&>div]:from-yellow-400 [&>div]:to-orange-500 shadow-inner shadow-black/20" />
          <p className="text-xs text-right">{goalsData.progress}% <BilingualText en="complete" hi="पूर्ण" lang={currentLang}/></p>
          <p><ShieldCheck size={14} className="inline mr-1 text-green-400"/> <BilingualText en="Badge Unlocked:" hi="बैज अनलॉक किया गया:" lang={currentLang}/> <span className="font-semibold text-yellow-400">{goalsData.badgeUnlocked}</span></p>
        </CardContent>
      </Card>

      {/* Parent Alerts Widget */}
      <Card className="bg-dark-glass-card border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-headline text-gray-200">
            <Bell className="h-6 w-6 text-glow-yellow animate-pulse" style={{animationDuration: '1.5s'}} /> <BilingualText en="Parent Alerts" hi="अभिभावक अलर्ट" lang={currentLang}/>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2.5">
          {parentAlertsData.map(alert => (
            <div key={alert.id} className={cn("flex items-start gap-2 p-2.5 rounded-md text-xs", alert.type === "warning" ? "bg-yellow-500/15 text-yellow-300 border border-yellow-500/30 " + alert.glow : alert.type === "success" ? "bg-green-500/15 text-green-300 border border-green-500/30 " + alert.glow : "bg-blue-500/15 text-blue-300 border border-blue-500/30")}>
              <alert.icon className={cn("h-4 w-4 mt-0.5 shrink-0", alert.type === "warning" ? "text-yellow-400" : alert.type === "success" ? "text-green-400" : "text-blue-400" )} />
              <span><BilingualText en={alert.textEn} hi={alert.textHi} lang={currentLang}/></span>
            </div>
          ))}
        </CardContent>
      </Card>
      
      {/* Downloads + Documents Widget */}
      <Card className="bg-dark-glass-card border-gray-700">
        <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-headline text-gray-200">
                <Download className="h-6 w-6 text-gray-400"/> <BilingualText en="Downloads & Docs" hi="डाउनलोड और दस्तावेज़" lang={currentLang}/>
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
            {downloadsData.map(doc => (
                <Button 
                    key={doc.id} 
                    variant="outline" 
                    className="w-full justify-start gap-2 text-gray-300 border-gray-700 hover:bg-gray-700/50 hover:text-glow-aqua text-xs"
                    onClick={() => handleMockAction(`Download: ${doc.nameEn}`)}
                >
                    <doc.icon size={16}/>
                    <span><BilingualText en={doc.nameEn} hi={doc.nameHi} lang={currentLang}/> ({doc.type})</span>
                </Button>
            ))}
        </CardContent>
      </Card>

      {/* User Actions */}
      <Card className="bg-dark-glass-card border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg font-headline text-gray-200"><BilingualText en="Quick Actions" hi="त्वरित कार्रवाई" lang={currentLang}/></CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3 text-xs">
          <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-700/50 hover:text-glow-aqua justify-start gap-1.5" onClick={handleSwitchToStudentMode}>
            <ArrowLeftRight size={14}/> <BilingualText en="Student View" hi="छात्र दृश्य" lang={currentLang}/>
          </Button>
          <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-700/50 hover:text-glow-aqua justify-start gap-1.5" onClick={() => handleMockAction("Chat Support")}>
            <MessageSquare size={14}/> <BilingualText en="Chat Support" hi="चैट सहायता" lang={currentLang}/>
          </Button>
           <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-700/50 hover:text-glow-aqua justify-start gap-1.5" onClick={() => handleMockAction("Schedule PTM")}>
            <CalendarCheck2 size={14}/> <BilingualText en="Schedule PTM" hi="PTM शेड्यूल करें" lang={currentLang}/>
          </Button>
          <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-700/50 hover:text-glow-aqua justify-start gap-1.5" onClick={() => handleMockAction("Print Report")}>
            <Printer size={14}/> <BilingualText en="Print Report" hi="रिपोर्ट प्रिंट करें" lang={currentLang}/>
          </Button>
          <Button variant="destructive" className="col-span-2 bg-red-700/50 border-red-600 text-red-200 hover:bg-red-600/70 justify-start gap-1.5" onClick={handleLogout}>
            <LogOut size={14}/> <BilingualText en="Logout Parent Mode" hi="पेरेंट मोड लॉगआउट" lang={currentLang}/>
          </Button>
        </CardContent>
      </Card>

    </div>
  );
}

