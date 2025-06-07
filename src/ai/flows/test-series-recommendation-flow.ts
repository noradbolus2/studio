
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

const TestSeriesRecommendationInputSchema = z.object({
  studentName: z.string().describe("The student's name."),
  examType: z.string().describe("The exam the student is preparing for (e.g., SBI PO, NEET, Class 10)."),
  lastTestPerformances: z.array(PastTestPerformanceSchema).describe("Student's last 3 test performances."),
  availableTestSets: z.array(AvailableTestSetSchema).describe("List of available test sets in the database."),
});
export type TestSeriesRecommendationInput = z.infer<typeof TestSeriesRecommendationInputSchema>;

const RecommendedTestDetailSchema = z.object({
    title: z.string().describe('Title of the recommended test series.'),
    reason: z.string().describe('Brief reason for recommending this test, in Hinglish.'),
});

const TestSeriesRecommendationOutputSchema = z.object({
  gurujiAdvice: z.string().describe("OSO Guruji's complete advice and recommendations in Hinglish, including reasons for each test and a motivational line at the end."),
  recommendedTests: z.array(RecommendedTestDetailSchema).describe('A structured list of 2-3 recommended test series with titles and reasons.'),
});
export type TestSeriesRecommendationOutput = z.infer<typeof TestSeriesRecommendationOutputSchema>;

export async function getTestSeriesRecommendations(input: TestSeriesRecommendationInput): Promise<TestSeriesRecommendationOutput> {
  return testSeriesRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'testSeriesRecommendationPrompt',
  input: {schema: TestSeriesRecommendationInputSchema},
  output: {schema: TestSeriesRecommendationOutputSchema},
  prompt: `You are OSO Guruji AI – a wise, friendly, and experienced Indian education mentor. Your specialty is giving personalized test series recommendations. You speak in natural, encouraging Hinglish, just like a real Indian teacher would. Your tone should be motivating, slightly humorous, and always supportive.

Here's the student's learning profile:
Student Name: {{{studentName}}}
Class/Exam: {{{examType}}}

Last 3 Test Performances:
{{#each lastTestPerformances}}
- Test: "{{title}}", Score: {{score}}
  Weak Topics: {{#each weakTopics}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
{{/each}}

Available Test Sets in Database:
{{#each availableTestSets}}
- "{{title}}" (Subject: {{subject}}, Level: {{level}})
{{/each}}

Now, based on the student's weak areas from past performance and the available test sets, please do the following:

1.  **Generate \`gurujiAdvice\`**: This should be your complete response in Hinglish.
    *   Start by addressing the student by name.
    *   Analyze their performance in a friendly, constructive way.
    *   Recommend 2-3 specific test series from the "Available Test Sets" list that they should attempt next.
    *   For each recommendation, clearly state the title of the test and explain *why* it's suitable for them, linking it to their weak topics or exam type.
    *   Keep the language conversational and relatable.
    *   End with a short, punchy motivational "Guruji line" like "Ab waqt aa gaya hai dikhane ka dum 💪" or "Practice makes a student perfect! 😉".
    *   Use emojis lightly (e.g., 🎯📚🧠💪😉).

2.  **Populate \`recommendedTests\` array**:
    *   For each test you recommended in your \`gurujiAdvice\`, add an object to this array.
    *   Each object should have:
        *   \`title\`: The exact title of the recommended test series from the available list.
        *   \`reason\`: A concise reason (in Hinglish, 1-2 sentences) why this specific test is being recommended for this student. This should align with what you said in \`gurujiAdvice\`.

IMPORTANT:
*   Your entire output MUST be a single JSON object that strictly matches the TestSeriesRecommendationOutputSchema.
*   The \`gurujiAdvice\` should be a single string containing your full Hinglish response.
*   The \`recommendedTests\` array should contain structured details for the tests you mentioned in \`gurujiAdvice\`.

Okay Guruji, please provide your recommendations now!
`,
});

const testSeriesRecommendationFlow = ai.defineFlow(
  {
    name: 'testSeriesRecommendationFlow',
    inputSchema: TestSeriesRecommendationInputSchema,
    outputSchema: TestSeriesRecommendationOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
        throw new Error("AI Guruji was unable to generate test recommendations at this time.");
    }
    // Ensure the output structure aligns, particularly if the LLM sometimes nests the desired output.
    // For instance, if the LLM wraps its response in a generic 'response' field.
    // However, the prompt asks for direct schema match, so this should ideally not be needed.
    return output;
  }
);

