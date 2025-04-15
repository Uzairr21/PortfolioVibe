import { profileData } from "@/data/profileData";
import { Github, Linkedin, Twitter, Dribbble } from "lucide-react";

export function Footer() {
  const { name, socialLinks } = profileData;
  const currentYear = new Date().getFullYear();

  const iconMap = {
    github: <Github className="h-5 w-5" />,
    linkedin: <Linkedin className="h-5 w-5" />,
    twitter: <Twitter className="h-5 w-5" />,
    dribbble: <Dribbble className="h-5 w-5" />,
  };

  return (
    <footer className="bg-secondary py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <a href="#" className="text-xl font-poppins font-bold">
              <span className="text-accent">Port</span>
              <span>folio</span>
            </a>
            <p className="mt-2 opacity-80">Designing & building digital experiences</p>
          </div>
          <div className="flex flex-col items-center md:items-end">
            <div className="flex space-x-4 mb-4">
              {socialLinks.map((link) => (
                <a
                  key={link.platform}
                  href={link.url}
                  className="text-lg hover:text-accent transition-colors"
                  aria-label={link.platform}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {iconMap[link.platform as keyof typeof iconMap]}
                </a>
              ))}
            </div>
            <p className="opacity-80 text-sm">
              © {currentYear} {name}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
