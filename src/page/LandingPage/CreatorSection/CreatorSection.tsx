import { motion } from "framer-motion";
import { InfiniteImageCarousel } from "@/components/ui/infinite-moving-img-card";
import creators from "./creator.json";
import "../IntroSection/Text.css";

const CreatorSection = ({ isVisible }: { isVisible: boolean }) => {
  const slideUpVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <section className="min-h-screen flex flex-col justify-center bg-gradient-to-b from-zinc-100 to-gray-300 relative">
      <motion.h2
        variants={slideUpVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        transition={{ duration: 0.2, ease: "easeOut", delay: 0.2 }}
        className="text-5xl font-bold text-center text-black mb-6 shimmer-text pt-28"
      >
        Meet Our Creators
      </motion.h2>
      <motion.h2
        variants={slideUpVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        transition={{ duration: 0.2, ease: "easeOut", delay: 1 }}
        className="text-center text-xl text-gray-600"
      >
        Every great system needs a solid foundation—just like every claim needs
        approval!
      </motion.h2>
      <motion.h2
        variants={slideUpVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        transition={{ duration: 0.2, ease: "easeOut", delay: 1.8 }}
        className="text-center text-xl text-gray-600 mb-2"
      >
        Meet the architect behind our Claim Request System, who’s been debugging
        life (and C# code) one request at a time.
      </motion.h2>
      <motion.div
        variants={slideUpVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        transition={{ duration: 0.2, ease: "easeOut", delay: 0.4 }}
        className="flex-grow flex items-center justify-center"
      >
        <InfiniteImageCarousel
          items={creators}
          direction="left"
          speed="normal"
          pauseOnHover={true}
          className="w-full"
          isVisible={isVisible} // Pass isVisible to control animation
        />
      </motion.div>
    </section>
  );
};

export default CreatorSection;
