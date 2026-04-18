import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
    MapPin, Plus, X, Upload, Trash2, Globe,
    Search, SlidersHorizontal, ChevronDown,
    ChevronLeft, ChevronRight, User, Users,
} from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import PageTransition from "../components/PageTransition";
import Loader from "../components/Loader";

const categories = ["nature", "cafe", "club", "adventure", "food"];
const catEmoji = { nature: "🌿", cafe: "☕", club: "🎉", adventure: "🧗", food: "🍜" };
const catColors = {
    nature: "text-green-400 bg-green-400/10 border-green-400/20",
    cafe: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
    club: "text-purple-400 bg-purple-400/10 border-purple-400/20",
    adventure: "text-orange-400 bg-orange-400/10 border-orange-400/20",
    food: "text-red-400 bg-red-400/10 border-red-400/20",
};
const sortOptions = [
    { label: "Newest First", value: "newest" },
    { label: "Oldest First", value: "oldest" },
];
const LIMIT = 12;

// ─── PostCard ────────────────────────────────────────────────────────────────
function PostCard({ post, onDelete, isOwner, index }) {
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        if (!window.confirm("Delete this post?")) return;
        setDeleting(true);
        try {
            await api.delete(`/posts/${post._id}`);
            toast.success("Post deleted");
            onDelete(post._id);
        } catch {
            toast.error("Failed to delete");
            setDeleting(false);
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.35, delay: index * 0.04 }}
            whileHover={{ y: -4 }}
            className="card group overflow-hidden p-0"
        >
            <div className="relative overflow-hidden rounded-t-2xl aspect-[4/3] bg-brand-muted">
                <img
                    src={post.image}
                    alt={post.caption || post.location?.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                />
                {/* Category badge */}
                <div className="absolute top-3 left-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border backdrop-blur-sm text-xs font-body font-medium capitalize ${catColors[post.category]}`}>
                        {catEmoji[post.category]} {post.category}
                    </span>
                </div>
                {isOwner && (
                    <>
                        {/* "Mine" badge */}
                        <div className="absolute bottom-3 left-3">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-brand-amber/80 backdrop-blur-sm text-brand-dark text-[10px] font-body font-semibold">
                                ✦ Mine
                            </span>
                        </div>
                        {/* Delete button */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleDelete}
                            disabled={deleting}
                            className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/40 backdrop-blur-sm"
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
                        </motion.button>
                    </>
                )}
            </div>

            <div className="p-4">
                <div className="flex items-start gap-2 mb-2">
                    <MapPin size={13} className="text-brand-amber mt-0.5 flex-shrink-0" />
                    <div>
                        <span className="text-brand-text font-body text-sm font-medium">{post.location?.name}</span>
                        <span className="text-brand-sub font-body text-xs ml-1">{post.location?.country}</span>
                    </div>
                </div>
                {post.caption && (
                    <p className="text-brand-sub font-body text-sm leading-relaxed line-clamp-2">{post.caption}</p>
                )}
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-brand-border">
                    <div className="w-6 h-6 rounded-lg bg-brand-amber/20 flex items-center justify-center">
                        <span className="text-brand-amber font-display font-bold text-xs">
                            {post.user?.name?.[0]?.toUpperCase() || "?"}
                        </span>
                    </div>
                    <span className="text-brand-sub font-body text-xs">{post.user?.name || "Anonymous"}</span>
                </div>
            </div>
        </motion.div>
    );
}

