import { useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { profileData } from "@/data/profileData";

export function AboutSection() {
  const { about, technologies } = profileData;
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const controls = useAnimation();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          controls.start("visible");
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [controls]);

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-24 bg-secondary"
    >
      <motion.div
        className="container mx-auto px-6"
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        variants={variants}
      >
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/3 mb-8 md:mb-0">
            <h2 className="section-heading">About Me</h2>
          </div>
          <motion.div className="w-full md:w-2/3" variants={variants}>
            <motion.p
              className="text-lg mb-6 leading-relaxed"
              variants={itemVariants}
            >
              {about.description}
            </motion.p>
            <motion.p
              className="text-lg mb-6 leading-relaxed"
              variants={itemVariants}
            >
              {about.background}
            </motion.p>
            <motion.div className="mt-8" variants={itemVariants}>
              <h3 className="text-xl font-poppins font-bold mb-4">
                Technologies I work with:
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {technologies.map((tech, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center bg-background p-4 rounded-lg"
                    variants={itemVariants}
                  >
                    <span
                      className="text-accent mr-3 text-xl"
                      dangerouslySetInnerHTML={{ __html: tech.icon }}
                    ></span>
                    <span>{tech.name}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
