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
  duration = 0.7,
  direction = "up",
  className = "",
}: RevealProps) {
  const getOffset = () => {
    switch (direction) {
      case "down":
        return { y: -50 };
      case "left":
        return { x: 50 };
      case "right":
        return { x: -50 };
      default:
        return { y: 50 };
    }
  };

  return (
    <motion.div
      className={className}
      initial={{
        opacity: 0,
        scale: 0.96,
        ...getOffset(),
      }}
      whileInView={{
        opacity: 1,
        scale: 1,
        x: 0,
        y: 0,
      }}
      transition={{
        delay,
        duration,
        ease: [0.22, 1, 0.36, 1], // smooth "expo out"
      }}
      viewport={{ once: true, amount: 0.25 }}
    >
      {children}
    </motion.div>
  );
}
