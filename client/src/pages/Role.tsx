import React, { useContext } from "react";
import { CompanyContext } from "../context/CompanyContext";

import { Tables } from "../components/Tables";

export function Role() {
  const header = ["Role", "Description", "Employment Count"];
  const context = useContext(CompanyContext);

  if (!context) {
    throw new Error("Department must be used within a DepartmentsProvider");
  }

  const { roles } = context;

  console.log(roles);

  return (
    <div>
      <Tables header={header} data={roles} tableName={"Roles"} />
    </div>
  );
}
