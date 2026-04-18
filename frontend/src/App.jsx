import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "react-hot-toast";

import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOtp from "./pages/VerifyOtp";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import PlanTrip from "./pages/PlanTrip";
import TripDetail from "./pages/TripDetail";
import Community from "./pages/Community";

// 🔹 This MUST stay inside Router
function AppRoutes() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-brand-dark">
      <Navbar />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/plan"
            element={
              <ProtectedRoute>
                <PlanTrip />
              </ProtectedRoute>
            }
          />

          <Route
            path="/trips/:id"
            element={
              <ProtectedRoute>
                <TripDetail />
              </ProtectedRoute>
            }
          />

          <Route path="/community" element={<Community />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#13131A",
            color: "#E8E8F0",
            border: "1px solid #1E1E2E",
            borderRadius: "12px",
            fontFamily: "'DM Sans', sans-serif",
          },
          success: {
            iconTheme: { primary: "#F5A623", secondary: "#0A0A0F" },
          },
          error: {
            iconTheme: { primary: "#ef4444", secondary: "#0A0A0F" },
          },
        }}
      />
    </div>
  );
}

// 🔹 Root App (ONLY ONE place for Router + Auth)
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}