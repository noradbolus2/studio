
'use server';
/**
 * @fileOverview OSO AI Thumbnail Generator™ flow.
 *
 * - generateAiThumbnail - Generates a YouTube-style thumbnail for a course video.
 * - GenerateThumbnailInput - Input for the generation function.
 * - GenerateThumbnailOutput - Output from the generation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateThumbnailInputSchema = z.object({
  videoTitle: z.string().describe("The title of the video lecture. This text should be prominent."),
  subject: z.string().describe("The subject of the course, e.g., 'NEET 2025', 'Chemistry', 'Class 10'."),
  mood: z.enum(["Calm", "Energetic", "Exam Mode", "Motivational"]).describe("The desired mood/style for the thumbnail."),
  teacherImageUri: z.string().optional().describe("A Base64 data URI of a teacher's photo to be included. Format: 'data:image/jpeg;base64,...'."),
});
export type GenerateThumbnailInput = z.infer<typeof GenerateThumbnailInputSchema>;

const GenerateThumbnailOutputSchema = z.object({
  imageDataUri: z.string().describe("The generated thumbnail image as a Base64 data URI."),
  promptUsed: z.string().describe("The final prompt that was sent to the image generation model.") // For debugging
});
export type GenerateThumbnailOutput = z.infer<typeof GenerateThumbnailOutputSchema>;

export async function generateAiThumbnail(input: GenerateThumbnailInput): Promise<GenerateThumbnailOutput> {
  const generateThumbnailFlow = ai.defineFlow(
    {
      name: 'generateThumbnailFlow',
      inputSchema: GenerateThumbnailInputSchema,
      outputSchema: GenerateThumbnailOutputSchema,
    },
    async (input) => {

      const teacherPromptPart = input.teacherImageUri 
        ? `The main subject is an Indian teacher, whose appearance should be based on the provided reference image. Their facial expression should match the "${input.mood}" mood (e.g., energetic/excited for 'Energetic', focused/serious for 'Exam Mode'). Integrate the teacher naturally into a dynamic background related to the subject, not just pasted on top.`
        : `The main visual element should be an abstract, artistic representation of the subject. For example, for 'Thermodynamics', use swirling fire and energy patterns. For 'Maths', use abstract geometric shapes or glowing graphs.`;
        
      const promptText = `
        You are a professional graphic designer creating a high-quality, photorealistic, and visually engaging promotional poster for an educational course. The poster must be high-resolution (1280x720 pixels). It should look modern, unique, and compelling, avoiding generic stock photo aesthetics.

        **CRITICAL INSTRUCTIONS:**
        1.  **Primary Text:** The course title is "${input.videoTitle}". This text MUST be the largest and most prominent element, rendered in a bold, modern, sans-serif font.
        2.  **Secondary Text/Badge:** Include the subject "${input.subject}" as a smaller, stylish badge or text element.
        3.  **Mood & Style:** The mood is "${input.mood}". Adapt the design accordingly:
            *   **Energetic/Motivational:** Use a vibrant, dynamic color palette (yellows, oranges, electric blues). The background should feature abstract elements like light streaks, energy bursts, or glowing geometric patterns. Text should be bold and impactful, possibly with a slight angle or 3D effect.
            *   **Calm:** Employ a softer, clean color scheme (light blues, greens, pastels) with an uncluttered, minimalist background. Fonts should be clean, elegant, and sans-serif.
            *   **Exam Mode:** Use a high-contrast, serious palette (red, black, white, deep blue). Background elements could include subtle grids, graphs, or target icons. Fonts must be extremely clear and impactful.
        4.  **Imagery & Composition:** ${teacherPromptPart} The overall composition must be well-balanced and professional.
        5.  **Layout:** Follow standard design principles. The main text should be in a high-contrast area, like the upper-left or center. If a person is present, place them on the right, looking towards the text. Ensure a clear visual hierarchy. DO NOT place text too close to the edges.
        6.  **Final Quality:** The final image must be sharp, clear, and look like it was designed by a top-tier educational content creator. It must be in English.
      `;
      
      let promptPayload;
      if (input.teacherImageUri) {
          promptPayload = [
              { text: promptText },
              { media: { url: input.teacherImageUri } },
          ];
      } else {
          promptPayload = promptText;
      }

      const {media} = await ai.generate({
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: promptPayload,
        config: {
          responseModalities: ['TEXT', 'IMAGE'],
        },
      });

      if (!media?.url) {
        throw new Error("AI failed to generate thumbnail image.");
      }
      
      return {
        imageDataUri: media.url,
        promptUsed: promptText // Return the prompt for debugging
      };
    }
  );

  return generateThumbnailFlow(input);
}
