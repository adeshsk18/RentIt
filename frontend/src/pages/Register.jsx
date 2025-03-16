import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthForm from "../components/AuthForm.jsx";
import useRegister from "../hooks/auth/useRegister.js";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const { loading, register } = useRegister();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await register(formData);
    if (success) {
      // Redirect to login page after successful registration
      navigate("/login");
    }
  };

  return (
    <AuthForm
      formData={formData}
      setFormData={setFormData}
      handleSubmit={handleSubmit}
      name="Register"
      altMsg="If you have already registered,"
      altPath={"login"}
      loading={loading}
    />
  );
};

export default Register;
