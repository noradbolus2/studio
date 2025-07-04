
"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { BilingualText } from "@/components/shared/BilingualText";
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeft, CheckCircle, XCircle, Lightbulb, BookOpen, Target, Image as ImageIcon, Timer, HelpCircle } from 'lucide-react';
import { generateExamTest, type GenerateExamTestInput, type GenerateExamTestOutput } from '@/ai/flows/generate-exam-test-flow';
import { useToast } from '@/hooks/use-toast';

interface AnswerSheet {
  [questionIndex: number]: number; // selectedOptionIndex
}

interface Result {
  questionText: string;
  isCorrect?: boolean;
  selectedOption?: string;
  correctOption?: string;
  modelAnswer?: string; // For subjective
  explanation?: string;
  diagramDataUri?: string;
  questionType: 'mcq' | 'subjective';
}

type Question = GenerateExamTestOutput['questions'][0];

const getSecondsPerQuestion = (examType: string): number => {
    const lowerExamType = examType.toLowerCase();
    if (lowerExamType.includes("neet ug")) return 60; // 200 Qs / 200 mins
    if (lowerExamType.includes("jee main")) return 120; // 90 Qs / 180 mins
    if (lowerExamType.includes("jee advanced")) return 180; // ~54 Qs per paper / 180 mins => ~3.33 mins/Q. Rounded to 3 mins.
    if (lowerExamType.includes("upsc cse prelims gs paper 1")) return 72; // 100 Qs / 120 mins
    if (lowerExamType.includes("cat varc")) return 100; // 24 Qs / 40 mins ~ 1.67 mins/Q
    if (lowerExamType.includes("cat dilr")) return 120; // 20 Qs / 40 mins = 2 mins/Q
    if (lowerExamType.includes("cat qa")) return 109; // 22 Qs / 40 mins ~ 1.82 mins/Q
    if (lowerExamType.includes("cat") && !lowerExamType.includes("section")) return 109; // Overall CAT average if no specific section
    if (lowerExamType.includes("neet ss")) return 90; // e.g., 100 Qs / 150 mins or 150 Qs / 150 mins. Using 90s as a general value.
    // Add more specific exam timings as needed
    return 90; // Default 1.5 minutes per question
};

const getMarkingScheme = (examType: string): { correct: number; incorrect: number } => {
    const lowerExamType = examType.toLowerCase();
    if (lowerExamType.includes("neet")) return { correct: 4, incorrect: -1 };
    if (lowerExamType.includes("jee main")) return { correct: 4, incorrect: -1 };
    if (lowerExamType.includes("jee advanced")) return { correct: 3, incorrect: -1 }; // Varies, but using a common pattern
    // Default for most others
    return { correct: 1, incorrect: 0 };
};


