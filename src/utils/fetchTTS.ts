
// This file is deprecated. The app now directly calls the Genkit flow for TTS.
// See /src/app/(app)/ai-voice-call/page.tsx for the new implementation.

export async function fetchTTS(text: string): Promise<Blob> {
    throw new Error("fetchTTS is deprecated. Please use the generateSpeech Genkit flow directly.");
};
