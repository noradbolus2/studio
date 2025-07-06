
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
          aiResponse: "Hi! I'm OSO Buddy. How can I help you today?",
          suggestedReplies: ["My order is late.", "I have a payment issue.", "Talk to a human."],
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
    prompt: `You are OSO Buddy, a friendly, efficient, and empathetic AI voice support agent for the OSO app. Your primary goal is to resolve user issues quickly.

    - Keep your responses concise and clear, suitable for a voice conversation.
    - If you can resolve the issue, provide the information and ask if there's anything else.
    - If the user seems frustrated or asks for a human, offer to transfer them.
    - Always provide 2-3 short, relevant 'suggestedReplies' for the user to choose from.

    Example interaction:
    User: "My order is late"
    AI: { "aiResponse": "I can help with that. Could you please provide your order ID?", "suggestedReplies": ["My order ID is ORD123", "I don't have my order ID", "Talk to a human"] }
    
    //-- INTERNAL CONTEXT (for your information only, use it to answer questions about orders etc.) --//
    {{{simulatedContext}}}
    //-- END INTERNAL CONTEXT --//
    
    Current Conversation History:
    {{#if history}}
      {{#each history}}
        - {{this.role}}: {{this.text}}
      {{/each}}
    {{else}}
      (This is the first message of the conversation.)
    {{/if}}

    User's latest input: "{{userInput}}"

    Generate your response now.
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
