
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Send, Target, BookOpen, Brain } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';


// Define a type for your service data for better type safety
interface ServiceData {
  name: string;
  type: string; // e.g., "chat_interface", "product_listing", "info_page", "test_recommendation_interface"
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

export default function ServicePage() {
  const params = useParams<ServicePageParams>();
  const serviceId = params?.serviceId;
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


  useEffect(() => {
    if (serviceId) {
      const fetchServiceData = async () => {
        setLoading(true);
        setError(null);
        setIsRedirecting(false); 
        setServicePageChatMessages([]); 
        setTestRecommendations(null);
        setTestRecommendationError(null);

        try {
          console.log(`Fetching mock data for serviceId: ${serviceId}`);
          await new Promise(resolve => setTimeout(resolve, 300)); 
          const mockData: { [key: string]: ServiceData } = {
            elibrary: { name: "E-Library", type: "books_list_page", description: "Access NCERT and reference books.", data: { redirectTo: "/class-6-12-books" } },
            guruji: { name: "AI Guruji", type: "chat_interface", description: "Your personal AI study assistant.", data: { avatarUrl: "https://placehold.co/100x100.png", dataAiHint: "monk teaching", initialGreetingEn: "Namaste! How can I help you today on this page?"}},
            stationery: { name: "Stationery", type: "product_listing", description: "Order pens, notebooks, and more.", data: { redirectTo: "/delivery", category: "stationery_essentials", avatarUrl: "https://placehold.co/100x100.png?text=🛍️", dataAiHint:"stationery bag" }},
            projects: { name: "Projects", type: "info_page", description: "Get help with school projects.", data: { content: "Information about project help will be displayed here." }},
            assignments: { name: "Assignments", type: "info_page", description: "Assistance with assignments.", data: { content: "Details about assignment help services." }},
            testseries: { name: "Test Series", type: "test_recommendation_interface", description: "Get personalized test recommendations from AI Guruji.", data: { avatarUrl: "https://placehold.co/100x100.png", dataAiHint: "guru exam"}},
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
              hi={`"${serviceId}" के लिए सामग्री लोड नहीं की जा सकी। कृपया बाद में देखें।`} />
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
                            <CardTitle className="text-xl font-headline text-primary"><BilingualText en="AI Test Advisor" hi="एआई टेस्ट सलाहकार"/></CardTitle>
                            <CardDescription><BilingualText en="Get smart test recommendations from OSO Guruji." hi="OSO गुरुजी से स्मार्ट टेस्ट सुझाव प्राप्त करें।"/></CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {!testRecommendations && !isTestRecommendationLoading && (
                        <p className="text-sm text-muted-foreground text-center py-4">
                            <BilingualText 
                                en="Click the button below to get personalized test series suggestions based on a sample student profile." 
                                hi="नमूना छात्र प्रोफ़ाइल के आधार पर व्यक्तिगत टेस्ट सीरीज़ सुझाव प्राप्त करने के लिए नीचे दिए गए बटन पर क्लिक करें।"
                            />
                        </p>
                    )}
                    {isTestRecommendationLoading && (
                        <div className="flex flex-col items-center justify-center p-6 space-y-3">
                            <LoadingSpinner size={32}/>
                            <p className="text-muted-foreground"><BilingualText en="AI Guruji is analyzing and preparing recommendations..." hi="एआई गुरुजी विश्लेषण कर रहे हैं और सुझाव तैयार कर रहे हैं..."/></p>
                        </div>
                    )}
                    {testRecommendationError && (
                        <Alert variant="destructive">
                            <AlertTitle><BilingualText en="Recommendation Error" hi="सुझाव त्रुटि" /></AlertTitle>
                            <AlertDescription>{testRecommendationError}</AlertDescription>
                        </Alert>
                    )}
                    {testRecommendations && (
                        <div className="space-y-6">
                            <Card className="bg-muted/30 p-4">
                                <h3 className="text-lg font-semibold text-primary mb-2 font-headline">
                                    <BilingualText en="Guruji's Advice" hi="गुरुजी की सलाह"/>
                                </h3>
                                <p className="text-sm whitespace-pre-wrap">{testRecommendations.gurujiAdvice}</p>
                            </Card>
                            
                            {testRecommendations.recommendedTests.length > 0 && (
                                <div>
                                    <h4 className="text-md font-semibold mb-2"><BilingualText en="Recommended Tests for You:" hi="आपके लिए अनुशंसित टेस्ट:"/></h4>
                                    <ul className="space-y-3">
                                        {testRecommendations.recommendedTests.map((test, index) => (
                                            <li key={index} className="p-3 border rounded-lg bg-card shadow-sm">
                                                <p className="font-medium text-primary flex items-center gap-2"><Target size={16}/>{test.title}</p>
                                                <p className="text-xs text-muted-foreground pl-6">{test.reason}</p>
                                            </li>
                                        ))}
                                    </ul>
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
                            testRecommendations ? <BilingualText en="Get Fresh Recommendations" hi="नई सिफारिशें प्राप्त करें"/> : <BilingualText en="Ask Guruji for Recommendations" hi="गुरुजी से सिफारिशें पूछें"/>
                        }
                    </Button>
                    {/* Future: Add a button to "Input My Performance" that would lead to a form */}
                </CardFooter>
            </Card>
        );


      case 'product_listing': 
         return <p><BilingualText en={`Products for ${serviceData.name} will be listed here.`} hi={`${serviceData.name} के लिए उत्पाद यहां सूचीबद्ध किए जाएंगे।`} /></p>;
      
      case 'info_page':
        return <p>{serviceData.data?.content || <BilingualText en="Information will be displayed here." hi="जानकारी यहाँ प्रदर्शित की जाएगी।" />}</p>;
      
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

  const hideMainElements = serviceData?.type === 'chat_interface' || serviceData?.type === 'test_recommendation_interface' || !!serviceData?.data?.redirectTo;

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

      { (serviceData?.type === 'chat_interface' || serviceData?.type === 'test_recommendation_interface' || !serviceData?.data?.redirectTo) ? (
        (serviceData?.type !== 'chat_interface' && serviceData?.type !== 'test_recommendation_interface' && !hideMainElements) ? ( 
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
  }

