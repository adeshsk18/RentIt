import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AuthForm from "../components/AuthForm";
import useRegister from "../hooks/auth/useRegister";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    contactNumber: "",
  });
  const { loading, register } = useRegister();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await register(formData);
    if (success) {
      toast.success("Registration successful!");
      navigate("/login");
    }
  };

  return (
    <AuthForm
      formData={formData}
      setFormData={setFormData}
      handleSubmit={handleSubmit}
      name="Register"
      altMsg="If you already have an account,"
      altPath="login"
      loading={loading}
    />
  );
};

export default Register;
