import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Eye, EyeOff, Mail, Lock, Sparkles } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import PageTransition from "../components/PageTransition";

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [form, setForm] = useState({ email: "", password: "" });
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        const { data } = await api.post("/auth/login", form);
        const { token, user } = data.data;  // ← this is the only change needed
        login(user, token);
        toast.success("Welcome back!");
        navigate("/dashboard");
    } catch (err) {
        toast.error(err.response?.data?.message || "Login failed");
    } finally {
        setLoading(false);
    }
};

    return (
        <PageTransition>
            <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-10 relative overflow-hidden">
                {/* Background orbs */}
                <div className="absolute top-1/4 -left-32 w-96 h-96 bg-brand-amber/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-brand-amber/5 rounded-full blur-3xl pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    {/* Header */}
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
                            Welcome back
                        </motion.h1>
                        <motion.p
                            initial={{ y: -10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-brand-sub font-body mt-2"
                        >
                            Sign in to continue your journey
                        </motion.p>
                    </div>

                    {/* Card */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.25 }}
                        className="glass rounded-2xl p-8 border border-brand-border"
                    >
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Email */}
                            <div className="space-y-2">
                                <label className="text-sm font-body font-medium text-brand-sub">Email</label>
                                <div className="relative">
                                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-sub" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="you@example.com"
                                        required
                                        className="input-field pl-11"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <label className="text-sm font-body font-medium text-brand-sub">Password</label>
                                <div className="relative">
                                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-sub" />
                                    <input
                                        type={showPass ? "text" : "password"}
                                        name="password"
                                        value={form.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
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

                            <div className="text-right">
                                <Link to="/forgot-password" className="text-sm text-brand-amber hover:text-brand-gold transition-colors font-body">
                                    Forgot password?
                                </Link>
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
                                    "Sign In"
                                )}
                            </motion.button>
                        </form>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-center text-brand-sub font-body text-sm mt-6"
                    >
                        Don't have an account?{" "}
                        <Link to="/register" className="text-brand-amber hover:text-brand-gold transition-colors font-medium">
                            Sign up for free
                        </Link>
                    </motion.p>
                </motion.div>
            </div>
        </PageTransition>
    );
}