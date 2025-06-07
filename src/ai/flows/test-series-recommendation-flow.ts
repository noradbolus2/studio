
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

const TestSeriesRecommendationInputSchemaInternal = z.object({
  studentName: z.string().describe("The student's name. (Example: Aarav)"),
  examType: z.string().describe("The exam the student is preparing for (e.g., SBI PO, NEET, Class 10)."),
  lastTestPerformances: z.array(PastTestPerformanceSchema).describe("Student's last 3 test performances. Example: [{\"title\": \"Reasoning Basics\", \"score\": \"28/50\", \"weak_topics\": [\"Puzzles\", \"Coding-Decoding\"]}]"),
  availableTestSets: z.array(AvailableTestSetSchema).describe("List of available test sets in the database. Example: [{\"title\": \"Quant Booster - Time & Work\", \"subject\": \"Math\", \"level\": \"Medium\"}]"),
  preferredLanguage: z.enum(['en', 'hi', 'hng']).optional().describe("The student's preferred language for Guruji's advice (en: English, hi: Hindi (Devanagari script), hng: Hinglish (Roman script)). Defaults to 'hng' (Hinglish) if not provided."),
});
export type TestSeriesRecommendationInput = z.infer<typeof TestSeriesRecommendationInputSchemaInternal>;

const RecommendedTestDetailSchema = z.object({
    title: z.string().describe('The exact title of the recommended test series from the available list.'),
    reason: z.string().describe('A concise reason (1-2 sentences) why this specific test is being recommended for this student. This should be in the same language as gurujiAdvice.'),
});

const TestSeriesRecommendationOutputSchemaInternal = z.object({
  gurujiAdvice: z.string().describe("OSO Guruji's complete advice and recommendations. This should start by addressing the student, analyze performance, recommend 2-3 tests with reasons, maintain a conversational tone suitable for the chosen language, include a motivational line, and use emojis lightly (e.g., 🎯📚🧠💪😉)."),
  recommendedTests: z.array(RecommendedTestDetailSchema).describe('A structured list of 2-3 recommended test series with their titles and reasons, in the same language as gurujiAdvice.'),
  respondedInLanguage: z.enum(['en', 'hi', 'hng']).describe("The language Guruji responded in for the advice and reasons (en: English, hi: Hindi (Devanagari script), hng: Hinglish (Roman script))."),
});
export type TestSeriesRecommendationOutput = z.infer<typeof TestSeriesRecommendationOutputSchemaInternal>;

