import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

function SearchBar({ className = "search-bar", onSearch }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/ver-todo?buscar=${encodeURIComponent(query.trim())}`);
    setQuery("");
    onSearch?.();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch(e);
  };

  return (
    <form onSubmit={handleSearch} style={{ display: "flex", width: "100%" }}>
      <input
        type="text"
        placeholder="Busca frutas, verduras y mas"
        className={className}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        style={{ flex: 1 }}
      />
      <button
        type="submit"
        style={{
          background: "#74e2d7",
          border: "none",
          borderRadius: "0 8px 8px 0",
          padding: "0 12px",
          cursor: "pointer",
          color: "#07393c",
          fontSize: "16px",
        }}
      >
        <FaSearch />
      </button>
    </form>
  );
}

export default SearchBar;
