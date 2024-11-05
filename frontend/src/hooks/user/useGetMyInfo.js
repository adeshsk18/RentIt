import { useState } from "react";
import { toast } from "react-toastify";

import api from "../../services/api";
import { getResponseMsg } from "../../services/utils";

const useGetMyInfo = () => {
  const [loading, setLoading] = useState(false);

  const getMyInfo = async () => {
    let retval = null;
    setLoading(true);
    try {
      const response = await api.get("/user/profile");
      retval = response.data.user;
    } catch (error) {
      toast.error(getResponseMsg(error) || "Failed to fetch user data");
    } finally {
      setLoading(false);
    }

    return retval;
  };

  return { loading, getMyInfo };
};
export default useGetMyInfo;
