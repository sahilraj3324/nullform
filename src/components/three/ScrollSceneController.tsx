import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect } from "react";
import { sceneState } from "./sceneState";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollSceneController() {
  useEffect(() => {
    const trigger = ScrollTrigger.create({ trigger: document.documentElement, start: "top top", end: "bottom bottom", scrub: .8, onUpdate: self => { sceneState.progress = self.progress; } });
    const move = (event: PointerEvent) => { sceneState.mouseX = event.clientX / innerWidth * 2 - 1; sceneState.mouseY = -(event.clientY / innerHeight * 2 - 1); };
    addEventListener("pointermove", move, { passive: true });
    const refresh = () => ScrollTrigger.refresh();
    addEventListener("load", refresh);
    return () => { trigger.kill(); removeEventListener("pointermove", move); removeEventListener("load", refresh); };
  }, []);
  return null;
}
