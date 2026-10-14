import MotionRoot from "@/components/MotionRoot";
import Navbar from "@/components/Navbar";
import About from "@/components/sections/About";
import Contact from "@/components/sections/Contact";
import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";

export default function Home() {
  return (
    <>
      <div className="site-content">
        <Navbar />
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
