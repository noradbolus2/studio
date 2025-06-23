
"use client";

import { useState, useRef, useEffect, type FormEvent, useMemo } from 'react';
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mic, Send, Loader2, Brain, Sparkles, ChevronLeft, Target } from "lucide-react";
import { askBrainmate, type BrainmateInput, type BrainmateOutput } from '@/ai/flows/brainmate-flow';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";
import type { ProfileFormData } from '../edit-profile/page';
import { useRouter } from 'next/navigation';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from 'next/link';

interface BrainmateMessage {
  id: string;
  role: 'user' | 'brainmate';
  text: string;
  isFollowUp?: boolean;
  timestamp: Date;
  recommendation?: {
    title: string;
    examType: string;
    subject?: string;
    numQuestions: number;
  } | null;
}

const promptMap = [
    // --- Most Specific First (Super Speciality) ---
    { keywords: ['neet ss'], prompts: ["Explain the management of acute STEMI.", "What are the latest advancements in cardiothoracic surgery?", "Describe the pathophysiology of Alzheimer's disease.", "What are the treatment options for metastatic lung cancer?"] },
    { keywords: ['neet pg', 'ini cet'], prompts: ["Differentiate between Crohn's disease and Ulcerative Colitis.", "What is the mechanism of action of Metformin?", "Describe the management of a patient with diabetic ketoacidosis.", "What are the key features on an ECG for a patient with Wolff-Parkinson-White syndrome?"] },
    { keywords: ['jee advanced'], prompts: ["Explain the concept of hybridization in organic chemistry.", "Derive the formula for the moment of inertia of a solid sphere.", "What is a p-n junction diode and how does it work?", "Solve a complex number problem involving De Moivre's theorem."] },

    // --- Specific High-Level Exam Categories ---
    { keywords: ['ibps po', 'sbi po', 'ibps clerk', 'sbi clerk', 'rbi grade b', 'rbi assistant', 'banking', 'bank po', 'bank clerk'], prompts: ["Explain the concept of Compound Interest.", "How do you solve a circular seating arrangement puzzle?", "What is the difference between CRR and SLR in banking?", "Explain the concept of 'para jumbles' in English sections."] },
    { keywords: ['ssc cgl', 'ssc chsl', 'ssc je', 'ssc mts', 'ssc cpo'], prompts: ["What are the different types of Writs in the Indian Constitution?", "How do you solve Time and Work problems efficiently?", "Explain the difference between Active and Passive voice with examples.", "Who was the first Governor-General of Bengal?"] },
    { keywords: ['nda', 'cds', 'afcat', 'defence'], prompts: ["What is the difference between a cruise missile and a ballistic missile?", "Explain the principle of RADAR.", "Describe the significance of the Battle of Plassey.", "What are the major mountain ranges in India?"] },
    { keywords: ['upsc', 'cse', 'ias', 'psc', 'history', 'polity', 'geography', 'economy', 'civil services'], prompts: [ "What were the main features of the Indus Valley Civilization?", "Explain the basic structure doctrine of the Indian Constitution.", "What is the role of the RBI in the Indian economy?", "Describe the process of the Indian monsoon." ] },
    { keywords: ['cat', 'management', 'mba', 'xat', 'snap', 'nmat', 'cmat', 'mat', 'iift'], prompts: [ "What is Porter's Five Forces model?", "Explain the difference between marketing and sales.", "What is a balance sheet?", "Explain the concept of supply and demand." ] },
    { keywords: ['law', 'clat', 'ailet', 'judicial', 'slat', 'lsat'], prompts: [ "What is the difference between a civil and a criminal case?", "Explain the concept of 'habeas corpus'.", "What are fundamental rights in the Indian Constitution?", "Describe the hierarchy of courts in India." ] },

    // --- General Streams ---
    { keywords: ['neet', 'medical', 'bds', 'mbbs', 'nursing', 'biology', 'b.v.sc', 'fmge', 'aiapget'], prompts: ["Describe the process of DNA replication.", "What is the function of the mitochondria?", "Explain the human digestive system.", "What are the key differences between mitosis and meiosis?"] },
    { keywords: ['jee main', 'jee', 'engineering', 'b.tech', 'physics', 'chemistry', 'maths', 'bitsat', 'viteee', 'srmjee', 'met', 'comedk', 'kiitee', 'wbjee', 'mht cet', 'gujcet', 'eamcet', 'kcet', 'gate'], prompts: [ "Explain Ohm's Law with an analogy.", "What is the difference between series and parallel circuits?", "How does a 4-stroke engine work?", "Explain the concept of chemical equilibrium." ] },
    { keywords: ['design', 'nid', 'nift', 'uceed', 'b.arch', 'nata'], prompts: [ "What are the principles of good design?", "Explain the difference between UX and UI.", "What is 'kerning' in typography?", "Describe the concept of a color wheel." ] },
    { keywords: ['commerce', 'ca', 'cs', 'cma', 'accounts'], prompts: [ "What are Golden Rules of Accounting?", "Explain the concept of 'double-entry' bookkeeping.", "What is a balance sheet?", "Differentiate between equity and debt." ] },
    
    // --- School Level ---
    { keywords: ['class 12', '12th'], prompts: [ "Explain Gauss's Law in electrostatics.", "What is a 'p-n junction' and how does it work?", "Explain the structure of DNA.", "What are the main functions of the Reserve Bank of India (RBI)?" ] },
    { keywords: ['class 11', '11th'], prompts: [ "Explain projectile motion with an example.", "What is the significance of Avogadro's number?", "Describe the functions of different parts of a flower.", "What is a 'ledger' in accounting?" ] },
    { keywords: ['class 10', '10th'], prompts: [ "Explain the significance of the Dandi March.", "What is the difference between metals and non-metals?", "Explain Pythagoras' theorem with an example.", "How does democratic decentralization work in India?" ] },
    { keywords: ['class 9', '9th'], prompts: [ "Why is the cell called the structural and functional unit of life?", "What is the law of conservation of mass?", "Describe the different types of tissues in animals.", "Explain the difference between speed and velocity." ] },
    { keywords: ['class 8', 'class 7', 'class 6'], prompts: [ "What is a food chain? Give an example.", "Explain how to find the area of a rectangle.", "What are the different states of matter?", "Why do we need a Parliament?" ] },
    { keywords: ['class 1', 'class 2', 'class 3', 'class 4', 'class 5', 'primary school'], prompts: [ "What is the water cycle?", "Explain the difference between living and non-living things.", "How do plants make their food?", "What is a noun?" ] },
    { keywords: ['nursery', 'lkg', 'ukg'], prompts: [ "What sound does the letter 'A' make?", "Count the number of apples in the picture.", "What color is the sun?", "What is your name?" ] },
];

