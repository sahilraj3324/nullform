import { motion } from "motion/react";
import { ArrowDown } from "lucide-react";
import Button from "../ui/Button";
import Container from "../ui/Container";

export default function Hero() {
  const reveal = (delay: number) => ({ initial: { opacity: 0, y: 48, filter: "blur(12px)" }, animate: { opacity: 1, y: 0, filter: "blur(0px)" }, transition: { duration: 1.1, delay, ease: [.16, 1, .3, 1] as [number, number, number, number] } });
  return <section className="hero" id="top"><Container><div className="hero-grid"><div className="hero-copy"><motion.div className="eyebrow" {...reveal(.05)}><span>●</span>DIGITAL EXPERIENCES / 2026</motion.div><motion.h1 {...reveal(.12)}>BUILD<br />THE<br /><em>IMPOSSIBLE.</em></motion.h1><motion.div className="hero-actions" {...reveal(.27)}><p>We shape digital experiences where motion, technology, and storytelling become one.</p><div><Button to="/work">Explore work</Button><Button to="/about" variant="ghost">Our approach</Button></div></motion.div></div><div className="hero-side"><span>CREATIVE TECHNOLOGY STUDIO</span><span>BENGALURU / GLOBAL</span></div></div><motion.a href="#manifesto" className="scroll-cue" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}><span>SCROLL TO ENTER</span><ArrowDown size={16} /></motion.a></Container></section>;
}
