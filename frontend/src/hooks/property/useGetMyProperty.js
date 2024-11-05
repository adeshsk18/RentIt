import { useState } from "react";
import { toast } from "react-toastify";

import api from "../../services/api";
import { getResponseMsg } from "../../services/utils";

const useGetMyProperty = () => {
  const [loading, setLoading] = useState(false);

  const getProperty = async (propertyId) => {
    setLoading(true);
    try {
      const response = await api.get(`/owner/property/${propertyId}`);
      return response.data.property;
    } catch (error) {
      toast.error(getResponseMsg(error));
    } finally {
      setLoading(false);
    }
    return null;
  };

  return { loading, getProperty };
};
export default useGetMyProperty;
