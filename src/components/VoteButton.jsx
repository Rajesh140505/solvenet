import React from 'react';
import './VoteButton.css';

const VoteButton = ({ voteCount, onVote, disabled, isVoted }) => {
  return (
    <button
      className={`vote-button ${isVoted ? 'voted' : ''} ${disabled ? 'disabled' : ''}`}
      onClick={onVote}
      disabled={disabled}
      title={disabled ? "Can't vote on your own solution" : 'Upvote this solution'}
    >
      <span className="vote-arrow">&#x25B2;</span>
      <span className="vote-count">{voteCount}</span>
    </button>
  );
};

export default VoteButton;
