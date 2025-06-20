
// src/types/coaching-teacher.ts
// Note: If using Firebase JS SDK v9+, Timestamp would be imported from 'firebase/firestore'
// import type { Timestamp } from 'firebase/firestore';

export interface CoachingTeacher {
  /** Unique identifier for the teacher, typically their Firebase Authentication UID. */
  teacher_id: string;

  /** Full name of the teacher. */
  name: string;

  /** Email address of the teacher, used for login and communication. */
  email: string;

  /** Contact phone number for the teacher (optional). */
  phone?: string | null;

  /** URL to the teacher's profile image (optional). */
  profile_image_url?: string | null;

  /** AI hint for the profile image (optional). */
  dataAiHintProfile?: string | null;

  /** Array of subjects the teacher specializes in. */
  subjects_specialized: string[];

  /**
   * Array of exam_ids the teacher targets.
   * References exam_master_list.exam_id.
   */
  target_exam_ids: string[];

  /**
   * The exam_id currently active on the teacher's dashboard.
   * Should be one of the IDs from target_exam_ids.
   */
  current_active_exam_id?: string | null;

  /** A short biography or professional summary of the teacher. */
  bio?: string | null;

  /**
   * Indicates if the teacher's profile has been verified by the OSO platform admin.
   * Defaults to false.
   */
  is_verified?: boolean;

  /** Indicates if the teacher is currently available for doubt-solving sessions. */
  availability_for_doubts?: boolean;

  /** Current status of the teacher regarding live classes. */
  live_class_status?: "offline" | "online_available" | "in_live_session";

  /** Overall rating of the teacher, typically an average from course feedback. */
  overall_rating?: number | null;

  /** Optional social media or portfolio links for the teacher. */
  social_links?: {
    youtube?: string;
    linkedin?: string;
    website?: string;
  } | null;

  /** Timestamp indicating when the teacher record was created. */
  created_at: Date; // Will be Firestore Timestamp

  /** Timestamp indicating when the teacher record was last updated. */
  updated_at: Date; // Will be Firestore Timestamp
}
