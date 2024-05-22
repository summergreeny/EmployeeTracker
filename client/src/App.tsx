import { Route, Routes } from "react-router-dom";
import { useContext } from "react";
import { Home } from "./pages/Home";
import { Dashboard } from "./pages/Dashboard";
import { Role } from "./pages/Role.tsx";
import { Employee } from "./pages/Employee.tsx";
import { NavBar } from "./components/NavBar/NavBar.tsx";
import { AuthContext } from "./context/AuthContext";
import { ProtectedRoute } from "./utilities/ProtectedRoute.tsx";
import { Department } from "./pages/Department.tsx";
import { Register } from "./pages/Register.tsx";
import { IntroductionPage } from "./pages/IntroductionPage.tsx";

function App() {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const { isLoggedIn } = authContext;

  return (
    <div>
      <NavBar isLoggedIn={isLoggedIn} />
      <Routes>
        <Route path="/" element={isLoggedIn ? <Dashboard /> : <Home />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/employees" element={<Employee />} />
          <Route path="/departments" element={<Department />} />
          <Route path="/roles" element={<Role />} />
          <Route
            path="/department/:departmentId"
            element={<IntroductionPage />}
          />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
