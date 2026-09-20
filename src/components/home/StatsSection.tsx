import { motion } from "motion/react";
import Container from "../ui/Container";

const stats = [["25+", "Projects shipped"], ["08", "Countries reached"], ["04", "Years exploring"], ["99%", "Curiosity"]];
export default function StatsSection() { return <section className="stats"><Container><div className="stats-grid">{stats.map(([value, label], i) => <motion.div key={label} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * .08 }}><strong>{value}</strong><span>{label}</span></motion.div>)}</div></Container></section>; }
