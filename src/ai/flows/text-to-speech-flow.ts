
'use server';
/**
 * @fileOverview A flow for converting text to speech using Google's TTS model.
 *
 * - textToSpeech - Converts a string of text into playable audio data.
 * - TextToSpeechInput - The input type for the function.
 * - TextToSpeechOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import { z } from 'genkit';
import wav from 'wav';

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

// Helper function to convert PCM buffer to WAV Base64 string
async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: Buffer[] = [];
    writer.on('error', reject);
    writer.on('data', (d) => bufs.push(d));
    writer.on('end', () => resolve(Buffer.concat(bufs).toString('base64')));

    writer.write(pcmData);
    writer.end();
  });
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
        const { media } = await ai.generate({
          model: googleAI.model('gemini-2.5-flash-preview-tts'),
          config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: 'Algenib' },
              },
            },
          },
          prompt: text,
        });

        if (!media || !media.url) {
          throw new Error('TTS media generation failed. No media returned.');
        }

        const pcmData = Buffer.from(media.url.substring(media.url.indexOf(',') + 1), 'base64');
        const wavBase64 = await toWav(pcmData);
        const audioDataUri = `data:audio/wav;base64,${wavBase64}`;

        // Store result in cache
        ttsCache.set(text, audioDataUri);

        return { audioDataUri };

    } catch (error: any) {
        console.error("[TTS Flow] Error generating speech:", error.message);
        if (error.message && error.message.includes("429")) {
            throw new Error("Audio Error: The daily free limit for AI voice generation has been reached. Please try again tomorrow.");
        }
        throw new Error("I'm having trouble with my voice right now. Please try again in a moment.");
    }
  }
);
