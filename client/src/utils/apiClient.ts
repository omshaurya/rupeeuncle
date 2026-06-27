import axios from "axios";

const apiClient = axios.create({
  baseURL: "/api", // proxied to backend in dev via vite.config.ts; same-origin in prod
  timeout: 10000,
});

export default apiClient;
