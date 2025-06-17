
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
  { id: 'all', nameEn: 'All Exams', nameHi: 'सभी परीक्षाएं', descriptionEn: "Browse all available test series.", descriptionHi: "सभी उपलब्ध टेस्ट सीरीज़ ब्राउज़ करें।" },
  // Engineering
  { id: 'engineering_jee_main', nameEn: 'JEE Main', nameHi: 'जेईई मुख्य', descriptionEn: "Mock tests for Joint Entrance Examination Main.", descriptionHi: "संयुक्त प्रवेश परीक्षा मुख्य के लिए मॉक टेस्ट।" },
  { id: 'engineering_jee_advanced', nameEn: 'JEE Advanced', nameHi: 'जेईई एडवांस्ड', descriptionEn: "Practice tests for IIT admissions.", descriptionHi: "आईआईटी प्रवेश के लिए अभ्यास परीक्षण।" },
  { id: 'engineering_bitsat', nameEn: 'BITSAT', nameHi: 'बिटसैट', descriptionEn: "Tests for Birla Institute of Technology and Science.", descriptionHi: "बिरला इंस्टीट्यूट ऑफ टेक्नोलॉजी एंड साइंस के लिए टेस्ट।" },
  // Medical
  { id: 'medical_neet_ug', nameEn: 'NEET UG', nameHi: 'नीट यूजी', descriptionEn: "Mock tests for National Eligibility cum Entrance Test (UG).", descriptionHi: "राष्ट्रीय पात्रता सह प्रवेश परीक्षा (यूजी) के लिए मॉक टेस्ट।" },
  { id: 'medical_neet_pg', nameEn: 'NEET PG', nameHi: 'नीट पीजी', descriptionEn: "Tests for postgraduate medical courses.", descriptionHi: "स्नातकोत्तर चिकित्सा पाठ्यक्रमों के लिए टेस्ट।" },
  { id: 'medical_aiims_nursing', nameEn: 'AIIMS Nursing', nameHi: 'एम्स नर्सिंग', descriptionEn: "Entrance tests for AIIMS B.Sc. Nursing.", descriptionHi: "एम्स बी.एससी. नर्सिंग के लिए प्रवेश परीक्षा।" },
  // Management
  { id: 'management_cat', nameEn: 'CAT', nameHi: 'कैट', descriptionEn: "Tests for Common Admission Test (MBA).", descriptionHi: "कॉमन एडमिशन टेस्ट (एमबीए) के लिए टेस्ट।" },
  { id: 'management_xat', nameEn: 'XAT', nameHi: 'एक्सएटी', descriptionEn: "Tests for Xavier Aptitude Test (MBA).", descriptionHi: "जेवियर एप्टीट्यूड टेस्ट (एमबीए) के लिए टेस्ट।" },
  // Law
  { id: 'law_clat', nameEn: 'CLAT', nameHi: 'क्लैट', descriptionEn: "Tests for Common Law Admission Test.", descriptionHi: "कॉमन लॉ एडमिशन टेस्ट के लिए टेस्ट।" },
  { id: 'law_ailet', nameEn: 'AILET', nameHi: 'एआईएलईटी', descriptionEn: "Tests for All India Law Entrance Test.", descriptionHi: "अखिल भारतीय विधि प्रवेश परीक्षा के लिए टेस्ट।" },
  // UPSC & Civil Services
  { id: 'upsc_cse_prelims', nameEn: 'UPSC CSE Prelims', nameHi: 'यूपीएससी सीएसई प्रीलिम्स', descriptionEn: "Tests for Civil Services Preliminary Exam.", descriptionHi: "सिविल सेवा प्रारंभिक परीक्षा के लिए टेस्ट।" },
  { id: 'upsc_cse_mains', nameEn: 'UPSC CSE Mains', nameHi: 'यूपीएससी सीएसई मेन्स', descriptionEn: "Practice for Civil Services Main Exam.", descriptionHi: "सिविल सेवा मुख्य परीक्षा के लिए अभ्यास।" },
  // SSC & Banking
  { id: 'ssc_cgl', nameEn: 'SSC CGL', nameHi: 'एसएससी सीजीएल', descriptionEn: "Tests for Staff Selection Commission CGL.", descriptionHi: "कर्मचारी चयन आयोग सीजीएल के लिए टेस्ट।" },
  { id: 'ibps_po', nameEn: 'IBPS PO', nameHi: 'आईबीपीएस पीओ', descriptionEn: "Tests for IBPS Probationary Officer exam.", descriptionHi: "आईबीपीएस प्रोबेशनरी ऑफिसर परीक्षा के लिए टेस्ट।" },
  { id: 'sbi_po', nameEn: 'SBI PO', nameHi: 'एसबीआई पीओ', descriptionEn: "Tests for SBI Probationary Officer exam.", descriptionHi: "एसबीआई प्रोबेशनरी ऑफिसर परीक्षा के लिए टेस्ट।" },
  // Defence
  { id: 'defence_nda', nameEn: 'NDA & NA', nameHi: 'एनडीए और एनए', descriptionEn: "Tests for National Defence Academy entrance.", descriptionHi: "राष्ट्रीय रक्षा अकादमी प्रवेश के लिए टेस्ट।" },
  { id: 'defence_cds', nameEn: 'CDS', nameHi: 'सीडीएस', descriptionEn: "Tests for Combined Defence Services exam.", descriptionHi: "संयुक्त रक्षा सेवा परीक्षा के लिए टेस्ट।" },
  // CUET
  { id: 'cuet_ug', nameEn: 'CUET UG', nameHi: 'सीयूईटी यूजी', descriptionEn: "Tests for Common University Entrance Test (UG).", descriptionHi: "कॉमन यूनिवर्सिटी एंट्रेंस टेस्ट (यूजी) के लिए टेस्ट।" },
  // School Boards
  { id: 'school_boards_class10', nameEn: 'Class 10 Boards', nameHi: 'कक्षा 10 बोर्ड', descriptionEn: "Practice tests for Class 10 board exams.", descriptionHi: "कक्षा 10 बोर्ड परीक्षाओं के लिए अभ्यास परीक्षण।" },
  { id: 'school_boards_class12', nameEn: 'Class 12 Boards', nameHi: 'कक्षा 12 बोर्ड', descriptionEn: "Practice tests for Class 12 board exams.", descriptionHi: "कक्षा 12 बोर्ड परीक्षाओं के लिए अभ्यास परीक्षण।" },
  // Other popular exams
  { id: 'other_gate', nameEn: 'GATE', nameHi: 'गेट', descriptionEn: "Graduate Aptitude Test in Engineering.", descriptionHi: "इंजीनियरिंग में स्नातक योग्यता परीक्षा।" },
  { id: 'other_ugc_net', nameEn: 'UGC NET', nameHi: 'यूजीसी नेट', descriptionEn: "National Eligibility Test for lecturership.", descriptionHi: "लेक्चररशिप के लिए राष्ट्रीय पात्रता परीक्षा।" },
  { id: 'other_ctet', nameEn: 'CTET', nameHi: 'सीटीईटी', descriptionEn: "Central Teacher Eligibility Test.", descriptionHi: "केंद्रीय शिक्षक पात्रता परीक्षा।" },
  { id: 'olympiad_nso', nameEn: 'NSO (Science Olympiad)', nameHi: 'एनएसओ (विज्ञान ओलंपियाड)', descriptionEn: "National Science Olympiad practice.", descriptionHi: "राष्ट्रीय विज्ञान ओलंपियाड अभ्यास।" },
  { id: 'olympiad_imo', nameEn: 'IMO (Maths Olympiad)', nameHi: 'आईएमओ (गणित ओलंपियाड)', descriptionEn: "International Maths Olympiad practice.", descriptionHi: "अंतर्राष्ट्रीय गणित ओलंपियाड अभ्यास।" },
];


