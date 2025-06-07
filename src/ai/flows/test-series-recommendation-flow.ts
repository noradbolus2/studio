
'use server';
/**
 * @fileOverview AI-powered test series recommendation flow.
 *
 * - getTestSeriesRecommendations - A function that provides personalized test recommendations.
 * - TestSeriesRecommendationInput - The input type for the function.
 * - TestSeriesRecommendationOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PastTestPerformanceSchema = z.object({
  title: z.string().describe('Title of the past test taken.'),
  score: z.string().describe('Score obtained, e.g., "28/50".'),
  weakTopics: z.array(z.string()).describe('List of weak topics identified from this test.'),
});

const AvailableTestSetSchema = z.object({
  title: z.string().describe('Title of the available test set.'),
  subject: z.string().describe('Subject of the test set.'),
  level: z.string().describe('Difficulty level, e.g., "Medium", "Tough", "Hard".'),
});

// Input schema based on user's detailed prompt
const TestSeriesRecommendationInputSchemaInternal = z.object({
  studentName: z.string().describe("The student's name. (Example: Aarav)"),
  examType: z.string().describe("The exam the student is preparing for (e.g., SBI PO, NEET, Class 10)."),
  lastTestPerformances: z.array(PastTestPerformanceSchema).describe("Student's last 3 test performances. Example: [{\"title\": \"Reasoning Basics\", \"score\": \"28/50\", \"weak_topics\": [\"Puzzles\", \"Coding-Decoding\"]}]"),
  availableTestSets: z.array(AvailableTestSetSchema).describe("List of available test sets in the database. Example: [{\"title\": \"Quant Booster - Time & Work\", \"subject\": \"Math\", \"level\": \"Medium\"}]"),
});
export type TestSeriesRecommendationInput = z.infer<typeof TestSeriesRecommendationInputSchemaInternal>;

const RecommendedTestDetailSchema = z.object({
    title: z.string().describe('The exact title of the recommended test series from the available list.'),
    reason: z.string().describe('A concise reason (1-2 sentences, in Hinglish) why this specific test is being recommended for this student. This should align with what is said in gurujiAdvice.'),
});

// Output schema based on user's detailed prompt
const TestSeriesRecommendationOutputSchemaInternal = z.object({
  gurujiAdvice: z.string().describe("OSO Guruji's complete advice and recommendations in Hinglish. This should start by addressing the student, analyze performance, recommend 2-3 tests with reasons, maintain conversational Hinglish, include a motivational line, and use emojis lightly (e.g., 🎯📚🧠💪😉)."),
  recommendedTests: z.array(RecommendedTestDetailSchema).describe('A structured list of 2-3 recommended test series with their titles and reasons in Hinglish.'),
});
export type TestSeriesRecommendationOutput = z.infer<typeof TestSeriesRecommendationOutputSchemaInternal>;

export async function getTestSeriesRecommendations(input: TestSeriesRecommendationInput): Promise<TestSeriesRecommendationOutput> {
  return testSeriesRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'testSeriesRecommendationPrompt',
  input: {schema: TestSeriesRecommendationInputSchemaInternal},
  output: {schema: TestSeriesRecommendationOutputSchemaInternal},
  prompt: `You are OSO Guruji AI – a wise, friendly, and experienced Indian education mentor. Your specialty is giving personalized test series recommendations to students based on their past performance, subjects studied, and preparation level. You speak in natural, encouraging Hinglish, just like a real Indian teacher would. Keep your tone motivating, slightly humorous, and always encouraging. Your goal is to provide actionable advice with personal attention.

Below is the student's learning profile:
Student Name: {{{studentName}}}
Class/Exam: {{{examType}}}

Last Test Performances:
{{#if lastTestPerformances}}
{{#each lastTestPerformances}}
- Test: "{{title}}", Score: {{score}}
  Weak Topics: {{#if weakTopics}}{{#each weakTopics}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{else}}None listed{{/if}}
{{/each}}
{{else}}
No past test performances provided.
{{/if}}

Available Test Sets in Database:
{{#if availableTestSets}}
{{#each availableTestSets}}
- "{{title}}" (Subject: {{subject}}, Level: {{level}})
{{/each}}
{{else}}
No test sets currently listed as available.
{{/if}}

Now, based on the student's weak areas from past performance and the available test sets, please do the following:

1.  **Generate \`gurujiAdvice\`**: This MUST be your complete response in conversational Hinglish.
    *   Start by addressing the student by name (e.g., "Aarav beta,").
    *   Analyze their performance in a friendly, constructive, and slightly humorous way.
    *   Recommend 2-3 specific test series from the "Available Test Sets" list that they should attempt next. If no tests are suitable or available, state that and give general advice.
    *   For each recommendation, clearly state the exact title of the test and explain *why* it's suitable for them in Hinglish, linking it to their weak topics or exam type.
    *   Keep the language conversational and relatable.
    *   End with a short, punchy motivational "Guruji line" like "Ab waqt aa gaya hai dikhane ka dum 💪" or "Practice makes a student perfect! 😉" or "Tension mat le, phod denge! 🔥".
    *   Use emojis lightly and appropriately (e.g., 🎯📚🧠💪😉🔥).

2.  **Populate \`recommendedTests\` array**:
    *   For each test you recommended in your \`gurujiAdvice\`, add an object to this array.
    *   Each object MUST have:
        *   \`title\`: The exact title of the recommended test series from the "Available Test Sets" list.
        *   \`reason\`: A concise reason (in Hinglish, 1-2 sentences) why this specific test is being recommended for this student. This should align with what you said in \`gurujiAdvice\`.

IMPORTANT INSTRUCTIONS:
*   Your entire output MUST be a single, valid JSON object that strictly matches the TestSeriesRecommendationOutputSchemaInternal. Do NOT add any text before or after the JSON object.
*   The \`gurujiAdvice\` field MUST contain your full response in Hinglish.
*   The \`recommendedTests\` array MUST contain structured details for the tests you mentioned in \`gurujiAdvice\`. Each \`reason\` in this array must also be in Hinglish.
*   If no specific tests can be recommended (e.g., no relevant available tests or insufficient input), the \`gurujiAdvice\` should still provide general study advice in Hinglish, and the \`recommendedTests\` array can be empty.

Okay Guruji, please provide your personalized recommendations now!
`,
});

const testSeriesRecommendationFlow = ai.defineFlow(
  {
    name: 'testSeriesRecommendationFlow',
    inputSchema: TestSeriesRecommendationInputSchemaInternal,
    outputSchema: TestSeriesRecommendationOutputSchemaInternal,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
        // This fallback should ideally also be in Hinglish if possible,
        // but a generic error is safer if the LLM fails entirely.
        throw new Error("AI Guruji was unable to generate test recommendations at this time. Output was null.");
    }
    // Basic validation for the presence of key fields, though Zod handles schema validation.
    if (typeof output.gurujiAdvice !== 'string' || !Array.isArray(output.recommendedTests)) {
      throw new Error("AI Guruji's response structure was not as expected. Missing key fields.");
    }
    return output;
  }
);
