import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import useAuthStore from "../stores/useAuthStore";

const AdminVerification = () => {
  const [passphrase, setPassphrase] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUserData } = useAuthStore();

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

      const response = await axios.post("/api/auth/verify-admin", {
        tempToken,
        adminPassphrase: passphrase,
      });

      // Clear the temporary token
      localStorage.removeItem("adminTempToken");

      // Set the actual token and user data
      localStorage.setItem("token", response.data.token);
      setUserData(response.data.userData);

      toast.success("Admin login successful");
      navigate("/");
    } catch (error) {
      if (error.response?.status === 401) {
        // Token expired or invalid
        localStorage.removeItem("adminTempToken");
        toast.error("Session expired. Please login again.");
        navigate("/login");
      } else {
        toast.error("Invalid password");
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
              Please enter your password to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="passphrase" className="sr-only">
                Password
              </label>
              <input
                id="passphrase"
                name="passphrase"
                type="password"
                required
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                className="relative block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                placeholder="Enter password"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Verifying..." : "Verify"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminVerification; 