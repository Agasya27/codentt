import { ArrowRight, Code2, Database, MessageSquare, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface HeroProps {
  onCtaClick: () => void;
}

const Hero = ({ onCtaClick }: HeroProps) => {
  const pillars = [
    { icon: Code2, label: "DSA", href: "/dsa", desc: "Data Structures" },
    { icon: Database, label: "DBMS", href: "/dbms", desc: "Database Systems" },
    { icon: MessageSquare, label: "HR", href: "/hr", desc: "Interview Prep" },
    { icon: FileText, label: "Resume", href: "/resume", desc: "AI Builder" },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-blush-texture" />
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      
      {/* Floating Decorative Elements */}
      <div className="absolute top-1/4 left-10 w-32 h-32 bg-primary/8 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-10 w-40 h-40 bg-primary/8 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 opacity-0 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-sm text-primary font-medium">Built for CS students & freshers</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 opacity-0 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Where Your{" "}
            <span className="text-gradient">Code</span>
            <br />
            Meets Your{" "}
            <span className="text-gradient">Career</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto opacity-0 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            Your launchpad to crack tech interviews with confidence. Practice real problems, build daily habits, and land your dream job.
          </p>

          {/* Pillars - Now with Links */}
          <div className="flex flex-wrap justify-center gap-4 mb-10 opacity-0 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            {pillars.map((pillar, index) => (
              <Link
                key={pillar.label}
                to={pillar.href}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
                style={{ animationDelay: `${0.5 + index * 0.1}s` }}
              >
                <pillar.icon className="h-5 w-5 text-primary" />
                <span className="font-medium">{pillar.label}</span>
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="opacity-0 animate-fade-in" style={{ animationDelay: "0.6s" }}>
            <Button
              size="lg"
              onClick={onCtaClick}
              className="text-lg px-8 py-6 glow-primary animate-pulse-glow hover:scale-105 transition-transform duration-300 rounded-full"
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Tagline */}
          <p className="mt-8 text-sm text-muted-foreground opacity-0 animate-fade-in" style={{ animationDelay: "0.7s" }}>
            This isn't just prep. This is <span className="text-primary font-semibold">precision-engineered growth</span>.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
