import { useState } from "react";

import AuthForm from "../components/AuthForm.jsx";
import useRegister from "../hooks/auth/useRegister.js";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passphrase: "",
  });

  const { loading, register } = useRegister();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register(formData);
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
