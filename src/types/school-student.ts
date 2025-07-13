
// src/types/school-student.ts

export interface SchoolStudent {
  studentId: string; // OSO Smart ID or school's admission number
  schoolId: string; // Foreign key to `schools` collection
  name: string;
  class: string; // e.g., "10"
  section: string; // e.g., "A"
  rollNumber: string;
  parentName?: string;
  parentContact?: string;
  status: "Active" | "Inactive" | "Alumni";
  dateOfBirth?: Date; // Firestore Timestamp
  admissionDate: Date; // Firestore Timestamp
  schoolHistory?: string[]; // Array of past school IDs
}

/*
Conceptual Firestore Rules for `students`:
----------------------------------------------------
match /schools/{schoolId}/students/{studentId} {
  // School staff can manage student records.
  function isSchoolStaff() {
    return request.auth.token.schoolId == schoolId && (request.auth.token.role == 'schoolAdmin' || request.auth.token.role == 'teacher');
  }

  // The student and their parent can view their own record.
  function isOwnerOrParent() {
    // Assuming student auth.uid is the studentId
    // And parent has a claim for their child's UID.
    return request.auth.uid == studentId || request.auth.token.childId == studentId;
  }
  
  allow read: if isSchoolStaff() || isOwnerOrParent();
  allow write: if isSchoolStaff(); // Create, Update, Delete
}
----------------------------------------------------
*/
