import React from 'react';

const Search = ({searchTerm, setSearchTerm}) => {
  return (
    <div className="search">
      <div>
        <img src="search.svg" alt="search icon" />
        <input type="search"
        value={searchTerm}
        placeholder="Search Through Thousands of Movies"
        onChange={(e)=>setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
};

export default Search;