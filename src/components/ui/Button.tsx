import { ArrowUpRight } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";
import { Link } from "react-router-dom";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "outline" | "ghost"; to?: string };
export default function Button({ children, variant = "primary", to, className = "", ...props }: Props) {
  const content = <>{children}<ArrowUpRight size={17} /></>;
  const classes = `button button-${variant} ${className}`;
  if (to) return <Link to={to} className={classes} data-cursor="OPEN">{content}</Link>;
  return <button className={classes} {...props}>{content}</button>;
}
