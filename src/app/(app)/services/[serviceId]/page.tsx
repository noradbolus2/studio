
"use client";

import { useEffect, useState, type FormEvent, useRef, type ReactNode } from 'react';
import { useParams, useRouter } from 'next/navigation'; 

import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import { askAiGuruji, type AiGurujiInput, type AiGurujiOutput } from '@/ai/flows/ai-guruji-flow';
import { getTestSeriesRecommendations, type TestSeriesRecommendationInput, type TestSeriesRecommendationOutput } from '@/ai/flows/test-series-recommendation-flow';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'; 
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
    Loader2, Send, Target, BookOpen, Brain, Rocket, FileText, Palette, Code2, Users, Edit3,
    ShoppingCart, Clock, Truck, Home, School as SchoolIconLucide, UploadCloud, Package, Image as ImageIcon, ExternalLink, UserCheck,
    BookCopy, FlaskConical, BrainCircuit, FileArchive, ChevronLeft, Eye, LightbulbIcon, Apple
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from 'next/image';
import { useToast } from "@/hooks/use-toast";
import { Badge } from '@/components/ui/badge';


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

// --- New Types for Interactive Assignment/Project Help ---
interface ProjectMaterial {
  name: string;
  qty: number | string; 
  price?: number; // Optional price per material
}

type ProjectCategory = "homework" | "science_model" | "art_poster" | "essay_research" | "coding" | "ai_idea" | "creator_made";

interface MockProject {
  id: string;
  title: string;
  category: ProjectCategory;
  classFilter?: string[]; 
  subjectFilter?: string[]; 
  sampleImageUrl: string;
  dataAiHint: string;
  description: string;
  materials: ProjectMaterial[];
  tutorialUrl?: string; 
  creatorPrice?: number; 
  estimatedTime?: string; 
}

const projectCategories: { id: ProjectCategory; label: string; icon: LucideIcon }[] = [
  { id: "homework", label: "School Homework", icon: BookCopy },
  { id: "science_model", label: "Science Models", icon: FlaskConical },
  { id: "art_poster", label: "Art/Poster/Chart Work", icon: Palette },
  { id: "essay_research", label: "Essay or Research Assignment", icon: FileText },
  { id: "coding", label: "Coding Project", icon: Code2 },
  { id: "ai_idea", label: "Custom by AI", icon: BrainCircuit },
  { id: "creator_made", label: "Made by Creator", icon: Users },
];

