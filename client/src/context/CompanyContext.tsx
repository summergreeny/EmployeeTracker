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
  dataLength: number;
  getEmployeeByPages: (props: {
    page: number;
    perPage: number;
    search: string[] | [];
  }) => any;
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
  const [dataLength, setDataLength] = useState(0);

  const storedUserInfoString = localStorage.getItem("userInfo");
  const storedUserInfo = storedUserInfoString
    ? JSON.parse(storedUserInfoString)
    : {};
  const is_admin = storedUserInfo?.is_admin ?? false;
  const params = {
    isAdmin: is_admin,
  };

  type getEmployeeByPagesProps = {
    page: number;
    perPage: number;
    search: string[] | [];
  };
  const getEmployeeByPages = ({
    page,
    perPage,
    search,
  }: getEmployeeByPagesProps) => {
    return axios.get(`http://127.0.0.1:5000/admin/get_employees_by_pages`, {
      params: {
        page,
        perPage,
        search: search,
      },
    });
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
      .get(`http://127.0.0.1:5000/admin/get_employees_by_pages`, {
        params: {
          page: 0,
          perPage: 10,
          search: [],
        },
      })
      .then((res) => {
        setEmployees(res.data.data);
        setDataLength(res.data.total_records);
        console.log(res.data); // Log departments data after it has been set
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);
  return (
    <CompanyContext.Provider
      value={{ departments, roles, employees, getEmployeeByPages, dataLength }}
    >
      {children}
    </CompanyContext.Provider>
  );
}
