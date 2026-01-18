import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";
import { Code2, Users, FileText, Binary, ArrowRight, CheckCircle } from "lucide-react";
import DSALanding from "./pages/DSALanding";
import DSACompany from "./pages/DSACompany";
import DBMSLanding from "./pages/DBMSLanding";
import DBMSCompany from "./pages/DBMSCompany";
import HRLanding from "./pages/HRLanding";
import ExpertsLanding from "./pages/ExpertsLanding";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import VerifyPhone from "./pages/VerifyPhone";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import CodePad from "@/pages/CodePad";
import Navbar from "@/components/landing/Navbar";
import ComingSoonModal from "@/components/landing/ComingSoonModal";
const queryClient = new QueryClient();

// Landing Page Component (from code2)
const LandingPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    
    <div className="min-h-screen bg-background text-foreground font-sans overflow-x-hidden">
      
      <Navbar onCtaClick={() => setIsModalOpen(true)} />
      <ComingSoonModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* --- Hero Section --- */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-white shadow-inner-clay text-primary font-semibold text-sm">
                Launch your tech career
              </div>
              <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1] mb-6">
                Where Your Code <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-codentt-blue to-cyan-400">
                  Meets Your Career
                </span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Master DSA, crack HR rounds, and build the perfect resume. The ultimate interview prep platform tailored for Indian CS students.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a href="/dsa" className="px-8 py-4 rounded-2xl bg-codentt-blue text-white font-bold text-lg shadow-clay hover:shadow-clay-hover hover:bg-blue-600 transition-all flex items-center justify-center gap-2">
                  Start Learning Now <ArrowRight size={20} />
                </a>
                <a href="#" className="px-8 py-4 rounded-2xl bg-white text-foreground font-bold text-lg shadow-clay hover:shadow-clay-hover transition-all border border-border/60">
                  View Roadmap
                </a>
              </div>
            </motion.div>

            {/* Right Visual (Placeholder for your 3D Image) */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              {/* This div mimics the placement of your generated 3D image */}
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-white rounded-[3rem] shadow-clay animate-pulse"></div>
                
                {/* REPLACE
                   File: https://lh3.googleusercontent.com/d/1Jz5jktgw8-aCE3rx2Z1B67DrfZGDSoo9

                */}
                <img 
                  src="https://lh3.googleusercontent.com/d/1Jz5jktgw8-aCE3rx2Z1B67DrfZGDSoo9" 
                  alt="3D Rocket taking off from laptop with code blocks" 
                  className="relative z-10 w-full h-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    // Fallback if image isn't generated yet
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement.innerHTML += `<div class="flex items-center justify-center h-full text-center p-8 text-codentt-blue font-bold border-4 border-dashed border-codentt-blue/30 rounded-[3rem]">Place your 3D Rocket Image Here</div>`;
                  }}
                />

                {/* Floating Elements (Decorative) */}
                <motion.div 
                  animate={{ y: [0, -20, 0] }}
                  transition={{ repeat: Infinity, duration: 4 }}
                  className="absolute -top-10 -right-10 bg-white p-4 rounded-3xl shadow-clay hidden lg:block"
                >
                  <Binary className="text-codentt-blue w-10 h-10" />
                </motion.div>
                <motion.div 
                  animate={{ y: [0, 20, 0] }}
                  transition={{ repeat: Infinity, duration: 5 }}
                  className="absolute bottom-10 -left-10 bg-white p-4 rounded-3xl shadow-clay hidden lg:block"
                >
                  <Users className="text-cyan-500 w-10 h-10" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- Features Grid (Claymorphism Style) --- */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">Everything you need to get hired</h2>
            <p className="text-muted-foreground">Comprehensive preparation for every stage of the recruitment process.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Binary size={32} />}
              title="DSA Mastery"
              desc="Interactive visualizers for Binary Trees, Graphs, and DP. Master the logic, not just the code."
              link="/dsa"
            />
            <FeatureCard 
              icon={<Users size={32} />}
              title="HR & Behavioral"
              desc="AI-driven mock interviews to perfect your 'Tell me about yourself' and situational answers."
              link="/hr"
            />
             <FeatureCard 
              icon={<FileText size={32} />}
              title="Resume Optimizer"
              desc="ATS-friendly templates designed specifically for freshers and internships."
              link="#"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

// Helper Component for Cards
const FeatureCard = ({ icon, title, desc, link }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="bg-secondary p-8 rounded-[2.5rem] shadow-clay border border-border transition-all"
  >
    <div className="w-16 h-16 rounded-2xl bg-white shadow-inner-clay flex items-center justify-center mb-6 text-primary">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-foreground mb-3">{title}</h3>
    <p className="text-muted-foreground leading-relaxed mb-4">
      {desc}
    </p>
    <a href={link} className="text-primary font-medium hover:underline">
      Explore →
    </a>
  </motion.div>
);

// Main App Component
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dsa" element={<DSALanding />} />
          <Route path="/dsa/:company" element={<DSACompany />} />
          <Route path="/dbms" element={<DBMSLanding />} />
          <Route path="/dbms/:company" element={<DBMSCompany />} />
          <Route path="/codepad" element={<CodePad />} />
          <Route path="/hr" element={<HRLanding />} />
          <Route path="/experts" element={<ExpertsLanding />} />
          {/* Authentication Routes */}
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/verify-email" element={<VerifyEmail />} />
          <Route path="/auth/verify-phone" element={<VerifyPhone />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />
          <Route path="/auth/reset-password" element={<ResetPassword />} />
          {/* Profile Route */}
          <Route path="/profile" element={<Profile />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;