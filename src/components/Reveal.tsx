import { useEffect, useState, type ReactNode } from "react";
import { motion, type Variants } from "framer-motion";

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
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) =>
      setPrefersReducedMotion(e.matches);

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const offset =
    direction === "up"
      ? { x: 0, y: 50 }
      : direction === "down"
      ? { x: 0, y: -50 }
      : direction === "left"
      ? { x: 50, y: 0 }
      : { x: -50, y: 0 };

  const variants: Variants = {
    hidden: { opacity: 0, x: offset.x, y: offset.y },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration, delay, ease: "easeOut" },
    },
  };

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: true,
        amount: 0.1,
        margin: "-100px 0px",
      }}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}
