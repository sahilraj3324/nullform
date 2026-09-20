import { lazy, Suspense, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import CustomCursor from "./components/ui/CustomCursor";

const SceneCanvas = lazy(() => import("./components/three/SceneCanvas"));
const HomePage = lazy(() => import("./pages/HomePage"));
const WorkPage = lazy(() => import("./pages/WorkPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

function RouteEffects() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, [pathname]);
  return null;
}

export default function App() {
  return <><RouteEffects /><Suspense fallback={<div className="webgl-fallback" />}><SceneCanvas /></Suspense><CustomCursor /><Navbar /><main className="site-content"><Suspense fallback={<div className="page-loading">NULL/FORM</div>}><Routes><Route path="/" element={<HomePage />} /><Route path="/work" element={<WorkPage />} /><Route path="/about" element={<AboutPage />} /><Route path="/contact" element={<ContactPage />} /><Route path="*" element={<NotFoundPage />} /></Routes></Suspense></main><Footer /></>;
}
