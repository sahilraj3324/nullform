import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import Container from "../ui/Container";

export default function Footer() { return <footer className="footer"><Container><div className="footer-top"><Link className="brand" to="/"><i />NULL<span>/</span>FORM</Link><h2>Ideas should leave<br />a mark in space.</h2></div><div className="footer-grid"><div><span>STUDIO</span><p>Independent creative technology studio working globally from Bengaluru.</p></div><div><span>EXPLORE</span><Link to="/work">Work</Link><Link to="/about">About</Link><Link to="/contact">Contact</Link></div><div><span>SOCIAL</span><a href="#">Instagram</a><a href="#">LinkedIn</a><a href="#">X / Twitter</a></div><a className="footer-mail" href="mailto:hello@nullform.studio">hello@nullform.studio <ArrowUpRight /></a></div><div className="footer-bottom"><span>© 2026 NULL/FORM</span><span>DESIGN · MOTION · TECHNOLOGY</span><a href="#top">BACK TO TOP ↑</a></div></Container></footer>; }
