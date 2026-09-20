import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (matchMedia("(pointer: coarse)").matches) return;
    const move = (event: PointerEvent) => { const cursor = ref.current; if (!cursor) return; cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`; const target = (event.target as Element).closest?.("[data-cursor]") as HTMLElement | null; cursor.classList.toggle("cursor-active", !!target); cursor.textContent = target?.dataset.cursor ?? ""; };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);
  return <div ref={ref} className="custom-cursor" aria-hidden="true" />;
}
