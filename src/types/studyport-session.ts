
// src/types/studyport-session.ts

// Note: If using Firebase JS SDK v9+, Timestamp would be imported from 'firebase/firestore'
// import type { Timestamp } from 'firebase/firestore';

/**
 * Represents a student's visit session to an OSO StudyPort™.
 */
export interface StudyPortSession {
  /** Auto-generated unique ID for the session document. */
  session_id: string;

  /** Unique student identifier, referencing smart_ids.student_id. */
  student_id: string;

  /** Name of the student (denormalized for easier querying/display). */
  student_name: string;

  /** School code of the student (denormalized). */
  school_code: string;

  /** Identifier for the physical StudyPort™ zone or room. */
  studyport_id: string;

  /** Timestamp when the student scanned in or the session started.
   *  Stored as a JavaScript Date object, converted to Firestore Timestamp on save.
   */
  entry_time: Date;

  /** Timestamp when the student scanned out or the session ended. Optional until exit.
   *  Stored as a JavaScript Date object, converted to Firestore Timestamp on save.
   */
  exit_time?: Date | null;

  /** Duration of the study session in minutes. Auto-calculated on exit. */
  duration_minutes?: number | null;

  /** Assessed focus level during the session (e.g., "high", "medium", "low"). */
  focus_level?: 'high' | 'medium' | 'low' | string | null; // string for future flexibility

  /** Assessed clarity status (e.g., "clear", "confused", "stressed").
   *  Could be synced from OSO Aura Map™ or a quick post-session survey.
   */
  clarity_status?: 'clear' | 'confused' | 'stressed' | string | null;

  /** Student's reported mood state. Optional, could be from Mind Diary. */
  mood_state?: string | null; // e.g., "happy", "distracted", "focused"

  /** Number of notes written or tasks completed. Optional tracking. */
  notes_written?: number | null;

  /** Flag indicating if OSO Turbo Tracker suggested or administered a test during this session. */
  auto_test_given?: boolean | null;

  /** Timestamp indicating when the session record was created.
   *  Stored as a JavaScript Date object, converted to Firestore Timestamp on save.
   */
  created_at: Date;
}
