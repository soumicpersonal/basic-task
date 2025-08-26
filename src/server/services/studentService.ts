import { createDatabaseAdapter, DatabaseAdapter } from '../config/database-adapter.js';
import { Student, CreateStudentRequest } from '../models/Student.js';

let dbAdapter: DatabaseAdapter | null = null;

const getDbAdapter = async (): Promise<DatabaseAdapter> => {
  if (!dbAdapter) {
    dbAdapter = await createDatabaseAdapter();
  }
  return dbAdapter;
};

export class StudentService {
  static async createStudent(studentData: CreateStudentRequest): Promise<Student> {
    const adapter = await getDbAdapter();
    return adapter.createStudent(studentData);
  }
  
  static async getAllStudents(): Promise<Student[]> {
    const adapter = await getDbAdapter();
    return adapter.getAllStudents();
  }
  
  static async getStudentById(id: number): Promise<Student | null> {
    const adapter = await getDbAdapter();
    return adapter.getStudentById(id);
  }
  
  static async getStudentByEmail(email: string): Promise<Student | null> {
    const adapter = await getDbAdapter();
    return adapter.getStudentByEmail(email);
  }
}
