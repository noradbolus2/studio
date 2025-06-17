
"use client"; 

import { useState, useEffect } from 'react'; 
import { BilingualText } from "@/components/shared/BilingualText";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Target, BrainCircuit, Rocket, FileText } from "lucide-react"; 
import Link from "next/link";
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { getTestSeriesRecommendations, type TestSeriesRecommendationInput, type TestSeriesRecommendationOutput } from '@/ai/flows/test-series-recommendation-flow';
import { useToast } from '@/hooks/use-toast';
import type { ProfileFormData } from '../edit-profile/page'; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; 
import { Label } from "@/components/ui/label";

const testCategories = [ 
  { id: 'all', nameEn: 'All Exams', nameHi: 'सभी परीक्षाएं' },
  { id: 'engineering', nameEn: 'Engineering (JEE, BITSAT, etc.)', nameHi: 'इंजीनियरिंग (जेईई, बिटसैट, आदि)', descriptionEn: "Full syllabus mock tests, previous year papers.", descriptionHi: "पूर्ण पाठ्यक्रम मॉक टेस्ट, पिछले वर्ष के प्रश्नपत्र।"},
  { id: 'medical', nameEn: 'Medical (NEET UG/PG, AIIMS)', nameHi: 'मेडिकल (नीट यूजी/पीजी, एम्स)', descriptionEn: "Subject-wise tests, all India ranking.", descriptionHi: "विषयवार टेस्ट, अखिल भारतीय रैंकिंग।"},
  { id: 'management', nameEn: 'MBA & Management (CAT, XAT)', nameHi: 'एमबीए और प्रबंधन (कैट, एक्सएटी)', descriptionEn: "Practice tests for top B-schools.", descriptionHi: "शीर्ष बी-स्कूलों के लिए अभ्यास परीक्षण।"},
  { id: 'law', nameEn: 'Law (CLAT, AILET, Judiciary)', nameHi: 'कानून (क्लैट, एआईएलईटी, न्यायपालिका)', descriptionEn: "Mock tests for national law universities.", descriptionHi: "राष्ट्रीय विधि विश्वविद्यालयों के लिए मॉक टेस्ट।"},
  { id: 'upsc_civil_services', nameEn: 'UPSC & Civil Services', nameHi: 'यूपीएससी और सिविल सेवा', descriptionEn: "Prelims and Mains oriented test series.", descriptionHi: "प्रारंभिक और मुख्य परीक्षा उन्मुख टेस्ट सीरीज़।"},
  { id: 'ssc_banking', nameEn: 'SSC & Banking', nameHi: 'एसएससी और बैंकिंग', descriptionEn: "Tier-wise tests for govt. jobs.", descriptionHi: "सरकारी नौकरियों के लिए टियर-वार टेस्ट।"},
  { id: 'defence', nameEn: 'Defence (NDA, CDS, AFCAT)', nameHi: 'रक्षा (एनडीए, सीडीएस, एएफसीएटी)', descriptionEn: "Prepare for officer cadre entries.", descriptionHi: "अधिकारी कैडर प्रविष्टियों के लिए तैयारी करें।"},
  { id: 'cuet_general_uni', nameEn: 'CUET & General University', nameHi: 'सीयूईटी और सामान्य विश्वविद्यालय', descriptionEn: "Practice tests for all sections.", descriptionHi: "सभी वर्गों के लिए अभ्यास परीक्षण।"},
  { id: 'design_architecture', nameEn: 'Design & Architecture', nameHi: 'डिज़ाइन और आर्किटेक्चर', descriptionEn: "Mock tests for NID, NIFT, NATA.", descriptionHi: "NID, NIFT, NATA के लिए मॉक टेस्ट।"},
  { id: 'teaching', nameEn: 'Teaching (CTET, NET, TETs)', nameHi: 'शिक्षण (सीटीईटी, नेट, टीईटी)', descriptionEn: "Eligibility tests for teachers.", descriptionHi: "शिक्षकों के लिए पात्रता परीक्षा।"},
  { id: 'commerce_professional', nameEn: 'Commerce Professional (CA, CS, CMA)', nameHi: 'वाणिज्य पेशेवर (सीए, सीएस, सीएमए)', descriptionEn: "Foundation to Final level tests.", descriptionHi: "फाउंडेशन से फाइनल लेवल तक के टेस्ट।"},
  { id: 'school_olympiads', nameEn: 'School Olympiads & Talent', nameHi: 'स्कूल ओलंपियाड और प्रतिभा खोज', descriptionEn: "Tests for NTSE, KVPY, Olympiads.", descriptionHi: "NTSE, KVPY, ओलंपियाड के लिए टेस्ट।"},
  { id: 'other_govt_jobs', nameEn: 'Other Govt. Jobs (Railways, etc.)', nameHi: 'अन्य सरकारी नौकरियां (रेलवे, आदि)', descriptionEn: "Specific tests for various roles.", descriptionHi: "विभिन्न भूमिकाओं के लिए विशिष्ट परीक्षण।"},
  { id: 'pharmacy_agriculture', nameEn: 'Pharmacy & Agriculture', nameHi: 'फार्मेसी और कृषि', descriptionEn: "Entrance tests for B.Pharm, Agri BSc.", descriptionHi: "B.Pharm, Agri BSc के लिए प्रवेश परीक्षा।"},
  { id: 'boards', nameEn: 'Class 10 & 12 Boards', nameHi: 'कक्षा 10 और 12 बोर्ड', descriptionEn: "Chapter tests and model papers.", descriptionHi: "अध्याय परीक्षण और मॉडल पेपर।"},
];

