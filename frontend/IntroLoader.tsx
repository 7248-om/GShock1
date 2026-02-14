import { motion, AnimatePresence } from "framer-motion";

const paths = [
  "M45 75 C70 60 130 60 155 75",
  "M50 75 C45 120 65 150 100 150 C135 150 155 120 150 75",
  "M150 90 C175 90 175 125 150 125",
  "M80 90 C95 80 120 85 110 100 C100 115 75 110 90 95",
  "M85 45 C75 30 90 25 85 10",
  "M115 45 C105 30 120 25 115 10",
];

const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { delay: i * 0.2, duration: 0.9 },
      opacity: { delay: i * 0.2 },
    },
  }),
};

export default function IntroLoader({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0f0a08]"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Coffee Logo */}
          <motion.svg
            width="180"
            height="180"
            viewBox="0 0 200 200"
            fill="none"
            initial="hidden"
            animate="visible"
          >
            {paths.map((d, i) => (
              <motion.path
                key={i}
                d={d}
                stroke="#8B5A2B"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                variants={draw}
                custom={i}
              />
            ))}
          </motion.svg>

          {/* Brand Text */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.6, ease: "easeOut" }}
            className="mt-4 text-[#D6B38C] text-3xl tracking-[0.35em] font-semibold"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            RABUSTE
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
