import { motion } from "framer-motion";
import { profileData } from "@/data/profileData";
import { Github, Linkedin, Twitter, Dribbble, FileText } from "lucide-react";

export function HeroSection() {
  const { name, title, summary, socialLinks } = profileData;

  const iconMap = {
    github: <Github className="h-5 w-5" />,
    linkedin: <Linkedin className="h-5 w-5" />,
    twitter: <Twitter className="h-5 w-5" />,
    dribbble: <Dribbble className="h-5 w-5" />,
  };

  return (
    <section
      id="hero"
      className="pt-20 pb-16 bg-background h-[100vh] max-h-[900px] flex items-center"
    >
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center md:space-x-12">
          {/* Portrait/Image area */}
          <motion.div
            className="w-full md:w-5/12 mb-12 md:mb-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mx-auto max-w-md relative group">
              {/* Circular background container with accent/brand color */}
              <div className="absolute inset-0 rounded-full bg-accent/10 dark:bg-accent/20 transform scale-105"></div>
              
              {/* White circular border */}
              <div className="absolute inset-0 rounded-full border-[6px] border-white dark:border-white/90 transform scale-105"></div>
              
              {/* Image container */}
              <div className="rounded-full overflow-hidden aspect-square flex items-center justify-center bg-background relative z-10">
                <img
                  src="/assets/uzair-headshot.png"
                  alt={`${name}'s professional portrait`}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Glow effect on hover */}
              <div className="absolute -inset-2 rounded-full bg-accent/30 blur-lg opacity-0 group-hover:opacity-70 transition-opacity duration-500 z-0"></div>
            </div>
          </motion.div>

          {/* Text/Details area */}
          <motion.div
            className="w-full md:w-7/12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h5 className="text-accent font-medium mb-2">Hello, I'm</h5>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-poppins font-bold mb-4">
              {name}
            </h1>
            <h2 className="text-2xl md:text-3xl font-poppins mb-6 opacity-90">
              {title}
            </h2>
            <p className="text-lg mb-8 max-w-xl opacity-80 leading-relaxed">
              {summary}
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#work" className="btn-primary">
                View My Work
              </a>
              <a href="#contact" className="btn-secondary">
                Contact Me
              </a>
              <a 
                href="/assets/resume.pdf" 
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary flex items-center gap-2"
              >
                <FileText className="h-5 w-5" />
                My Resume
              </a>
            </div>
            <div className="mt-8 flex items-center space-x-6">
              {socialLinks.map((link) => (
                <a
                  key={link.platform}
                  href={link.url}
                  className="btn-icon"
                  aria-label={link.platform}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {iconMap[link.platform as keyof typeof iconMap]}
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
