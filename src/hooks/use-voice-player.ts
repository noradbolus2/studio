
"use client";

import { useRef, useState, useEffect, useCallback } from "react";

/**
 * A custom hook to manage playing audio blobs for voice responses.
 * It handles the creation of the audio element, playing the audio,
 * and tracking the playing state.
 *
 * @param onPlaybackEnd A callback function that is executed when audio playback finishes.
 * @returns An object containing the playVoice function, a stopVoice function, and an isPlaying boolean.
 */
export const useVoicePlayer = (onPlaybackEnd?: () => void) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Effect to set up the audio element and its event listeners
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    
    const audioElement = audioRef.current;

    const handleEnded = () => {
      setIsPlaying(false);
      onPlaybackEnd?.(); // Call the callback when playback ends
    };
    
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audioElement.addEventListener('play', handlePlay);
    audioElement.addEventListener('pause', handlePause);
    audioElement.addEventListener('ended', handleEnded);

    // Cleanup function
    return () => {
      audioElement.removeEventListener('play', handlePlay);
      audioElement.removeEventListener('pause', handlePause);
      audioElement.removeEventListener('ended', handleEnded);
      audioElement.pause();
      audioElement.src = "";
    };
  }, [onPlaybackEnd]);

  const playVoice = useCallback(async (blob: Blob) => {
    if (!audioRef.current) return;
    
    try {
      // If something is already playing, stop it first.
      if (!audioRef.current.paused) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      
      const url = URL.createObjectURL(blob);
      audioRef.current.src = url;
      await audioRef.current.play();
    } catch (error: any) {
      // This is a common error when a new play request interrupts an old one.
      // We can safely ignore it in this context.
      if (error.name === 'AbortError') {
        console.log('Audio playback was interrupted by a new request. This is expected.');
      } else {
        console.error("Error playing voice:", error);
        setIsPlaying(false); // Ensure state is correct on other errors
      }
    }
  }, []);
  
  const stopVoice = useCallback(() => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  return { playVoice, stopVoice, isPlaying };
};
