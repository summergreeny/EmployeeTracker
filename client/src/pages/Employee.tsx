import { useState, useContext, useEffect } from "react";
import { Tables } from "../components/Tables";
import { EditEmployee } from "../components/EditEmployee";
import { CompanyContext } from "../context/CompanyContext";
import { FilterButton } from "../components/FilterButton";
import { AddNewBtn } from "../components/AddNewBtn";
import { SearchBar } from "../components/SearchBar";
import "../styles.css";
import { AxiosResponse } from "axios";

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

  const [show, setShow] = useState(false);
  const context = useContext(CompanyContext);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [tableData, setTableData] = useState<any[]>([]);
  if (!context) {
    throw new Error("Department must be used within a DepartmentsProvider");
  }
  const { employees, getEmployeeByPages, dataLength } = context;

  useEffect(() => {
    // Initialize tableData when context is available
    if (employees.length > 0) {
      setTableData(employees);
    }
  }, [employees]);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);

    // Fetch data for the new page
    getEmployeeByPages({
      page: newPage + 1,
      perPage: rowsPerPage,
      search: [],
    })
      .then((res: AxiosResponse) => {
        // Update tableData state with the fetched data
        setTableData(res.data.data);
      })
      .catch((error) => {
        console.error("Error fetching page data:", error);
      });
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);

    // Fetch data for the first page with the new rowsPerPage value
    getEmployeeByPages({ page: 0, perPage: newRowsPerPage, search: [] })
      .then((res: AxiosResponse) => {
        // Update tableData state with the fetched data
        setTableData(res.data.data);
      })
      .catch((error) => {
        console.error("Error fetching rows per page data:", error);
      });
  };

  if (!context) {
    throw new Error("CompanyContext must be used within a CompanyProvider");
  }

  const handleClickButton = () => {
    setShow((prevShow) => !prevShow);
  };

  return (
    <div style={{ position: "relative" }}>
      <div className="d-flex">
        <FilterButton setTableData={setTableData} />
        <SearchBar employeeData={employees} setTableData={setTableData} />
      </div>

      <Tables
        header={header}
        data={tableData}
        tableName={"Employees"}
        page={page}
        rowsPerPage={rowsPerPage}
        length={dataLength}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
      />

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
