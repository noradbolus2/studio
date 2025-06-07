
"use client";

import { useEffect, useState, type FormEvent, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation'; 

import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { BilingualText } from '@/components/shared/BilingualText';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import { askAiGuruji, type AiGurujiInput, type AiGurujiOutput } from '@/ai/flows/ai-guruji-flow';
import { getTestSeriesRecommendations, type TestSeriesRecommendationInput, type TestSeriesRecommendationOutput } from '@/ai/flows/test-series-recommendation-flow';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'; // Added ScrollBar import
import { Loader2, Send, Target, BookOpen, Brain, Rocket, FileText, Palette, Code2, Edit3, Users2, ShoppingCart, Clock, Truck, Home, SchoolIcon, UploadCloud } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


// Define a type for your service data for better type safety
interface ServiceData {
  name: string;
  type: string; // e.g., "chat_interface", "product_listing", "info_page", "test_recommendation_interface", "interactive_assignment_project_help"
  description?: string;
  data?: {
    redirectTo?: string;
    avatarUrl?: string;
    dataAiHint?: string;
    initialGreetingEn?: string; 
    initialGreetingHi?: string; 
    content?: string;
    category?: string; // For product_listing, to pre-filter
  };
}

const INFO_PREFIX = "INFO:";

interface ServiceChatMessage {
  id: string;
  role: 'user' | 'guru';
  text: string; 
  timestamp: Date;
}

type ServicePageParams = {
  serviceId: string;
};

// Mock data for the new interactive assignment/project help
const projectTypes = [
  { id: "homework", label: "School Homework", icon: Edit3 },
  { id: "science_model", label: "Working Science Model", icon: Brain },
  { id: "art_work", label: "Art/Poster/Chart Work", icon: Palette },
  { id: "coding_project", label: "Coding Project", icon: Code2 },
  { id: "essay", label: "Essay or Research Assignment", icon: FileText },
  { id: "ai_idea", label: "Custom AI-Generated Idea", icon: Rocket },
  { id: "creator_made", label: "Get it made by a Creator", icon: Users2 }
];

const classes = ["Nursery", "LKG", "UKG", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "Competitive Exams"];
const subjects = ["Maths", "Science", "English", "Social Studies", "Hindi", "Physics", "Chemistry", "Biology", "Computer Science", "Art", "General Knowledge", "Current Affairs"];


export default function ServicePage() {
  const routeParams = useParams<ServicePageParams>(); 
  const serviceId = routeParams?.serviceId;
  const router = useRouter();

  const [serviceData, setServiceData] = useState<ServiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // For chat_interface type
  const [servicePageChatInputValue, setServicePageChatInputValue] = useState('');
  const [servicePageChatMessages, setServicePageChatMessages] = useState<ServiceChatMessage[]>([]);
  const [servicePageChatIsLoading, setServicePageChatIsLoading] = useState(false);
  const servicePageChatScrollAreaRef = useRef<HTMLDivElement>(null);

  // For test_recommendation_interface type
  const [testRecommendations, setTestRecommendations] = useState<TestSeriesRecommendationOutput | null>(null);
  const [isTestRecommendationLoading, setIsTestRecommendationLoading] = useState(false);
  const [testRecommendationError, setTestRecommendationError] = useState<string | null>(null);

  // For interactive_assignment_project_help
  const [projectClass, setProjectClass] = useState('');
  const [projectSubject, setProjectSubject] = useState('');
  const [projectType, setProjectType] = useState('');
  const [buildOption, setBuildOption] = useState('self');
  const [materialsOption, setMaterialsOption] = useState('no');
  const [showAiPlan, setShowAiPlan] = useState(false);
  const [isAiPlanLoading, setIsAiPlanLoading] = useState(false);


  useEffect(() => {
    if (serviceId) {
      const fetchServiceData = async () => {
        setLoading(true);
        setError(null);
        setIsRedirecting(false); 
        setServicePageChatMessages([]); 
        setTestRecommendations(null);
        setTestRecommendationError(null);
        setShowAiPlan(false); // Reset AI plan visibility

        try {
          console.log(`Fetching mock data for serviceId: ${serviceId}`);
          await new Promise(resolve => setTimeout(resolve, 300)); 
          const mockData: { [key: string]: ServiceData } = {
            elibrary: { name: "E-Library", type: "books_list_page", description: "Access NCERT and reference books.", data: { redirectTo: "/class-6-12-books" } },
            guruji: { name: "AI Guruji", type: "chat_interface", description: "Your personal AI study assistant.", data: { avatarUrl: "https://placehold.co/100x100.png", dataAiHint: "monk teaching", initialGreetingEn: "Namaste! How can I help you today on this page?"}},
            stationery: { name: "Stationery", type: "product_listing", description: "Order pens, notebooks, and more.", data: { redirectTo: "/delivery", category: "stationery_essentials", avatarUrl: "https://placehold.co/100x100.png?text=🛍️", dataAiHint:"stationery bag" }},
            projects: { name: "Projects", type: "interactive_assignment_project_help", description: "Get AI-powered help for your school projects.", data: { avatarUrl: "https://placehold.co/100x100.png?text=🛠️", dataAiHint:"tools project" }},
            assignments: { name: "Assignments", type: "interactive_assignment_project_help", description: "AI assistance for completing your assignments.", data: { avatarUrl: "https://placehold.co/100x100.png?text=📝", dataAiHint:"writing assignment" }},
            testseries: { name: "Test Series", type: "test_recommendation_interface", description: "Get personalized test recommendations from AI Guruji.", data: { avatarUrl: "https://placehold.co/100x100.png", dataAiHint: "guru exam"}},
            uniforms: {
              name: "Uniforms",
              type: "info_page",
              description: "Find and order school uniforms.",
              data: {
                content: "Welcome to the Uniforms section! Here you can find information about school uniforms available through OSO App.\n\nWe are working with local vendors to bring you a wide selection of school-specific uniforms, including shirts, trousers, skirts, blazers, and sports attire.\n\nCurrently, online ordering for uniforms is under development. Please check back soon or contact your school's preferred vendor for purchases.\n\nKey features coming soon:\n- Browse by school\n- Size charts and guides\n- Secure online payment\n- Home delivery options"
              }
            },
          };

          if (mockData[serviceId]) {
            const fetchedData = mockData[serviceId];
            setServiceData(fetchedData);
            if (fetchedData.type === 'chat_interface' && fetchedData.data?.initialGreetingEn) {
              setServicePageChatMessages([{ 
                id: `guru-initial-${Date.now()}`, 
                role: 'guru', 
                text: fetchedData.data.initialGreetingEn, 
                timestamp: new Date() 
              }]);
            }
          } else {
             setError(`${INFO_PREFIX}Content not available yet for the '${serviceId}' service. Please ensure it is configured in Firestore or mock data.`);
             setServiceData(null);
          }

        } catch (err) {
          console.error("Error fetching service data:", err);
          setError("Failed to load content. Please try again."); 
          setServiceData(null);
        } finally {
          setLoading(false);
        }
      };

      fetchServiceData();
    }
  }, [serviceId]);
  
  useEffect(() => {
    if (servicePageChatScrollAreaRef.current) {
      servicePageChatScrollAreaRef.current.scrollTo({ top: servicePageChatScrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [servicePageChatMessages]);

  useEffect(() => {
    if (serviceData?.data?.redirectTo && !loading && router) {
      console.log(`[ServicePage] Redirecting to: ${serviceData.data.redirectTo} for service: ${serviceId}`);
      setIsRedirecting(true);
      router.push(serviceData.data.redirectTo);
    } else {
      setIsRedirecting(false);
    }
  }, [serviceData, loading, router, serviceId]);


  const handleServicePageChatSubmit = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    const trimmedInput = servicePageChatInputValue.trim();
    if (!trimmedInput || servicePageChatIsLoading) return;

    const userMessage: ServiceChatMessage = {
      id: `user-service-${Date.now()}`,
      role: 'user',
      text: trimmedInput,
      timestamp: new Date(),
    };
    setServicePageChatMessages(prev => [...prev, userMessage]);
    setServicePageChatInputValue('');
    setServicePageChatIsLoading(true);

    try {
      const gurujiInput: AiGurujiInput = { userInput: trimmedInput };
      const response = await askAiGuruji(gurujiInput);
      
      if (!response || typeof response.responseText !== 'string' || !response.respondedInLanguage) {
        const errorResponse: ServiceChatMessage = {
          id: `guru-service-error-structure-${Date.now()}`,
          role: 'guru',
          text: "I had a slight issue formulating my thoughts. Could you try asking differently?",
          timestamp: new Date(),
        };
        setServicePageChatMessages(prev => [...prev, errorResponse]);
        return;
      }

      const guruResponse: ServiceChatMessage = {
        id: `guru-service-${Date.now()}`,
        role: 'guru',
        text: response.responseText,
        timestamp: new Date(),
      };
      setServicePageChatMessages(prev => [...prev, guruResponse]);

    } catch (error) {
      console.error("Service Page Chat Error:", error);
      const errorResponse: ServiceChatMessage = {
        id: `guru-service-error-catch-${Date.now()}`,
        role: 'guru',
        text: "Sorry, an unexpected hiccup occurred. Please try again.",
        timestamp: new Date(),
      };
      setServicePageChatMessages(prev => [...prev, errorResponse]);
    } finally {
      setServicePageChatIsLoading(false);
    }
  };

  const handleGetTestRecommendations = async () => {
    setIsTestRecommendationLoading(true);
    setTestRecommendationError(null);
    setTestRecommendations(null);

    // Mock input for demonstration
    const mockStudentInput: TestSeriesRecommendationInput = {
        studentName: "Aarav",
        examType: "NEET UG",
        preferredLanguage: 'en', // Default to English for this UI
        lastTestPerformances: [
            { title: "Biology Mock 1", score: "120/180", weakTopics: ["Genetics", "Plant Physiology"] },
            { title: "Physics Sectional - Mechanics", score: "60/100", weakTopics: ["Rotational Motion", "Work Energy Power"] },
            { title: "Chemistry Full Syllabus Test 1", score: "90/180", weakTopics: ["Organic Chemistry Reactions", "Chemical Bonding"] }
        ],
        availableTestSets: [
            { title: "NEET Full Syllabus Mock Test Series (Set A)", subject: "All", level: "Medium" },
            { title: "NEET Biology - Genetics Special", subject: "Biology", level: "Hard" },
            { title: "NEET Physics - Mechanics Booster", subject: "Physics", level: "Medium" },
            { title: "NEET Chemistry - Organic Mastery", subject: "Chemistry", level: "Tough" },
            { title: "JEE Advanced Physics Challenge", subject: "Physics", level: "Very Hard"},
        ]
    };

    try {
        const result = await getTestSeriesRecommendations(mockStudentInput);
        setTestRecommendations(result);
    } catch (err: any) {
        console.error("Error getting test recommendations:", err);
        setTestRecommendationError(err.message || "Failed to get recommendations. AI Guruji might be busy.");
    } finally {
        setIsTestRecommendationLoading(false);
    }
  };

  const handleAskGurujiForProjectPlan = async () => {
    if (!projectClass || !projectSubject || !projectType) {
        // Basic validation
        alert("Please select Class, Subject, and Type of Help.");
        return;
    }
    setIsAiPlanLoading(true);
    // Simulate AI call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setShowAiPlan(true);
    setIsAiPlanLoading(false);
  };


  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
        <LoadingSpinner size={48} />
        <p className="mt-4 text-muted-foreground">
          <BilingualText en="Loading content..." hi="सामग्री लोड हो रही है..." />
        </p>
      </div>
    );
  }

  if (isRedirecting && serviceData?.data?.redirectTo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
        <LoadingSpinner size={48} />
        <p className="mt-4 text-muted-foreground">
          <BilingualText 
            en={`Redirecting to ${serviceData.name}...`} 
            hi={`${serviceData.name} पर रीडायरेक्ट किया जा रहा है...`} 
          />
        </p>
      </div>
    );
  }


  if (error && !serviceData) {
    const isInfoError = error.startsWith(INFO_PREFIX);
    const displayMessage = isInfoError ? error.substring(INFO_PREFIX.length) : error;
    
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] p-4">
        <Alert variant={isInfoError ? "default" : "destructive"} className="max-w-md text-center">
          <AlertTitle>
            {isInfoError ? (
              <BilingualText en="Content Information" hi="सामग्री जानकारी" />
            ) : (
              <BilingualText en="Error" hi="त्रुटि" />
            )}
          </AlertTitle>
          <AlertDescription>{displayMessage}</AlertDescription>
        </Alert>
         <Button asChild variant="outline" className="mt-4">
            <Link href="/">
                <BilingualText en="Go to Home" hi="होम पर जाएं"/>
            </Link>
        </Button>
      </div>
    );
  }
  
  if (!serviceData) { 
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] p-4">
        <Alert className="max-w-md text-center">
          <AlertTitle><BilingualText en="Content Unavailable" hi="सामग्री अनुपलब्ध" /></AlertTitle>
          <AlertDescription>
            <BilingualText 
              en={`The content for "${serviceId}" could not be loaded. Please check back later.`} 
              hi={`"${serviceId || 'this service'}" के लिए सामग्री लोड नहीं की जा सकी। कृपया बाद में देखें।`} />
          </AlertDescription>
        </Alert>
        <Button asChild variant="outline" className="mt-4">
            <Link href="/">
                <BilingualText en="Go to Home" hi="होम पर जाएं"/>
            </Link>
        </Button>
      </div>
    );
  }

  const renderServiceContent = () => {
    if (serviceData.data?.redirectTo) {
       return (
            <div className="text-center py-10">
              <LoadingSpinner size={32} />
              <p className="mt-2 text-muted-foreground">
                <BilingualText 
                    en={`Preparing to go to ${serviceData.name}...`} 
                    hi={`${serviceData.name} पर जाने की तैयारी हो रही है...`} 
                />
              </p>
            </div>
        );
    }

    switch (serviceData.type) {
      case 'chat_interface':
        return (
          <div className="flex flex-col h-[calc(100vh-10rem)] md:h-[calc(100vh-8rem)] max-h-[700px] bg-background rounded-lg shadow-xl border">
            <header className="p-4 border-b text-center bg-card rounded-t-lg">
              <div className="flex items-center justify-center space-x-3">
                {serviceData.data?.avatarUrl && (
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={serviceData.data.avatarUrl} alt={serviceData.name} data-ai-hint={serviceData.data?.dataAiHint || "avatar"} />
                    <AvatarFallback>{serviceData.name.substring(0,2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                )}
                <div>
                  <h2 className="text-xl font-bold font-headline text-primary">
                    <BilingualText en={serviceData.name} hi={serviceData.name} /> 
                  </h2>
                  {serviceData.description && (
                    <p className="text-xs text-muted-foreground">
                      <BilingualText en={serviceData.description} hi={serviceData.description} />
                    </p>
                  )}
                </div>
              </div>
            </header>

            <ScrollArea ref={servicePageChatScrollAreaRef} className="flex-grow overflow-y-auto p-4 space-y-4 bg-muted/20">
              {servicePageChatMessages.map((msg) => (
                <Card
                    key={msg.id}
                    className={cn(
                    "p-3 rounded-lg max-w-[80%] sm:max-w-[70%] shadow-sm",
                    msg.role === 'user' ? "bg-primary text-primary-foreground self-end ml-auto" : "bg-card text-card-foreground self-start mr-auto border"
                    )}
                >
                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                </Card>
              ))}
              {servicePageChatIsLoading && (
                <div className="flex justify-start">
                    <Card className="bg-card text-card-foreground self-start mr-auto p-3 rounded-lg shadow-sm inline-flex items-center space-x-2 border">
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                        <p className="text-sm text-muted-foreground"><BilingualText en="AI Guruji is pondering..." hi="एआई गुरुजी विचार कर रहे हैं..."/></p>
                    </Card>
                </div>
              )}
            </ScrollArea>

            <footer className="p-3 border-t bg-card rounded-b-lg">
              <form onSubmit={handleServicePageChatSubmit} className="flex items-center space-x-2">
                <Textarea 
                  value={servicePageChatInputValue}
                  onChange={(e) => setServicePageChatInputValue(e.target.value)}
                  placeholder_en="Ask anything..."
                  placeholder_hi="कुछ भी पूछें..."
                  className="flex-grow resize-none min-h-[40px] max-h-[120px] text-sm"
                  rows={1}
                  disabled={servicePageChatIsLoading}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleServicePageChatSubmit();
                    }
                  }}
                />
                <Button type="submit" size="icon" className="bg-primary hover:bg-primary/90 text-primary-foreground shrink-0" disabled={servicePageChatIsLoading || !servicePageChatInputValue.trim()}>
                  {servicePageChatIsLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                  <span className="sr-only"><BilingualText en="Send" hi="भेजें"/></span>
                </Button>
              </form>
            </footer>
          </div>
        );

      case 'test_recommendation_interface':
        return (
            <Card className="w-full">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        {serviceData.data?.avatarUrl && (
                        <Avatar className="h-12 w-12 border-2 border-primary">
                            <AvatarImage src={serviceData.data.avatarUrl} alt={serviceData.name} data-ai-hint={serviceData.data.dataAiHint || "avatar"} />
                            <AvatarFallback>{serviceData.name.substring(0,1)}G</AvatarFallback>
                        </Avatar>
                        )}
                        <div>
                            <CardTitle className="text-xl font-headline text-primary">AI Test Advisor</CardTitle>
                            <CardDescription>Get smart test recommendations from OSO Guruji.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {!testRecommendations && !isTestRecommendationLoading && (
                        <p className="text-sm text-muted-foreground text-center py-4">
                            Click the button below to get personalized test series suggestions based on a sample student profile.
                        </p>
                    )}
                    {isTestRecommendationLoading && (
                        <div className="flex flex-col items-center justify-center p-6 space-y-3">
                            <LoadingSpinner size={32}/>
                            <p className="text-muted-foreground">AI Guruji is analyzing and preparing recommendations...</p>
                        </div>
                    )}
                    {testRecommendationError && (
                        <Alert variant="destructive">
                            <AlertTitle>Recommendation Error</AlertTitle>
                            <AlertDescription>{testRecommendationError}</AlertDescription>
                        </Alert>
                    )}
                    {testRecommendations && (
                        <div className="space-y-6">
                            <Card className="bg-muted/30 p-4">
                                <h3 className="text-lg font-semibold text-primary mb-2 font-headline flex items-center gap-2">
                                    <Rocket size={20} /> Guruji's Advice
                                </h3>
                                <p className="text-sm whitespace-pre-wrap">{testRecommendations.gurujiAdvice}</p>
                            </Card>
                            
                            {testRecommendations.recommendedTests.length > 0 && (
                                <div>
                                    <h4 className="text-md font-semibold mb-3 flex items-center gap-2">
                                       <FileText size={18}/> Recommended Tests for You:
                                    </h4>
                                    <div className="space-y-3">
                                        {testRecommendations.recommendedTests.map((test, index) => (
                                            <Card key={index} className="overflow-hidden border hover:shadow-md transition-shadow">
                                                <CardHeader className="p-3 bg-card">
                                                    <CardTitle className="text-md font-semibold text-primary flex items-center gap-2">
                                                        <Target size={18}/> {test.title}
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="p-3 text-xs text-muted-foreground">
                                                    <p className="mb-2">{test.reason}</p>
                                                </CardContent>
                                                 <CardFooter className="p-3 bg-card border-t">
                                                     <Button asChild size="sm" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                                                        <Link href={`/attempt-test?title=${encodeURIComponent(test.title)}`}>
                                                            Attempt Test
                                                        </Link>
                                                    </Button>
                                                </CardFooter>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex-col space-y-3">
                    <Button 
                        onClick={handleGetTestRecommendations} 
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" 
                        disabled={isTestRecommendationLoading}
                    >
                        {isTestRecommendationLoading ? <LoadingSpinner size={20}/> : 
                           "Ask Guruji for Recommendations"
                        }
                    </Button>
                </CardFooter>
            </Card>
        );

      case 'interactive_assignment_project_help':
        return (
            <Card className="w-full">
                <CardHeader>
                     <div className="flex items-center gap-3">
                        {serviceData.data?.avatarUrl && (
                        <Avatar className="h-12 w-12 border-2 border-primary">
                            <AvatarImage src={serviceData.data.avatarUrl} alt={serviceData.name} data-ai-hint={serviceData.data.dataAiHint || "avatar"} />
                            <AvatarFallback>{serviceData.name.substring(0,1)}G</AvatarFallback>
                        </Avatar>
                        )}
                        <div>
                            <CardTitle className="text-xl font-headline text-primary">
                                <BilingualText en={`${serviceData.name} Assistant`} hi={`${serviceData.name} सहायक`} />
                            </CardTitle>
                            <CardDescription>
                                <BilingualText en="Let Guruji AI help you plan and execute!" hi="गुरुजी एआई को आपकी योजना बनाने और निष्पादित करने में मदद करने दें!" />
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="projectClass"><BilingualText en="Your Class" hi="आपकी कक्षा" /></Label>
                             <Select value={projectClass} onValueChange={setProjectClass}>
                                <SelectTrigger id="projectClass"><SelectValue placeholder={<BilingualText en="Select Class" hi="कक्षा चुनें"/>}/></SelectTrigger>
                                <SelectContent>
                                    {classes.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="projectSubject"><BilingualText en="Subject" hi="विषय" /></Label>
                            <Select value={projectSubject} onValueChange={setProjectSubject}>
                                <SelectTrigger id="projectSubject"><SelectValue placeholder={<BilingualText en="Select Subject" hi="विषय चुनें"/>}/></SelectTrigger>
                                <SelectContent>
                                    {subjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div>
                        <Label><BilingualText en="Type of Help Needed" hi="आवश्यक सहायता का प्रकार" /></Label>
                        <ScrollArea className="w-full whitespace-nowrap py-2">
                            <div className="flex space-x-2">
                            {projectTypes.map((type) => (
                                <Button
                                key={type.id}
                                variant={projectType === type.id ? "default" : "outline"}
                                size="sm"
                                className="h-auto p-2 flex flex-col items-center justify-center space-y-1 w-24 h-24"
                                onClick={() => setProjectType(type.id)}
                                >
                                <type.icon className="h-6 w-6 mb-1" />
                                <span className="text-xs text-center whitespace-normal leading-tight">{type.label}</span>
                                </Button>
                            ))}
                            </div>
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label><BilingualText en="How to proceed?" hi="कैसे आगे बढ़ें?" /></Label>
                            <RadioGroup value={buildOption} onValueChange={setBuildOption} className="mt-1 space-y-1">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="self" id="self" />
                                    <Label htmlFor="self" className="font-normal"><BilingualText en="Build it myself" hi="मैं खुद बनाऊंगा/बनाऊंगी" /></Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="creator" id="creator" />
                                    <Label htmlFor="creator" className="font-normal"><BilingualText en="Get it made by OSO Creator" hi="OSO क्रिएटर से बनवाएं" /></Label>
                                </div>
                            </RadioGroup>
                        </div>
                        <div>
                            <Label><BilingualText en="Need Materials Delivered?" hi="सामग्री की डिलीवरी चाहिए?" /></Label>
                             <RadioGroup value={materialsOption} onValueChange={setMaterialsOption} className="mt-1 space-y-1">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="yes" id="mat_yes" />
                                    <Label htmlFor="mat_yes" className="font-normal"><BilingualText en="Yes, list and order" hi="हां, सूची बनाएं और ऑर्डर करें" /></Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="no" id="mat_no" />
                                    <Label htmlFor="mat_no" className="font-normal"><BilingualText en="No, I have them" hi="नहीं, मेरे पास हैं" /></Label>
                                </div>
                            </RadioGroup>
                        </div>
                    </div>

                    <Button onClick={handleAskGurujiForProjectPlan} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isAiPlanLoading}>
                        {isAiPlanLoading ? <LoadingSpinner /> : <Rocket className="mr-2" />}
                        <BilingualText en="Ask Guruji AI for Ideas & Plan" hi="गुरुजी एआई से विचार और योजना पूछें" />
                    </Button>

                    {showAiPlan && (
                        <Card className="mt-6 bg-muted/50 p-4">
                            <h3 className="text-lg font-semibold text-primary mb-3 font-headline flex items-center">
                                <Brain className="mr-2"/> <BilingualText en="Guruji AI's Plan" hi="गुरुजी एआई की योजना" />
                            </h3>
                            <div className="space-y-3 text-sm">
                                <p><strong className="font-medium"><BilingualText en="🧪 Project Idea (Class 8 – Science)" hi="🧪 प्रोजेक्ट आइडिया (कक्षा 8 - विज्ञान)" />:</strong> <BilingualText en="Working Model of Hydraulic Lift" hi="हाइड्रोलिक लिफ्ट का वर्किंग मॉडल" /></p>
                                <p><strong className="font-medium">📦 <BilingualText en="You need" hi="आपको चाहिए" />:</strong> <BilingualText en="2 syringes, plastic tube, cardboard, fevicol" hi="2 सिरिंज, प्लास्टिक ट्यूब, कार्डबोर्ड, फेविकोल" /></p>
                                <p><strong className="font-medium"><Clock className="inline mr-1" size={16}/> <BilingualText en="Estimated Time" hi="अनुमानित समय" />:</strong> <BilingualText en="2 hours" hi="2 घंटे" /></p>
                                
                                {materialsOption === 'yes' && (
                                    <Button variant="outline" size="sm" className="w-full mt-2">
                                        <ShoppingCart className="mr-2" size={16}/> <BilingualText en="Add all materials to cart from OSO Store" hi="सभी सामग्री OSO स्टोर से कार्ट में डालें" />
                                    </Button>
                                )}
                                {buildOption === 'creator' && (
                                    <Card className="p-3 mt-2 border-accent bg-accent/10">
                                        <p className="text-sm font-medium text-accent-foreground">🧑‍🎨 <BilingualText en="Want this project made by our Top Student Creator (₹99) and delivered in 2 days?" hi="क्या आप यह प्रोजेक्ट हमारे शीर्ष छात्र क्रिएटर (₹99) से बनवाना और 2 दिनों में डिलीवर करवाना चाहते हैं?" /></p>
                                        <Button variant="default" size="sm" className="w-full mt-2 bg-accent text-accent-foreground hover:bg-accent/90">
                                            <BilingualText en="Find a Creator" hi="क्रिएटर खोजें" />
                                        </Button>
                                    </Card>
                                )}
                                <div className="border-t pt-3 mt-3 space-y-2">
                                     <Label><BilingualText en="Enter Address for Delivery/Creator Service" hi="डिलीवरी/क्रिएटर सेवा के लिए पता दर्ज करें"/></Label>
                                     <div className="flex items-center space-x-2">
                                         <Button variant="outline" size="sm"><Home className="mr-2" size={16}/> Use Home</Button>
                                         <Button variant="outline" size="sm"><SchoolIcon className="mr-2" size={16}/> Use School</Button>
                                     </div>
                                     <Input placeholder_en="Or enter new address..." placeholder_hi="या नया पता दर्ज करें..."/>
                                     <Label><BilingualText en="Payment Options" hi="भुगतान विकल्प"/></Label>
                                     <Select>
                                         <SelectTrigger><SelectValue placeholder={<BilingualText en="Select Payment Method" hi="भुगतान विधि चुनें"/>}/></SelectTrigger>
                                         <SelectContent>
                                            <SelectItem value="upi">UPI</SelectItem>
                                            <SelectItem value="oso_credits">OSO Credits</SelectItem>
                                            <SelectItem value="cod">Cash on Delivery (COD)</SelectItem>
                                         </SelectContent>
                                     </Select>
                                     <Button className="w-full"><BilingualText en="Confirm & Proceed" hi="पुष्टि करें और आगे बढ़ें"/></Button>
                                </div>
                                <div className="border-t pt-3 mt-3 space-y-2">
                                    <Button variant="outline" className="w-full"><Truck className="mr-2" size={16}/> <BilingualText en="Track Delivery/Progress" hi="डिलीवरी/प्रगति ट्रैक करें"/></Button>
                                    <Button variant="secondary" className="w-full"><UploadCloud className="mr-2" size={16}/> <BilingualText en="Submit to Teacher (OSO School Panel)" hi="शिक्षक को सबमिट करें (OSO स्कूल पैनल)"/></Button>
                                </div>
                            </div>
                        </Card>
                    )}
                </CardContent>
            </Card>
        );


      case 'product_listing': 
         return <p><BilingualText en={`Products for ${serviceData.name} will be listed here.`} hi={`${serviceData.name} के लिए उत्पाद यहां सूचीबद्ध किए जाएंगे।`} /></p>;
      
      case 'info_page':
        return <p className="whitespace-pre-wrap">{serviceData.data?.content || <BilingualText en="Information will be displayed here." hi="जानकारी यहाँ प्रदर्शित की जाएगी।" />}</p>;
      
      case 'books_list_page': 
        if (!serviceData.data?.redirectTo) {
            return (
            <Alert variant="default">
              <AlertTitle><BilingualText en="Configuration Issue" hi="कॉन्फ़िगरेशन समस्या" /></AlertTitle>
              <AlertDescription>
                <BilingualText 
                  en={`The service "${serviceData.name}" is intended for redirection but is not configured correctly.`} 
                  hi={`सेवा "${serviceData.name}" रीडायरेक्शन के लिए है लेकिन सही ढंग से कॉन्फ़िगर नहीं है।`} 
                />
              </AlertDescription>
            </Alert>
          );
        }
        return null; 
      
      default:
        return <p><BilingualText en="Content is being prepared for this service type." hi="इस सेवा प्रकार के लिए सामग्री तैयार की जा रही है।" /></p>;
    }
  };

  const hideMainElements = serviceData?.type === 'chat_interface' 
    || serviceData?.type === 'test_recommendation_interface' 
    || serviceData?.type === 'interactive_assignment_project_help'
    || !!serviceData?.data?.redirectTo;

  return (
    <div className="space-y-6">
      {!hideMainElements && (
        <header className="py-4">
          <h1 className="text-3xl font-bold font-headline text-primary">
            <BilingualText en={serviceData?.name || "Service"} hi={serviceData?.name || "सेवा"} />
          </h1>
          {serviceData?.description && (
            <p className="text-muted-foreground">
              <BilingualText en={serviceData.description} hi={serviceData.description} />
            </p>
          )}
        </header>
      )}

      { (serviceData?.type === 'chat_interface' || serviceData?.type === 'test_recommendation_interface' || serviceData?.type === 'interactive_assignment_project_help' || !serviceData?.data?.redirectTo) ? (
        (serviceData?.type !== 'chat_interface' && serviceData?.type !== 'test_recommendation_interface' && serviceData?.type !== 'interactive_assignment_project_help' && !hideMainElements) ? ( 
          <Card>
            <CardContent className="pt-6">
              {renderServiceContent()}
            </CardContent>
          </Card>
        ) : ( 
          renderServiceContent()
        )
      ) : null }


      {!hideMainElements && (
        <div className="text-center mt-8">
              <Button asChild variant="outline">
                  <Link href="/">
                      <BilingualText en="Back to Home" hi="होम पर वापस जाएं"/>
                  </Link>
              </Button>
          </div>
      )}
    </div>
  );
}

// Add placeholder to Textarea component for bilingual support if not already done globally
declare module 'react' {
    interface TextareaHTMLAttributes<T> extends HTMLAttributes<T> {
      placeholder_en?: string;
      placeholder_hi?: string;
    }
    interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
      placeholder_en?: string;
      placeholder_hi?: string;
    }
}
// Add placeholder to SelectValue for bilingual support
declare module "@radix-ui/react-select" {
  interface SelectValueProps {
    placeholder_en?: string;
    placeholder_hi?: string;
  }
}
