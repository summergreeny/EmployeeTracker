import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";
import axios from "axios";

export type User = {
  department_name: string;
  email: string;
  employStatus: string;
  id: number;
  is_admin: boolean;
  name: string;
  phone_number: string;
  role_name: string;
};

type AuthContextType = {
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  userInfo: User | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<User | null>(null);

  useEffect(() => {
    const storedUserInfo = localStorage.getItem("userInfo");

    console.log(storedUserInfo);

    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    }
  }, []);

  const login = async (email: string, password: string) => {
    console.log("login");
    console.log(email, password);
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/auth/login",
        { email, password },
        { withCredentials: true }
      );
      console.log(response.data);
      setIsLoggedIn(true);
      localStorage.setItem("userInfo", JSON.stringify(response.data.user));
      setUserInfo(JSON.parse(localStorage.getItem("userInfo") || "null"));
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please check your credentials and try again.");
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        "http://127.0.0.1:5000/auth/logout",
        {},
        { withCredentials: true }
      );
      setIsLoggedIn(false);
      setUserInfo(null);
      localStorage.removeItem("userInfo");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  console;
  return (
    <AuthContext.Provider value={{ login, logout, isLoggedIn, userInfo }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthContext };
