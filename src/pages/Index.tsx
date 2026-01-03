import { useState } from "react";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import Testimonials from "@/components/landing/Testimonials";
import FAQ from "@/components/landing/FAQ";
import Footer from "@/components/landing/Footer";
import ComingSoonModal from "@/components/landing/ComingSoonModal";

const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCtaClick = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar onCtaClick={handleCtaClick} />
      <Hero onCtaClick={handleCtaClick} />
      <Features />
      <HowItWorks />
      <Testimonials />
      <FAQ />
      <Footer />
      <ComingSoonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Index;
