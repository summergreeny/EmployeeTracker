import React, { useContext } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";

export function Profile() {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const { userInfo } = authContext;
  console.log(userInfo);
  return (
    <Container className="profile-container mt-5">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <Card>
            <Card.Header as="h3">Profile</Card.Header>
            <Card.Body>
              <Card.Title>{userInfo?.name}</Card.Title>
              <Card.Text>
                <strong>Email:</strong> {userInfo?.email}
              </Card.Text>
              <Card.Text>
                <strong>Role:</strong> {userInfo?.role_name}
              </Card.Text>
              <Card.Text>
                <strong>Department:</strong> {userInfo?.department_name}
              </Card.Text>
              <Card.Text>
                <strong>Department:</strong> {userInfo?.phone_number}
              </Card.Text>
              <Card.Text>
                <strong>Department:</strong> {userInfo?.employStatus}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
