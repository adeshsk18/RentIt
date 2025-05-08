import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { emailPattern } from "../../constanst";
import api from "../../services/api";
import { getResponseMsg } from "../../services/utils";
import useAuthStore from "../../stores/useAuthStore";

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setAuthData } = useAuthStore();

  const login = async (formData) => {
    const { email, password } = formData;
    if (!email || !password) {
      toast.warn("All fields are required");
      return false;
    }
    if (!emailPattern.test(email)) {
      toast.warn("Invalid email format");
      return false;
    }

    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", formData);

      // If admin verification is required
      if (data.isAdmin) {
        localStorage.setItem("adminTempToken", data.tempToken);
        navigate("/admin-verification");
        return false;
      }

      setAuthData(data.userData, data.token);
      // Store user type in sessionStorage
      sessionStorage.setItem("user_type", data.userData.type);

      toast.success(data.message);
      return true;
    } catch (err) {
      toast.error(getResponseMsg(err));
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { loading, login };
};

export default useLogin;
