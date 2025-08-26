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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-12">
          <div className="relative">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-3 sm:mb-4">
              Student Registration System
            </h1>
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-lg blur opacity-20"></div>
          </div>
          <p className="text-base sm:text-lg text-gray-300 mt-2 max-w-2xl mx-auto px-4">
            Register new students and view all registered students with our modern management system
          </p>
        </div>

        {/* Registration Form - Centered */}
        <div className="flex justify-center mb-8 sm:mb-12">
          <div className="w-full max-w-md">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-700/50 shadow-2xl hover:shadow-blue-500/10 transition-all duration-300">
              <div className="p-4 sm:p-6 lg:p-8">
                <div className="flex items-center mb-4 sm:mb-6">
                  <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full mr-3"></div>
                  <h2 className="text-xl sm:text-2xl font-semibold text-white">Register Student</h2>
                </div>
                <StudentForm onStudentAdded={handleStudentAdded} />
              </div>
            </div>
          </div>
        </div>

        {/* Students Table - Full Width Below Form */}
        <div className="w-full">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-700/50 shadow-2xl hover:shadow-purple-500/10 transition-all duration-300">
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="flex items-center mb-4 sm:mb-6">
                <div className="w-2 h-8 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full mr-3"></div>
                <h2 className="text-xl sm:text-2xl font-semibold text-white">All Students</h2>
              </div>
              <StudentTable
                students={students}
                loading={loading}
                error={error}
              />
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-8 sm:mt-12 lg:mt-16">
          <div className="bg-gradient-to-r from-gray-800/50 via-gray-900/50 to-gray-800/50 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden">
            <div className="p-6 sm:p-8 lg:p-10">
              <h3 className="text-xl sm:text-2xl font-semibold text-center text-white mb-6 sm:mb-8">
                Statistics Overview
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 transform hover:scale-105">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                    {students.length}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-300 font-medium">
                    Total Students
                  </div>
                </div>
                <div className="bg-gradient-to-br from-green-500/10 to-green-600/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center border border-green-500/20 hover:border-green-500/40 transition-all duration-300 transform hover:scale-105">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2">
                    {new Set(students.map(s => s.course)).size}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-300 font-medium">
                    Unique Courses
                  </div>
                </div>
                <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 transform hover:scale-105 sm:col-span-1 col-span-1">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                    {students.filter(s => {
                      const today = new Date();
                      const createdAt = new Date(s.created_at || '');
                      return today.toDateString() === createdAt.toDateString();
                    }).length}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-300 font-medium">
                    Registered Today
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 sm:mt-12 text-center">
          <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-gray-800/30 backdrop-blur-sm border border-gray-700/50">
            <p className="text-xs sm:text-sm text-gray-400">
              Built with  using React, Node.js, Express, and SQLite
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
