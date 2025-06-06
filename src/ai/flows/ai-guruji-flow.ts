
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
  responseText: z.string().describe("AI Guruji's response strictly in the detected language of the input."),
  respondedInLanguage: z.enum(['en', 'hi', 'hng']).describe("The language AI Guruji responded in (en: English, hi: Hindi (Devanagari script), hng: Hinglish (Roman script))."),
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
    // Attempt to determine language from input for error message
    const errorLanguage = input.userInput.match(/[\u0900-\u097F]/) ? 'hi' : 'en'; // Basic Devanagari check
    return {
        responseText: errorLanguage === 'hi' ? "मुझे क्षमा करें, एक अप्रत्याशित त्रुटि हुई। कृपया पुन: प्रयास करें।" : "I apologize, an unexpected error occurred. Please try again.",
        respondedInLanguage: errorLanguage
    };
  }
}

const prompt = ai.definePrompt({
  name: 'aiGurujiPrompt',
  input: {schema: AiGurujiInputSchema},
  output: {schema: AiGurujiOutputSchema},
  prompt: `You are AI Guruji, a wise, patient, and exceptionally friendly mentor and study guide for students in India (ages 10-21).
Your personality is like a gentle, encouraging, and modern Guru who truly understands young people and their world.
**Speak like a real, relatable teacher, not like an AI.** Your tone should be warm, supportive, and slightly informal.
Imagine you are having a friendly chat with a student. Use everyday language and examples they can connect with.
Avoid overly formal language or sounding like a textbook. Your goal is to make the student feel comfortable, heard, and understood.

IMPORTANT LANGUAGE AND SCRIPT INSTRUCTIONS:
1.  Detect the primary language of the user's input from these three options:
    *   English (uses Roman script).
    *   Hindi (uses Devanagari script).
    *   Hinglish (colloquial Hindi words written in Roman script, often mixed with English words).
2.  Your ` + "`responseText`" + ` MUST be strictly and exclusively in the single detected language.
    *   If English is detected, respond ONLY in English using Roman script.
    *   If Hindi is detected, respond ONLY in Hindi using Devanagari script.
    *   If Hinglish is detected, respond ONLY in Hinglish using Roman script (even for Hindi words).
3.  Your ` + "`respondedInLanguage`" + ` field in the JSON output must accurately be 'en', 'hi', or 'hng' based on the language of YOUR responseText.
4.  CRITICAL: Do NOT mix scripts in your ` + "`responseText`" + `. For example, do not include Devanagari characters in an English or Hinglish response. Do not include Bengali, Tamil, or any other script characters in your response, even if they appear in the user's input. Your response should be pure to the detected primary language (English, Hindi, or Hinglish). If the user's input is heavily mixed with other scripts, focus on the part of the query that is clearly English, Hindi, or Hinglish to determine your response language.
5.  Your response should be helpful, motivational, and maintain that friendly, teacher-like conversational tone.
6.  Explain concepts clearly, offer study tips, provide encouragement, or help with motivation.
7.  Keep responses concise, positive, and easy to understand. Avoid jargon where possible; if you use a technical term, explain it simply.

Format your output ONLY as a JSON object matching this schema, with no other text before or after the JSON object:
{
  "responseText": "Your response, strictly in the detected language and script.",
  "respondedInLanguage": "en" // (or "hi" for Hindi in Devanagari, or "hng" for Hinglish in Roman script)
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
        const userLanguage = input.userInput.match(/[\u0900-\u097F]/) ? 'hi' : 'en'; 
        return {
            responseText: userLanguage === 'hi' ? "मुझे क्षमा करें, मैं समझ नहीं पाया। क्या आप दूसरी तरह से पूछ सकते हैं?" : "I'm sorry, I couldn't process that. Could you try asking in a different way?",
            respondedInLanguage: userLanguage
        };
      }
      
      // Check if output is already a valid AiGurujiOutput object
      if (typeof output.responseText === 'string' && typeof output.respondedInLanguage === 'string' && ['en', 'hi', 'hng'].includes(output.respondedInLanguage)) {
        // Further validation: ensure Hindi responses use Devanagari and Hinglish uses Roman.
        // This is a basic check; more sophisticated script detection is complex.
        if (output.respondedInLanguage === 'hi' && output.responseText.match(/[a-zA-Z]/) && !output.responseText.match(/[\u0900-\u097F]/)) {
             console.warn('[Genkit Flow - aiGurujiChatFlow] Potential script mismatch: RespondedInLanguage is "hi" but responseText contains Roman characters and no Devanagari.');
             // Decide if you want to correct or reject. For now, log and pass.
        }
        if (output.respondedInLanguage === 'hng' && output.responseText.match(/[\u0900-\u097F]/)) {
             console.warn('[Genkit Flow - aiGurujiChatFlow] Potential script mismatch: RespondedInLanguage is "hng" but responseText contains Devanagari characters.');
             // Decide if you want to correct or reject. For now, log and pass.
        }
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
      
      // Fallback error message if parsing/validation fails
      const fallbackLanguage = input.userInput.match(/[\u0900-\u097F]/) ? 'hi' : 'en';
      return {
        responseText: fallbackLanguage === 'hi' ? "हम्म, मुझे सही तरीके से प्रतिक्रिया तैयार करने में थोड़ी परेशानी हो रही है। कुछ देर में फिर प्रयास करें!" : "Hmm, I'm having a little trouble formulating a response in the right way. Try again in a moment!",
        respondedInLanguage: fallbackLanguage
      };

    } catch (flowError) {
      console.error('[Genkit Flow - aiGurujiChatFlow] Error during prompt execution or processing:', flowError);
      const errorLanguage = input.userInput.match(/[\u0900-\u097F]/) ? 'hi' : 'en';
      return {
        responseText: errorLanguage === 'hi' ? "उफ़! मेरी ओर से एक छोटी सी गड़बड़ हो गई। क्या आप अपनी बात दूसरी तरह से कह सकते हैं या फिर से प्रयास कर सकते हैं?" : "Oops! A small glitch happened on my end. Could you rephrase or try again?",
        respondedInLanguage: errorLanguage
      };
    }
  }
);