export default function AttemptTestPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  const testTitleFromQuery = searchParams.get('title') || "AI Generated Test";
  const examTypeFromQuery = searchParams.get('examType') || testTitleFromQuery;
  const subjectFromQuery = searchParams.get('subject');
  const numQuestionsFromQuery = searchParams.get('numQuestions') ? parseInt(searchParams.get('numQuestions') as string) : 5; // Default if not provided, but AI prompt may override

  const [isLoadingTest, setIsLoadingTest] = useState(true);
  const [testData, setTestData] = useState<GenerateExamTestOutput | null>(null);
  const [testError, setTestError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answerSheet, setAnswerSheet] = useState<AnswerSheet>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [maxMarks, setMaxMarks] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [unattemptedCount, setUnattemptedCount] = useState(0);
  const [results, setResults] = useState<Result[]>([]);

  const [timeLeft, setTimeLeft] = useState<number | null>(null); // in seconds
  const timerIdRef = useRef<NodeJS.Timeout | null>(null);

  const formatTime = (totalSeconds: number | null): string => {
    if (totalSeconds === null || totalSeconds < 0) return "00:00";
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSubmitTest = useCallback(() => {
    if (timerIdRef.current) {
      clearInterval(timerIdRef.current);
      timerIdRef.current = null;
    }
    if (!testData || isSubmitted) return;

    setIsSubmitted(true);
    const markingScheme = getMarkingScheme(examTypeFromQuery);
    let calculatedScore = 0;
    let numCorrect = 0;
    let numIncorrect = 0;
    
    const mcqQuestions = testData.questions.filter(q => q.questionType === 'mcq');
    const calculatedMaxMarks = mcqQuestions.length * markingScheme.correct;
    setMaxMarks(calculatedMaxMarks);

    const detailedResults: Result[] = testData.questions.map((q, index) => {
      if (q.questionType === 'mcq') {
        const selectedOptionIndex = answerSheet[index];
        if (selectedOptionIndex !== undefined) { // Attempted
            const isCorrect = selectedOptionIndex === q.correctAnswerIndex;
            if (isCorrect) {
              calculatedScore += markingScheme.correct;
              numCorrect++;
            } else {
              calculatedScore += markingScheme.incorrect;
              numIncorrect++;
            }
             return {
                questionType: 'mcq',
                questionText: q.questionText,
                selectedOption: selectedOptionIndex !== undefined ? q.options![selectedOptionIndex] : "Not Answered",
                correctOption: q.options![q.correctAnswerIndex!],
                isCorrect: isCorrect,
                explanation: q.explanation,
                diagramDataUri: q.diagramDataUri,
            };
        } else { // Not attempted
             return {
                questionType: 'mcq',
                questionText: q.questionText,
                selectedOption: "Not Answered",
                correctOption: q.options![q.correctAnswerIndex!],
                isCorrect: undefined, // Neither correct nor incorrect
                explanation: q.explanation,
                diagramDataUri: q.diagramDataUri,
            };
        }
      } else { // Subjective
        return {
          questionType: 'subjective',
          questionText: q.questionText,
          modelAnswer: q.modelAnswer,
          explanation: q.explanation,
          diagramDataUri: q.diagramDataUri,
        };
      }
    });
    
    setScore(calculatedScore);
    setCorrectCount(numCorrect);
    setIncorrectCount(numIncorrect);
    setUnattemptedCount(mcqQuestions.length - numCorrect - numIncorrect);
    setResults(detailedResults);
    
  }, [testData, answerSheet, isSubmitted, examTypeFromQuery]); 

  useEffect(() => {
    const loadTest = async () => {
      setIsLoadingTest(true);
      setTestError(null);
      try {
        const input: GenerateExamTestInput = {
          examNameOrType: examTypeFromQuery,
          subject: subjectFromQuery || undefined,
          numQuestions: numQuestionsFromQuery,
        };
        console.log("AttemptTestPage: Generating test with input:", input);
        const generatedTest = await generateExamTest(input);
        console.log("AttemptTestPage: Test data received:", generatedTest);

        if (generatedTest.testTitle.startsWith("Error:") && generatedTest.questions.length === 0) {
          const errorMessage = generatedTest.testTitle.replace("Error: ", "");
          setTestError(errorMessage);
        } else {
          setTestData(generatedTest);
        }
      } catch (err: any) {
        console.error("AttemptTestPage: Failed to generate test:", err);
        setTestError(err.message || "Could not load the test. Please try again.");
        toast({
          title: "Error Loading Test",
          description: err.message || "AI Guruji couldn't prepare this test right now.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingTest(false);
      }
    };
    loadTest();
  }, [examTypeFromQuery, subjectFromQuery, numQuestionsFromQuery, toast]);
  
  useEffect(() => {
    if (testData && testData.questions.length > 0 && !isSubmitted && timeLeft === null) {
      const secondsPerQuestion = getSecondsPerQuestion(examTypeFromQuery);
      const calculatedDurationSeconds = testData.questions.length * secondsPerQuestion; 
      setTimeLeft(calculatedDurationSeconds);
    }
  }, [testData, isSubmitted, timeLeft, examTypeFromQuery]);

  useEffect(() => {
    if (timeLeft === null || isSubmitted || !testData) {
      if (timerIdRef.current) {
          clearInterval(timerIdRef.current);
          timerIdRef.current = null;
      }
      return;
    }

    if (timeLeft <= 0) {
      if (timerIdRef.current) {
          clearInterval(timerIdRef.current);
          timerIdRef.current = null;
      }
      if (!isSubmitted) { 
        toast({
            title: "Time's Up!",
            description: "Your test has been automatically submitted.",
            variant: "destructive"
        });
        handleSubmitTest();
      }
      return;
    }

    if (timerIdRef.current) { 
        clearInterval(timerIdRef.current);
    }
    timerIdRef.current = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime !== null && prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => {
        if (timerIdRef.current) {
            clearInterval(timerIdRef.current);
            timerIdRef.current = null;
        }
    };
  }, [timeLeft, isSubmitted, testData, handleSubmitTest, toast]);


  const handleOptionChange = (questionIndex: number, optionIndex: number) => {
    setAnswerSheet(prev => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handleManualSubmit = () => {
    if (!isSubmitted) {
        handleSubmitTest(); 
        toast({
            title: "Test Submitted!",
            description: "Your test results are being calculated.",
        });
    }
  };


  if (isLoadingTest) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
        <LoadingSpinner size={48} />
        <p className="mt-4 text-muted-foreground"><BilingualText en="AI Guruji is preparing your test..." hi="AI गुरुजी आपका परीक्षण तैयार कर रहे हैं..." /></p>
      </div>
    );
  }

  if (testError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] p-4">
        <Alert variant="destructive" className="max-w-md text-center">
            <Target className="h-5 w-5"/>
          <AlertTitle><BilingualText en="Test Error" hi="परीक्षण त्रुटि" /></AlertTitle>
          <AlertDescription>{testError}</AlertDescription>
        </Alert>
        <Button variant="outline" onClick={() => router.back()} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> <BilingualText en="Go Back" hi="वापस जाओ" />
        </Button>
      </div>
    );
  }

  if (!testData || testData.questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] p-4">
        <Alert className="max-w-md text-center">
         <BookOpen className="h-5 w-5"/>
          <AlertTitle><BilingualText en="No Questions" hi="कोई प्रश्न नहीं" /></AlertTitle>
          <AlertDescription><BilingualText en="AI Guruji could not generate questions for this test. Please try different parameters." hi="AI गुरुजी इस परीक्षण के लिए प्रश्न उत्पन्न नहीं कर सके। कृपया भिन्न पैरामीटर आज़माएँ।" /></AlertDescription>
        </Alert>
         <Button variant="outline" onClick={() => router.back()} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> <BilingualText en="Go Back" hi="वापस जाओ" />
        </Button>
      </div>
    );
  }

  const currentQuestion = testData.questions[currentQuestionIndex];

  if (isSubmitted) {
    return (
      <div className="space-y-6">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-headline text-primary">
              <BilingualText en="Test Results" hi="परीक्षा परिणाम" />
            </CardTitle>
            <CardDescription>{testData.testTitle}</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-4xl font-bold text-primary">{score} / {maxMarks}</p>
            <p className="text-lg text-muted-foreground">
              <BilingualText en="Total Score" hi="कुल स्कोर" />
            </p>
            <div className="flex justify-center flex-wrap gap-x-4 gap-y-1 mt-4 text-sm">
                <p><CheckCircle className="inline h-4 w-4 text-green-500 mr-1"/>Correct: {correctCount}</p>
                <p><XCircle className="inline h-4 w-4 text-red-500 mr-1"/>Incorrect: {incorrectCount}</p>
                <p><HelpCircle className="inline h-4 w-4 text-gray-500 mr-1"/>Unattempted: {unattemptedCount}</p>
            </div>
          </CardContent>
        </Card>

        {results.map((result, index) => (
          <Card key={index} className={result.isCorrect ? "border-green-500 bg-green-500/5" : (result.questionType === 'subjective' ? "border-blue-500 bg-blue-500/5" : (result.isCorrect === false ? "border-red-500 bg-red-500/5" : "border-gray-500 bg-gray-500/5"))}>
            <CardHeader>
              <CardTitle className="text-md">
                <span className="text-sm font-normal text-muted-foreground">Q{index + 1}. </span>
                {result.diagramDataUri && (
                  <div className="my-2 p-2 border rounded-md bg-muted/20 max-w-md mx-auto">
                    <Image
                      src={result.diagramDataUri}
                      alt={`Diagram for question ${index + 1}`}
                      width={400}
                      height={300}
                      className="rounded-md object-contain mx-auto"
                      data-ai-hint="exam question diagram"
                    />
                  </div>
                )}
                {result.questionText}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-3">
              {result.questionType === 'mcq' && (
                  <div className="space-y-2">
                      <p><strong><BilingualText en="Your Answer:" hi="आपका उत्तर:" /></strong> {result.selectedOption} {result.isCorrect === true ? <CheckCircle className="inline h-4 w-4 text-green-500 ml-1" /> : (result.isCorrect === false ? <XCircle className="inline h-4 w-4 text-red-500 ml-1" /> : <HelpCircle className="inline h-4 w-4 text-gray-500 ml-1" />)}</p>
                      {result.isCorrect !== true && <div className="p-2 bg-green-500/10 rounded-md border border-green-500/30"><p><strong><BilingualText en="Correct Answer:" hi="सही उत्तर:" /></strong> {result.correctOption}</p></div>}
                  </div>
              )}
               {result.questionType === 'subjective' && result.modelAnswer && (
                 <div className="p-2 bg-blue-500/10 rounded-md border border-blue-500/30">
                  <p className="flex items-start gap-1.5"><BookOpen size={14} className="text-blue-500 mt-0.5 shrink-0"/> <strong><BilingualText en="Model Answer:" hi="मॉडल उत्तर:" /></strong> {result.modelAnswer}</p>
                </div>
               )}
              {result.explanation && (
                <div className="p-2 bg-yellow-500/10 rounded-md border border-yellow-500/30">
                  <p className="flex items-start gap-1.5"><Lightbulb size={14} className="text-yellow-500 mt-0.5 shrink-0"/> <strong><BilingualText en="Explanation:" hi="स्पष्टीकरण:" /></strong> {result.explanation}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        <Button onClick={() => router.push('/test-series')} className="w-full">
          <BilingualText en="Back to Test Series" hi="टेस्ट सीरीज़ पर वापस" />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-headline text-primary">{testData.testTitle}</CardTitle>
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="mr-1 h-4 w-4" /> <BilingualText en="Exit Test" hi="टेस्ट से बाहर निकलें" />
            </Button>
          </div>
          <CardDescription className="flex justify-between items-center text-sm">
            <span>
              <BilingualText en={`Question ${currentQuestionIndex + 1} of ${testData.questions.length}`} hi={`प्रश्न ${currentQuestionIndex + 1} का ${testData.questions.length}`} />
            </span>
            {timeLeft !== null && (
                <span className="flex items-center font-medium text-destructive">
                    <Timer className="mr-1 h-4 w-4"/>
                    {formatTime(timeLeft)}
                </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentQuestion.diagramDataUri && (
            <div className="my-4 p-2 border rounded-md bg-muted/30 shadow-sm max-w-lg mx-auto">
               <Image
                  src={currentQuestion.diagramDataUri}
                  alt={`Diagram for question ${currentQuestionIndex + 1}`}
                  width={500}
                  height={375}
                  className="rounded-md object-contain mx-auto"
                  data-ai-hint="exam question diagram"
                />
            </div>
          )}
          <p className="text-md font-semibold">{currentQuestion.questionText}</p>
          {currentQuestion.questionType === 'mcq' && currentQuestion.options && (
            <RadioGroup
              key={`q-group-${currentQuestionIndex}`}
              value={answerSheet[currentQuestionIndex]?.toString()}
              onValueChange={(value) => handleOptionChange(currentQuestionIndex, parseInt(value))}
              className="space-y-2"
            >
              {currentQuestion.options.map((option, index) => (
                <Label key={index} htmlFor={`q${currentQuestionIndex}-opt${index}`} className="flex items-center space-x-2 p-3 border rounded-md hover:bg-muted/50 cursor-pointer has-[:checked]:bg-primary/10 has-[:checked]:border-primary">
                  <RadioGroupItem value={index.toString()} id={`q${currentQuestionIndex}-opt${index}`} />
                  <span>{option}</span>
                </Label>
              ))}
            </RadioGroup>
          )}
          {currentQuestion.questionType === 'subjective' && (
             <Alert>
                <AlertTitle>Subjective Question</AlertTitle>
                <AlertDescription>
                    This is a subjective question. The model answer will be shown in the results after you submit the test.
                </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
            disabled={currentQuestionIndex === 0}
          >
            <BilingualText en="Previous" hi="पिछला" />
          </Button>
          {currentQuestionIndex < testData.questions.length - 1 ? (
            <Button onClick={() => setCurrentQuestionIndex(prev => prev + 1)}>
              <BilingualText en="Next" hi="अगला" />
            </Button>
          ) : (
            <Button onClick={handleManualSubmit} className="bg-green-600 hover:bg-green-700 text-white">
              <BilingualText en="Submit Test" hi="टेस्ट सबमिट करें" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
