import React, { useContext, useState, useEffect } from "react";
import { CompanyContext } from "../context/CompanyContext";
import { AxiosResponse } from "axios";
import { Tables } from "../components/Tables";

export function Role() {
  const header = ["Role", "Description", "Employment Count"];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [roles, setRoles] = useState<any[]>([]);
  const [roleLength, setroleLength] = useState(0);

  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error("Department must be used within a CompanyProvider");
  }
  const { getInfoByPages } = context;

  useEffect(() => {
    fetchRoles(page, rowsPerPage);
  }, [page, rowsPerPage]);

  const fetchRoles = (page: number, rowsPerPage: number) => {
    getInfoByPages({
      page: page + 1,
      perPage: rowsPerPage,
      infoContent: "roles",
    })
      .then((res: AxiosResponse) => {
        setRoles(res.data.data);
        setroleLength(res.data.total_records);
      })
      .catch((error: unknown) => {
        console.error("Error fetching department data:", error);
      });
  };

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    event?.preventDefault();
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  return (
    <div>
      <Tables
        header={header}
        data={roles}
        tableName={"Roles"}
        page={page}
        rowsPerPage={rowsPerPage}
        length={roleLength}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </div>
  );
}
