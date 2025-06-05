// src/ai/flows/ai-peer-match.ts
'use server';

/**
 * @fileOverview AI-powered peer matching for students based on location and subject.
 *
 * - aiPeerMatch - A function that handles the peer matching process.
 * - AiPeerMatchInput - The input type for the aiPeerMatch function.
 * - AiPeerMatchOutput - The return type for the aiPeerMatch function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiPeerMatchInputSchema = z.object({
  location: z.string().describe('The general location of the student.'),
  subject: z.string().describe('The subject the student is studying.'),
  numberOfMatches: z.number().describe('The number of peer matches to find.')
});
export type AiPeerMatchInput = z.infer<typeof AiPeerMatchInputSchema>;

const AiPeerMatchOutputSchema = z.object({
  matches: z.array(
    z.object({
      name: z.string().describe('The name of the matched student.'),
      subject: z.string().describe('The subject they are studying.'),
      location: z.string().describe('The location of the matched student.'),
      contactInfo: z.string().describe('How to contact the matched student.'),
    })
  ).describe('A list of matched students.')
});
export type AiPeerMatchOutput = z.infer<typeof AiPeerMatchOutputSchema>;

export async function aiPeerMatch(input: AiPeerMatchInput): Promise<AiPeerMatchOutput> {
  return aiPeerMatchFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiPeerMatchPrompt',
  input: {schema: AiPeerMatchInputSchema},
  output: {schema: AiPeerMatchOutputSchema},
  prompt: `You are an AI assistant designed to find peer matches for students. Given a student's location, the subject they are studying, and the number of matches they want to find, return a list of potential study partners.

Location: {{{location}}}
Subject: {{{subject}}}
Number of Matches: {{{numberOfMatches}}}

Format your response as a JSON array of student objects, including name, subject, location and contact information.
`,
});

const aiPeerMatchFlow = ai.defineFlow(
  {
    name: 'aiPeerMatchFlow',
    inputSchema: AiPeerMatchInputSchema,
    outputSchema: AiPeerMatchOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
