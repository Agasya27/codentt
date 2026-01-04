import { Code2, Database, MessageSquare, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Features = () => {
  const features = [
    {
      icon: Code2,
      title: "DSA Practice",
      description: "Master Data Structures & Algorithms with curated problems from top tech companies. Track your progress and level up daily.",
      accent: "Real coding challenges",
    },
    {
      icon: Database,
      title: "DBMS Mastery",
      description: "SQL queries, normalization, and database concepts made simple. Practice with real-world scenarios and interview questions.",
      accent: "Practical SQL skills",
    },
    {
      icon: MessageSquare,
      title: "HR Training",
      description: "Ace behavioral interviews with confidence. Practice common HR questions and learn how to present your best self.",
      accent: "Interview confidence",
    },
    {
      icon: FileText,
      title: "Resume AI",
      description: "Get instant AI-powered feedback on your resume. Optimize for ATS systems and stand out to recruiters.",
      accent: "ATS optimized",
    },
  ];

  return (
    <section id="features" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need to{" "}
            <span className="text-gradient">Succeed</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Four pillars of interview preparation, designed specifically for Indian tech job seekers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <Card
              key={feature.title}
              className="group relative overflow-hidden bg-card border-border hover:border-primary/50 transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                {/* Icon */}
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground mb-4">{feature.description}</p>

                {/* Accent Tag */}
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  {feature.accent}
                </span>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
