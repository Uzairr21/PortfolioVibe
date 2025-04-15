import { useState, useRef, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { profileData } from "@/data/profileData";
import { Github, ExternalLink, Dribbble } from "lucide-react";

export function WorkSection() {
  const { projects } = profileData;
  const [activeFilter, setActiveFilter] = useState("All");
  const [filteredProjects, setFilteredProjects] = useState(projects);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const controls = useAnimation();

  // Handle category filter change
  const handleFilterChange = (category: string) => {
    setActiveFilter(category);
    
    if (category === "All") {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(
        projects.filter((project) => project.category === category)
      );
    }
  };

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

  const categories = ["All", "Web Apps", "UI/UX", "Mobile"];

  const sectionVariants = {
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
      id="work"
      ref={sectionRef}
      className="py-24 bg-background"
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
          Featured Work
        </motion.h2>
        <motion.p
          className="text-center max-w-xl mx-auto mb-12 opacity-80"
          variants={itemVariants}
        >
          A selection of my recent projects and collaborations that showcase my skills and expertise.
        </motion.p>

        {/* Portfolio Filter */}
        <motion.div
          className="flex flex-wrap justify-center mb-12 gap-2"
          variants={itemVariants}
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleFilterChange(category)}
              className={`px-4 py-2 rounded-full bg-secondary font-medium transition-all ${
                activeFilter === category
                  ? "text-accent bg-accent bg-opacity-10"
                  : "hover:text-accent"
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Portfolio Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={sectionVariants}
        >
          {filteredProjects.map((project, index) => (
            <motion.div
              key={index}
              className="bg-secondary rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
              variants={itemVariants}
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                  <div className="p-4">
                    <span className="bg-accent text-white text-xs px-2 py-1 rounded-full">
                      {project.category}
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-poppins font-bold mb-2">
                  {project.title}
                </h3>
                <p className="text-sm opacity-80 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-background px-2 py-1 rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between">
                  <a
                    href={project.demo}
                    className="text-accent hover:underline text-sm font-medium"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Project
                  </a>
                  <div className="flex space-x-3">
                    {project.github && (
                      <a
                        href={project.github}
                        className="text-sm hover:text-accent transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub Repository"
                      >
                        <Github className="h-4 w-4" />
                      </a>
                    )}
                    {project.dribbble && (
                      <a
                        href={project.dribbble}
                        className="text-sm hover:text-accent transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Dribbble"
                      >
                        <Dribbble className="h-4 w-4" />
                      </a>
                    )}
                    <a
                      href={project.demo}
                      className="text-sm hover:text-accent transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Live Demo"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div className="text-center mt-12" variants={itemVariants}>
          <a
            href="#"
            className="inline-flex items-center text-accent hover:underline"
          >
            <span className="mr-2">View More Projects</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
