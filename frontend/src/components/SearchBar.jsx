import React from 'react';
import '../styles/SearchBar.css';

const SearchBar = ({ onSearch, placeholder = 'Search problems...' }) => {
  const handleSearch = (e) => {
    const value = e.target.value;
    onSearch(value);
  };

  return (
    <div className="search-bar">
      <span className="search-icon">&#x1F50D;</span>
      <input
        type="text"
        placeholder={placeholder}
        onChange={handleSearch}
        className="search-input"
      />
    </div>
  );
};

export default SearchBar;
