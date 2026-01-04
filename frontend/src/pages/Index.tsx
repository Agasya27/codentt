import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import Testimonials from "@/components/landing/Testimonials";
import FAQ from "@/components/landing/FAQ";
import Footer from "@/components/landing/Footer";
import ComingSoonModal from "@/components/landing/ComingSoonModal";
import { isAuthenticated, storeIntendedRoute } from "@/lib/auth";

const Index = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCtaClick = () => {
    // Check if user is authenticated
    if (isAuthenticated()) {
      // User is logged in - navigate to the intended page (default: /dsa)
      navigate("/dsa");
    } else {
      // User is not logged in - store intended route and redirect to login
      storeIntendedRoute("/dsa");
      toast.info("Please log in to continue", {
        description: "You need to be logged in to access this feature.",
      });
      navigate("/auth/login");
    }
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
