import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await authAPI.getDashboard();
      setData(response.data.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getBadgeClass = (badge) => {
    switch (badge) {
      case 'Expert': return 'badge-expert';
      case 'Contributor': return 'badge-contributor';
      default: return 'badge-beginner';
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  const user = data ? JSON.parse(localStorage.getItem('user')) : null;

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Welcome back, {data?.username}!</h1>
        <div className="header-actions">
          <span className={`badge ${getBadgeClass(data?.badge)}`}>{data?.badge}</span>
          <Link to={`/profile/${user?._id}`} className="profile-btn">
            View Profile
          </Link>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card"><span className="stat-number">{data?.totalSolved || 0}</span><span className="stat-label">Problems Solved</span></div>
        <div className="stat-card"><span className="stat-number">{data?.totalCreated || 0}</span><span className="stat-label">Problems Created</span></div>
        <div className="stat-card"><span className="stat-number">{data?.totalSubmissions || 0}</span><span className="stat-label">Submissions</span></div>
        <div className="stat-card"><span className="stat-number">{data?.reputation || 0}</span><span className="stat-label">Reputation</span></div>
      </div>

      <div className="dashboard-sections">
        <section className="section">
          <h2>Solved Problems</h2>
          {data?.solvedProblems?.length > 0 ? (
            <div className="problems-list">
              {data.solvedProblems.map((p) => (
                <Link key={p._id} to={`/problems/${p._id}`} className="problem-item">
                  <span>{p.title}</span>
                  <span className={`difficulty difficulty-${p.difficulty.toLowerCase()}`}>{p.difficulty}</span>
                </Link>
              ))}
            </div>
          ) : <p className="no-data">No solved problems yet. <Link to="/problems">Start solving!</Link></p>}
        </section>

        <section className="section">
          <h2>My Created Problems</h2>
          {data?.createdProblems?.length > 0 ? (
            <div className="problems-list">
              {data.createdProblems.map((p) => (
                <Link key={p._id} to={`/problems/${p._id}`} className="problem-item">
                  <span>{p.title}</span>
                  <span className={`difficulty difficulty-${p.difficulty.toLowerCase()}`}>{p.difficulty}</span>
                </Link>
              ))}
            </div>
          ) : <p className="no-data">No created problems yet. <Link to="/create-problem">Create one!</Link></p>}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
