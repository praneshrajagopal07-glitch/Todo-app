import { useState } from 'react';
import './SearchBar.css';
const SearchBar = ({ onSearch }) => {
  const [val, setVal] = useState('');
  const handle = (e) => { setVal(e.target.value); onSearch(e.target.value); };
  return (
    <div className="search-bar">
      <span className="search-icon">🔍</span>
      <input value={val} onChange={handle} placeholder="Search tasks..." className="search-input" />
    </div>
  );
};
export default SearchBar;
