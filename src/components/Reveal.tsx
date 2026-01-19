import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right";
  className?: string;
}

export default function Reveal({
  children,
  delay = 0,
  duration = 0.6,
  direction = "up",
  className = "",
}: RevealProps) {
  const getOffset = () => {
    switch (direction) {
      case "down":
        return { y: -40 };
      case "left":
        return { x: 40 };
      case "right":
        return { x: -40 };
      default:
        return { y: 40 };
    }
  };

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...getOffset() }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      transition={{ delay, duration, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.2 }}
    >
      {children}
    </motion.div>
  );
}

