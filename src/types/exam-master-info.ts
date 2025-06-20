
// src/types/exam-master-info.ts
// Note: If using Firebase JS SDK v9+, Timestamp would be imported from 'firebase/firestore'
// import type { Timestamp } from 'firebase/firestore';

export interface RecommendedBook {
  title: string;
  author?: string | null;
  buy_link?: string | null; // Optional affiliate or purchase link
}

export interface NewsFeedItem {
  title: string;
  link?: string | null;
  source?: string | null;
  date: Date; // Will be Firestore Timestamp
}

export interface ExamMasterInfo {
  /**
   * Unique identifier for the exam (e.g., "jee_main", "neet_ug").
   * This will be the document ID in the 'exam_master_list' collection.
   */
  exam_id: string;

  /** English name of the exam. */
  exam_name_en: string;

  /** Hindi name of the exam. */
  exam_name_hi: string;

  /** Level of the exam. */
  exam_level: "National" | "State" | "University" | "School";

  /** Broad categories this exam falls under. */
  categories: string[]; // e.g., ["Engineering", "Medical Entrance"]

  /** Core subjects covered in this exam. */
  subjects_covered: string[]; // e.g., ["Physics", "Chemistry", "Maths"]

  /** List of recommended books for this exam. */
  recommended_books?: RecommendedBook[] | null;

  /** Array of official website links for the exam. */
  official_website_links?: string[] | null;

  /** Direct link to the latest official syllabus PDF or page. */
  syllabus_link?: string | null;

  /** Recent news or notifications related to the exam. */
  latest_news_feed?: NewsFeedItem[] | null;

  /** Timestamp indicating when this exam information was last updated. */
  last_updated: Date; // Will be Firestore Timestamp
}
