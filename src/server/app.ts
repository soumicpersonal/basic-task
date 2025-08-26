import express from 'express';
import cors from 'cors';
import { startApp } from 'modelence/server';
import { createDatabaseAdapter } from './config/database-adapter.js';
import studentRoutes from './routes/studentRoutes.js';

// Initialize database on startup with smart fallback
createDatabaseAdapter().then(() => {
  console.log('🎉 Database initialized successfully!');
}).catch(console.error);

startApp({
    modules: [/* Add your modules here */],
    setupApp: (app: express.Application) => {
        // Middleware - Enhanced CORS configuration
        app.use(cors({
            origin: [
                'http://localhost:3000',   // Modelence dev server
                'http://localhost:5173',   // Vite dev server  
                'http://localhost:3001'    // API server (for direct testing)
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
            console.log(`${req.method} ${req.path} - ${req.get('User-Agent')}`);
            next();
        });
        
        // API Routes - Must come BEFORE any catch-all routes
        app.get('/api/health', (req, res) => {
            console.log('Health endpoint hit');
            res.json({ status: 'OK', message: 'Server is running', timestamp: new Date().toISOString() });
        });
        
        app.use('/api/students', studentRoutes);
        
        // Catch-all API route for debugging
        app.use('/api/*', (req, res) => {
            console.log(`Unmatched API route: ${req.method} ${req.path}`);
            res.status(404).json({ 
                error: 'API endpoint not found', 
                path: req.path,
                method: req.method,
                availableEndpoints: [
                    'GET /api/health',
                    'GET /api/students',
                    'POST /api/students'
                ]
            });
        });
        
        // Global error handler
        app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
            console.error('Global error handler:', err);
            res.status(500).json({
                success: false,
                message: 'Something went wrong!'
            });
        });
    }
});
