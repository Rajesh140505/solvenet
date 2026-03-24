import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { problemsAPI } from '../services/api';
import '../styles/CreateProblem.css';

const CreateProblem = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'Easy',
    category: 'Arrays',
    tags: '',
    inputFormat: '',
    outputFormat: '',
    constraints: '',
    examples: [{ input: '', output: '', explanation: '' }]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleExampleChange = (index, field, value) => {
    const newExamples = [...formData.examples];
    newExamples[index][field] = value;
    setFormData({ ...formData, examples: newExamples });
  };

  const addExample = () => {
    setFormData({
      ...formData,
      examples: [...formData.examples, { input: '', output: '', explanation: '' }]
    });
  };

  const removeExample = (index) => {
    const newExamples = formData.examples.filter((_, i) => i !== index);
    setFormData({ ...formData, examples: newExamples });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t)
      };

      const response = await problemsAPI.create(data);
      alert('Problem created successfully!');
      navigate(`/problems/${response.data.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating problem');
    } finally {
      setLoading(false);
    }
  };

  const categories = ['Arrays', 'Strings', 'Trees', 'Graphs', 'Dynamic Programming', 'Mathematics'];
  const difficulties = ['Easy', 'Medium', 'Hard'];

  return (
    <div className="create-problem-page">
      <div className="page-header">
        <h1>Create New Problem</h1>
        <p>Share your knowledge with the community</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="create-form">
        <div className="form-section">
          <h2>Basic Information</h2>

          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g., Two Sum"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="difficulty">Difficulty *</label>
              <select
                id="difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
              >
                {difficulties.map((diff) => (
                  <option key={diff} value={diff}>{diff}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="tags">Tags</label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e.g., array, hash-table (comma-separated)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="6"
              placeholder="Describe the problem in detail..."
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Format & Constraints</h2>

          <div className="form-group">
            <label htmlFor="inputFormat">Input Format *</label>
            <textarea
              id="inputFormat"
              name="inputFormat"
              value={formData.inputFormat}
              onChange={handleChange}
              required
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="outputFormat">Output Format *</label>
            <textarea
              id="outputFormat"
              name="outputFormat"
              value={formData.outputFormat}
              onChange={handleChange}
              required
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="constraints">Constraints *</label>
            <textarea
              id="constraints"
              name="constraints"
              value={formData.constraints}
              onChange={handleChange}
              required
              rows="4"
            />
          </div>
        </div>

        <div className="form-section">
          <div className="section-header">
            <h2>Examples</h2>
            <button type="button" onClick={addExample} className="btn btn-small">
              + Add Example
            </button>
          </div>

          {formData.examples.map((example, index) => (
            <div key={index} className="example-form">
              <div className="example-header">
                <span>Example {index + 1}</span>
                {formData.examples.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeExample(index)}
                    className="btn-remove"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="form-group">
                <label>Input</label>
                <input
                  type="text"
                  value={example.input}
                  onChange={(e) => handleExampleChange(index, 'input', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Output</label>
                <input
                  type="text"
                  value={example.output}
                  onChange={(e) => handleExampleChange(index, 'output', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Explanation (optional)</label>
                <textarea
                  value={example.explanation}
                  onChange={(e) => handleExampleChange(index, 'explanation', e.target.value)}
                  rows="2"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/problems')}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Creating...' : 'Create Problem'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProblem;
