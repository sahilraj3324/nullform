import Button from "../ui/Button";
import Container from "../ui/Container";
import TextReveal from "../ui/TextReveal";

export default function FinalCTA() { return <section className="final-cta"><Container><div className="cta-index">07 / NEXT</div><TextReveal className="cta-title">ENTER<br />THE NEXT<br /><em>DIMENSION.</em></TextReveal><div className="cta-bottom"><p>Have an idea that refuses to sit still?</p><Button to="/contact">Start a project</Button></div></Container></section>; }
