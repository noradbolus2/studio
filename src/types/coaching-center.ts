// src/types/coaching-center.ts

/**
 * Represents a Coaching Center registered on the OSO platform.
 */
export interface CoachingCenter {
  /** Unique identifier for the coaching center. Can be auto-generated or a custom ID. */
  coaching_id: string;

  /** Official name of the coaching center. */
  name: string;

  /** Full address of the coaching center's primary location. */
  address?: string | null;

  /** City where the coaching center is located. */
  city?: string | null;

  /** State where the coaching center is located. */
  state?: string | null;

  /** Name of the primary contact person for the coaching center. */
  contact_person_name?: string | null;

  /** Official email address of the coaching center or its contact person. */
  contact_email?: string | null;

  /** Primary contact phone number for the coaching center. */
  contact_phone?: string | null;

  /**
   * Array of subjects or exam categories the coaching center specializes in.
   * @example ["IIT-JEE Physics", "NEET Biology", "UPSC History", "CAT Quant"]
   */
  specialties?: string[] | null;

  /** URL to the coaching center's logo. */
  logo_url?: string | null;

  /** A brief description or tagline for the coaching center. */
  description?: string | null;

  /** 
   * Timestamp indicating when the coaching center record was created.
   * Will be automatically converted to Firestore Timestamp on save if a JS Date is provided.
   */
  created_at: Date;

  /** 
   * Timestamp indicating when the coaching center record was last updated.
   * Will be automatically converted to Firestore Timestamp on save if a JS Date is provided.
   */
  updated_at: Date;
}

/*
Conceptual Firestore Security Rules for `coaching_centers`:
-------------------------------------------------------------
match /coaching_centers/{centerId} {
  // Helper: Is the requester a platform admin?
  function isPlatformAdmin() {
    return request.auth.token.role == 'platformAdmin';
  }
  // Helper: Is the requester an admin of this specific coaching center?
  // Assumes coaching center admins have custom claims: role = 'coachingCenterAdmin', coaching_id = centerId
  function isCenterAdmin() {
    return request.auth.token.role == 'coachingCenterAdmin' && request.auth.token.coaching_id == centerId;
  }
  function isAssignedCoachToThisCenter() {
    return request.auth.token.role == 'coach' && get(/databases/$(database)/documents/coaches/$(request.auth.uid)).data.coaching_id == centerId;
  }
  function isStudentAssignedToThisCenter() {
    return request.auth.token.role == 'student' && get(/databases/$(database)/documents/smart_ids/$(request.auth.uid)).data.assigned_coaching_id == centerId;
  }

  // CREATE: Typically by Platform Admin.
  allow create: if isPlatformAdmin();

  // READ: Authenticated users (students, parents, coaches) can read center details. Center Admins and Platform Admins.
  allow read: if request.auth != null || isPlatformAdmin() || isCenterAdmin() || isAssignedCoachToThisCenter() || isStudentAssignedToThisCenter();

  // UPDATE: Only Platform Admin or the Coaching Center's own Admin.
  allow update: if isPlatformAdmin() || isCenterAdmin();

  // DELETE: Only Platform Admin.
  allow delete: if isPlatformAdmin();
}
-------------------------------------------------------------
*/
