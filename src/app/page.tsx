import MotionRoot from "@/components/MotionRoot";
import Header from "@/components/Header";
import headerStyles from "@/components/Header.module.css";
import About from "@/components/sections/About";
import Contact from "@/components/sections/Contact";
import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";

export default function Home() {
  return (
    <>
      <div className={`site-content ${headerStyles.scope}`}>
        <Header />
        <main>
          <Hero />
          <About />
          <Services />
          <Contact />
        </main>
        <MotionRoot />
      </div>
    </>
  );
}
