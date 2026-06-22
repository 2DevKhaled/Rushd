import axios from "axios";
import { BASE_URL } from "./apiPaths";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 80000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const authCode = error.response?.data?.code;
    if (
      error.response?.status === 401 ||
      authCode === "ACCOUNT_PENDING" ||
      authCode === "ACCOUNT_SUSPENDED"
    ) {
      localStorage.removeItem("token");
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
