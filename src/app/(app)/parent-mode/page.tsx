
"use client";

import { BilingualText } from "@/components/shared/BilingualText";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AreaChart, ShieldCheck, Eye, User, Users2, LogOut, ArrowLeftRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export default function ParentModePage() {
  const router = useRouter();
  const { toast } = useToast();

  // Mock data for child
  const childData = {
    name: "Aanya Sharma",
    class: "8th",
    lastActivity: "Completed 'Light' chapter quiz",
    overallProgress: 75, // percentage
    avatarUrl: "https://placehold.co/80x80.png",
    dataAiHint: "student girl avatar"
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

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
                <Users2 className="h-8 w-8 text-primary"/>
                <BilingualText en="Parent Mode" hi="पेरेंट मोड" />
            </h1>
            <p className="text-muted-foreground">
                <BilingualText en="Monitor your child's learning journey." hi="अपने बच्चे की सीखने की यात्रा की निगरानी करें।" />
            </p>
        </div>
        <Button variant="outline" size="sm">
            <User className="mr-2 h-4 w-4" />
            <BilingualText en="Switch Child" hi="बच्चा बदलें"/>
        </Button>
      </header>

      <Card className="bg-primary/5 border-primary/20">
        <CardHeader className="flex flex-row items-center gap-4">
            <Image src={childData.avatarUrl} alt={childData.name} width={60} height={60} className="rounded-full border-2 border-primary data-ai-hint={childData.dataAiHint}" />
            <div>
                <CardTitle className="text-xl font-headline text-primary">{childData.name}</CardTitle>
                <CardDescription><BilingualText en={`Class ${childData.class}`} hi={`कक्षा ${childData.class}`} /> | <BilingualText en="Last active: " hi="अंतिम सक्रिय: " /> {childData.lastActivity}</CardDescription>
            </div>
        </CardHeader>
        <CardContent>
            {/* Progress bar could go here */}
            <p><BilingualText en="Overall Progress: " hi="कुल प्रगति: " /> <span className="font-bold text-primary">{childData.overallProgress}%</span></p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline"><AreaChart className="text-accent h-6 w-6"/> <BilingualText en="Learning Reports" hi="सीखने की रिपोर्ट" /></CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-3"><BilingualText en="View detailed progress, strengths, and areas for improvement." hi="विस्तृत प्रगति, ताकत और सुधार के क्षेत्रों को देखें।" /></p>
            <Button variant="outline" className="w-full"><BilingualText en="View Reports" hi="रिपोर्ट देखें" /></Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline"><ShieldCheck className="text-green-500 h-6 w-6"/> <BilingualText en="Content Control" hi="सामग्री नियंत्रण" /></CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-3"><BilingualText en="Manage study time and access to specific content." hi="अध्ययन के समय और विशिष्ट सामग्री तक पहुंच का प्रबंधन करें।" /></p>
            <Button variant="outline" className="w-full"><BilingualText en="Set Controls" hi="नियंत्रण सेट करें" /></Button>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline"><Eye className="text-primary h-6 w-6"/> <BilingualText en="Explainer Videos for Kids" hi="बच्चों के लिए व्याख्याता वीडियो" /></CardTitle>
            <CardDescription><BilingualText en="Helpful videos to assist your child with difficult topics." hi="कठिन विषयों में अपने बच्चे की सहायता के लिए सहायक वीडियो।" /></CardDescription>
        </CardHeader>
        <CardContent>
             {/* Placeholder for video list or categories */}
            <p className="text-muted-foreground text-center py-4"><BilingualText en="Video content coming soon!" hi="वीडियो सामग्री जल्द ही आ रही है!" /></p>
            <Button className="w-full mt-2"><BilingualText en="Browse Videos" hi="वीडियो ब्राउज़ करें" /></Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle><BilingualText en="Account Actions" hi="खाता कार्रवाई"/></CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" onClick={handleSwitchToStudentMode}>
                <ArrowLeftRight className="mr-2 h-5 w-5 text-blue-500"/>
                <BilingualText en="Switch to Student Mode" hi="छात्र मोड पर स्विच करें"/>
            </Button>
            <Button variant="destructive" className="w-full justify-start" onClick={handleLogout}>
                <LogOut className="mr-2 h-5 w-5"/>
                <BilingualText en="Logout from Parent Mode" hi="पेरेंट मोड से लॉगआउट करें"/>
            </Button>
        </CardContent>
      </Card>

    </div>
  );
}
