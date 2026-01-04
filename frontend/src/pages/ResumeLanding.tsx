import { useState } from "react";
import { Link } from "react-router-dom";
import { FileText, Sparkles, CheckCircle2, Clock, Wand2, Download, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/landing/Navbar";
import ComingSoonModal from "@/components/landing/ComingSoonModal";

const features = [
  { icon: Wand2, title: "AI-Powered Review", description: "Get instant feedback on your resume" },
  { icon: CheckCircle2, title: "ATS Compatible", description: "Ensure your resume passes screening" },
  { icon: Download, title: "Multiple Formats", description: "Export to PDF, Word, and more" },
  { icon: Star, title: "Pro Templates", description: "Choose from professional designs" },
];

const templates = [
  { name: "Modern Developer", type: "Technical" },
  { name: "Clean Professional", type: "General" },
  { name: "Creative Designer", type: "Design" },
  { name: "Data Scientist", type: "Analytics" },
];

const ResumeLanding = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar onCtaClick={() => setIsModalOpen(true)} />
      <ComingSoonModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-blush-texture opacity-50" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <FileText className="h-4 w-4 text-primary" />
              <span className="text-sm text-primary font-medium">Resume Builder & AI Review</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Build a <span className="text-gradient">Resume</span> That Stands Out
            </h1>
            
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
              Create ATS-friendly resumes with AI-powered suggestions. Get instant feedback and stand out from thousands of applicants.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              {features.map((feature) => (
                <div key={feature.title} className="bg-card border border-border rounded-xl p-4 text-left">
                  <feature.icon className="h-8 w-8 text-primary mb-2" />
                  <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-sm text-primary font-medium">Coming Soon</span>
            </div>
            
            <h2 className="text-3xl font-bold mb-6">We're Crafting the Perfect Resume Builder</h2>
            <p className="text-muted-foreground mb-8">
              Our AI-powered resume builder is under development. Create professional resumes, get instant feedback, and land your dream job.
            </p>

            {/* Template Preview */}
            <div className="bg-card border border-border rounded-xl p-6 text-left">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Templates Coming Soon
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {templates.map((template, index) => (
                  <div key={index} className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                    <div className="w-12 h-16 bg-background border border-border rounded flex items-center justify-center">
                      <FileText className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{template.name}</h4>
                      <span className="text-xs text-muted-foreground">{template.type}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* What to expect */}
            <div className="mt-8 bg-card border border-border rounded-xl p-6 text-left">
              <h3 className="font-semibold mb-4">What to Expect</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                  <span className="text-sm text-muted-foreground">Drag-and-drop resume builder with real-time preview</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                  <span className="text-sm text-muted-foreground">AI analysis with actionable improvement suggestions</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                  <span className="text-sm text-muted-foreground">ATS score checker to ensure your resume gets noticed</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                  <span className="text-sm text-muted-foreground">Industry-specific templates optimized for tech roles</span>
                </li>
              </ul>
            </div>

            <Link to="/">
              <Button variant="outline" className="mt-8 rounded-full">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ResumeLanding;