import { useState } from "react";
import { Link } from "react-router-dom";
import { MessageSquare, Users, Target, Brain, Sparkles, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/landing/Navbar";
import ComingSoonModal from "@/components/landing/ComingSoonModal";

const topics = [
  "Tell me about yourself",
  "Why should we hire you?",
  "Where do you see yourself in 5 years?",
  "What are your strengths and weaknesses?",
  "Why do you want to work here?",
  "Describe a challenging situation",
  "How do you handle pressure?",
  "What motivates you?",
];

const features = [
  { icon: MessageSquare, title: "100+ Questions", description: "Curated HR questions from real interviews" },
  { icon: Brain, title: "STAR Method", description: "Learn the proven framework for answers" },
  { icon: Users, title: "Mock Interviews", description: "Practice with AI-powered simulations" },
  { icon: Target, title: "Personalized Tips", description: "Get feedback tailored to your responses" },
];

const HRLanding = () => {
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
              <MessageSquare className="h-4 w-4 text-primary" />
              <span className="text-sm text-primary font-medium">HR Interview Preparation</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Ace Your <span className="text-gradient">HR</span> Rounds
            </h1>
            
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
              Master behavioral questions, build confidence, and make a lasting impression. Practice with questions asked at top companies.
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
            
            <h2 className="text-3xl font-bold mb-6">We're Building Something Amazing</h2>
            <p className="text-muted-foreground mb-8">
              Our HR interview preparation module is under development. Get ready for AI-powered mock interviews, personalized feedback, and comprehensive question banks.
            </p>

            {/* Preview Topics */}
            <div className="bg-card border border-border rounded-xl p-6 text-left">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Sample Questions Coming
              </h3>
              <div className="space-y-3">
                {topics.map((topic, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <span className="text-primary font-semibold text-sm">{index + 1}.</span>
                    <span className="text-sm">{topic}</span>
                  </div>
                ))}
              </div>
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

export default HRLanding;