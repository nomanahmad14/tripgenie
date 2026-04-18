import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { Map, Compass, Users, Menu, X, LogOut, Sparkles } from "lucide-react";

const navLinks = [
  { to: "/dashboard", label: "My Trips", icon: Map },
  { to: "/plan", label: "Plan Trip", icon: Compass },
  { to: "/community", label: "Community", icon: Users },
];

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "glass border-b border-brand-border/50 py-3" : "py-5"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2 group">
          <motion.div
            whileHover={{ rotate: 15, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="w-9 h-9 rounded-xl bg-brand-amber flex items-center justify-center"
          >
            <Sparkles size={18} className="text-brand-dark" />
          </motion.div>
          <span className="font-display text-xl font-bold text-brand-text group-hover:text-brand-amber transition-colors">
            TripGenie
          </span>
        </Link>

        {/* Desktop Links */}
        {isAuthenticated && (
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label, icon: Icon }) => {
              const active = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-body font-medium transition-all duration-300 ${
                    active
                      ? "text-brand-amber"
                      : "text-brand-sub hover:text-brand-text"
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-brand-amber/10 rounded-xl border border-brand-amber/20"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <Icon size={15} className="relative z-10" />
                  <span className="relative z-10">{label}</span>
                </Link>
              );
            })}
          </div>
        )}

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl glass-amber">
                <div className="w-7 h-7 rounded-lg bg-brand-amber flex items-center justify-center">
                  <span className="text-brand-dark font-display font-bold text-sm">
                    {user?.name?.[0]?.toUpperCase() || "U"}
                  </span>
                </div>
                <span className="text-brand-text text-sm font-body">{user?.name}</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-brand-border text-brand-sub hover:border-red-500/50 hover:text-red-400 transition-all duration-300 text-sm font-body"
              >
                <LogOut size={14} />
                Logout
              </motion.button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost text-sm py-2 px-5">Login</Link>
              <Link to="/register" className="btn-primary text-sm py-2 px-5">Get Started</Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-brand-sub hover:text-brand-amber transition-colors"
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden glass border-t border-brand-border/50 overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  {navLinks.map(({ to, label, icon: Icon }) => (
                    <Link
                      key={to}
                      to={to}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-brand-sub hover:text-brand-amber hover:bg-brand-amber/5 transition-all duration-200 font-body"
                    >
                      <Icon size={16} />
                      {label}
                    </Link>
                  ))}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all duration-200 font-body mt-2"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-ghost text-center">Login</Link>
                  <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-primary text-center mt-1">Get Started</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}