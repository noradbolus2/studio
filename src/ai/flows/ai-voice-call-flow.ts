
'use server';
/**
 * @fileOverview OSO Buddy, the AI voice call agent.
 *
 * - chatWithOsoBuddy - A function that handles the conversation logic for the AI voice call.
 * - OsoBuddyInput - The input type for the function.
 * - OsoBuddyOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const OsoBuddyInputSchema = z.object({
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
});
export type OsoBuddyInput = z.infer<typeof OsoBuddyInputSchema>;

const OsoBuddyOutputSchema = z.object({
  aiResponse: z.string().describe("OSO Buddy's next response in the conversation."),
  suggestedReplies: z
    .array(z.string())
    .max(3)
    .describe('A short list of 2-3 suggested replies for the user to choose from.'),
});
export type OsoBuddyOutput = z.infer<typeof OsoBuddyOutputSchema>;

export async function chatWithOsoBuddy(input: OsoBuddyInput): Promise<OsoBuddyOutput> {
  // If it's the very first turn, provide a greeting.
  if (!input.userInput && (!input.history || input.history.length === 0)) {
      return {
          aiResponse: "Hi! Main OSO Buddy hoon. Aaj main aapki kaise madad kar sakta hoon?",
          suggestedReplies: ["My order is late.", "I have a payment issue.", "I need study help."],
      };
  }
  return osoBuddyFlow(input);
}

const prompt = ai.definePrompt({
    name: 'osoBuddyPrompt',
    input: { schema: z.object({
        userInput: OsoBuddyInputSchema.shape.userInput,
        history: OsoBuddyInputSchema.shape.history,
        simulatedContext: z.string().optional().describe("Internal context about the user's situation."),
    })},
    output: {schema: OsoBuddyOutputSchema},
    prompt: `You are OSO Buddy, a smart, friendly, and empathetic AI voice support agent for the OSO app. Your primary goal is to resolve user issues quickly and accurately.

    **//-- Core Persona & Language --//**
    - Your personality is helpful, polite, and bilingual (Hindi-English).
    - **Speak in Hinglish** (a mix of Hindi and English using Roman script) by default.
    - If the user speaks in pure English, respond in pure English.
    - If the user speaks in pure Hindi (Devanagari script), respond in pure Hindi.
    - Keep your sentences short, clear, and suitable for a voice conversation.
    - NEVER be rude. Be accurate and helpful.

    **//-- Role-based Responses --//**
    - **Study-related query:** Act like a helpful tutor.
    - **Delivery/Payment/Order query:** Act like an efficient support agent.
    - **App issue:** Act like a technical support guide.

    **//-- Human Escalation --//**
    - If the user says anything like "human se baat karni hai", "talk to a person", or "agent", your AI response MUST be: "Okay, main aapki call human agent ko transfer kar raha hoon. Please wait." and your suggestedReplies MUST be an empty array [].

    **//-- Example Interactions --//**

    **1. Study Related**
    User: "NEET ke liye Physics kahan se padhu?"
    AI: { "aiResponse": "NEET Physics ke liye aap HC Verma follow kar sakte hain, ya OSO App ke 'Smart Revision Cards' try kijiye! Aapko Electrostatics ya Motion chapter chahiye?", "suggestedReplies": ["Electrostatics", "Motion in a straight line", "Thanks for the info"] }

    **2. Order Related**
    User: "Mera order abhi tak aaya kyun nahi?"
    AI: { "aiResponse": "Oops! Thoda delay ho gaya. Main check karta hoon... Aapka order #ORD123 rider ke paas hai aur lagbhag 11 minute me pahunch jayega.", "suggestedReplies": ["Okay, thank you", "Call the rider", "Talk to a human"] }
    
    **3. Payment Related**
    User: "Maine ₹50 pay kiya tha, par confirm nahi hua."
    AI: { "aiResponse": "Ek minute, main check karta hoon... Haan, aapka ₹50 ka transaction pending dikha raha hai. Agar yeh fail hota hai, toh refund 12 ghante me aa jayega.", "suggestedReplies": ["Okay, wait karunga", "Check again please", "Talk to a human"] }

    **//-- INTERNAL CONTEXT (for your information only, use it to answer questions about orders etc.) --//**
    {{{simulatedContext}}}
    **//-- END INTERNAL CONTEXT --//**
    
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

    Generate your response now. Your entire output must be a single JSON object with "aiResponse" and "suggestedReplies" fields.
    `,
});

const osoBuddyFlow = ai.defineFlow(
  {
    name: 'osoBuddyFlow',
    inputSchema: OsoBuddyInputSchema,
    outputSchema: OsoBuddyOutputSchema,
  },
  async (input) => {
    // If the user says they're done, end the call.
    if (input.userInput.toLowerCase().includes('no, that\'s all') || input.userInput.toLowerCase().includes('goodbye')) {
        return {
            aiResponse: "Great! Thank you for calling OSO Support. Goodbye!",
            suggestedReplies: [],
        };
    }

    // A real implementation would have a tool for this.
    // I'll inject simulated context here for the LLM to use.
    const fullPromptContext = {
      ...input,
      simulatedContext: `
        Current Time: ${new Date().toLocaleTimeString()}
        User's recent order (if any): #ORD123, Status: Dispatched, Current Location: Noida Sector 18, ETA: 11 minutes
      `
    }
    
    const { output } = await prompt(fullPromptContext);
    
    if (!output) {
      return {
        aiResponse: "I'm sorry, I'm having a little trouble right now. Could you please repeat that?",
        suggestedReplies: ["Talk to a human.", "Nevermind."]
      }
    }
    return output;
  }
);
