import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { AboutSection } from "./components/AboutSection";
import { WorkSection } from "./components/WorkSection";
import { ExperienceSection } from "./components/ExperienceSection";
import { ContactSection } from "./components/ContactSection";
import { Footer } from "./components/Footer";
import { CursorTrail } from "./components/CursorTrail";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <div className="min-h-screen bg-background font-inter text-foreground">
      <CursorTrail />
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <WorkSection />
        <ExperienceSection />
        <ContactSection />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

export default App;
