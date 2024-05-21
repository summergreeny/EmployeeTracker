// src/context/DepartmentsContext.tsx
import { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

type Department = {
  id: number;
  name: string;
  description: string;
  employmentCount: number;
};

type Role = {
  id: number;
  name: string;
  description: string;
  employmentCount: number;
};

export type Employee = {
  name: string;
  email: string;
  phone: string;
  department: string;
  employmentStatus: string;
  role: string;
};

type companyContextProps = {
  departments: Department[];
  roles: Role[];
  employees: Employee[];
};

export const CompanyContext = createContext<companyContextProps | undefined>(
  undefined
);

interface CompanyProviderProps {
  children: ReactNode;
}

export function CompanyProvider({ children }: CompanyProviderProps) {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [employees, setEmployees] = useState([]);

  const storedUserInfoString = localStorage.getItem("userInfo");
  const storedUserInfo = storedUserInfoString
    ? JSON.parse(storedUserInfoString)
    : {};
  const is_admin = storedUserInfo?.is_admin ?? false;
  const params = {
    isAdmin: is_admin,
  };

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/admin/departments", { params })
      .then((res) => {
        setDepartments(res.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    axios
      .get("http://127.0.0.1:5000/admin/roles", { params })
      .then((res) => {
        setRoles(res.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    axios
      .get("http://127.0.0.1:5000/admin/employees", { params })
      .then((res) => {
        setEmployees(res.data);
        console.log(res.data); // Log departments data after it has been set
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  console.log(departments);
  return (
    <CompanyContext.Provider value={{ departments, roles, employees }}>
      {children}
    </CompanyContext.Provider>
  );
}
