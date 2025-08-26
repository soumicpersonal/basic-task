import { FormErrors } from '../types/student';

export const validateEmail = (email: string): string | null => {
  if (!email.trim()) {
    return 'Email is required';
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  
  return null;
};

export const validateName = (name: string): string | null => {
  if (!name.trim()) {
    return 'Name is required';
  }
  
  if (name.trim().length < 2) {
    return 'Name must be at least 2 characters long';
  }
  
  if (name.trim().length > 100) {
    return 'Name must not exceed 100 characters';
  }
  
  const nameRegex = /^[a-zA-Z\s]+$/;
  if (!nameRegex.test(name.trim())) {
    return 'Name can only contain letters and spaces';
  }
  
  return null;
};

export const validateCourse = (course: string): string | null => {
  if (!course.trim()) {
    return 'Course is required';
  }
  
  if (course.trim().length < 2) {
    return 'Course must be at least 2 characters long';
  }
  
  if (course.trim().length > 100) {
    return 'Course must not exceed 100 characters';
  }
  
  return null;
};

export const validateDateOfBirth = (dateOfBirth: string): string | null => {
  if (!dateOfBirth) {
    return 'Date of birth is required';
  }
  
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  
  if (isNaN(birthDate.getTime())) {
    return 'Please enter a valid date';
  }
  
  if (birthDate >= today) {
    return 'Date of birth must be in the past';
  }
  
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    const actualAge = age - 1;
    if (actualAge < 16 || actualAge > 100) {
      return 'Student must be between 16 and 100 years old';
    }
  } else {
    if (age < 16 || age > 100) {
      return 'Student must be between 16 and 100 years old';
    }
  }
  
  return null;
};

export const validateStudentForm = (
  name: string,
  email: string,
  course: string,
  dateOfBirth: string
): FormErrors => {
  return {
    name: validateName(name),
    email: validateEmail(email),
    course: validateCourse(course),
    date_of_birth: validateDateOfBirth(dateOfBirth),
  };
};

export const hasErrors = (errors: FormErrors): boolean => {
  return Object.values(errors).some(error => error !== null && error !== undefined);
};