interface FeaturedTest {
  id: string;
  categoryId: string;
  titleEn: string;
  titleHi: string;
  descriptionEn: string;
  descriptionHi: string;
  price: string;
  generationTitleEn?: string; // Optional: Title used for AI test generation
  defaultNumQuestions?: number; // Optional: Specific number of questions for this test
}

const featuredTests: FeaturedTest[] = [
  { 
    id: 'neet_mock_1', 
    categoryId: 'medical', 
    titleEn: "NEET UG Test Series Pack (25 Tests)", 
    titleHi: "नीट यूजी टेस्ट सीरीज़ पैक (25 टेस्ट)", 
    descriptionEn: "25 Tests: 12 Unit, 4 Part-Syllabus, 9 Full NEET Replica Tests. All India Ranking.", 
    descriptionHi: "25 टेस्ट: 12 यूनिट टेस्ट, 4 भाग सिलेबस टेस्ट, 9 पूर्ण नीट प्रतिकृति टेस्ट। अखिल भारतीय रैंकिंग।", 
    price: "₹199",
    generationTitleEn: "NEET UG Full Syllabus Mock Test", // Title for AI generation
    defaultNumQuestions: 50 // Request 50 questions for this test
  },
  { id: 'jee_main_prev_1', categoryId: 'engineering', titleEn: "JEE Main Previous Year Paper (2023)", titleHi: "जेईई मुख्य पिछला वर्ष प्रश्नपत्र (2023)", descriptionEn: "Official paper with solutions.", descriptionHi: "समाधान के साथ आधिकारिक प्रश्नपत्र।", price: "Free" },
  { id: 'cat_verbal_1', categoryId: 'management', titleEn: "CAT Verbal Ability Sectional Test", titleHi: "कैट मौखिक क्षमता अनुभागीय परीक्षण", descriptionEn: "40 questions, 60 minutes.", descriptionHi: "40 प्रश्न, 60 मिनट।", price: "₹99" },
  { id: 'class10_maths_ch1', categoryId: 'boards', titleEn: "Class 10 Maths: Real Numbers Test", titleHi: "कक्षा 10 गणित: वास्तविक संख्याएं परीक्षण", descriptionEn: "Chapter-wise test for board prep.", descriptionHi: "बोर्ड तैयारी के लिए अध्याय-वार परीक्षण।", price: "Free" },
];

