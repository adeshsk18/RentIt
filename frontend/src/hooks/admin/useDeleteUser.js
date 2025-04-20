import { useState } from "react";

import api from "../../services/api";

export const useDeleteUser = () => {
  const [loading, setLoading] = useState(false);

  const deleteUser = async (userId) => {
    setLoading(true);
    try {
      await api.delete(`/admin/users/${userId}`);
      return true;
    } catch (error) {
      console.error("Error deleting user:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { loading, deleteUser };
}; 