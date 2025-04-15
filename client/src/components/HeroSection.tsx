import { motion } from "framer-motion";
import { profileData } from "@/data/profileData";
import { Github, Linkedin, Twitter, Dribbble } from "lucide-react";

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
      className="pt-32 pb-24 bg-background min-h-screen flex items-center"
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
            <div className="relative aspect-square overflow-hidden rounded-3xl border-2 border-accent shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                alt={`${name}'s professional portrait`}
                className="w-full h-full object-cover"
              />
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
            <div className="flex space-x-4">
              <a
                href="#work"
                className="px-6 py-3 bg-accent text-white font-medium rounded-md transition-all hover:bg-opacity-90 shadow-lg hover:shadow-xl"
              >
                View My Work
              </a>
              <a
                href="#contact"
                className="px-6 py-3 border-2 border-accent text-accent font-medium rounded-md transition-all hover:bg-accent hover:bg-opacity-10"
              >
                Contact Me
              </a>
            </div>
            <div className="mt-8 flex items-center space-x-6">
              {socialLinks.map((link) => (
                <a
                  key={link.platform}
                  href={link.url}
                  className="text-xl hover:text-accent transition-colors"
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
