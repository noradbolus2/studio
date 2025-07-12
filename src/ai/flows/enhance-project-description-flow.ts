
'use server';
/**
 * @fileOverview An AI flow to enhance a student's project description.
 *
 * - enhanceProjectDescription - A function that takes a brief description and elaborates on it.
 * - EnhanceProjectInput - The input type for the function.
 * - EnhanceProjectOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnhanceProjectInputSchema = z.string().describe('The student\'s initial, brief description of their school project.');
export type EnhanceProjectInput = z.infer<typeof EnhanceProjectInputSchema>;

const EnhanceProjectOutputSchema = z.object({
  enhancedDescription: z.string().describe("An enhanced, more detailed version of the project description. This should be written in the first person from the student's perspective ('I need...'), be well-structured with bullet points for key requirements like materials, dimensions, and features."),
});
export type EnhanceProjectOutput = z.infer<typeof EnhanceProjectOutputSchema>;

export async function enhanceProjectDescription(input: EnhanceProjectInput): Promise<EnhanceProjectOutput> {
  return enhanceProjectDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'enhanceProjectDescriptionPrompt',
  input: {schema: EnhanceProjectInputSchema},
  output: {schema: EnhanceProjectOutputSchema},
  prompt: `You are an AI assistant who helps students write better project descriptions for creators.
A student has provided a brief description of a school project. Your task is to enhance it by adding plausible details that a creator would need to know.

**Instructions:**
1.  Read the student's initial description.
2.  Rewrite it in the first person (e.g., "I need a project...").
3.  Add a new section called "Key Requirements" or similar.
4.  Under this new section, add 3-5 specific, plausible bullet points. These could include:
    *   Approximate dimensions (e.g., "Should be around 1ft x 1ft").
    *   Key features (e.g., "The windmill blades should rotate").
    *   Material suggestions (e.g., "Please use eco-friendly materials if possible").
    *   A request for an instruction manual (e.g., "A simple step-by-step guide for final assembly is needed").
    *   Specific things to label or highlight.
5.  Keep the tone polite and clear.
6.  The enhanced description should be a single block of text, using markdown for formatting (like bullet points).

**Student's Initial Description:**
"{{{value}}}"

Generate the JSON response now.
`,
});

const enhanceProjectDescriptionFlow = ai.defineFlow(
  {
    name: 'enhanceProjectDescriptionFlow',
    inputSchema: EnhanceProjectInputSchema,
    outputSchema: EnhanceProjectOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output?.enhancedDescription) {
      throw new Error("The AI failed to generate an enhanced description.");
    }
    return output;
  }
);
