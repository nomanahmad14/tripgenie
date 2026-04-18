import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  MapPin, Calendar, Users, Wallet, Train, Car, Plane,
  ArrowRight, ArrowLeft, Sparkles, Check, Loader2
} from "lucide-react";
import api from "../api/axios";
import PageTransition from "../components/PageTransition";

const preferences = [
  { id: "adventure", label: "Adventure", emoji: "🧗" },
  { id: "nature", label: "Nature", emoji: "🌿" },
  { id: "culture", label: "Culture", emoji: "🏛️" },
  { id: "food", label: "Food", emoji: "🍜" },
  { id: "beaches", label: "Beaches", emoji: "🏖️" },
  { id: "mountains", label: "Mountains", emoji: "⛰️" },
  { id: "history", label: "History", emoji: "📜" },
  { id: "nightlife", label: "Nightlife", emoji: "🎉" },
  { id: "shopping", label: "Shopping", emoji: "🛍️" },
  { id: "wellness", label: "Wellness", emoji: "🧘" },
];

const budgetTypes = [
  { id: "low", label: "Budget", desc: "Hostels, local food, buses", emoji: "💰", color: "green" },
  { id: "medium", label: "Moderate", desc: "Hotels, restaurants, trains", emoji: "💳", color: "blue" },
  { id: "high", label: "Luxury", desc: "Resorts, fine dining, flights", emoji: "💎", color: "amber" },
];

const transportIcons = { road: Car, train: Train, flight: Plane };