interface FeaturedTest {
  id: string;
  categoryId: string; // Should now match one of the granular IDs above
  titleEn: string;
  titleHi: string;
  descriptionEn: string;
  descriptionHi: string;
  price: string;
  generationTitleEn?: string; 
  defaultNumQuestions?: number; 
}

const featuredTests: FeaturedTest[] = [
  { 
    id: 'neet_mock_1', 
    categoryId: 'medical_neet_ug', 
    titleEn: "NEET UG Test Series Pack (25 Tests)", 
    titleHi: "नीट यूजी टेस्ट सीरीज़ पैक (25 टेस्ट)", 
    descriptionEn: "Pack of 25 Tests: 12 Unit Tests, 4 Part-Syllabus Tests, and 9 Full NEET Replica Mock Tests. All India Ranking.", 
    descriptionHi: "25 टेस्ट का पैक: 12 यूनिट टेस्ट, 4 भाग-सिलेबस टेस्ट, और 9 पूर्ण नीट प्रतिकृति मॉक टेस्ट। अखिल भारतीय रैंकिंग।", 
    price: "₹199",
    generationTitleEn: "NEET UG Full Syllabus Mock Test (Sample)", 
    defaultNumQuestions: 200 
  },
  { id: 'jee_main_prev_1', categoryId: 'engineering_jee_main', titleEn: "JEE Main Previous Year Paper (2023)", titleHi: "जेईई मुख्य पिछला वर्ष प्रश्नपत्र (2023)", descriptionEn: "Official paper with solutions.", descriptionHi: "समाधान के साथ आधिकारिक प्रश्नपत्र।", price: "Free", generationTitleEn: "JEE Main 2023 Paper", defaultNumQuestions: 90 },
  { id: 'cat_verbal_1', categoryId: 'management_cat', titleEn: "CAT Verbal Ability Sectional Test", titleHi: "कैट मौखिक क्षमता अनुभागीय परीक्षण", descriptionEn: "40 questions, 60 minutes.", descriptionHi: "40 प्रश्न, 60 मिनट।", price: "₹99", generationTitleEn: "CAT Verbal Ability Sectional Test", defaultNumQuestions: 40 },
  { id: 'class10_maths_ch1', categoryId: 'school_boards_class10', titleEn: "Class 10 Maths: Real Numbers Test", titleHi: "कक्षा 10 गणित: वास्तविक संख्याएं परीक्षण", descriptionEn: "Chapter-wise test for board prep.", descriptionHi: "बोर्ड तैयारी के लिए अध्याय-वार परीक्षण।", price: "Free", generationTitleEn: "Class 10 Maths Chapter 1 Test", defaultNumQuestions: 15 },
];


