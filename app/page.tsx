import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Services from "../components/Services";
import About from "../components/About";
import Projects from "../components/Projects";
import Testimonials from "../components/Testimonials";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <main dir="rtl">
      <Navbar />
      <Hero />
      <Services />
      <About />
      <Projects />
      <Testimonials />
      <Contact />
      <Footer />
    </main>
  );
}
