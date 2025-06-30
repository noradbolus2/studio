// src/types/school-aura-report.ts

export interface SchoolAuraReport {
  reportId: string; // e.g., "studentId_YYYY-WW"
  studentId: string;
  schoolId: string;
  weekStartDate: Date; // Firestore Timestamp
  clarityScore: number; // 0-100
  stressScore: number; // 0-100
  attentionScore: number; // 0-100
  aiSummary: string; // AI-generated summary for the week
  adminNotes?: string; // Notes from school staff
}
