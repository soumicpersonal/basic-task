import React, { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { CreateStudentRequest, FormErrors } from '../types/student';
import { validateStudentForm, hasErrors } from '../utils/validation';
import { apiService } from '../services/api';
import LoadingSpinner from './LoadingSpinner';

interface StudentFormProps {
  onStudentAdded: () => void;
}

const StudentForm: React.FC<StudentFormProps> = ({ onStudentAdded }) => {
  const [formData, setFormData] = useState<CreateStudentRequest>({
    name: '',
    email: '',
    course: '',
    date_of_birth: '',
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    course: false,
    date_of_birth: false,
  });

  const handleInputChange = useCallback((field: keyof CreateStudentRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Real-time validation
    const fieldErrors = validateStudentForm(
      field === 'name' ? value : formData.name,
      field === 'email' ? value : formData.email,
      field === 'course' ? value : formData.course,
      field === 'date_of_birth' ? value : formData.date_of_birth
    );
    
    setErrors(prev => ({ ...prev, [field]: fieldErrors[field] }));
  }, [formData]);

  const handleBlur = (field: keyof CreateStudentRequest) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({
      name: true,
      email: true,
      course: true,
      date_of_birth: true,
    });
    
    // Validate all fields
    const formErrors = validateStudentForm(
      formData.name,
      formData.email,
      formData.course,
      formData.date_of_birth
    );
    
    setErrors(formErrors);
    
    if (hasErrors(formErrors)) {
      toast.error('Please fix the validation errors');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await apiService.createStudent(formData);
      
      if (response.success) {
        toast.success('Student registered successfully!');
        setFormData({
          name: '',
          email: '',
          course: '',
          date_of_birth: '',
        });
        setTouched({
          name: false,
          email: false,
          course: false,
          date_of_birth: false,
        });
        setErrors({});
        onStudentAdded();
      } else {
        toast.error(response.message || 'Failed to register student');
        
        // Handle server validation errors
        if (response.errors) {
          const serverErrors: FormErrors = {};
          response.errors.forEach(error => {
            serverErrors[error.field as keyof FormErrors] = error.message;
          });
          setErrors(prev => ({ ...prev, ...serverErrors }));
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInputClassName = (field: keyof CreateStudentRequest) => {
    const baseClasses = "w-full px-4 py-3 sm:py-4 bg-gray-900/50 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 text-white placeholder-gray-400 backdrop-blur-sm";
    const hasError = touched[field] && errors[field];
    
    if (hasError) {
      return `${baseClasses} border-red-500/50 focus:ring-red-500/50 focus:border-red-400`;
    }
    
    return `${baseClasses} border-gray-600/50 focus:ring-blue-500/50 focus:border-blue-400 hover:border-gray-500/70`;
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6" noValidate>
        {/* Name Field */}
        <div className="group">
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2 group-focus-within:text-blue-400 transition-colors">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Full Name *
            </span>
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            onBlur={() => handleBlur('name')}
            className={getInputClassName('name')}
            placeholder="Enter your full name"
            aria-describedby={errors.name ? 'name-error' : undefined}
            disabled={isSubmitting}
          />
          {touched.name && errors.name && (
            <p id="name-error" className="mt-2 text-sm text-red-400 flex items-center" role="alert">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {errors.name}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div className="group">
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2 group-focus-within:text-blue-400 transition-colors">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
              Email Address *
            </span>
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            onBlur={() => handleBlur('email')}
            className={getInputClassName('email')}
            placeholder="Enter your email address"
            aria-describedby={errors.email ? 'email-error' : undefined}
            disabled={isSubmitting}
          />
          {touched.email && errors.email && (
            <p id="email-error" className="mt-2 text-sm text-red-400 flex items-center" role="alert">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {errors.email}
            </p>
          )}
        </div>

        {/* Course Field */}
        <div className="group">
          <label htmlFor="course" className="block text-sm font-medium text-gray-300 mb-2 group-focus-within:text-blue-400 transition-colors">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Course *
            </span>
          </label>
          <input
            type="text"
            id="course"
            value={formData.course}
            onChange={(e) => handleInputChange('course', e.target.value)}
            onBlur={() => handleBlur('course')}
            className={getInputClassName('course')}
            placeholder="Enter your course"
            aria-describedby={errors.course ? 'course-error' : undefined}
            disabled={isSubmitting}
          />
          {touched.course && errors.course && (
            <p id="course-error" className="mt-2 text-sm text-red-400 flex items-center" role="alert">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {errors.course}
            </p>
          )}
        </div>

        {/* Date of Birth Field */}
        <div className="group">
          <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-300 mb-2 group-focus-within:text-blue-400 transition-colors">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Date of Birth *
            </span>
          </label>
          <input
            type="date"
            id="date_of_birth"
            value={formData.date_of_birth}
            onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
            onBlur={() => handleBlur('date_of_birth')}
            className={getInputClassName('date_of_birth')}
            aria-describedby={errors.date_of_birth ? 'dob-error' : undefined}
            disabled={isSubmitting}
          />
          {touched.date_of_birth && errors.date_of_birth && (
            <p id="dob-error" className="mt-2 text-sm text-red-400 flex items-center" role="alert">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {errors.date_of_birth}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 sm:py-4 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center font-medium shadow-lg hover:shadow-blue-500/25 transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {isSubmitting ? (
            <>
              <LoadingSpinner />
              <span className="ml-2">Registering...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Register Student
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default StudentForm;
