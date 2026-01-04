import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Database, Building2, Server, HardDrive } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/landing/Navbar";
import ComingSoonModal from "@/components/landing/ComingSoonModal";

const companies = [
  { name: "Google", logo: "🔍" },
  { name: "Amazon", logo: "📦" },
  { name: "Microsoft", logo: "🪟" },
  { name: "Meta", logo: "👤" },
  { name: "Apple", logo: "🍎" },
  { name: "Netflix", logo: "🎬" },
  { name: "Oracle", logo: "🔴" },
  { name: "Uber", logo: "🚗" },
  { name: "Flipkart", logo: "🛒" },
  { name: "TCS", logo: "💼" },
];

const features = [
  { icon: Database, title: "SQL Mastery", description: "Learn complex queries and optimizations" },
  { icon: Building2, title: "Company Wise", description: "Questions from actual interviews" },
  { icon: Server, title: "System Design", description: "Database architecture concepts" },
  { icon: HardDrive, title: "Normalization", description: "Deep dive into database theory" },
];

const DBMSLanding = () => {
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
              <Database className="h-4 w-4 text-primary" />
              <span className="text-sm text-primary font-medium">Database Management Systems</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Conquer <span className="text-gradient">DBMS</span> Interviews
            </h1>
            
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
              Master SQL queries, normalization, transactions, and system design. Practice real interview questions from top companies.
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

      {/* Companies Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Practice by Company</h2>
            <p className="text-muted-foreground">Select a company to practice their most asked DBMS questions</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
            {companies.map((company) => (
              <Link
                key={company.name}
                to={`/dbms/${company.name.toLowerCase()}`}
                className="group bg-card border border-border rounded-xl p-6 text-center hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300"
              >
                <div className="text-4xl mb-3">{company.logo}</div>
                <h3 className="font-semibold group-hover:text-primary transition-colors">{company.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">10 Questions</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Topics Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Topics Covered</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
            {["SQL Basics", "Joins", "Subqueries", "Normalization", "ACID Properties", "Indexing", "Transactions", "Deadlocks", "ER Diagrams", "Views", "Stored Procedures", "Triggers"].map((topic) => (
              <span key={topic} className="px-4 py-2 bg-card border border-border rounded-full text-sm font-medium">
                {topic}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Master DBMS?</h2>
          <p className="text-muted-foreground mb-8">Pick a company and begin practicing today!</p>
          <Link to={`/dbms/${companies[0].name.toLowerCase()}`}>
            <Button size="lg" className="rounded-full gap-2">
              Start with {companies[0].name}
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default DBMSLanding;