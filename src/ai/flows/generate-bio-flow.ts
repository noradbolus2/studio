
'use server';
/**
 * @fileOverview AI flow to generate a teacher/creator bio.
 *
 * - generateBio - A function that creates a professional bio.
 * - GenerateBioInput - The input type for the function.
 * - GenerateBioOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBioInputSchema = z.object({
  fullName: z.string().describe("The teacher's full name."),
  examTarget: z.string().describe('The primary exam the teacher focuses on (e.g., "NEET UG", "JEE Main").'),
  subject: z.string().describe('The primary subject the teacher specializes in (e.g., "Physics", "Organic Chemistry").')
});
export type GenerateBioInput = z.infer<typeof GenerateBioInputSchema>;

const GenerateBioOutputSchema = z.object({
  bio: z.string().describe("A professionally written, engaging bio for the teacher, under 300 characters."),
});
export type GenerateBioOutput = z.infer<typeof GenerateBioOutputSchema>;

export async function generateBio(input: GenerateBioInput): Promise<GenerateBioOutput> {
  return generateBioFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBioPrompt',
  input: {schema: GenerateBioInputSchema},
  output: {schema: GenerateBioOutputSchema},
  prompt: `You are an expert copywriter specializing in creating professional bios for online educators in India.
Your task is to generate a short, engaging, and professional bio (under 300 characters) for a teacher based on their profile.

**Teacher's Profile:**
- Name: {{{fullName}}}
- Teaches for Exam: {{{examTarget}}}
- Specializes in Subject: {{{subject}}}

**Instructions:**
1.  Start with a strong opening statement highlighting their expertise.
2.  Mention the specific exam and subject they teach.
3.  Use an encouraging and confident tone.
4.  Keep it concise and under 300 characters.
5.  Do not use quotes or special formatting. The output should be a single block of text.

**Example:**
Input: { fullName: "Ravi Kumar", examTarget: "JEE Main", subject: "Physics" }
Output: { "bio": "Meet Ravi Kumar, a dedicated Physics educator specializing in helping students crack the JEE Main. With a focus on simplifying complex concepts and building strong problem-solving skills, I'm here to guide you to your engineering dream." }

Generate the bio now.`,
});

const generateBioFlow = ai.defineFlow(
  {
    name: 'generateBioFlow',
    inputSchema: GenerateBioInputSchema,
    outputSchema: GenerateBioOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("The AI failed to generate a bio. Please try again.");
    }
    return output;
  }
);
