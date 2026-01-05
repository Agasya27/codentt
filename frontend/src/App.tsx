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

const queryClient = new QueryClient();

// NOTE: Ideally, convert your Drive link to a direct asset or put the file in /public/logo.png
// For now, I am using a placeholder, please replace with your actual file path.
const LOGO_URL = "https://lh3.googleusercontent.com/d/1ooJlbR-uQdmS1faLFWIxKJ97sBpwjOSk";

// Landing Page Component (from code2)
const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#F0F4F8] text-slate-800 font-sans overflow-x-hidden">
      
      {/* --- Navbar --- */}
      <nav className="fixed w-full z-50 bg-[#F0F4F8]/80 backdrop-blur-md border-b border-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo Section */}
            <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
              <img src={LOGO_URL} alt="Codentt Logo" className="h-10 w-auto object-contain" />
              <span className="font-bold text-2xl tracking-tight text-slate-800">Codentt</span>
            </div>
            
            {/* Desktop Nav */}
            <div className="hidden md:flex space-x-8 items-center">
              <a href="/dsa" className="text-slate-600 hover:text-codentt-blue font-medium transition-colors">
                DSA Prep
              </a>
              <a href="/hr" className="text-slate-600 hover:text-codentt-blue font-medium transition-colors">
                Mock Interviews
              </a>
              <a href="#" className="text-slate-600 hover:text-codentt-blue font-medium transition-colors">
                Resume Builder
              </a>
              <a href="#" className="text-slate-600 hover:text-codentt-blue font-medium transition-colors">
                Pricing
              </a>
              <a href="/auth/login" className="px-6 py-2.5 rounded-2xl bg-codentt-blue text-white font-semibold shadow-clay hover:shadow-clay-hover transition-all transform hover:-translate-y-1">
                Get Started
              </a>
            </div>
          </div>
        </div>
      </nav>

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
              <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-white shadow-inner-clay text-codentt-blue font-semibold text-sm">
                Launch your tech career
              </div>
              <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1] mb-6">
                Where Your Code <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-codentt-blue to-cyan-400">
                  Meets Your Career
                </span>
              </h1>
              <p className="text-lg text-slate-600 mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Master DSA, crack HR rounds, and build the perfect resume. The ultimate interview prep platform tailored for Indian CS students.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a href="/dsa" className="px-8 py-4 rounded-2xl bg-codentt-blue text-white font-bold text-lg shadow-clay hover:shadow-clay-hover hover:bg-blue-600 transition-all flex items-center justify-center gap-2">
                  Start Learning Now <ArrowRight size={20} />
                </a>
                <a href="#" className="px-8 py-4 rounded-2xl bg-white text-slate-700 font-bold text-lg shadow-clay hover:shadow-clay-hover transition-all border border-white">
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
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Everything you need to get hired</h2>
            <p className="text-slate-500">Comprehensive preparation for every stage of the recruitment process.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Binary size={32} />}
              title="DSA Mastery"
              desc="Interactive visualizers for Binary Trees, Graphs, and DP. Master the logic, not just the code."
              color="text-blue-600"
              link="/dsa"
            />
            <FeatureCard 
              icon={<Users size={32} />}
              title="HR & Behavioral"
              desc="AI-driven mock interviews to perfect your 'Tell me about yourself' and situational answers."
              color="text-cyan-600"
              link="/hr"
            />
             <FeatureCard 
              icon={<FileText size={32} />}
              title="Resume Optimizer"
              desc="ATS-friendly templates designed specifically for freshers and internships."
              color="text-indigo-600"
              link="#"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

// Helper Component for Cards
const FeatureCard = ({ icon, title, desc, color, link }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="bg-[#F0F4F8] p-8 rounded-[2.5rem] shadow-clay border border-white transition-all"
  >
    <div className={`w-16 h-16 rounded-2xl bg-white shadow-inner-clay flex items-center justify-center mb-6 ${color}`}>
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-800 mb-3">{title}</h3>
    <p className="text-slate-600 leading-relaxed mb-4">
      {desc}
    </p>
    <a href={link} className="text-codentt-blue font-medium hover:underline">
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