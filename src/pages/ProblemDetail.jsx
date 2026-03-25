import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { problemsAPI, solutionsAPI } from '../services/api';
import SolutionCard from '../components/SolutionCard';
import '../styles/ProblemDetail.css';

const ProblemDetail = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    fetchData();
    const userData = localStorage.getItem('user');
    if (userData) setUserId(JSON.parse(userData)._id);
  }, [id]);

  const fetchData = async () => {
    try {
      const response = await problemsAPI.getById(id);
      setProblem(response.data.data.problem);
      setSolutions(response.data.data.solutions || []);
    } catch (error) {
      console.error('Error fetching problem:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (solutionId) => {
    try {
      const response = await solutionsAPI.vote(solutionId);
      setSolutions(solutions.map(sol => sol._id === solutionId ? response.data.data : sol).sort((a, b) => b.voteCount - a.voteCount));
    } catch (error) {
      alert(error.response?.data?.message || 'Error voting');
    }
  };

  const handleMarkSolved = async () => {
    try {
      await solutionsAPI.markSolved(id);
      setProblem({ ...problem, isSolved: true });
      alert('Problem marked as solved!');
    } catch (error) {
      alert(error.response?.data?.message || 'Error marking solved');
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
  if (!problem) return <div className="error">Problem not found</div>;

  const sortedSolutions = [...solutions].sort((a, b) => b.voteCount - a.voteCount);

  return (
    <div className="problem-detail">
      <div className="problem-header">
        <div className="problem-title-section">
          <h1 className="problem-title">{problem.title}</h1>
          <div className="problem-meta">
            <span className={`difficulty-badge difficulty-${problem.difficulty.toLowerCase()}`}>{problem.difficulty}</span>
            <span className="category-tag">{problem.category}</span>
            {problem.isSolved && <span className="solved-badge">Solved</span>}
          </div>
        </div>
        <div className="problem-actions">
          <Link to={`/submit-solution/${problem._id}`} className="btn btn-primary">Submit Solution</Link>
          {!problem.isSolved && <button onClick={handleMarkSolved} className="btn btn-secondary">Mark as Solved</button>}
        </div>
      </div>

      <div className="problem-tabs">
        <button className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`} onClick={() => setActiveTab('description')}>Description</button>
        <button className={`tab-btn ${activeTab === 'solutions' ? 'active' : ''}`} onClick={() => setActiveTab('solutions')}>Solutions ({solutions.length})</button>
      </div>

      {activeTab === 'description' && (
        <div className="problem-content">
          <section className="section"><h2>Problem Statement</h2><p className="description">{problem.description}</p></section>
          <section className="section"><h2>Input Format</h2><pre className="format-box">{problem.inputFormat}</pre></section>
          <section className="section"><h2>Output Format</h2><pre className="format-box">{problem.outputFormat}</pre></section>
          <section className="section"><h2>Constraints</h2><pre className="constraints-box">{problem.constraints}</pre></section>
          {problem.examples?.length > 0 && (
            <section className="section">
              <h2>Examples</h2>
              {problem.examples.map((ex, i) => (
                <div key={i} className="example">
                  <div className="example-header">Example {i + 1}</div>
                  <div className="example-content">
                    <div><strong>Input:</strong> <code>{ex.input}</code></div>
                    <div><strong>Output:</strong> <code>{ex.output}</code></div>
                    {ex.explanation && <div><strong>Explanation:</strong> {ex.explanation}</div>}
                  </div>
                </div>
              ))}
            </section>
          )}
          <section className="section"><h2>Tags</h2><div className="tags">{problem.tags?.map((t, i) => <span key={i} className="tag">{t}</span>)}</div></section>
          <section className="section author-section">
            <h2>Author</h2>
            <Link to={`/profile/${problem.author?._id}`} className="author-link">
              <span className={`author-badge ${getBadgeClass(problem.author?.badge)}`}>{problem.author?.badge}</span>
              <span className="author-name">{problem.author?.username}</span>
            </Link>
          </section>
        </div>
      )}

      {activeTab === 'solutions' && (
        <div className="solutions-section">
          {sortedSolutions.length > 0 ? (
            <div className="solutions-list">
              {sortedSolutions.map((solution) => (
                <SolutionCard key={solution._id} solution={solution} isTopSolution={solution.voteCount === sortedSolutions[0].voteCount && solution.voteCount > 0} onVote={handleVote} currentUserId={userId} />
              ))}
            </div>
          ) : (
            <div className="no-solutions">
              <p>No solutions yet. Be the first!</p>
              <Link to={`/submit-solution/${problem._id}`} className="btn btn-primary">Submit Solution</Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProblemDetail;