// Helper function (can be shared if used elsewhere)
function getCategoryFromExamTarget(examTarget?: string): string {
  if (!examTarget) return 'all';
  const targetLower = examTarget.toLowerCase();
  const categoryKeywordsMap: Record<string, string[]> = {
    engineering: ['jee', 'engineering', 'bitsat', 'viteee', 'srmjeee', 'met', 'comedk', 'kiitee', 'wbjee', 'mht cet (eng', 'gujcet', 'eamcet (eng', 'kcet (eng', 'gate'],
    medical: ['neet', 'medical', 'aiims', 'ini cet', 'fmge', 'nursing', 'aiapget', 'bds', 'mbbs', 'ayush', 'b.v.sc'],
    management: ['cat', 'mba', 'xat', 'cmat', 'snap', 'nmat', 'mat', 'atma', 'iift', 'tissnet', 'ibsat', 'micat', 'gmat'],
    law: ['clat', 'law', 'ailet', 'lsat', 'slat', 'mh cet law', 'lawcet', 'klee', 'judicial'],
    upsc_civil_services: ['upsc', 'civil services', 'ias', 'ifos', 'ese', 'ies', 'geo-scientist', 'cms', 'capf'],
    ssc_banking: ['ssc', 'banking', 'ibps', 'sbi po', 'sbi clerk', 'rbi grade', 'rbi assist', 'nabard', 'lic aao', 'lic ado', 'uiic', 'niacl', 'esic', 'fci', 'cgl', 'chsl', 'cpo'],
    defence: ['nda', 'defence', 'cds', 'afcat', 'inet', 'army tes', 'navy sailors', 'airmen', 'coast guard', 'territorial army'],
    cuet_general_uni: ['cuet', 'jmi entrance', 'amu entrance', 'university entrance'],
    design_architecture: ['nid dat', 'uceed', 'ceed', 'nift', 'nata', 'b.arch', 'b.plan', 'aieed', 'design', 'architecture'],
    teaching: ['ctet', 'teaching', 'tet', 'net', 'set', 'slet', 'kvs', 'nvs', 'dsssb', 'b.ed'],
    commerce_professional: ['ca (', 'cs (', 'cma (', 'chartered accountant', 'company secretary', 'cost management accountant'],
    school_olympiads: ['olympiad', 'ntse', 'kvpy', 'homi bhabha', 'talent search'],
    other_govt_jobs: ['rrb ntpc', 'rrb je', 'rrb alp', 'rrb group d', 'state psc', 'police', 'high court', 'railway'],
    pharmacy_agriculture: ['pharmacy', 'gpat', 'niper', 'agriculture', 'icar aieea', 'veterinary'],
  };
  for (const categoryId in categoryKeywordsMap) {
    if (categoryKeywordsMap[categoryId].some(keyword => targetLower.includes(keyword))) {
      return categoryId;
    }
  }
  if (targetLower.includes('board') || targetLower.match(/class\s*(10|12)/)) return 'boards';
  return 'all';
}


