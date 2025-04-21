import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { authAPI, mockAPI } from "../utils/api";

// Create the auth context
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for existing auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          const data = await authAPI.getProfile();
          setUser(data); // dari backend
          setIsAuthenticated(true);
        } catch (err) {
          console.error("Auth verification failed", err);
          // Clear invalid token
          localStorage.removeItem("token");
          setError("Your session has expired. Please login again.");
        }
      }

      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await authAPI.login(credentials);

      if (data.status === "OK") {
        localStorage.setItem("token", data.token);
        const profile = await authAPI.getProfile();
        setUser(profile);
        setIsAuthenticated(true);
        // setUser({ email: credentials.email });
        return true;
      } else {
        throw new Error(data.message || "Login failed.");
      }
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await authAPI.register({
        fullName: userData.name,
        userName: userData.userName,
        gender: userData.gender,
        email: userData.email,
        password: userData.password,
      });

      if (data.status === "success" || data.status === "OK") {
        return true;
      } else {
        throw new Error(data.message || "Registration failed.");
      }
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    setIsLoading(true);
    setError(null);

    try {
      // In a real app, send profile data to server
      // For demo, we'll just update local state
      setUser((prev) => ({ ...prev, ...profileData }));
      return true;
    } catch (err) {
      setError(err.message || "Failed to update profile.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Context value
  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
