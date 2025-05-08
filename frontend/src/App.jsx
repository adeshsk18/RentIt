import React, { useEffect } from "react";
import "react-country-state-city/dist/react-country-state-city.css";
import "react-phone-input-2/lib/style.css";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Loading from "./components/blocks/loading";
import Navbar from "./components/navbar";
import Footer from "./components/Footer";
import useFetchRequests from "./hooks/chat/useFetchRequests";
import AddProperty from "./pages/AddProperty";
import AdminPanel from "./pages/AdminPanel";
import AdminVerification from "./pages/AdminVerification";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import Listing from "./pages/Listing";
import Login from "./pages/Login";
import MyProfile from "./pages/MyProfile";
import MyProperties from "./pages/MyProperties";
import MyRequests from "./pages/MyRequests";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import Terms from "./pages/Terms";
import UDProperty from "./pages/UDProperty";
import PublicUserProfile from "./pages/UserPage";
import useAuthStore from "./stores/useAuthStore";
import useSocketStore from "./stores/useSocketStore";

const AppContent = () => {
  const { initializeSocket, closeSocket } = useSocketStore();
  const { loading, fetchRequests } = useFetchRequests();
  const { userData } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    const initSocketAndFetchRequests = async () => {
      initializeSocket(userData);

      if (userData) {
        await fetchRequests();
      }
    };
    initSocketAndFetchRequests();

    if (userData) fetchRequests();

    return () => {
      closeSocket();
    };
  }, [userData]);

  if (loading) return <Loading />;

  // Don't show navbar on login and register pages
  const hideNavbar = ['/login', '/register', '/forgot-password', '/reset-password'].includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={userData ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/register"
          element={userData ? <Navigate to="/" /> : <Register />}
        />
        <Route
          path="/forgot-password"
          element={userData ? <Navigate to="/" /> : <ForgotPassword />}
        />
        <Route
          path="/reset-password/:token"
          element={userData ? <Navigate to="/" /> : <ResetPassword />}
        />
        <Route
          path="/admin-verification"
          element={userData ? <Navigate to="/" /> : <AdminVerification />}
        />
        <Route path="/profile" element={<MyProfile />} />
        <Route path="/requests" element={<MyRequests />} />
        <Route path="/u/:userId" element={<PublicUserProfile />} />
        <Route path="/listing/:propertyId" element={<Listing />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />

        <Route
          path="/properties"
          element={
            userData?.type !== "user" ? <MyProperties /> : <Navigate to="/" />
          }
        />
        <Route
          path="/property/add"
          element={
            userData?.type !== "user" ? <AddProperty /> : <Navigate to="/" />
          }
        />
        <Route
          path="/property/:propertyId"
          element={
            userData?.type !== "user" ? <UDProperty /> : <Navigate to="/" />
          }
        />

        <Route
          path="/admin"
          element={
            userData?.type === "admin" ? <AdminPanel /> : <Navigate to="/" />
          }
        />
        <Route path="/admin-verification" element={<AdminVerification />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <>
      <Router>
        <AppContent />
      </Router>
      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;
