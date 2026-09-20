import { motion } from "motion/react";
import type { ReactNode } from "react";

export default function TextReveal({ children, className = "", delay = 0, as = "h2" }: { children: ReactNode; className?: string; delay?: number; as?: "h1" | "h2" | "h3" }) {
  const Tag = motion[as];
  return <Tag className={className} initial={{ opacity: 0, y: 55, filter: "blur(10px)" }} whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }} viewport={{ once: true, amount: .2 }} transition={{ duration: 1, delay, ease: [.16, 1, .3, 1] }}>{children}</Tag>;
}
