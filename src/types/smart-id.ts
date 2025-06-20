// src/types/smart-id.ts

// Note: If using Firebase JS SDK v9+, Timestamp would be imported from 'firebase/firestore'
// import type { Timestamp } from 'firebase/firestore';

/**
 * Represents the structure of an OSO Smart ID document in Firestore.
 * This ID links a student's identity across various OSO platform modules.
 */
export interface OsoSmartId {
  /** Unique student identifier, often corresponding to their Firebase Auth UID. */
  student_id: string;

  /** Full name of the student. */
  student_name: string;

  /** URL to the student's profile image. Optional. */
  profile_image_url?: string | null;

  /** Current grade or class of the student (e.g., "10", "12 Science"). */
  grade: string;

  /** Unique identifier for the school the student is registered with.
   * This could be the school's own ID or an ID assigned by OSO.
   * Corresponds to `apiSchoolId` or `schoolId` from school profile data.
   */
  school_code: string;

  /** Identifier for any coaching center the student is linked to. Optional. */
  assigned_coaching_id?: string | null;

  /** Access ID for OSO Library or specific StudyPort™ zones. */
  library_or_studyport_id: string;

  /** Contact information for the student's parent (phone number or email). */
  parent_contact: string;

  /**
   * Indicates if the student's Smart ID details have been verified by their school.
   * true = verified by school.
   */
  verified_status: boolean;

  /**
   * Timestamp indicating when the Smart ID record was created.
   * Firestore will automatically convert a JavaScript Date object to a Firestore Timestamp.
   */
  created_at: Date;

  /** Firebase Cloud Messaging (FCM) token for sending push notifications to the parent's device (or student's, if parent mode is on same device). Optional. */
  fcm_token?: string | null;
}
