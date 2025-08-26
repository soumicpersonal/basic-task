import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const studentValidationRules = () => {
  return [
    body('name')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters')
      .matches(/^[a-zA-Z\s]+$/)
      .withMessage('Name can only contain letters and spaces'),
    
    body('email')
      .trim()
      .isEmail()
      .withMessage('Please provide a valid email address')
      .normalizeEmail(),
    
    body('course')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Course must be between 2 and 100 characters'),
    
    body('date_of_birth')
      .isISO8601()
      .withMessage('Date of birth must be a valid date')
      .custom((value) => {
        const today = new Date();
        const birthDate = new Date(value);
        const age = today.getFullYear() - birthDate.getFullYear();
        
        if (age < 16 || age > 100) {
          throw new Error('Student must be between 16 and 100 years old');
        }
        
        return true;
      })
  ];
};

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation errors',
      errors: errors.array()
    });
  }
  
  next();
};
