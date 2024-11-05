import { useState } from "react";
import { toast } from "react-toastify";

import { passwordPattern } from "../../constanst";
import api from "../../services/api";
import { getResponseMsg } from "../../services/utils";

const useChangePassword = () => {
  const [loading, setLoading] = useState(false);

  const changePassword = async (passwords) => {
    let retval = false;

    if (!validatePass(passwords)) {
      return retval;
    }

    setLoading(true);
    try {
      const response = await api.put("/user/profile/password", passwords);
      toast.success(response.data.message);
      retval = true;
    } catch (error) {
      toast.error(getResponseMsg(error) || "Failed to update password");
    } finally {
      setLoading(false);
    }

    return retval;
  };

  return { loading, changePassword };
};

const validatePass = (passwords) => {
  const { currentPassword, newPassword } = passwords;
  if (!currentPassword) {
    toast.warn("Please enter your current password!");
    return false;
  }
  if (!newPassword) {
    toast.warn("Please enter your new password!");
    return false;
  }

  if (!passwordPattern.test(newPassword)) {
    toast.warn(
      "Password must be at least 8 characters, contain at least one number and one special character"
    );
    return false;
  }
  return true;
};

export default useChangePassword;
