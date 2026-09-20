import { useEffect } from "react";
export function useSeo(title: string, description: string) { useEffect(() => { document.title = `${title} — NULL/FORM`; document.querySelector('meta[name="description"]')?.setAttribute("content", description); }, [title, description]); }
