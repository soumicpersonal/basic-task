import { Request, Response } from 'express';
import { StudentService } from '../services/studentService.js';
import { CreateStudentRequest } from '../models/Student.js';

export class StudentController {
  static async createStudent(req: Request, res: Response) {
    try {
      const studentData: CreateStudentRequest = req.body;
      
      // Check if email already exists
      const existingStudent = await StudentService.getStudentByEmail(studentData.email);
      if (existingStudent) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists'
        });
      }
      
      const student = await StudentService.createStudent(studentData);
      
      res.status(201).json({
        success: true,
        message: 'Student registered successfully',
        data: student
      });
    } catch (error: any) {
      console.error('Error creating student:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }
  
  static async getAllStudents(req: Request, res: Response) {
    try {
      const students = await StudentService.getAllStudents();
      
      res.status(200).json({
        success: true,
        message: 'Students fetched successfully',
        data: students
      });
    } catch (error: any) {
      console.error('Error fetching students:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
  
  static async getStudentById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const student = await StudentService.getStudentById(parseInt(id));
      
      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Student not found'
        });
      }
      
      res.status(200).json({
        success: true,
        message: 'Student fetched successfully',
        data: student
      });
    } catch (error: any) {
      console.error('Error fetching student:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}
