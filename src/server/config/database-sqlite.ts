import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';

let db: Database | null = null;

export const createConnection = async () => {
  if (db) return db;
  
  try {
    db = await open({
      filename: path.join(process.cwd(), 'database.sqlite'),
      driver: sqlite3.Database
    });
    
    console.log('SQLite database connected successfully');
    return db;
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
};

export const initializeDatabase = async () => {
  try {
    const connection = await createConnection();

    // Create students table
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

    await connection.exec(createTableQuery);
    console.log('Students table created successfully');
    
    return connection;
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
};

