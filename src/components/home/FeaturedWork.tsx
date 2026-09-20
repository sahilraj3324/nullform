import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef } from "react";
import { projects } from "../../data/projects";
import Container from "../ui/Container";
import ProjectCard from "./ProjectCard";

gsap.registerPlugin(ScrollTrigger);
export default function FeaturedWork() {
  const section = useRef<HTMLElement>(null); const track = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => { if (innerWidth < 768 || matchMedia("(prefers-reduced-motion: reduce)").matches) return; const context = gsap.context(() => { const distance = () => Math.max(0, (track.current?.scrollWidth ?? 0) - innerWidth + 96); gsap.to(track.current, { x: () => -distance(), ease: "none", scrollTrigger: { trigger: section.current, start: "top top", end: () => `+=${distance() + innerWidth * .35}`, scrub: 1, pin: true, invalidateOnRefresh: true } }); }, section); return () => context.revert(); }, []);
  return <section className="featured-work" ref={section}><Container><div className="work-head"><div className="section-tag"><span>04</span>SELECTED WORK</div><p>PROJECTS / 2024—2026</p></div></Container><div className="project-track" ref={track}>{projects.slice(0, 4).map(project => <ProjectCard project={project} key={project.id} />)}</div></section>;
}
