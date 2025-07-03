
"use client";

import { useEffect, useState, type FormEvent, useRef, type ReactNode } from 'react';
import { useRouter } from 'next/navigation'; 

import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import { askGuruji, type GurujiInput, type GurujiOutput } from '@/ai/flows/ai-guruji-flow';
import { getTestSeriesRecommendations, type TestSeriesRecommendationInput, type TestSeriesRecommendationOutput } from '@/ai/flows/test-series-recommendation-flow';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'; 
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
    Loader2, Send, Target, BookOpen, Brain, Rocket, FileText, Palette, Code2, Users, Edit3,
    ShoppingCart, Clock, Truck, Home, School as SchoolIconLucide, UploadCloud, Package, Image as ImageIconLucide, ExternalLink, UserCheck,
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
import type { ProfileFormData } from '../../edit-profile/page'; // Import ProfileFormData type


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
  sampleImageUrl?: string; // Made optional
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
  { id: "proj1", title: "Working Model of Hydraulic Lift", category: "science_model", classFilter: ["7","8","9"], subjectFilter: ["Science", "Physics"], sampleImageUrl: "https://images.unsplash.com/photo-1600714942735-81f9aa88132d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHxoeWRyYXVsaWMlMjBsaWZ0JTIwc2NpZW5jZXxlbnwwfHx8fDE3NTE0OTExMzh8MA&ixlib=rb-4.1.0&q=80&w=1080", dataAiHint: "hydraulic lift science", description: "Learn Pascal's Law by building a functional hydraulic lift model using simple syringes and tubes.", materials: [{ name: "Large Syringe (20ml)", qty: 2, price: 15 }, { name: "Small Syringe (5ml)", qty: 2, price:10 }, { name: "Flexible Plastic Tube (1 meter)", qty: 1, price:20 }, { name: "Cardboard Sheets", qty: 2, price: 5 }, { name: "Craft Glue", qty: 1, price:10 }], tutorialUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", creatorPrice: 149, estimatedTime: "3 hours" },
  { id: "proj2", title: "Solar System Diorama", category: "art_poster", classFilter: ["4","5","6"], subjectFilter: ["Science", "Art"], sampleImageUrl: "https://placehold.co/600x337.png", dataAiHint: "solar system model", description: "Create a beautiful 3D model of our solar system for your classroom.", materials: [{ name: "Thermocol Balls (various sizes)", qty: 10, price:50 }, { name: "Acrylic Paints", qty: 1, price:80 }, { name: "Chart Paper (Black)", qty: 1, price:10 }, {name: "String", qty:1, price:5}], creatorPrice: 199, estimatedTime: "4 hours" },
  { id: "proj3", title: "Essay: Impact of AI on Society", category: "essay_research", classFilter: ["10", "11 Arts", "12 Arts"], subjectFilter: ["English", "Social Studies", "Computer Science"], dataAiHint: "essay writing ai", description: "Research and write a compelling essay on the societal impacts of Artificial Intelligence.", materials: [{ name: "Research Access (OSO e-Library)", qty: "Subscription", price:0 }], tutorialUrl: "#", estimatedTime: "Research + 2 hours writing" }, // No image
  { id: "proj4", title: "Basic Python Calculator", category: "coding", classFilter: ["9","10","11 Science", "12 Science"], subjectFilter: ["Computer Science"], sampleImageUrl: "https://placehold.co/600x337.png", dataAiHint: "python code computer", description: "Develop a simple calculator application using Python programming language.", materials: [{ name: "Python IDE (e.g., VS Code)", qty: 1, price:0 }], tutorialUrl: "#", creatorPrice: 249, estimatedTime: "5 hours coding" },
  { id: "hw1", title: "Algebra Worksheet (Ch 3)", category: "homework", classFilter: ["8"], subjectFilter: ["Maths"], dataAiHint: "maths worksheet", description: "Complete the algebra practice problems from Chapter 3.", materials: [{name: "Notebook", qty:1}, {name:"Pen", qty:1}], estimatedTime: "1 hour"}, // No image
  { id: "proj5", title: "Volcano Eruption Model", category: "science_model", classFilter: ["6","7"], subjectFilter: ["Science", "Geography"], sampleImageUrl: "https://images.unsplash.com/photo-1634842135325-3519b715a2a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHx2b2xjYW5vJTIwbW9kZWwlMjBlcnVwdGluZ3xlbnwwfHx8fDE3NTE0OTExMzh8MA&ixlib.rb-4.1.0&q=80&w=1080", dataAiHint: "volcano model erupting", description: "Create an exciting volcano model that erupts using baking soda and vinegar.", materials: [{name: "Plastic Bottle", qty: 1}, {name: "Cardboard Base", qty:1}, {name:"Clay or Papier-mâché", qty:1}, {name:"Baking Soda", qty:1}, {name:"Vinegar", qty:1}, {name:"Red Food Coloring", qty:1}], tutorialUrl: "#", estimatedTime: "2-3 hours"},
  { id: "proj6", title: "Water Cycle Poster", category: "art_poster", classFilter: ["5","6"], subjectFilter: ["Science", "Art"], dataAiHint: "water cycle diagram", description: "Design an informative and visually appealing poster explaining the water cycle.", materials: [{name: "Large Chart Paper", qty:1}, {name:"Color Pencils/Markers", qty:1}, {name:"Cotton Balls (for clouds)", qty:"1 pack"}], creatorPrice: 79, estimatedTime: "2 hours"}, // No image
];

