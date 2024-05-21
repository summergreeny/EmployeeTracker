import React, { useContext } from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { CompanyContext } from "../context/CompanyContext.tsx";
import img from "../../public/office.jpg";

export function IntroductionPage() {
  const { departmentId } = useParams();

  const id = departmentId ? parseInt(departmentId, 10) : undefined;

  const companyContext = useContext(CompanyContext);
  if (!companyContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const { departments, employees } = companyContext;
  const currentDepartment = departments.find(
    (department) => department.id === id
  );

  const departmentEmployees = employees.filter(
    (e) => e.department_name === currentDepartment?.name
  );
  console.log(departmentEmployees);

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
              {departmentEmployees.map((member, index) => (
                <Col
                  key={index}
                  md={4}
                  className="d-flex flex-column align-items-center mb-4"
                >
                  <Image
                    src={img}
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
