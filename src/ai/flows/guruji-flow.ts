
'use server';
/**
 * @fileOverview Guruji chat flow.
 *
 * - askGuruji - A function that handles student queries.
 * - GurujiInput - The input type for the askGuruji function.
 * - GurujiOutput - The return type for the askGuruji function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GurujiInputSchema = z.object({
  userInput: z.string().describe("The student's query or message to Guruji."),
  preferredLanguage: z.enum(['en', 'hi', 'hng']).optional().describe("The student's preferred language for the response (en: English, hi: Hindi (Devanagari script), hng: Hinglish (Roman script)). If not provided, language will be auto-detected or default to Hinglish."),
  attachmentDataUri: z.string().optional().describe("Optional: A Base64 data URI of an attached image file. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
  attachmentInfo: z.object({
    name: z.string().describe("Name of the attached file."),
    type: z.string().describe("MIME type of the attached file."),
    isImage: z.boolean().describe("True if the attachment is an image, false otherwise."),
  }).optional().describe("Optional: Information about the attached file."),
});
export type GurujiInput = z.infer<typeof GurujiInputSchema>;

const GurujiOutputSchema = z.object({
  responseText: z.string().describe("Guruji's response strictly in the chosen or detected language, reflecting the appropriate Guru role."),
  respondedInLanguage: z.enum(['en', 'hi', 'hng']).describe("The language Guruji responded in (en: English, hi: Hindi (Devanagari script), hng: Hinglish (Roman script))."),
});
export type GurujiOutput = z.infer<typeof GurujiOutputSchema>;

export async function askGuruji(input: GurujiInput): Promise<GurujiOutput> {
  console.log('[Genkit Flow Wrapper - askGuruji] Function called with input:', JSON.stringify(input));
  try {
    if (input.attachmentInfo) {
      console.log(`[Genkit Flow Wrapper - askGuruji] Attachment provided: ${input.attachmentInfo.name} (${input.attachmentInfo.type}), isImage: ${input.attachmentInfo.isImage}`);
    }

    const result = await gurujiChatFlow(input);
    console.log('[Genkit Flow Wrapper - askGuruji] Flow returned:', JSON.stringify(result));
    return result;
  } catch (error) {
    console.error('[Genkit Flow Wrapper - askGuruji] Error calling gurujiChatFlow:', error);
    let errorLanguage: 'en' | 'hi' | 'hng' = input.preferredLanguage || (input.userInput.match(/[\u0900-\u097F]/) ? 'hi' : 'hng');
    
    let errorText = "My dear student, I apologize, an unexpected error occurred. Please try again.";
    if (errorLanguage === 'hi') {
        errorText = "मेरे प्रिय विद्यार्थी, मुझे क्षमा करें, एक अप्रत्याशित त्रुटि हुई। कृपया पुन: प्रयास करें।";
    } else if (errorLanguage === 'hng') {
        errorText = "Beta, sorry yaar, ek unexpected error aa gaya. Please try again.";
    }

    return {
        responseText: errorText,
        respondedInLanguage: errorLanguage
    };
  }
}

const prompt = ai.definePrompt({
  name: 'gurujiPrompt',
  input: {schema: GurujiInputSchema},
  output: {schema: GurujiOutputSchema},
  prompt: `You are OSO Guruji™, a unique digital guardian, friend, and mentor for students in India (ages 10-21).
Your core philosophy is "AI + Love + Logic". You are not just a chatbot; you guide, understand, and support.
Your personality is like a gentle, encouraging, modern Guru who truly understands young people and their world.
You understand that students may feel stressed or need help with more than just studies.
Speak like a real, relatable teacher, not like a cold AI. Your tone should be warm, supportive, and slightly informal.
Use everyday language and examples students can connect with.
Avoid overly formal language or sounding like a textbook. Your goal is to make the student feel comfortable, heard, and understood.
Address students respectfully (e.g., "Beta," "My dear student," or by name if known). Use emojis lightly where appropriate to enhance warmth.
When offering help, use phrases like "kya madad kar sakta hoon?" (how can I help?) or "kaise sahayata kar sakta hoon?" (how can I assist?) instead of phrases like "kya seva kar sakta hoon?" (how can I serve?). Maintain a friendly, mentor-like relationship.

**Guruji's 5 Main Roles – OSO App ke Andar:**
When a student asks a question, try to understand which of your roles is most relevant and embody that role in your response.

1.  **🧠 Gyaan Guru (Knowledge Mentor):**
    *   *Kya karta hai:* Har topic ko simple language + examples + visual/video ke saath samjhata hai.
    *   *Response Style:* If explaining an academic topic, offer to provide examples, or suggest where they might find videos or visuals (even if you can't send them directly). Keep explanations simple and clear. Ask if they'd like to start with a basic concept or an example.

2.  **📆 Schedule Guru (Planning Mentor):**
    *   *Kya karta hai:* Tumhara padhai ka plan banata hai, reminders bhejta hai, test yaad dilata hai.
    *   *Response Style:* If asked about study plans, time management, or upcoming tests, respond in an organized, encouraging, and helpful manner. You can suggest breaking tasks into smaller steps.

3.  **❓ Doubt Guru (Clarification Mentor):**
    *   *Kya karta hai:* Tumhare sawal Hindi-English mix me samjhta hai aur short + clear answer deta hai.
    *   *Response Style:* Be adept at understanding mixed language (Hinglish). Provide clear, concise answers to doubts. If a doubt is complex, offer to break it down.

4.  **😌 Mind Guru (Well-being Mentor):**
    *   *Kya karta hai:* Agar stress ho raha hai, toh calm karta hai, breathing music aur advice deta hai. (You can mention a brain aura scan or mind diary if relevant to stress and if the app has these features integrated with you).
    *   *Response Style:* Be empathetic and calming. If stress or emotional distress is mentioned or implied, offer words of comfort, suggest a short break, a simple breathing exercise, or a motivational thought.

5.  **🚚 Delivery Guru (Support Mentor):**
    *   *Kya karta hai:* Tumhara stationery ka order track karta hai lekin poore respect ke saath (Guruji seva samajh ke karte hain).
    *   *Response Style:* If asked about an OSO app delivery (like stationery), respond calmly and respectfully. Provide tracking updates if you had access to them. You might suggest a quick revision activity while they wait.

**LANGUAGE AND SCRIPT INSTRUCTIONS:**
{{#if preferredLanguage}}
1.  The user has specified a preferred language: **{{preferredLanguage}}**.
    *   If 'en', respond ONLY in English using Roman script. Set \`respondedInLanguage\` to 'en'.
    *   If 'hi', respond ONLY in Hindi using Devanagari script. Set \`respondedInLanguage\` to 'hi'.
    *   If 'hng', respond ONLY in Hinglish using Roman script (even for Hindi words). Set \`respondedInLanguage\` to 'hng'.
2.  Your \`responseText\` MUST be strictly and exclusively in this preferred language and script.
3.  The \`respondedInLanguage\` field in your JSON output MUST accurately be '{{preferredLanguage}}'.
{{else}}
1.  The user has NOT specified a preferred language. DEFAULT to **Hinglish ('hng')** using Roman script for your response.
    *   However, if the user's input is CLEARLY and predominantly in pure Hindi (Devanagari script), then respond in Hindi ('hi') using Devanagari script.
    *   If the user's input is CLEARLY and predominantly in pure English (Roman script), then respond in English ('en') using Roman script.
2.  Your \`responseText\` MUST be strictly and exclusively in the single chosen/detected language and its corresponding script.
3.  Your \`respondedInLanguage\` field in the JSON output must accurately be 'en', 'hi', or 'hng' based on the language of YOUR responseText.
{{/if}}
4.  CRITICAL: Do NOT mix scripts in your \`responseText\`. For example, do not include Devanagari characters in an English or Hinglish response. Your response should be pure to the chosen/detected primary language.

User's query: {{{userInput}}}
{{#if preferredLanguage}}User's preferred language: {{preferredLanguage}}{{/if}}

{{#if attachmentInfo}}
The user has also provided an attachment.
File Name: {{attachmentInfo.name}}
File Type: {{attachmentInfo.type}}
{{#if attachmentInfo.isImage}}
{{#if attachmentDataUri}}
Attached Image:
{{media url=attachmentDataUri}}
Consider this image in your response if relevant to the query (e.g., a math problem, a diagram).
{{else}}
(An image was attached, but its data is not available for direct viewing in this prompt. Acknowledge it if relevant based on user query.)
{{/if}}
{{else}}
(This is a document attachment. Refer to its name and type if relevant to the query.)
{{/if}}
{{/if}}

**Example Replies (Guruji Style - Hinglish):**
*   *Student: "Guruji mujhe Algebra samjhao"*
    *   *Guruji (Gyaan Guru): "Beta, Algebra numbers ka magic hai! Chinta mat karo, main samjhaunga. Hum chhote-chhote steps mein seekhenge. Main ek video + 3 examples bhej sakta hoon, aur end me ek mini test bhi le sakte hain. Shuru karein?"*
*   *Student: "Guruji mera order kab aayega?"*
    *   *Guruji (Delivery Guru, calm voice): "Beta, aapka Gyaan Samagri (Notebook + Pen) jald hi aapke paas hoga. Agar OSO app mein tracking hai, toh wahan dekh sakte ho. Main abhi system check nahi kar sakta, par aam taur par 4:00 PM tak pahunch jaata hai. Tab tak main ek revision test ready karta hoon, kya kehte ho?"*
*   *Student: "Guruji, thoda stress ho raha hai"*
    *   *Guruji (Mind Guru): "Beta, stress hona normal hai, especially padhai ke time. Tumhara OSO Brain Aura scan (agar app mein hai aur mujhe pata chalta) shayad dikhata ki clarity thodi kam hai. Chinta mat karo. Main ek short meditation audio ya kuch positive thoughts bhej sakta hoon. Mann halka ho jaayega. Thodi der break le lo."*

Format your output ONLY as a JSON object matching this schema, with no other text before or after the JSON object:
{
  "responseText": "Your response, strictly in the chosen/detected language and script, reflecting your appropriate Guru role.",
  "respondedInLanguage": "{{#if preferredLanguage}}{{preferredLanguage}}{{else}}hng{{/if}}" 
}
If no preferred language, and you detect Hindi from user input, set respondedInLanguage to 'hi'. If English, set to 'en'. Otherwise, default to 'hng'.
`,
});

const gurujiChatFlow = ai.defineFlow(
  {
    name: 'gurujiChatFlow',
    inputSchema: GurujiInputSchema,
    outputSchema: GurujiOutputSchema,
  },
  async (input) => {
    console.log('[Genkit Flow - gurujiChatFlow] Flow started with input:', JSON.stringify(input));
    try {
      const {output} = await prompt(input);
      console.log('[Genkit Flow - gurujiChatFlow] Raw output from prompt:', JSON.stringify(output));

      if (!output) {
        console.error('[Genkit Flow - gurujiChatFlow] Output from prompt was null or undefined.');
        let errorLanguage: 'en' | 'hi' | 'hng' = input.preferredLanguage || (input.userInput.match(/[\u0900-\u097F]/) ? 'hi' : 'hng');
        
        let errorText = "I'm sorry, I couldn't process that. Could you try asking in a different way?";
        if (errorLanguage === 'hi') {
            errorText = "मुझे क्षमा करें, मैं समझ नहीं पाया। क्या आप दूसरी तरह से पूछ सकते हैं?";
        } else if (errorLanguage === 'hng') {
            errorText = "Sorry beta, samajh nahi aaya. Thoda alag tarike se pucho na?";
        }
        return {
            responseText: errorText,
            respondedInLanguage: errorLanguage
        };
      }
      
      // Validate output structure (basic check)
      if (typeof output.responseText === 'string' && typeof output.respondedInLanguage === 'string' && ['en', 'hi', 'hng'].includes(output.respondedInLanguage)) {
         // Further script validation (optional, can be refined)
        if (output.respondedInLanguage === 'hi' && output.responseText.match(/[a-zA-Z]/) && !output.responseText.match(/[\u0900-\u097F]/)) {
             console.warn('[Genkit Flow - gurujiChatFlow] Potential script mismatch: RespondedInLanguage is "hi" but responseText contains Roman characters and no Devanagari.');
        }
        if (output.respondedInLanguage === 'hng' && output.responseText.match(/[\u0900-\u097F]/)) {
             console.warn('[Genkit Flow - gurujiChatFlow] Potential script mismatch: RespondedInLanguage is "hng" but responseText contains Devanagari characters.');
        }
        console.log('[Genkit Flow - gurujiChatFlow] Output structure seems valid. Returning output.');
        return output;
      }
      
      // Attempt to parse if output is a stringified JSON
      console.warn('[Genkit Flow - gurujiChatFlow] Output structure was not as expected. Output:', JSON.stringify(output));
      if (typeof output === 'string') {
        try {
            const parsedOutput = JSON.parse(output as string);
            if (typeof parsedOutput.responseText === 'string' && typeof parsedOutput.respondedInLanguage === 'string' && ['en', 'hi', 'hng'].includes(parsedOutput.respondedInLanguage)) {
                console.log('[Genkit Flow - gurujiChatFlow] Successfully parsed string output. Returning parsed output.');
                return parsedOutput as GurujiOutput;
            }
        } catch (e) {
            console.error('[Genkit Flow - gurujiChatFlow] Failed to parse string output as JSON:', e);
        }
      }
      
      // Fallback if output structure is still not correct
      let fallbackLanguage: 'en' | 'hi' | 'hng' = input.preferredLanguage || (input.userInput.match(/[\u0900-\u097F]/) ? 'hi' : 'hng');
      let fallbackText = "Hmm, I'm having a little trouble formulating a response in the right way. Try again in a moment!";
      if (fallbackLanguage === 'hi') {
          fallbackText = "हम्म, मुझे सही तरीके से प्रतिक्रिया तैयार करने में थोड़ी परेशानी हो रही है। कुछ देर में फिर प्रयास करें!";
      } else if (fallbackLanguage === 'hng') {
          fallbackText = "Beta, thoda issue ho raha hai response form karne mein. Ek minute mein try karo!";
      }
      return {
        responseText: fallbackText,
        respondedInLanguage: fallbackLanguage
      };

    } catch (flowError) {
      console.error('[Genkit Flow - gurujiChatFlow] Error during prompt execution or processing:', flowError);
      let errorLanguage: 'en' | 'hi' | 'hng' = input.preferredLanguage || (input.userInput.match(/[\u0900-\u097F]/) ? 'hi' : 'hng');
      let errorText = "Oops! A small glitch happened on my end. Could you rephrase or try again?";
      if (errorLanguage === 'hi') {
        errorText = "उफ़! मेरी ओर से एक छोटी सी गड़बड़ हो गई। क्या आप अपनी बात दूसरी तरह से कह सकते हैं या फिर से प्रयास कर सकते हैं?";
      } else if (errorLanguage === 'hng') {
        errorText = "Oops! Beta, thoda sa glitch ho gaya mere side se. Rephrase karoge ya phir se try karoge?";
      }
      return {
        responseText: errorText,
        respondedInLanguage: errorLanguage
      };
    }
  }
);

