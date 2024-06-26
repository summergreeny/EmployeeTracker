import { useState, useContext, useEffect } from "react";
import { Tables } from "../components/Tables";
import { EditEmployee } from "../components/EditEmployee";
import { CompanyContext } from "../context/CompanyContext";
import { FilterButton } from "../components/FilterButton";
import { AddNewBtn } from "../components/AddNewBtn";
import { SearchBar } from "../components/SearchBar";
import "../styles.css";
import { AxiosResponse } from "axios";
// @ts-ignore
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
  const [search, setSearch] = useState("");
  const [length, setLength] = useState(0);
  const [employeeStatusOn, setEmployeeStatusOn] = useState(false);

  if (!context) {
    throw new Error("Department must be used within a DepartmentsProvider");
  }
  const { employees, getEmployeeByPages, dataLength } = context;

  useEffect(() => {
    // Initialize tableData when context is available
    if (employees.length > 0) {
      setTableData(employees);
      setLength(dataLength);
    }
  }, [employees]);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    event && event.preventDefault();
    setPage(newPage);

    // Fetch data for the new page
    getEmployeeByPages({
      page: newPage + 1,
      perPage: rowsPerPage,
      search: search.toLowerCase().split(" "),
    })
      .then((res: AxiosResponse) => {
        setTableData(res.data.data);
        setPage(newPage);
      })
      .catch((error: unknown) => {
        console.error("Error fetching page data:", error);
      });
    console.log("searchQuery", search.toLowerCase().split(" "));
    console.log("search", search);
    console.log("data", tableData);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const searchQuery = search.toLowerCase().split(" ");
      getEmployeeByPages({
        page: page,
        perPage: rowsPerPage,
        search: searchQuery,
      })
        .then((res: AxiosResponse) => {
          // Update tableData state with the fetched data
          console.log("res.data.data", res.data.data);
          setLength(res.data.total_records);
          setTableData(res.data.data);
          setPage(0);
          setRowsPerPage(rowsPerPage);
        })
        .catch((error: unknown) => {
          // Explicitly type the 'error' parameter as 'any'
          console.error("Error fetching rows per page data:", error);
        });

      console.log("searchQuery", searchQuery);
      console.log("search", search);
      console.log("data", tableData);

      // setSearch(""); // Clear the search bar
    }
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);

    // Fetch data for the first page with the new rowsPerPage value
    getEmployeeByPages({
      page: page,
      perPage: newRowsPerPage,
      search: search.toLowerCase().split(" "),
    })
      .then((res: AxiosResponse) => {
        // Update tableData state with the fetched data
        setTableData(res.data.data);
      })
      .catch((error: unknown) => {
        console.error("Error fetching rows per page data:", error);
      });
    // setSearch("");
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
        <FilterButton
          setTableData={setTableData}
          setEmployeeStatusOne={setEmployeeStatusOn}
        />
        {!employeeStatusOn && (
          <SearchBar
            search={search}
            setSearch={setSearch}
            handleKeyDown={handleKeyDown}
          />
        )}
      </div>

      <Tables
        header={header}
        data={tableData}
        tableName={"Employees"}
        page={page}
        rowsPerPage={rowsPerPage}
        length={length}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        showEmployeeStatus={employeeStatusOn}
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
