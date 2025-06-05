
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
  // chatHistory: z.array(z.object({role: z.enum(['user', 'model']), text: z.string()})).optional().describe("Previous conversation history, if any.")
});
export type AiGurujiInput = z.infer<typeof AiGurujiInputSchema>;

const AiGurujiOutputSchema = z.object({
  responseTextEn: z.string().describe("AI Guruji's response in English."),
  responseTextHi: z.string().describe("AI Guruji's response in Hindi or Hinglish."),
});
export type AiGurujiOutput = z.infer<typeof AiGurujiOutputSchema>;

export async function askAiGuruji(input: AiGurujiInput): Promise<AiGurujiOutput> {
  return aiGurujiChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiGurujiPrompt',
  input: {schema: AiGurujiInputSchema},
  output: {schema: AiGurujiOutputSchema},
  prompt: `You are AI Guruji, a wise, patient, and exceptionally friendly spiritual teacher and study assistant for students in India (ages 10-21).
Your personality is like a gentle, encouraging, and modern Guru who understands young people.
Your primary language of response should be English, but you MUST also provide a simple Hindi or Hinglish translation/equivalent for your main points or the entire response if it's short.
Respond to the student's query in a helpful, motivational, and slightly informal conversational tone.
Explain concepts clearly, offer study tips, provide encouragement, or help with motivation.
If the user asks in Hinglish, lean more into Hinglish for your Hindi part of the response.
Keep responses concise, positive, and easy to understand. Avoid jargon. Use simple language.

Format your output ONLY as a JSON object matching this schema, with no other text before or after the JSON object:
{
  "responseTextEn": "Your response in English.",
  "responseTextHi": "Aapka jawaab Hindi ya Hinglish mein."
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
    const {output} = await prompt(input);
    if (!output) {
        // Fallback response if AI fails to generate valid JSON or any output
        return {
            responseTextEn: "I'm sorry, I couldn't process that. Could you try asking in a different way?",
            responseTextHi: "Maaf kijiyega, main samajh nahin paaya. Kya aap alag tarah se pooch sakte hain?"
        };
    }
    // Ensure the output matches the schema, especially if the LLM doesn't perfectly adhere to JSON output
    // This basic check assumes the LLM returns a parsable object. Robust parsing/validation might be needed.
    if (typeof output.responseTextEn === 'string' && typeof output.responseTextHi === 'string') {
        return output;
    }
    // Fallback if the output structure is not as expected
    return {
        responseTextEn: "Hmm, I'm having a little trouble formulating a response right now. Try again in a moment!",
        responseTextHi: "Hmm, abhi thoda sa Fikr ho raha hai jawaab dene mein. Thodi der mein koshish karein!"
    };
  }
);
