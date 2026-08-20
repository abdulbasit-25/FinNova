import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";

export function QuickAddButton() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <motion.button
      onClick={() => navigate("/add")}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.3, type: "spring", stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className={`fixed z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/40 transition-shadow hover:shadow-xl hover:shadow-primary/50 active:shadow-md active:shadow-primary/30 ${
        isMobile ? "bottom-24 right-4" : "bottom-6 right-6"
      }`}
      aria-label="Add new transaction"
      title="Add transaction (Ctrl+N)"
    >
      <motion.div
        animate={{ rotate: 0 }}
        whileHover={{ rotate: 90 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        <Plus className="h-6 w-6" />
      </motion.div>
    </motion.button>
  );
}
