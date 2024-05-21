import { useState, useContext, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { CompanyContext } from "../context/CompanyContext";
import axios from "axios";

// This modal is showing when user tries to edit an employee or add a new employee

type EditEmployeeProps = {
  show: boolean;
  setShow: (value: boolean) => void;
  handleClose: () => void;
  title: String;
  employee: EmployeeInfo | null;
};

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

export function EditEmployee({
  show,
  setShow,
  handleClose,
  title,
  employee,
}: EditEmployeeProps) {
  const [employeeInfo, setEmployeeInfo] = useState<EmployeeInfo>({
    id: 0,
    name: "",
    email: "",
    password: "",
    phone_number: "",
    department_name: "",
    role_name: "",
    employStatus: "",
    is_admin: false,
  });

  // Update state when the employee prop changes
  useEffect(() => {
    if (employee) {
      setEmployeeInfo(employee);
    }
  }, [employee]);

  console.log(employeeInfo);

  const context = useContext(CompanyContext);

  const handleSave = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (!employeeInfo.name || !employeeInfo.email) {
      alert("Employee name and email are required.");
      return;
    }

    const requestBody = {
      name: employeeInfo.name,
      email: employeeInfo.email,
      password: employeeInfo.password,
      phone: employeeInfo.phone_number || "", // Handle optional field
      department: employeeInfo.department_name || "", // Handle optional field
      role: employeeInfo.role_name || "", // Handle optional field
      employStatus: employeeInfo.employStatus || "", // Handle optional field
      is_admin: employeeInfo.is_admin || false, // Handle optional field
    };

    console.log("New Employee");
    console.log(employeeInfo);
    const endpoint =
      title === "Edit Employee"
        ? `http://127.0.0.1:5000/admin/employees/${employeeInfo.id}`
        : "http://127.0.0.1:5000/admin/newemployees";

    // Send the request
    const request =
      title === "Edit Employee"
        ? axios.put(endpoint, requestBody)
        : axios.post(endpoint, requestBody);

    request
      .then((res) => {
        console.log(res.data);
        setShow(false);
        window.location.reload(); // Refresh the page after successful save
      })
      .catch((error) => {
        console.error("There was an error!", error);
        alert(
          "Error saving employee: " +
            (error.response?.data?.message || error.message)
        );
      });
  };

  if (!context) {
    throw new Error("Department must be used within a DepartmentsProvider");
  }

  const { departments, roles } = context;

  return (
    <div>
      <Modal
        centered
        show={show}
        onHide={handleClose}
        style={{ width: "100%" }}
      >
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div>
            <Form>
              <Modal.Body>
                <div>
                  <Form>
                    {title === "Edit Employee" && (
                      <>
                        <Form.Group controlId="employeeName">
                          <Form.Label>Name</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Name"
                            value={employeeInfo.name}
                            onChange={(e) =>
                              setEmployeeInfo({
                                ...employeeInfo,
                                name: e.target.value,
                              })
                            }
                            required
                          />
                        </Form.Group>
                        <Form.Group controlId="employeeEmail">
                          <Form.Label>Email address</Form.Label>
                          <Form.Control
                            type="email"
                            placeholder="Enter email"
                            value={employeeInfo.email}
                            onChange={(e) =>
                              setEmployeeInfo({
                                ...employeeInfo,
                                email: e.target.value,
                              })
                            }
                            required
                          />
                        </Form.Group>
                        <Form.Group controlId="employeePhone">
                          <Form.Label>Phone Number</Form.Label>
                          <Form.Control
                            type="phone"
                            placeholder="Phone Number"
                            value={employeeInfo.phone_number}
                            onChange={(e) =>
                              setEmployeeInfo({
                                ...employeeInfo,
                                phone_number: e.target.value,
                              })
                            }
                            required
                          />
                        </Form.Group>
                        <Form.Group controlId="employeePassword">
                          <Form.Label>Password</Form.Label>
                          <Form.Control
                            type="password"
                            placeholder="Password"
                            value={employeeInfo.password}
                            onChange={(e) =>
                              setEmployeeInfo({
                                ...employeeInfo,
                                password: e.target.value,
                              })
                            }
                            required
                          />
                        </Form.Group>
                        <Form.Group controlId="employeeDepartment">
                          <Form.Label>Department</Form.Label>
                          <Form.Control
                            as="select"
                            name="department"
                            value={employeeInfo.department_name}
                            onChange={(e) =>
                              setEmployeeInfo({
                                ...employeeInfo,
                                department_name: e.target.value,
                              })
                            }
                          >
                            <option value="">Select department</option>
                            {departments.map((department) => (
                              <option
                                key={department.id}
                                value={department.name}
                              >
                                {department.name}
                              </option>
                            ))}
                          </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="employeeRole">
                          <Form.Label>Role</Form.Label>
                          <Form.Control
                            as="select"
                            name="role"
                            value={employeeInfo.role_name}
                            onChange={(e) =>
                              setEmployeeInfo({
                                ...employeeInfo,
                                role_name: e.target.value,
                              })
                            }
                          >
                            <option value="">Select role</option>
                            {roles.map((role) => (
                              <option key={role.id} value={role.name}>
                                {role.name}
                              </option>
                            ))}
                          </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="employeeStatus">
                          <Form.Label>Employment Status</Form.Label>
                          <Form.Control
                            as="select"
                            name="employStatus"
                            value={employeeInfo.employStatus}
                            onChange={(e) =>
                              setEmployeeInfo({
                                ...employeeInfo,
                                employStatus: e.target.value,
                              })
                            }
                          >
                            <option value="">Select</option>
                            <option value="New Hire">New Hire</option>
                            <option value="Active Employee">
                              Active Employee
                            </option>
                            <option value="Inactive Employee">
                              Inactive Employee
                            </option>
                            <option value="Former Employee">
                              Former Employee
                            </option>
                          </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="employeeIsAdmin">
                          <Form.Label>
                            Is This Employee An Administrator?
                          </Form.Label>
                          <Form.Control
                            as="select"
                            name="is_admin"
                            value={employeeInfo.is_admin.toString()}
                            onChange={(e) =>
                              setEmployeeInfo({
                                ...employeeInfo,
                                is_admin: e.target.value === "true",
                              })
                            }
                          >
                            <option value="true">True</option>
                            <option value="false">False</option>
                          </Form.Control>
                        </Form.Group>
                      </>
                    )}

                    {/* {(title === "Edit Department" ||
                      title === "Edit Roles") && (
                      <>
                        <Form.Group controlId="department_name">
                          <Form.Label>Name</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Name"
                            value={employeeInfo.name}
                            onChange={(e) =>
                              setEmployeeInfo({
                                ...employeeInfo,
                                name: e.target.value,
                              })
                            }
                            required
                          />
                        </Form.Group>
                        <Form.Group controlId="employeeEmail">
                          <Form.Label>Email address</Form.Label>
                          <Form.Control
                            type="email"
                            placeholder="Enter email"
                            value={employeeInfo.email}
                            onChange={(e) =>
                              setEmployeeInfo({
                                ...employeeInfo,
                                email: e.target.value,
                              })
                            }
                            required
                          />
                        </Form.Group>
                      </>
                    )} */}
                  </Form>
                </div>
              </Modal.Body>
            </Form>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
              handleSave(e)
            }
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
              handleSave(e)
            }
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
