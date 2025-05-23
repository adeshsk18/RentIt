import { useState } from "react";
import { toast } from "react-toastify";

import { emailPattern, passwordPattern } from "../../constanst";
import api from "../../services/api";
import { getResponseMsg } from "../../services/utils";

const useRegister = () => {
  const [loading, setLoading] = useState(false);

  const register = async (formData) => {
    const { name, email, password, contactNumber } = formData;

    if (!name || !email || !password || !contactNumber) {
      toast.warn("All fields are required");
      return false;
    }

    if (name.length < 5) {
      toast.warn("Name should be at least 5 characters");
      return false;
    }
    if (!emailPattern.test(email)) {
      toast.warn("Invalid email format");
      return false;
    }
    if (!passwordPattern.test(password)) {
      toast.warn(
        "Password must be at least 8 characters, contain at least one number and one special character"
      );
      return false;
    }

    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", {
        name,
        email,
        password,
        contactNumber
      });

      toast.success(data.message + " Please login with your credentials.");
      return true;
    } catch (error) {
      toast.error(getResponseMsg(error));
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { loading, register };
};

export default useRegister;
