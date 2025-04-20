import { useState } from "react";

import api from "../../services/api";

export const useRevertOwner = () => {
  const [loading, setLoading] = useState(false);

  const revertOwner = async (userId) => {
    setLoading(true);
    try {
      await api.put(`/admin/users/${userId}/revert`);
      return true;
    } catch (error) {
      console.error("Error reverting owner status:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { loading, revertOwner };
}; 