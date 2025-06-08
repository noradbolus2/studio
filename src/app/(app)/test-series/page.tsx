
"use client"; 

import { useState } from 'react';
import { BilingualText } from "@/components/shared/BilingualText";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Target, BrainCircuit, Rocket, FileText } from "lucide-react"; 
import Link from "next/link";
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { getTestSeriesRecommendations, type TestSeriesRecommendationInput, type TestSeriesRecommendationOutput } from '@/ai/flows/test-series-recommendation-flow';
import { useToast } from '@/hooks/use-toast';


const testCategories = [
  { id: "engineering", nameEn: "Engineering (JEE, BITSAT, etc.)", nameHi: "इंजीनियरिंग (जेईई, बिटसैट, आदि)", descriptionEn: "Full syllabus mock tests, previous year papers.", descriptionHi: "पूर्ण पाठ्यक्रम मॉक टेस्ट, पिछले वर्ष के प्रश्नपत्र।"},
  { id: "medical", nameEn: "Medical (NEET UG/PG, AIIMS)", nameHi: "मेडिकल (नीट यूजी/पीजी, एम्स)", descriptionEn: "Subject-wise tests, all India ranking.", descriptionHi: "विषयवार टेस्ट, अखिल भारतीय रैंकिंग।"},
  { id: "management", nameEn: "MBA & Management (CAT, XAT)", nameHi: "एमबीए और प्रबंधन (कैट, एक्सएटी)", descriptionEn: "Practice tests for top B-schools.", descriptionHi: "शीर्ष बी-स्कूलों के लिए अभ्यास परीक्षण।"},
  { id: "law", nameEn: "Law (CLAT, AILET)", nameHi: "कानून (क्लैट, एआईएलईटी)", descriptionEn: "Mock tests for national law universities.", descriptionHi: "राष्ट्रीय विधि विश्वविद्यालयों के लिए मॉक टेस्ट।"},
  { id: "upsc_civil_services", nameEn: "UPSC & Civil Services", nameHi: "यूपीएससी और सिविल सेवा", descriptionEn: "Prelims and Mains oriented test series.", descriptionHi: "प्रारंभिक और मुख्य परीक्षा उन्मुख टेस्ट सीरीज़।"},
  { id: "ssc_banking", nameEn: "SSC & Banking", nameHi: "एसएससी और बैंकिंग", descriptionEn: "Tier-wise tests for govt. jobs.", descriptionHi: "सरकारी नौकरियों के लिए टियर-वार टेस्ट।"},
  { id: "defence", nameEn: "Defence (NDA, CDS)", nameHi: "रक्षा (एनडीए, सीडीएस)", descriptionEn: "Prepare for officer cadre entries.", descriptionHi: "अधिकारी कैडर प्रविष्टियों के लिए तैयारी करें।"},
  { id: "cuet_general_uni", nameEn: "CUET & University Entrance", nameHi: "सीयूईटी और विश्वविद्यालय प्रवेश", descriptionEn: "Practice tests for all sections.", descriptionHi: "सभी वर्गों के लिए अभ्यास परीक्षण।"},
  { id: "teaching", nameEn: "Teaching Exams (CTET, NET)", nameHi: "शिक्षण परीक्षा (सीटीईटी, नेट)", descriptionEn: "Eligibility tests for teachers.", descriptionHi: "शिक्षकों के लिए पात्रता परीक्षा।"},
  { id: "boards", nameEn: "Class 10 & 12 Boards", nameHi: "कक्षा 10 और 12 बोर्ड", descriptionEn: "Chapter tests and model papers.", descriptionHi: "अध्याय परीक्षण और मॉडल पेपर।"},
];

