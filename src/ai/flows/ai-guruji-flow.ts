
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
  responseTextEn: z.string().describe("AI Guruji's response in English."),
  responseTextHi: z.string().describe("AI Guruji's response in Hindi or Hinglish."),
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
    // Rethrow or return a structured error object
    return {
        responseTextEn: "An unexpected error occurred while I was thinking. Please try again.",
        responseTextHi: "मैं सोच रहा था कि एक अप्रत्याशित त्रुटि हुई। कृपया पुन: प्रयास करें।"
    };
  }
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
    console.log('[Genkit Flow - aiGurujiChatFlow] Flow started with input:', JSON.stringify(input));
    try {
      const {output} = await prompt(input);
      console.log('[Genkit Flow - aiGurujiChatFlow] Raw output from prompt:', JSON.stringify(output));

      if (!output) {
        console.error('[Genkit Flow - aiGurujiChatFlow] Output from prompt was null or undefined.');
        return {
            responseTextEn: "I'm sorry, I couldn't process that. Could you try asking in a different way?",
            responseTextHi: "Maaf kijiyega, main samajh nahin paaya. Kya aap alag tarah se pooch sakte hain?"
        };
      }
      
      // Basic check if the output *looks* like our schema. 
      // Zod parsing would be more robust if model doesn't strictly adhere.
      if (typeof output.responseTextEn === 'string' && typeof output.responseTextHi === 'string') {
        console.log('[Genkit Flow - aiGurujiChatFlow] Output structure seems valid. Returning output.');
        return output;
      }
      
      console.error('[Genkit Flow - aiGurujiChatFlow] Output structure was not as expected. Output:', JSON.stringify(output));
      // Attempt to parse if it's a string that might contain JSON
      if (typeof output === 'string') {
        try {
            const parsedOutput = JSON.parse(output as string);
            if (typeof parsedOutput.responseTextEn === 'string' && typeof parsedOutput.responseTextHi === 'string') {
                console.log('[Genkit Flow - aiGurujiChatFlow] Successfully parsed string output. Returning parsed output.');
                return parsedOutput as AiGurujiOutput;
            }
        } catch (e) {
            console.error('[Genkit Flow - aiGurujiChatFlow] Failed to parse string output as JSON:', e);
        }
      }

      return {
        responseTextEn: "Hmm, I'm having a little trouble formulating a response in the right way. Try again in a moment!",
        responseTextHi: "Hmm, abhi thoda sa Fikr ho raha hai jawaab sahi tarike se dene mein. Thodi der mein koshish karein!"
      };
    } catch (flowError) {
      console.error('[Genkit Flow - aiGurujiChatFlow] Error during prompt execution or processing:', flowError);
      return {
        responseTextEn: "Oops! A small glitch happened on my end. Could you rephrase or try again?",
        responseTextHi: "उफ़! मेरी तरफ से एक छोटी सी गड़बड़ हो गई। क्या आप अपनी बात को दूसरी तरह से कह सकते हैं या पुनः प्रयास कर सकते हैं?"
      };
    }
  }
);
