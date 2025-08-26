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
    const baseClasses = "w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors";
    const hasError = touched[field] && errors[field];
    
    if (hasError) {
      return `${baseClasses} border-red-500 focus:ring-red-500`;
    }
    
    return `${baseClasses} border-gray-300 focus:ring-blue-500 focus:border-blue-500`;
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Student Registration
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
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
            <p id="name-error" className="mt-1 text-sm text-red-600" role="alert">
              {errors.name}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address *
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
            <p id="email-error" className="mt-1 text-sm text-red-600" role="alert">
              {errors.email}
            </p>
          )}
        </div>

        {/* Course Field */}
        <div>
          <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-1">
            Course *
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
            <p id="course-error" className="mt-1 text-sm text-red-600" role="alert">
              {errors.course}
            </p>
          )}
        </div>

        {/* Date of Birth Field */}
        <div>
          <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700 mb-1">
            Date of Birth *
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
            <p id="dob-error" className="mt-1 text-sm text-red-600" role="alert">
              {errors.date_of_birth}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          {isSubmitting ? (
            <>
              <LoadingSpinner />
              <span className="ml-2">Registering...</span>
            </>
          ) : (
            'Register Student'
          )}
        </button>
      </form>
    </div>
  );
};

export default StudentForm;
