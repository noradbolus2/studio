
'use server';
/**
 * @fileOverview AI flow to generate presentation slides from raw text notes.
 *
 * - generatePptSlides - A function that creates a structured slide deck.
 * - GeneratePptSlidesInput - The input type for the function.
 * - GeneratePptSlidesOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePptSlidesInputSchema = z.object({
  topic: z.string().describe('The main topic or title for the presentation deck.'),
  rawText: z.string().describe('The raw notes, chapter content, or text to be converted into slides.'),
  studentLevel: z.string().optional().describe('The target audience, e.g., "Class 10", "JEE Aspirants".'),
});
export type GeneratePptSlidesInput = z.infer<typeof GeneratePptSlidesInputSchema>;

const SlideSchema = z.object({
  title: z.string().describe('A concise title for the slide.'),
  points: z.array(z.string()).describe('An array of bullet points for the slide content. Each point should be a separate string.'),
  diagramSuggestion: z.string().optional().describe('A simple description for a suggested diagram or illustration for this slide, if applicable. E.g., "A diagram showing the process of photosynthesis."'),
});

const GeneratePptSlidesOutputSchema = z.object({
  deckTitle: z.string().describe('A suitable title for the entire slide deck.'),
  slides: z.array(SlideSchema).min(2).describe('An array of generated slide objects.'),
});
export type GeneratePptSlidesOutput = z.infer<typeof GeneratePptSlidesOutputSchema>;

export async function generatePptSlides(input: GeneratePptSlidesInput): Promise<GeneratePptSlidesOutput> {
  return generatePptSlidesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePptSlidesPrompt',
  input: {schema: GeneratePptSlidesInputSchema},
  output: {schema: GeneratePptSlidesOutputSchema},
  prompt: `You are an expert instructional designer AI. Your task is to convert raw text notes into a structured, clear, and engaging presentation slide deck.

**Instructions:**
1.  **Analyze the Input:** Read the provided 'topic' and 'rawText' to understand the core concepts.
2.  **Structure the Deck:**
    *   Create a logical flow for the presentation.
    *   The first slide should be a Title slide.
    *   Break down the content into multiple slides, each focusing on a specific sub-topic.
    *   For each slide, create a concise 'title'.
    *   For each slide, extract or summarize the key information into several clear 'points' (bullet points).
3.  **Suggest Visuals:** If a slide's content could be enhanced with a visual, provide a simple, clear description in the 'diagramSuggestion' field. Do this for at least 1-2 key slides. For example, if explaining the water cycle, suggest "A diagram of the water cycle showing evaporation, condensation, and precipitation."
4.  **Adhere to Schema:** Your entire output MUST be a single, valid JSON object that matches the provided output schema.

**Input Context:**
-   **Deck Topic:** {{{topic}}}
-   **Target Audience:** {{#if studentLevel}}{{{studentLevel}}}{{else}}General students{{/if}}
-   **Raw Text for Conversion:**
    \`\`\`
    {{{rawText}}}
    \`\`\`

Generate the JSON for the slide deck now.
`,
});

const generatePptSlidesFlow = ai.defineFlow(
  {
    name: 'generatePptSlidesFlow',
    inputSchema: GeneratePptSlidesInputSchema,
    outputSchema: GeneratePptSlidesOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output || !output.slides || output.slides.length === 0) {
      throw new Error("The AI failed to generate any slides. Please try rephrasing your notes.");
    }
    return output;
  }
);
