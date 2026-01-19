import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right";
}

const variants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

export default function Reveal({
  children,
  delay = 0,
  duration = 0.6,
  direction = "up",
}: RevealProps) {
  const getAxis = () => {
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
      initial={{ opacity: 0, ...getAxis() }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      transition={{ delay, duration, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.2 }}
    >
      {children}
    </motion.div>
  );
}
