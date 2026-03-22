# AI-powered Learning Management System Backend

A production-ready backend for an AI-powered Learning Management System (LMS) that organizes YouTube-based learning courses into structured lessons and integrates AI capabilities using Hugging Face models.

## Features

- **User Authentication**: JWT-based registration, login, refresh tokens
- **Course Management**: Subjects, sections, and video lessons with YouTube integration
- **Progress Tracking**: Detailed progress monitoring with lesson ordering enforcement
- **AI Integration**: AI tutor chatbot, lesson summarization, and quiz generation
- **Strict Learning Flow**: Lessons locked until previous lesson is completed
- **RESTful API**: Clean, modular architecture with comprehensive endpoints

## Tech Stack

- **Node.js** with Express.js
- **MySQL** database with connection pooling
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Hugging Face** API for AI features
- **CORS** enabled for frontend integration

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - User logout

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/change-password` - Change password
- `DELETE /api/users/account` - Delete account

### Subjects (Courses)
- `GET /api/subjects` - Get all subjects
- `GET /api/subjects/enrolled` - Get enrolled subjects
- `GET /api/subjects/:subjectId` - Get subject details
- `GET /api/subjects/:subjectId/tree` - Get subject tree structure
- `POST /api/subjects/:subjectId/enroll` - Enroll in subject

### Sections
- `GET /api/sections/subject/:subjectId` - Get sections by subject
- `GET /api/sections/:sectionId` - Get section details

### Videos (Lessons)
- `GET /api/videos/:videoId` - Get video details with navigation
- `GET /api/videos/section/:sectionId` - Get videos by section
- `GET /api/videos/subjects/:subjectId/first-video` - Get first video of subject

### Progress
- `GET /api/progress/overall` - Get overall learning progress
- `GET /api/progress/subjects/:subjectId` - Get subject progress
- `GET /api/progress/videos/:videoId` - Get video progress
- `POST /api/progress/videos/:videoId` - Update video progress

### AI Features
- `POST /api/ai/chat` - Chat with AI tutor
- `POST /api/ai/summarize` - Generate lesson summary
- `POST /api/ai/quiz` - Generate quiz questions

### Health Check
- `GET /api/health` - Server health status

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=ai_lms

   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key_here
   JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_here
   JWT_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=7d

   # Server Configuration
   PORT=3000
   NODE_ENV=development

   # CORS Configuration
   FRONTEND_URL=http://localhost:3000

   # Hugging Face Configuration
   HUGGINGFACE_API_KEY=your_huggingface_api_key_here
   HUGGINGFACE_MODEL=microsoft/DialoGPT-medium
   ```

4. **Set up the database**
   ```bash
   mysql -u root -p < database/schema.sql
   ```

5. **Start the server**
   ```bash
   # Development
   npm run dev

   # Production
   npm start
   ```

## Database Schema

The system uses the following main tables:
- `users` - User accounts and authentication
- `subjects` - Courses/subjects
- `sections` - Organizes lessons within courses
- `videos` - Individual lessons with YouTube URLs
- `enrollments` - User enrollments in subjects
- `video_progress` - Progress tracking for each video
- `refresh_tokens` - JWT refresh token management

## Lesson Ordering Logic

The system enforces strict lesson ordering:
- Each lesson is locked until the previous lesson is completed
- First lesson of each subject is always unlocked
- Progress is tracked individually for each user
- Navigation includes previous/next lesson links

## AI Features

### AI Tutor Chat
- Context-aware conversations based on current lesson
- Educational and patient responses
- Integration with Hugging Face language models

### Lesson Summarization
- Automatic generation of lesson summaries
- Key learning points extraction
- Practical applications and examples

### Quiz Generation
- Multiple choice question generation
- Customizable question count (1-10)
- Explanations for correct answers

## Security Features

- JWT-based authentication with refresh tokens
- Password hashing with bcryptjs
- CORS configuration for frontend integration
- Input validation and sanitization
- SQL injection prevention with parameterized queries
- Rate limiting considerations for AI endpoints

## Error Handling

- Comprehensive error handling middleware
- Proper HTTP status codes
- Detailed error messages in development
- Sanitized error messages in production

## Deployment

The backend is designed for deployment on:
- **Render** (recommended for production)
- **Heroku**, **DigitalOcean**, or any Node.js hosting
- **Aiven MySQL** for database hosting

## Development

### Project Structure
```
backend/
├── src/
│   ├── config/         # Database, JWT, CORS configuration
│   ├── middleware/     # Authentication, validation, error handling
│   ├── modules/        # Feature modules (auth, subjects, videos, etc.)
│   ├── utils/          # Helper functions
│   ├── types/          # TypeScript-style type definitions
│   └── index.js        # Main application entry point
├── database/
│   └── schema.sql      # Database schema
├── .env.example        # Environment variables template
├── package.json        # Dependencies and scripts
└── README.md          # This file
```

### Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (when implemented)

## API Documentation

Visit `http://localhost:3000/api` for available endpoints documentation.

## Contributing

1. Follow the existing code structure and patterns
2. Use proper error handling
3. Add input validation for new endpoints
4. Update this README for new features
5. Test thoroughly before submitting changes

## License

ISC
