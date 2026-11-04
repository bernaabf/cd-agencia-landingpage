import GaleriaPaisagens from "@/components/paisagens/GaleriaPaisagens";
import MotionRoot from "@/components/MotionRoot";
import Header from "@/components/Header";
import headerStyles from "@/components/Header.module.css";
import About from "@/components/sections/About";
import Contact from "@/components/sections/Contact";
import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import MobileContact from "@/components/MobileContact";
import Button from "@/components/Button";
import { generalMessage, site, whatsappLink } from "@/lib/site";

export default function Home() {
  return (
    <>
      <div className={`site-content ${headerStyles.scope}`}>
        <Header />
        <main>
          <Hero />
          <About />
          <GaleriaPaisagens />
          <Services />
          <Contact />
        </main>
        <MobileContact>
          <Button href={site.whatsappNumber ? whatsappLink(generalMessage) : "#contato"}
            external={Boolean(site.whatsappNumber)} size="sm">{site.contactCta}</Button>
        </MobileContact>
        <MotionRoot />
      </div>
    </>
  );
}