// ─── Pagination ──────────────────────────────────────────────────────────────
function Pagination({ page, pages, total, onPage }) {
    if (pages <= 1) return null;

    const getPageNums = () => {
        const nums = [];
        for (let i = Math.max(1, page - 1); i <= Math.min(pages, page + 1); i++) nums.push(i);
        if (nums[0] > 1) { nums.unshift("..."); nums.unshift(1); }
        if (nums[nums.length - 1] < pages) { nums.push("..."); nums.push(pages); }
        return nums;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 mt-12 flex-wrap"
        >
            <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => onPage(page - 1)} disabled={page === 1}
                className="p-2 rounded-xl border border-brand-border text-brand-sub hover:border-brand-amber/40 hover:text-brand-amber disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
                <ChevronLeft size={16} />
            </motion.button>

            {getPageNums().map((n, i) =>
                n === "..." ? (
                    <span key={`dot-${i}`} className="text-brand-sub font-body text-sm px-1">…</span>
                ) : (
                    <motion.button
                        key={n}
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        onClick={() => onPage(n)}
                        className={`w-9 h-9 rounded-xl border font-body text-sm font-medium transition-all ${n === page
                            ? "border-brand-amber/40 bg-brand-amber/10 text-brand-amber"
                            : "border-brand-border text-brand-sub hover:border-brand-amber/30 hover:text-brand-text"
                            }`}
                    >
                        {n}
                    </motion.button>
                )
            )}

            <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => onPage(page + 1)} disabled={page === pages}
                className="p-2 rounded-xl border border-brand-border text-brand-sub hover:border-brand-amber/40 hover:text-brand-amber disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
                <ChevronRight size={16} />
            </motion.button>

            <span className="text-brand-sub font-body text-xs ml-2 hidden sm:inline">
                Page {page} of {pages} · {total} {total === 1 ? "story" : "stories"}
            </span>
        </motion.div>
    );
}

// ─── CreatePostModal ─────────────────────────────────────────────────────────
function CreatePostModal({ onClose, onCreated }) {
    const [form, setForm] = useState({ caption: "", locationName: "", locationCountry: "", category: "" });
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const fileRef = useRef();

    const handleFile = (e) => {
        const f = e.target.files[0];
        if (!f) return;
        if (f.size > 5 * 1024 * 1024) return toast.error("Image must be under 5MB");
        setFile(f);
        setPreview(URL.createObjectURL(f));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return toast.error("Select an image");
        if (!form.category) return toast.error("Select a category");
        if (!form.locationName || !form.locationCountry) return toast.error("Enter location details");
        setLoading(true);
        const fd = new FormData();
        fd.append("image", file);
        fd.append("caption", form.caption);
        fd.append("location[name]", form.locationName);
        fd.append("location[country]", form.locationCountry);
        fd.append("category", form.category);
        try {
            const { data } = await api.post("/posts", fd, { headers: { "Content-Type": "multipart/form-data" } });
            toast.success("Post shared! 🌍");
            onCreated(data.data);
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to post");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.93, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="bg-brand-card border border-brand-border rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
                <div className="flex items-center justify-between p-6 border-b border-brand-border">
                    <h2 className="font-display text-xl font-bold text-brand-text">Share a Memory</h2>
                    <button onClick={onClose} className="p-2 rounded-xl hover:bg-brand-muted text-brand-sub hover:text-brand-text transition-colors">
                        <X size={18} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div
                        onClick={() => fileRef.current.click()}
                        className={`relative border-2 border-dashed rounded-2xl overflow-hidden cursor-pointer transition-colors ${preview ? "border-brand-amber/40" : "border-brand-border hover:border-brand-amber/50"}`}
                    >
                        {preview ? (
                            <img src={preview} alt="Preview" className="w-full aspect-video object-cover" />
                        ) : (
                            <div className="aspect-video flex flex-col items-center justify-center gap-3 text-brand-sub hover:text-brand-amber transition-colors">
                                <Upload size={28} />
                                <div className="text-sm font-body text-center">
                                    <span className="font-medium">Click to upload</span><br />
                                    <span className="text-xs">JPG, PNG, WebP up to 5MB</span>
                                </div>
                            </div>
                        )}
                        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-body font-medium text-brand-sub">Category</label>
                        <div className="flex flex-wrap gap-2">
                            {categories.map((cat) => (
                                <button key={cat} type="button"
                                    onClick={() => setForm((f) => ({ ...f, category: cat }))}
                                    className={`px-3 py-1.5 rounded-xl border text-xs font-body font-medium capitalize transition-all ${form.category === cat ? catColors[cat] : "border-brand-border text-brand-sub hover:border-brand-amber/30"}`}
                                >{catEmoji[cat]} {cat}</button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                            <label className="text-sm font-body font-medium text-brand-sub">Place</label>
                            <input type="text" placeholder="e.g. Jaipur" value={form.locationName}
                                onChange={(e) => setForm((f) => ({ ...f, locationName: e.target.value }))}
                                className="input-field" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-body font-medium text-brand-sub">Country</label>
                            <input type="text" placeholder="e.g. India" value={form.locationCountry}
                                onChange={(e) => setForm((f) => ({ ...f, locationCountry: e.target.value }))}
                                className="input-field" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-body font-medium text-brand-sub">Caption (optional)</label>
                        <textarea placeholder="Share what made this place special..."
                            value={form.caption}
                            onChange={(e) => setForm((f) => ({ ...f, caption: e.target.value }))}
                            rows={3} className="input-field resize-none" />
                    </div>

                    <motion.button type="submit" disabled={loading}
                        whileHover={{ scale: loading ? 1 : 1.02 }} whileTap={{ scale: 0.98 }}
                        className="btn-primary w-full flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <motion.div className="w-5 h-5 border-2 border-brand-dark/30 border-t-brand-dark rounded-full"
                                animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }} />
                        ) : (<><Globe size={16} /> Share with Community</>)}
                    </motion.button>
                </form>
            </motion.div>
        </motion.div>
    );
}

