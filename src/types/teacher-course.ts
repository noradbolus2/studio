
// src/types/teacher-course.ts
// Note: If using Firebase JS SDK v9+, Timestamp would be imported from 'firebase/firestore'
// import type { Timestamp } from 'firebase/firestore';

export interface LiveClassSchedule {
  platform: "Google Meet" | "Zoom" | "YouTube Live" | "OSO Platform";
  join_link?: string | null;
  /** E.g., "Mon, Wed, Fri @ 7 PM IST" or structured recurrence rule */
  schedule_info?: string | null;
  next_class_datetime?: Date | null; // Will be Firestore Timestamp
}

export interface TeacherCourse {
  /** Auto-generated unique identifier for the course. */
  course_id: string;

  /** Identifier of the teacher who created this course. References coaching_teachers.teacher_id. */
  teacher_id: string;

  /** Identifier of the exam this course is primarily for. References exam_master_list.exam_id. */
  exam_id: string;

  /** Subject this course covers (e.g., "Physics", "Organic Chemistry"). */
  subject: string;

  /** Title of the course in English. */
  course_title_en: string;

  /** Title of the course in Hindi. */
  course_title_hi: string;

  /** Detailed description of the course in English. */
  description_en: string;

  /** Detailed description of the course in Hindi. */
  description_hi: string;

  /** Type of the course offering. */
  course_type: "Live Interactive" | "Recorded Lectures" | "Notes Only" | "Live + Recorded + Notes";

  /** Price of the course in INR. Null or 0 for free courses. */
  price_inr?: number | null;

  /** Estimated total duration of the course in hours. */
  duration_hours?: number | null;

  /** Primary language of instruction for the course. */
  language_of_instruction: "English" | "Hindi" | "Hinglish";

  /** URL for the course thumbnail image (optional). */
  thumbnail_image_url?: string | null;

  /** AI hint for the thumbnail image (optional). */
  dataAiHintThumbnail?: string | null;

  /** Link to uploaded notes (e.g., Google Drive, or path in Firebase Storage). */
  notes_uploaded_link?: string | null;

  /** Details for live classes, if applicable. */
  live_class_details?: LiveClassSchedule | null;

  /** Indicates if a dedicated doubt-solving forum or mechanism is enabled for this course. */
  is_doubt_forum_enabled?: boolean;

  /** Number of students currently enrolled in the course (updated via backend logic). */
  student_enrollment_count?: number;

  /** Average rating of the course from student feedback. */
  average_rating?: number | null;

  /** Current status of the course. */
  status: "Draft" | "Published" | "Archived" | "Pending Approval";

  /** Indicates if the course has been approved by OSO platform admin. */
  approved_by_admin?: boolean;

  /** Timestamp indicating when the course record was created. */
  created_at: Date; // Will be Firestore Timestamp

  /** Timestamp indicating when the course record was last updated. */
  updated_at: Date; // Will be Firestore Timestamp
}