export default function TestSeriesPage() {
  const [recommendations, setRecommendations] = useState<TestSeriesRecommendationOutput | null>(null);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [recommendationError, setRecommendationError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<ProfileFormData | null>(null);
  const [selectedTestCategory, setSelectedTestCategory] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedProfileString = localStorage.getItem('userProfileData');
      if (storedProfileString) {
        try {
          const parsedProfile = JSON.parse(storedProfileString) as ProfileFormData;
          setProfileData(parsedProfile);
          if (parsedProfile.examTarget) {
            const categoryId = getCategoryFromExamTarget(parsedProfile.examTarget);
            if (testCategories.some(cat => cat.id === categoryId)) {
              setSelectedTestCategory(categoryId);
            }
          } else if (parsedProfile.className) { // Fallback to class if examTarget is not set
             const categoryId = getCategoryFromExamTarget(parsedProfile.className.toLowerCase());
             if (testCategories.some(cat => cat.id === categoryId)) {
               setSelectedTestCategory(categoryId);
             }
          }
        } catch (e) {
          console.error("Failed to parse profile for Test Series page:", e);
        }
      }
    }
  }, []);

  const handleGetRecommendations = async () => {
    setIsLoadingRecommendations(true);
    setRecommendationError(null);
    setRecommendations(null);

    const studentNameFromProfile = profileData?.fullName || "Student";
    const examTargetFromProfile = profileData?.examTarget || "General Competitive Exam"; // Fallback

    const dynamicStudentInput: TestSeriesRecommendationInput = {
        studentName: studentNameFromProfile,
        examType: examTargetFromProfile, 
        preferredLanguage: 'en', 
        lastTestPerformances: [ 
            { title: "General Aptitude Mock 1", score: "70/100", weakTopics: ["Quantitative Reasoning", "Logical Puzzles"] },
            { title: "Subject Proficiency Test - Physics", score: "60/100", weakTopics: ["Rotational Motion", "Thermodynamics"] },
             { title: `Previous ${examTargetFromProfile} Mock`, score: "65%", weakTopics: ["Topic A", "Topic B"] }
        ],
        availableTestSets: [ 
            { title: `${examTargetFromProfile} Full Syllabus Mock (Set A)`, subject: "All", level: "Medium" },
            { title: `${examTargetFromProfile} - Advanced Problems`, subject: "Mixed", level: "Hard" },
            { title: "General Knowledge Booster", subject: "GK", level: "Medium" },
            { title: "Verbal Ability Challenge", subject: "English", level: "Tough" },
            // Add more diverse mock tests to ensure Guruji can pick relevant ones
            { title: "JEE Main Physics Practice Set 1", subject: "Physics", level: "Medium"},
            { title: "NEET UG Biology Concept Reviewer", subject: "Biology", level: "Medium"},
            { title: "CAT Quantitative Aptitude Drills", subject: "Maths", level: "Hard"},
            { title: "UPSC Prelims Current Affairs Quiz", subject: "Current Affairs", level: "Medium"},
        ]
    };

    try {
        const result = await getTestSeriesRecommendations(dynamicStudentInput);
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
                <BilingualText en="Get personalized test series suggestions from Guruji based on your profile and (mock) performance." hi="गुरुजी से अपनी प्रोफ़ाइल और (मॉक) प्रदर्शन के आधार पर व्यक्तिगत टेस्ट सीरीज़ सुझाव प्राप्त करें।" />
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
      
      <section className="mt-8">
        <h2 className="text-xl font-semibold text-foreground mb-3">
          <BilingualText en="Featured Test Series" hi="विशेष रुप से प्रदर्शित टेस्ट सीरीज़" />
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredTests.map(test => (
            <Card key={test.id} className="hover:shadow-lg transition-shadow flex flex-col">
              <CardHeader>
                <CardTitle className="text-md font-semibold text-primary"><BilingualText en={test.titleEn} hi={test.titleHi} /></CardTitle>
                <CardDescription className="text-xs"><BilingualText en={test.descriptionEn} hi={test.descriptionHi} /></CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-lg font-bold text-accent">{test.price}</p>
              </CardContent>
              <CardFooter>
                <Button asChild size="sm" className="w-full bg-primary/90 hover:bg-primary text-primary-foreground">
                  <Link href={`/attempt-test?id=${test.id}&title=${encodeURIComponent(test.generationTitleEn || test.titleEn)}${test.defaultNumQuestions ? `&numQuestions=${test.defaultNumQuestions}` : ''}`}>
                    <BilingualText en="Take Test" hi="टेस्ट दें" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
      
      <div className="my-6">
        <Label htmlFor="testCategoryFilter" className="text-md font-semibold text-foreground mb-2 block">
          <BilingualText en="Browse Test Categories" hi="टेस्ट श्रेणियां ब्राउज़ करें" />
        </Label>
        <Select value={selectedTestCategory} onValueChange={setSelectedTestCategory}>
          <SelectTrigger id="testCategoryFilter" className="h-11">
            <SelectValue placeholder={<BilingualText en="Select Exam Category" hi="परीक्षा श्रेणी चुनें" />} />
          </SelectTrigger>
          <SelectContent>
            {testCategories.map(exam => (
              <SelectItem key={exam.id} value={exam.id}>
                <BilingualText en={exam.nameEn} hi={exam.nameHi} />
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testCategories.filter(category => selectedTestCategory === 'all' || category.id === selectedTestCategory).map(category => (
            <Card key={category.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                    <CardTitle className="font-headline"><BilingualText en={category.nameEn} hi={category.nameHi} /></CardTitle>
                    <CardDescription><BilingualText en={category.descriptionEn || ""} hi={category.descriptionHi || ""} /></CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild className="w-full">
                      <Link href={`/test-series/${category.id}?title=${encodeURIComponent(category.nameEn)}`}>
                        <BilingualText en="View Tests" hi="टेस्ट देखें" />
                      </Link>
                    </Button>
                </CardContent>
            </Card>
        ))}
         {selectedTestCategory !== 'all' && !testCategories.find(tc => tc.id === selectedTestCategory) && (
          <Card className="md:col-span-2 text-center">
            <CardContent className="pt-6">
              <p className="text-muted-foreground">
                <BilingualText 
                    en={`No specific category found for "${selectedTestCategory}". Showing all categories below or adjust filter.`} 
                    hi={`"${selectedTestCategory}" के लिए कोई विशिष्ट श्रेणी नहीं मिली। नीचे सभी श्रेणियां देखें या फ़िल्टर समायोजित करें।`}
                />
              </p>
            </CardContent>
          </Card>
        )}
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

declare module "@radix-ui/react-select" {
  interface SelectValueProps {
    placeholder_en?: string;
    placeholder_hi?: string;
  }
}

