//an "Outlet" is a component that serves as a placeholder for the content that will be rendered based on the current URL. It's commonly used in nested route structures to indicate where child routes should be rendered within a parent component.
import { Outlet, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const isAuthenticated = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const { isLoggedIn } = authContext;
  return isLoggedIn;
};

export function ProtectedRoute() {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/" />;
}
