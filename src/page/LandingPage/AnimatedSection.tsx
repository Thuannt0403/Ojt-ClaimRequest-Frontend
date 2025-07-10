import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

export const AnimatedSection = ({
  id,
  Component,
}: {
  id: string;
  Component: React.ElementType;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting); // Toggle visibility based on intersection
      },
      { threshold: 0.3 } // Trigger when 30% of the section is visible
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return (
    <motion.div
      ref={ref}
      id={id}
      className="min-h-screen"
      initial={{ opacity: 0, y: 50 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Component isVisible={isVisible} />{" "}
      {/* Render Component always, not conditionally */}
    </motion.div>
  );
};
