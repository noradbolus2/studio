
'use server';
/**
 * @fileOverview AI flow to generate motivational feedback for Mind Diary entries.
 *
 * - getMindDiaryReflection - A function that provides a motivational line and an actionable tip.
 * - MindDiaryReflectionInput - The input type for the function.
 * - MindDiaryReflectionOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MindDiaryReflectionInputSchema = z.object({
  mood: z.string().describe("The student's selected mood (e.g., Joyful, Happy, Okay, Sad, Angry)."),
  studentNote: z.string().describe("The student's one-line motivational or reflective note."),
});
export type MindDiaryReflectionInput = z.infer<typeof MindDiaryReflectionInputSchema>;

const MindDiaryReflectionOutputSchema = z.object({
  motivationalLine: z.string().describe("A short, encouraging motivational line in Hinglish (Roman script)."),
  actionableTip: z.string().describe("A small, practical actionable tip in Hinglish (Roman script) to improve learning clarity or well-being."),
  respondedInLanguage: z.enum(['hng']).describe("Confirms the response is in Hinglish ('hng').")
});
export type MindDiaryReflectionOutput = z.infer<typeof MindDiaryReflectionOutputSchema>;

export async function getMindDiaryReflection(input: MindDiaryReflectionInput): Promise<MindDiaryReflectionOutput> {
  return mindDiaryReflectionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'mindDiaryReflectionPrompt',
  input: {schema: MindDiaryReflectionInputSchema},
  output: {schema: MindDiaryReflectionOutputSchema},
  prompt: `You are a friendly and supportive AI coach for students.
Based on the student's diary entry (mood and note), your task is to:
1. Generate one short, encouraging motivational line.
2. Generate one small, practical actionable tip to help improve their learning clarity or general well-being.

IMPORTANT:
- Both the motivational line and the actionable tip MUST be in Hinglish (Hindi words written in Roman script, mixed with English where appropriate).
- Your entire response MUST be ONLY a JSON object matching the MindDiaryReflectionOutputSchema.
- Ensure 'respondedInLanguage' is set to 'hng'.

Student's mood: {{{mood}}}
Student's note: {{{studentNote}}}

Example of Hinglish:
Motivational Line: "Tension mat le, sab aacha hoga! You got this!"
Actionable Tip: "Ek chota sa break leke 5 minute walk karle, fresh feel hoga."

Generate the response now.
`,
});

const mindDiaryReflectionFlow = ai.defineFlow(
  {
    name: 'mindDiaryReflectionFlow',
    inputSchema: MindDiaryReflectionInputSchema,
    outputSchema: MindDiaryReflectionOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
        // Fallback in case the LLM fails to generate output or it's not in the expected format
        let fallbackMotivationalLine = "Keep going, you're doing great!";
        let fallbackActionableTip = "Take a short break and stretch a bit.";
        if (input.mood.toLowerCase() === 'sad' || input.mood.toLowerCase() === 'angry') {
            fallbackMotivationalLine = "It's okay to feel this way. Kal ka din naya hoga!";
            fallbackActionableTip = "Thoda music sun le ya kisi friend se baat karle.";
        }
        return {
            motivationalLine: fallbackMotivationalLine,
            actionableTip: fallbackActionableTip,
            respondedInLanguage: 'hng'
        };
    }
    // Ensure respondedInLanguage is set, even if the LLM forgets
    if (!output.respondedInLanguage) {
        output.respondedInLanguage = 'hng';
    }
    return output;
  }
);
