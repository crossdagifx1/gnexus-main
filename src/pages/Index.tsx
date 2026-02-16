import { HeroSection } from "@/components/HeroSection";
import { ServicesSection } from "@/components/ServicesSection";
import { GNexusSection } from "@/components/GNexusSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { ProcessSection } from "@/components/ProcessSection";
import { TeamSection } from "@/components/TeamSection";
import { GNexusAIImportance } from "@/components/GNexusAIImportance";
import { ContactSection } from "@/components/ContactSection";
import { CTABanner } from "@/components/CTABanner";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

export default function Index() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <GNexusSection />
      <TestimonialsSection />
      <ProcessSection />
      <TeamSection />
      <GNexusAIImportance />
      <ContactSection />
      <CTABanner />
      <Footer />
    </div>
  );
}
