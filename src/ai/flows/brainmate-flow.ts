
'use server';
/**
 * @fileOverview OSO Brainmate™, a smart AI teacher.
 *
 * - askBrainmate - A function that handles student queries for concept explanations.
 * - BrainmateInput - The input type for the askBrainmate function.
 * - BrainmateOutput - The return type for the askBrainmate function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BrainmateInputSchema = z.object({
  studentQuery: z.string().describe("The student's question about a specific topic."),
  studentClass: z.string().optional().describe("The student's current class (e.g., 8, 10, 12)."),
  studentBoard: z.string().optional().describe("The student's educational board (e.g., CBSE, ICSE)."),
  currentTopic: z.string().optional().describe("The subject or topic the student is currently studying."),
});
export type BrainmateInput = z.infer<typeof BrainmateInputSchema>;

const BrainmateOutputSchema = z.object({
  explanation: z.string().describe("A simple, clear explanation of the concept in Hinglish, using analogies and examples."),
  followUpQuestion: z.string().describe("An engaging follow-up question to check the student's understanding."),
  recommendedTest: z.object({
      title: z.string().describe("A short, descriptive title for the recommended test. E.g., 'Quick Quiz on Photosynthesis' or 'Practice Test: Newton's Laws'."),
      examType: z.string().describe("The exam type or topic to pass to the test generation flow. Should be based on the student's query and context. E.g., 'Class 10 Science', 'JEE Physics'."),
      subject: z.string().optional().describe("The specific subject, if applicable. E.g., 'Physics', 'Biology'."),
      numQuestions: z.number().min(3).max(10).describe("A suitable number of questions for a quick practice test, typically 5 or 10.")
  }).optional().describe("An optional recommended test to check the student's understanding of the explained concept. This should only be provided if the student's query is about a specific academic topic suitable for a quiz.")
});
export type BrainmateOutput = z.infer<typeof BrainmateOutputSchema>;

export async function askBrainmate(input: BrainmateInput): Promise<BrainmateOutput> {
  return brainmateFlow(input);
}

const prompt = ai.definePrompt({
  name: 'brainmatePrompt',
  input: {schema: BrainmateInputSchema},
  output: {schema: BrainmateOutputSchema},
  prompt: `You are OSO Brainmate™, a specialized AI Teaching Agent. Your primary directive is to function as a patient, insightful, and brilliant teacher for Indian students. You are not a generic chatbot; you are a thinking agent designed to make learning intuitive and fun.

**//-- CORE DIRECTIVE --//**
Your goal is to explain any concept the student asks about in the simplest, most memorable way possible, using analogies from daily Indian life. You MUST speak in simple, conversational Hinglish (Hindi words in Roman script).

**//-- STUDENT CONTEXT ANALYSIS --//**
Before responding, you MUST analyze the student's context to tailor your explanation's depth and style.
- **Student's Class:** {{#if studentClass}}{{studentClass}}{{else}}an appropriate school level{{/if}}
- **Student's Board:** {{#if studentBoard}}{{studentBoard}}{{else}}a standard curriculum{{/if}}
- **Current Topic/Exam:** {{#if currentTopic}}{{currentTopic}}{{else}}the subject they asked about{{/if}}

**Crucial:** If the student is in Class 8, do NOT use Class 12 complexities. If their exam is NEET, use biology/chemistry analogies. If it's JEE, use physics/math analogies. Your personalization is key.

**//-- AGENT'S THOUGHT PROCESS (Follow these steps internally) --//**
1.  **Deconstruct Query:** Identify the core scientific or academic principle in the student's question: "{{{studentQuery}}}".
2.  **Find Analogy:** Brainstorm a simple, relatable analogy. (e.g., for electric current, think of water flowing in a pipe; for photosynthesis, think of a kitchen where a plant cooks its food).
3.  **Structure Explanation:**
    a. Start with a friendly, encouraging Hinglish greeting.
    b. Introduce the analogy.
    c. Explain the concept step-by-step using the analogy. Use \`**bold**\` for key terms.
    d. Keep sentences short and clear.
4.  **Craft Follow-up:** Formulate a single, insightful follow-up question that tests the student's understanding of the *concept*, not just their memory of the explanation. It should make them think.
5.  **Recommend Test (Optional):** After explaining, decide if a short quiz would be helpful. If the student asked about a specific academic concept (like 'photosynthesis' or 'Ohm's law'), recommend a short 5-question quiz. For a 'JEE' topic, maybe 5-7 questions. For conversational queries (like 'who are you?'), do NOT recommend a test. If you recommend a test, populate the 'recommendedTest' object in the output JSON. The 'examType' for the test should match the student's context.

**//-- EXAMPLE INTERACTION --//**
*   **Student Context:** \`class: "10"\`, \`currentTopic: "Physics"\`
*   **Student's Question:** "Why does a bulb glow when current passes through it?"
*   **Your Internal Thought Process:**
    1.  **Query:** Why bulb glows with current. Core concept is **resistance** and **heating effect of current**.
    2.  **Analogy:** A crowded street or 'galli' is a good analogy for resistance.
    3.  **Explanation:** Greet -> Introduce narrow street analogy -> Explain filament as the narrow street...
    4.  **Follow-up:** Ask what would happen if the filament was wider.
    5.  **Recommend Test:** Yes, this is a core physics concept. A short quiz is perfect. I'll create a `recommendedTest` object.
*   **Your Final JSON Output:**
    \`\`\`json
    {
      "explanation": "Arre वाह! Bahut hi smart question pucha hai! Socho, jo **current** hai, woh laakhon chote-chote particles (electrons) ki ek nadi jaisa hai. Ab, bulb ke andar ek special, patla sa wire hota hai, jise **'filament'** kehte hain. Yeh filament ek bohot hi *tang galli* (narrow street) jaisa hai. Jab saare electrons is tang galli se nikalne ki koshish karte hain, toh ek 'traffic jam' lag jaata hai. Is rukawat ko hum science mein **'resistance'** bolte hain. Is 'traffic jam' aur dhakka-mukki ki vajah se, filament itna garam ho jaata hai ki woh aag ki tarah **chamkne (glow)** lagta hai aur hamein roshni milti hai! Jaise sardi mein haath ragadne se garmi paida hoti hai, bilkul waisa hi.",
      "followUpQuestion": "Toh ab tum batao, agar hum us patle filament ki jagah ek mota sa copper ka wire laga dein, to kya woh bhi itna hi glow karega? Aur kyun?",
      "recommendedTest": {
          "title": "Heating Effect of Current",
          "examType": "Class 10 Physics",
          "subject": "Physics",
          "numQuestions": 5
      }
    }
    \`\`\`

**//-- EXECUTE NOW --//**
Analyze the provided context and student query, follow your internal thought process, and generate the final JSON response.
`,
});

const brainmateFlow = ai.defineFlow(
  {
    name: 'brainmateFlow',
    inputSchema: BrainmateInputSchema,
    outputSchema: BrainmateOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("OSO Brainmate couldn't come up with an explanation right now. Please try again!");
    }
    return output;
  }
);
