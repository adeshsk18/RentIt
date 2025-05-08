import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";
import api from "../services/api";
import { getResponseMsg } from "../services/utils";
import useAuthStore from "../stores/useAuthStore";

const AdminVerification = () => {
  const [passphrase, setPassphrase] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setAuthData } = useAuthStore();

  useEffect(() => {
    // Check if temp token exists
    const tempToken = localStorage.getItem("adminTempToken");
    if (!tempToken) {
      toast.error("Session expired. Please login again.");
      navigate("/login");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const tempToken = localStorage.getItem("adminTempToken");
      if (!tempToken) {
        navigate("/login");
        return;
      }

      console.log('Sending request with:', {
        tempToken,
        adminPassphrase: passphrase
      });

      const { data } = await api.post("/auth/verify-admin", {
        tempToken,
        adminPassphrase: passphrase,
      });

      console.log('Received response:', data);

      // Clear the temporary token
      localStorage.removeItem("adminTempToken");

      // Set the actual token and user data
      setAuthData(data.userData, data.token);
      // Store user type in sessionStorage
      sessionStorage.setItem("user_type", data.userData.type);

      toast.success("Admin login successful");
      navigate("/");
    } catch (error) {
      console.error('Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });

      if (error.response?.status === 401) {
        // Token expired or invalid
        localStorage.removeItem("adminTempToken");
        toast.error("Session expired. Please login again.");
        navigate("/login");
      } else {
        toast.error(getResponseMsg(error) || "Login Failed");
      }
    } finally {
      setLoading(false);
    }
  };

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
              <h1 className="text-2xl font-bold text-gray-800">Admin Verification</h1>
            </div>
            <p className="text-gray-500 text-xs mt-1">
              Please enter your admin passphrase to continue
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="password"
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                placeholder="Enter admin passphrase"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminVerification; 