import Navbar from "../styles/components/Navbar";
import Hero from "../styles/components/Hero";
import Services from "../styles/components/Services";
import About from "../styles/components/About";
import Projects from "../styles/components/Projects";
import Testimonials from "../styles/components/Testimonials";
import Contact from "../styles/components/Contact";
import Footer from "../styles/components/Footer";
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
