import React, { useState } from "react";
import { Employee } from "../context/CompanyContext";

type SearchBarProps = {
  employeeData: Employee[];
  setTableData: React.Dispatch<React.SetStateAction<Employee[]>>;
};

export function SearchBar({ employeeData, setTableData }: SearchBarProps) {
  const [search, setSearch] = useState(""); // This is the search query

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const searchQuery = search.toLowerCase().split(" ");

      const filteredEmployees = employeeData.filter((employee) => {
        return searchQuery.every((term) => {
          return Object.values(employee).some((value) => {
            return String(value).toLowerCase().includes(term);
          });
        });
      });

      console.log("Filtered employees:", filteredEmployees);
      setTableData(filteredEmployees); // Update the table data with the filtered employees

      setSearch(""); // Clear the search bar
    }
  };

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
      {/* Display search results here */}
    </div>
  );
}
