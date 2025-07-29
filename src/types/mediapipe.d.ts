// src/types/mediapipe.d.ts

// This file provides basic type definitions for MediaPipe Vision tasks
// to avoid TypeScript errors when using the library.

declare module "@mediapipe/tasks-vision" {
  export class FilesetResolver {
    static forVisionTasks(path: string): Promise<FilesetResolver>;
  }

  export interface Landmark {
    x: number;
    y: number;
    z: number;
    visibility?: number;
  }

  export class HandLandmarker {
    static createFromOptions(
      filesetResolver: FilesetResolver,
      options: {
        baseOptions: {
          modelAssetPath: string;
          delegate: "GPU" | "CPU";
        };
        runningMode: "VIDEO";
        numHands: number;
      }
    ): Promise<HandLandmarker>;

    detectForVideo(
      videoElement: HTMLVideoElement,
      timestampMs: number
    ): {
      landmarks: Landmark[][];
      worldLandmarks: Landmark[][];
      handedness: {
        score: number;
        index: number;
        categoryName: string;
        displayName: string;
      }[][];
    };
  }

  // Add other MediaPipe classes and types here as needed
}
