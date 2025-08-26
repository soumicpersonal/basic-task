import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import StudentForm from '../components/StudentForm';
import StudentTable from '../components/StudentTable';
import { Student } from '../types/student';
import { apiService } from '../services/api';

export default function HomePage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await apiService.getAllStudents();
      
      if (response.success && response.data) {
        setStudents(response.data);
      } else {
        setError(response.message || 'Failed to fetch students');
        toast.error('Failed to load students');
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      setError('Network error. Please check your connection.');
      toast.error('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleStudentAdded = useCallback(() => {
    fetchStudents();
  }, [fetchStudents]);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Student Registration System
          </h1>
          <p className="text-lg text-gray-600">
            Register new students and view all registered students
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Registration Form */}
          <div className="order-1 lg:order-1">
            <StudentForm onStudentAdded={handleStudentAdded} />
          </div>

          {/* Students Table */}
          <div className="order-2 lg:order-2">
            <StudentTable 
              students={students} 
              loading={loading} 
              error={error}
            />
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {students.length}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Total Students
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {new Set(students.map(s => s.course)).size}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Unique Courses
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {students.filter(s => {
                  const today = new Date();
                  const createdAt = new Date(s.created_at || '');
                  return today.toDateString() === createdAt.toDateString();
                }).length}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Registered Today
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Built with React, Node.js, Express, and MySQL</p>
        </div>
      </div>
    </div>
  );
}