const getPromptsForTopic = (topic: string): string[] => {
    const defaultPrompts = [ "What is photosynthesis?", "Explain Newton's laws of motion.", "Why is the sky blue?", "How does an electric motor work?" ];
    if (!topic) {
        return defaultPrompts;
    }
    const lowerTopic = topic.toLowerCase();

    for (const entry of promptMap) {
        if (entry.keywords.some(k => lowerTopic.includes(k))) {
            return entry.prompts;
        }
    }
    
    // Fallback if no specific match is found
    return defaultPrompts;
};


const schoolClasses = [
    { name: "Class 6" }, { name: "Class 7" }, { name: "Class 8" }, { name: "Class 9" }, { name: "Class 10" }, { name: "Class 11" }, { name: "Class 12" },
];

const examCategories = [
  { name: 'JEE Main' }, { name: 'JEE Advanced' }, { name: 'BITSAT' }, { name: 'VITEEE' }, { name: 'SRMJEEE' }, { name: 'MET (Manipal)' }, { name: 'COMEDK UGET' }, { name: 'KIITEE' }, { name: 'WBJEE' }, { name: 'MHT CET (Engineering)' }, { name: 'GUJCET' }, { name: 'AP EAMCET (Engineering)' }, { name: 'TS EAMCET (Engineering)' }, { name: 'KCET (Engineering)' }, { name: 'GATE (for PG/PSU)' },
  { name: 'NEET UG (MBBS, BDS, AYUSH, B.V.Sc)' }, { name: 'NEET PG (MD, MS, PG Diploma)' }, { name: 'INI CET (AIIMS, JIPMER, PGIMER, NIMHANS)' }, { name: 'NEET SS (DM, MCh)' }, { name: 'FMGE' }, { name: 'AIIMS Nursing' }, { name: 'Indian Army B.Sc Nursing / MNS' }, { name: 'AIAPGET (PG AYUSH)' },
  { name: 'CAT' }, { name: 'XAT' }, { name: 'CMAT' }, { name: 'SNAP' }, { name: 'NMAT by GMAC' }, { name: 'MAT' }, { name: 'ATMA' }, { name: 'IIFT' }, { name: 'TISSNET (check latest)' }, { name: 'IBSAT' }, { name: 'MICAT' }, { name: 'GMAT (for Indian B-schools)' },
  { name: 'CLAT (UG & PG)' }, { name: 'AILET (UG & PG)' }, { name: 'LSAT India' }, { name: 'SLAT' }, { name: 'MH CET Law' }, { name: 'AP LAWCET' }, { name: 'TS LAWCET' }, { name: 'Kerala KLEE' }, { name: 'State Judicial Services (PCS-J)' },
  { name: 'UPSC CSE (IAS, IPS, etc.)' }, { name: 'UPSC IFoS' }, { name: 'UPSC ESE/IES' }, { name: 'UPSC Combined Geo-Scientist' }, { name: 'UPSC CMS' }, { name: 'UPSC CAPF' }, { name: 'SSC CGL' }, { name: 'SSC CHSL' }, { name: 'SSC JE' }, { name: 'SSC Stenographer' }, { name: 'SSC MTS' }, { name: 'SSC GD Constable' }, { name: 'SSC CPO' }, { name: 'IBPS PO' }, { name: 'IBPS Clerk' }, { name: 'IBPS SO' }, { name: 'IBPS RRB' }, { name: 'SBI PO' }, { name: 'SBI Clerk' }, { name: 'SBI SO' }, { name: 'RBI Grade B' }, { name: 'RBI Assistant' }, { name: 'NABARD Grade A & B' }, { name: 'LIC AAO / ADO' }, { name: 'UIIC/NIACL/Other Insurance' }, { name: 'ESIC / FCI' }, { name: 'RRB NTPC' }, { name: 'RRB JE' }, { name: 'RRB ALP' }, { name: 'RRB Group D' }, { name: 'State PSCs (General)' }, { name: 'State Level Police Recruitment' }, { name: 'High Court Exams' },
  { name: 'NDA & NA' }, { name: 'CDS' }, { name: 'AFCAT' }, { name: 'INET' }, { name: 'Indian Army TES' }, { name: 'Indian Navy Sailors (SSR, AA, MR)' }, { name: 'Indian Air Force Airmen (Group X & Y)' }, { name: 'Indian Coast Guard (Navik, Yantrik)' }, { name: 'Territorial Army' },
  { name: 'CUET UG' }, { name: 'CUET PG' }, { name: 'JMI Entrance' }, { name: 'AMU Entrance' },
  { name: 'NID DAT' }, { name: 'UCEED / CEED' }, { name: 'NIFT Entrance' }, { name: 'NATA' }, { name: 'JEE Main Paper 2 (B.Arch/B.Plan)' }, { name: 'AIEED' },
  { name: 'NCHM JEE' }, { name: 'State IHM Entrances' },
  { name: 'ICAR AIEEA (UG, PG, PhD)' }, { name: 'State Agriculture University Entrances' },
  { name: 'CTET' }, { name: 'State TETs' }, { name: 'UGC NET' }, { name: 'CSIR UGC NET' }, { name: 'SET / SLET' }, { name: 'KVS / NVS / DSSSB' }, { name: 'B.Ed. Entrances' },
  { name: 'GPAT' }, { name: 'State CETs for B.Pharm' }, { name: 'NIPER JEE' },
  { name: 'Research Fellowships & PhD Entrance' },
  { name: 'CA (Foundation, Inter, Final)' }, { name: 'CS (CSEET, Executive, Professional)' }, { name: 'CMA (Foundation, Inter, Final)' },
  { name: 'NTSE' }, { name: 'KVPY (check status)' }, { name: 'SOF Olympiads (NSO, IMO, IEO, etc.)' }, { name: 'Homi Bhabha Balvaidnyanik Spardha' },
];


