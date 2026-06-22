import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../pages/utils/axiosInstance";
import { API_PATHS } from "../pages/utils/apiPaths";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const clearUser = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  const updateUser = (userData) => {
    setUser(userData);
    if (userData?.token) {
      localStorage.setItem("token", userData.token);
    }
    setLoading(false);
  };

  const login = async (credentials) => {
    const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, credentials);
    updateUser(response.data);
    return response.data;
  };

  const register = async (payload) => {
    const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, payload);
    if (response.data?.token) {
      updateUser(response.data);
    }
    return response.data;
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.AUTH.GET_ME);
        setUser(response.data);
      } catch (error) {
        console.error("User session could not be restored", error);
        clearUser();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, updateUser, clearUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};

export { AuthContext };
