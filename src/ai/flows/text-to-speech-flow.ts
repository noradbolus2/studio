// This file is no longer needed as the app now uses the browser's built-in SpeechSynthesis API directly
// for the AI Voice Call feature.
// Keeping this file might be useful if other parts of the app need to generate downloadable audio files,
// but for the voice call, direct browser synthesis is more efficient.
'use server';
/**
 * @fileOverview A Genkit flow for generating audio from text (Text-to-Speech).
 *
 * - generateSpeech - Converts a string of text into an audio data URI.
 * - GenerateSpeechInput - The input type for the generateSpeech function.
 * - GenerateSpeechOutput - The return type for the generateSpeech function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import wav from 'wav';
import { googleAI } from '@genkit-ai/googleai';

// Define the schema for the flow input
const GenerateSpeechInputSchema = z.object({
  text: z.string().describe('The text to convert to speech.'),
});
export type GenerateSpeechInput = z.infer<typeof GenerateSpeechInputSchema>;

// Define the schema for the flow output
const GenerateSpeechOutputSchema = z.object({
  audioDataUri: z.string().describe("The generated audio as a data URI in WAV format. Expected format: 'data:audio/wav;base64,<encoded_data>'."),
});
export type GenerateSpeechOutput = z.infer<typeof GenerateSpeechOutputSchema>;

// Exported wrapper function to be called from the client
export async function generateSpeech(input: GenerateSpeechInput): Promise<GenerateSpeechOutput> {
  return generateSpeechFlow(input);
}

// Helper function to convert PCM audio data to WAV format
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
    writer.on('data', (d) => {
      bufs.push(d);
    });
    writer.on('end', () => {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

// Define the Genkit flow for TTS
const generateSpeechFlow = ai.defineFlow(
  {
    name: 'generateSpeechFlow',
    inputSchema: GenerateSpeechInputSchema,
    outputSchema: GenerateSpeechOutputSchema,
  },
  async (input) => {
    try {
      const { media } = await ai.generate({
        model: googleAI.model('gemini-2.5-flash-preview-tts'),
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Achernar' },
            },
          },
        },
        prompt: input.text,
      });

      if (!media?.url) {
        throw new Error('No audio media was returned from the AI model.');
      }

      // The media URL is a data URI: data:audio/pcm;rate=24000;channels=1;encoding=linear16;base64,...
      const audioBuffer = Buffer.from(
        media.url.substring(media.url.indexOf(',') + 1),
        'base64'
      );
      
      const wavBase64 = await toWav(audioBuffer);
      
      return {
        audioDataUri: 'data:audio/wav;base64,' + wavBase64,
      };
    } catch (error: any) {
        // Check for specific quota error from Google AI
        if (error.message && (error.message.includes('429') || error.message.toLowerCase().includes('quota'))) {
            throw new Error("The daily free limit for AI voice generation has been reached. Please check your plan and billing details, or try again tomorrow.");
        }
        // Rethrow other errors
        throw error;
    }
  }
);
