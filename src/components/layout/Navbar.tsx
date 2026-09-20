import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { navigation } from "../../data/navigation";
import Button from "../ui/Button";
import Container from "../ui/Container";

export default function Navbar() {
  const [open, setOpen] = useState(false); const [scrolled, setScrolled] = useState(false); const { pathname } = useLocation();
  useEffect(() => { const update = () => setScrolled(scrollY > 24); update(); addEventListener("scroll", update, { passive: true }); return () => removeEventListener("scroll", update); }, []);
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [open]);
  return <header className={`navbar ${scrolled || open ? "navbar-scrolled" : ""}`}><Container className="nav-inner"><Link className="brand" to="/" aria-label="NULL/FORM home"><i />NULL<span>/</span>FORM</Link><nav className="desktop-nav" aria-label="Primary navigation">{navigation.map(item => <a key={item.label} href={item.href}>{item.label}</a>)}</nav><div className="desktop-cta"><Button to="/contact" variant="outline">Start project</Button></div><button className="menu-toggle" onClick={() => setOpen(!open)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}>{open ? <X /> : <Menu />}</button></Container><AnimatePresence>{open && <motion.div className="menu-overlay" initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }} animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }} exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }} transition={{ duration: .6, ease: [.76, 0, .24, 1] }}><Container><div className="menu-index">MENU / 04</div>{navigation.map((item, i) => <motion.a href={item.href} key={item.label} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .15 + i * .08 }}><span>0{i + 1}</span>{item.label}</motion.a>)}<motion.a href="/contact" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .4 }}><span>04</span>Start a project</motion.a></Container></motion.div>}</AnimatePresence></header>;
}
