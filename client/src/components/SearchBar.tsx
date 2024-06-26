import React from "react";

type SearchBarProps = {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

export function SearchBar({
  search,
  setSearch,
  handleKeyDown,
}: SearchBarProps) {
  // const [search, setSearch] = useState(""); // This is the search query

  return (
    <div className="App">
      <input
        style={{
          position: "absolute",
          borderRadius: "5px",
          padding: "5px 15px",
          transition: "background-color 0.3s, color 0.3s",
          left: "180px",
          top: "50px",
          zIndex: "9999",
        }}
        type="text"
        placeholder="Search here"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}
