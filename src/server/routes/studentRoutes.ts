import { Router } from 'express';
import { StudentController } from '../controllers/studentController.js';
import { studentValidationRules, validate } from '../validators/studentValidator.js';

const router = Router();

// POST /api/students - Create a new student
router.post('/', studentValidationRules(), validate, StudentController.createStudent);

// GET /api/students - Get all students
router.get('/', StudentController.getAllStudents);

// GET /api/students/:id - Get student by ID
router.get('/:id', StudentController.getStudentById);

export default router;
