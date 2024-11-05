import axios from "axios";
import { toast } from "react-toastify";

import { SERVER_URL } from "../constanst";
import useAuthStore from "../stores/useAuthStore";

const api = axios.create({
  baseURL: SERVER_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const { token } = useAuthStore.getState();
    if (token) {
      config.headers["authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      toast.info("Your session has expired.");
      const { removeAuthData } = useAuthStore.getState();
      removeAuthData();
      setTimeout(() => (window.location.href = "/login"), 2000);
    }

    return Promise.reject(error);
  }
);
export default api;
