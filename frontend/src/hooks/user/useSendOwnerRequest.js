import { useState } from "react";
import { toast } from "react-toastify";

import api from "../../services/api";
import { getResponseMsg } from "../../services/utils";
import useAuthStore from "../../stores/useAuthStore";

const useSendOwnerRequest = () => {
  const [loading, setLoading] = useState(false);
  const { updateUserData } = useAuthStore();

  const sendOwnerRequest = async () => {
    setLoading(true);
    try {
      const { data } = await api.post("/user/orequest");
      toast.success(data.message);
      if (data.userData) {
        updateUserData(data.userData);
      }
    } catch (error) {
      toast.error(getResponseMsg(error) || "Failed to send the request");
    } finally {
      setLoading(false);
    }
  };

  return { loading, sendOwnerRequest };
};
export default useSendOwnerRequest;
