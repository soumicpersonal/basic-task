import express from 'express';
import cors from 'cors';
import { createDatabaseAdapter } from './config/database-adapter.js';
import studentRoutes from './routes/studentRoutes.js';

const app = express();
const PORT = process.env.PORT || 4000;

// Initialize database on startup with smart fallback
createDatabaseAdapter().then(() => {
  console.log('🎉 Database initialized successfully!');
}).catch(console.error);

// Middleware - Enhanced CORS configuration
app.use(cors({
    origin: [
        'http://localhost:3000',   // Frontend
        'http://localhost:5173',   // Vite dev server backup
        'http://localhost:4000'    // Self-reference for testing
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    optionsSuccessStatus: 200
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug middleware to log all requests
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// API Routes
app.get('/api/health', (req, res) => {
    console.log('✅ Health endpoint hit');
    res.json({ 
        status: 'OK', 
        message: 'Backend server is running', 
        timestamp: new Date().toISOString(),
        port: PORT 
    });
});

app.use('/api/students', studentRoutes);

// Catch-all API route for debugging
app.use('/api/*', (req, res) => {
    console.log(`❌ Unmatched API route: ${req.method} ${req.path}`);
    res.status(404).json({ 
        error: 'API endpoint not found', 
        path: req.path,
        method: req.method,
        availableEndpoints: [
            'GET /api/health',
            'GET /api/students',
            'POST /api/students',
            'GET /api/students/:id'
        ]
    });
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

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
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
