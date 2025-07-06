
"use client";

import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { LifeBuoy, ArrowLeft, Package, BookOpen, CreditCard, Bot, Send, MessageSquare, Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import Link from 'next/link';
import { Badge } from "@/components/ui/badge";

const helpCategories = [
  { id: 'delivery', labelEn: "Delivery Problem", labelHi: "डिलीवरी समस्या", icon: Package },
  { id: 'learning', labelEn: "Learning Help", labelHi: "सीखने में मदद", icon: BookOpen },
  { id: 'payment', labelEn: "Payment / Refund", labelHi: "भुगतान / वापसी", icon: CreditCard },
  { id: 'other', labelEn: "Other Issue", labelHi: "अन्य समस्या", icon: MessageSquare },
];

const liveAgents = [
    { name: "Shivani", department: "Tech Support", available: true, avatarHint: "female support" },
    { name: "Rahul", department: "Delivery Support", available: false, avatarHint: "male support" },
];

export default function HelpPage() {
    const router = useRouter();
    const { toast } = useToast();

    const handleCategoryClick = (category: string) => {
        toast({
            title: "Connecting to Support (Simulated)",
            description: `You selected "${category}". A real chat would start now.`,
        });
    }

    const handleCallSupport = () => {
      router.push('/ai-voice-call');
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold font-headline flex items-center gap-2">
                    <LifeBuoy className="h-7 w-7 text-primary" />
                    <BilingualText en="Help & Support" hi="सहायता और समर्थन" />
                </h1>
                <Button variant="outline" onClick={() => router.back()}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    <BilingualText en="Back" hi="वापस" />
                </Button>
            </div>

            <Card className="shadow-lg">
                <CardHeader className="text-center items-center bg-muted/30">
                     <Avatar className="h-16 w-16 mb-2 border-2 border-primary">
                        <AvatarImage src="https://placehold.co/100x100.png" alt="OSO Buddy" data-ai-hint="friendly robot mascot" />
                        <AvatarFallback>🤖</AvatarFallback>
                    </Avatar>
                    <CardTitle className="font-headline text-xl text-primary">OSO Buddy</CardTitle>
                    <CardDescription className="max-w-xs">
                        <BilingualText 
                            en="Hi! I'm your AI assistant. How can I help you today? You can start by choosing a category or typing below." 
                            hi="नमस्ते! मैं आपका एआई सहायक हूँ। आज मैं आपकी कैसे मदद कर सकता हूँ? आप नीचे एक श्रेणी चुनकर या टाइप करके शुरू कर सकते हैं।" 
                        />
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        {helpCategories.map(cat => (
                            <Button key={cat.id} variant="outline" className="h-auto py-3 justify-start gap-2 text-left" onClick={() => handleCategoryClick(cat.labelEn)}>
                                <cat.icon className="h-5 w-5 text-muted-foreground"/>
                                <span><BilingualText en={cat.labelEn} hi={cat.labelHi}/></span>
                            </Button>
                        ))}
                    </div>
                     <div className="relative pt-4">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">Or</span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Textarea placeholder="Describe your issue here..." className="min-h-[80px]" />
                        <Button className="w-full">
                            <Send className="mr-2 h-4 w-4" /> Start Chat
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card className="shadow-lg bg-gradient-to-r from-green-500/10 to-primary/10">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline text-green-600">
                        <Phone className="h-6 w-6"/>
                        <BilingualText en="AI Voice Support" hi="एआई वॉयस सपोर्ट"/>
                    </CardTitle>
                    <CardDescription>
                        <BilingualText en="For urgent issues, call us directly. Our AI agent will assist you instantly." hi="अत्यावश्यक मुद्दों के लिए, हमें सीधे कॉल करें। हमारा एआई एजेंट आपकी तुरंत सहायता करेगा।"/>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white" onClick={handleCallSupport}>
                        <Phone className="mr-2 h-4 w-4"/>
                        <BilingualText en="Call OSO Support Now" hi="OSO सपोर्ट को अभी कॉल करें"/>
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg font-headline">Live Support Agents</CardTitle>
                    <CardDescription>If the AI can't help, you can connect to a live agent.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    {liveAgents.map(agent => (
                         <div key={agent.name} className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-9 w-9">
                                    <AvatarImage src={`https://placehold.co/40x40.png`} alt={agent.name} data-ai-hint={agent.avatarHint} />
                                    <AvatarFallback>{agent.name.substring(0,1)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold text-sm">{agent.name}</p>
                                    <p className="text-xs text-muted-foreground">{agent.department}</p>
                                </div>
                            </div>
                            <Badge variant={agent.available ? "default" : "outline"} className={agent.available ? "bg-green-100 text-green-800" : ""}>
                                {agent.available ? "Available" : "Offline"}
                            </Badge>
                        </div>
                    ))}
                </CardContent>
            </Card>

        </div>
    );
}