const classes = ["Nursery", "LKG", "UKG", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11 Science", "11 Commerce", "11 Arts", "12 Science", "12 Commerce", "12 Arts", "Competitive Exams"];
const subjects = ["All", "Maths", "Science", "Physics", "Chemistry", "Biology", "English", "Hindi", "Social Studies", "History", "Geography", "Civics", "Economics", "Computer Science", "Art", "General Knowledge", "Current Affairs"];

const mockProjects: MockProject[] = [
  { id: "proj1", title: "Working Model of Hydraulic Lift", category: "science_model", classFilter: ["7","8","9"], subjectFilter: ["Science", "Physics"], sampleImageUrl: "https://placehold.co/600x400.png", dataAiHint: "hydraulic lift science", description: "Learn Pascal's Law by building a functional hydraulic lift model using simple syringes and tubes.", materials: [{ name: "Large Syringe (20ml)", qty: 2, price: 15 }, { name: "Small Syringe (5ml)", qty: 2, price:10 }, { name: "Flexible Plastic Tube (1 meter)", qty: 1, price:20 }, { name: "Cardboard Sheets", qty: 2, price: 5 }, { name: "Craft Glue", qty: 1, price:10 }], tutorialUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", creatorPrice: 149, estimatedTime: "3 hours" },
  { id: "proj2", title: "Solar System Diorama", category: "art_poster", classFilter: ["4","5","6"], subjectFilter: ["Science", "Art"], sampleImageUrl: "https://placehold.co/600x400.png", dataAiHint: "solar system model", description: "Create a beautiful 3D model of our solar system for your classroom.", materials: [{ name: "Thermocol Balls (various sizes)", qty: 10, price:50 }, { name: "Acrylic Paints", qty: 1, price:80 }, { name: "Chart Paper (Black)", qty: 1, price:10 }, {name: "String", qty:1, price:5}], creatorPrice: 199, estimatedTime: "4 hours" },
  { id: "proj3", title: "Essay: Impact of AI on Society", category: "essay_research", classFilter: ["10", "11 Arts", "12 Arts"], subjectFilter: ["English", "Social Studies", "Computer Science"], sampleImageUrl: "https://placehold.co/600x400.png", dataAiHint: "essay writing ai", description: "Research and write a compelling essay on the societal impacts of Artificial Intelligence.", materials: [{ name: "Research Access (OSO e-Library)", qty: "Subscription", price:0 }], tutorialUrl: "#", estimatedTime: "Research + 2 hours writing" },
  { id: "proj4", title: "Basic Python Calculator", category: "coding", classFilter: ["9","10","11 Science", "12 Science"], subjectFilter: ["Computer Science"], sampleImageUrl: "https://placehold.co/600x400.png", dataAiHint: "python code computer", description: "Develop a simple calculator application using Python programming language.", materials: [{ name: "Python IDE (e.g., VS Code)", qty: 1, price:0 }], tutorialUrl: "#", creatorPrice: 249, estimatedTime: "5 hours coding" },
  { id: "hw1", title: "Algebra Worksheet (Ch 3)", category: "homework", classFilter: ["8"], subjectFilter: ["Maths"], sampleImageUrl: "https://placehold.co/600x400.png", dataAiHint: "maths worksheet", description: "Complete the algebra practice problems from Chapter 3.", materials: [{name: "Notebook", qty:1}, {name:"Pen", qty:1}], estimatedTime: "1 hour"},
  { id: "proj5", title: "Volcano Eruption Model", category: "science_model", classFilter: ["6","7"], subjectFilter: ["Science", "Geography"], sampleImageUrl: "https://placehold.co/600x400.png", dataAiHint: "volcano model erupting", description: "Create an exciting volcano model that erupts using baking soda and vinegar.", materials: [{name: "Plastic Bottle", qty: 1}, {name: "Cardboard Base", qty:1}, {name:"Clay or Papier-mâché", qty:1}, {name:"Baking Soda", qty:1}, {name:"Vinegar", qty:1}, {name:"Red Food Coloring", qty:1}], tutorialUrl: "#", estimatedTime: "2-3 hours"},
  { id: "proj6", title: "Water Cycle Poster", category: "art_poster", classFilter: ["5","6"], subjectFilter: ["Science", "Art"], sampleImageUrl: "https://placehold.co/600x400.png", dataAiHint: "water cycle diagram", description: "Design an informative and visually appealing poster explaining the water cycle.", materials: [{name: "Large Chart Paper", qty:1}, {name:"Color Pencils/Markers", qty:1}, {name:"Cotton Balls (for clouds)", qty:"1 pack"}], creatorPrice: 79, estimatedTime: "2 hours"},
];


export default function ServicePage() {
  const routeParams = useParams<ServicePageParams>(); 
  const serviceId = routeParams?.serviceId;
  const router = useRouter();
  const { toast } = useToast();

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
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [activeTab, setActiveTab] = useState<ProjectCategory>(projectCategories[0].id);
  const [selectedProject, setSelectedProject] = useState<MockProject | null>(null);
  const [deliveryAddress, setDeliveryAddress] = useState('');


  useEffect(() => {
    if (serviceId) {
      const fetchServiceData = async () => {
        setLoading(true);
        setError(null);
        setIsRedirecting(false); 
        setServicePageChatMessages([]); 
        setTestRecommendations(null);
        setTestRecommendationError(null);
        setSelectedProject(null); 

        try {
          console.log(`Fetching mock data for serviceId: ${serviceId}`);
          await new Promise(resolve => setTimeout(resolve, 300)); 
          const mockData: { [key: string]: ServiceData } = {
            elibrary: { name: "E-Library", type: "books_list_page", description: "Access NCERT and reference books.", data: { redirectTo: "/class-6-12-books" } },
            guruji: { name: "AI Guruji", type: "chat_interface", description: "Your personal AI study assistant.", data: { avatarUrl: "https://placehold.co/100x100.png", dataAiHint: "monk teaching", initialGreetingEn: "Namaste! How can I help you today on this page?"}},
            stationery: { name: "Stationery", type: "product_listing", description: "Order pens, notebooks, and more.", data: { redirectTo: "/delivery", category: "stationery_essentials", avatarUrl: "https://placehold.co/100x100.png?text=🛍️", dataAiHint:"stationery bag" }},
            studysnacks: { name: "Study Snacks", type: "product_listing", description: "Healthy snacks delivered for study sessions.", data: { redirectTo: "/delivery", category: "study_snacks", avatarUrl: "https://placehold.co/100x100.png", dataAiHint:"apple fruit"}},
            projects: { name: "Projects Assistant", type: "interactive_assignment_project_help", description: "Get help with school projects and assignments.", data: { avatarUrl: "https://placehold.co/100x100.png", dataAiHint:"tools project" }},
            assignments: { name: "Assignments Assistant", type: "interactive_assignment_project_help", description: "AI assistance for completing your assignments.", data: { avatarUrl: "https://placehold.co/100x100.png", dataAiHint:"writing assignment" }},
            testseries: { name: "Test Series", type: "test_recommendation_interface", description: "Get personalized test recommendations from AI Guruji.", data: { avatarUrl: "https://placehold.co/100x100.png", dataAiHint: "guru exam"}},
            uniforms: {
              name: "Uniforms",
              type: "info_page",
              description: "Find and order school uniforms.",
              data: {
                content: "Welcome to the Uniforms section! Here you can find information about school uniforms available through OSO App.\n\nWe are working with local vendors to bring you a wide selection of school-specific uniforms, including shirts, trousers, skirts, blazers, and sports attire.\n\nCurrently, online ordering for uniforms is under development. Please check back soon or contact your school's preferred vendor for purchases.\n\nKey features coming soon:\n- Browse by school\n- Size charts and guides\n- Secure online payment\n- Home delivery options"
              }
            },
            dailygurugyaan: {
              name: "Daily Guru Gyaan",
              type: "info_page",
              description: "A daily dose of wisdom from Guruji.",
              data: {
                content: "🌟 Today's Guru Gyaan 🌟\n\n\"The journey of a thousand miles begins with a single step.\"\n\nDon't be overwhelmed by the size of your goals. Focus on taking that first small action today. Consistent effort, no matter how small, leads to great achievements. Believe in yourself and keep moving forward! 🙏\n\n#Motivation #StudyTips #GuruJiWisdom"
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
             // Set active tab for project/assignment help based on serviceId
            if (fetchedData.type === "interactive_assignment_project_help") {
              if (serviceId === "projects") setActiveTab("science_model"); // Default to science model for "projects"
              else if (serviceId === "assignments") setActiveTab("essay_research"); // Default to essay for "assignments"
              else setActiveTab(projectCategories[0].id); // Fallback
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
  }, [serviceId, router]); // Added router to dependencies
  
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

    const mockStudentInput: TestSeriesRecommendationInput = {
        studentName: "Aarav",
        examType: "NEET UG",
        preferredLanguage: 'en',
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
  
  const handleAddMaterialsToCart = (project: MockProject) => {
    toast({
        title: "Materials Added to Cart (Simulated)",
        description: `${project.materials.map(m => `${m.name} (Qty: ${m.qty})`).join(', ')} added for ${project.title}.`,
    });
  };

  const handleGetCreatorService = (project: MockProject) => {
     toast({
        title: "Find a Creator (Simulated)",
        description: `Looking for creators for "${project.title}". This feature is coming soon!`,
    });
  };

  const handleBuildWithMe = (project: MockProject) => {
     toast({
        title: "'Build With Me' Tutorial (Simulated)",
        description: `Loading tutorial for "${project.title}". Feature coming soon! URL: ${project.tutorialUrl || 'N/A'}`,
    });
  }

  const handleProjectIdeaSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const ideaDescription = (form.elements.namedItem('aiIdeaDescription') as HTMLTextAreaElement)?.value;
    if (!ideaDescription.trim()) {
      toast({ title: "Description Needed", description: "Please describe your project topic or constraints.", variant: "destructive"});
      return;
    }
    setServicePageChatIsLoading(true); 
    toast({title: "AI Idea Generation (Simulated)", description: `Guruji is thinking of a brilliant idea for: ${ideaDescription.substring(0,50)}...`});
    
    await new Promise(resolve => setTimeout(resolve, 1500));

    const mockAIProject: MockProject = {
      id: "ai-proj-dynamic",
      title: `AI Suggested: ${ideaDescription.substring(0,20)} Model`,
      category: "ai_idea",
      sampleImageUrl: "https://placehold.co/600x400.png",
      dataAiHint: "ai generated idea",
      description: `An AI-generated project idea based on your input: "${ideaDescription}". This could involve building a small prototype or a research paper.`,
      materials: [
        { name: "Basic Craft Supplies (AI will suggest specifics)", qty: "Varies" },
        { name: "Online Research Access", qty: 1 },
      ],
      estimatedTime: "Varies (AI will estimate)",
    };
    setSelectedProject(mockAIProject);
    setServicePageChatIsLoading(false);
  };


  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
        <LoadingSpinner size={48} />
        <p className="mt-4 text-muted-foreground">
          Loading content...
        </p>
      </div>
    );
  }

  if (isRedirecting && serviceData?.data?.redirectTo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
        <LoadingSpinner size={48} />
        <p className="mt-4 text-muted-foreground">
          Redirecting to {serviceData.name}...
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
            {isInfoError ? "Content Information" : "Error"}
          </AlertTitle>
          <AlertDescription>{displayMessage}</AlertDescription>
        </Alert>
         <Button asChild variant="outline" className="mt-4">
            <Link href="/">
                Go to Home
            </Link>
        </Button>
      </div>
    );
  }
  
  if (!serviceData) { 
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] p-4">
        <Alert className="max-w-md text-center">
          <AlertTitle>Content Unavailable</AlertTitle>
          <AlertDescription>
            The content for "{serviceId}" could not be loaded. Please check back later.
          </AlertDescription>
        </Alert>
        <Button asChild variant="outline" className="mt-4">
            <Link href="/">
                Go to Home
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
                Preparing to go to {serviceData.name}...
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
                    {serviceData.name}
                  </h2>
                  {serviceData.description && (
                    <p className="text-xs text-muted-foreground">
                      {serviceData.description}
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
                        <p className="text-sm text-muted-foreground">AI Guruji is pondering...</p>
                    </Card>
                </div>
              )}
            </ScrollArea>

            <footer className="p-3 border-t bg-card rounded-b-lg">
              <form onSubmit={handleServicePageChatSubmit} className="flex items-center space-x-2">
                <Textarea 
                  value={servicePageChatInputValue}
                  onChange={(e) => setServicePageChatInputValue(e.target.value)}
                  placeholder="Ask anything..."
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
                  <span className="sr-only">Send</span>
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
        const filteredProjects = mockProjects.filter(p => 
            p.category === activeTab &&
            (!selectedClass || p.classFilter?.includes(selectedClass.replace("Class ","")) || p.classFilter?.includes(selectedClass)) &&
            (selectedSubject === 'All' || p.subjectFilter?.includes(selectedSubject))
        );

        return (
           <Tabs value={activeTab} onValueChange={(value) => {setActiveTab(value as ProjectCategory); setSelectedProject(null);}} className="w-full">
                <Card className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm pt-2 shadow-sm -mx-4 px-4 rounded-none border-x-0 border-t-0">
                    <CardHeader className="pb-3 pt-2 px-0">
                        <div className="flex items-center gap-3">
                            {serviceData.data?.avatarUrl && (
                            <Avatar className="h-10 w-10 border-2 border-primary">
                                <AvatarImage src={serviceData.data.avatarUrl} alt={serviceData.name} data-ai-hint={serviceData.data.dataAiHint || "avatar"} />
                                <AvatarFallback>{serviceData.name.substring(0,1).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            )}
                            <div>
                                <CardTitle className="text-lg font-headline text-primary">
                                    {serviceData.name}
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    {serviceData.description || "Let Guruji AI help you plan and execute!"}
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pb-3 px-0">
                        <div className="grid grid-cols-2 gap-3 mb-3 px-4">
                            <div>
                                <Label htmlFor="projectClass" className="text-xs">Your Class</Label>
                                <Select value={selectedClass} onValueChange={setSelectedClass}>
                                    <SelectTrigger id="projectClass" className="h-9"><SelectValue placeholder="Select Class"/></SelectTrigger>
                                    <SelectContent>
                                        {classes.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="projectSubject" className="text-xs">Subject</Label>
                                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                                    <SelectTrigger id="projectSubject" className="h-9"><SelectValue placeholder="Select Subject"/></SelectTrigger>
                                    <SelectContent>
                                        {subjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <ScrollArea className="w-full whitespace-nowrap pb-1 px-4">
                            <TabsList className="bg-muted/60">
                                {projectCategories.map((cat) => (
                                <TabsTrigger key={cat.id} value={cat.id} className="text-xs px-2.5 py-1.5 h-auto">
                                    <cat.icon className="h-4 w-4 mr-1.5 opacity-80" /> {cat.label}
                                </TabsTrigger>
                                ))}
                            </TabsList>
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                    </CardContent>
                </Card>
                
                <div className="mt-6 px-0 md:px-0">
                {projectCategories.map((cat) => (
                    <TabsContent key={cat.id} value={cat.id} className="mt-0">
                        {cat.id === "ai_idea" && !selectedProject && (
                            <Card className="text-center">
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-center gap-2"><BrainCircuit className="text-primary"/> AI Project Idea Generator</CardTitle>
                                    <CardDescription>Stuck? Let Guruji AI suggest a unique project idea for you!</CardDescription>
                                </CardHeader>
                                <form onSubmit={handleProjectIdeaSubmit}>
                                    <CardContent>
                                        <Textarea name="aiIdeaDescription" placeholder="Briefly describe your topic or constraints (e.g., 'water conservation for class 7 using household items')" className="min-h-[80px]"/>
                                    </CardContent>
                                    <CardFooter>
                                        <Button type="submit" className="w-full bg-primary text-primary-foreground" disabled={servicePageChatIsLoading}>
                                            {servicePageChatIsLoading ? <LoadingSpinner /> : <Rocket className="mr-2"/>} Get AI Idea
                                        </Button>
                                    </CardFooter>
                                </form>
                            </Card>
                        )}
                         {cat.id === "creator_made" && !selectedProject && (
                            <Card className="text-center">
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-center gap-2"><Users className="text-primary"/> Get it Made by an OSO Creator</CardTitle>
                                    <CardDescription>Browse projects our talented student creators can make for you or request a custom one.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                     <p className="text-muted-foreground text-sm">Feature coming soon! Describe your project needs to find a creator.</p>
                                     <Textarea placeholder="Describe the project you want made (e.g., 'Volcano model for Class 6, needs to erupt')" className="min-h-[80px] mt-2"/>
                                </CardContent>
                                <CardFooter>
                                    <Button className="w-full bg-primary text-primary-foreground" onClick={() => toast({title: "Find Creator (Simulated)", description: "Searching for available creators."})}>
                                        <UserCheck className="mr-2"/> Find a Creator
                                    </Button>
                                </CardFooter>
                            </Card>
                        )}
                        {(cat.id !== "ai_idea" && cat.id !== "creator_made") && (
                            <>
                                {!selectedProject && (
                                    filteredProjects.length > 0 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {filteredProjects.map(proj => (
                                                <Card key={proj.id} className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow group" onClick={() => setSelectedProject(proj)}>
                                                    <CardHeader className="p-0">
                                                        <div className="aspect-video relative bg-muted">
                                                            <Image src={proj.sampleImageUrl} alt={proj.title} layout="fill" objectFit="cover" data-ai-hint={proj.dataAiHint}/>
                                                        </div>
                                                    </CardHeader>
                                                    <CardContent className="p-3">
                                                        <h3 className="font-semibold text-sm leading-tight truncate group-hover:text-primary">{proj.title}</h3>
                                                        <p className="text-xs text-muted-foreground truncate">{proj.description}</p>
                                                    </CardContent>
                                                    <CardFooter className="p-3 pt-0">
                                                        <Button variant="outline" size="sm" className="w-full text-xs">View Details</Button>
                                                    </CardFooter>
                                                </Card>
                                            ))}
                                        </div>
                                    ) : (
                                        <Card className="text-center py-8">
                                            <FileArchive size={32} className="mx-auto text-muted-foreground mb-2" />
                                            <p className="text-muted-foreground">No {cat.label.toLowerCase()} found for the selected class/subject. Try other filters or the "Custom by AI" tab!</p>
                                        </Card>
                                    )
                                )}
                            </>
                        )}
                        
                        {selectedProject && selectedProject.category === activeTab && (
                            <Card className="shadow-xl border-primary/50">
                                <CardHeader className="bg-muted/20">
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-xl font-headline text-primary">{selectedProject.title}</CardTitle>
                                        <Button variant="ghost" size="sm" onClick={() => setSelectedProject(null)} className="text-xs">
                                            <ChevronLeft size={14} className="mr-1"/> Back to list
                                        </Button>
                                    </div>
                                    <CardDescription>{selectedProject.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4 pt-4">
                                    <div className="aspect-video relative bg-muted rounded-md overflow-hidden shadow-inner">
                                         <Image src={selectedProject.sampleImageUrl} alt={selectedProject.title} layout="fill" objectFit="cover" data-ai-hint={selectedProject.dataAiHint} />
                                    </div>
                                    
                                    <div>
                                        <h4 className="font-semibold text-sm mb-1.5 flex items-center"><Package size={16} className="mr-1.5 opacity-70"/>Materials Needed:</h4>
                                        <ul className="list-disc list-inside text-xs space-y-0.5 pl-4 text-muted-foreground">
                                            {selectedProject.materials.map(mat => <li key={mat.name}>{mat.name} (Qty: {mat.qty}) {mat.price ? `- approx. INR ${mat.price}` : ''}</li>)}
                                        </ul>
                                        <Button size="sm" className="mt-2 w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => handleAddMaterialsToCart(selectedProject)}>
                                            <ShoppingCart size={14} className="mr-1.5"/> Add Materials to OSO Cart
                                        </Button>
                                    </div>

                                    {selectedProject.estimatedTime && <p className="text-xs text-muted-foreground"><Clock size={12} className="inline mr-1"/>Estimated Time: {selectedProject.estimatedTime}</p>}

                                    <div className="flex flex-col sm:flex-row gap-2">
                                        {selectedProject.tutorialUrl && (
                                            <Button variant="default" className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => handleBuildWithMe(selectedProject)}>
                                                <Eye size={16} className="mr-2"/> View 'Build With Me' Tutorial
                                            </Button>
                                        )}
                                        {selectedProject.creatorPrice && (
                                            <Button variant="secondary" className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => handleGetCreatorService(selectedProject)}>
                                                <Users size={16} className="mr-2"/> Get it Made by Creator (INR {selectedProject.creatorPrice})
                                            </Button>
                                        )}
                                    </div>
                                    
                                    <Card className="bg-muted/30 p-3">
                                        <Label className="text-xs font-medium">Delivery Address (for materials/creator service)</Label>
                                        <div className="flex items-center space-x-2 mt-1 mb-2">
                                            <Button variant="outline" size="xs" className="text-xs px-2 h-7"><Home size={12} className="mr-1"/> Use Home</Button>
                                            <Button variant="outline" size="xs" className="text-xs px-2 h-7"><SchoolIconLucide size={12} className="mr-1"/> Use School</Button>
                                        </div>
                                        <Input placeholder="Or enter new address..." value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} className="h-9"/>
                                        <Button size="sm" className="w-full mt-2 bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => toast({title:"Proceeding to Payment (Simulated)", description: "Address: " + (deliveryAddress || "Default")})}>
                                           <Truck size={14} className="mr-1.5"/> Proceed to Order/Payment
                                        </Button>
                                        <p className="text-xs text-muted-foreground text-center mt-2">Conceptual: Payment & Delivery Tracking</p>
                                    </Card>
                                     <Button variant="outline" className="w-full" onClick={() => toast({title: "Submit to Teacher (Simulated)", description: "Requires school integration."})}>
                                        <UploadCloud size={16} className="mr-2"/> Submit to Teacher Panel
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>
                ))}
                </div>
            </Tabs>
        );


      case 'product_listing': 
         return <p>Products for {serviceData.name} will be listed here.</p>;
      
      case 'info_page':
        const content = serviceData.data?.content || "Information will be displayed here.";
        const parts = content.split('\n\n');
        const gyaanTitlePart = parts.find(p => p.includes("🌟"));
        const quotePart = parts.find(p => p.startsWith("\"") && p.endsWith("\""));
        const explanationPart = parts.find(p => p.length > 50 && !p.includes("🌟") && !p.startsWith("\"") && !p.startsWith("#"));
        const hashtagsLinePart = parts.find(p => p.startsWith("#"));
        const hashtagsList = hashtagsLinePart ? hashtagsLinePart.split(' ').filter(h => h.startsWith('#')) : [];

        return (
            <Card className="shadow-xl bg-gradient-to-br from-primary/10 via-background to-accent/10 border-primary/20">
                <CardHeader className="items-center text-center border-b pb-4">
                    <LightbulbIcon className="h-16 w-16 text-accent mb-3 animate-pulse" style={{ animationDuration: '2.5s' }} />
                    <CardTitle className="font-headline text-2xl text-primary">
                        {serviceData.name}
                    </CardTitle>
                    {serviceData.description && (
                    <CardDescription className="text-base text-muted-foreground">
                        {serviceData.description}
                    </CardDescription>
                    )}
                </CardHeader>
                <CardContent className="p-6 text-center space-y-6">
                    {gyaanTitlePart && (
                    <h2 className="text-xl font-semibold text-foreground">{gyaanTitlePart}</h2>
                    )}
                    {quotePart && (
                    <blockquote className="text-lg italic text-primary border-l-4 border-primary pl-4 py-2 my-4 bg-primary/5 rounded-r-md">
                        {quotePart}
                    </blockquote>
                    )}
                    {explanationPart && (
                    <p className="text-md text-foreground leading-relaxed">
                        {explanationPart}
                    </p>
                    )}
                    {hashtagsList.length > 0 && (
                    <div className="mt-6 flex flex-wrap justify-center gap-2">
                        {hashtagsList.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-sm bg-accent/20 text-accent-foreground border-accent/30">
                            {tag}
                        </Badge>
                        ))}
                    </div>
                    )}
                    {!gyaanTitlePart && !quotePart && !explanationPart && hashtagsList.length === 0 && (
                         <p className="whitespace-pre-wrap text-sm text-foreground">{content}</p>
                    )}
                </CardContent>
            </Card>
        );
      
      case 'books_list_page': 
        if (!serviceData.data?.redirectTo) {
            return (
            <Alert variant="default">
              <AlertTitle>Configuration Issue</AlertTitle>
              <AlertDescription>
                The service "{serviceData.name}" is intended for redirection but is not configured correctly.
              </AlertDescription>
            </Alert>
          );
        }
        return null; 
      
      default:
        return <p>Content is being prepared for this service type.</p>;
    }
  };

  const hideMainElements = serviceData?.type === 'chat_interface' 
    || serviceData?.type === 'test_recommendation_interface' 
    || serviceData?.type === 'interactive_assignment_project_help'
    || !!serviceData?.data?.redirectTo;

  return (
    <div className="space-y-0_override"> 
      {!hideMainElements && serviceData?.type !== 'info_page' && (
        <header className="py-4 px-1">
          <h1 className="text-3xl font-bold font-headline text-primary">
            {serviceData?.name || "Service"}
          </h1>
          {serviceData?.description && (
            <p className="text-muted-foreground">
              {serviceData.description}
            </p>
          )}
        </header>
      )}

      { (serviceData?.type === 'chat_interface' || serviceData?.type === 'test_recommendation_interface' || serviceData?.type === 'interactive_assignment_project_help' || serviceData?.type === 'info_page' || !serviceData?.data?.redirectTo) ? (
        (serviceData?.type !== 'chat_interface' && serviceData?.type !== 'test_recommendation_interface' && serviceData?.type !== 'interactive_assignment_project_help' && !hideMainElements && serviceData?.type !== 'info_page') ? ( 
          <Card>
            <CardContent className="pt-6">
              {renderServiceContent()}
            </CardContent>
          </Card>
        ) : ( 
          renderServiceContent()
        )
      ) : null }


      {!hideMainElements && serviceData?.type !== 'info_page' &&(
        <div className="text-center mt-8 px-1">
              <Button asChild variant="outline">
                  <Link href="/">
                      Back to Home
                  </Link>
              </Button>
          </div>
      )}
    </div>
  );
}

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
declare module "@radix-ui/react-select" {
  interface SelectValueProps {
    placeholder_en?: string;
    placeholder_hi?: string;
  }
}

