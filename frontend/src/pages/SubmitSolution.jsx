import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { problemsAPI, solutionsAPI, runTests } from '../services/api';
import '../styles/SubmitSolution.css';

const SubmitSolution = () => {
  const { problemId } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    language: 'JavaScript',
    explanation: ''
  });
  const [loading, setLoading] = useState(false);
  const [running, setRunning] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProblem();
  }, [problemId]);

  const fetchProblem = async () => {
    try {
      const response = await problemsAPI.getById(problemId);
      setProblem(response.data.data.problem);
    } catch (err) {
      console.error('Error fetching problem:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRunCode = async () => {
    if (!problem?.examples || problem.examples.length === 0) {
      setError('No test cases available for this problem');
      return;
    }

    setError('');
    setRunning(true);
    setTestResults(null);

    try {
      const testCases = problem.examples.map(ex => ({
        input: ex.input,
        output: ex.output
      }));

      const results = await runTests(formData.code, formData.language, testCases);
      setTestResults(results);
    } catch (err) {
      setError(err.message || 'Error running code');
    } finally {
      setRunning(false);
    }
  };

  const allTestsPassed = testResults && testResults.every(r => r.passed);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!allTestsPassed) {
      setError('Please run your code and ensure all test cases pass before submitting');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await solutionsAPI.submit(problemId, formData);
      alert('Solution submitted successfully!');
      navigate(`/problems/${problemId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Error submitting solution');
    } finally {
      setLoading(false);
    }
  };

  const languages = [
    'JavaScript', 'Python', 'Java', 'C++', 'C', 'Go', 'Rust', 'TypeScript', 'Ruby', 'PHP'
  ];

  return (
    <div className="submit-solution-page">
      <div className="page-header">
        <h1>Submit Solution</h1>
        <p>Share your solution with the community</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="solution-form">
        <div className="form-group">
          <label htmlFor="language">Language *</label>
          <select id="language" name="language" value={formData.language} onChange={handleChange} required>
            {languages.map((lang) => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="code">Code *</label>
          <textarea 
            id="code" 
            name="code" 
            value={formData.code} 
            onChange={handleChange} 
            required 
            rows="15" 
            className="code-input" 
            placeholder="Paste your code here..." 
          />
        </div>

        <div className="form-group">
          <label htmlFor="explanation">Explanation</label>
          <textarea 
            id="explanation" 
            name="explanation" 
            value={formData.explanation} 
            onChange={handleChange} 
            rows="4" 
            placeholder="Explain your approach (optional)..." 
          />
        </div>

        {testResults && (
          <div className="test-results">
            <h3>Test Results</h3>
            {testResults.map((result, index) => (
              <div key={index} className={`test-case ${result.passed ? 'passed' : 'failed'}`}>
                <div className="test-header">
                  <span>Test Case {index + 1}</span>
                  <span className={`status ${result.passed ? 'passed' : 'failed'}`}>
                    {result.passed ? 'Passed' : 'Failed'}
                  </span>
                </div>
                <div className="test-details">
                  <div><strong>Input:</strong> <code>{result.input}</code></div>
                  <div><strong>Expected:</strong> <code>{result.expected}</code></div>
                  <div><strong>Output:</strong> <code>{result.actual}</code></div>
                  {result.error && <div className="error-output"><strong>Error:</strong> <code>{result.error}</code></div>}
                </div>
              </div>
            ))}
            {allTestsPassed && (
              <div className="all-passed">All test cases passed! You can now submit your solution.</div>
            )}
          </div>
        )}

        <div className="form-actions">
          <button type="button" onClick={() => navigate(`/problems/${problemId}`)} className="btn btn-secondary">Cancel</button>
          <button type="button" onClick={handleRunCode} disabled={running || !formData.code} className="btn btn-run">
            {running ? 'Running...' : 'Run Code'}
          </button>
          <button type="submit" disabled={loading || !allTestsPassed} className="btn btn-primary">
            {loading ? 'Submitting...' : 'Submit Solution'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubmitSolution;
