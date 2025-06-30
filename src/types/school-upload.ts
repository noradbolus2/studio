// src/types/school-upload.ts

export interface SchoolUpload {
  uploadId: string;
  schoolId: string; // Foreign key to `schools` collection
  teacherId: string; // Foreign key to `school_staff` collection who uploaded
  contentType: "Lecture Video" | "Notes PDF" | "Assignment" | "Circular";
  title: string;
  description?: string;
  fileUrl: string; // Link to file in Firebase Storage
  target: {
    type: "Class" | "Section" | "All";
    value: string; // e.g., "10", "10A", "All"
  };
  subject?: string;
  uploadDate: Date; // Firestore Timestamp
}
