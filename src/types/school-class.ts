// src/types/school-class.ts

export interface SchoolClass {
  classId: string; // e.g., "10A_2024"
  schoolId: string; // Foreign key to `schools` collection
  className: string; // e.g., "10"
  section: string; // e.g., "A"
  academicYear: string; // e.g., "2024-2025"
  classTeacherId: string; // Foreign key to `school_staff` collection
  studentIds: string[]; // List of student IDs in this class
}

/*
Conceptual Firestore Rules for `classes`:
----------------------------------------------------
match /schools/{schoolId}/classes/{classId} {
    // School admins and teachers of that school can manage classes.
    function isSchoolStaff() {
      return request.auth.token.schoolId == schoolId && (request.auth.token.role == 'schoolAdmin' || request.auth.token.role == 'teacher');
    }

    // Students of this class and their parents can read it.
    function isMemberOfClass() {
      let studentDoc = get(/databases/$(database)/documents/students/$(request.auth.uid)).data;
      return studentDoc.schoolId == schoolId && studentDoc.classId == classId;
    }
  
  allow read: if isSchoolStaff() || isMemberOfClass();
  allow write: if isSchoolStaff(); // Create, Update, Delete
}
----------------------------------------------------
*/
