import type { LucideIcon } from "lucide-react";
import type { PointerEvent } from "react";
import GlassCard from "../ui/GlassCard";

export default function ServiceCard({ number, title, description, icon: Icon }: { number: string; title: string; description: string; icon: LucideIcon }) {
  const move = (event: PointerEvent<HTMLDivElement>) => { if (matchMedia("(pointer: coarse)").matches) return; const card = event.currentTarget; const rect = card.getBoundingClientRect(); const x = (event.clientX - rect.left) / rect.width - .5; const y = (event.clientY - rect.top) / rect.height - .5; card.style.transform = `perspective(900px) rotateX(${-y * 7}deg) rotateY(${x * 7}deg) translateY(-6px)`; };
  const reset = (event: PointerEvent<HTMLDivElement>) => { event.currentTarget.style.transform = "perspective(900px) rotateX(0) rotateY(0) translateY(0)"; };
  return <GlassCard className="service-card" onPointerMove={move} onPointerLeave={reset}><div><span>{number}</span><Icon size={22} /></div><section><h3>{title}</h3><p>{description}</p></section></GlassCard>;
}
