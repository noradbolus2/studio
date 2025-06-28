// src/types/revision-vault.ts

export interface RevisionVaultItem {
  id: string; // Auto-generated ID for the vault item
  lectureId: string;
  timestamp: string; // format "hh:mm:ss"
  note?: string; // Optional student note
  subject: string;
  chapter: string;
  topic: string;
  status: 'revision' | 'doubt_asked' | 'resolved';
  teacherResponse?: {
    type: "text" | "video" | "pdf" | "voice";
    content: string; // link or text
  } | null;
  lectureTitle: string; // Denormalized for easy display
}
