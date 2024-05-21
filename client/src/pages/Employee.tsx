import { useState, useContext, useEffect } from "react";
import { Tables } from "../components/Tables";
import { EditEmployee } from "../components/EditEmployee";
import { CompanyContext } from "../context/CompanyContext";
import { FilterButton } from "../components/FilterButton";
import { AddNewBtn } from "../components/AddNewBtn";
import { SearchBar } from "../components/SearchBar";
import "../styles.css";

export function Employee() {
  const header = [
    "Name",
    "Email",
    "Phone Number",
    "Department",
    "Role",
    "Employment Status",
    "Actions",
  ];

  const [show, setShow] = useState(false); // This is the data that will be displayed in the table
  const context = useContext(CompanyContext);

  if (!context) {
    throw new Error("Department must be used within a DepartmentsProvider");
  }

  const { employees } = context;

  useEffect(() => {
    setTableData(employees);
  }, [context]);

  const handleClickButton = () => {
    console.log("Button clicked");
    setShow((prevShow) => !prevShow); // Toggle the show state based on its previous value
  };
  const [tableData, setTableData] = useState(employees);
  console.log(employees);
  console.log("add new employee button clicked", show);

  return (
    <div style={{ position: "relative" }}>
      <div className="d-flex">
        <FilterButton setTableData={setTableData} />
        <SearchBar employeeData={employees} setTableData={setTableData} />
      </div>

      <Tables header={header} data={tableData} tableName={"Employees"} />
      {show && (
        <EditEmployee
          show={show}
          setShow={setShow}
          handleClose={handleClickButton}
          employee={{
            id: 0,
            name: "",
            email: "",
            password: "",
            phone_number: "",
            department_name: "",
            role_name: "",
            employStatus: "",
            is_admin: false,
          }}
          title={"Add A New User"}
        />
      )}
      <AddNewBtn
        handleClickButton={handleClickButton}
        text={"Add A New Employee"}
      />
    </div>
  );
}
