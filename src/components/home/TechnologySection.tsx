import { motion } from "motion/react";
import Container from "../ui/Container";
import TextReveal from "../ui/TextReveal";

const stack = ["React", "Three.js", "WebGL", "GSAP", "TypeScript", "Shaders", "Motion", "R3F"];
export default function TechnologySection() { return <section className="technology section" id="technology"><Container><div className="section-tag"><span>05</span>OUR MEDIUM</div><div className="technology-grid"><TextReveal className="display-heading">BUILT WITH<br />TECHNOLOGY<br /><em>THAT<br />DISAPPEARS.</em></TextReveal><div className="tech-side"><p>The best technology becomes invisible. It disappears into the feeling of the experience—fast, tactile, and entirely natural.</p><div className="tech-chips">{stack.map((item, i) => <motion.span key={item} initial={{ opacity: 0, scale: .8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * .05 }}>{item}</motion.span>)}</div></div></div></Container></section>; }
