import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Lock, Eye, EyeOff } from "lucide-react";
import api from "../api/axios";
import PageTransition from "../components/PageTransition";

export default function ResetPassword() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const email = state?.email || "";
  const [form, setForm] = useState({ otp: "", newPassword: "", confirm: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirm) {
      return toast.error("Passwords do not match");
    }
    setLoading(true);
    try {
      await api.post("/auth/reset-password", {
        email,
        otp: form.otp,
        newPassword: form.newPassword,
      });
      toast.success("Password reset successfully!");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-10 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-96 h-96 bg-brand-amber/4 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
              className="w-16 h-16 rounded-2xl bg-brand-amber/10 border border-brand-amber/30 flex items-center justify-center mx-auto mb-4"
            >
              <Lock size={28} className="text-brand-amber" />
            </motion.div>
            <h1 className="font-display text-3xl font-bold text-brand-text">New password</h1>
            <p className="text-brand-sub font-body mt-2 text-sm">
              Enter the OTP from your email and your new password
            </p>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="glass rounded-2xl p-8 border border-brand-border"
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-body font-medium text-brand-sub">OTP Code</label>
                <input
                  type="text"
                  name="otp"
                  value={form.otp}
                  onChange={handleChange}
                  placeholder="Enter 6-digit OTP"
                  required
                  maxLength={6}
                  className="input-field font-mono tracking-widest text-center text-lg"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-body font-medium text-brand-sub">New Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-sub" />
                  <input
                    type={showPass ? "text" : "password"}
                    name="newPassword"
                    value={form.newPassword}
                    onChange={handleChange}
                    placeholder="Minimum 8 characters"
                    required
                    className="input-field pl-11 pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-sub hover:text-brand-amber transition-colors"
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-body font-medium text-brand-sub">Confirm Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-sub" />
                  <input
                    type={showPass ? "text" : "password"}
                    name="confirm"
                    value={form.confirm}
                    onChange={handleChange}
                    placeholder="Repeat new password"
                    required
                    className="input-field pl-11"
                  />
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {loading ? (
                  <motion.div
                    className="w-5 h-5 border-2 border-brand-dark/30 border-t-brand-dark rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                  />
                ) : (
                  "Reset Password"
                )}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </PageTransition>
  );
}