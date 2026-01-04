import { useState } from "react";
import { Link } from "react-router-dom";
import { Users, Video, Calendar, Star, MessageCircle, Clock, ArrowRight, Briefcase, GraduationCap, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/landing/Navbar";
import ComingSoonModal from "@/components/landing/ComingSoonModal";

const experts = [
  {
    name: "Rahul Sharma",
    role: "Senior SDE at Google",
    expertise: ["DSA", "System Design"],
    rating: 4.9,
    sessions: 120,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=rahul"
  },
  {
    name: "Priya Patel",
    role: "Engineering Manager at Amazon",
    expertise: ["Leadership", "HR Interviews"],
    rating: 4.8,
    sessions: 85,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya"
  },
  {
    name: "Arun Kumar",
    role: "Staff Engineer at Microsoft",
    expertise: ["DBMS", "Backend"],
    rating: 4.9,
    sessions: 150,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=arun"
  },
  {
    name: "Sneha Reddy",
    role: "Principal SDE at Meta",
    expertise: ["Frontend", "React"],
    rating: 4.7,
    sessions: 95,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=sneha"
  },
];

const features = [
  { icon: Video, title: "1:1 Sessions", description: "Private video calls with industry experts" },
  { icon: Calendar, title: "Flexible Scheduling", description: "Book sessions at your convenience" },
  { icon: MessageCircle, title: "Mock Interviews", description: "Realistic interview simulations" },
  { icon: Award, title: "Personalized Feedback", description: "Detailed feedback on your performance" },
];

const categories = [
  { icon: Briefcase, title: "Technical Interviews", count: 45 },
  { icon: Users, title: "HR & Behavioral", count: 32 },
  { icon: GraduationCap, title: "Career Guidance", count: 28 },
];

const ExpertsLanding = () => {
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
              <Users className="h-4 w-4 text-primary" />
              <span className="text-sm text-primary font-medium">Connect with Industry Experts</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Get Mentored by <span className="text-gradient">Top Professionals</span>
            </h1>
            
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
              Book 1:1 sessions with engineers from Google, Amazon, Microsoft, and more. Get personalized guidance for your tech career.
            </p>

            <Button 
              onClick={() => setIsModalOpen(true)}
              className="rounded-full px-8 py-6 text-lg gap-2 group"
            >
              Browse Experts
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {features.map((feature) => (
              <div key={feature.title} className="bg-card border border-border rounded-xl p-6 text-center">
                <feature.icon className="h-10 w-10 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">Expertise Areas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {categories.map((cat) => (
              <div key={cat.title} className="bg-card border border-border rounded-xl p-6 flex items-center gap-4 hover:border-primary/50 transition-colors cursor-pointer" onClick={() => setIsModalOpen(true)}>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <cat.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{cat.title}</h3>
                  <p className="text-sm text-muted-foreground">{cat.count} Experts</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Experts */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold">Featured Experts</h2>
            <Button variant="outline" className="rounded-full gap-2" onClick={() => setIsModalOpen(true)}>
              View All
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {experts.map((expert) => (
              <div key={expert.name} className="bg-card border border-border rounded-xl p-6 hover:shadow-lg hover:border-primary/30 transition-all cursor-pointer" onClick={() => setIsModalOpen(true)}>
                <img 
                  src={expert.image} 
                  alt={expert.name}
                  className="w-20 h-20 rounded-full mx-auto mb-4 bg-muted"
                />
                <h3 className="font-semibold text-center mb-1">{expert.name}</h3>
                <p className="text-sm text-muted-foreground text-center mb-3">{expert.role}</p>
                
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  {expert.expertise.map((skill) => (
                    <span key={skill} className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                      {skill}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span>{expert.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Video className="h-4 w-4" />
                    <span>{expert.sessions} sessions</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coming Soon Banner */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center bg-card border border-border rounded-2xl p-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-sm text-primary font-medium">Coming Soon</span>
            </div>
            
            <h2 className="text-2xl font-bold mb-4">Expert Sessions Launching Soon</h2>
            <p className="text-muted-foreground mb-6">
              We're finalizing partnerships with top industry professionals. Join the waitlist to get early access and exclusive rates.
            </p>
            
            <Link to="/">
              <Button variant="outline" className="rounded-full">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ExpertsLanding;
