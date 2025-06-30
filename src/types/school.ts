// src/types/school.ts

export interface School {
  schoolId: string; // The unique ID for the school, e.g., "DPS_DELHI_123"
  apiSchoolId?: string; // The ID from an external API if one is used
  name: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  contactNumber?: string;
  email?: string;
  principalName?: string;
  affiliationNumber?: string; // e.g., CBSE affiliation
  logoUrl?: string;
  dataAiHint?: string; // For logo image
  // OSO Platform Specific Fields
  platformAdminContact: {
    name: string;
    email: string;
    phone?: string;
    designation: string; // e.g., "Principal", "IT Head"
  };
  createdAt: Date; // Firestore Timestamp
  updatedAt: Date; // Firestore Timestamp
}

/*
Conceptual Firestore Rules for `schools`:
----------------------------------------------------
match /schools/{schoolId} {
  // Anyone authenticated can view basic school details.
  allow read: if request.auth != null;

  // Only a platform administrator can create a new school record.
  allow create: if request.auth.token.role == 'platformAdmin';

  // Only a platform admin or the designated school admin can update.
  function isSchoolAdmin() {
    return request.auth.token.role == 'schoolAdmin' && request.auth.token.schoolId == schoolId;
  }
  allow update: if request.auth.token.role == 'platformAdmin' || isSchoolAdmin();

  // Only a platform admin can delete a school record.
  allow delete: if request.auth.token.role == 'platformAdmin';
}
----------------------------------------------------
*/
