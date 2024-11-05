import { useState } from "react";

import api from "../../services/api";

const useGetUserInfo = () => {
  const [loading, setLoading] = useState(false);

  const getUserInfo = async (username) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/list/u/${username}`);
      return data;
    } catch (error) {
      //toast.error(getResponseMsg(error));
    } finally {
      setLoading(false);
    }

    return null;
  };

  return { loading, getUserInfo };
};
export default useGetUserInfo;
