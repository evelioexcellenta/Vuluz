import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthProvider from "./contexts/AuthContext";
import TransactionProvider from "./contexts/TransactionContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { ROUTES } from "./constants/routes";

// Auth Pages
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

// App Pages
import Dashboard from "./pages/Dashboard/Dashboard";
import Transactions from "./pages/Transactions/Transactions";
import Transfer from "./pages/Transfer/Transfer";
import TopUp from "./pages/TopUp/TopUp";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile/Profile";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TransactionProvider>
          <Routes>
            {/* Auth Routes */}
            <Route path={ROUTES.LOGIN} element={<Login />} />
            <Route path={ROUTES.REGISTER} element={<Register />} />

            {/* Protected Routes */}
            <Route
              path={ROUTES.DASHBOARD}
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.TRANSACTIONS}
              element={
                <ProtectedRoute>
                  <Transactions />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.TRANSFER}
              element={
                <ProtectedRoute>
                  <Transfer />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.TOP_UP}
              element={
                <ProtectedRoute>
                  <TopUp />
                </ProtectedRoute>
              }
            />
            <Route path={ROUTES.PROFILE} element={<Profile />} />

            {/* Fallback Routes */}
            <Route
              path="/"
              element={<Navigate to={ROUTES.DASHBOARD} replace />}
            />
            <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
            <Route
              path="*"
              element={<Navigate to={ROUTES.NOT_FOUND} replace />}
            />
          </Routes>
        </TransactionProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
