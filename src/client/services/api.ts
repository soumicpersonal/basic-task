import { Student, CreateStudentRequest, ApiResponse } from '../types/student';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ?'/.netlify/functions/api'   // ✅ Netlify serverless function path
  : 'http://localhost:4000/api';

class ApiService {
  private async fetchWithErrorHandling<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Something went wrong',
          errors: data.errors,
        };
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      return {
        success: false,
        message: 'Network error. Please check your connection.',
      };
    }
  }

  async createStudent(studentData: CreateStudentRequest): Promise<ApiResponse<Student>> {
    return this.fetchWithErrorHandling<Student>('/students', {
      method: 'POST',
      body: JSON.stringify(studentData),
    });
  }

  async getAllStudents(): Promise<ApiResponse<Student[]>> {
    return this.fetchWithErrorHandling<Student[]>('/students');
  }

  async getStudentById(id: number): Promise<ApiResponse<Student>> {
    return this.fetchWithErrorHandling<Student>(`/students/${id}`);
  }

  async checkHealth(): Promise<ApiResponse<{ status: string; message: string }>> {
    return this.fetchWithErrorHandling('/health');
  }
}

export const apiService = new ApiService();
