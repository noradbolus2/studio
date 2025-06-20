// src/types/parent-notification.ts

// Note: If using Firebase JS SDK v9+, Timestamp would be imported from 'firebase/firestore'
// import type { Timestamp } from 'firebase/firestore';

export type NotificationType =
  | 'weekly_report'
  | 'clarity_alert'
  | 'motivation_nudge'
  | 'missed_attendance'
  | 'general_update'
  | 'study_milestone'
  | 'test_alert'
  | 'new_assignment'
  | 'feedback_received'
  | 'event_reminder';

export type NotificationStatus = 'sent' | 'pending' | 'failed' | 'read' | 'archived';

export interface ParentNotification {
  /** Auto-generated unique ID for the notification document. */
  notification_id: string;

  /** Unique student identifier, referencing smart_ids.student_id. */
  student_id: string;

  /** Name of the student (denormalized for easier display). */
  student_name: string;

  /** Parent's contact information (phone or email, primarily for reference, FCM token is key for push). */
  parent_contact: string;

  /** Title of the notification (e.g., "Weekly StudyPort Report for Aditi"). */
  title: string;

  /** The main body of the notification message. */
  message: string;

  /** Category of the notification. */
  type: NotificationType;

  /** Current status of the notification. */
  status: NotificationStatus;

  /** Timestamp indicating when the notification was actually sent (or attempted).
   *  Stored as a JavaScript Date object, converted to Firestore Timestamp on save.
   */
  sent_at?: Date | null;

  /** Timestamp indicating when the notification record was created.
   *  Stored as a JavaScript Date object, converted to Firestore Timestamp on save.
   */
  created_at: Date;

  /** Optional: Link to navigate to when notification is tapped (e.g., /studyport/reports/report_id). */
  deep_link?: string | null;

  /** Optional: ID of the admin or system component that triggered this notification. */
  source_admin_id?: string | null;
}
