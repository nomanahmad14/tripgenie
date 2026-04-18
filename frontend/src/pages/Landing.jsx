import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, Zap, Globe, Shield, ArrowRight, MapPin, Star } from "lucide-react";
import PageTransition from "../components/PageTransition";

const features = [
  {
    icon: Zap,
    title: "AI-Powered Itineraries",
    desc: "Generate complete day-by-day travel plans in seconds using advanced AI tailored to your preferences.",
  },
  {
    icon: Globe,
    title: "Smart Budget Planner",
    desc: "Get real-time cost breakdowns for transport, stay, food & local travel based on your budget type.",
  },
  {
    icon: Shield,
    title: "Travel Community",
    desc: "Share your adventures, discover hidden gems, and get inspired by fellow travellers worldwide.",
  },
];

const destinations = [
  { name: "Rajasthan", country: "India", emoji: "🏰" },
  { name: "Bali", country: "Indonesia", emoji: "🌴" },
  { name: "Paris", country: "France", emoji: "🗼" },
  { name: "Kyoto", country: "Japan", emoji: "⛩️" },
  { name: "Santorini", country: "Greece", emoji: "🌊" },
  { name: "New York", country: "USA", emoji: "🗽" },
];

const stats = [
  { value: "10K+", label: "Trips Generated" },
  { value: "150+", label: "Destinations" },
  { value: "98%", label: "Happy Travellers" },
];

