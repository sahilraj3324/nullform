import { useEffect, useRef } from "react";

export function useMousePosition() {
  const position = useRef({ x: 0, y: 0 });
  useEffect(() => { const move = (event: PointerEvent) => { position.current.x = event.clientX / innerWidth * 2 - 1; position.current.y = -(event.clientY / innerHeight * 2 - 1); }; window.addEventListener("pointermove", move, { passive: true }); return () => window.removeEventListener("pointermove", move); }, []);
  return position;
}
