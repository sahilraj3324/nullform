import { motion } from "motion/react";
import ProjectCard from "../components/home/ProjectCard";
import Container from "../components/ui/Container";
import { projects } from "../data/projects";
import { useSeo } from "../hooks/useSeo";

export default function WorkPage() { useSeo("Selected work", "A selection of digital products, interactive worlds, and future-facing platforms."); return <><header className="page-hero work-page-hero"><Container><div className="section-tag"><span>01—06</span>SELECTED PROJECTS</div><h1>WORK THAT<br /><em>MOVES WITH YOU.</em></h1><p>From intelligent products to spatial brands, we build experiences around a single idea: make every interaction matter.</p></Container></header><section className="work-grid-section"><Container><div className="work-grid">{projects.map((project, i) => <motion.div key={project.id} initial={{ opacity: 0, y: 55 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 2) * .08, duration: .8 }}><ProjectCard project={project} /></motion.div>)}</div></Container></section></>; }
