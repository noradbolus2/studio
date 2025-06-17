
'use server';
/**
 * @fileOverview AI flow to generate an exam-style test series.
 *
 * - generateExamTest - A function that generates a list of questions for a given exam type/subject.
 * - GenerateExamTestInput - The input type for the function.
 * - GenerateExamTestOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const QuestionSchema = z.object({
  questionText: z.string().describe('The main text of the question.'),
  options: z.array(z.string()).length(4).describe('An array of exactly four answer options.'),
  correctAnswerIndex: z.number().min(0).max(3).describe('The 0-based index of the correct answer in the options array.'),
  explanation: z.string().optional().describe('A brief explanation for the correct answer.'),
});

const GenerateExamTestInputSchema = z.object({
  examNameOrType: z.string().describe('The name or type of the exam (e.g., "NEET UG", "JEE Main Physics", "Class 10 Science Prelim").'),
  subject: z.string().optional().describe('Specific subject for the test, if applicable (e.g., "Physics", "Organic Chemistry").'),
  numQuestions: z.number().min(3).max(20).default(5).describe('The number of questions to generate (default is 5, min 3, max 20 for this prototype).'),
});
export type GenerateExamTestInput = z.infer<typeof GenerateExamTestInputSchema>;

const GenerateExamTestOutputSchema = z.object({
  testTitle: z.string().describe('A suitable title for the generated test (e.g., "NEET UG Physics Mini Mock Test").'),
  questions: z.array(QuestionSchema).describe('An array of generated questions.'),
});
export type GenerateExamTestOutput = z.infer<typeof GenerateExamTestOutputSchema>;

export async function generateExamTest(input: GenerateExamTestInput): Promise<GenerateExamTestOutput> {
  return generateExamTestFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateExamTestPrompt',
  input: {schema: GenerateExamTestInputSchema},
  output: {schema: GenerateExamTestOutputSchema},
  prompt: `You are an expert AI Test Generator for Indian students.
Your task is to create a mock test based on the provided exam name/type, subject (if any), and number of questions.
The questions should be relevant to the typical syllabus and pattern of the specified exam.
Ensure each question has exactly four multiple-choice options.
Indicate the correct answer index (0-3).
Provide a brief explanation for the correct answer if possible.

Exam Name/Type: {{{examNameOrType}}}
{{#if subject}}Subject: {{{subject}}}{{/if}}
Number of Questions: {{{numQuestions}}}

Generate the test title and the array of questions.
The test title should be concise and reflect the exam and subject.

Example Question Format:
{
  "questionText": "What is the capital of France?",
  "options": ["Berlin", "Madrid", "Paris", "Rome"],
  "correctAnswerIndex": 2,
  "explanation": "Paris is the capital and most populous city of France."
}

Generate the test now.
`,
});

const generateExamTestFlow = ai.defineFlow(
  {
    name: 'generateExamTestFlow',
    inputSchema: GenerateExamTestInputSchema,
    outputSchema: GenerateExamTestOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
        throw new Error("AI failed to generate the test. Output was null.");
    }
    // Ensure numQuestions matches the output, or truncate/error as needed for robustness
    if (output.questions.length !== input.numQuestions) {
        console.warn(`AI generated ${output.questions.length} questions, but ${input.numQuestions} were requested. Truncating/padding if necessary or adjust numQuestions in schema.`);
        // For now, let's just return what we got, or you could truncate:
        // output.questions = output.questions.slice(0, input.numQuestions);
    }
    return output;
  }
);

