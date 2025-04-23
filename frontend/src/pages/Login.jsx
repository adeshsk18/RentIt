import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AuthForm from "../components/AuthForm";
import useLogin from "../hooks/auth/useLogin";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { loading, login } = useLogin();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(formData);
    if (success) {
      toast.success("Login successful!");
      navigate("/");
    }
  };

  return (
    <AuthForm
      formData={formData}
      setFormData={setFormData}
      handleSubmit={handleSubmit}
      name="Login"
      altMsg="If you are not a registered user,"
      altPath="register"
      loading={loading}
    />
  );
};

export default Login;
