import { useState } from "react";

import api from "../../services/api";

export const useGetUsers = () => {
  const [loading, setLoading] = useState(false);

  const getUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/admin/users");
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return { loading, getUsers };
}; 