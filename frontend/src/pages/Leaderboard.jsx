import React, { useState, useEffect } from 'react';
import { leaderboardAPI } from '../services/api';
import '../styles/Leaderboard.css';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('reputation');

  useEffect(() => {
    fetchLeaderboard();
  }, [sortBy]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await leaderboardAPI.getLeaderboard({ type: sortBy });
      setLeaderboard(response.data.data.leaderboard);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
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

  return (
    <div className="leaderboard-page">
      <div className="page-header">
        <h1>Leaderboard</h1>
        <p>Top contributors in our community</p>
      </div>

      <div className="sort-options">
        <button className={`sort-btn ${sortBy === 'reputation' ? 'active' : ''}`} onClick={() => setSortBy('reputation')}>Reputation</button>
        <button className={`sort-btn ${sortBy === 'solved' ? 'active' : ''}`} onClick={() => setSortBy('solved')}>Solved</button>
        <button className={`sort-btn ${sortBy === 'upvotes' ? 'active' : ''}`} onClick={() => setSortBy('upvotes')}>Upvotes</button>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="leaderboard-table">
          <div className="table-header">
            <span className="col-rank">Rank</span>
            <span className="col-user">User</span>
            <span className="col-badge">Badge</span>
            <span className="col-stat">Rep</span>
            <span className="col-stat">Solved</span>
          </div>
          {leaderboard.map((user) => (
            <div key={user.rank} className="table-row">
              <span className="col-rank">#{user.rank}</span>
              <span className="col-user">{user.username}</span>
              <span className="col-badge"><span className={`badge ${getBadgeClass(user.badge)}`}>{user.badge}</span></span>
              <span className="col-stat">{user.reputation}</span>
              <span className="col-stat">{user.problemsSolved}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
