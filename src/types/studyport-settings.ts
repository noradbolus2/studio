
// src/types/studyport-settings.ts

/**
 * Represents settings and rules for a specific OSO StudyPort™ zone.
 * The document ID for this collection should be the studyport_id itself.
 */
export interface StudyPortSettings {
  /** Identifier for the StudyPort™ zone these settings apply to. Matches the document ID. */
  studyport_id: string;

  /** Maximum allowed duration for a single study session in minutes. */
  max_duration_minutes?: number | null;

  /** Flag indicating if OSO Turbo Tracker can automatically trigger tests in this zone. */
  auto_test_enabled?: boolean;

  /** Array of grades/classes allowed to use this StudyPort™ zone. Empty or null means all. */
  allowed_grades?: string[] | null; // e.g., ["8", "9", "10"]

  /** Opening hours or operational times for the StudyPort™ zone. (Could be a string or structured object). */
  operating_hours?: string | { open: string; close: string; days: string[] } | null;

  /** Specific rules or guidelines for students using this StudyPort™ zone. */
  zone_rules?: string | null;

  /** Last updated timestamp for these settings.
   *  Stored as a JavaScript Date object, converted to Firestore Timestamp on save.
   */
  updated_at: Date;
}