export default function PlanTrip() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    source: "",
    destination: "",
    days: 3,
    people: 2,
    budgetType: "",
    transport: "",
    preferences: [],
  });
  const [transportOptions, setTransportOptions] = useState(null);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [generating, setGenerating] = useState(false);

  const update = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const togglePref = (id) => {
    setForm((f) => ({
      ...f,
      preferences: f.preferences.includes(id)
        ? f.preferences.filter((p) => p !== id)
        : [...f.preferences, id],
    }));
  };

  // Step 1 → 2: fetch transport options
  const handleNext = async () => {
    if (step === 1) {
      if (!form.source.trim() || !form.destination.trim()) {
        return toast.error("Enter both source and destination");
      }
      if (form.source.toLowerCase() === form.destination.toLowerCase()) {
        return toast.error("Source and destination can't be the same");
      }
      setLoadingOptions(true);
      try {
        const { data } = await api.post("/trips/options", {
          source: form.source,
          destination: form.destination,
        });
        setTransportOptions(data);
        setStep(2);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to get travel options");
      } finally {
        setLoadingOptions(false);
      }
    } else if (step === 2) {
      if (!form.budgetType) return toast.error("Select a budget type");
      if (!form.transport) return toast.error("Select a transport mode");
      setStep(3);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const { data } = await api.post("/trips/generate", {
        ...form,
        days: Number(form.days),
        people: Number(form.people),
      });
      toast.success("Trip generated! 🎉");
      navigate(`/trips/${data.data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to generate trip");
    } finally {
      setGenerating(false);
    }
  };

  const stepLabels = ["Destination", "Transport & Budget", "Preferences"];

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-16 px-6 relative overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-brand-amber/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-brand-amber/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-amber mb-4">
              <Sparkles size={14} className="text-brand-amber" />
              <span className="text-brand-amber font-body text-sm">AI Trip Planner</span>
            </div>
            <h1 className="font-display text-4xl font-black text-brand-text">
              Plan your <span className="gradient-text">perfect trip</span>
            </h1>
          </motion.div>

          {/* Step Progress */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex items-center justify-center gap-0 mb-10"
          >
            {stepLabels.map((label, i) => {
              const num = i + 1;
              const done = step > num;
              const active = step === num;
              return (
                <div key={label} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <motion.div
                      animate={{
                        background: done
                          ? "#F5A623"
                          : active
                          ? "rgba(245,166,35,0.15)"
                          : "rgba(30,30,46,1)",
                        borderColor: done || active ? "#F5A623" : "#1E1E2E",
                      }}
                      className="w-8 h-8 rounded-full border-2 flex items-center justify-center"
                    >
                      {done ? (
                        <Check size={14} className="text-brand-dark" />
                      ) : (
                        <span
                          className={`font-mono text-xs font-bold ${
                            active ? "text-brand-amber" : "text-brand-sub"
                          }`}
                        >
                          {num}
                        </span>
                      )}
                    </motion.div>
                    <span
                      className={`font-body text-xs mt-1.5 ${
                        active ? "text-brand-amber" : "text-brand-sub"
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                  {i < stepLabels.length - 1 && (
                    <div
                      className={`h-px w-16 sm:w-24 mb-5 mx-2 transition-all duration-500 ${
                        step > num ? "bg-brand-amber" : "bg-brand-border"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </motion.div>

          {/* Card */}
          <motion.div className="glass rounded-2xl border border-brand-border overflow-hidden">
            <AnimatePresence mode="wait">
              {/* ── STEP 1: Destination ── */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.35 }}
                  className="p-8 space-y-6"
                >
                  <h2 className="font-display text-2xl font-bold text-brand-text">
                    Where are you headed?
                  </h2>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-body font-medium text-brand-sub">From</label>
                      <div className="relative">
                        <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-sub" />
                        <input
                          type="text"
                          value={form.source}
                          onChange={(e) => update("source", e.target.value)}
                          placeholder="City or place you're departing from"
                          className="input-field pl-11"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-body font-medium text-brand-sub">To</label>
                      <div className="relative">
                        <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-amber" />
                        <input
                          type="text"
                          value={form.destination}
                          onChange={(e) => update("destination", e.target.value)}
                          placeholder="Your dream destination"
                          className="input-field pl-11"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Days + People */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-body font-medium text-brand-sub flex items-center gap-2">
                        <Calendar size={13} /> Days
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => update("days", Math.max(1, form.days - 1))}
                          className="w-10 h-10 rounded-xl border border-brand-border text-brand-sub hover:border-brand-amber hover:text-brand-amber transition-all flex items-center justify-center font-bold"
                        >−</button>
                        <span className="flex-1 text-center font-display text-xl font-bold text-brand-text">
                          {form.days}
                        </span>
                        <button
                          onClick={() => update("days", Math.min(30, form.days + 1))}
                          className="w-10 h-10 rounded-xl border border-brand-border text-brand-sub hover:border-brand-amber hover:text-brand-amber transition-all flex items-center justify-center font-bold"
                        >+</button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-body font-medium text-brand-sub flex items-center gap-2">
                        <Users size={13} /> People
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => update("people", Math.max(1, form.people - 1))}
                          className="w-10 h-10 rounded-xl border border-brand-border text-brand-sub hover:border-brand-amber hover:text-brand-amber transition-all flex items-center justify-center font-bold"
                        >−</button>
                        <span className="flex-1 text-center font-display text-xl font-bold text-brand-text">
                          {form.people}
                        </span>
                        <button
                          onClick={() => update("people", Math.min(10, form.people + 1))}
                          className="w-10 h-10 rounded-xl border border-brand-border text-brand-sub hover:border-brand-amber hover:text-brand-amber transition-all flex items-center justify-center font-bold"
                        >+</button>
                      </div>
                    </div>
                  </div>

                  <motion.button
                    onClick={handleNext}
                    disabled={loadingOptions}
                    whileHover={{ scale: loadingOptions ? 1 : 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-primary w-full flex items-center justify-center gap-2"
                  >
                    {loadingOptions ? (
                      <>
                        <motion.div
                          className="w-5 h-5 border-2 border-brand-dark/30 border-t-brand-dark rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                        />
                        Calculating routes...
                      </>
                    ) : (
                      <>
                        Continue <ArrowRight size={16} />
                      </>
                    )}
                  </motion.button>
                </motion.div>
              )}

              {/* ── STEP 2: Transport & Budget ── */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.35 }}
                  className="p-8 space-y-7"
                >
                  <div>
                    <h2 className="font-display text-2xl font-bold text-brand-text">
                      Transport & Budget
                    </h2>
                    {transportOptions && (
                      <p className="text-brand-sub font-body text-sm mt-1">
                        Distance:{" "}
                        <span className="text-brand-amber font-medium">
                          ~{Math.round(transportOptions.distance)} km
                        </span>
                        {transportOptions.recommended && (
                          <> · Recommended: <span className="text-brand-amber font-medium capitalize">{transportOptions.recommended}</span></>
                        )}
                      </p>
                    )}
                  </div>

                  {/* Transport Options */}
                  <div className="space-y-2">
                    <label className="text-sm font-body font-medium text-brand-sub">Transport Mode</label>
                    <div className="grid grid-cols-3 gap-3">
                      {(transportOptions?.allOptions || ["road", "train", "flight"]).map((opt) => {
                        const Icon = transportIcons[opt] || Car;
                        const active = form.transport === opt;
                        const isRec = transportOptions?.recommended === opt;
                        return (
                          <motion.button
                            key={opt}
                            onClick={() => update("transport", opt)}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all duration-300 ${
                              active
                                ? "border-brand-amber bg-brand-amber/10"
                                : "border-brand-border hover:border-brand-amber/50"
                            }`}
                          >
                            {isRec && (
                              <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-xs bg-brand-amber text-brand-dark px-2 py-0.5 rounded-full font-body font-medium">
                                Best
                              </span>
                            )}
                            <Icon size={22} className={active ? "text-brand-amber" : "text-brand-sub"} />
                            <span className={`font-body text-xs font-medium capitalize ${active ? "text-brand-amber" : "text-brand-sub"}`}>
                              {opt}
                            </span>
                            {active && (
                              <motion.div
                                layoutId="transport-ring"
                                className="absolute inset-0 rounded-2xl border-2 border-brand-amber"
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                              />
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Budget Types */}
                  <div className="space-y-2">
                    <label className="text-sm font-body font-medium text-brand-sub">Budget Type</label>
                    <div className="space-y-3">
                      {budgetTypes.map(({ id, label, desc, emoji }) => {
                        const active = form.budgetType === id;
                        return (
                          <motion.button
                            key={id}
                            onClick={() => update("budgetType", id)}
                            whileHover={{ x: 4 }}
                            whileTap={{ scale: 0.99 }}
                            className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 text-left ${
                              active
                                ? "border-brand-amber bg-brand-amber/10"
                                : "border-brand-border hover:border-brand-amber/30"
                            }`}
                          >
                            <span className="text-2xl">{emoji}</span>
                            <div className="flex-1">
                              <div className={`font-body font-semibold text-sm ${active ? "text-brand-amber" : "text-brand-text"}`}>
                                {label}
                              </div>
                              <div className="text-brand-sub font-body text-xs mt-0.5">{desc}</div>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                              active ? "border-brand-amber bg-brand-amber" : "border-brand-border"
                            }`}>
                              {active && <Check size={11} className="text-brand-dark" />}
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep(1)}
                      className="btn-ghost flex items-center gap-2"
                    >
                      <ArrowLeft size={16} /> Back
                    </button>
                    <motion.button
                      onClick={handleNext}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="btn-primary flex-1 flex items-center justify-center gap-2"
                    >
                      Continue <ArrowRight size={16} />
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* ── STEP 3: Preferences ── */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.35 }}
                  className="p-8 space-y-6"
                >
                  <div>
                    <h2 className="font-display text-2xl font-bold text-brand-text">
                      Your travel style
                    </h2>
                    <p className="text-brand-sub font-body text-sm mt-1">
                      Pick what you love — optional but helps a lot
                    </p>
                  </div>

                  {/* Trip Summary */}
                  <div className="glass-amber rounded-2xl p-4 grid grid-cols-2 gap-3">
                    {[
                      { label: "From", val: form.source },
                      { label: "To", val: form.destination },
                      { label: "Days", val: `${form.days} days` },
                      { label: "People", val: `${form.people} traveller${form.people > 1 ? "s" : ""}` },
                      { label: "Budget", val: form.budgetType },
                      { label: "Transport", val: form.transport },
                    ].map(({ label, val }) => (
                      <div key={label}>
                        <div className="text-brand-sub font-body text-xs">{label}</div>
                        <div className="text-brand-text font-body text-sm font-medium capitalize">{val}</div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {preferences.map(({ id, label, emoji }) => {
                      const selected = form.preferences.includes(id);
                      return (
                        <motion.button
                          key={id}
                          onClick={() => togglePref(id)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-body text-sm transition-all duration-200 ${
                            selected
                              ? "border-brand-amber bg-brand-amber/15 text-brand-amber"
                              : "border-brand-border text-brand-sub hover:border-brand-amber/50"
                          }`}
                        >
                          <span>{emoji}</span>
                          {label}
                          {selected && <Check size={12} />}
                        </motion.button>
                      );
                    })}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep(2)}
                      className="btn-ghost flex items-center gap-2"
                    >
                      <ArrowLeft size={16} /> Back
                    </button>
                    <motion.button
                      onClick={handleGenerate}
                      disabled={generating}
                      whileHover={{ scale: generating ? 1 : 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="btn-primary flex-1 flex items-center justify-center gap-2"
                    >
                      {generating ? (
                        <>
                          <motion.div
                            className="w-5 h-5 border-2 border-brand-dark/30 border-t-brand-dark rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                          />
                          Generating your trip...
                        </>
                      ) : (
                        <>
                          <Sparkles size={16} />
                          Generate Itinerary
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}