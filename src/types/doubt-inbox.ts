// src/types/doubt-inbox.ts

export interface DoubtInboxItem {
  id: string; // Auto-generated ID, can be same as revisionVault item id
  studentId: string;
  studentName: string; // Denormalized
  lectureId: string;
  lectureTitle: string; // Denormalized
  timestamp: string;
  note: string;
  subject: string;
  chapter: string;
  topic: string;
  status: 'pending' | 'answered';
  reply?: {
    type: "text" | "video" | "pdf" | "voice";
    content: string;
  } | null;
  doubtAskedAt: string; // ISO Date string
}
