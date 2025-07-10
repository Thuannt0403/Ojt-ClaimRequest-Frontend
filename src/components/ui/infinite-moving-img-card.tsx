import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { FaGithub } from "react-icons/fa";

interface CarouselItem {
  imageUrl: string;
  title: string;
  description: string;
  githubUrl: string;
}

interface CarouselProps {
  items: CarouselItem[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
  isVisible?: boolean; // Added for AnimatedSection compatibility
}

export const InfiniteImageCarousel = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
  isVisible = true, // Default to true if not provided
}: CarouselProps) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);
  const [start, setStart] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!scrollerRef.current) return;
    const scrollerContent = Array.from(scrollerRef.current.children);

    // Duplicate items for infinite scroll
    scrollerContent.forEach((item) => {
      const duplicatedItem = item.cloneNode(true) as HTMLElement;
      scrollerRef.current!.appendChild(duplicatedItem);
    });

    getDirection();
    getSpeed();
    setStart(true);

    return () => {
      if (scrollerRef.current) {
        while (scrollerRef.current.children.length > items.length) {
          scrollerRef.current.removeChild(scrollerRef.current.lastChild!);
        }
      }
    };
  }, [items]);

  const getDirection = () => {
    if (containerRef.current) {
      containerRef.current.style.setProperty(
        "--animation-direction",
        direction === "left" ? "forwards" : "reverse"
      );
    }
  };

  const getSpeed = () => {
    if (containerRef.current) {
      containerRef.current.style.setProperty(
        "--animation-duration",
        speed === "fast" ? "20s" : speed === "normal" ? "40s" : "80s"
      );
    }
  };

  const infoVariants = {
    hidden: { y: "100%", opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex w-max min-w-full shrink-0 flex-nowrap gap-4 py-4",
          start && isVisible && "animate-scroll", // Only animate when visible
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {items.map((item, index) => (
          <li
            key={index}
            className="relative w-[300px] max-w-full shrink-0 rounded-2xl overflow-hidden border border-zinc-200 bg-gray-100 md:w-[400px] dark:border-zinc-700 dark:bg-gray-800"
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            {/* Main Image (Avatar) */}
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-96 object-cover"
            />

            {/* Always Visible Title and GitHub Icon */}
            <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/50 text-white p-2 rounded-3xl z-10">
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <a
                href={item.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-300"
                aria-label={`Visit ${item.title}'s GitHub`}
              >
                <FaGithub size={20} />
              </a>
            </div>

            {/* Hover Overlay */}
            <motion.div
              className="absolute inset-0 bg-black/80 text-white p-4 flex flex-col justify-center items-center"
              initial="hidden"
              animate={activeIndex === index ? "visible" : "hidden"}
              variants={infoVariants}
            >
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="text-sm mt-2 text-center">{item.description}</p>
            </motion.div>
          </li>
        ))}
      </ul>
    </div>
  );
};
