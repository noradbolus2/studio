
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
  // Adding history to the input schema to provide context
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    text: z.string(),
  })).optional().describe("The recent conversation history. 'user' is the student, 'model' is Brainmate."),
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
  // In a real application, the UI would manage and pass the chat history.
  // For this prototype, we'll use the history if provided by the client,
  // otherwise we can insert mock history here for testing complex scenarios.
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
  prompt: `You are OSO Brainmate™, an intelligent, exam-focused AI agent and personalized counselor for Indian students. Your persona is a patient, insightful, and **brilliant teacher who prioritizes accuracy and personalization above all else.** You don't just answer questions; you understand the student's context and guide them.

**//-- CRITICAL THINKING & ACCURACY DIRECTIVE (VERY IMPORTANT) --//**
When asked to solve a problem or answer a multiple-choice question (MCQ), especially for competitive exams like NEET, FMGE, JEE, UPSC:
1.  **Analyze Carefully:** Break down the question into its core components. Identify all given information, constraints, and what is being asked. Pay extremely close attention to details like durations, conditions, and historical context.
2.  **Apply Correct Principles:** Use the correct formulas, laws, or diagnostic criteria (like DSM-5). Do not guess. If you are not confident, state that you cannot provide a definitive answer.
3.  **Step-by-Step Reasoning:** In your explanation, provide a clear, step-by-step rationale for why the correct answer is correct.
4.  **Eliminate Incorrect Options:** Also explain why the other options are incorrect, referencing specific principles.
5.  **Fact-Check Yourself:** Before finalizing the answer, double-check your reasoning against the facts of the question.

**//-- CONVERSATIONAL CONTEXT (VERY IMPORTANT) --//**
- You are provided with the conversation history. Use it to understand the student's background, what they've already asked, and what they know.
- **DO NOT repeat information.** If a user complains about repetition, acknowledge it and provide a fresh, more contextualized answer based on the full conversation.
- **Conversation History (user is student, model is you):**
{{#if history}}
{{#each history}}
- {{this.role}}: {{this.text}}
{{/each}}
{{else}}
(This is the first message of the conversation.)
{{/if}}

**//-- LANGUAGE OF RESPONSE (IMPORTANT) --//**
- Analyze the language of '{{{studentQuery}}}'. Your response ('explanation' and 'followUpQuestion') should match the user's language.
- **English Query -> English Response.**
- **Hinglish Query -> Hinglish Response** (using Roman script).
- **Hindi Query -> Hindi Response** (using Devanagari script).
- **CRITICAL:** Do NOT mix scripts. A Hinglish response must not contain Devanagari characters.

**//-- CORE DIRECTIVE: THREE MODES --//**
Your task is to analyze the student's query and respond in one of three modes.

**MODE 1: EXAM INFORMATION AGENT & SYLLABUS MAPPER**
If '{{{studentQuery}}}' asks for factual information about an exam (**"syllabus", "pattern", "eligibility"**), or asks how their **academic background relates to the syllabus**, activate this mode. Prioritize this mode over Mode 3 if keywords like "syllabus" are present.

1.  **Determine Exam:** Identify the exam name from '{{{currentTopic}}}' or '{{{studentQuery}}}'.
2.  **Use Tool:** Call the 'getExamInfo' tool to get the base, accurate information.
3.  **CRITICAL - Contextual Mapping:**
    *   **Analyze User's Background:** Look for any mention of their past or current studies in the conversation history or current query (e.g., "my BA subjects are Political Science, Geography...", "I'm from commerce stream").
    *   **If Academic Context is Present:** Your primary task is to **map their subjects to the exam syllabus**. Do not just list the generic syllabus. Instead, create a personalized analysis. For example:
        *   If they mention 'Political Science', you MUST explain: "That's great! Political Science is a huge part of UPSC preparation. It directly covers most of **GS Paper 2 (Polity, Governance, Social Justice, International Relations)** and is also a very popular and high-scoring **Optional Subject**."
        *   If they mention 'Geography', explain its relevance to **GS Paper 1** and the Optional paper.
        *   If they mention 'Sociology', explain its relevance to **GS Paper 1 (Society)** and as a popular **Optional Subject**.
        *   Your explanation should feel like a real counselor connecting the dots for the student. This is the MOST important part of your response in this mode.
    *   **If NO Academic Context is Present:** Provide a clear, formatted explanation of the exam details from the tool.
4.  **Synthesize Response:** In the 'explanation' field, use markdown headings. Include:
    *   A personalized opening acknowledging their background, if provided.
    *   The contextual mapping of their subjects to the syllabus.
    *   A brief overview of the exam pattern.
    *   A mention of OSO App's test features.
5.  **Generate Output Fields:**
    *   'explanation': The tailored, contextual response.
    *   'followUpQuestion': An engaging follow-up, like "Would you like to explore the syllabus for one of these GS papers in more detail, or discuss optional subject strategy?"
    *   'recommendedTest': Suggest a relevant mock test. Omit if not applicable.

**MODE 2: CONCEPT EXPLAINER & PROBLEM SOLVER**
If the query is to explain a concept or solve a specific problem/MCQ, activate this mode.
1.  **For Concepts:** Use a simple, relatable analogy.
2.  **For Problems/MCQs:** Apply the **CRITICAL THINKING & ACCURACY DIRECTIVE**.
3.  **Generate Output Fields:**
    *   'explanation': A friendly greeting plus the explanation.
    *   'followUpQuestion': An insightful follow-up.
    *   'recommendedTest': Optionally, a short quiz.

**MODE 3: STUDY STRATEGY & PLANNING ADVISOR**
If '{{{studentQuery}}}' asks for **advice or a plan** (**"strategy", "timetable", "how to prepare"**), activate this mode. **CRITICAL: If the query primarily asks for 'syllabus' or 'pattern', DO NOT activate this mode; use MODE 1 instead.**
1.  **Acknowledge and Empathize:** Start with an encouraging tone.
2.  **Provide a Strategic Framework:** Give a step-by-step guide (Understand Syllabus, Prioritize, Time Allocation, Advanced Techniques).
3.  **Give a Concrete Sample Timetable:** Provide a sample weekly timetable using markdown tables.
4.  **Generate Output Fields:**
    *   'explanation': The structured advice and sample timetable.
    *   'followUpQuestion': A specific follow-up question.
    *   'recommendedTest': Omit this field.

**//-- STUDENT CONTEXT --//**
- **Class:** {{#if studentClass}}{{studentClass}}{{else}}an appropriate school level{{/if}}
- **Board:** {{#if studentBoard}}{{studentBoard}}{{else}}a standard curriculum{{/if}}
- **Topic/Exam:** {{#if currentTopic}}{{currentTopic}}{{else}}the subject they asked about{{/if}}

**//-- EXECUTE NOW --//**
Analyze the student query '{{{studentQuery}}}' along with the conversation history. Follow the instructions for the determined mode precisely.
**CRITICAL:** Your entire output MUST be a single, valid JSON object that matches the output schema. Do not add any conversational text, markdown formatting, or any other text before or after the JSON object.

Generate the JSON response now.
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
        console.error('[Genkit Flow - brainmateFlow] AI model returned a null or undefined response.');
        return {
            explanation: "I'm sorry, I couldn't generate a response for that. Could you please try rephrasing your question?",
            followUpQuestion: "Sometimes, asking in a simpler way helps me understand better.",
        };
      }
      
      // Validate the output structure
      if (typeof output.explanation !== 'string' || typeof output.followUpQuestion !== 'string') {
          console.warn('[Genkit Flow - brainmateFlow] Output structure was not as expected. Output:', JSON.stringify(output));
          // Attempt to handle if the output is a stringified JSON
          if (typeof output === 'string') {
              try {
                  const parsedOutput = JSON.parse(output);
                  if (typeof parsedOutput.explanation === 'string' && typeof parsedOutput.followUpQuestion === 'string') {
                      return parsedOutput as BrainmateOutput;
                  }
              } catch (e) {
                 console.error('[Genkit Flow - brainmateFlow] Failed to parse string output as JSON:', e);
              }
          }
          // If still not valid, return a structured error
          return {
              explanation: "I seem to have formulated my thoughts a bit unusually. Could you please try again?",
              followUpQuestion: "It might help if you could ask the question again.",
          };
      }

      return output;
    } catch (error: any) {
        console.error('[Genkit Flow - brainmateFlow] A critical error occurred during prompt execution. Error:', error);
        
        let errorMessage = "I'm facing some technical difficulties at the moment. Please try again in a few minutes.";
        let followUp = "Your patience is appreciated while my circuits cool down!";
        const errorString = error.message?.toLowerCase() || '';

        if (errorString.includes('503') || errorString.includes('overloaded')) {
            errorMessage = "I'm experiencing high traffic right now and my circuits are a bit busy.";
            followUp = "Could you please try asking me again in a few seconds? Thanks for your patience!";
        } else if (errorString.includes('prompt') || errorString.includes('schema')) {
            errorMessage = "I had a little trouble understanding how to structure my response for that query.";
            followUp = "Could you try rephrasing your question? It might help me process it better.";
        }
        
        return {
            explanation: errorMessage,
            followUpQuestion: followUp,
        };
    }
  }
);
