import { AnimatePresence, motion } from "motion/react";
import { useProgress } from "@react-three/drei";

export default function SceneLoader() { const { active, progress } = useProgress(); return <AnimatePresence>{active && <motion.div className="scene-loader" exit={{ opacity: 0 }} transition={{ duration: .6 }}><div className="loader-brand">NULL<span>/</span>FORM</div><div className="loader-progress"><i style={{ width: `${progress}%` }} /></div><span>{Math.round(progress).toString().padStart(2, "0")}%</span></motion.div>}</AnimatePresence>; }
