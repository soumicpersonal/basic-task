-- Student Registration Database Setup Script
-- Run this in your MySQL server to set up the database

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS student_registration;

-- Use the database
USE student_registration;

-- Create students table
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    course VARCHAR(255) NOT NULL,
    date_of_birth DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert some sample data for testing (optional)
INSERT IGNORE INTO students (name, email, course, date_of_birth) VALUES
('John Doe', 'john.doe@example.com', 'Computer Science', '2000-05-15'),
('Jane Smith', 'jane.smith@example.com', 'Business Administration', '1999-12-20'),
('Alice Johnson', 'alice.johnson@example.com', 'Engineering', '2001-03-10');
