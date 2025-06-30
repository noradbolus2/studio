// src/types/school-notification.ts

export interface SchoolNotification {
  notificationId: string;
  schoolId: string;
  title: string;
  message: string;
  targetGroup: "All" | "Students" | "Teachers" | "Parents" | `Class ${string}`;
  sentBy: string; // teacherId or adminId
  sentDate: Date; // Firestore Timestamp
}
