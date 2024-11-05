import { useState } from "react";
import { toast } from "react-toastify";

import api from "../../services/api";
import { getResponseMsg } from "../../services/utils";

const useEditProfile = () => {
  const [loading, setLoading] = useState(false);

  const editProfile = async (formData) => {
    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null && formData[key] !== "") {
        form.append(key, formData[key]);
      }
    });

    setLoading(true);
    try {
      const response = await api.put("/user/profile", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(response.data.message);
      setLoading(false);
      return response.data.user;
    } catch (error) {
      toast.error(getResponseMsg(error) || "Failed to update profile");
    } finally {
      setLoading(false);
    }
    return null;
  };

  return { loading, editProfile };
};
export default useEditProfile;
