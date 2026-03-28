import axios from "axios";
import type { AuthData } from "../types/userType";

const url = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: `${url}/api`,
  headers: {
    Accept: "application/json",
  },
});

api.interceptors.request.use((config) => {
  const auth = localStorage.getItem("auth");

  if (auth) {
    const parsed: AuthData = JSON.parse(auth).datas;

    if (parsed.token) {
      config.headers.Authorization = `Bearer ${parsed.token}`;
    }
  }
  return config;
});

export default api;
