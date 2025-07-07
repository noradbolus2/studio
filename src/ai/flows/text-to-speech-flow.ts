
'use server';
/**
 * @fileOverview A flow for converting text to speech using a self-hosted TTS model.
 *
 * - textToSpeech - Converts a string of text into playable audio data.
 * - TextToSpeechInput - The input type for the function.
 * - TextToSpeechOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Simple in-memory cache for TTS results to reduce API calls
const ttsCache = new Map<string, string>();

const TextToSpeechInputSchema = z.string().describe("The text to convert to speech.");
export type TextToSpeechInput = z.infer<typeof TextToSpeechInputSchema>;

const TextToSpeechOutputSchema = z.object({
  audioDataUri: z.string().describe("The generated audio as a Base64 data URI in WAV format."),
});
export type TextToSpeechOutput = z.infer<typeof TextToSpeechOutputSchema>;

export async function textToSpeech(text: TextToSpeechInput): Promise<TextToSpeechOutput> {
  return textToSpeechFlow(text);
}

const textToSpeechFlow = ai.defineFlow(
  {
    name: 'textToSpeechFlow',
    inputSchema: TextToSpeechInputSchema,
    outputSchema: TextToSpeechOutputSchema,
  },
  async (text) => {
    // Check cache first
    if (ttsCache.has(text)) {
      console.log('[TTS Flow] Cache hit for:', text.substring(0, 20) + '...');
      return { audioDataUri: ttsCache.get(text)! };
    }
    console.log('[TTS Flow] Cache miss. Generating speech for:', text.substring(0, 20) + '...');

    try {
      const response = await fetch('http://localhost:5003/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(`TTS server responded with status: ${response.status}`);
      }
      
      const audioBuffer = await response.arrayBuffer();
      const wavBase64 = Buffer.from(audioBuffer).toString('base64');
      const audioDataUri = `data:audio/wav;base64,${wavBase64}`;

      // Store result in cache
      ttsCache.set(text, audioDataUri);

      return { audioDataUri };

    } catch (error: any) {
        console.error("[TTS Flow] Error generating speech from local server:", error.message);
        throw new Error("I'm having trouble with my voice right now. Please make sure the local voice server is running and try again.");
    }
  }
);
