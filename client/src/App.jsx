import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";

function ProtectedRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/signin" replace />;
}

function PublicRoute({ children }) {
  const { token } = useAuth();
  return token ? <Navigate to="/dashboard" replace /> : children;
}

function HomeRedirect() {
  const { token } = useAuth();
  return <Navigate to={token ? "/dashboard" : "/signin"} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeRedirect />} />
          <Route
            path="/signin"
            element={
              <PublicRoute>
                <AuthPage mode="signin" />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <AuthPage mode="signup" />
              </PublicRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<HomeRedirect />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
