import { Link, useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
import Button from "../UI/Button";
import VLogo from "../../assets/V.png";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate(ROUTES.LOGIN); // Arahkan ke login
    window.location.reload(); // Optional: muat ulang app biar context reset
  };

  const navLinks = [
    {
      to: ROUTES.DASHBOARD,
      label: "Dashboard",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      ),
    },
    {
      to: ROUTES.TRANSACTIONS,
      label: "Transactions",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
        />
      ),
    },
    {
      to: ROUTES.TRANSFER,
      label: "Transfer",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
        />
      ),
    },
    {
      to: ROUTES.TOP_UP,
      label: "Top Up",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
        />
      ),
    },
  ];

  return (
    <div className="fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col justify-between">
      {/* Top: Logo + Navigation */}
      <div>
        <div className="h-16 flex items-center px-6">
          <Link to={ROUTES.DASHBOARD} className="flex items-center">
            <div className="w-8 h-8 rounded-md bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center mr-2">
              <span className="text-white font-bold text-lg">V</span>
            </div>
            <span className="text-xl font-semibold text-gray-800">
              {APP_CONFIG.APP_NAME}
            </span>
          </Link>
        </div>

        <nav className="mt-6">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center px-6 py-3 text-sm font-medium ${
                location.pathname === link.to
                  ? "text-primary-600 bg-primary-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <svg
                className="w-5 h-5 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {link.icon}
              </svg>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Bottom: Profile & Signout */}
      {isAuthenticated && (
        <div className="mt-auto">
          <Link
            to={ROUTES.PROFILE}
            className={`flex items-center px-6 py-3 hover:bg-primary-50 transition-colors ${
              location.pathname === ROUTES.PROFILE ? "bg-primary-50" : ""
            }`}
          >
            <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.fullName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-sm font-semibold text-primary">
                  {user?.fullName?.charAt(0) || "U"}
                </span>
              )}
            </div>
            <p className="ml-3 text-sm font-medium text-gray-800">
              {user?.fullName || "User"}
            </p>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full text-left px-6 py-3 flex items-center text-gray-500 text-sm hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1"
              />
            </svg>
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
