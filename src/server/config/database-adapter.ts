import { Student, CreateStudentRequest } from '../models/Student.js';

// Database adapter interface
export interface DatabaseAdapter {
  initializeDatabase(): Promise<void>;
  createStudent(studentData: CreateStudentRequest): Promise<Student>;
  getAllStudents(): Promise<Student[]>;
  getStudentById(id: number): Promise<Student | null>;
  getStudentByEmail(email: string): Promise<Student | null>;
}

// SQLite Implementation
import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';

class SQLiteAdapter implements DatabaseAdapter {
  private db: Database | null = null;

  private async getConnection(): Promise<Database> {
    if (this.db) return this.db;
    
    try {
      this.db = await open({
        filename: path.join(process.cwd(), 'database.sqlite'),
        driver: sqlite3.Database
      });
      
      console.log('✅ SQLite database connected successfully');
      return this.db;
    } catch (error) {
      console.error('❌ SQLite connection failed:', error);
      throw error;
    }
  }

  async initializeDatabase(): Promise<void> {
    try {
      const db = await this.getConnection();

      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS students (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          course TEXT NOT NULL,
          date_of_birth DATE NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `;

      await db.exec(createTableQuery);
      console.log('✅ Students table created successfully (SQLite)');
    } catch (error) {
      console.error('❌ Database initialization failed:', error);
      throw error;
    }
  }

  async createStudent(studentData: CreateStudentRequest): Promise<Student> {
    const db = await this.getConnection();
    
    try {
      const { name, email, course, date_of_birth } = studentData;
      
      const result = await db.run(
        'INSERT INTO students (name, email, course, date_of_birth) VALUES (?, ?, ?, ?)',
        [name, email, course, date_of_birth]
      );
      
      const student = await db.get(
        'SELECT * FROM students WHERE id = ?',
        [result.lastID]
      );
      
      return student as Student;
    } catch (error: any) {
      if (error.message.includes('UNIQUE constraint failed')) {
        throw new Error('Email already exists');
      }
      throw error;
    }
  }
  
  async getAllStudents(): Promise<Student[]> {
    const db = await this.getConnection();
    
    const students = await db.all(
      'SELECT * FROM students ORDER BY created_at DESC'
    );
    
    return students as Student[];
  }
  
  async getStudentById(id: number): Promise<Student | null> {
    const db = await this.getConnection();
    
    const student = await db.get(
      'SELECT * FROM students WHERE id = ?',
      [id]
    );
    
    return student as Student || null;
  }
  
  async getStudentByEmail(email: string): Promise<Student | null> {
    const db = await this.getConnection();
    
    const student = await db.get(
      'SELECT * FROM students WHERE email = ?',
      [email]
    );
    
    return student as Student || null;
  }
}

// MySQL Implementation (your existing code)
import * as mysql from 'mysql2/promise';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

class MySQLAdapter implements DatabaseAdapter {
  private dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'student_registration'
  };

  private async createConnection() {
    try {
      const connection = await mysql.createConnection(this.dbConfig);
      console.log('✅ MySQL database connected successfully');
      return connection;
    } catch (error) {
      console.error('❌ MySQL connection failed:', error);
      throw error;
    }
  }

  async initializeDatabase(): Promise<void> {
    try {
      // Create connection without database to create the database first
      const tempConnection = await mysql.createConnection({
        ...this.dbConfig,
        database: undefined
      });

      // Create database if it doesn't exist
      await tempConnection.execute(`CREATE DATABASE IF NOT EXISTS ${this.dbConfig.database}`);
      await tempConnection.end();

      // Now connect to the actual database
      const connection = await this.createConnection();

      // Create students table
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS students (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          course VARCHAR(255) NOT NULL,
          date_of_birth DATE NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `;

      await connection.execute(createTableQuery);
      console.log('✅ Students table created successfully (MySQL)');
      
      await connection.end();
    } catch (error) {
      console.error('❌ Database initialization failed:', error);
      throw error;
    }
  }

  async createStudent(studentData: CreateStudentRequest): Promise<Student> {
    const connection = await this.createConnection();
    
    try {
      const { name, email, course, date_of_birth } = studentData;
      
      const [result] = await connection.execute<ResultSetHeader>(
        'INSERT INTO students (name, email, course, date_of_birth) VALUES (?, ?, ?, ?)',
        [name, email, course, date_of_birth]
      );
      
      const [rows] = await connection.execute<RowDataPacket[]>(
        'SELECT * FROM students WHERE id = ?',
        [result.insertId]
      );
      
      return rows[0] as Student;
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Email already exists');
      }
      throw error;
    } finally {
      await connection.end();
    }
  }
  
  async getAllStudents(): Promise<Student[]> {
    const connection = await this.createConnection();
    
    try {
      const [rows] = await connection.execute<RowDataPacket[]>(
        'SELECT * FROM students ORDER BY created_at DESC'
      );
      
      return rows as Student[];
    } finally {
      await connection.end();
    }
  }
  
  async getStudentById(id: number): Promise<Student | null> {
    const connection = await this.createConnection();
    
    try {
      const [rows] = await connection.execute<RowDataPacket[]>(
        'SELECT * FROM students WHERE id = ?',
        [id]
      );
      
      return rows.length > 0 ? rows[0] as Student : null;
    } finally {
      await connection.end();
    }
  }
  
  async getStudentByEmail(email: string): Promise<Student | null> {
    const connection = await this.createConnection();
    
    try {
      const [rows] = await connection.execute<RowDataPacket[]>(
        'SELECT * FROM students WHERE email = ?',
        [email]
      );
      
      return rows.length > 0 ? rows[0] as Student : null;
    } finally {
      await connection.end();
    }
  }
}

// Smart Database Factory
export const createDatabaseAdapter = async (): Promise<DatabaseAdapter> => {
  // For now, use SQLite by default for quick demo
  // Set USE_MYSQL=true in environment to force MySQL
  const forceMySQL = process.env.USE_MYSQL === 'true';
  
  if (forceMySQL) {
    try {
      console.log('🔄 Attempting MySQL connection...');
      const mysqlAdapter = new MySQLAdapter();
      await mysqlAdapter.initializeDatabase();
      console.log('🚀 Using MySQL database (Production-ready)');
      return mysqlAdapter;
    } catch (error) {
      console.warn('⚠️ MySQL connection failed, falling back to SQLite...');
      console.warn('Error:', (error as Error).message);
    }
  }
  
  // Use SQLite (reliable fallback)
  try {
    console.log('🔄 Initializing SQLite database...');
    const sqliteAdapter = new SQLiteAdapter();
    await sqliteAdapter.initializeDatabase();
    console.log('✅ Using SQLite database (Development mode - Perfect for demo!)');
    return sqliteAdapter;
  } catch (error) {
    console.error('❌ SQLite initialization failed:', error);
    throw new Error('Unable to initialize any database. Please check your setup.');
  }
};

