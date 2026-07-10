import { useState, useEffect } from 'react';
import { RiSearchLine } from 'react-icons/ri';
import './SearchInput.css';
const SearchInput = ({ placeholder = 'Search...', value = '', onChange, className = '', debounceTime = 300 }) => {
  const [localValue, setLocalValue] = useState(value);
  const [prevValue, setPrevValue] = useState(value);
  // Sync local state
  if (value !== prevValue) {
    setPrevValue(value);
    setLocalValue(value);
  }
  // callback to the parent
  useEffect(() => {
    const handler = setTimeout(() => {
      if (onChange && localValue !== value) {
        // Pass a fake event object to maintain compatibility if the parent expects one
        onChange({ target: { value: localValue } });
      }
    }, debounceTime);
    return () => clearTimeout(handler);
  }, [localValue, onChange, value, debounceTime]);
  const handleChange = (e) => {
    setLocalValue(e.target.value);
  };
  return (
    <div className={`custom-search-input-wrapper ${className}`}>
      <RiSearchLine className="search-icon" />
      <input
        type="text"
        placeholder={placeholder}
        value={localValue}
        onChange={handleChange}
        className="custom-search-input"
      />
    </div>
  );
};
export default SearchInput;
