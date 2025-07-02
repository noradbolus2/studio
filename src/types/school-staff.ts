// src/types/school-staff.ts

export interface StaffMember {
  id: string;
  name: string;
  email: string; // Used for login
  password?: string; // For prototype, admin sets this. In real app, this would be hashed or invite-based.
  role: "Teacher" | "Admin" | "Support Staff" | "Principal" | "Librarian" | "Accountant" | string; // Allow string for "Other"
  subjectOrDepartment: string;
  contact: string;
  status: "Active" | "Inactive";
  schoolId: string;
}
