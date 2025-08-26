export interface Student {
  id?: number;
  name: string;
  email: string;
  course: string;
  date_of_birth: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface CreateStudentRequest {
  name: string;
  email: string;
  course: string;
  date_of_birth: string;
}
