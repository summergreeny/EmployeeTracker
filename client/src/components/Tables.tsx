import React, { useState } from "react";
import Table from "react-bootstrap/Table";
import { ButtonGroup, Button } from "react-bootstrap";
import axios from "axios";
import DeleteWarningModal from "./DeleteWarningModal";
import { EditEmployee } from "./EditEmployee";
import { FileUpload } from "./FileUpload";
import { FileExport } from "./FileExport";
import { EditInfo } from "../components/EditInfo";
import { contentInfoProps } from "../components/EditInfo";
import { Link } from "react-router-dom";
// This component is used to display tables of employees, departments, and roles

type EmployeeInfo = {
  id: number;
  name: string;
  email: string;
  password: string;
  phone_number: string;
  department_name: string;
  role_name: string;
  employStatus: string;
  is_admin: boolean;
};
type TablesProps = {
  header: string[];
  data: EmployeeInfo[] | any[];
  tableName: string;
};

export function Tables({ header, data, tableName }: TablesProps) {
  const [showWarning, setShowWarning] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showEditInfo, setShowEditInfo] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeInfo | null>(
    null
  );
  const [info, setInfo] = useState<contentInfoProps | null>(null);

  const deleteEmployee = (id: number) => {
    axios
      .delete(`http://127.0.0.1:5000/admin/employees/${id}`)
      .then((res) => {
        console.log(res.data);
        window.location.reload(); // Refresh the page after successful deletion
      })
      .catch((error) => {
        console.error("Error deleting employee:", error);
      });
  };

  const handleDelete = (id: number) => {
    setDeleteId(id);
    setShowWarning(true);
  };

  const handleEdit = (id: number) => {
    const employee = data.find((emp: EmployeeInfo) => emp.id === id);
    if (employee) {
      setSelectedEmployee(employee);
      setShowEdit(true);
    }
  };

  const handleEditInfo = (id: number) => {
    console.log("Edit info clicked");
    console.log(id);

    if (tableName === "Departments") {
      const department = data.find((dep: any) => dep.id === id);
      if (department) {
        setInfo(department);
        setShowEditInfo(true);
      } else {
        console.log("Department not found with id:", id);
      }
    } else {
      const role = data.find((dep: any) => dep.id === id);
      if (role) {
        setInfo(role);
        setShowEditInfo(true);
      } else {
        console.log("Role not found with id:", id);
      }
    }
  };

  const handleCloseModal = () => {
    setShowWarning(false);
    setShowEdit(false);
  };

  const handleCloseEditInfo = () => {
    setShowEditInfo(false);
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      deleteEmployee(deleteId);
    }
    setShowWarning(false);
  };
  console.log(selectedEmployee);

  return (
    <>
      <div
        style={{
          margin: "20px 0",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            borderBottom: "1px solid #ccc",
            width: "80%",
            paddingBottom: "10px",
          }}
        >
          {tableName}
        </h1>
      </div>
      <div
        className="table-responsive"
        style={{
          width: "80%",
          textAlign: "center",
          margin: " auto",
          paddingTop: "20px",
        }}
      >
        <Table striped bordered hover>
          <thead>
            <tr>
              {header.map((item, index) => {
                return <th key={index}>{item}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {tableName === "Employees"
              ? data.map((item, index) => (
                  <tr key={index}>
                    <td
                      style={{
                        backgroundColor: item.is_admin ? "yellow" : "inherit",
                      }}
                    >
                      {item.name}
                    </td>
                    <td
                      style={{
                        backgroundColor: item.is_admin ? "yellow" : "inherit",
                      }}
                    >
                      {item.email}
                    </td>
                    <td
                      style={{
                        backgroundColor: item.is_admin ? "yellow" : "inherit",
                      }}
                    >
                      {item.phone_number}
                    </td>
                    <td
                      style={{
                        backgroundColor: item.is_admin ? "yellow" : "inherit",
                      }}
                    >
                      {item.department_name}
                    </td>
                    <td
                      style={{
                        backgroundColor: item.is_admin ? "yellow" : "inherit",
                      }}
                    >
                      {item.role_name}
                    </td>
                    <td
                      style={{
                        backgroundColor: item.is_admin ? "yellow" : "inherit",
                      }}
                    >
                      {item.employStatus}
                    </td>
                    <td
                      style={{
                        backgroundColor: item.is_admin ? "yellow" : "inherit",
                      }}
                    >
                      <ButtonGroup>
                        <Button
                          variant="warning"
                          onClick={() => handleEdit(item.id)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => handleDelete(item.id)}
                        >
                          Delete
                        </Button>
                      </ButtonGroup>
                    </td>
                  </tr>
                ))
              : data.map((item, index) => (
                  <tr key={index}>
                    {tableName === "Departments" && (
                      <>
                        <td>
                          <Link to={`/department/${item.id}`}>{item.name}</Link>
                        </td>
                      </>
                    )}
                    {tableName === "Roles" && <td>{item.name}</td>}
                    <td>{item.description}</td>
                    <td>{item.employee_count}</td>
                    <td>
                      <Button
                        variant="warning"
                        onClick={() => handleEditInfo(item.id)}
                      >
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
          </tbody>
        </Table>
      </div>
      <EditInfo
        show={showEditInfo}
        handleClose={handleCloseEditInfo}
        title={tableName === "Departments" ? "Department" : " Role"}
        content={info}
      ></EditInfo>

      <DeleteWarningModal
        show={showWarning}
        onClose={handleCloseModal}
        onDelete={handleConfirmDelete}
      />

      <div style={{ width: "80%", margin: "10px auto 50px" }}>
        {tableName === "Employees" && (
          <>
            <EditEmployee
              show={showEdit}
              setShow={setShowEdit}
              handleClose={handleCloseModal}
              title={"Edit Employee"}
              employee={selectedEmployee}
            />
            <div className="d-flex">
              <FileUpload />
              <div style={{ marginLeft: "20px" }}></div>{" "}
              <FileExport contentName={"employees"} />
            </div>
          </>
        )}

        {tableName === "Departments" && (
          <FileExport contentName={"departments"} />
        )}

        {tableName === "Roles" && <FileExport contentName={"roles"} />}
      </div>
    </>
  );
}
