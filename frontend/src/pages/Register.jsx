import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Eye, EyeOff, Mail, Lock, User, Sparkles } from "lucide-react";
import api from "../api/axios";
import PageTransition from "../components/PageTransition";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/register", form);
      toast.success("OTP sent to your email!");
      navigate("/verify-otp", { state: { email: form.email } });
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: "name", type: "text", placeholder: "Your full name", label: "Full Name", icon: User },
    { name: "email", type: "email", placeholder: "you@example.com", label: "Email", icon: Mail },
    { name: "password", type: showPass ? "text" : "password", placeholder: "Min 8 characters", label: "Password", icon: Lock, toggle: true },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-10 relative overflow-hidden">
        <div className="absolute top-1/3 -left-40 w-96 h-96 bg-brand-amber/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/3 -right-40 w-96 h-96 bg-brand-amber/5 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 mb-4"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-amber flex items-center justify-center">
                <Sparkles size={20} className="text-brand-dark" />
              </div>
              <span className="font-display text-2xl font-bold text-brand-text">TripGenie</span>
            </motion.div>
            <motion.h1
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="font-display text-3xl font-bold text-brand-text"
            >
              Start exploring
            </motion.h1>
            <motion.p
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-brand-sub font-body mt-2"
            >
              Create your free account today
            </motion.p>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="glass rounded-2xl p-8 border border-brand-border"
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              {fields.map(({ name, type, placeholder, label, icon: Icon, toggle }, i) => (
                <motion.div
                  key={name}
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className="space-y-2"
                >
                  <label className="text-sm font-body font-medium text-brand-sub">{label}</label>
                  <div className="relative">
                    <Icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-sub" />
                    <input
                      type={type}
                      name={name}
                      value={form[name]}
                      onChange={handleChange}
                      placeholder={placeholder}
                      required
                      className="input-field pl-11 pr-11"
                    />
                    {toggle && (
                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-sub hover:text-brand-amber transition-colors"
                      >
                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <motion.div
                    className="w-5 h-5 border-2 border-brand-dark/30 border-t-brand-dark rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                  />
                ) : (
                  "Create Account"
                )}
              </motion.button>
            </form>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-brand-sub font-body text-sm mt-6"
          >
            Already have an account?{" "}
            <Link to="/login" className="text-brand-amber hover:text-brand-gold transition-colors font-medium">
              Sign in
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </PageTransition>
  );
}