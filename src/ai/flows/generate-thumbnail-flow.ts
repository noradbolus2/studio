
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

export const GenerateThumbnailInputSchema = z.object({
  videoTitle: z.string().describe("The title of the video lecture. This text should be prominent."),
  subject: z.string().describe("The subject of the course, e.g., 'NEET 2025', 'Chemistry', 'Class 10'."),
  mood: z.enum(["Calm", "Energetic", "Exam Mode", "Motivational"]).describe("The desired mood/style for the thumbnail."),
  teacherImageUri: z.string().optional().describe("A Base64 data URI of a teacher's photo to be included. Format: 'data:image/jpeg;base64,...'."),
});
export type GenerateThumbnailInput = z.infer<typeof GenerateThumbnailInputSchema>;

export const GenerateThumbnailOutputSchema = z.object({
  imageDataUri: z.string().describe("The generated thumbnail image as a Base64 data URI."),
  promptUsed: z.string().describe("The final prompt that was sent to the image generation model.") // For debugging
});
export type GenerateThumbnailOutput = z.infer<typeof GenerateThumbnailOutputSchema>;

export async function generateAiThumbnail(input: GenerateThumbnailInput): Promise<GenerateThumbnailOutput> {
  return generateThumbnailFlow(input);
}

const generateThumbnailFlow = ai.defineFlow(
  {
    name: 'generateThumbnailFlow',
    inputSchema: GenerateThumbnailInputSchema,
    outputSchema: GenerateThumbnailOutputSchema,
  },
  async (input) => {

    const teacherPromptPart = input.teacherImageUri 
      ? `An Indian teacher is the main subject. Their facial expression should match the "${input.mood}" mood (e.g., energetic/excited for 'Energetic', focused/serious for 'Exam Mode'). The teacher's image provided should be used as a reference for their appearance. The background should be abstract and related to the style. Do NOT just place the image on a background; integrate it naturally.`
      : `The background should be an abstract representation of the subject. For example, for 'Thermodynamics', use fire, energy bursts, or atoms. For 'Maths', use abstract geometric shapes or graphs.`;
      
    const promptText = `
      Generate a high-energy, high-contrast, visually engaging YouTube thumbnail for an educational video. The thumbnail must be 1280x720 pixels.

      **CRITICAL INSTRUCTIONS:**
      1.  **Primary Text:** The video title is "${input.videoTitle}". This text MUST be the largest and most prominent text on the thumbnail. Use a bold, modern, sans-serif font.
      2.  **Secondary Text/Badge:** Include the subject "${input.subject}" as a smaller badge or text element.
      3.  **Mood & Style:** The mood is "${input.mood}". Adapt the design accordingly:
          *   **Energetic/Motivational:** Use bright, dynamic colors like yellows, oranges, and blues. Use explosive backgrounds, speed lines, or glowing effects. The text should be bold and may have a slight tilt.
          *   **Calm:** Use softer colors like light blues, greens, and pastels. The background should be clean and uncluttered. Use a clean, sans-serif font.
          *   **Exam Mode:** Use a more serious and high-contrast color scheme like red, black, and white. Use elements like a timer icon, a target icon, or a graph background. The font should be impactful and clear.
      4.  **Imagery:** ${teacherPromptPart}
      5.  **Layout:** The main text should occupy the upper-left or central part of the thumbnail. The person (if any) should be on the right side. This follows standard CTR optimization practices. DO NOT place text too close to the edges.
      6.  **Overall Feel:** The thumbnail should look professional, clickable, and clear, as if made by a top educational content creator. It must be in English. It should NOT look like a generic stock photo.
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
        responseModalities: ['IMAGE'],
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
