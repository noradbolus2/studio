export async function fetchTTS(text: string): Promise<Blob> {
    try {
        const res = await fetch("http://localhost:5003/tts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text })
        });
        if (!res.ok) {
             if (res.status === 429) {
                 throw new Error("The daily free limit for AI voice generation has been reached. Please try again tomorrow.");
            }
            throw new Error(`TTS server responded with status ${res.status}. Make sure the local voice server is running.`);
        }
        return await res.blob();
    } catch (err: any) {
        if (err instanceof TypeError) { 
            throw new Error("Could not connect to the local voice server. Please ensure it is running and try again.");
        }
        throw err; 
    }
};
