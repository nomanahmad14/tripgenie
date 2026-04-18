import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Mail } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import PageTransition from "../components/PageTransition";

export default function VerifyOtp() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const email = state?.email || "";
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const inputs = useRef([]);

  useEffect(() => {
    if (!email) navigate("/register");
    inputs.current[0]?.focus();
  }, [email, navigate]);

  const handleChange = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) inputs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      inputs.current[i - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      inputs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) return toast.error("Enter the full 6-digit OTP");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/verify-otp", { email, otp: code });
      login(data.data.user, data.data.token);
      toast.success("Email verified! Welcome aboard 🎉");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await api.post("/auth/resend-otp", { email });
      toast.success("OTP resent!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend");
    } finally {
      setResending(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-10 relative overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-amber/5 rounded-full blur-3xl pointer-events-none" />

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
              <Mail size={28} className="text-brand-amber" />
            </motion.div>
            <h1 className="font-display text-3xl font-bold text-brand-text">Check your email</h1>
            <p className="text-brand-sub font-body mt-2 text-sm">
              We sent a 6-digit code to{" "}
              <span className="text-brand-amber font-medium">{email}</span>
            </p>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="glass rounded-2xl p-8 border border-brand-border"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* OTP Inputs */}
              <div className="flex gap-3 justify-center" onPaste={handlePaste}>
                {otp.map((digit, i) => (
                  <motion.input
                    key={i}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 + i * 0.06 }}
                    ref={(el) => (inputs.current[i] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    className={`w-12 h-14 text-center text-xl font-mono font-bold rounded-xl border bg-brand-card transition-all duration-200 focus:outline-none ${
                      digit
                        ? "border-brand-amber text-brand-amber"
                        : "border-brand-border text-brand-text focus:border-brand-amber"
                    }`}
                  />
                ))}
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
                  "Verify Email"
                )}
              </motion.button>
            </form>

            <p className="text-center text-brand-sub font-body text-sm mt-5">
              Didn't receive it?{" "}
              <button
                onClick={handleResend}
                disabled={resending}
                className="text-brand-amber hover:text-brand-gold transition-colors font-medium disabled:opacity-50"
              >
                {resending ? "Resending..." : "Resend OTP"}
              </button>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </PageTransition>
  );
}