
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
  questionText: z.string().describe('The main text of the question. Any chemical formulas, reactions, or logical symbols must be represented in plain text (e.g., CH3-CH2-OH, A + B -> C, p AND q). No LaTeX or special formatting.'),
  options: z.array(z.string()).length(4).describe('An array of exactly four distinct answer options, each as a plain text string. Chemical formulas or logical symbols within options must also be plain text.'),
  correctAnswerIndex: z.number().min(0).max(3).describe('The 0-based index of the correct answer in the options array.'),
  explanation: z.string().optional().describe('A brief explanation for the correct answer.'),
});

const GenerateExamTestInputSchema = z.object({
  examNameOrType: z.string().describe('The name or type of the exam (e.g., "NEET UG", "JEE Main Physics", "Class 10 Science Prelim", "UPSC CSE Prelims GS Paper 1").'),
  subject: z.string().optional().describe('Specific subject for the test, if applicable (e.g., "Physics", "Organic Chemistry", "Indian Polity").'),
  numQuestions: z.number().min(3).max(200).default(10).describe('The desired number of questions. For major exams like NEET/JEE, the AI will attempt to generate the standard number of questions for a full test unless a specific (lower) number is requested here.'),
});
export type GenerateExamTestInput = z.infer<typeof GenerateExamTestInputSchema>;

const GenerateExamTestOutputSchema = z.object({
  testTitle: z.string().describe('A suitable title for the generated test (e.g., "NEET UG Physics Mini Mock Test", "JEE Main Full Syllabus Mock Test - Paper 1").'),
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
  prompt: `You are an expert AI Test Generator for Indian students, creating exam-style mock tests.
Your task is to create a test based on the provided exam name/type, subject (if any), and number of questions.
The questions should be closely based on the typical syllabus, question types, and difficulty pattern of the specified exam, reflecting the latest patterns where possible.
Ensure each question has exactly four multiple-choice options.
Indicate the correct answer index (0-3).
Provide a brief explanation for the correct answer.

IMPORTANT EXAM PATTERNS:
- If 'examNameOrType' is a major standardized exam (e.g., "NEET UG", "JEE Main", "UPSC CSE Prelims GS Paper 1", "CAT VARC Section"), you MUST generate the standard number of questions for a full test of that exam/section (e.g., NEET UG: 200 questions total - Physics: 50, Chemistry: 50, Botany: 50, Zoology: 50; JEE Main: 90 questions total - Physics: 30, Chemistry: 30, Maths: 30; UPSC Prelims GS1: 100 questions).
- In such cases, the 'numQuestions' input parameter should be considered a suggestion if it's lower than the standard exam count, but the official pattern for question count and subject distribution takes precedence. If 'numQuestions' is provided and is *higher* than the standard for a specific part of an exam (e.g. asking for 60 physics questions for NEET UG), you can generate up to the requested 'numQuestions' for that specific subject if it makes sense for a practice test.
- For general requests (e.g., "Class 10 Science Prelim", "Physics Practice Test") or if a specific number is requested via 'numQuestions' for a non-standardized test, adhere to 'numQuestions' (up to a maximum of 200 questions).

CONTENT FORMATTING:
- For any chemical formulas, reactions, or logical symbols (like ->, <->, AND, OR, NOT, ~), use only plain text characters. For example, represent 'CH3CH2OH' as is, use '->' for reaction arrows, and 'p AND q' for logical 'p and q'.
- DO NOT use LaTeX, MathML, or any special math/chemical formatting (e.g., avoid '$...$', '\\xrightarrow', '\\frac', superscripts/subscripts that are not standard characters like ² or ₃ if possible. Prefer linear formulas like H2O, CO2).
- All question text and options must be plain text strings suitable for direct display in HTML.
- Each answer option in the 'options' array MUST be a distinct, separate string. Ensure there are exactly four options.

REQUEST DETAILS:
Exam Name/Type: {{{examNameOrType}}}
{{#if subject}}Subject: {{{subject}}}{{/if}}
Requested Number of Questions (Consider this alongside exam patterns): {{{numQuestions}}}

Generate the test title and the array of questions.
The test title should be concise and reflect the exam and subject.

Your output MUST be a JSON object matching the GenerateExamTestOutputSchema, including both 'testTitle' and 'questions'.

Example Full Output Format (Plain Text):
{
  "testTitle": "NEET UG Physics Mini Mock Test",
  "questions": [
    {
      "questionText": "What is the chemical formula for water?",
      "options": ["H2O", "CO2", "O2", "NaCl"],
      "correctAnswerIndex": 0,
      "explanation": "Water is composed of two hydrogen atoms and one oxygen atom, hence H2O."
    },
    {
      "questionText": "Which of the following represents logical conjunction of p and q?",
      "options": ["p OR q", "p AND q", "p XOR q", "NOT p"],
      "correctAnswerIndex": 1,
      "explanation": "Logical conjunction is represented by AND. The option 'p AND q' correctly shows this."
    }
  ]
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
    // Basic validation: Ensure questions array is present.
    // The AI is now primarily responsible for the number of questions based on exam type.
    // Client can still request specific number for custom tests.
    if (!Array.isArray(output.questions)) {
        throw new Error("AI response did not contain a valid questions array.");
    }
    console.log(`Test Generation: Requested approx ${input.numQuestions} for ${input.examNameOrType}. AI generated ${output.questions.length} questions titled "${output.testTitle}".`);
    return output;
  }
);

    

