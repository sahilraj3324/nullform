import { services } from "../../data/services";
import Container from "../ui/Container";
import TextReveal from "../ui/TextReveal";
import ServiceCard from "./ServiceCard";

export default function ServicesSection() { return <section className="services section"><Container><div className="section-tag"><span>02</span>WHAT WE CREATE</div><div className="section-heading-row"><TextReveal className="section-heading">MADE FOR<br />THE UNSEEN.</TextReveal><p>Strategy, design, and engineering brought together to build experiences that could not exist any other way.</p></div><div className="services-grid">{services.map(service => <ServiceCard {...service} key={service.number} />)}</div></Container></section>; }
