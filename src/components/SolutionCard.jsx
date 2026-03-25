import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/SolutionCard.css';

const SolutionCard = ({ solution, isTopSolution, onVote, currentUserId }) => {
  const getBadgeClass = (badge) => {
    switch (badge) {
      case 'Expert': return 'badge-expert';
      case 'Contributor': return 'badge-contributor';
      default: return 'badge-beginner';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isOwnSolution = currentUserId && solution.userId?._id === currentUserId;

  return (
    <div className={`solution-card ${isTopSolution ? 'top-solution' : ''}`}>
      {isTopSolution && (
        <div className="top-badge">
          <span className="top-icon">&#x1F451;</span>
          Top Solution
        </div>
      )}

      <div className="solution-header">
        <div className="author-section">
          <Link to={`/profile/${solution.userId?._id}`} className="author-link">
            <span className={`author-badge ${getBadgeClass(solution.userId?.badge)}`}>
              {solution.userId?.badge}
            </span>
            <span className="author-name">{solution.userId?.username}</span>
          </Link>
          <span className="reputation">{solution.userId?.reputation} rep</span>
        </div>
        <span className="language-badge">{solution.language}</span>
      </div>

      <div className="solution-code">
        <pre><code>{solution.code}</code></pre>
      </div>

      {solution.explanation && (
        <div className="solution-explanation">
          <h4>Explanation</h4>
          <p>{solution.explanation}</p>
        </div>
      )}

      <div className="solution-footer">
        <div className="vote-section">
          <button
            className={`vote-btn ${isOwnSolution ? 'disabled' : ''}`}
            onClick={() => !isOwnSolution && onVote(solution._id)}
            disabled={isOwnSolution}
            title={isOwnSolution ? "Can't vote on your own solution" : 'Upvote this solution'}
          >
            <span className="vote-icon">&#x25B2;</span>
            <span className="vote-count">{solution.voteCount}</span>
          </button>
        </div>
        <span className="solution-date">{formatDate(solution.createdAt)}</span>
      </div>
    </div>
  );
};

export default SolutionCard;
