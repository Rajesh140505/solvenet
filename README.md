# SolveNet - Community Coding & Problem Solving Platform

A full-stack web application inspired by GeeksforGeeks and LeetCode, built with React.js, Node.js, Express, and MongoDB.

## Features

- User Authentication (Register/Login with JWT)
- Browse and Search Problems
- Create New Problems
- Submit Solutions
- Vote on Solutions
- Community Leaderboard
- User Dashboard & Profiles
- Knowledge Archive
- Expert Contributor Badges

## Tech Stack

### Frontend
- React.js (JSX)
- React Router
- Axios
- Plain CSS (no Tailwind/Bootstrap)

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcrypt for password hashing

## Project Structure

```
SolveNet/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── userController.js
│   │   ├── problemController.js
│   │   ├── solutionController.js
│   │   └── leaderboardController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Problem.js
│   │   ├── Solution.js
│   │   └── Vote.js
│   ├── routes/
│   │   ├── userRoutes.js
│   │   ├── problemRoutes.js
│   │   ├── solutionRoutes.js
│   │   └── leaderboardRoutes.js
│   ├── server.js
│   ├── seed.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProblemCard.jsx
│   │   │   ├── SolutionCard.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   └── VoteButton.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Problems.jsx
│   │   │   ├── ProblemDetail.jsx
│   │   │   ├── CreateProblem.jsx
│   │   │   ├── SubmitSolution.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Leaderboard.jsx
│   │   │   └── Archive.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (running locally or use MongoDB Atlas)

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file (optional, defaults provided)
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/solvenet
# JWT_SECRET=your_secret_key

# Seed database with sample data
npm run seed

# Start server
npm start
# or for development
npm run dev
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will run on http://localhost:3000

## Test Credentials

After seeding the database, you can login with:

- **Email:** algo@example.com
- **Password:** password123

## API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile (protected)
- `GET /api/users/dashboard` - Get user dashboard (protected)

### Problems
- `GET /api/problems` - Get all problems
- `GET /api/problems/:id` - Get problem by ID
- `POST /api/problems/create` - Create new problem (protected)
- `GET /api/problems/archive` - Get solved problems archive

### Solutions
- `POST /api/solutions/submit/:problemId` - Submit solution (protected)
- `POST /api/solutions/vote/:solutionId` - Vote on solution (protected)
- `POST /api/solutions/solve/:problemId` - Mark problem as solved (protected)

### Leaderboard
- `GET /api/leaderboard` - Get leaderboard

## Badge System

Users earn badges based on reputation:
- **Beginner:** 0-49 reputation
- **Contributor:** 50-199 reputation
- **Expert:** 200+ reputation

Users gain reputation by:
- Receiving upvotes on their solutions (+10 per upvote)

## Categories

Problems are organized by:
- Arrays
- Strings
- Trees
- Graphs
- Dynamic Programming
- Mathematics

## License

MIT
