# Student Registration System

A fullstack web application for student registration with real-time validation, built with React, Node.js, Express, and MySQL.

## Features

### Frontend (React.js)
- ✅ Student Registration Form with real-time validation
- ✅ Email format validation and required field checks
- ✅ Age validation (16-100 years old)
- ✅ Responsive design with Tailwind CSS
- ✅ Accessibility features (ARIA labels, screen reader support)
- ✅ Real-time feedback and error handling
- ✅ Student table displaying all registered students
- ✅ Statistics dashboard

### Backend (Node.js/Express.js)
- ✅ REST API with proper endpoints
- ✅ POST /api/students - Create new student
- ✅ GET /api/students - Get all students
- ✅ GET /api/students/:id - Get student by ID
- ✅ Express-validator for input validation
- ✅ CORS configuration
- ✅ Error handling middleware
- ✅ MySQL database integration

### Integration
- ✅ Frontend-backend communication via REST API
- ✅ Real-time data updates
- ✅ Proper error handling and user feedback
- ✅ JSON data handling

## Prerequisites

Before running this application, make sure you have:

- Node.js (v16 or higher)
- MySQL Server (v8.0 or higher)
- npm or yarn package manager

## Installation & Setup

### 1. Clone and Install Dependencies

```bash
# Clone the repository (if from git)
git clone <repository-url>
cd basic-task

# Install dependencies
npm install
```

### 2. Database Setup

#### Option A: Using MySQL Command Line
```bash
# Login to MySQL
mysql -u root -p

# Run the setup script
source scripts/setup-db.sql
```

#### Option B: Using MySQL Workbench
1. Open MySQL Workbench
2. Connect to your MySQL server
3. Open and execute `scripts/setup-db.sql`

### 3. Environment Configuration

Create a `.env` file in the project root:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=student_registration

# Server Configuration
PORT=3001
NODE_ENV=development
```

### 4. Start the Application

```bash
# Development mode (starts both frontend and backend)
npm run dev

# The application will be available at:
# Frontend: http://localhost:5173
# Backend API: http://localhost:3001
```

## API Endpoints

### Students API

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/students` | Create a new student |
| GET | `/api/students` | Get all students |
| GET | `/api/students/:id` | Get student by ID |
| GET | `/api/health` | Health check |

### Student Data Structure

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john.doe@example.com",
  "course": "Computer Science",
  "date_of_birth": "2000-05-15",
  "created_at": "2024-01-15T10:30:00.000Z",
  "updated_at": "2024-01-15T10:30:00.000Z"
}
```

## Validation Rules

### Frontend & Backend Validation

- **Name**: 2-100 characters, letters and spaces only
- **Email**: Valid email format, unique in database
- **Course**: 2-100 characters, required
- **Date of Birth**: Valid date, age between 16-100 years

## Project Structure

```
basic-task/
├── src/
│   ├── client/                 # React frontend
│   │   ├── components/         # React components
│   │   │   ├── StudentForm.tsx # Registration form
│   │   │   ├── StudentTable.tsx# Students display table
│   │   │   └── LoadingSpinner.tsx
│   │   ├── pages/
│   │   │   └── HomePage.tsx    # Main page
│   │   ├── services/
│   │   │   └── api.ts          # API service layer
│   │   ├── types/
│   │   │   └── student.ts      # TypeScript interfaces
│   │   ├── utils/
│   │   │   └── validation.ts   # Frontend validation
│   │   └── ...
│   └── server/                 # Node.js backend
│       ├── config/
│       │   └── database.ts     # Database configuration
│       ├── controllers/
│       │   └── studentController.ts
│       ├── models/
│       │   └── Student.ts      # TypeScript interfaces
│       ├── routes/
│       │   └── studentRoutes.ts
│       ├── services/
│       │   └── studentService.ts
│       ├── validators/
│       │   └── studentValidator.ts
│       └── app.ts              # Express app setup
├── scripts/
│   └── setup-db.sql           # Database setup script
└── ...
```

## Technologies Used

- **Frontend**: React 18, TypeScript, Tailwind CSS, React Hot Toast
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: MySQL 8.0
- **Validation**: Express-validator (backend), Custom validation (frontend)
- **Build Tool**: Vite
- **Framework**: Modelence (fullstack framework)

## Development Notes

### Database Connection
The application automatically creates the database and tables on startup. Make sure MySQL is running and accessible.

### CORS Configuration
CORS is configured to allow requests from `http://localhost:5173` (Vite dev server).

### Error Handling
- Frontend: Toast notifications for user feedback
- Backend: Structured error responses with appropriate HTTP status codes

### Accessibility
- ARIA labels for form inputs
- Proper form validation feedback
- Keyboard navigation support
- Screen reader compatible

## Testing the Application

1. Start the application with `npm run dev`
2. Navigate to `http://localhost:5173`
3. Try registering a student with various inputs:
   - Valid data should succeed
   - Invalid email should show error
   - Duplicate email should show error
   - Age outside 16-100 range should show error
4. Check that students appear in the table
5. Verify the statistics update correctly

## Troubleshooting

### Database Connection Issues
- Ensure MySQL is running
- Check database credentials in .env file
- Verify database exists or let the app create it

### Port Conflicts
- Frontend runs on port 5173
- Backend runs on port 3001
- Change ports in configuration if needed

### Module Not Found Errors
- Run `npm install` to ensure all dependencies are installed
- Clear node_modules and reinstall if needed: `rm -rf node_modules package-lock.json && npm install`

## Future Enhancements

- Student editing and deletion
- Bulk import/export functionality
- Advanced search and filtering
- Student photos/avatars
- Email notifications
- Admin authentication
- Course management system
- Attendance tracking