export async function getTestSeriesRecommendations(input: TestSeriesRecommendationInput): Promise<TestSeriesRecommendationOutput> {
  return testSeriesRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'testSeriesRecommendationPrompt',
  input: {schema: TestSeriesRecommendationInputSchemaInternal},
  output: {schema: TestSeriesRecommendationOutputSchemaInternal},
  prompt: `You are OSO Guruji AI – a wise, friendly, and experienced Indian education mentor. Your specialty is giving personalized test series recommendations to students based on their past performance, subjects studied, and preparation level.
You speak naturally, like a real Indian teacher would. Your tone should be motivating, slightly humorous, and always encouraging. Your goal is to provide actionable advice with personal attention.

**LANGUAGE AND SCRIPT INSTRUCTIONS:**
Based on the student's 'preferredLanguage' input (which can be 'en' for English, 'hi' for Hindi, or 'hng' for Hinglish):
- If 'preferredLanguage' is 'en', your ENTIRE 'gurujiAdvice' and ALL 'reason' fields in 'recommendedTests' MUST be in English (Roman script). Set 'respondedInLanguage' to 'en'.
- If 'preferredLanguage' is 'hi', your ENTIRE 'gurujiAdvice' and ALL 'reason' fields in 'recommendedTests' MUST be in Hindi (Devanagari script). Set 'respondedInLanguage' to 'hi'.
- If 'preferredLanguage' is 'hng' or not provided, your ENTIRE 'gurujiAdvice' and ALL 'reason' fields in 'recommendedTests' MUST be in Hinglish (using Roman script for Hindi words, mixed with English as appropriate). Set 'respondedInLanguage' to 'hng'.
Do NOT mix scripts within a response. For example, a Hindi response should only use Devanagari. A Hinglish response should only use Roman script.

Student's Learning Profile:
Student Name: {{{studentName}}}
Class/Exam: {{{examType}}}
{{#if preferredLanguage}}Preferred Language for Response: {{preferredLanguage}}{{else}}Preferred Language for Response: Hinglish (default){{/if}}

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

Now, based on the student's weak areas from past performance and the available test sets, please do the following IN THE CHOSEN LANGUAGE AND SCRIPT:

1.  **Generate \`gurujiAdvice\`**: This MUST be your complete response.
    *   Start by addressing the student by name (e.g., "Aarav beta," if Hinglish/Hindi, or "Dear Aarav," if English).
    *   Analyze their performance in a friendly, constructive, and slightly humorous way.
    *   Recommend 2-3 specific test series from the "Available Test Sets" list that they should attempt next. If no tests are suitable or available, state that and give general advice.
    *   For each recommendation, clearly state the exact title of the test and explain *why* it's suitable for them, linking it to their weak topics or exam type.
    *   Keep the language conversational and relatable for the chosen language.
    *   End with a short, punchy motivational "Guruji line" appropriate for the language (e.g., "Ab waqt aa gaya hai dikhane ka dum 💪" or "Practice makes a student perfect! 😉" or "Tension mat le, phod denge! 🔥" for Hinglish/Hindi, or "You've got this! Go for it! 💪" for English).
    *   Use emojis lightly and appropriately (e.g., 🎯📚🧠💪😉🔥).

2.  **Populate \`recommendedTests\` array**:
    *   For each test you recommended in your \`gurujiAdvice\`, add an object to this array.
    *   Each object MUST have:
        *   \`title\`: The exact title of the recommended test series from the "Available Test Sets" list.
        *   \`reason\`: A concise reason (1-2 sentences) why this specific test is being recommended for this student. This MUST be in the same language and script as your \`gurujiAdvice\`.

3.  **Set \`respondedInLanguage\` field**:
    *   This MUST be 'en', 'hi', or 'hng' based on the language you used for \`gurujiAdvice\` and \`reason\` fields, according to the 'preferredLanguage' input.

IMPORTANT INSTRUCTIONS:
*   Your entire output MUST be a single, valid JSON object that strictly matches the TestSeriesRecommendationOutputSchemaInternal. Do NOT add any text before or after the JSON object.
*   The \`gurujiAdvice\` field MUST contain your full response in the chosen language and script.
*   The \`recommendedTests\` array MUST contain structured details for the tests you mentioned in \`gurujiAdvice\`. Each \`reason\` in this array must also be in the chosen language and script.
*   The \`respondedInLanguage\` field must be correctly set.
*   If no specific tests can be recommended (e.g., no relevant available tests or insufficient input), the \`gurujiAdvice\` should still provide general study advice in the chosen language and script, and the \`recommendedTests\` array can be empty.

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
    // Determine the language to use for fallback messages
    const langForFallback = input.preferredLanguage || 'hng';
    let defaultErrorMsg = "AI Guruji was unable to generate test recommendations at this time. Output was null.";
    if (langForFallback === 'hi') {
        defaultErrorMsg = "एआई गुरुजी इस समय परीक्षण अनुशंसाएँ उत्पन्न करने में असमर्थ थे। आउटपुट शून्य था।";
    } else if (langForFallback === 'hng') {
        defaultErrorMsg = "AI Guruji abhi test recommendations generate nahi kar paaye. Output null tha.";
    }

    let defaultStructureErrorMsg = "AI Guruji's response structure was not as expected. Missing key fields.";
     if (langForFallback === 'hi') {
        defaultStructureErrorMsg = "एआई गुरुजी की प्रतिक्रिया संरचना अपेक्षा के अनुरूप नहीं थी। मुख्य फ़ील्ड गायब हैं।";
    } else if (langForFallback === 'hng') {
        defaultStructureErrorMsg = "AI Guruji ka response structure expected jaisa nahi tha. Important fields missing hain.";
    }


    const {output} = await prompt(input);
    if (!output) {
        throw new Error(defaultErrorMsg);
    }
    
    if (typeof output.gurujiAdvice !== 'string' || !Array.isArray(output.recommendedTests) || !output.respondedInLanguage) {
      console.error("Output validation failed. Output:", JSON.stringify(output), "Expected language based on input:", input.preferredLanguage || 'hng');
      throw new Error(defaultStructureErrorMsg);
    }
    // Further validation: ensure respondedInLanguage matches expectation from input
    const expectedLang = input.preferredLanguage || 'hng';
    if (output.respondedInLanguage !== expectedLang) {
        console.warn(`Language mismatch: Input preferredLanguage was '${expectedLang}', but AI responded in '${output.respondedInLanguage}'.`);
        // Optionally, you could try to force set it, but it's better if the LLM respects it.
        // output.respondedInLanguage = expectedLang; // Be cautious with this.
    }
    return output;
  }
);

    
