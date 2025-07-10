import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Twitter, Linkedin, Facebook } from "lucide-react";

const ContactSection = ({ isVisible }: { isVisible: boolean }) => {
  // Animation variants for sliding in from bottom
  const slideUpVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <section id="contact" className="min-h-screen flex flex-col relative">
      <div className="relative w-full flex-grow flex flex-col justify-center bg-gradient-to-b from-zinc-100 to-gray-300 z-0">
        {/* Inner Content */}
        <div className="relative z-20 container mx-auto px-6">
          {/* Title */}
          <motion.div
            variants={slideUpVariants}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-6 text-black">
              Contact FPT Software
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto text-gray-600">
              Reach out to learn more about the Claim Request System or get
              support.
            </p>
          </motion.div>

          {/* Grid Layout */}
          <motion.div
            variants={slideUpVariants}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Left Column */}
            <div className="lg:col-span-1 space-y-8 mx-auto max-w-lg">
              <motion.div
                variants={slideUpVariants}
                initial="hidden"
                animate={isVisible ? "visible" : "hidden"}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
              >
                <h3 className="text-2xl font-bold flex items-center gap-2 text-neutral-900">
                  <Mail className="w-5 h-5" /> About Claim Request System
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  Developed by FPT Software, the Claim Request System
                  centralizes overtime payment claims for staff at F-Town 1, Ho
                  Chi Minh City. It reduces paperwork and streamlines approvals,
                  supporting a seamless experience since February 2018.
                </p>
              </motion.div>

              {/* Contact Details */}
              <motion.div
                variants={slideUpVariants}
                initial="hidden"
                animate={isVisible ? "visible" : "hidden"}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.8 }}
              >
                <h3 className="text-2xl font-bold flex items-center gap-2 text-neutral-900">
                  <Phone className="w-5 h-5" /> Contact Us
                </h3>
                <ul className="mt-2 text-sm space-y-4 text-gray-600">
                  <li className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>support@fptsoftware.com</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>+84 12 3456 7899</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>
                      F-Town 1, Lot T2, D1 Street, Saigon Hi-Tech Park, Tan Phu
                      Ward, Thu Duc City, HCMC, Vietnam
                    </span>
                  </li>
                </ul>
              </motion.div>
            </div>

            {/* Right Column - Social Media */}
            <div className="lg:col-span-1 flex flex-col items-start justify-center space-y-6">
              <motion.h3
                variants={slideUpVariants}
                initial="hidden"
                animate={isVisible ? "visible" : "hidden"}
                transition={{ duration: 0.6, ease: "easeOut", delay: 1.0 }}
                className="text-5xl font-bold text-neutral-900 pb-10"
              >
                Our Social Media
              </motion.h3>
              <motion.div
                variants={slideUpVariants}
                initial="hidden"
                animate={isVisible ? "visible" : "hidden"}
                transition={{ duration: 0.6, ease: "easeOut", delay: 1.2 }}
                className="flex flex-col space-y-4"
              >
                <a
                  href="https://twitter.com/fpt_software"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-600 hover:text-blue-500 space-x-3"
                >
                  <Twitter className="w-8 h-8" />
                  <span>Twitter</span>
                </a>
                <a
                  href="https://www.linkedin.com/company/fpt-software/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-600 hover:text-blue-700 space-x-3"
                >
                  <Linkedin className="w-8 h-8" />
                  <span>LinkedIn</span>
                </a>
                <a
                  href="https://www.facebook.com/fptsoftware"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-600 hover:text-blue-600 space-x-3"
                >
                  <Facebook className="w-8 h-8" />
                  <span>Facebook</span>
                </a>
                <a
                  href="mailto:support@fptsoftware.com"
                  className="flex items-center text-gray-600 hover:text-blue-600 space-x-3"
                >
                  <Mail className="w-8 h-8" />
                  <span>Email</span>
                </a>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
