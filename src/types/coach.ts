// src/types/coach.ts

/**
 * Represents a Coach affiliated with a Coaching Center on the OSO platform.
 */
export interface Coach {
  /** 
   * Unique identifier for the coach, typically their Firebase Authentication UID.
   * This ID will be the document ID in the 'coaches' collection.
   */
  coach_id: string;

  /** Full name of the coach. */
  name: string;

  /** Email address of the coach, used for login and communication. */
  email: string;

  /** 
   * Identifier of the coaching center this coach is affiliated with.
   * Foreign key referencing `coaching_centers.coaching_id`.
   */
  coaching_id: string;

  /** 
   * Array of subjects or specific courses the coach teaches.
   * @example ["Physics", "JEE Mathematics", "NEET Chemistry - Organic"]
   */
  subjects_taught?: string[] | null;

  /** Number of years of teaching experience. */
  experience_years?: number | null;

  /** URL to the coach's profile image. */
  profile_image_url?: string | null;

  /** A short biography or professional summary of the coach. */
  bio?: string | null;

  /** 
   * Indicates if the coach's profile and affiliation have been verified 
   * by the admin of their assigned coaching center.
   */
  is_verified_by_center?: boolean;

  /** Contact phone number for the coach (optional, may be private). */
  phone_number?: string | null;

  /** 
   * Timestamp indicating when the coach record was created.
   * Will be automatically converted to Firestore Timestamp on save if a JS Date is provided.
   */
  created_at: Date;

  /** 
   * Timestamp indicating when the coach record was last updated.
   * Will be automatically converted to Firestore Timestamp on save if a JS Date is provided.
   */
  updated_at: Date;
}

/*
Conceptual Firestore Security Rules for `coaches`:
----------------------------------------------------
match /coaches/{coachId} { // coachId is expected to be the Firebase Auth UID
  // Helper: Is the requester a platform admin?
  function isPlatformAdmin() {
    return request.auth.token.role == 'platformAdmin';
  }
  // Helper: Is the requester this specific coach?
  function isThisCoach() {
    return request.auth.uid == coachId;
  }
  // Helper: Is the requester an admin of the coaching center this coach belongs to?
  function isCenterAdminForThisCoach(targetCoachingId) {
    return request.auth.token.role == 'coachingCenterAdmin' && request.auth.token.coaching_id == targetCoachingId;
  }
  // Helper function for student access to coaches of their assigned center
  function isStudentOfCoachsCenter(coachCoachingId) {
    let studentCoachingId = get(/databases/$(database)/documents/smart_ids/$(request.auth.uid)).data.assigned_coaching_id;
    return request.auth.token.role == 'student' && studentCoachingId == coachCoachingId;
  }


  // CREATE:
  // - Platform Admin can create coach profiles.
  // - Coaching Center Admin can create coaches for their center.
  // - A user with 'coach' role can create their own profile, linking to a coaching_id they provide.
  allow create: if (isPlatformAdmin() || 
                   isCenterAdminForThisCoach(request.resource.data.coaching_id) ||
                   (request.auth.token.role == 'coach' && request.auth.uid == coachId && request.resource.data.coaching_id != null)) &&
                  request.resource.data.email == request.auth.token.email; // Ensure email matches auth on creation

  // READ:
  // - The coach themselves.
  // - Admin of the center they belong to.
  // - Platform Admin.
  // - Students of the same coaching center (to see list of coaches).
  allow read: if isThisCoach() || 
                 isCenterAdminForThisCoach(resource.data.coaching_id) || 
                 isPlatformAdmin() ||
                 isStudentOfCoachsCenter(resource.data.coaching_id);

  // UPDATE:
  // - The coach themselves (their own profile, but cannot change email or coaching_id easily).
  // - Admin of the center they belong to (e.g., to verify, assign subjects_taught).
  // - Platform Admin.
  allow update: if (isThisCoach() && 
                    request.resource.data.email == resource.data.email && 
                    request.resource.data.coaching_id == resource.data.coaching_id) || 
                   isCenterAdminForThisCoach(resource.data.coaching_id) || 
                   isPlatformAdmin();

  // DELETE: Only Platform Admin, or Center Admin for coaches in their center.
  allow delete: if isPlatformAdmin() || isCenterAdminForThisCoach(resource.data.coaching_id);
}
----------------------------------------------------
*/
