# Task Management Application

A full-stack task management application built with React, Node.js, Express, and MongoDB. This application allows users to register, login, add, edit, delete, and filter tasks.

## Features

- User authentication (register/login)
- Create, read, update, delete tasks
- Mark tasks as complete/incomplete
- Filter tasks by status (All, Active, Completed)
- Task prioritization (Low, Medium, High)
- Responsive design with Tailwind CSS

## Tech Stack

### Frontend
- React (with functional components and hooks)
- React Router for navigation
- Axios for API requests
- Tailwind CSS for styling

### Backend
- Node.js and Express
- MongoDB with Mongoose
- JWT for authentication
- RESTful API architecture

## Database Schema

### User Model
```
{
  email: String (required, unique),
  password: String (required, hashed),
  name: String (required),
  createdAt: Date
}
```

### Task Model
```
{
  title: String (required),
  description: String (required),
  status: String (enum: ['incomplete', 'complete']),
  priority: String (enum: ['Low', 'Medium', 'High']),
  user: ObjectId (reference to User model),
  createdAt: Date
}
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or later)
- MongoDB (local instance or MongoDB Atlas)

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/task-management
   JWT_SECRET=your_jwt_secret_here
   ```
   Note: Replace `your_jwt_secret_here` with a secure string. For production, use a long, random string.

4. Seed the database with sample data:
   ```
   node seed.js
   ```

5. Start the server:
   ```
   npm start
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Open the application in your browser:
   ```
   http://localhost:5173
   ```

## Test Users
After running the seed script, you can use the following test accounts:

1. **Test User 1**
   - Email: test1@example.com
   - Password: password123

2. **Test User 2**
   - Email: test2@example.com
   - Password: password123

## Technical Decisions

### Authentication
- JWT-based authentication was chosen for its stateless nature, making it suitable for RESTful APIs.
- Passwords are hashed using bcrypt before storage for enhanced security.

### State Management
- React Context API is used for global state management (authentication).
- Custom hooks for encapsulating API calls and related state.

### API Design
- RESTful API design principles were followed for predictable endpoints.
- Routes are protected using middleware to ensure authenticated access.

### Error Handling
- Comprehensive error handling on both frontend and backend.
- User-friendly error messages displayed in the UI.

## Project Structure

### Backend
- `server.js` - Entry point for the Express server
- `models/` - Database models (User, Task)
- `routes/` - API routes for users and tasks
- `middleware/` - Custom middleware (auth)
- `config/` - Configuration files

### Frontend
- `src/` - Source files
  - `components/` - Reusable UI components
  - `pages/` - Page components
  - `context/` - React Context for state management
  - `services/` - API service functions
  - `hooks/` - Custom React hooks