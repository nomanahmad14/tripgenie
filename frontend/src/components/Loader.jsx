import { motion } from "framer-motion";

export default function Loader({ text = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <motion.div
        className="w-10 h-10 rounded-full border-2 border-brand-border border-t-brand-amber"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
      />
      <p className="text-brand-sub font-body text-sm">{text}</p>
    </div>
  );
}