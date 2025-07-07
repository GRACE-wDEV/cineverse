import React from 'react';

const Search = ({searchTerm, setsearchTerm}) => {
  return (
    <div className="search">
      <div>
        <img src="search.svg" alt="search"/>
        <input 
        type="search" 
        placeholder="Search Through Thousands of Movies"
        value={searchTerm}
        onChange={(e)=>{setsearchTerm(e.target.value)}}
        />
      </div>
    </div>
  );
};

export default Search;