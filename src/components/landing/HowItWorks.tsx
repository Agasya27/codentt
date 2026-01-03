import { UserPlus, Target, Briefcase } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: UserPlus,
      step: "01",
      title: "Sign Up",
      description: "Create your free account in seconds. No credit card required.",
    },
    {
      icon: Target,
      step: "02",
      title: "Build Habits",
      description: "Follow personalized daily practice routines tailored to your goals.",
    },
    {
      icon: Briefcase,
      step: "03",
      title: "Get Hired",
      description: "Ace your interviews and land your dream tech job with confidence.",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-surface">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How It{" "}
            <span className="text-gradient">Works</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Three simple steps to transform your interview preparation journey.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting Line - Desktop */}
            <div className="hidden md:block absolute top-16 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

            {steps.map((item, index) => (
              <div
                key={item.step}
                className="relative flex flex-col items-center text-center group"
              >
                {/* Step Number & Icon */}
                <div className="relative mb-6">
                  <div className="w-20 h-20 rounded-full bg-card border-2 border-primary/30 flex items-center justify-center group-hover:border-primary transition-colors duration-300 group-hover:scale-110 transition-transform">
                    <item.icon className="h-8 w-8 text-primary" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                    {item.step}
                  </span>
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground max-w-xs">{item.description}</p>

                {/* Mobile Connector */}
                {index < steps.length - 1 && (
                  <div className="md:hidden w-0.5 h-8 bg-primary/30 my-4" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
