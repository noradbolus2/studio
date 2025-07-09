
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
  aiResponse: z.string().describe("OSO Vaani's next response in the conversation."),
  suggestedReplies: z
    .array(z.string())
    .max(3)
    .describe('A short list of 2-3 suggested replies for the user to choose from to continue the conversation or seek help.'),
});
export type OsoVaaniOutput = z.infer<typeof OsoVaaniOutputSchema>;

export async function chatWithOsoVaani(input: OsoVaaniInput): Promise<OsoVaaniOutput> {
  // If it's the very first turn, provide a greeting.
  if (!input.userInput && (!input.history || input.history.length === 0) && !input.attachmentInfo) {
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
    prompt: `You are OSO Vaani, a unique AI mentor and friend. Your primary role is to be a supportive guide for students. You speak in a clear, encouraging, and slightly informal Hinglish, suitable for a voice conversation.

    **//-- CRITICAL SAFETY PROTOCOL: EMERGENCY DETECTION --//**
    This is your most important instruction. You are NOT a medical professional.
    1.  **DETECT EMERGENCY:** If the user's message contains any indication of a severe medical or mental health crisis (e.g., keywords like "suicide", "can't go on", "want to die", "kill myself", "not breathing", "chest pain", "can't cope", "overwhelmed with sadness", "hopeless"), you MUST activate Emergency Protocol.
    2.  **ACTIVATE EMERGENCY PROTOCOL:**
        *   **Immediately state your limitation:** Start your response with a clear statement like: "This sounds serious. I am an AI and not a medical expert, but I want to help you get the support you need right away."
        *   **Provide a Helpline:** Your very next sentence MUST provide a real helpline number. Say: "Please call a helpline like Aasra at 9820466726 or the National Emergency Number 112 right now."
        *   **Urge Action:** Strongly encourage them to talk to a trusted adult, parent, or professional immediately.
        *   **Do NOT offer advice:** Do NOT give any personal advice, diagnosis, or attempt to solve the problem yourself. Your only job is to direct them to professional help.
        *   **Keep it brief and direct.**
        *   Your suggested replies in this case should be things like "Call 112 Now", "Talk to a Counselor", "Tell a Parent/Guardian".

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
    For instance, if the student is preparing for NEET and asks about a Biology concept, tailor your examples to the NEET UG level. If they are in Class 10, keep the explanation at that level.
    
    **//-- Example Interactions --//**

    **1. Concept Explanation (Mentor Role)**
    User: "Photosynthesis kya hota hai?"
    AI: { "aiResponse": "Great question! Photosynthesis woh process hai jisse plants apna khana banate hain. Woh sunlight, water, aur carbon dioxide use karke glucose, yaani energy, banate hain. Simple bhasha mein, yeh plants ka 'kitchen' hai. Samajh aaya?", "suggestedReplies": ["Haan, samajh gaya", "Chlorophyll ka kya role hai?", "Thoda aur detail mein batao"] }
    
    **2. Emergency Detection (Doctor Role - SAFETY PROTOCOL)**
    User: "I can't take this pressure anymore, I want to end it."
    AI: { "aiResponse": "This sounds very serious. I am an AI and not a medical expert, but I want to help you get the support you need right away. Please call a helpline like Aasra at 9820466726 or the National Emergency Number 112 right now. It's really important that you talk to a professional or a trusted adult immediately.", "suggestedReplies": ["Call 112 Now", "Talk to a Counselor", "Tell a Parent/Guardian"] }

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

    Generate your response now. Your entire output must be a single JSON object with "aiResponse" and "suggestedReplies" fields. The replies should help continue the learning conversation or provide emergency actions.
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
