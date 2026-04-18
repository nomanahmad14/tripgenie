import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  MapPin, Calendar, Users, Wallet, Car, Train, Plane,
  ArrowLeft, Clock, ChevronDown, ChevronUp, Trash2
} from "lucide-react";
import api from "../api/axios";
import PageTransition from "../components/PageTransition";
import Loader from "../components/Loader";

const transportIcon = { road: Car, train: Train, flight: Plane };

function BudgetBar({ label, amount, total, color }) {
  const pct = total > 0 ? Math.round((amount / total) * 100) : 0;
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-brand-sub font-body text-sm">{label}</span>
        <span className="text-brand-text font-body text-sm font-medium">₹{amount?.toLocaleString("en-IN")}</span>
      </div>
      <div className="h-2 bg-brand-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
      <div className="text-right text-brand-sub font-mono text-xs">{pct}%</div>
    </div>
  );
}

function DayCard({ day, index }) {
  const [open, setOpen] = useState(index === 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.07 }}
      className="card overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between group"
      >
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-brand-amber flex items-center justify-center flex-shrink-0">
            <span className="font-display font-black text-brand-dark text-sm">{day.day}</span>
          </div>
          <div className="text-left">
            <div className="font-display text-base font-bold text-brand-text group-hover:text-brand-amber transition-colors">
              {day.title}
            </div>
            <div className="text-brand-sub font-body text-xs mt-0.5">
              {day.activities?.length || 0} activities
            </div>
          </div>
        </div>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-brand-sub"
        >
          <ChevronDown size={18} />
        </motion.div>
      </button>

      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <div className="mt-5 space-y-3 border-t border-brand-border pt-5">
          {day.activities?.map((act, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex gap-4 group/act"
            >
              {/* Timeline dot */}
              <div className="flex flex-col items-center">
                <div className="w-2 h-2 rounded-full bg-brand-amber mt-1.5 flex-shrink-0" />
                {i < (day.activities.length - 1) && (
                  <div className="w-px flex-1 bg-brand-border mt-1 min-h-[20px]" />
                )}
              </div>
              <div className="flex-1 pb-3">
                <div className="flex items-center gap-2 mb-1">
                  <Clock size={12} className="text-brand-amber" />
                  <span className="text-brand-amber font-mono text-xs font-medium">{act.time}</span>
                </div>
                <p className="text-brand-text font-body text-sm leading-relaxed">{act.description}</p>
                {act.location && (
                  <div className="flex items-center gap-1 mt-1.5">
                    <MapPin size={11} className="text-brand-sub" />
                    <span className="text-brand-sub font-body text-xs">{act.location}</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function TripDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get(`/trips/${id}`);
        setTrip(data.data);
      } catch {
        toast.error("Trip not found");
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!window.confirm("Delete this trip permanently?")) return;
    setDeleting(true);
    try {
      await api.delete(`/trips/${id}`);
      toast.success("Trip deleted");
      navigate("/dashboard");
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center pt-20">
      <Loader text="Loading your itinerary..." />
    </div>
  );

  if (!trip) return null;

  const TransIcon = transportIcon[trip.transport] || Car;
  const total = trip.budget?.total || 0;
  const breakdown = trip.budget?.breakdown || {};

  const budgetBars = [
    { label: "Stay", amount: breakdown.stay, color: "bg-blue-400" },
    { label: "Food", amount: breakdown.food, color: "bg-green-400" },
    { label: "Travel", amount: breakdown.travel, color: "bg-brand-amber" },
    { label: "Local", amount: breakdown.local, color: "bg-purple-400" },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Back */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6"
          >
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 text-brand-sub hover:text-brand-amber transition-colors font-body text-sm"
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </Link>
          </motion.div>

          {/* Hero Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="card relative overflow-hidden mb-6"
            style={{ boxShadow: "0 0 60px rgba(245,166,35,0.06)" }}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-amber via-brand-gold to-brand-amber" />
            <div className="absolute top-0 right-0 w-48 h-48 bg-brand-amber/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {trip.source && (
                      <>
                        <span className="text-brand-sub font-body text-sm">{trip.source}</span>
                        <ArrowLeft size={12} className="text-brand-sub rotate-180" />
                      </>
                    )}
                    <span className="text-brand-amber font-body text-sm font-medium">{trip.destination}</span>
                  </div>
                  <h1 className="font-display text-3xl md:text-4xl font-black text-brand-text">
                    {trip.destination}
                    <br />
                    <span className="gradient-text">Itinerary</span>
                  </h1>
                </div>

                <motion.button
                  onClick={handleDelete}
                  disabled={deleting}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all font-body text-sm"
                >
                  {deleting ? (
                    <motion.div
                      className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                    />
                  ) : (
                    <Trash2 size={14} />
                  )}
                  Delete
                </motion.button>
              </div>

              {/* Meta chips */}
              <div className="flex flex-wrap gap-2 mt-5">
                {[
                  { icon: Calendar, label: `${trip.days} days` },
                  { icon: Users, label: `${trip.people} ${trip.people === 1 ? "person" : "people"}` },
                  { icon: TransIcon, label: trip.transport },
                  { icon: Wallet, label: trip.budgetType },
                ].map(({ icon: Icon, label }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-amber text-brand-amber font-body text-xs font-medium capitalize"
                  >
                    <Icon size={12} />
                    {label}
                  </span>
                ))}
              </div>

              {/* Preferences */}
              {trip.preferences?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {trip.preferences.map((p) => (
                    <span
                      key={p}
                      className="px-2 py-1 rounded-lg bg-brand-muted text-brand-sub font-body text-xs capitalize"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Budget Card */}
          {total > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card mb-6"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display text-xl font-bold text-brand-text">Budget Breakdown</h2>
                <div className="text-right">
                  <div className="text-brand-sub font-body text-xs">Total</div>
                  <div className="font-display text-2xl font-black gradient-text">
                    ₹{total.toLocaleString("en-IN")}
                  </div>
                  {trip.budget?.distance && (
                    <div className="text-brand-sub font-body text-xs">
                      ~{Math.round(trip.budget.distance)} km
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                {budgetBars.filter(b => b.amount > 0).map((bar) => (
                  <BudgetBar key={bar.label} {...bar} total={total} />
                ))}
              </div>
            </motion.div>
          )}

          {/* Itinerary */}
          <div className="space-y-3">
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="font-display text-2xl font-bold text-brand-text mb-4"
            >
              Day-by-Day Plan
            </motion.h2>
            {trip.itinerary?.map((day, i) => (
              <DayCard key={day.day} day={day} index={i} />
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}