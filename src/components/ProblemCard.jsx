import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/ProblemCard.css';

const ProblemCard = ({ problem }) => {
  const getDifficultyClass = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'difficulty-easy';
      case 'Medium': return 'difficulty-medium';
      case 'Hard': return 'difficulty-hard';
      default: return '';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Link to={`/problems/${problem._id}`} className="problem-card">
      <div className="problem-card-header">
        <h3 className="problem-title">{problem.title}</h3>
        <span className={`difficulty-badge ${getDifficultyClass(problem.difficulty)}`}>
          {problem.difficulty}
        </span>
      </div>

      <div className="problem-meta">
        <span className="category-tag">{problem.category}</span>
        {problem.tags?.slice(0, 3).map((tag, index) => (
          <span key={index} className="tag">{tag}</span>
        ))}
      </div>

      <div className="problem-card-footer">
        <div className="author-info">
          <span className="author-label">By</span>
          <span className="author-name">{problem.author?.username}</span>
        </div>
        <div className="problem-stats">
          <span className="stat">
            <span className="stat-icon">&#x1F4C4;</span>
            {problem.solutionCount || 0}
          </span>
          <span className="stat">
            <span className="stat-icon">&#x2713;</span>
            {problem.isSolved ? 'Solved' : 'Unsolved'}
          </span>
        </div>
      </div>

      <div className="problem-date">
        {formatDate(problem.createdAt)}
      </div>
    </Link>
  );
};

export default ProblemCard;