export default function BrainmatePage() {
  const router = useRouter();
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<BrainmateMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTopic, setCurrentTopic] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [profileData, setProfileData] = useState<ProfileFormData | null>(null);

  const examplePrompts = useMemo(() => getPromptsForTopic(currentTopic), [currentTopic]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedProfile = localStorage.getItem('userProfileData');
      if (storedProfile) {
        const parsedProfile = JSON.parse(storedProfile) as ProfileFormData;
        setProfileData(parsedProfile);
        // Pre-fill topic if available from profile
        if(parsedProfile.examTarget) {
            setCurrentTopic(parsedProfile.examTarget);
        } else if (parsedProfile.className) {
            setCurrentTopic(`Class ${parsedProfile.className}`);
        }
      }
    }
    setMessages([
      {
        id: 'brainmate-initial',
        role: 'brainmate',
        text: "Hello! I am OSO Brainmate™. Ask me to explain any concept, and I'll break it down for you in a simple way!",
        timestamp: new Date(),
      }
    ]);
  }, []);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = async (e?: FormEvent, queryOverride?: string) => {
    if (e) e.preventDefault();
    const finalQuery = queryOverride || inputValue;
    const trimmedInput = finalQuery.trim();

    if (!trimmedInput || isLoading) return;
    if (!currentTopic.trim()) {
        toast({ title: "Topic Missing", description: "Please select your subject or topic first.", variant: "destructive" });
        return;
    }

    const userMessage: BrainmateMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: trimmedInput,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    
    if(!queryOverride) {
        setInputValue('');
    }
    
    setIsLoading(true);

    const brainmateInput: BrainmateInput = {
      studentQuery: trimmedInput,
      studentClass: profileData?.className,
      studentBoard: profileData?.board,
      currentTopic: currentTopic,
    };

    try {
      const response = await askBrainmate(brainmateInput);

      const explanationMessage: BrainmateMessage = {
        id: `brainmate-exp-${Date.now()}`,
        role: 'brainmate',
        text: response.explanation,
        timestamp: new Date(),
        recommendation: response.recommendedTest || null,
      };
      const followUpMessage: BrainmateMessage = {
        id: `brainmate-fol-${Date.now()}`,
        role: 'brainmate',
        text: response.followUpQuestion,
        isFollowUp: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, explanationMessage, followUpMessage]);

    } catch (error: any) {
      console.error("Brainmate UI: Error encountered:", error);
      const errorResponse: BrainmateMessage = {
        id: `brainmate-error-${Date.now()}`,
        role: 'brainmate',
        text: error.message || "I'm having a little trouble thinking. Please try asking again in a moment.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePromptClick = (prompt: string) => {
    if (!currentTopic.trim()) {
        toast({ title: "Topic Missing", description: "Please enter the subject or topic you're studying first.", variant: "destructive" });
        return;
    }
    handleSubmit(undefined, prompt);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-4rem)] max-h-[700px] bg-background rounded-lg shadow-xl border">
      <header className="p-4 border-b text-center bg-card rounded-t-lg">
        <div className="flex items-center justify-center space-x-2 relative">
            <Button variant="ghost" size="icon" className="absolute left-2" onClick={() => router.back()}>
                <ChevronLeft className="h-5 w-5"/>
            </Button>
            <Brain className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-xl font-bold font-headline text-primary">
              <BilingualText en="OSO Brainmate™" hi="OSO ब्रेनमेट™" />
            </h1>
            <p className="text-xs text-muted-foreground">
              <BilingualText en="Your Concept Explainer" hi="आपका कॉन्सेप्ट एक्सप्लेनर" />
            </p>
          </div>
        </div>
        <Select value={currentTopic} onValueChange={setCurrentTopic}>
            <SelectTrigger className="mt-3 h-9">
                <SelectValue placeholder="What's your current subject/topic?" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>School Classes</SelectLabel>
                    {schoolClasses.map(c => <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>)}
                </SelectGroup>
                <SelectGroup>
                    <SelectLabel>Competitive Exams</SelectLabel>
                    {examCategories.map(exam => (
                        <SelectItem key={exam.name} value={exam.name}>{exam.name}</SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
      </header>

      <ScrollArea ref={scrollAreaRef} className="flex-grow overflow-y-auto p-4 space-y-4 bg-muted/20">
        {messages.map((msg) => (
          <div key={msg.id} className={cn("flex flex-col", msg.role === 'user' ? 'items-end' : 'items-start')}>
            <Card
              className={cn(
                "p-3 rounded-lg max-w-[85%] shadow-sm w-fit",
                msg.role === 'user' ? "bg-primary text-primary-foreground self-end ml-auto" : "bg-card text-card-foreground self-start mr-auto border",
                msg.isFollowUp && "bg-accent/10 border-accent/30"
              )}
            >
              {msg.isFollowUp && <p className="text-xs font-semibold mb-1 text-accent flex items-center gap-1.5"><Sparkles size={14}/> Follow-up Question:</p>}
              <p className="text-sm whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
              {msg.recommendation && (
                <div className="mt-3 pt-3 border-t border-primary/20">
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-1.5"><Target size={16} /> Test Your Understanding!</h4>
                    <Button asChild size="sm" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                        <Link href={`/attempt-test?examType=${encodeURIComponent(msg.recommendation.examType)}&subject=${encodeURIComponent(msg.recommendation.subject || '')}&numQuestions=${msg.recommendation.numQuestions}&title=${encodeURIComponent(msg.recommendation.title)}`}>
                            Take a {msg.recommendation.numQuestions}-question quiz
                        </Link>
                    </Button>
                </div>
              )}
            </Card>
          </div>
        ))}
         {messages.length <= 1 && !isLoading && (
            <div className="p-4 pt-0 space-y-3">
                <p className="text-sm text-center text-muted-foreground">Or try one of these examples:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {examplePrompts.map((prompt) => (
                        <Button
                            key={prompt}
                            variant="outline"
                            className="h-auto whitespace-normal text-left justify-start p-3"
                            onClick={() => handlePromptClick(prompt)}
                        >
                            {prompt}
                        </Button>
                    ))}
                </div>
            </div>
        )}
         {isLoading && (
          <div className="flex justify-start">
            <Card className="bg-card text-card-foreground self-start mr-auto p-3 rounded-lg shadow-sm inline-flex items-center space-x-2 border">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground"><BilingualText en="Brainmate is thinking..." hi="ब्रेनमेट सोच रहा है..."/></p>
            </Card>
          </div>
        )}
      </ScrollArea>

      <footer className="p-3 border-t bg-card rounded-b-lg">
        <form onSubmit={(e) => handleSubmit(e)} className="flex items-center space-x-2">
          <Textarea
            placeholder="Ask to explain a concept... e.g., 'What is photosynthesis?'"
            className="flex-grow resize-none min-h-[40px] max-h-[120px] text-sm"
            rows={1}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            disabled={isLoading}
          />
          <Button type="submit" size="icon" className="bg-primary hover:bg-primary/90 text-primary-foreground shrink-0" disabled={isLoading || !inputValue.trim() || !currentTopic.trim()}>
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            <span className="sr-only"><BilingualText en="Send" hi="भेजें"/></span>
          </Button>
        </form>
      </footer>
    </div>
  );
}
