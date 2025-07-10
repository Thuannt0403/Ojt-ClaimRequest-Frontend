import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import "./IntroSection/Text.css";
import leaf from "@/assets/black-left-leaf-right-cr-bg-mobile.svg"

const IntroSection = () => {
  // Animation controls for background and text
  const backgroundControls = useAnimation();
  const textControls = useAnimation();

  // Variants for sliding from left (first section)
  const leftSlideVariants = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0 },
  };

  // Variants for sliding from right (second section)
  const rightSlideVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0 },
  };

  // Variants for background animation
  const backgroundVariants = {
    hidden: { scale: 0.5, backgroundSize: "contain" },
    visible: { scale: 1.2, backgroundSize: "cover" },
  };

  useEffect(() => {
    // Intersection Observer to detect when section is in view
    const section = document.querySelector("#intro-section");
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          // Start background animation
          backgroundControls.start("visible");
          // Start text animation with a 1-second delay
          textControls.start("visible");
        } else {
          // Reset to initial state when out of view
          backgroundControls.start("hidden");
          textControls.start("hidden");
        }
      },
      { threshold: 0.2 } // Trigger when 50% of the section is visible
    );

    if (section) observer.observe(section);

    return () => {
      if (section) observer.unobserve(section);
    };
  }, [backgroundControls, textControls]);

  return (
    <div
      id="intro-section"
      className="relative h-screen w-full flex flex-col justify-center text-white px-6 py-12 overflow-hidden"
    >
      {/* Animated Background */}
      <motion.div
        className="absolute inset-0 bg-no-repeat bg-center"
        style={{
          backgroundImage:
          `url(${leaf})`,
        }}
        variants={backgroundVariants}
        initial="hidden"
        animate={backgroundControls}
        transition={{ duration: 2, ease: "easeInOut" }}
      />

      {/* Content - First Section (Slide from Left) */}
      <motion.section
        className="relative text-left mb-8 self-start ps-72 pb-10"
        variants={leftSlideVariants}
        initial="hidden"
        animate={textControls}
        transition={{ duration: 1, ease: "easeInOut", delay: 1 }}
      >
        <div className="flex items-center">
          <div className="py-2 overflow-hidden .text">
            <h1 className="text-4xl sm:text-8xl font-bold shimmer-text">
              FPT's Request
            </h1>
          </div>
        </div>
        <p className="text-5xl text-blue-950 font-bold">
          A Modern Solution for
        </p>
        <p className="text-5xl text-blue-950 font-bold">Overtime Management</p>
      </motion.section>

      {/* Content - Second Section (Slide from Right) */}
      <motion.section
        className="relative text-justify max-w-4xl self-end"
        variants={rightSlideVariants}
        initial="hidden"
        animate={textControls}
        transition={{ duration: 1, ease: "easeInOut", delay: 1 }}
      >
        <p className="text-2xl text-black mt-4 mr-32 font-semibold">
          FPT's Request was created with the goal of{" "}
          <span className="shimmer-text-underline font-reddit-sans font-extrabold">
            optimizing
          </span>{" "}
          the process of registering, approving, and calculating overtime work.
        </p>
        <p className="text-xl text-black mt-4 mr-32">
          As workloads grow, so does the overtime hustle! Managing extra hours
          fairly and efficiently is tough—especially for big organizations like
          FPT. That’s where FPT’s Request steps in! Our smart system streamlines
          overtime registration, approval, and calculation, making the process
          smooth, transparent, and hassle-free. No more guesswork—just fairness,
          efficiency, and happy employees!
        </p>
      </motion.section>
    </div>
  );
};

export default IntroSection;
