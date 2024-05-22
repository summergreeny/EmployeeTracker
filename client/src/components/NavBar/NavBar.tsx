import { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { Nav, Navbar, Container } from "react-bootstrap";
import "./NavBar.css";
import { AuthContext } from "../../context/AuthContext";
import { ProfileMenu } from "../ProfileMenu";

type NavBarProps = {
  isLoggedIn: boolean;
};

export function NavBar({ isLoggedIn }: NavBarProps) {
  const authContext = useContext(AuthContext);

  const [isOpen, setisOpen] = useState(false);
  const openProfile = () => {
    console.log("open");
    setisOpen(true);
  };

  const closeProfile = () => {
    setisOpen(false);
  };

  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const { logout, userInfo } = authContext;
  return (
    <Navbar sticky="top" className="bg-white shadow-sm mb-3">
      <Container>
        <Navbar.Brand>Employee Management System</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto nav-links">
            {isLoggedIn ? (
              <>
                <Nav.Link to="/" as={NavLink}>
                  Dashboard
                </Nav.Link>
                {userInfo?.is_admin && (
                  <>
                    <Nav.Link to="/employees" as={NavLink}>
                      Employees
                    </Nav.Link>
                    <Nav.Link to="/departments" as={NavLink}>
                      Departments
                    </Nav.Link>
                    <Nav.Link to="/roles" as={NavLink}>
                      Roles
                    </Nav.Link>
                  </>
                )}

                <Nav.Link to="/" as={NavLink} onClick={logout}>
                  Logout
                </Nav.Link>
                <Navbar.Text onClick={openProfile}>
                  Hi, {userInfo?.name}!
                </Navbar.Text>
                <>
                  <ProfileMenu isOpen={isOpen} close={closeProfile} />
                </>
              </>
            ) : (
              <Nav.Link to="/" as={NavLink}>
                Home
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
