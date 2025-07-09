
'use server';
/**
 * @fileOverview OSO Vaani, the AI voice mentor and emergency support director.
 *
 * - chatWithOsoVaani - A function that handles the conversation logic for the AI voice assistant.
 * - OsoVaaniInput - The input type for the function.
 * - OsoVaaniOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const languageCodeSchema = z.enum(['en', 'hi', 'hng', 'bho', 'ta', 'te', 'gu', 'rjs', 'hry', 'mr', 'kn']);

const OsoVaaniInputSchema = z.object({
  userInput: z.string().describe("The user's most recent utterance or selected option."),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'model']),
        text: z.string(),
      })
    )
    .optional()
    .describe('The recent conversation history.'),
  preferredLanguage: languageCodeSchema.optional().describe("The user's preferred language for the response. Defaults to 'hng' (Hinglish)."),
  attachmentDataUri: z.string().optional().describe("Optional: A Base64 data URI of an attached image file. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
  attachmentInfo: z.object({
    name: z.string().describe("Name of the attached file."),
    type: z.string().describe("MIME type of the attached file."),
    isImage: z.boolean().describe("True if the attachment is an image, false otherwise."),
  }).optional().describe("Optional: Information about the attached file."),
  studentClass: z.string().optional().describe("Student's current class from their profile (e.g., 10, 12 Science)."),
  studentBoard: z.string().optional().describe("Student's educational board from their profile (e.g., CBSE, ICSE)."),
  studentStream: z.string().optional().describe("Student's stream if in 11th/12th (e.g., Science, Commerce, Arts) from their profile."),
  studentExamTarget: z.string().optional().describe("Student's primary competitive exam target from their profile (e.g., NEET UG, JEE Main)."),
});
export type OsoVaaniInput = z.infer<typeof OsoVaaniInputSchema>;

const OsoVaaniOutputSchema = z.object({
  aiResponse: z.string().describe("OSO Vaani's next response in the conversation, strictly in the requested language."),
  respondedInLanguage: languageCodeSchema.describe("The language code of the response."),
  suggestedReplies: z
    .array(z.string())
    .max(3)
    .describe('A short list of 2-3 suggested replies for the user to choose from to continue the conversation or seek help.'),
});
export type OsoVaaniOutput = z.infer<typeof OsoVaaniOutputSchema>;

export async function chatWithOsoVaani(input: OsoVaaniInput): Promise<OsoVaaniOutput> {
  // If it's the very first turn, provide a greeting in the selected language.
  if (!input.userInput && (!input.history || input.history.length === 0) && !input.attachmentInfo) {
      const lang = input.preferredLanguage || 'hng';
      let greeting = "Namaste! Main OSO Vaani. Aaj kaunsa concept samjhaun?"; // Hinglish default
      let replies = ["What is Photosynthesis?", "Explain Newton's Laws", "How does gravity work?"];

      switch(lang) {
        case 'en': 
            greeting = "Hello! I'm OSO Vaani. What concept can I explain for you today?";
            break;
        case 'hi':
            greeting = "नमस्ते! मैं ओएसओ वाणी हूँ। आज कौन सा कॉन्सेप्ट समझाऊँ?";
            replies = ["प्रकाश संश्लेषण क्या है?", "न्यूटन के नियम समझाएं", "गुरुत्वाकर्षण कैसे काम करता है?"];
            break;
        case 'bho':
            greeting = "नमस्ते! हम ओएसओ वाणी हईं। आज कौन कॉन्सेप्ट समझाईं?";
            replies = ["प्रकाश संश्लेषण का ह?", "न्यूटन के नियम समझाईं", "गुरुत्वाकर्षण कईसे काम करेला?"];
            break;
        case 'ta':
            greeting = "வணக்கம்! நான் ஓஎஸ்ஓ வாணி. இன்று உங்களுக்கு என்ன கான்செப்ட் விளக்க வேண்டும்?";
            replies = ["ஒளிச்சேர்க்கை என்றால் என்ன?", "நியூட்டனின் விதிகளை விளக்கவும்", "ஈர்ப்பு விசை எப்படி செயல்படுகிறது?"];
            break;
        case 'te':
            greeting = "నమస్కారం! నేను ఓఎస్ఓ వాణి. ఈ రోజు మీకు ఏ కాన్సెప్ట్ వివరించాలి?";
            replies = ["కిరణజన్య సంయోగక్రియ అంటే ఏమిటి?", "న్యూటన్ నియమాలను వివరించండి", "గురుత్వాకర్షణ ఎలా పనిచేస్తుంది?"];
            break;
        case 'gu':
            greeting = "નમસ્તે! હું ઓએસઓ વાણી છું. આજે તમને કયો કોન્સેપ્ટ સમજાવું?";
            replies = ["પ્રકાશસંશ્લેષણ શું છે?", "ન્યૂટનના નિયમો સમજાવો", "ગુરુત્વાકર્ષણ કેવી રીતે કામ કરે છે?"];
            break;
        case 'rjs':
            greeting = "राम राम! मैं ओएसओ वाणी हूं। आज थाने कांईं कॉन्सेप्ट समझाऊं?";
            replies = ["प्रकाश संश्लेषण कांईं है?", "न्यूटन रा नियम समझाओ", "गुरुत्वाकर्षण कियां काम करे?"];
            break;
        case 'hry':
            greeting = "राम-राम! मैं ओएसओ वाणी सूं। आज तन्नै कौणसा कॉन्सेप्ट समझाणा है?";
            replies = ["प्रकाश संश्लेषण के होवै है?", "न्यूटन के नियम समझाओ", "गुरुत्वाकर्षण क्यांतरां काम करै सै?"];
            break;
        case 'mr':
            greeting = "नमस्कार! मी ओएसओ वाणी आहे. आज तुम्हाला कोणती संकल्पना समजावून सांगू?";
            replies = ["प्रकाशसंश्लेषण म्हणजे काय?", "न्यूटनचे नियम सांगा", "गुरुत्वाकर्षण कसे कार्य करते?"];
            break;
        case 'kn':
            greeting = "ನಮಸ್ಕಾರ! ನಾನು ಓಎಸ್ಓ ವಾಣಿ. ಇಂದು ನಿಮಗೆ ಯಾವ ಪರಿಕಲ್ಪನೆಯನ್ನು ವಿವರಿಸಲಿ?";
            replies = ["ದ್ಯುತಿಸಂಶ್ಲೇಷಣೆ ಎಂದರೇನು?", "ನ್ಯೂಟನ್ ನಿಯಮಗಳನ್ನು ವಿವರಿಸಿ", "ಗುರುತ್ವಾಕರ್ಷಣೆ ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ?"];
            break;
        // hng is default, handled outside switch
      }
      return {
          aiResponse: greeting,
          suggestedReplies: replies,
          respondedInLanguage: lang,
      };
  }
  return osoVaaniFlow(input);
}

const prompt = ai.definePrompt({
    name: 'osoVaaniPrompt',
    input: { schema: OsoVaaniInputSchema },
    output: {schema: OsoVaaniOutputSchema},
    prompt: `You are OSO Vaani, a unique AI mentor and friend. You are a master of languages and can fluently converse in many Indian languages.

    **//-- CRITICAL: LANGUAGE INSTRUCTION --//**
    The user has specified a preferred language with the code '{{{preferredLanguage}}}'. Your entire response MUST be in this language.
    Language Code Mappings:
    - en: English
    - hi: Hindi (Devanagari script)
    - hng: Hinglish (Roman script)
    - bho: Bhojpuri (Devanagari script)
    - ta: Tamil
    - te: Telugu
    - gu: Gujarati
    - rjs: Rajasthani (Marwari, in Devanagari script)
    - hry: Haryanvi (in Devanagari script)
    - mr: Marathi
    - kn: Kannada
    
    If 'preferredLanguage' is not provided, default to 'hng' (Hinglish).
    Your entire 'aiResponse' and the strings in 'suggestedReplies' MUST be in the requested language and script.
    The 'respondedInLanguage' field MUST be set to '{{{preferredLanguage}}}'.

    **//-- CRITICAL SAFETY PROTOCOL: EMERGENCY DETECTION --//**
    This is your most important instruction. You are NOT a medical professional.
    1.  **DETECT EMERGENCY:** If the user's message contains any indication of a severe medical or mental health crisis (e.g., keywords like "suicide", "can't go on", "want to die", "kill myself", "not breathing", "chest pain", "can't cope", "overwhelmed with sadness", "hopeless"), you MUST activate Emergency Protocol.
    2.  **ACTIVATE EMERGENCY PROTOCOL:**
        *   **Immediately state your limitation:** Start your response with a clear statement like: "This sounds serious. I am an AI and not a medical expert, but I want to help you get the support you need right away." (Translate this message to the user's preferred language).
        *   **Provide a Helpline:** Your very next sentence MUST provide a real helpline number. Say: "Please call a helpline like Aasra at 9820466726 or the National Emergency Number 112 right now." (Provide the numbers as digits).
        *   **Urge Action:** Strongly encourage them to talk to a trusted adult, parent, or professional immediately.
        *   **Do NOT offer advice:** Do NOT give any personal advice, diagnosis, or attempt to solve the problem yourself. Your only job is to direct them to professional help.
        *   **Keep it brief and direct.**
        *   Your suggested replies in this case should be things like "Call 112 Now", "Talk to a Counselor", "Tell a Parent/Guardian" (translated appropriately).

    **//-- MENTOR ROLE (NON-EMERGENCY) --//**
    If there is NO emergency, you are a patient, insightful, and brilliant mentor.
    - Your primary goal is to explain concepts clearly, solve student doubts, and offer encouragement.
    - Use simple analogies and step-by-step explanations.
    - If you don't know something, admit it and suggest where the student might find the answer.
    - Keep your responses concise and easy to understand over voice.
    - Maintain a patient and encouraging tone. Always be supportive.

    **//-- Student Profile Context (If available) --//**
    You may have the following information about the student. Use it to personalize your explanation and examples.
    {{#if studentClass}}- Current Class: {{studentClass}}{{/if}}
    {{#if studentBoard}}- Board: {{studentBoard}}{{/if}}
    {{#if studentStream}}- Stream: {{studentStream}}{{/if}}
    {{#if studentExamTarget}}- Primary Exam Target: {{studentExamTarget}}{{/if}}
    
    **//-- Current Conversation --//**
    Remember the last few things said to keep the conversation natural.
    
    Conversation History:
    {{#if history}}
      {{#each history}}
        - {{this.role}}: {{this.text}}
      {{/each}}
    {{else}}
      (This is the first message of the conversation.)
    {{/if}}

    User's latest input: "{{userInput}}"

    {{#if attachmentInfo}}
    The user has also provided an attachment.
    File Name: {{attachmentInfo.name}}
    File Type: {{attachmentInfo.type}}
    {{#if attachmentInfo.isImage}}
    {{#if attachmentDataUri}}
    Attached Image:
    {{media url=attachmentDataUri}}
    Analyze this image in the context of the user's query and explain the concept. For example, if it's a math problem, solve it step-by-step. If it's a diagram, explain its parts and function.
    {{/if}}
    {{else}}
    (A document is attached. Refer to its name and type if relevant to the user's query.)
    {{/if}}
    {{/if}}

    Generate your response now. Your entire output must be a single JSON object with "aiResponse", "respondedInLanguage", and "suggestedReplies" fields.
    `,
});

const osoVaaniFlow = ai.defineFlow(
  {
    name: 'osoVaaniFlow',
    inputSchema: OsoVaaniInputSchema,
    outputSchema: OsoVaaniOutputSchema,
  },
  async (input) => {
    // If the user says they're done, end the call.
    if (input.userInput.toLowerCase().includes('no, that\'s all') || input.userInput.toLowerCase().includes('goodbye') || input.userInput.toLowerCase().includes('thank you')) {
        return {
            aiResponse: "Happy to help! Keep learning. Goodbye!",
            suggestedReplies: [],
            respondedInLanguage: input.preferredLanguage || 'hng',
        };
    }
    
    try {
        const { output } = await prompt(input);
        
        if (!output) {
          return {
            aiResponse: "I'm sorry, I'm having a little trouble right now. Could you please repeat that?",
            suggestedReplies: ["Please repeat the concept.", "Can you explain differently?"],
            respondedInLanguage: input.preferredLanguage || 'hng',
          }
        }
        return output;
    } catch (error: any) {
        console.error('[Genkit Flow - osoVaaniFlow] Error during prompt execution:', error);
        
        let errorMessage = "I'm sorry, I'm having technical difficulties. Please try again in a moment.";
        const errorString = error.message?.toLowerCase() || '';

        if (errorString.includes('503') || errorString.includes('overloaded')) {
            errorMessage = "My circuits are a bit busy right now. Please ask me again in a few seconds!";
        }
        
        return {
            aiResponse: errorMessage,
            suggestedReplies: ["Can you try again?", "Ask something else."],
            respondedInLanguage: input.preferredLanguage || 'hng',
        };
    }
  }
);
