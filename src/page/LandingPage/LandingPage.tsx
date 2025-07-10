import { useState, useEffect, useRef } from "react";
import { ChevronUp } from "lucide-react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import Lenis from "lenis";
import Snap from "lenis/snap";
import HeroSection from "./HeroSection/HeroSection";
import IntroSection from "./IntroSection";
import { AnimatedSection } from "./AnimatedSection";
import ContactSection from "./ContactSection";
import "./IntroSection/Text.css";
import CreatorSection from "./CreatorSection/CreatorSection";

const sections = [
  { id: "hero", Component: HeroSection },
  { id: "intro", Component: IntroSection },
  { id: "creator", Component: CreatorSection },
  { id: "contact", Component: ContactSection },
];

const LandingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false); // Still used for back-to-top button
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      syncTouch: true,
      syncTouchLerp: 0.15,
      touchInertiaMultiplier: 25,
      gestureOrientation: "vertical",
      lerp: 0.1,
      smoothWheel: true,
      duration: 2,
    });

    lenisRef.current = lenis;

    const snap = new Snap(lenis, {
      type: "mandatory",
      lerp: 0.5,
      duration: 3,
    });

    sections.forEach(({ id }) => {
      const sectionElement = document.getElementById(id);
      if (sectionElement) {
        snap.add(sectionElement.offsetTop);
      }
    });

    function raf(time: number) {
      lenis.raf(time);
      window.requestAnimationFrame(raf);
    }

    window.requestAnimationFrame(raf);

    // Only for back-to-top button visibility
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => {
      lenis.destroy();
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const scrollTo = (target: string) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, {
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        lerp: 0.1,
      });
    }
  };

  const scrollToTop = () => scrollTo("#hero");

  return (
    <div
      className="min-h-screen bg-zinc-100 no-scrollbar overflow-hidden relative"
      key={location.pathname}
    >
      <div className="absolute inset-0 blur-sm -z-10 bg-black"></div>

      {/* Original Navbar - Always visible after initial animation */}
      <motion.nav
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }} // Removed isVisible condition
        transition={{ duration: 1, ease: [0.25, 1, 0.5, 1], delay: 1.2 }}
        className="absolute top-5 right-10 flex items-center space-x-6 bg-black bg-opacity-50 px-6 py-3 rounded-full shadow-lg z-10"
      >
        <button
          onClick={() => scrollTo("#intro")}
          className="text-white hover:text-orange-400 transition"
        >
          About
        </button>
        <button
          onClick={() => scrollTo("#creator")}
          className="text-white hover:text-orange-400 transition"
        >
          Creator
        </button>
        <button
          onClick={() => scrollTo("#contact")}
          className="text-white hover:text-orange-400 transition"
        >
          Contact
        </button>
        <motion.button
          onClick={() => navigate("/login")}
          className="bg-gradient-to-r from-orange-500 to-green-500 hover:from-green-600 hover:to-blue-700 text-white font-bold py-2 px-5 rounded-full shadow-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          Login
        </motion.button>
      </motion.nav>

      {sections.map(({ id, Component }) => (
        <AnimatedSection key={id} id={id} Component={Component} />
      ))}

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className={`
          fixed bottom-6 right-6
          bg-white text-gray-800
          p-2 rounded-full shadow-lg
          border border-gray-200
          transition-all duration-300 ease-in-out
          hover:bg-gray-100 hover:shadow-xl
          ${
            isVisible
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95 pointer-events-none"
          }
        `}
        aria-label="Back to top"
      >
        <ChevronUp className="w-6 h-6" />
      </button>
    </div>
  );
};

export default LandingPage;
