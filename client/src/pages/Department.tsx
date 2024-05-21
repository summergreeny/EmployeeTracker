import { useContext } from "react";
import { Tables } from "../components/Tables";
import { CompanyContext } from "../context/CompanyContext";

export function Department() {
  const header = ["Department", "Description", "Employment Count", "Actions"];

  const context = useContext(CompanyContext);

  if (!context) {
    throw new Error("Department must be used within a DepartmentsProvider");
  }

  const { departments } = context;
  console.log(departments);
  return (
    <div>
      <Tables header={header} data={departments} tableName={"Departments"} />
    </div>
  );
}
