import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { SERVER_URL } from "../constanst";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        toast.error("Invalid reset link");
        navigate("/login");
        return;
      }

      try {
        console.log("Verifying token:", token);
        const response = await fetch(`${SERVER_URL}/auth/verify-reset-token/${token}`);
        const data = await response.json();
        console.log("Verification response:", data);

        if (response.ok) {
          setTokenValid(true);
        } else {
          toast.error(data.message || "Invalid or expired reset link");
          navigate("/login");
        }
      } catch (error) {
        console.error("Token verification error:", error);
        toast.error("Failed to verify reset link");
        navigate("/login");
      } finally {
        setVerifying(false);
      }
    };

    verifyToken();
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${SERVER_URL}/auth/reset-password/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Password reset successful!");
        navigate("/login");
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error("Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <div className="h-screen overflow-hidden bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Verifying reset link...</p>
        </div>
      </div>
    );
  }

  // Debug information
  console.log("Render state:", { verifying, tokenValid, token });

  if (!tokenValid) {
    return null; // Will redirect to login
  }

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
      <div className="w-full max-w-md mx-auto px-4">
        {/* Back to Home Button */}
        <Link
          to="/"
          className="mb-4 flex items-center gap-2 text-white hover:text-gray-200 transition-colors duration-200"
        >
          <FaHome className="text-lg" />
          <span>Back to Home</span>
        </Link>

        {/* Form Section */}
        <div className="bg-white rounded-lg shadow-xl p-5 mb-8">
          <div className="text-center mb-4">
            <div className="flex items-center justify-center">
              <FaHome className="text-2xl mr-2 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-800">Set New Password</h1>
            </div>
            <p className="text-gray-500 text-xs mt-1">
              Enter your new password below
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-gray-700 text-xs font-medium mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <BsEyeSlashFill size={16} /> : <BsEyeFill size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 text-xs font-medium mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <BsEyeSlashFill size={16} /> : <BsEyeFill size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-1.5 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm mt-2"
            >
              {loading ? "Processing..." : "Reset Password"}
            </button>

            <div className="text-center text-gray-600 text-xs">
              Remember your password?{" "}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign In
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword; 