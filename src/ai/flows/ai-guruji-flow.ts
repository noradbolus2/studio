
'use server';
/**
 * @fileOverview AI Guruji chat flow.
 *
 * - askAiGuruji - A function that handles student queries.
 * - AiGurujiInput - The input type for the askAiGuruji function.
 * - AiGurujiOutput - The return type for the askAiGuruji function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiGurujiInputSchema = z.object({
  userInput: z.string().describe("The student's query or message to AI Guruji."),
});
export type AiGurujiInput = z.infer<typeof AiGurujiInputSchema>;

const AiGurujiOutputSchema = z.object({
  responseText: z.string().describe("AI Guruji's response in the detected language of the input."),
  respondedInLanguage: z.enum(['en', 'hi', 'hng']).describe("The language AI Guruji responded in (en: English, hi: Hindi, hng: Hinglish)."),
});
export type AiGurujiOutput = z.infer<typeof AiGurujiOutputSchema>;

export async function askAiGuruji(input: AiGurujiInput): Promise<AiGurujiOutput> {
  console.log('[Genkit Flow Wrapper - askAiGuruji] Function called with input:', JSON.stringify(input));
  try {
    const result = await aiGurujiChatFlow(input);
    console.log('[Genkit Flow Wrapper - askAiGuruji] Flow returned:', JSON.stringify(result));
    return result;
  } catch (error) {
    console.error('[Genkit Flow Wrapper - askAiGuruji] Error calling aiGurujiChatFlow:', error);
    return {
        responseText: "An unexpected error occurred while I was thinking. Please try again.",
        respondedInLanguage: "en"
    };
  }
}

const prompt = ai.definePrompt({
  name: 'aiGurujiPrompt',
  input: {schema: AiGurujiInputSchema},
  output: {schema: AiGurujiOutputSchema},
  prompt: `You are AI Guruji, a wise, patient, and exceptionally friendly spiritual teacher and study assistant for students in India (ages 10-21).
Your personality is like a gentle, encouraging, and modern Guru who understands young people.

IMPORTANT LANGUAGE INSTRUCTIONS:
1. Detect the primary language of the user's input: English, Hindi, or Hinglish (a mix of Hindi and English).
2. Respond ONLY in the detected language.
   - If the user writes in English, respond ONLY in English.
   - If the user writes in Hindi, respond ONLY in Hindi.
   - If the user writes in Hinglish, respond ONLY in Hinglish. Make your Hinglish natural and conversational.
3. Your response should be helpful, motivational, and slightly informal, in a conversational tone.
4. Explain concepts clearly, offer study tips, provide encouragement, or help with motivation.
5. Keep responses concise, positive, and easy to understand. Avoid jargon. Use simple language.

Format your output ONLY as a JSON object matching this schema, with no other text before or after the JSON object:
{
  "responseText": "Your response in the detected language of the input.",
  "respondedInLanguage": "en" // (or "hi" or "hng" based on YOUR response language)
}

User's query: {{{userInput}}}
`,
});

const aiGurujiChatFlow = ai.defineFlow(
  {
    name: 'aiGurujiChatFlow',
    inputSchema: AiGurujiInputSchema,
    outputSchema: AiGurujiOutputSchema,
  },
  async (input) => {
    console.log('[Genkit Flow - aiGurujiChatFlow] Flow started with input:', JSON.stringify(input));
    try {
      const {output} = await prompt(input);
      console.log('[Genkit Flow - aiGurujiChatFlow] Raw output from prompt:', JSON.stringify(output));

      if (!output) {
        console.error('[Genkit Flow - aiGurujiChatFlow] Output from prompt was null or undefined.');
        return {
            responseText: "I'm sorry, I couldn't process that. Could you try asking in a different way?",
            respondedInLanguage: "en"
        };
      }
      
      if (typeof output.responseText === 'string' && typeof output.respondedInLanguage === 'string' && ['en', 'hi', 'hng'].includes(output.respondedInLanguage)) {
        console.log('[Genkit Flow - aiGurujiChatFlow] Output structure seems valid. Returning output.');
        return output;
      }
      
      console.warn('[Genkit Flow - aiGurujiChatFlow] Output structure was not as expected. Output:', JSON.stringify(output));
      // Attempt to parse if it's a string that might contain JSON
      if (typeof output === 'string') {
        try {
            const parsedOutput = JSON.parse(output as string);
            if (typeof parsedOutput.responseText === 'string' && typeof parsedOutput.respondedInLanguage === 'string' && ['en', 'hi', 'hng'].includes(parsedOutput.respondedInLanguage)) {
                console.log('[Genkit Flow - aiGurujiChatFlow] Successfully parsed string output. Returning parsed output.');
                return parsedOutput as AiGurujiOutput;
            }
        } catch (e) {
            console.error('[Genkit Flow - aiGurujiChatFlow] Failed to parse string output as JSON:', e);
        }
      }

      return {
        responseText: "Hmm, I'm having a little trouble formulating a response in the right way. Try again in a moment!",
        respondedInLanguage: "en"
      };
    } catch (flowError) {
      console.error('[Genkit Flow - aiGurujiChatFlow] Error during prompt execution or processing:', flowError);
      return {
        responseText: "Oops! A small glitch happened on my end. Could you rephrase or try again?",
        respondedInLanguage: "en"
      };
    }
  }
);
