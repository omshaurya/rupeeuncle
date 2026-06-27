import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : "/api",
  timeout: 10000,
});

export default apiClient;
