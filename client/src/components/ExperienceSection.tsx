import { useState, useRef, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { profileData } from "@/data/profileData";

export function ExperienceSection() {
  const { experiences } = profileData;
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

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.2,
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
      id="experience"
      ref={sectionRef}
      className="py-24 bg-secondary"
    >
      <motion.div
        className="container mx-auto px-6"
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        variants={sectionVariants}
      >
        <motion.h2
          className="text-3xl md:text-4xl font-poppins font-bold text-center mb-4"
          variants={itemVariants}
        >
          Work Experience
        </motion.h2>
        <motion.p
          className="text-center max-w-xl mx-auto mb-12 opacity-80"
          variants={itemVariants}
        >
          My professional journey and the companies I've had the pleasure to work with.
        </motion.p>

        {/* Experience Timeline */}
        <motion.div className="max-w-3xl mx-auto" variants={sectionVariants}>
          {experiences.map((experience, index) => (
            <motion.div
              key={index}
              className={`mb-12 relative pl-8 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-accent ${
                index === experiences.length - 1 ? "mb-0" : ""
              }`}
              variants={itemVariants}
            >
              <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-accent"></div>
              <div className="mb-1 flex flex-wrap items-center">
                <h3 className="text-xl font-poppins font-bold mr-4">
                  {experience.role}
                </h3>
                <span className="px-3 py-1 text-xs bg-background rounded-full">
                  {experience.period}
                </span>
              </div>
              <h4 className="text-accent mb-3">{experience.company}</h4>
              <p className="mb-4 opacity-80">{experience.description}</p>
              <div className="flex flex-wrap gap-2">
                {experience.technologies.map((tech, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-background px-2 py-1 rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
