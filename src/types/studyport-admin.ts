
// src/types/studyport-admin.ts

// Note: If using Firebase JS SDK v9+, Timestamp would be imported from 'firebase/firestore'
// import type { Timestamp } from 'firebase/firestore';

/**
 * Represents a StudyPort™ Administrator or staff member.
 */
export interface StudyPortAdmin {
  /** Unique admin identifier, often corresponding to their Firebase Auth UID. */
  admin_id: string;

  /** Full name of the administrator. */
  name: string;

  /** Email address of the administrator (used for login). */
  email: string;

  /** Identifier for the StudyPort™ zone they are assigned to manage. */
  assigned_studyport_id: string;

  /** School code this StudyPort™ might be associated with (optional, if StudyPorts are school-specific). */
  school_code?: string | null;

  /** Role of the admin within the StudyPort™ (e.g., "supervisor", "incharge", "staff"). */
  role: string;

  /** Timestamp indicating when the admin record was created.
   *  Stored as a JavaScript Date object, converted to Firestore Timestamp on save.
   */
  created_at: Date;
}
