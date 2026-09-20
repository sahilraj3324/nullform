import Button from "../components/ui/Button";
import Container from "../components/ui/Container";
import { useSeo } from "../hooks/useSeo";

export default function NotFoundPage() { useSeo("Signal lost", "The requested page could not be found."); return <section className="not-found"><Container><span>ERROR / 404</span><h1>SIGNAL<br /><em>LOST.</em></h1><p>This coordinate does not exist in the current dimension.</p><Button to="/">Return to origin</Button></Container></section>; }
