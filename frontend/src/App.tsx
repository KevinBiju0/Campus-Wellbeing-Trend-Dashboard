import { AnimatePresence, motion } from "framer-motion";
import { Route, Routes, useLocation } from "react-router-dom";

import Layout from "./components/Layout";
import CheckIn from "./pages/CheckIn";
import Dashboard from "./pages/Dashboard";
import CounselorReview from "./pages/CounselorReview";
import PrivacySafety from "./pages/PrivacySafety";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -8, filter: "blur(3px)" }}
        transition={{
          duration: 0.35,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="min-h-full"
      >
        <Routes location={location}>
          <Route path="/" element={<CheckIn />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/counselor" element={<CounselorReview />} />
          <Route path="/privacy" element={<PrivacySafety />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="*" element={<AnimatedRoutes />} />
      </Route>
    </Routes>
  );
}