export default function TestSeriesPage() {
  const [recommendations, setRecommendations] = useState<TestSeriesRecommendationOutput | null>(null);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [recommendationError, setRecommendationError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGetRecommendations = async () => {
    setIsLoadingRecommendations(true);
    setRecommendationError(null);
    setRecommendations(null);

    const mockStudentInput: TestSeriesRecommendationInput = {
        studentName: "Aarav",
        examType: "NEET UG", // Example exam, can be changed
        preferredLanguage: 'en', 
        lastTestPerformances: [
            { title: "Biology Mock 1", score: "120/180", weakTopics: ["Genetics", "Plant Physiology"] },
            { title: "Physics Sectional - Mechanics", score: "60/100", weakTopics: ["Rotational Motion", "Work Energy Power"] },
            { title: "Chemistry Full Syllabus Test 1", score: "90/180", weakTopics: ["Organic Chemistry Reactions", "Chemical Bonding"] }
        ],
        availableTestSets: [ // This list should ideally be dynamic or larger
            { title: "NEET Full Syllabus Mock Test Series (Set A)", subject: "All", level: "Medium" },
            { title: "NEET Biology - Genetics Special", subject: "Biology", level: "Hard" },
            { title: "NEET Physics - Mechanics Booster", subject: "Physics", level: "Medium" },
            { title: "NEET Chemistry - Organic Mastery", subject: "Chemistry", level: "Tough" },
            { title: "JEE Advanced Physics Challenge", subject: "Physics", level: "Very Hard"}, 
            { title: "CAT Quant Mock Series", subject: "Quantitative Aptitude", level: "Medium"},
            { title: "UPSC Prelims GS Paper 1 Mock", subject: "General Studies", level: "Hard"},
        ]
    };

    try {
        const result = await getTestSeriesRecommendations(mockStudentInput);
        setRecommendations(result);
    } catch (err: any) {
        console.error("Error getting test recommendations:", err);
        setRecommendationError(err.message || "Failed to get recommendations. Guruji might be busy.");
        toast({
            title: "Recommendation Error",
            description: err.message || "Guruji couldn't fetch recommendations right now. Please try again.",
            variant: "destructive"
        });
    } finally {
        setIsLoadingRecommendations(false);
    }
  };


  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
            <Target className="h-8 w-8 text-primary"/>
            <BilingualText en="Test Series" hi="टेस्ट सीरीज़" />
        </h1>
        <p className="text-muted-foreground">
            <BilingualText en="Practice and ace your exams." hi="अभ्यास करें और अपनी परीक्षाओं में उत्कृष्टता प्राप्त करें।" />
        </p>
      </header>

      <Card className="bg-primary/5 border-primary/20 hover:shadow-lg transition-shadow">
        <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline text-primary">
                <BrainCircuit className="h-7 w-7"/>
                <BilingualText en="Guruji's Recommendations" hi="गुरुजी की सिफारिशें" />
            </CardTitle>
            <CardDescription>
                <BilingualText en="Get personalized test series suggestions from Guruji based on your (mock) performance." hi="गुरुजी से अपने (मॉक) प्रदर्शन के आधार पर व्यक्तिगत टेस्ट सीरीज़ सुझाव प्राप्त करें।" />
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Button onClick={handleGetRecommendations} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoadingRecommendations}>
                {isLoadingRecommendations ? <LoadingSpinner size={20}/> : <Rocket className="mr-2 h-5 w-5" />}
                <BilingualText en="Ask Guruji for Recommendations" hi="गुरुजी से सिफारिशें पूछें" />
            </Button>
        </CardContent>
      </Card>

      {isLoadingRecommendations && (
        <div className="flex flex-col items-center justify-center py-10 space-y-3">
          <LoadingSpinner size={32} />
          <p className="text-muted-foreground"><BilingualText en="Guruji is analyzing your profile..." hi="गुरुजी आपकी प्रोफ़ाइल का विश्लेषण कर रहे हैं..." /></p>
        </div>
      )}

      {recommendationError && !isLoadingRecommendations && (
         <Alert variant="destructive">
            <AlertTitle><BilingualText en="Error Fetching Recommendations" hi="सिफारिशें प्राप्त करने में त्रुटि" /></AlertTitle>
            <AlertDescription>{recommendationError}</AlertDescription>
        </Alert>
      )}

      {recommendations && !isLoadingRecommendations && (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="text-xl font-headline text-primary"><BilingualText en="Guruji's Advice for You" hi="आपके लिए गुरुजी की सलाह"/></CardTitle>
                <CardDescription>
                    <BilingualText en={`Language: ${recommendations.respondedInLanguage.toUpperCase()}`} hi={`भाषा: ${recommendations.respondedInLanguage.toUpperCase()}`} />
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <Card className="bg-muted/30 p-4">
                    <p className="text-sm whitespace-pre-wrap">{recommendations.gurujiAdvice}</p>
                </Card>
                
                {recommendations.recommendedTests.length > 0 && (
                    <div>
                        <h4 className="text-md font-semibold mb-3 flex items-center gap-2">
                           <FileText size={18}/> <BilingualText en="Recommended Tests:" hi="अनुशंसित परीक्षण:" />
                        </h4>
                        <div className="space-y-3">
                            {recommendations.recommendedTests.map((test, index) => (
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
                                                <BilingualText en="Attempt Test" hi="टेस्ट दें"/>
                                            </Link>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
                 {recommendations.recommendedTests.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-3"><BilingualText en="Guruji didn't find specific tests for you right now, but gave some general advice. Keep learning!" hi="गुरुजी को अभी आपके लिए कोई विशिष्ट परीक्षण नहीं मिला, लेकिन कुछ सामान्य सलाह दी। सीखते रहें!"/></p>
                 )}
            </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testCategories.map(category => (
            <Card key={category.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                    <CardTitle className="font-headline"><BilingualText en={category.nameEn} hi={category.nameHi} /></CardTitle>
                    <CardDescription><BilingualText en={category.descriptionEn} hi={category.descriptionHi} /></CardDescription>
                </CardHeader>
                <CardContent>
                    <Button className="w-full"><BilingualText en="View Tests" hi="टेस्ट देखें" /></Button>
                </CardContent>
            </Card>
        ))}
      </div>

      <Card className="bg-accent/10 border-accent/30">
        <CardHeader>
            <CardTitle className="font-headline text-accent"><BilingualText en="Why OSO Test Series?" hi="OSO टेस्ट सीरीज़ क्यों?" /></CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
            <p><BilingualText en="✓ AI-powered performance analysis" hi="✓ एआई-संचालित प्रदर्शन विश्लेषण" /></p>
            <p><BilingualText en="✓ Real exam simulation" hi="✓ वास्तविक परीक्षा सिमुलेशन" /></p>
            <p><BilingualText en="✓ Detailed solutions and explanations" hi="✓ विस्तृत समाधान और स्पष्टीकरण" /></p>
        </CardContent>
      </Card>
    </div>
  );
}

