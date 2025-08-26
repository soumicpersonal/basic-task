import React from 'react';
import { Student } from '../types/student';

interface StudentTableProps {
  students: Student[];
  loading: boolean;
  error?: string;
}

const StudentTable: React.FC<StudentTableProps> = ({ students, loading, error }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  if (loading) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <span className="text-gray-300 text-sm">Loading students...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <div className="text-center py-12">
          <div className="text-red-400 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-red-400 font-medium mb-2">Error loading students</p>
          <p className="text-gray-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center">
          <span className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 text-xs sm:text-sm font-medium px-3 py-1 rounded-full border border-blue-500/30">
            {students.length} {students.length === 1 ? 'student' : 'students'}
          </span>
        </div>
      </div>

      {students.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <p className="text-gray-300 font-medium mb-2">No students registered yet</p>
          <p className="text-gray-400 text-sm">Students will appear here after registration</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block w-full">
            <div className="w-full overflow-hidden rounded-2xl border border-gray-700/50 shadow-2xl bg-gradient-to-b from-gray-800/20 to-gray-900/40 backdrop-blur-lg">
              {/* Enhanced Table Header */}
              <div className="bg-gradient-to-r from-gray-900/80 via-gray-800/60 to-gray-900/80 px-6 py-4 border-b border-gray-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></div>
                    <span className="text-white font-semibold">Student Database</span>
                    <span className="text-xs text-gray-400 bg-gray-800/50 px-2 py-1 rounded-full">
                      {students.length} records
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  </div>
                </div>
              </div>

              <table className="min-w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-900/60 to-gray-800/40">
                    <th scope="col" className="group px-6 py-5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider border-b border-gray-700/30">
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>Student Info</span>
                      </div>
                    </th>
                    <th scope="col" className="group px-6 py-5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider border-b border-gray-700/30">
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                        <span>Contact</span>
                      </div>
                    </th>
                    <th scope="col" className="group px-6 py-5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider border-b border-gray-700/30">
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <span>Course</span>
                      </div>
                    </th>
                    <th scope="col" className="group px-6 py-5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider border-b border-gray-700/30">
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>Age</span>
                      </div>
                    </th>
                    <th scope="col" className="group px-6 py-5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider border-b border-gray-700/30">
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Registered</span>
                      </div>
                    </th>
                    <th scope="col" className="group px-6 py-5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider border-b border-gray-700/30">
                      <span>Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/30">
                  {students.map((student, index) => (
                    <tr 
                      key={student.id} 
                      className="group hover:bg-gradient-to-r hover:from-gray-800/40 hover:to-gray-700/20 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/5"
                    >
                      {/* Student Info Column */}
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="relative flex-shrink-0">
                            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-cyan-500/20 flex items-center justify-center border border-blue-500/30 shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300 group-hover:scale-105">
                              <span className="text-sm font-bold text-blue-400 group-hover:text-blue-300 transition-colors">
                                {student.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                              </span>
                            </div>
                            <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-gray-800 animate-pulse"></div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-white group-hover:text-blue-200 transition-colors">
                              {student.name}
                            </div>
                            <div className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors flex items-center mt-1">
                              <span className="bg-gray-700/50 px-2 py-0.5 rounded text-xs">
                                ID: {student.id}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Email Column */}
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <div className="text-sm text-gray-300 group-hover:text-gray-200 transition-colors">
                            {student.email}
                          </div>
                          <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-700/50 rounded">
                            <svg className="w-3 h-3 text-gray-400 hover:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                        </div>
                      </td>

                      {/* Course Column */}
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border border-green-500/30 shadow-sm group-hover:shadow-green-500/20 transition-all duration-300 group-hover:scale-105">
                          <div className="h-1.5 w-1.5 rounded-full bg-green-400 mr-2 animate-pulse"></div>
                          {student.course}
                        </span>
                      </td>

                      {/* Age Column */}
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-300 group-hover:text-gray-200 transition-colors font-medium">
                            {calculateAge(student.date_of_birth)}
                          </span>
                          <span className="text-xs text-gray-500">years</span>
                        </div>
                      </td>

                      {/* Registration Date Column */}
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                          {student.created_at ? formatDate(student.created_at) : 'N/A'}
                        </div>
                      </td>

                      {/* Actions Column */}
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <button className="p-2 hover:bg-blue-500/20 rounded-lg transition-colors group/btn">
                            <svg className="w-4 h-4 text-gray-400 group-hover/btn:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors group/btn">
                            <svg className="w-4 h-4 text-gray-400 group-hover/btn:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* Enhanced Table Footer */}
              <div className="bg-gradient-to-r from-gray-900/60 to-gray-800/40 px-6 py-4 border-t border-gray-700/30">
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>Showing {students.length} students</span>
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-green-400 mr-2"></div>
                      Active Students
                    </span>
                    <span className="text-xs bg-gray-800/50 px-2 py-1 rounded">
                      Updated: {new Date().toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-3 sm:space-y-4">
            {students.map((student, index) => (
              <div key={student.id} className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/50 p-4 hover:border-gray-600/50 transition-all duration-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-blue-500/30 mr-3">
                      <span className="text-sm font-medium text-blue-400">
                        {student.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-white font-medium text-sm sm:text-base">{student.name}</h3>
                      <p className="text-gray-400 text-xs sm:text-sm">ID: {student.id}</p>
                    </div>
                  </div>
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border border-green-500/30">
                    {student.course}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                    <span className="text-gray-300">{student.email}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-gray-300">{calculateAge(student.date_of_birth)} years old</span>
                    </div>
                    
                    <div className="text-gray-400 text-xs">
                      {student.created_at ? formatDate(student.created_at) : 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default StudentTable;