// ─── Community (main page) ───────────────────────────────────────────────────
export default function Community() {
    const { isAuthenticated } = useAuth();

    // Tab: "all" | "mine"
    const [tab, setTab] = useState("all");

    // ── All posts (server-paginated) ──
    const [posts, setPosts] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    // Search & filter (all tab)
    const [searchInput, setSearchInput] = useState("");
    const [activeSearch, setActiveSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const [showFilters, setShowFilters] = useState(false);
    const searchTimeout = useRef(null);

    // ── My posts (fetched once, client-sorted) ──
    const [myPosts, setMyPosts] = useState([]);
    const [myPostIds, setMyPostIds] = useState(new Set());
    const [myLoading, setMyLoading] = useState(false);
    const [myFetched, setMyFetched] = useState(false);
    const [mySort, setMySort] = useState("newest");

    const [showModal, setShowModal] = useState(false);

    // ── fetch community posts ─────────────────────────────────────────────────
    const fetchPosts = useCallback(async (page = 1, location = "") => {
        setLoading(true);
        try {
            const params = { page, limit: LIMIT };
            if (location) params.location = location;
            const { data } = await api.get("/posts", { params });
            setPosts(data.posts || []);
            setPagination({ page: data.page ?? page, pages: data.pages ?? 1, total: data.total ?? 0 });
        } catch {
            toast.error("Failed to load posts");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPosts(currentPage, activeSearch);
    }, [fetchPosts, currentPage, activeSearch]);

    // Debounced search — resets to page 1
    useEffect(() => {
        clearTimeout(searchTimeout.current);
        searchTimeout.current = setTimeout(() => {
            setActiveSearch(searchInput);
            setCurrentPage(1);
        }, 500);
        return () => clearTimeout(searchTimeout.current);
    }, [searchInput]);

    // ── fetch my posts (lazy on tab switch, once) ─────────────────────────────
    const fetchMyPosts = useCallback(async () => {
        if (myFetched) return;
        setMyLoading(true);
        try {
            const { data } = await api.get("/posts/my");
            const arr = data.posts || [];
            setMyPosts(arr);
            setMyPostIds(new Set(arr.map((p) => p._id)));
            setMyFetched(true);
        } catch {
            toast.error("Failed to load your posts");
        } finally {
            setMyLoading(false);
        }
    }, [myFetched]);

    // Prefetch just the IDs so "Mine" badges show on the all tab too
    useEffect(() => {
        if (!isAuthenticated) return;
        api.get("/posts/my")
            .then(({ data }) => setMyPostIds(new Set((data.posts || []).map((p) => p._id))))
            .catch(() => { });
    }, [isAuthenticated]);

    const handleTabChange = (t) => {
        setTab(t);
        if (t === "mine" && isAuthenticated) fetchMyPosts();
    };

    // ── client-side category + sort for "all" tab ─────────────────────────────
    const displayedPosts = [...posts]
        .filter((p) => !activeCategory || p.category === activeCategory)
        .sort((a, b) =>
            sortBy === "newest"
                ? new Date(b.createdAt) - new Date(a.createdAt)
                : new Date(a.createdAt) - new Date(b.createdAt)
        );

    // ── client-side sort for "mine" tab ───────────────────────────────────────
    const displayedMyPosts = [...myPosts].sort((a, b) =>
        mySort === "newest"
            ? new Date(b.createdAt) - new Date(a.createdAt)
            : new Date(a.createdAt) - new Date(b.createdAt)
    );

    // ── mutations ─────────────────────────────────────────────────────────────
    const handleCreated = (post) => {
        setPosts((prev) => [post, ...prev]);
        setMyPosts((prev) => [post, ...prev]);
        setMyPostIds((prev) => new Set([...prev, post._id]));
        setMyFetched(true);
        setPagination((prev) => ({ ...prev, total: prev.total + 1 }));
    };

    const handleDelete = (id) => {
        setPosts((prev) => prev.filter((p) => p._id !== id));
        setMyPosts((prev) => prev.filter((p) => p._id !== id));
        setMyPostIds((prev) => { const s = new Set(prev); s.delete(id); return s; });
        setPagination((prev) => ({ ...prev, total: Math.max(0, prev.total - 1) }));
    };

    const clearFilters = () => {
        setSearchInput("");
        setActiveCategory("");
        setSortBy("newest");
        setCurrentPage(1);
    };

    const hasActiveFilters = !!(searchInput || activeCategory || sortBy !== "newest");

    // ── empty state helper ────────────────────────────────────────────────────
    const EmptyState = ({ isMine }) => (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity }} className="text-7xl mb-5">
                {isMine ? "🗺️" : hasActiveFilters ? "🔍" : "📸"}
            </motion.div>
            <h3 className="font-display text-2xl font-bold text-brand-text mb-3">
                {isMine ? "No memories yet" : hasActiveFilters ? "No stories found" : "No stories yet"}
            </h3>
            <p className="text-brand-sub font-body mb-6">
                {isMine
                    ? "Share your first travel memory with the community!"
                    : hasActiveFilters
                        ? "Try a different destination or clear your filters."
                        : "Be the first to share a travel memory!"}
            </p>
            {isMine || (!hasActiveFilters && isAuthenticated) ? (
                <button onClick={() => setShowModal(true)} className="btn-primary inline-flex items-center gap-2">
                    <Plus size={16} /> Share {isMine ? "First " : ""}Memory
                </button>
            ) : hasActiveFilters ? (
                <button onClick={clearFilters} className="btn-ghost inline-flex items-center gap-2">
                    <X size={14} /> Clear filters
                </button>
            ) : null}
        </motion.div>
    );

    return (
        <PageTransition>
            <div className="min-h-screen pt-24 pb-16 px-6 relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-96 bg-brand-amber/4 rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-6xl mx-auto relative z-10">

                    {/* ── Header ────────────────────────────────────────────── */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8"
                    >
                        <div>
                            <p className="text-brand-sub font-body text-sm mb-1">Explore the world through</p>
                            <h1 className="font-display text-4xl font-black text-brand-text">
                                Travel <span className="gradient-text">Community</span>
                            </h1>
                            <p className="text-brand-sub font-body text-sm mt-2">
                                {tab === "all"
                                    ? `${pagination.total} ${pagination.total === 1 ? "story" : "stories"} shared`
                                    : `${displayedMyPosts.length} ${displayedMyPosts.length === 1 ? "memory" : "memories"} by you`}
                            </p>
                        </div>
                        {isAuthenticated && (
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                                onClick={() => setShowModal(true)}
                                className="btn-primary inline-flex items-center gap-2"
                            >
                                <Plus size={16} /> Share Memory
                            </motion.button>
                        )}
                    </motion.div>

                    {/* ── Tabs ──────────────────────────────────────────────── */}
                    {isAuthenticated && (
                        <motion.div
                            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.05 }}
                            className="flex gap-1 p-1 rounded-2xl bg-brand-muted border border-brand-border w-fit mb-6"
                        >
                            {[
                                { key: "all", label: "All Stories", icon: Users },
                                { key: "mine", label: "My Posts", icon: User },
                            ].map(({ key, label, icon: Icon }) => (
                                <motion.button
                                    key={key} whileTap={{ scale: 0.97 }}
                                    onClick={() => handleTabChange(key)}
                                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-body text-sm font-medium transition-all ${tab === key
                                        ? "bg-brand-card border border-brand-border text-brand-text shadow-sm"
                                        : "text-brand-sub hover:text-brand-text"
                                        }`}
                                >
                                    <Icon size={14} />
                                    {label}
                                    {key === "mine" && myPostIds.size > 0 && (
                                        <span className="px-1.5 py-0.5 rounded-md bg-brand-amber/20 text-brand-amber text-[10px] font-semibold">
                                            {myPostIds.size}
                                        </span>
                                    )}
                                </motion.button>
                            ))}
                        </motion.div>
                    )}

                    {/* ── Search / Filter bar (all tab) ─────────────────────── */}
                    <AnimatePresence mode="wait">
                        {tab === "all" && (
                            <motion.div key="all-controls"
                                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}
                                className="mb-8 space-y-3"
                            >
                                {/* Search row */}
                                <div className="flex gap-3">
                                    <div className="relative flex-1">
                                        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-sub pointer-events-none" />
                                        <input type="text" placeholder="Search by destination..."
                                            value={searchInput}
                                            onChange={(e) => setSearchInput(e.target.value)}
                                            className="input-field pl-10 w-full" />
                                        {searchInput && (
                                            <button onClick={() => setSearchInput("")}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-sub hover:text-brand-text transition-colors">
                                                <X size={14} />
                                            </button>
                                        )}
                                    </div>
                                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                                        onClick={() => setShowFilters((v) => !v)}
                                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border font-body text-sm font-medium transition-all ${showFilters || activeCategory || sortBy !== "newest"
                                            ? "border-brand-amber/40 text-brand-amber bg-brand-amber/10"
                                            : "border-brand-border text-brand-sub hover:border-brand-amber/30 hover:text-brand-text"
                                            }`}
                                    >
                                        <SlidersHorizontal size={15} />
                                        Filters
                                        {(activeCategory || sortBy !== "newest") && (
                                            <span className="w-1.5 h-1.5 rounded-full bg-brand-amber" />
                                        )}
                                    </motion.button>
                                </div>

                                {/* Expandable filters */}
                                <AnimatePresence>
                                    {showFilters && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.22 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="flex flex-col sm:flex-row gap-3 pt-1">
                                                {/* Category pills */}
                                                <div className="flex flex-wrap gap-2 flex-1">
                                                    <button onClick={() => setActiveCategory("")}
                                                        className={`px-3 py-1.5 rounded-xl border text-xs font-body font-medium transition-all ${!activeCategory ? "border-brand-amber/40 text-brand-amber bg-brand-amber/10" : "border-brand-border text-brand-sub hover:border-brand-amber/30"}`}
                                                    >All</button>
                                                    {categories.map((cat) => (
                                                        <button key={cat}
                                                            onClick={() => { setActiveCategory(cat === activeCategory ? "" : cat); setCurrentPage(1); }}
                                                            className={`px-3 py-1.5 rounded-xl border text-xs font-body font-medium capitalize transition-all ${activeCategory === cat ? catColors[cat] : "border-brand-border text-brand-sub hover:border-brand-amber/30"}`}
                                                        >{catEmoji[cat]} {cat}</button>
                                                    ))}
                                                </div>
                                                {/* Sort */}
                                                <div className="relative">
                                                    <select value={sortBy} onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                                                        className="input-field pr-8 appearance-none cursor-pointer text-sm font-body">
                                                        {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                                                    </select>
                                                    <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-sub pointer-events-none" />
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Active filter chips */}
                                <AnimatePresence>
                                    {hasActiveFilters && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                            className="flex items-center gap-2 flex-wrap"
                                        >
                                            <span className="text-brand-sub font-body text-xs">Active:</span>
                                            {activeSearch && (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand-amber/10 border border-brand-amber/20 text-brand-amber text-xs font-body">
                                                    📍 {activeSearch}
                                                    <button onClick={() => setSearchInput("")} className="hover:opacity-70"><X size={11} /></button>
                                                </span>
                                            )}
                                            {activeCategory && (
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-body capitalize ${catColors[activeCategory]}`}>
                                                    {catEmoji[activeCategory]} {activeCategory}
                                                    <button onClick={() => setActiveCategory("")} className="hover:opacity-70"><X size={11} /></button>
                                                </span>
                                            )}
                                            {sortBy !== "newest" && (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand-muted border border-brand-border text-brand-sub text-xs font-body">
                                                    {sortOptions.find((o) => o.value === sortBy)?.label}
                                                    <button onClick={() => setSortBy("newest")} className="hover:opacity-70"><X size={11} /></button>
                                                </span>
                                            )}
                                            <button onClick={clearFilters}
                                                className="text-brand-sub font-body text-xs hover:text-brand-text transition-colors underline underline-offset-2">
                                                Clear all
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        )}

                        {/* My Posts sort bar */}
                        {tab === "mine" && displayedMyPosts.length > 0 && (
                            <motion.div key="mine-controls"
                                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="flex justify-end mb-6"
                            >
                                <div className="relative">
                                    <select value={mySort} onChange={(e) => setMySort(e.target.value)}
                                        className="input-field pr-8 appearance-none cursor-pointer text-sm font-body">
                                        {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                                    </select>
                                    <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-sub pointer-events-none" />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* ── Grids ─────────────────────────────────────────────── */}
                    <AnimatePresence mode="wait">
                        {tab === "all" ? (
                            <motion.div key="all-grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                {loading ? (
                                    <Loader text="Loading travel stories..." />
                                ) : displayedPosts.length === 0 ? (
                                    <EmptyState isMine={false} />
                                ) : (
                                    <>
                                        <AnimatePresence mode="popLayout">
                                            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                                                {displayedPosts.map((post, i) => (
                                                    <PostCard key={post._id} post={post}
                                                        onDelete={handleDelete}
                                                        isOwner={myPostIds.has(post._id)}
                                                        index={i} />
                                                ))}
                                            </motion.div>
                                        </AnimatePresence>
                                        <Pagination
                                            page={pagination.page}
                                            pages={pagination.pages}
                                            total={pagination.total}
                                            onPage={(p) => {
                                                setCurrentPage(p);
                                                window.scrollTo({ top: 0, behavior: "smooth" });
                                            }}
                                        />
                                    </>
                                )}
                            </motion.div>
                        ) : (
                            <motion.div key="mine-grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                {myLoading ? (
                                    <Loader text="Loading your memories..." />
                                ) : displayedMyPosts.length === 0 ? (
                                    <EmptyState isMine={true} />
                                ) : (
                                    <AnimatePresence mode="popLayout">
                                        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                                            {displayedMyPosts.map((post, i) => (
                                                <PostCard key={post._id} post={post}
                                                    onDelete={handleDelete}
                                                    isOwner={true}
                                                    index={i} />
                                            ))}
                                        </motion.div>
                                    </AnimatePresence>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* ── Sign-in prompt ────────────────────────────────────── */}
                    {!isAuthenticated && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="mt-10 text-center glass-amber rounded-2xl p-8 border border-brand-amber/20"
                        >
                            <p className="text-brand-text font-body mb-3">Want to share your own travel stories?</p>
                            <div className="flex items-center justify-center gap-3">
                                <a href="/register" className="btn-primary text-sm py-2 px-5">Create Account</a>
                                <a href="/login" className="btn-ghost text-sm py-2 px-5">Sign In</a>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>

            <AnimatePresence>
                {showModal && (
                    <CreatePostModal onClose={() => setShowModal(false)} onCreated={handleCreated} />
                )}
            </AnimatePresence>
        </PageTransition>
    );
}