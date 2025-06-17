
"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, type FormEvent } from 'react';
import Image from 'next/image'; // Import next/image
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { BilingualText } from "@/components/shared/BilingualText";
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeft, CheckCircle, XCircle, Lightbulb, BookOpen, Target, Image as ImageIcon } from 'lucide-react';
import { generateExamTest, type GenerateExamTestInput, type GenerateExamTestOutput } from '@/ai/flows/generate-exam-test-flow';
import { useToast } from '@/hooks/use-toast';

interface AnswerSheet {
  [questionIndex: number]: number; // selectedOptionIndex
}

interface QuestionResult {
  questionText: string;
  selectedOption: string;
  correctOption: string;
  isCorrect: boolean;
  explanation?: string;
  diagramDataUri?: string; // Added for results page
}

// Define Question type based on the schema (it's part of GenerateExamTestOutput)
type Question = GenerateExamTestOutput['questions'][0];


export default function AttemptTestPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  const testTitleFromQuery = searchParams.get('title') || "AI Generated Test";
  const examTypeFromQuery = searchParams.get('examType') || testTitleFromQuery; 
  const subjectFromQuery = searchParams.get('subject');
  const numQuestionsFromQuery = searchParams.get('numQuestions') ? parseInt(searchParams.get('numQuestions') as string) : 5;

  const [isLoadingTest, setIsLoadingTest] = useState(true);
  const [testData, setTestData] = useState<GenerateExamTestOutput | null>(null);
  const [testError, setTestError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answerSheet, setAnswerSheet] = useState<AnswerSheet>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState<QuestionResult[]>([]);

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
        setTestData(generatedTest);
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

  const handleOptionChange = (questionIndex: number, optionIndex: number) => {
    setAnswerSheet(prev => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handleSubmitTest = () => {
    if (!testData) return;
    let correctAnswers = 0;
    const detailedResults: QuestionResult[] = testData.questions.map((q, index) => {
      const selectedOptionIndex = answerSheet[index];
      const isCorrect = selectedOptionIndex === q.correctAnswerIndex;
      if (isCorrect) {
        correctAnswers++;
      }
      return {
        questionText: q.questionText,
        selectedOption: selectedOptionIndex !== undefined ? q.options[selectedOptionIndex] : "Not Answered",
        correctOption: q.options[q.correctAnswerIndex],
        isCorrect: isCorrect,
        explanation: q.explanation,
        diagramDataUri: q.diagramDataUri, // Pass diagram URI to results
      };
    });
    setScore(correctAnswers);
    setResults(detailedResults);
    setIsSubmitted(true);
    toast({
        title: "Test Submitted!",
        description: `You scored ${correctAnswers} out of ${testData.questions.length}.`,
    });
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
            <p className="text-4xl font-bold text-primary">{score} / {testData.questions.length}</p>
            <p className="text-lg text-muted-foreground">
              <BilingualText en="Correct Answers" hi="सही उत्तर" />
            </p>
          </CardContent>
        </Card>

        {results.map((result, index) => (
          <Card key={index} className={result.isCorrect ? "border-green-500 bg-green-500/5" : "border-red-500 bg-red-500/5"}>
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
            <CardContent className="text-sm space-y-2">
              <p><strong><BilingualText en="Your Answer:" hi="आपका उत्तर:" /></strong> {result.selectedOption} {result.isCorrect ? <CheckCircle className="inline h-4 w-4 text-green-500 ml-1" /> : <XCircle className="inline h-4 w-4 text-red-500 ml-1" />}</p>
              {!result.isCorrect && <p><strong><BilingualText en="Correct Answer:" hi="सही उत्तर:" /></strong> {result.correctOption}</p>}
              {result.explanation && (
                <div className="mt-2 p-2 bg-muted/50 rounded-md">
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
          <CardDescription>
            <BilingualText en={`Question ${currentQuestionIndex + 1} of ${testData.questions.length}`} hi={`प्रश्न ${currentQuestionIndex + 1} का ${testData.questions.length}`} />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentQuestion.diagramDataUri && (
            <div className="my-4 p-2 border rounded-md bg-muted/30 shadow-sm max-w-lg mx-auto">
               <Image 
                  src={currentQuestion.diagramDataUri} 
                  alt={`Diagram for question ${currentQuestionIndex + 1}`} 
                  width={500} // Adjust as needed
                  height={375} // Adjust for aspect ratio
                  className="rounded-md object-contain mx-auto"
                  data-ai-hint="exam question diagram"
                />
            </div>
          )}
          <p className="text-md font-semibold">{currentQuestion.questionText}</p>
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
            <Button onClick={handleSubmitTest} className="bg-green-600 hover:bg-green-700 text-white">
              <BilingualText en="Submit Test" hi="टेस्ट सबमिट करें" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
