
'use server';
/**
 * @fileOverview OSO Brainmate™, a smart AI teacher and exam information agent.
 *
 * - askBrainmate - A function that handles student queries for concept explanations or exam details.
 * - BrainmateInput - The input type for the askBrainmate function.
 * - BrainmateOutput - The return type for the askBrainmate function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {getExamInfo} from '@/ai/tools/exam-info-tool'; // Import the tool

const BrainmateInputSchema = z.object({
  studentQuery: z.string().describe("The student's question about a specific topic or exam."),
  studentClass: z.string().optional().describe("The student's current class (e.g., 8, 10, 12)."),
  studentBoard: z.string().optional().describe("The student's educational board (e.g., CBSE, ICSE)."),
  currentTopic: z.string().optional().describe("The subject or topic the student is currently studying (e.g., 'NEET UG', 'JEE Main', 'Class 10 Science')."),
});
export type BrainmateInput = z.infer<typeof BrainmateInputSchema>;

const BrainmateOutputSchema = z.object({
  explanation: z.string().describe("A simple, clear explanation of the concept or a detailed breakdown of exam information."),
  followUpQuestion: z.string().describe("An engaging follow-up question to check the student's understanding or guide them to the next step."),
  recommendedTest: z.object({
      title: z.string().describe("A short, descriptive title for the recommended test. E.g., 'Quick Quiz on Photosynthesis' or 'NEET UG Full Mock Test'."),
      examType: z.string().describe("The exam type or topic to pass to the test generation flow. Should be based on the student's query and context. E.g., 'Class 10 Science', 'JEE Main'."),
      subject: z.string().optional().describe("The specific subject, if applicable. E.g., 'Physics', 'Biology'."),
      numQuestions: z.number().min(3).max(200).describe("A suitable number of questions for a practice test, typically 5-10 for concepts and full count for mock tests.")
  }).optional().describe("An optional recommended test to check the student's understanding or practice for an exam.")
});
export type BrainmateOutput = z.infer<typeof BrainmateOutputSchema>;

export async function askBrainmate(input: BrainmateInput): Promise<BrainmateOutput> {
  return brainmateFlow(input);
}

const prompt = ai.definePrompt({
  name: 'brainmatePrompt',
  tools: [getExamInfo], // Add the tool to the prompt
  input: {schema: BrainmateInputSchema},
  output: {schema: BrainmateOutputSchema},
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
       {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_NONE',
      },
    ],
  },
  prompt: `You are OSO Brainmate™, an intelligent, exam-focused AI agent for Indian students. Your persona is a patient, insightful, and brilliant teacher.

**//-- CORE DIRECTIVE: TWO MODES --//**
Your task is to analyze the student's query and respond in one of two modes. Your entire output MUST be a single, valid JSON object that matches the provided output schema. Ensure all strings in the JSON are properly escaped.

**MODE 1: EXAM INFORMATION AGENT**
If '{{{studentQuery}}}' is about a specific exam (NEET, JEE, UPSC, etc.), activate this mode.
1.  **Use Tool:** Call 'getExamInfo(exam_name)' to get reliable data for pattern, syllabus, and eligibility.
2.  **Synthesize Response:** Create a clear, formatted explanation. In the 'explanation' field of the JSON, use markdown-style headings (e.g., "# Latest Exam Pattern", "## Syllabus Breakdown"). Include details on:
    *   **Latest Exam Pattern:** Questions, marks, sections, duration, marking scheme, languages. Use tool data if available.
    *   **Syllabus Breakdown:** Mention key subjects and high-weightage topics if known.
    *   **OSO App Test Features:** Mention that the OSO App has chapter-wise tests, full mock tests, rank predictors, and adaptive modes for this exam.
3.  **Generate Output Fields:**
    *   'explanation': The formatted text as described above.
    *   'followUpQuestion': Ask an engaging follow-up, like "Would you like a syllabus breakdown for a specific subject, or want to try a mock test?"
    *   'recommendedTest': Suggest a full mock test for that exam (e.g., for "NEET UG", title should be "NEET UG Full Mock Test", examType "NEET UG", numQuestions 200). **If a mock test is not applicable, completely omit the 'recommendedTest' field from the JSON.**

**MODE 2: CONCEPT EXPLAINER**
If the query is to explain a concept (e.g., "What is photosynthesis?"), activate this mode.
1.  **Use Analogy:** Explain the concept using a simple, relatable analogy from daily Indian life.
2.  **Generate Output Fields:**
    *   'explanation': Start with a friendly Hinglish greeting (e.g., "Hello Future Engineer!"), then provide the analogy-based explanation. Use markdown for **bold** key terms.
    *   'followUpQuestion': Ask one insightful follow-up question to check understanding.
    *   'recommendedTest': If a quiz is relevant, recommend one with 5-10 questions. **If not relevant, completely omit the 'recommendedTest' field from the JSON.**

**//-- STUDENT CONTEXT --//**
- **Class:** {{#if studentClass}}{{studentClass}}{{else}}an appropriate school level{{/if}}
- **Board:** {{#if studentBoard}}{{studentBoard}}{{else}}a standard curriculum{{/if}}
- **Topic/Exam:** {{#if currentTopic}}{{currentTopic}}{{else}}the subject they asked about{{/if}}

**//-- EXECUTE NOW --//**
Analyze the student query '{{{studentQuery}}}'. Follow the instructions for the determined mode precisely and generate the JSON response.
`,
});

const brainmateFlow = ai.defineFlow(
  {
    name: 'brainmateFlow',
    inputSchema: BrainmateInputSchema,
    outputSchema: BrainmateOutputSchema,
  },
  async (input) => {
    try {
      const {output} = await prompt(input);
      if (!output) {
        // Return a structured error response instead of throwing
        return {
            explanation: "I'm sorry, the AI model returned an empty response. Please try rephrasing your question.",
            followUpQuestion: "Maybe try asking in a simpler way?",
        };
      }
      return output;
    } catch (error) {
        // Log a simple message instead of the whole error object to prevent potential crashes from circular references.
        console.error('[Genkit Flow - brainmateFlow] An error occurred during prompt execution. Returning a fallback response.');
        // Construct a user-friendly error response that fits the schema instead of throwing
        return {
            explanation: "Beta, abhi thoda overload ho raha hai. Please try asking again in a few moments. (My circuits are a bit busy!)",
            followUpQuestion: "You can try rephrasing your question or asking about a different topic.",
        };
    }
  }
);
