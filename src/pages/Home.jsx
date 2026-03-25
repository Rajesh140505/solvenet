import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { leaderboardAPI } from '../services/api';
import ProblemCard from '../components/ProblemCard';
import '../styles/Home.css';

const Home = () => {
  const [stats, setStats] = useState(null);
  const [recentProblems, setRecentProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await leaderboardAPI.getStats();
      setStats(response.data.data);
      setRecentProblems(response.data.data.recentProblems || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Master Your Coding Skills
            <span className="highlight"> Together</span>
          </h1>
          <p className="hero-subtitle">
            Join our community of developers. Practice problems, share solutions,
            and climb the leaderboard.
          </p>
          <div className="hero-buttons">
            <Link to="/problems" className="btn btn-primary">
              Explore Problems
            </Link>
            <Link to="/register" className="btn btn-secondary">
              Join Community
            </Link>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-number">{stats?.totalProblems || 0}</span>
            <span className="stat-label">Problems</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{stats?.totalUsers || 0}</span>
            <span className="stat-label">Members</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{stats?.totalSolutions || 0}</span>
            <span className="stat-label">Solutions</span>
          </div>
        </div>
      </section>

      <section className="categories-section">
        <h2 className="section-title">Browse by Category</h2>
        <div className="categories-grid">
          {['Arrays', 'Strings', 'Trees', 'Graphs', 'Dynamic Programming', 'Mathematics'].map((category) => (
            <Link
              key={category}
              to={`/problems?category=${category}`}
              className="category-card"
            >
              <span className="category-icon">&#x1F4CB;</span>
              <span className="category-name">{category}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="recent-section">
        <div className="section-header">
          <h2 className="section-title">Recent Problems</h2>
          <Link to="/problems" className="view-all">View All</Link>
        </div>
        <div className="problems-grid">
          {recentProblems.slice(0, 6).map((problem) => (
            <ProblemCard key={problem._id} problem={problem} />
          ))}
        </div>
      </section>

      <section className="features-section">
        <h2 className="section-title">Why SolveNet?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <span className="feature-icon">&#x1F4BB;</span>
            <h3>Practice Problems</h3>
            <p>Challenge yourself with curated coding problems across various difficulty levels.</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">&#x1F4E6;</span>
            <h3>Share Solutions</h3>
            <p>Submit your solutions and learn from the community's approaches.</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">&#x1F3C6;</span>
            <h3>Earn Badges</h3>
            <p>Build your reputation and earn badges as you contribute.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
