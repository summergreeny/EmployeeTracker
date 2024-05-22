import { useContext, useState, useEffect } from "react";
import { Tables } from "../components/Tables";
import { CompanyContext } from "../context/CompanyContext";
import { AxiosResponse } from "axios";

export function Department() {
  const header = ["Department", "Description", "Employment Count", "Actions"];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [departments, setDepartments] = useState<any[]>([]);
  const [departmentLength, setDepartmentLength] = useState(0);

  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error("Department must be used within a CompanyProvider");
  }
  const { getInfoByPages } = context;

  useEffect(() => {
    fetchDepartments(page, rowsPerPage);
  }, [page, rowsPerPage]);

  const fetchDepartments = (page: number, rowsPerPage: number) => {
    getInfoByPages({
      page: page + 1, // Adjusting page for backend pagination (if necessary)
      perPage: rowsPerPage,
      infoContent: "departments",
    })
      .then((res: AxiosResponse) => {
        setDepartments(res.data.data);
        setDepartmentLength(res.data.total_records);
      })
      .catch((error: unknown) => {
        console.error("Error fetching department data:", error);
      });
  };

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    //todo: fix any type
    event && event.preventDefault();
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  console.log("departments", departments);

  return (
    <div>
      <Tables
        header={header}
        data={departments}
        tableName={"Departments"}
        page={page}
        rowsPerPage={rowsPerPage}
        length={departmentLength}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </div>
  );
}
