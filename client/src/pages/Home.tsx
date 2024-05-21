import React, { useState } from "react";
import { Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { LogInWindow } from "../components/LogInWindow";

export function Home() {
  const [showLogin, setShowLogin] = useState(false);

  const handleShowLogin = () => {
    setShowLogin(true);
  };
  const handleShowLoginClose = () => {
    setShowLogin(false);
  };

  return (
    <Container>
      <div className="mb-5 d-flex ">
        <div className="justify-content-center ml-4">
          <h1 className="mt-5 mb-5">Welcome to Employee Management System</h1>
          <p className="lead">
            Streamline your workforce management with our powerful Employee
            Management System. Whether you're a small startup or a large
            enterprise, our platform helps you efficiently manage your teams,
            enhance productivity, and stay organized.
          </p>

          <div className="d-flex  align-items-center">
            <Link to="/register" className="btn btn-primary mx-3 my-2">
              Register as New User
            </Link>
            <Button
              variant="success"
              onClick={handleShowLogin}
              className="mx-3 my-2"
            >
              Already have an account? Login
            </Button>
            <LogInWindow show={showLogin} onHide={handleShowLoginClose} />
          </div>
          <img
            src="../../public/Free-Project-Management-Software.jpg"
            alt="Human Resource Management"
            style={{
              position: "absolute",
              bottom: "0",
              right: "0",
              maxWidth: "50%",
              height: "auto",
              marginRight: "50px",
            }}
          />
        </div>
      </div>
    </Container>
  );
}

export default Home;
