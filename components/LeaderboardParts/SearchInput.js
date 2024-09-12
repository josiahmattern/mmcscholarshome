import React, { useEffect, useRef } from "react";

const SearchInput = ({ value, onChange }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <input
      ref={inputRef}
      type="text"
      placeholder="Search..."
      value={value}
      onChange={onChange}
      className="input input-bordered w-full md:mr-2 mb-1"
    />
  );
};

export default SearchInput;
