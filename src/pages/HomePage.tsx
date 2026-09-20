import Hero from "../components/home/Hero";
import ManifestoSection from "../components/home/ManifestoSection";
import ServicesSection from "../components/home/ServicesSection";
import ExperienceSection from "../components/home/ExperienceSection";
import FeaturedWork from "../components/home/FeaturedWork";
import TechnologySection from "../components/home/TechnologySection";
import PhilosophySection from "../components/home/PhilosophySection";
import StatsSection from "../components/home/StatsSection";
import FinalCTA from "../components/home/FinalCTA";
import { useSeo } from "../hooks/useSeo";

export default function HomePage() { useSeo("Build the impossible", "NULL/FORM creates cinematic digital experiences through design, motion, and technology."); return <><Hero /><ManifestoSection /><ServicesSection /><ExperienceSection /><FeaturedWork /><TechnologySection /><PhilosophySection /><StatsSection /><FinalCTA /></>; }
