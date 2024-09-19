import { motion } from "framer-motion";

function RadialMenuItem({ index, total, label, onClick }) {
  const angle = (index * 2 * Math.PI) / total; // Adjusted angle calculation
  const distance = 100; // Adjust the distance as needed

  const x = Math.cos(angle) * distance;
  const y = Math.sin(angle) * distance;

  const variants = {
    open: {
      x,
      y,
      opacity: 1,
      scale: 1,
    },
    closed: {
      x: 0,
      y: 0,
      opacity: 0,
      scale: 0.5,
    },
  };

  return (
    <motion.li variants={variants} className="absolute">
      <button
        className="bg-white text-black p-3 rounded-full shadow-lg focus:outline-none"
        onClick={onClick}
        aria-label={label}
      >
        {label}
      </button>
    </motion.li>
  );
}

export default RadialMenuItem;
