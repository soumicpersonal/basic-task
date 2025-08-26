export interface Student {
  id?: number;
  name: string;
  email: string;
  course: string;
  date_of_birth: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateStudentRequest {
  name: string;
  email: string;
  course: string;
  date_of_birth: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export interface FormErrors {
  name?: string;
  email?: string;
  course?: string;
  date_of_birth?: string;
}