function getNumericClassFromStringForProjects(classNameString?: string): string | undefined {
  if (!classNameString) return undefined;
  // Handles "Class 6", "6", "11 Science" -> "11"
  const match = classNameString.match(/\d+/); 
  if (match) return match[0];
  // For "Nursery", "LKG", "UKG", we might not have direct numeric mapping for projects
  // but the `classes` array in this component has them, so it's fine.
  return classNameString; // Return original if no number, e.g. "Nursery"
}


export default function ServicePage({ params: { serviceId } }: { params: { serviceId: string } }) {
  const router = useRouter();
  const { toast } = useToast();

  const [serviceData, setServiceData] = useState<ServiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [profileData, setProfileData] = useState<ProfileFormData | null>(null);

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
    if (typeof window !== "undefined") {
      const storedProfileString = localStorage.getItem('userProfileData');
      if (storedProfileString) {
        try {
          const parsedProfile = JSON.parse(storedProfileString) as ProfileFormData;
          setProfileData(parsedProfile);
        } catch (e) {
          console.error("Failed to parse profile for Service page:", e);
        }
      }
    }
  }, []);


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
            guruji: { name: "Guruji", type: "chat_interface", description: "Your personal study assistant.", data: { avatarUrl: "https://placehold.co/100x100.png", dataAiHint: "monk teaching", initialGreetingEn: "Namaste! How can I help you today on this page?"}},
            stationery: { name: "Stationery", type: "product_listing", description: "Order pens, notebooks, and more.", data: { redirectTo: "/delivery", category: "stationery_essentials", avatarUrl: "https://placehold.co/100x100.png", dataAiHint:"stationery bag" }},
            studysnacks: { name: "Study Snacks", type: "product_listing", description: "Healthy snacks delivered for study sessions.", data: { redirectTo: "/delivery", category: "study_snacks", avatarUrl: "https://placehold.co/100x100.png", dataAiHint:"apple fruit"}},
            projects: { name: "Projects Assistant", type: "interactive_assignment_project_help", description: "Get help with school projects and assignments.", data: { avatarUrl: "https://images.unsplash.com/photo-1710828777420-7e415632d428?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHx0b29scyUyMHByb2plY3R8ZW58MHx8fHwxNzUxNDkxMTM4fDA&ixlib=rb-4.1.0&q=80&w=1080", dataAiHint:"tools project" }},
            assignments: { name: "Assignments Assistant", type: "interactive_assignment_project_help", description: "Assistance for completing your assignments.", data: { avatarUrl: "https://placehold.co/100x100.png", dataAiHint:"writing assignment" }},
            testseries: { name: "Test Series", type: "test_recommendation_interface", description: "Get personalized test recommendations from Guruji.", data: { avatarUrl: "https://placehold.co/100x100.png", dataAiHint: "guru exam"}},
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
            if (fetchedData.type === "interactive_assignment_project_help") {
              if (serviceId === "projects") setActiveTab("science_model"); 
              else if (serviceId === "assignments") setActiveTab("essay_research"); 
              else setActiveTab(projectCategories[0].id); 
              
              // Set default class from profile for project help
              if (profileData?.className) {
                const profileClass = getNumericClassFromStringForProjects(profileData.className);
                if (profileClass && classes.includes(profileClass)) {
                    setSelectedClass(profileClass);
                } else if (profileClass && classes.map(c => c.toLowerCase()).includes(profileClass.toLowerCase())) {
                    // Find matching case-insensitive
                    const matchingClass = classes.find(c => c.toLowerCase() === profileClass.toLowerCase());
                    if (matchingClass) setSelectedClass(matchingClass);
                }
              }
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
  }, [serviceId, router, profileData]); // Added profileData to dependency array
  
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
      const gurujiInput: GurujiInput = { 
        userInput: trimmedInput,
        studentClass: profileData?.className,
        studentBoard: profileData?.board,
        studentStream: profileData?.stream,
        studentExamTarget: profileData?.examTarget,
      };
      const response = await askGuruji(gurujiInput);
      
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
        studentName: profileData?.fullName || "Aarav",
        examType: profileData?.examTarget || "NEET UG",
        preferredLanguage: 'en',
        lastTestPerformances: [
            { title: "Biology Mock 1", score: "120/180", weakTopics: ["Genetics", "Plant Physiology"] },
            { title: "Physics Sectional - Mechanics", score: "60/100", weakTopics: ["Rotational Motion", "Work Energy Power"] },
            { title: "Chemistry Full Syllabus Test 1", score: "90/180", weakTopics: ["Organic Chemistry Reactions", "Chemical Bonding"] }
        ],
        availableTestSets: [
            { title: `${profileData?.examTarget || "NEET UG"} Full Syllabus Mock Test Series (Set A)`, subject: "All", level: "Medium" },
            { title: `${profileData?.examTarget || "NEET UG"} Biology - Genetics Special`, subject: "Biology", level: "Hard" },
            { title: `${profileData?.examTarget || "NEET UG"} Physics - Mechanics Booster`, subject: "Physics", level: "Medium" },
            { title: `${profileData?.examTarget || "NEET UG"} Chemistry - Organic Mastery`, subject: "Chemistry", level: "Tough" },
            { title: "JEE Advanced Physics Challenge", subject: "Physics", level: "Very Hard"},
        ]
    };

    try {
        const result = await getTestSeriesRecommendations(mockStudentInput);
        setTestRecommendations(result);
    } catch (err: any) {
        console.error("Error getting test recommendations:", err);
        setTestRecommendationError(err.message || "Failed to get recommendations. Guruji might be busy.");
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
    toast({title: "Guruji Idea Generation (Simulated)", description: `Guruji is thinking of a brilliant idea for: ${ideaDescription.substring(0,50)}...`});
    
    await new Promise(resolve => setTimeout(resolve, 1500));

    const mockAIProject: MockProject = {
      id: "ai-proj-dynamic",
      title: `Guruji Suggested: ${ideaDescription.substring(0,20)} Model`,
      category: "ai_idea",
      sampleImageUrl: "https://placehold.co/600x337.png", // Default placeholder for AI idea
      dataAiHint: "ai generated idea",
      description: `A Guruji-generated project idea based on your input: "${ideaDescription}". This could involve building a small prototype or a research paper.`,
      materials: [
        { name: "Basic Craft Supplies (Guruji will suggest specifics)", qty: "Varies" },
        { name: "Online Research Access", qty: 1 },
      ],
      estimatedTime: "Varies (Guruji will estimate)",
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
            <header className="p-4 border-b text-center bg-card rounded-t-lg relative">
              <Button variant="ghost" size="icon" className="absolute left-2 top-1/2 -translate-y-1/2" onClick={() => router.back()}>
                  <ChevronLeft className="h-5 w-5"/>
              </Button>
              <div className="flex items-center justify-center space-x-3">
                <Avatar className="h-10 w-10 border-2 border-primary">
                  <AvatarImage 
                    src={serviceData.data?.avatarUrl || `https://placehold.co/100x100.png`} 
                    alt={serviceData.name} 
                    data-ai-hint={serviceData.data?.dataAiHint || "service icon"} 
                  />
                  <AvatarFallback>{serviceData.name.substring(0,1).toUpperCase()}</AvatarFallback>
                </Avatar>
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
                        <p className="text-sm text-muted-foreground">Guruji is pondering...</p>
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
                    <div className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12 border-2 border-primary">
                                <AvatarImage 
                                    src={serviceData.data?.avatarUrl || `https://placehold.co/100x100.png`} 
                                    alt={serviceData.name} 
                                    data-ai-hint={serviceData.data?.dataAiHint || "service icon"} 
                                />
                                <AvatarFallback>{serviceData.name.substring(0,1)}G</AvatarFallback>
                            </Avatar>
                            <div>
                                <CardTitle className="text-xl font-headline text-primary">Test Advisor</CardTitle>
                                <CardDescription>Get smart test recommendations from Guruji.</CardDescription>
                            </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => router.back()}>
                            <ChevronLeft className="mr-1 h-4 w-4"/> Back
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {!testRecommendations && !isTestRecommendationLoading && (
                        <p className="text-sm text-muted-foreground text-center py-4">
                            Click the button below to get personalized test series suggestions based on your profile (or a sample profile if yours isn't set).
                        </p>
                    )}
                    {isTestRecommendationLoading && (
                        <div className="flex flex-col items-center justify-center p-6 space-y-3">
                            <LoadingSpinner size={32}/>
                            <p className="text-muted-foreground">Guruji is analyzing and preparing recommendations...</p>
                        </div>
                    )}
                    {recommendationError && (
                        <Alert variant="destructive">
                            <AlertTitle>Recommendation Error</AlertTitle>
                            <AlertDescription>{recommendationError}</AlertDescription>
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
                <CardFooter>
                    <Button onClick={handleGetRecommendations} className="w-full" disabled={isTestRecommendationLoading}>
                         {isTestRecommendationLoading ? <LoadingSpinner size={20}/> : <Rocket className="mr-2 h-4 w-4" />}
                        Get New Recommendations
                    </Button>
                </CardFooter>
            </Card>
        );

      case 'info_page':
        return (
          <Card className="w-full">
             <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 border-2 border-primary">
                            <AvatarImage 
                                src={serviceData.data?.avatarUrl || `https://placehold.co/100x100.png`} 
                                alt={serviceData.name} 
                                data-ai-hint={serviceData.data?.dataAiHint || "service icon"} 
                            />
                            <AvatarFallback>{serviceData.name.substring(0,1)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle className="text-xl font-headline text-primary">{serviceData.name}</CardTitle>
                            {serviceData.description && <CardDescription>{serviceData.description}</CardDescription>}
                        </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => router.back()}>
                        <ChevronLeft className="mr-1 h-4 w-4"/> Back
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="text-sm text-foreground/80 whitespace-pre-wrap">
              {serviceData.data?.content || "No information available for this service."}
            </CardContent>
          </Card>
        );
        
      default:
        return <p>Service type "{serviceData.type}" not recognized.</p>;
    }
  };

  return (
    <div className="w-full">
      {renderServiceContent()}
    </div>
  );
}

declare module 'react' {
    interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
      placeholder_en?: string;
      placeholder_hi?: string;
    }
}
