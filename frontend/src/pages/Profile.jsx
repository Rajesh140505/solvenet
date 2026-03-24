import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { authAPI } from '../services/api';
import '../styles/Profile.css';

const Profile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('solutions');

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      const response = await authAPI.getProfile();
      if (response.data.data._id === userId) setUser(response.data.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
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
  if (!user) return <div className="error">User not found</div>;

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-info">
          <div className="avatar">{user.username.charAt(0).toUpperCase()}</div>
          <div className="user-details">
            <h1>{user.username}</h1>
            <p>{user.email}</p>
            <span className={`badge ${getBadgeClass(user.badge)}`}>{user.badge}</span>
          </div>
        </div>
        <div className="profile-stats">
          <div className="stat"><span className="stat-value">{user.reputation}</span><span className="stat-label">Reputation</span></div>
          <div className="stat"><span className="stat-value">{user.totalSolved || 0}</span><span className="stat-label">Solved</span></div>
          <div className="stat"><span className="stat-value">{user.totalSubmissions || 0}</span><span className="stat-label">Submissions</span></div>
          <div className="stat"><span className="stat-value">{user.totalUpvotes || 0}</span><span className="stat-label">Upvotes</span></div>
        </div>
      </div>

      <div className="profile-tabs">
        <button className={`tab-btn ${activeTab === 'solutions' ? 'active' : ''}`} onClick={() => setActiveTab('solutions')}>Solutions</button>
        <button className={`tab-btn ${activeTab === 'solved' ? 'active' : ''}`} onClick={() => setActiveTab('solved')}>Solved Problems</button>
        <button className={`tab-btn ${activeTab === 'created' ? 'active' : ''}`} onClick={() => setActiveTab('created')}>Created Problems</button>
      </div>

      <div className="profile-content">
        {activeTab === 'solutions' && (
          <div className="solutions-list">
            {user.recentSolutions?.length > 0 ? user.recentSolutions.map((s) => (
              <div key={s._id} className="solution-item"><div><span>{s.problemId?.title}</span><span>{s.language}</span></div><span>{s.voteCount} votes</span></div>
            )) : <p className="no-data">No solutions yet.</p>}
          </div>
        )}
        {activeTab === 'solved' && (
          <div className="problems-list">
            {user.solvedProblems?.length > 0 ? user.solvedProblems.map((p) => (
              <div key={p._id} className="problem-item"><span>{p.title}</span><span className={`difficulty difficulty-${p.difficulty.toLowerCase()}`}>{p.difficulty}</span></div>
            )) : <p className="no-data">No solved problems.</p>}
          </div>
        )}
        {activeTab === 'created' && (
          <div className="problems-list">
            {user.createdProblems?.length > 0 ? user.createdProblems.map((p) => (
              <div key={p._id} className="problem-item"><span>{p.title}</span><span className={`difficulty difficulty-${p.difficulty.toLowerCase()}`}>{p.difficulty}</span></div>
            )) : <p className="no-data">No created problems.</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
