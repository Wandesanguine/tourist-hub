import { Search } from "lucide-react";

export function SearchField({ placeholder, className = "", value, onChange }) {
  return (
    <label className={`search-field ${className}`}>
      <Search size={17} aria-hidden="true" />
      <input
        type="search"
        placeholder={placeholder}
        aria-label={placeholder}
        value={value}
        onChange={onChange}
      />
    </label>
  );
}
