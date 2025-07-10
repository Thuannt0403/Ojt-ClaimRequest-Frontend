import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-card";
import feature from "../HeroSection/key-feature.json";
import PhaiSVG from '@/assets/phai.svg';
import TraiSVG from '@/assets/trai.svg';

const HeroSection = ({ isVisible }: { isVisible: boolean }) => {
  const navigate = useNavigate();
  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 1 }}
      className="relative min-h-screen flex items-center justify-center bg-[url('https://res.cloudinary.com/crs2025/image/upload/v1743240808/bg-fpt_p32s28.jpg')] bg-cover bg-center text-white"
    >
      <motion.img
        // src="/src/assets/phai.svg"
        src={PhaiSVG}
        alt="Background Shape"
        className="absolute inset-0 w-full h-full object-cover"
        initial={{ x: "100%", opacity: 0 }}
        animate={isVisible ? { x: 0, opacity: 1 } : { x: "100%", opacity: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />

      <motion.img
        // src="/src/assets/trai.svg"
        src={TraiSVG}
        alt="Background Shape"
        className="absolute inset-0 w-full h-full object-cover"
        initial={{ x: "-100%", opacity: 0 }}
        animate={isVisible ? { x: 0, opacity: 1 } : { x: "-100%", opacity: 0 }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
      />

      {/* Content Overlay */}
      <div className="absolute top-1/3 left-10 z-10">
        <motion.h1
          initial={{ x: -100, opacity: 0 }}
          animate={isVisible ? { x: 0, opacity: 1 } : { x: -100, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 1 }}
          className="text-2xl md:text-5xl font-bold mb-4"
        >
          Claim Requests with FPT
        </motion.h1>

        <motion.p
          initial={{ x: -100, opacity: 0 }}
          animate={isVisible ? { x: 0, opacity: 1 } : { x: -100, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 1.2 }}
          className="text-lg md:text-base"
        >
          Empower your team with a{" "}
          <span className="text-lg md:text-xl text-green-400 font-semibold">
            Centralized,
          </span>
        </motion.p>

        <motion.p
          initial={{ x: -100, opacity: 0 }}
          animate={isVisible ? { x: 0, opacity: 1 } : { x: -100, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 1.8 }}
          className="text-lg md:text-base"
        >
          <span className="text-lg md:text-xl text-orange-400 font-semibold">
            Efficient Claim Request System
          </span>
        </motion.p>

        <motion.p
          initial={{ x: -100, opacity: 0 }}
          animate={isVisible ? { x: 0, opacity: 1 } : { x: -100, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 2.4 }}
          className="text-lg md:text-base mb-6"
        >
          for faster approvals, improved accuracy, and seamless management.
        </motion.p>
        <motion.button
          onClick={() => navigate("/login")}
          className="relative bg-gradient-to-r from-orange-500 to-green-500 hover:from-green-600 hover:to-blue-700 text-white font-bold py-5 px-8 rounded-2xl border-2 border-white shadow-lg"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={
            isVisible
              ? {
                  opacity: 1,
                  scale: 1,
                  boxShadow: [
                    "0 0 10px #fff",
                    "0 0 20px #fff",
                    "0 0 10px #fff",
                  ],
                }
              : { opacity: 0, scale: 0.8 }
          }
          transition={{
            opacity: { duration: 0.6, ease: "easeOut" },
            scale: { duration: 0.6, ease: "easeOut" },
            boxShadow: { repeat: Infinity, duration: 1.5, ease: "easeInOut" },
          }}
        >
          Get Started Now
        </motion.button>

        <motion.div
          className="py-7 absolute overflow-visible"
          initial={{ y: 50, opacity: 0 }}
          animate={isVisible ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
        >
          <InfiniteMovingCards items={feature} direction="right" speed="fast" />
        </motion.div>
      </div>
    </motion.section>
  );
};

export default HeroSection;
