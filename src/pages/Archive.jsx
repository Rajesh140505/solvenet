import React, { useState, useEffect } from 'react';
import { problemsAPI } from '../services/api';
import ProblemCard from '../components/ProblemCard';
import SearchBar from '../components/SearchBar';
import '../styles/Archive.css';

const Archive = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ difficulty: '', category: '' });

  useEffect(() => { fetchArchive(); }, [filters]);

  useEffect(() => {
    const debounce = setTimeout(() => fetchArchive(), 300);
    return () => clearTimeout(debounce);
  }, [search]);

  const fetchArchive = async () => {
    try {
      setLoading(true);
      const params = { ...(search && { search }), ...(filters.difficulty && { difficulty: filters.difficulty }), ...(filters.category && { category: filters.category }) };
      const response = await problemsAPI.getArchive(params);
      setProblems(response.data.data.problems);
    } catch (error) {
      console.error('Error fetching archive:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="archive-page">
      <div className="page-header">
        <h1>Knowledge Archive</h1>
        <p>Solved problems with community solutions</p>
      </div>

      <div className="filters-section">
        <SearchBar onSearch={setSearch} placeholder="Search solved problems..." />
        <div className="filters-row">
          <select value={filters.difficulty} onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}>
            <option value="">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
          <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
            <option value="">All Categories</option>
            <option value="Arrays">Arrays</option>
            <option value="Strings">Strings</option>
            <option value="Trees">Trees</option>
            <option value="Graphs">Graphs</option>
            <option value="Dynamic Programming">Dynamic Programming</option>
            <option value="Mathematics">Mathematics</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <>
          <div className="problems-grid">
            {problems.map((problem) => (
              <ProblemCard key={problem._id} problem={problem} />
            ))}
          </div>
          {problems.length === 0 && <div className="no-results"><p>No solved problems found.</p></div>}
        </>
      )}
    </div>
  );
};

export default Archive;
