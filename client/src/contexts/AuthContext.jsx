import React, { createContext, useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../utils/api";

// minimal JWT decoder (no external deps)
function decodeToken(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    navigate("/login", { replace: true });
  }, [navigate]);

  // 1) On mount: verify existing token & fetch profile
  useEffect(() => {
    const checkAuth = async () => {
      const stored = localStorage.getItem("token");
      if (stored) {
        try {
          const profile = await authAPI.getProfile();
          setUser(profile);
          setIsAuthenticated(true);
          setToken(stored);
        } catch {
          localStorage.removeItem("token");
          setError("Your session has expired. Please login again.");
        }
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  // 2) Auto-logout when JWT expires
  useEffect(() => {
    if (!token) return;
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) {
      logout();
      return;
    }
    const msLeft = decoded.exp * 1000 - Date.now();
    if (msLeft <= 0) {
      logout();
      return;
    }
    const timeoutId = setTimeout(logout, msLeft);
    return () => clearTimeout(timeoutId);
  }, [token, logout]);

  // 3) Idle timeout: 15 minutes of inactivity
  useEffect(() => {
    if (!token) return;
    const idleLimit = 15 * 60 * 1000;
    let idleTimer;
    const resetIdle = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(logout, idleLimit);
    };
    ["mousemove", "keydown", "click", "touchstart"].forEach((evt) =>
      window.addEventListener(evt, resetIdle)
    );
    resetIdle();
    return () => {
      clearTimeout(idleTimer);
      ["mousemove", "keydown", "click", "touchstart"].forEach((evt) =>
        window.removeEventListener(evt, resetIdle)
      );
    };
  }, [token, logout]);

  // 4) Login
  const login = async (credentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await authAPI.login(credentials);
      if (data.status === "OK") {
        localStorage.setItem("token", data.token);
        setToken(data.token);

        const profile = await authAPI.getProfile();
        setUser(profile);
        setIsAuthenticated(true);
        navigate("/dashboard", { replace: true });
        return true;
      }
      throw new Error(data.message || "Login failed");
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 5) Register
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
        pin: userData.pin,
      });
      if (data.status === "success" || data.status === "OK") {
        return true;
      }
      throw new Error(data.message || "Registration failed");
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 6) Local profile update
  const updateProfile = async (profileData) => {
    setIsLoading(true);
    setError(null);
    try {
      setUser((prev) => ({ ...prev, ...profileData }));
      return true;
    } catch (err) {
      setError(err.message || "Failed to update profile");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        error,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
