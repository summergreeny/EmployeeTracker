import { Button } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import React, { useContext, useState } from "react";
import { ProfileMenu } from "../components/ProfileMenu";

export function Dashboard() {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const { userInfo } = authContext;
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };
  return (
    <div
      style={{
        backgroundImage: `url('../../public/office.jpg')`,
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
      <div>
        <h1
          className="mt-5 mb-5"
          style={{
            color: "black",
            fontSize: "3rem",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
          }}
        >
          Hi {userInfo?.name}
        </h1>
        <p
          style={{
            color: "black",
            fontSize: "1.5rem",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
          }}
        >
          Welcome to the Employee Management System Dashboard
        </p>
        <Button
          className="btn btn-success mx-3 my-2"
          style={{ boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}
          onClick={toggleProfileMenu}
        >
          View your profile
        </Button>
        <>
          <ProfileMenu isOpen={isProfileMenuOpen} close={toggleProfileMenu} />
        </>
      </div>
    </div>
  );
}
