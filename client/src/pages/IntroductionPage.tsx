import React, { useContext, useEffect, useState } from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { CompanyContext, Employee } from "../context/CompanyContext.tsx";
import axios from "axios";

export function IntroductionPage() {
  const { departmentId } = useParams();
  const [departmentEmployees, setDepartmentEmployees] = useState([]);
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error("Department must be used within a CompanyProvider");
  }
  const { departments } = context;

  const id = departmentId ? parseInt(departmentId, 10) : undefined;
  const currentDepartment = departments.find(
    (department) => department.id === id
  );
  console.log("currentDepartment", id);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/admin/get_employees_by_departments", {
        params: { department_id: id },
      })
      .then((res) => {
        setDepartmentEmployees(res.data);
        console.log("departmentEmployees", departmentEmployees);
      });
  }, []);

  return (
    <div
      style={{
        backgroundImage: `url('../../public/department.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat", // Do not repeat the image
        display: "flex", // Use flexbox
        justifyContent: "center", // Center horizontally
        alignItems: "center", // Center vertically
        height: "100vh",
        width: "100vw",
      }}
    >
      <Container className="mt-5">
        <Row>
          <Col>
            <h1 className="mb-4" style={{ color: "white" }}>
              Welcome to the Department of {currentDepartment?.name}
            </h1>
            <p className="lead" style={{ color: "white" }}>
              {currentDepartment?.description}
            </p>
          </Col>
        </Row>
        <Row
          className="mt-4"
          style={{
            padding: "20px",
            backgroundColor: "#fff",
            borderRadius: "10px",
            width: "100%",
            height: "50vh",
            overflowX: "auto",
          }}
        >
          <Col
            md={3}
            className="our-team-container d-flex-column margin-right-md"
            style={{ textAlign: "right", position: "relative" }}
          >
            <h2>Our</h2>
            <h2>Team</h2>
          </Col>
          <Col
            md={1}
            className="d-flex justify-content-center align-items-center"
          >
            <div style={{ borderLeft: "1px solid #000", height: "100%" }}></div>
          </Col>
          <Col md={8}>
            <Row>
              {departmentEmployees.length === 0 &&
                (console.log("departmentEmployees render", departmentEmployees),
                (
                  <div>
                    Sorry this is a new apartment. No teammembers has been
                    assigned yet.
                  </div>
                ))}
              {departmentEmployees.map((member: Employee, index) => (
                <Col
                  key={index}
                  md={4}
                  className="d-flex flex-column align-items-center mb-4"
                >
                  <Image
                    src={`../../public/office.jpg`}
                    roundedCircle
                    className="mb-2"
                    style={{ width: "80px", height: "80px" }}
                  />
                  <div className="text-center">
                    <strong>{member.name}</strong>
                    <br />
                    <span>{member.role_name}</span>
                  </div>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
