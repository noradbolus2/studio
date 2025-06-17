
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

// Remove export for schema as it's not an async function
const GenerateExamTestInputSchema = z.object({
  examNameOrType: z.string().describe('The name or type of the exam (e.g., "NEET UG", "JEE Main Physics", "Class 10 Science Prelim").'),
  subject: z.string().optional().describe('Specific subject for the test, if applicable (e.g., "Physics", "Organic Chemistry").'),
  numQuestions: z.number().min(3).max(20).default(5).describe('The number of questions to generate (default is 5, min 3, max 20 for this prototype).'),
});
export type GenerateExamTestInput = z.infer<typeof GenerateExamTestInputSchema>;

// Remove export for schema as it's not an async function
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

IMPORTANT:
- For any chemical formulas, reactions, or logical symbols (like ->, <->, AND, OR, NOT, ~), use only plain text characters. For example, represent 'CH3CH2OH' as is, use '->' for reaction arrows, and 'p AND q' for logical 'p and q'.
- DO NOT use LaTeX, MathML, or any special math/chemical formatting (e.g., avoid '$...$', '\\xrightarrow', '\\frac', superscripts/subscripts that are not standard characters like ² or ₃ if possible. Prefer linear formulas like H2O, CO2).
- All question text and options must be plain text strings suitable for direct display in HTML.
- Each answer option in the 'options' array MUST be a distinct, separate string. Ensure there are exactly four options.

Exam Name/Type: {{{examNameOrType}}}
{{#if subject}}Subject: {{{subject}}}{{/if}}
Number of Questions: {{{numQuestions}}}

Generate the test title and the array of questions.
The test title should be concise and reflect the exam and subject.

Example Question Format (Plain Text):
{
  "questionText": "What is the chemical formula for water?",
  "options": ["H2O", "CO2", "O2", "NaCl"],
  "correctAnswerIndex": 0,
  "explanation": "Water is composed of two hydrogen atoms and one oxygen atom, hence H2O."
}

Example with Logical Symbols (Plain Text):
{
  "questionText": "Which of the following represents logical conjunction of p and q?",
  "options": ["p OR q", "p AND q", "p XOR q", "NOT p"],
  "correctAnswerIndex": 1,
  "explanation": "Logical conjunction is represented by AND. The option 'p AND q' correctly shows this."
}

Example with Chemical Reaction (Plain Text):
{
  "questionText": "Identify A in the reaction: CH3-CH=CH2 + HBr -> A",
  "options": ["CH3-CH2-CH2Br", "CH3-CHBr-CH3", "CH2Br-CH=CH2", "No reaction"],
  "correctAnswerIndex": 1,
  "explanation": "According to Markovnikov's rule, HBr adds to the double bond such that Br attaches to the carbon with fewer hydrogens."
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
        console.warn(`AI generated ${output.questions.length} questions, but ${input.numQuestions} were requested. Adjusting output based on actual generation.`);
        // Allow AI to sometimes generate slightly more or less if it struggles with exact count,
        // but it's good to be aware of discrepancies.
        // If strict count is needed, add: output.questions = output.questions.slice(0, input.numQuestions);
        // or throw an error if output.questions.length < input.numQuestions
    }
    return output;
  }
);

    
