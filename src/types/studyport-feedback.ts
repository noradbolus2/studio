
// src/types/studyport-feedback.ts

// Note: If using Firebase JS SDK v9+, Timestamp would be imported from 'firebase/firestore'
// import type { Timestamp } from 'firebase/firestore';

/**
 * Represents feedback or notes logged by an admin for a specific student session.
 */
export interface StudyPortFeedback {
  /** Auto-generated unique ID for the feedback document. */
  feedback_id: string;

  /** ID of the student's session this feedback pertains to, referencing studyport_sessions.session_id. */
  session_id: string;

  /** Unique student identifier, referencing smart_ids.student_id. */
  student_id: string;

  /** ID of the admin who logged this feedback, referencing studyport_admins.admin_id. */
  admin_id: string;

  /** The textual note or observation made by the admin. */
  note: string;

  /** Optional rating (e.g., "low", "medium", "high") for focus, behavior, etc. */
  rating?: 'low' | 'medium' | 'high' | string | null;

  /** Timestamp indicating when the feedback was logged.
   *  Stored as a JavaScript Date object, converted to Firestore Timestamp on save.
   */
  timestamp: Date;
}
