import { ArrowUpRight } from "lucide-react";
import type { Project } from "../../data/projects";

export default function ProjectCard({ project }: { project: Project }) { return <article className="project-card" data-cursor="VIEW"><div className={`project-visual tone-${project.tone}`}><div className="project-orbit orbit-a" /><div className="project-orbit orbit-b" /><div className="project-form"><i /><i /><i /></div><span className="project-watermark">{project.title.slice(0, 2).toUpperCase()}</span></div><div className="project-meta"><span>0{project.id}</span><div><h3>{project.title}</h3><p>{project.category}</p></div><b>{project.year}</b><ArrowUpRight /></div></article>; }
