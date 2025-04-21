import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { ROUTES } from "../../constants/routes";
import useAuth from "../../hooks/useAuth";
import Button from "../UI/Button";

const Navbar = ({ appName = "Vuluz" }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  const navLinks = [
    { to: ROUTES.DASHBOARD, label: "Dashboard" },
    { to: ROUTES.TRANSACTIONS, label: "Transactions" },
    { to: ROUTES.TRANSFER, label: "Transfer" },
    { to: ROUTES.TOP_UP, label: "Top Up" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-sm px-6">
      <div className="w-full mx-auto flex justify-between items-center h-16">
        {/* Logo */}
        <Link
          to={isAuthenticated ? ROUTES.DASHBOARD : ROUTES.LOGIN}
          className="flex items-center"
        >
          <div className="w-8 h-8 rounded-md bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center mr-2">
            <span className="text-white font-bold text-lg">V</span>
          </div>
          <span className="text-xl font-semibold text-gray-800">{appName}</span>
        </Link>

        {/* Right side: Profile & Sign Out */}
        <div className="hidden sm:flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-gray-700">{user?.fullName || "User"}</span>
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.fullName} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-sm font-medium text-gray-600">
                    {user?.fullName?.charAt(0) || "U"}
                  </span>
                )}
              </div>
              <Button variant="outline" size="sm" onClick={logout}>
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Link to={ROUTES.LOGIN}>
                <Button variant="outline" size="sm">Log in</Button>
              </Link>
              <Link to={ROUTES.REGISTER}>
                <Button variant="primary" size="sm">Register</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="sm:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-md text-gray-500 hover:bg-gray-100"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden px-4 pb-4">
          {isAuthenticated ? (
            <>
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block py-2 text-sm ${
                    isActive(link.to)
                      ? "text-primary-600 font-semibold"
                      : "text-gray-600 hover:text-primary-500"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-4 flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.fullName} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-sm font-medium text-gray-600">
                      {user?.name?.charAt(0) || "U"}
                    </span>
                  )}
                </div>
                <span className="text-sm text-gray-700">{user?.fullName || "User"}</span>
              </div>
              <Button variant="outline" size="sm" onClick={logout} className="mt-2 w-full">
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Link to={ROUTES.LOGIN} onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="outline" size="sm" className="w-full my-1">Log in</Button>
              </Link>
              <Link to={ROUTES.REGISTER} onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="primary" size="sm" className="w-full my-1">Register</Button>
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

Navbar.propTypes = {
  appName: PropTypes.string,
};

export default Navbar;
