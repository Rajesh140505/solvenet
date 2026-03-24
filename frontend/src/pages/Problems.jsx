import React, { useState, useEffect } from 'react';
import { problemsAPI } from '../services/api';
import ProblemCard from '../components/ProblemCard';
import SearchBar from '../components/SearchBar';
import '../styles/Problems.css';

const Problems = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    difficulty: '',
    category: ''
  });
  const [sort, setSort] = useState('-createdAt');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProblems: 0
  });

  useEffect(() => {
    fetchProblems();
  }, [filters, sort, pagination.currentPage]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchProblems();
    }, 300);
    return () => clearTimeout(debounce);
  }, [search]);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.currentPage,
        limit: 12,
        sort,
        ...(search && { search }),
        ...(filters.difficulty && { difficulty: filters.difficulty }),
        ...(filters.category && { category: filters.category })
      };

      const response = await problemsAPI.getAll(params);
      setProblems(response.data.data.problems);
      setPagination(response.data.data.pagination);
    } catch (error) {
      console.error('Error fetching problems:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
    setPagination({ ...pagination, currentPage: 1 });
  };

  const handlePageChange = (newPage) => {
    setPagination({ ...pagination, currentPage: newPage });
  };

  const categories = ['Arrays', 'Strings', 'Trees', 'Graphs', 'Dynamic Programming', 'Mathematics'];
  const difficulties = ['Easy', 'Medium', 'Hard'];

  return (
    <div className="problems-page">
      <div className="problems-header">
        <h1 className="page-title">Problem Library</h1>
        <p className="page-subtitle">
          {pagination.totalProblems} problems available
        </p>
      </div>

      <div className="filters-section">
        <SearchBar
          onSearch={setSearch}
          placeholder="Search by title, tags, or description..."
        />

        <div className="filters-row">
          <div className="filter-group">
            <label>Difficulty</label>
            <select
              value={filters.difficulty}
              onChange={(e) => handleFilterChange('difficulty', e.target.value)}
            >
              <option value="">All</option>
              {difficulties.map((diff) => (
                <option key={diff} value={diff}>{diff}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Category</label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="">All</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Sort By</label>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="-createdAt">Latest</option>
              <option value="-totalVotes">Most Popular</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading problems...</div>
      ) : (
        <>
          <div className="problems-grid">
            {problems.map((problem) => (
              <ProblemCard key={problem._id} problem={problem} />
            ))}
          </div>

          {problems.length === 0 && (
            <div className="no-results">
              <p>No problems found matching your criteria.</p>
            </div>
          )}

          {pagination.totalPages > 1 && (
            <div className="pagination">
              <button
                className="page-btn"
                disabled={pagination.currentPage === 1}
                onClick={() => handlePageChange(pagination.currentPage - 1)}
              >
                Previous
              </button>
              <span className="page-info">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <button
                className="page-btn"
                disabled={pagination.currentPage === pagination.totalPages}
                onClick={() => handlePageChange(pagination.currentPage + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Problems;
