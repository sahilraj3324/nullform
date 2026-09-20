export interface Project { id: number; slug: string; title: string; category: string; year: string; description: string; tone: string; }

export const projects: Project[] = [
  { id: 1, slug: "aurora", title: "Aurora", category: "Financial Intelligence", year: "2026", description: "A spatial operating system for complex global finance.", tone: "violet" },
  { id: 2, slug: "nexus", title: "Nexus", category: "AI Infrastructure", year: "2026", description: "Making invisible machine intelligence tangible and trusted.", tone: "cyan" },
  { id: 3, slug: "orbit", title: "Orbit", category: "Future Commerce", year: "2025", description: "An immersive commerce universe built for discovery.", tone: "silver" },
  { id: 4, slug: "kinetic", title: "Kinetic", category: "Mobility Platform", year: "2025", description: "One living interface for the motion of a city.", tone: "amber" },
  { id: 5, slug: "arc", title: "Arc", category: "Creative AI", year: "2025", description: "A new instrument for human and machine creativity.", tone: "rose" },
  { id: 6, slug: "echo", title: "Echo", category: "Sonic Identity", year: "2024", description: "A visual language that responds to the sound around it.", tone: "indigo" },
];
