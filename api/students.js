// Vercel serverless function for students API
// Note: In production, you should use a cloud database like PlanetScale, Supabase, or MongoDB Atlas

// In-memory storage for demo (data will reset on function restart)
let students = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    course: "Computer Science",
    date_of_birth: "2000-05-15",
    created_at: "2025-01-01T10:00:00.000Z",
    updated_at: "2025-01-01T10:00:00.000Z"
  },
  {
    id: 2,
    name: "Jane Smith", 
    email: "jane.smith@example.com",
    course: "Business Administration",
    date_of_birth: "1999-12-20",
    created_at: "2025-01-01T11:00:00.000Z",
    updated_at: "2025-01-01T11:00:00.000Z"
  }
];

// Validation functions
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateName = (name) => {
  if (!name || name.trim().length < 2 || name.trim().length > 100) {
    return false;
  }
  const nameRegex = /^[a-zA-Z\s]+$/;
  return nameRegex.test(name.trim());
};

const validateCourse = (course) => {
  return course && course.trim().length >= 2 && course.trim().length <= 100;
};

const validateDateOfBirth = (dateOfBirth) => {
  if (!dateOfBirth) return false;
  
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  
  if (isNaN(birthDate.getTime()) || birthDate >= today) {
    return false;
  }
  
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    return age - 1 >= 16 && age - 1 <= 100;
  }
  
  return age >= 16 && age <= 100;
};

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { method, query } = req;

  try {
    switch (method) {
      case 'GET':
        // GET /api/students - Get all students
        // GET /api/students?id=1 - Get student by ID
        if (query.id) {
          const student = students.find(s => s.id === parseInt(query.id));
          if (!student) {
            return res.status(404).json({
              success: false,
              message: 'Student not found'
            });
          }
          return res.status(200).json({
            success: true,
            message: 'Student fetched successfully',
            data: student
          });
        } else {
          return res.status(200).json({
            success: true,
            message: 'Students fetched successfully',
            data: students
          });
        }

      case 'POST':
        // POST /api/students - Create new student
        const { name, email, course, date_of_birth } = req.body;

        // Validation
        const errors = [];
        
        if (!validateName(name)) {
          errors.push({ field: 'name', message: 'Name must be 2-100 characters and contain only letters and spaces' });
        }
        
        if (!validateEmail(email)) {
          errors.push({ field: 'email', message: 'Please provide a valid email address' });
        }
        
        if (!validateCourse(course)) {
          errors.push({ field: 'course', message: 'Course must be 2-100 characters' });
        }
        
        if (!validateDateOfBirth(date_of_birth)) {
          errors.push({ field: 'date_of_birth', message: 'Student must be between 16 and 100 years old' });
        }

        if (errors.length > 0) {
          return res.status(400).json({
            success: false,
            message: 'Validation errors',
            errors: errors
          });
        }

        // Check for duplicate email
        if (students.find(s => s.email === email)) {
          return res.status(400).json({
            success: false,
            message: 'Email already exists'
          });
        }

        // Create new student
        const newStudent = {
          id: Math.max(...students.map(s => s.id), 0) + 1,
          name: name.trim(),
          email: email.trim().toLowerCase(),
          course: course.trim(),
          date_of_birth,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        students.push(newStudent);

        return res.status(201).json({
          success: true,
          message: 'Student registered successfully',
          data: newStudent
        });

      default:
        return res.status(405).json({
          success: false,
          message: 'Method not allowed'
        });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}
