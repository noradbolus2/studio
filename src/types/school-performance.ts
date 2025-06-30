// src/types/school-performance.ts

export interface SchoolPerformanceRecord {
  recordId: string;
  studentId: string; // Foreign key to `students` collection
  schoolId: string;
  classId: string;
  subject: string;
  assessmentType: "Test" | "Quiz" | "Exam" | "Assignment";
  assessmentTitle: string;
  maxMarks: number;
  marksObtained: number;
  grade?: string;
  remarks?: string;
  date: Date; // Firestore Timestamp
}
