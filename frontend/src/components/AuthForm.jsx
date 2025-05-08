import { Link } from "react-router-dom";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { FaHome } from "react-icons/fa";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { MdSecurity, MdVerified } from "react-icons/md";
import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const AuthForm = ({
  formData,
  setFormData,
  handleSubmit,
  name,
  altMsg,
  altPath,
  loading,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value.trim() });
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

        {/* Form Section with Brand */}
        <div className="bg-white rounded-lg shadow-xl p-5 mb-8">
          {/* Brand Section */}
          <div className="text-center mb-4">
            <div className="flex items-center justify-center">
              <FaHome className="text-2xl mr-2 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-800">RentIt</h1>
            </div>
            <p className="text-gray-500 text-xs mt-1">
              Your trusted platform for property seekers and owners
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {name === "Register" && (
              <div>
                <label className="block text-gray-700 text-xs font-medium mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name || ""}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
            )}

            <div>
              <label className="block text-gray-700 text-xs font-medium mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-xs font-medium mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
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
              {name === "Login" && (
                <div className="text-right mt-1">
                  <Link
                    to="/forgot-password"
                    className="text-xs text-blue-600 hover:text-blue-700"
                  >
                    Forgot Password?
                  </Link>
                </div>
              )}
            </div>

            {name === "Register" && (
              <div>
                <label className="block text-gray-700 text-xs font-medium mb-1">
                  Contact Number
                </label>
                <PhoneInput
                  country={'in'}
                  value={formData.contactNumber}
                  onChange={phone => setFormData(prev => ({ ...prev, contactNumber: phone }))}
                  inputClass="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  inputStyle={{ width: '100%' }}
                  specialLabel=""
                  enableSearch
                  required
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-1.5 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm mt-2"
            >
              {loading ? (
                "Please wait..."
              ) : name === "Login" ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </button>

            <div className="text-center text-gray-600 text-xs">
              {altMsg}{" "}
              <Link to={`/${altPath}`} className="text-blue-600 hover:text-blue-700 font-medium">
                {name === "Login" ? "Sign Up" : "Sign In"}
              </Link>
            </div>

            {/* Legal Links */}
            <div className="mt-4 text-center text-xs text-gray-500">
              By {name === "Login" ? "signing in" : "creating an account"}, you agree to our{" "}
              <Link to="/terms" className="text-blue-600 hover:text-blue-700">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy-policy" className="text-blue-600 hover:text-blue-700">
                Privacy Policy
              </Link>
            </div>
          </form>
        </div>

        {/* Features Section - Modern Style */}
        <div className="grid grid-cols-3 gap-8">
          <div className="text-center group">
            <div className="transform transition-transform group-hover:scale-110">
              <HiOutlineBuildingOffice2 className="text-3xl mx-auto text-yellow-300 drop-shadow-glow mb-2" />
              <div className="bg-gradient-to-r from-yellow-400/20 to-yellow-300/20 backdrop-blur-sm rounded-full py-1 px-3">
                <h3 className="font-medium text-white text-sm">Wide Selection</h3>
              </div>
            </div>
          </div>
          <div className="text-center group">
            <div className="transform transition-transform group-hover:scale-110">
              <MdSecurity className="text-3xl mx-auto text-green-300 drop-shadow-glow mb-2" />
              <div className="bg-gradient-to-r from-green-400/20 to-green-300/20 backdrop-blur-sm rounded-full py-1 px-3">
                <h3 className="font-medium text-white text-sm">Secure Platform</h3>
              </div>
            </div>
          </div>
          <div className="text-center group">
            <div className="transform transition-transform group-hover:scale-110">
              <MdVerified className="text-3xl mx-auto text-purple-300 drop-shadow-glow mb-2" />
              <div className="bg-gradient-to-r from-purple-400/20 to-purple-300/20 backdrop-blur-sm rounded-full py-1 px-3">
                <h3 className="font-medium text-white text-sm">Verified Listings</h3>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .drop-shadow-glow {
            filter: drop-shadow(0 0 8px currentColor);
          }
        `}</style>
      </div>
    </div>
  );
};

export default AuthForm;
