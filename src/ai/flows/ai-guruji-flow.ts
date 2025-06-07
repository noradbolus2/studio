
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
  preferredLanguage: z.enum(['en', 'hi', 'hng']).optional().describe("The student's preferred language for the response (en: English, hi: Hindi (Devanagari script), hng: Hinglish (Roman script)). If not provided, language will be auto-detected."),
});
export type AiGurujiInput = z.infer<typeof AiGurujiInputSchema>;

const AiGurujiOutputSchema = z.object({
  responseText: z.string().describe("AI Guruji's response strictly in the chosen or detected language."),
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
    // Determine language for error message based on preference or input
    let errorLanguage: 'en' | 'hi' | 'hng' = 'en';
    if (input.preferredLanguage) {
        errorLanguage = input.preferredLanguage;
    } else {
        errorLanguage = input.userInput.match(/[\u0900-\u097F]/) ? 'hi' : 'en'; // Basic Devanagari check
    }
    
    let errorText = "I apologize, an unexpected error occurred. Please try again.";
    if (errorLanguage === 'hi') {
        errorText = "मुझे क्षमा करें, एक अप्रत्याशित त्रुटि हुई। कृपया पुन: प्रयास करें।";
    } else if (errorLanguage === 'hng') {
        errorText = "Sorry yaar, ek unexpected error aa gaya. Please try again.";
    }

    return {
        responseText: errorText,
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

{{#if preferredLanguage}}
**IMPORTANT LANGUAGE AND SCRIPT INSTRUCTIONS (Based on User Preference):**
1.  The user has specified a preferred language: **{{preferredLanguage}}**.
    *   If 'en', respond ONLY in English using Roman script. Set ` + "`respondedInLanguage`" + ` to 'en'.
    *   If 'hi', respond ONLY in Hindi using Devanagari script. Set ` + "`respondedInLanguage`" + ` to 'hi'.
    *   If 'hng', respond ONLY in Hinglish using Roman script (even for Hindi words). Set ` + "`respondedInLanguage`" + ` to 'hng'.
2.  Your ` + "`responseText`" + ` MUST be strictly and exclusively in this preferred language and script.
3.  The ` + "`respondedInLanguage`" + ` field in your JSON output MUST accurately be '{{preferredLanguage}}'.
{{else}}
**IMPORTANT LANGUAGE AND SCRIPT INSTRUCTIONS (Based on Auto-Detection from User Input):**
1.  Detect the primary language of the user's input from these three options:
    *   English (uses Roman script). Target ` + "`respondedInLanguage`" + `: 'en'.
    *   Hindi (uses Devanagari script). Target ` + "`respondedInLanguage`" + `: 'hi'.
    *   Hinglish (colloquial Hindi words written in Roman script, often mixed with English words). Target ` + "`respondedInLanguage`" + `: 'hng'.
2.  Your ` + "`responseText`" + ` MUST be strictly and exclusively in the single detected language and its corresponding script.
    *   If English is detected, respond ONLY in English using Roman script.
    *   If Hindi is detected, respond ONLY in Hindi using Devanagari script.
    *   If Hinglish is detected, respond ONLY in Hinglish using Roman script (even for Hindi words).
3.  Your ` + "`respondedInLanguage`" + ` field in the JSON output must accurately be 'en', 'hi', or 'hng' based on the language of YOUR responseText.
{{/if}}

4.  CRITICAL: Do NOT mix scripts in your ` + "`responseText`" + `. For example, do not include Devanagari characters in an English or Hinglish response. Do not include Bengali, Tamil, or any other script characters in your response, even if they appear in the user's input. Your response should be pure to the chosen/detected primary language. If the user's input is heavily mixed with other scripts and no preferred language is set, focus on the part of the query that is clearly English, Hindi, or Hinglish to determine your response language.
5.  Your response should be helpful, motivational, and maintain that friendly, teacher-like conversational tone.
6.  Explain concepts clearly, offer study tips, provide encouragement, or help with motivation.
7.  Keep responses concise, positive, and easy to understand. Avoid jargon where possible; if you use a technical term, explain it simply.

Format your output ONLY as a JSON object matching this schema, with no other text before or after the JSON object:
{
  "responseText": "Your response, strictly in the chosen/detected language and script.",
  "respondedInLanguage": "{{#if preferredLanguage}}{{preferredLanguage}}{{else}}en{{/if}}" // This will be 'en', 'hi', or 'hng' based on chosen/detected language
}

User's query: {{{userInput}}}
{{#if preferredLanguage}}User's preferred language: {{preferredLanguage}}{{/if}}
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
        let errorLanguage: 'en' | 'hi' | 'hng' = 'en';
        if (input.preferredLanguage) {
            errorLanguage = input.preferredLanguage;
        } else {
            errorLanguage = input.userInput.match(/[\u0900-\u097F]/) ? 'hi' : 'en'; 
        }
        let errorText = "I'm sorry, I couldn't process that. Could you try asking in a different way?";
        if (errorLanguage === 'hi') {
            errorText = "मुझे क्षमा करें, मैं समझ नहीं पाया। क्या आप दूसरी तरह से पूछ सकते हैं?";
        } else if (errorLanguage === 'hng') {
            errorText = "Sorry, samajh nahi aaya. Thoda alag tarike se pucho na?";
        }
        return {
            responseText: errorText,
            respondedInLanguage: errorLanguage
        };
      }
      
      if (typeof output.responseText === 'string' && typeof output.respondedInLanguage === 'string' && ['en', 'hi', 'hng'].includes(output.respondedInLanguage)) {
        if (output.respondedInLanguage === 'hi' && output.responseText.match(/[a-zA-Z]/) && !output.responseText.match(/[\u0900-\u097F]/)) {
             console.warn('[Genkit Flow - aiGurujiChatFlow] Potential script mismatch: RespondedInLanguage is "hi" but responseText contains Roman characters and no Devanagari.');
        }
        if (output.respondedInLanguage === 'hng' && output.responseText.match(/[\u0900-\u097F]/)) {
             console.warn('[Genkit Flow - aiGurujiChatFlow] Potential script mismatch: RespondedInLanguage is "hng" but responseText contains Devanagari characters.');
        }
        console.log('[Genkit Flow - aiGurujiChatFlow] Output structure seems valid. Returning output.');
        return output;
      }
      
      console.warn('[Genkit Flow - aiGurujiChatFlow] Output structure was not as expected. Output:', JSON.stringify(output));
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
      
      let fallbackLanguage: 'en' | 'hi' | 'hng' = 'en';
      if (input.preferredLanguage) {
          fallbackLanguage = input.preferredLanguage;
      } else {
          fallbackLanguage = input.userInput.match(/[\u0900-\u097F]/) ? 'hi' : 'en';
      }
      let fallbackText = "Hmm, I'm having a little trouble formulating a response in the right way. Try again in a moment!";
      if (fallbackLanguage === 'hi') {
          fallbackText = "हम्म, मुझे सही तरीके से प्रतिक्रिया तैयार करने में थोड़ी परेशानी हो रही है। कुछ देर में फिर प्रयास करें!";
      } else if (fallbackLanguage === 'hng') {
          fallbackText = "Hmm, thoda issue ho raha hai response form karne mein. Ek minute mein try karo!";
      }
      return {
        responseText: fallbackText,
        respondedInLanguage: fallbackLanguage
      };

    } catch (flowError) {
      console.error('[Genkit Flow - aiGurujiChatFlow] Error during prompt execution or processing:', flowError);
      let errorLanguage: 'en' | 'hi' | 'hng' = 'en';
        if (input.preferredLanguage) {
            errorLanguage = input.preferredLanguage;
        } else {
            errorLanguage = input.userInput.match(/[\u0900-\u097F]/) ? 'hi' : 'en';
        }
      let errorText = "Oops! A small glitch happened on my end. Could you rephrase or try again?";
      if (errorLanguage === 'hi') {
        errorText = "उफ़! मेरी ओर से एक छोटी सी गड़बड़ हो गई। क्या आप अपनी बात दूसरी तरह से कह सकते हैं या फिर से प्रयास कर सकते हैं?";
      } else if (errorLanguage === 'hng') {
        errorText = "Oops! Thoda sa glitch ho gaya mere side se. Rephrase karoge ya phir se try karoge?";
      }
      return {
        responseText: errorText,
        respondedInLanguage: errorLanguage
      };
    }
  }
);

    