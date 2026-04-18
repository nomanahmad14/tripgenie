import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  MapPin, Search, Plus, Trash2, Calendar, ChevronLeft,
  ChevronRight, ArrowUpDown, Compass
} from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import PageTransition from "../components/PageTransition";
import Loader from "../components/Loader";

function TripCard({ trip, onDelete, index }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm(`Delete trip to ${trip.destination}?`)) return;
    setDeleting(true);
    try {
      await api.delete(`/trips/${trip._id}`);
      toast.success("Trip deleted");
      onDelete(trip._id);
    } catch {
      toast.error("Failed to delete trip");
    } finally {
      setDeleting(false);
    }
  };

  const bg = [
    "from-orange-500/20 to-amber-500/10",
    "from-blue-500/20 to-cyan-500/10",
    "from-purple-500/20 to-pink-500/10",
    "from-green-500/20 to-teal-500/10",
    "from-red-500/20 to-orange-500/10",
  ][index % 5];

  const emojis = ["🏖️", "🏔️", "🌆", "🗺️", "🌿", "🏛️", "🌅", "🎭"];
  const emoji = emojis[trip.destination.charCodeAt(0) % emojis.length];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
    >
      <Link to={`/trips/${trip._id}`} className="block">
        <div className="card group hover:border-brand-amber/30 transition-all duration-300 relative overflow-hidden">
          {/* gradient strip */}
          <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${bg}`} />

          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${bg} flex items-center justify-center text-2xl`}>
                {emoji}
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-brand-text group-hover:text-brand-amber transition-colors">
                  {trip.destination}
                </h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className="flex items-center gap-1 text-brand-sub font-body text-xs">
                    <Calendar size={11} />
                    {trip.days} day{trip.days !== 1 ? "s" : ""}
                  </span>
                  <span className="text-brand-border">•</span>
                  <span className="text-brand-sub font-body text-xs">
                    {new Date(trip.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric"
                    })}
                  </span>
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleDelete}
              disabled={deleting}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-xl hover:bg-red-500/10 text-brand-sub hover:text-red-400"
            >
              {deleting ? (
                <motion.div
                  className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                />
              ) : (
                <Trash2 size={15} />
              )}
            </motion.button>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-1 text-brand-amber font-body text-xs font-medium">
              <MapPin size={11} />
              View Itinerary
            </div>
            <div className="text-brand-sub font-mono text-xs">
              #{trip._id.slice(-6).toUpperCase()}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const limit = 9;

  const fetchTrips = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/trips/all", {
        params: { page, limit, search, sort },
      });
      setTrips(data.trips);
      setPagination(data.pagination);
    } catch {
      toast.error("Failed to load trips");
    } finally {
      setLoading(false);
    }
  }, [page, search, sort]);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  // Debounce search
  useEffect(() => {
    setPage(1);
  }, [search, sort]);

  const handleDelete = (id) => setTrips((prev) => prev.filter((t) => t._id !== id));

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10"
          >
            <div>
              <p className="text-brand-sub font-body text-sm mb-1">Welcome back,</p>
              <h1 className="font-display text-4xl font-black text-brand-text">
                {user?.name?.split(" ")[0]}'s{" "}
                <span className="gradient-text">Trips</span>
              </h1>
            </div>
            <Link to="/plan">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="btn-primary inline-flex items-center gap-2"
              >
                <Plus size={16} />
                Plan New Trip
              </motion.div>
            </Link>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex flex-col sm:flex-row gap-3 mb-8"
          >
            <div className="relative flex-1">
              <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-sub" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search destinations..."
                className="input-field pl-11"
              />
            </div>
            <button
              onClick={() => setSort(sort === "newest" ? "oldest" : "newest")}
              className="flex items-center gap-2 px-4 py-3 rounded-xl border border-brand-border text-brand-sub hover:border-brand-amber hover:text-brand-amber transition-all duration-300 font-body text-sm"
            >
              <ArrowUpDown size={15} />
              {sort === "newest" ? "Newest First" : "Oldest First"}
            </button>
          </motion.div>

          {/* Grid */}
          {loading ? (
            <Loader text="Fetching your trips..." />
          ) : trips.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-24"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="text-7xl mb-6"
              >
                🗺️
              </motion.div>
              <h3 className="font-display text-2xl font-bold text-brand-text mb-3">
                {search ? "No trips found" : "No trips yet"}
              </h3>
              <p className="text-brand-sub font-body mb-8">
                {search
                  ? `No trips matching "${search}"`
                  : "Your adventure awaits — plan your first trip!"}
              </p>
              {!search && (
                <Link to="/plan">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="btn-primary inline-flex items-center gap-2"
                  >
                    <Compass size={16} />
                    Plan Your First Trip
                  </motion.div>
                </Link>
              )}
            </motion.div>
          ) : (
            <>
              <AnimatePresence mode="popLayout">
                <motion.div
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                >
                  {trips.map((trip, i) => (
                    <TripCard key={trip._id} trip={trip} onDelete={handleDelete} index={i} />
                  ))}
                </motion.div>
              </AnimatePresence>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center justify-center gap-3 mt-10"
                >
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 rounded-xl border border-brand-border text-brand-sub hover:border-brand-amber hover:text-brand-amber disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-9 h-9 rounded-xl font-body text-sm font-medium transition-all ${
                          p === page
                            ? "bg-brand-amber text-brand-dark"
                            : "border border-brand-border text-brand-sub hover:border-brand-amber hover:text-brand-amber"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                    disabled={page === pagination.totalPages}
                    className="p-2 rounded-xl border border-brand-border text-brand-sub hover:border-brand-amber hover:text-brand-amber disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight size={18} />
                  </button>
                </motion.div>
              )}

              <p className="text-center text-brand-sub font-body text-xs mt-4">
                Showing {trips.length} of {pagination.total} trips
              </p>
            </>
          )}
        </div>
      </div>
    </PageTransition>
  );
}