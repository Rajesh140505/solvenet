import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Problems from './pages/Problems';
import ProblemDetail from './pages/ProblemDetail';
import CreateProblem from './pages/CreateProblem';
import SubmitSolution from './pages/SubmitSolution';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import Leaderboard from './pages/Leaderboard';
import Archive from './pages/Archive';
import './styles/App.css';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/problems" element={<Problems />} />
            <Route path="/problems/:id" element={<ProblemDetail />} />
            <Route path="/create-problem" element={
              <PrivateRoute><CreateProblem /></PrivateRoute>
            } />
            <Route path="/submit-solution/:problemId" element={
              <PrivateRoute><SubmitSolution /></PrivateRoute>
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile/:userId" element={<Profile />} />
            <Route path="/dashboard" element={
              <PrivateRoute><Dashboard /></PrivateRoute>
            } />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/archive" element={<Archive />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
