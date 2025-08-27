import serverless from "serverless-http";
import express from "express";
import cors from "cors";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health
app.get(["/api/health", "/.netlify/functions/api/health"], (_req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// Demo in-memory students API (mirrors Vercel functions)
let students = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    course: "Computer Science",
    date_of_birth: "2000-05-15",
    created_at: "2025-01-01T10:00:00.000Z",
    updated_at: "2025-01-01T10:00:00.000Z",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    course: "Business Administration",
    date_of_birth: "1999-12-20",
    created_at: "2025-01-01T11:00:00.000Z",
    updated_at: "2025-01-01T11:00:00.000Z",
  },
];

app.get(["/api/students", "/.netlify/functions/api/students"], (req, res) => {
  if (req.query.id) {
    const student = students.find((s) => s.id === parseInt(req.query.id));
    if (!student) return res.status(404).json({ success: false, message: "Student not found" });
    return res.json({ success: true, message: "Student fetched successfully", data: student });
  }
  return res.json({ success: true, message: "Students fetched successfully", data: students });
});

app.post(["/api/students", "/.netlify/functions/api/students"], (req, res) => {
  const { name, email, course, date_of_birth } = req.body;
  const errors = [];
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validateName = (name) => !!name && name.trim().length >= 2 && name.trim().length <= 100 && /^[a-zA-Z\s]+$/.test(name.trim());
  const validateCourse = (course) => !!course && course.trim().length >= 2 && course.trim().length <= 100;
  const validateDateOfBirth = (date) => {
    if (!date) return false;
    const d = new Date(date);
    const today = new Date();
    if (isNaN(d.getTime()) || d >= today) return false;
    let age = today.getFullYear() - d.getFullYear();
    const m = today.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age -= 1;
    return age >= 16 && age <= 100;
  };

  if (!validateName(name)) errors.push({ field: "name", message: "Name must be 2-100 characters and contain only letters and spaces" });
  if (!validateEmail(email)) errors.push({ field: "email", message: "Please provide a valid email address" });
  if (!validateCourse(course)) errors.push({ field: "course", message: "Course must be 2-100 characters" });
  if (!validateDateOfBirth(date_of_birth)) errors.push({ field: "date_of_birth", message: "Student must be between 16 and 100 years old" });
  if (errors.length) return res.status(400).json({ success: false, message: "Validation errors", errors });
  if (students.find((s) => s.email === email)) return res.status(400).json({ success: false, message: "Email already exists" });

  const newStudent = {
    id: Math.max(...students.map((s) => s.id), 0) + 1,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    course: course.trim(),
    date_of_birth,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  students.push(newStudent);
  return res.status(201).json({ success: true, message: "Student registered successfully", data: newStudent });
});

// Minimal internal endpoints required by Modelence client
// Note: This is a lightweight stub sufficient for demo usage
app.post(["/api/_internal/method/_system.session.init", "/.netlify/functions/api/_internal/method/_system.session.init"], (_req, res) => {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 1000 * 60 * 60);
  res.json({
    data: {
      configs: [],
      session: { authToken: "demo-token", expiresAt, userId: null },
      user: null
    },
    typeMap: {}
  });
});

app.post(["/api/_internal/method/_system.session.heartbeat", "/.netlify/functions/api/_internal/method/_system.session.heartbeat"], (_req, res) => {
  res.json({ data: { ok: true }, typeMap: {} });
});

// Export as Netlify function
export const handler = serverless(app);
