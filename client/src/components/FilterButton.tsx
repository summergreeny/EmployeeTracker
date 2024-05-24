import React, { useState } from "react";
import { Dropdown } from "react-bootstrap";
import axios from "axios";

// This component is used to filter the employees based on their employment status

type Employees = {
  name: string;
  email: string;
  password: string;
  phone_number: string;
  department_name: string;
  role_name: string;
  employStatus: string;
  is_admin: boolean;
};

type FilterButtonProps = {
  setTableData: React.Dispatch<React.SetStateAction<Employees[]>>;
  setEmployeeStatusOne: React.Dispatch<React.SetStateAction<boolean>>;
};

export function FilterButton({
  setTableData,
  setEmployeeStatusOne,
}: FilterButtonProps) {
  const [filter, setFilter] = useState("All");
  const handleFilterChange = (role: string) => {
    setFilter(role);
    getFilterUser(role);
  };

  const getFilterUser = (filter: string) => {
    axios
      .get("http://127.0.0.1:5000/admin/employees/status", {
        params: {
          employee_status: filter,
        },
      })
      .then((response) => {
        console.log(response.data); // Handle the response data
        setTableData(response.data); // Update tableData state with the response data
        setEmployeeStatusOne(true);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };

  return (
    <div className="mb-3">
      <Dropdown
        style={{
          position: "absolute",
          borderRadius: "8px",
          padding: "8px 16px",
          transition: "background-color 0.3s, color 0.3s",
          right: "200px",
          top: "40px",
          zIndex: "9999",
        }}
      >
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          Filter : {filter}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item onClick={() => handleFilterChange("All")}>
            All
          </Dropdown.Item>
          <Dropdown.Item onClick={() => handleFilterChange("New Hire")}>
            New Hire
          </Dropdown.Item>
          <Dropdown.Item onClick={() => handleFilterChange("Active Employee")}>
            Active Employee
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => handleFilterChange("Inactive Employee")}
          >
            Inactive Employee
          </Dropdown.Item>
          <Dropdown.Item onClick={() => handleFilterChange("Former Employee")}>
            Former Employee
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}
