import express from 'express';
import cors from 'cors';
import { createDatabaseAdapter } from './config/database-adapter.js';
import { StudentService } from './services/studentService.js';
import { studentValidationRules, validate } from './validators/studentValidator.js';

const app = express();
const PORT = process.env.PORT || 4000;

// Initialize database
let dbReady = false;
createDatabaseAdapter().then(() => {
  console.log('🎉 Database initialized successfully!');
  dbReady = true;
}).catch(console.error);

// Middleware
app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://localhost:5173',
        'http://localhost:4000'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    optionsSuccessStatus: 200
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Check if database is ready middleware
const checkDbReady = (req: any, res: any, next: any) => {
    if (!dbReady) {
        return res.status(503).json({
            success: false,
            message: 'Database not ready yet, please try again in a moment'
        });
    }
    next();
};

// Routes
app.get('/api/health', (req, res) => {
    console.log('✅ Health endpoint hit');
    res.json({ 
        status: 'OK', 
        message: 'Backend server is running', 
        timestamp: new Date().toISOString(),
        port: PORT,
        database: dbReady ? 'ready' : 'initializing'
    });
});

// GET all students
app.get('/api/students', checkDbReady, async (req, res) => {
    try {
        console.log('📚 Getting all students');
        const students = await StudentService.getAllStudents();
        res.json({
            success: true,
            message: 'Students fetched successfully',
            data: students
        });
    } catch (error: any) {
        console.error('❌ Error fetching students:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// POST create student
app.post('/api/students', checkDbReady, studentValidationRules(), validate, async (req, res) => {
    try {
        console.log('➕ Creating new student:', req.body);
        
        // Check if email already exists
        const existingStudent = await StudentService.getStudentByEmail(req.body.email);
        if (existingStudent) {
            return res.status(400).json({
                success: false,
                message: 'Email already exists'
            });
        }
        
        const student = await StudentService.createStudent(req.body);
        
        console.log('✅ Student created:', student);
        res.status(201).json({
            success: true,
            message: 'Student registered successfully',
            data: student
        });
    } catch (error: any) {
        console.error('❌ Error creating student:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
});

// GET student by ID
app.get('/api/students/:id', checkDbReady, async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`🔍 Getting student with ID: ${id}`);
        
        const student = await StudentService.getStudentById(parseInt(id));
        
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Student fetched successfully',
            data: student
        });
    } catch (error: any) {
        console.error('❌ Error fetching student:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Student Registration API Server',
        version: '1.0.0',
        endpoints: {
            health: '/api/health',
            students: '/api/students'
        },
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        path: req.originalUrl,
        method: req.method,
        availableEndpoints: [
            'GET /',
            'GET /api/health',
            'GET /api/students',
            'POST /api/students',
            'GET /api/students/:id'
        ]
    });
});

// Error handler
app.use((err: any, req: any, res: any, next: any) => {
    console.error('❌ Global error handler:', err);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!'
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Backend server running on http://localhost:${PORT}`);
    console.log(`📚 API endpoints:`);
    console.log(`   📍 Health: http://localhost:${PORT}/api/health`);
    console.log(`   👥 Students: http://localhost:${PORT}/api/students`);
});

export default app;