function getCategoryFromExamTarget(examTarget?: string): string {
  if (!examTarget) return 'all';
  const targetLower = examTarget.toLowerCase();

  // Prioritize direct matches from testCategories
  const directMatch = testCategories.find(cat => cat.nameEn.toLowerCase() === targetLower || cat.id === targetLower);
  if (directMatch && directMatch.id !== 'all') return directMatch.id;

  const categoryKeywordsMap: Record<string, string[]> = {
    engineering_jee_main: ['jee main'], engineering_jee_advanced: ['jee advanced'], engineering_bitsat: ['bitsat'],
    medical_neet_ug: ['neet ug', 'neet'], medical_neet_pg: ['neet pg'], medical_aiims_nursing: ['aiims nursing'],
    management_cat: ['cat'], management_xat: ['xat'],
    law_clat: ['clat'], law_ailet: ['ailet'],
    upsc_cse_prelims: ['upsc prelims', 'ias prelims', 'civil services prelims'], upsc_cse_mains: ['upsc mains', 'ias mains'],
    ssc_cgl: ['ssc cgl'], ibps_po: ['ibps po'], sbi_po: ['sbi po'],
    defence_nda: ['nda', 'na exam'], defence_cds: ['cds'],
    cuet_ug: ['cuet ug', 'cuet'],
    school_boards_class10: ['class 10 board', '10th board', 'matriculation'],
    school_boards_class12: ['class 12 board', '12th board', 'intermediate'],
    other_gate: ['gate'], other_ugc_net: ['ugc net'], other_ctet: ['ctet'],
    olympiad_nso: ['nso', 'science olympiad'], olympiad_imo: ['imo', 'maths olympiad'],
  };

  for (const categoryId in categoryKeywordsMap) {
    if (categoryKeywordsMap[categoryId].some(keyword => targetLower.includes(keyword))) {
      return categoryId;
    }
  }
  
  // Fallback for general class mentions if not caught by board-specific keywords
  if (targetLower.includes("class 10") || targetLower.includes("10th")) return 'school_boards_class10';
  if (targetLower.includes("class 12") || targetLower.includes("12th")) return 'school_boards_class12';

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
          } else if (parsedProfile.className) { 
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
    const examTargetFromProfile = profileData?.examTarget || "General Competitive Exam"; 

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
                     <BilingualText 
                        en={test.id === 'neet_mock_1' ? "Attempt Sample Full Test" : "Take Test"} 
                        hi={test.id === 'neet_mock_1' ? "सैंपल पूर्ण टेस्ट दें" : "टेस्ट दें"} 
                    />
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
                      <Link href={`/attempt-test?examType=${encodeURIComponent(category.nameEn)}&title=${encodeURIComponent(category.nameEn + " Mock Test")}`}>
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

