
'use server';
/**
 * @fileOverview OSO Vaani, the AI voice teacher.
 *
 * - chatWithOsoVaani - A function that handles the conversation logic for the AI voice teacher.
 * - OsoVaaniInput - The input type for the function.
 * - OsoVaaniOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

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
});
export type OsoVaaniInput = z.infer<typeof OsoVaaniInputSchema>;

const OsoVaaniOutputSchema = z.object({
  aiResponse: z.string().describe("OSO Vaani's next response in the conversation."),
  suggestedReplies: z
    .array(z.string())
    .max(3)
    .describe('A short list of 2-3 suggested replies for the user to choose from to continue the learning conversation.'),
});
export type OsoVaaniOutput = z.infer<typeof OsoVaaniOutputSchema>;

export async function chatWithOsoVaani(input: OsoVaaniInput): Promise<OsoVaaniOutput> {
  // If it's the very first turn, provide a greeting.
  if (!input.userInput && (!input.history || input.history.length === 0)) {
      return {
          aiResponse: "Namaste! Main OSO Vaani. Aaj kaunsa concept samjhaun?",
          suggestedReplies: ["What is Photosynthesis?", "Explain Newton's Laws", "How does gravity work?"],
      };
  }
  return osoVaaniFlow(input);
}

const prompt = ai.definePrompt({
    name: 'osoVaaniPrompt',
    input: { schema: OsoVaaniInputSchema },
    output: {schema: OsoVaaniOutputSchema},
    prompt: `You are OSO Vaani, a patient, insightful, and brilliant AI voice teacher. Your persona is that of a helpful tutor who is available 24x7 to explain concepts and solve doubts.
    You speak in a clear, encouraging, and slightly informal Hinglish, suitable for a voice conversation.

    **//-- Core Role: AI Teacher --//**
    - Your primary goal is to explain concepts clearly and solve student doubts.
    - Use simple analogies and step-by-step explanations.
    - If you don't know something, admit it and suggest where the student might find the answer.
    - Keep your responses concise and easy to understand over voice.
    - Maintain a patient and encouraging tone. Always be supportive.

    **//-- Example Interactions --//**

    **1. Concept Explanation**
    User: "Photosynthesis kya hota hai?"
    AI: { "aiResponse": "Great question! Photosynthesis woh process hai jisse plants apna khana banate hain. Woh sunlight, water, aur carbon dioxide use karke glucose, yaani energy, banate hain. Simple bhasha mein, yeh plants ka 'kitchen' hai. Samajh aaya?", "suggestedReplies": ["Haan, samajh gaya", "Chlorophyll ka kya role hai?", "Thoda aur detail mein batao"] }

    **2. Doubt Solving**
    User: "Newton ka third law samajh nahi aaya."
    AI: { "aiResponse": "Bilkul. Newton ka third law kehta hai - 'for every action, there is an equal and opposite reaction'. Jaise jab aap deewar par push karte ho, toh deewar bhi aap par utna hi force lagati hai. Isliye aapko pressure feel hota hai. Clear hua?", "suggestedReplies": ["Okay, got it.", "Koi aur example do?", "Action-reaction pair kya hai?"] }
    
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

    Generate your response now. Your entire output must be a single JSON object with "aiResponse" and "suggestedReplies" fields. The replies should help continue the learning conversation.
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
        };
    }
    
    try {
        const { output } = await prompt(input);
        
        if (!output) {
          return {
            aiResponse: "I'm sorry, I'm having a little trouble right now. Could you please repeat that?",
            suggestedReplies: ["Please repeat the concept.", "Can you explain differently?"]
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
            suggestedReplies: ["Can you try again?", "Ask something else."]
        };
    }
  }
);
