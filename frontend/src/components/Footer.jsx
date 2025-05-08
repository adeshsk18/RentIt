import { Link } from "react-router-dom";
import { Building2, Home, Mail, ShieldPlus, User } from "lucide-react";
import useAuthStore from "../stores/useAuthStore";

const Footer = () => {
  const { userData } = useAuthStore();
  const isAuthenticated = !!userData;
  const userType = userData?.type;

  const getQuickLinks = () => {
    const links = [
      {
        title: "Home",
        path: "/",
        icon: <Home className="h-5 w-5" />,
      },
    ];

    if (isAuthenticated) {
      if (userType !== "user") {
        links.push({
          title: "My Properties",
          path: "/properties",
          icon: <Building2 className="h-5 w-5" />,
        });
      }
      links.push({
        title: "My Requests",
        path: "/requests",
        icon: <Mail className="h-5 w-5" />,
      });
      if (userType === "admin") {
        links.push({
          title: "Admin Panel",
          path: "/admin",
          icon: <ShieldPlus className="h-5 w-5" />,
        });
      }
      links.push({
        title: "My Profile",
        path: "/profile",
        icon: <User className="h-5 w-5" />,
      });
    }

    return links;
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">RentIt</h3>
            <p className="text-sm">
              Your trusted platform for property seekers and owners. Find your dream rental home or list your property with us.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2">
              {getQuickLinks().map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="flex items-center gap-2 text-sm hover:text-white transition-colors"
                  >
                    {link.icon}
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Contact Us</h3>
            <ul className="space-y-2 text-sm">
              <li>Email: support@rentit.com</li>
              <li>Phone: +91 1234567890</li>
              <li>Address: 123 Rental Street, City, State</li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-gray-800 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} RentIt. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 