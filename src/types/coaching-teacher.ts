
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

  /** 
   * Array of subjects the teacher specializes in.
   * Can be a comma-separated string from ProfileFormData.expertise, parsed into an array.
   */
  subjects_specialized: string[];

  /**
   * Array of exam_ids the teacher targets.
   * References exam_master_list.exam_id.
   * Can be derived or an extension of ProfileFormData.examTarget.
   */
  target_exam_ids: string[];

  /**
   * The exam_id currently active on the teacher's dashboard.
   * Should be one of the IDs from target_exam_ids.
   * Maps from ProfileFormData.examTarget.
   */
  current_active_exam_id?: string | null;

  /** A short biography or professional summary of the teacher. Maps from ProfileFormData.bio. */
  bio?: string | null;

  /** 
   * Indicates if the teacher is currently available for doubt-solving sessions. 
   * Maps from ProfileFormData.availability_for_doubts.
   */
  availability_for_doubts?: boolean;

  /** Current status of the teacher regarding live classes. (System-managed) */
  live_class_status?: "offline" | "online_available" | "in_live_session";

  /** Overall rating of the teacher, typically an average from course feedback. (System-managed) */
  overall_rating?: number | null;

  /** Optional social media or portfolio links for the teacher. Maps from ProfileFormData.portfolioUrl. */
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