export default function Landing() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
  };

  return (
    <PageTransition>
      <div className="overflow-hidden">
        {/* ── HERO ── */}
        <section
          ref={heroRef}
          className="relative min-h-screen flex items-center justify-center px-6 pt-24 pb-16"
        >
          {/* Animated background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-amber rounded-full blur-3xl opacity-15"
            />
            <motion.div
              animate={{ scale: [1.1, 1, 1.1], opacity: [0.1, 0.2, 0.1] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-500 rounded-full blur-3xl opacity-10"
            />
            {/* Grid pattern */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `linear-gradient(rgba(245,166,35,1) 1px, transparent 1px), linear-gradient(90deg, rgba(245,166,35,1) 1px, transparent 1px)`,
                backgroundSize: "60px 60px",
              }}
            />
          </div>

          <motion.div
            style={{ y: heroY, opacity: heroOpacity }}
            className="relative z-10 max-w-4xl mx-auto text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-amber mb-8"
            >
              <Sparkles size={14} className="text-brand-amber" />
              <span className="text-brand-amber font-body text-sm font-medium">
                AI-Powered Travel Planning
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display text-5xl md:text-7xl font-black text-brand-text leading-tight mb-6"
            >
              Your next adventure
              <br />
              <span className="gradient-text">starts here.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-brand-sub font-body text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              TripGenie uses AI to craft personalised itineraries, calculate smart budgets, and
              help you explore the world — effortlessly.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/register">
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-primary inline-flex items-center gap-2 text-base px-8 py-4 rounded-2xl"
                >
                  Start Planning Free
                  <ArrowRight size={18} />
                </motion.div>
              </Link>
              <Link to="/community">
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-ghost inline-flex items-center gap-2 text-base px-8 py-4 rounded-2xl"
                >
                  Explore Community
                </motion.div>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center justify-center gap-10 mt-16"
            >
              {stats.map(({ value, label }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className="text-center"
                >
                  <div className="font-display text-2xl font-black gradient-text">{value}</div>
                  <div className="text-brand-sub font-body text-xs mt-1">{label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Floating destination cards */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="absolute right-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-3"
          >
            {destinations.slice(0, 3).map(({ name, country, emoji }, i) => (
              <motion.div
                key={name}
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
                className="glass border border-brand-border/50 rounded-2xl px-4 py-3 flex items-center gap-3"
              >
                <span className="text-2xl">{emoji}</span>
                <div>
                  <div className="text-brand-text font-body text-sm font-medium">{name}</div>
                  <div className="text-brand-sub font-body text-xs">{country}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="absolute left-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-3"
          >
            {destinations.slice(3).map(({ name, country, emoji }, i) => (
              <motion.div
                key={name}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3.5 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.7 }}
                className="glass border border-brand-border/50 rounded-2xl px-4 py-3 flex items-center gap-3"
              >
                <span className="text-2xl">{emoji}</span>
                <div>
                  <div className="text-brand-text font-body text-sm font-medium">{name}</div>
                  <div className="text-brand-sub font-body text-xs">{country}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ── FEATURES ── */}
        <section className="py-24 px-6 relative">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <span className="text-brand-amber font-body text-sm font-medium tracking-widest uppercase">
                Why TripGenie
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-brand-text mt-3">
                Travel smarter, not harder
              </h2>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {features.map(({ icon: Icon, title, desc }) => (
                <motion.div
                  key={title}
                  variants={itemVariants}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="card group cursor-default transition-all duration-300 hover:border-brand-amber/30 hover:glow-amber"
                >
                  <div className="w-12 h-12 rounded-2xl bg-brand-amber/10 border border-brand-amber/20 flex items-center justify-center mb-5 group-hover:bg-brand-amber/20 transition-colors duration-300">
                    <Icon size={22} className="text-brand-amber" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-brand-text mb-3">{title}</h3>
                  <p className="text-brand-sub font-body text-sm leading-relaxed">{desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="py-24 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-radial from-brand-amber/5 via-transparent to-transparent pointer-events-none" />
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="text-brand-amber font-body text-sm font-medium tracking-widest uppercase">
                Simple Process
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-brand-text mt-3">
                Three steps to your dream trip
              </h2>
            </motion.div>

            <div className="space-y-6">
              {[
                { step: "01", title: "Tell us where you want to go", desc: "Enter your source, destination, travel dates, and number of people.", icon: MapPin },
                { step: "02", title: "Choose your style & budget", desc: "Pick low, medium, or high budget and transport preference — road, train, or flight.", icon: Star },
                { step: "03", title: "Get your AI itinerary", desc: "Receive a complete day-by-day plan with activities, locations, and budget breakdown.", icon: Sparkles },
              ].map(({ step, title, desc, icon: Icon }, i) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="flex items-start gap-6 glass rounded-2xl p-6 border border-brand-border hover:border-brand-amber/20 transition-colors duration-300"
                >
                  <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-brand-amber flex items-center justify-center">
                    <span className="font-mono font-bold text-brand-dark text-sm">{step}</span>
                  </div>
                  <div className="flex-1 pt-1">
                    <h3 className="font-display text-xl font-bold text-brand-text mb-2">{title}</h3>
                    <p className="text-brand-sub font-body text-sm leading-relaxed">{desc}</p>
                  </div>
                  <div className="hidden sm:flex w-10 h-10 rounded-xl bg-brand-muted items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-brand-amber" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-24 px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center glass rounded-3xl p-12 border border-brand-amber/20 relative overflow-hidden"
            style={{ boxShadow: "0 0 80px rgba(245,166,35,0.08)" }}
          >
            <div className="absolute inset-0 bg-gradient-radial from-brand-amber/8 via-transparent to-transparent pointer-events-none" />
            <div className="relative z-10">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="text-5xl mb-6"
              >
                ✈️
              </motion.div>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-brand-text mb-4">
                Ready to explore?
              </h2>
              <p className="text-brand-sub font-body text-lg mb-8">
                Join thousands of travellers using TripGenie to plan their perfect trips.
              </p>
              <Link to="/register">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-primary inline-flex items-center gap-2 text-base px-10 py-4 rounded-2xl"
                >
                  Get Started — It's Free
                  <ArrowRight size={18} />
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="border-t border-brand-border py-8 px-6">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-brand-amber flex items-center justify-center">
                <Sparkles size={14} className="text-brand-dark" />
              </div>
              <span className="font-display font-bold text-brand-text">TripGenie</span>
            </div>
            <p className="text-brand-sub font-body text-sm">
              © {new Date().getFullYear()} TripGenie. AI-powered travel planning.
            </p>
          </div>
        </footer>
      </div>
    </PageTransition>
  );
}