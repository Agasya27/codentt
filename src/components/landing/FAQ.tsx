import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "Who is Codentt for?",
      answer: "Codentt is built specifically for final-year Computer Science students and freshers in India who are preparing for tech interviews. Whether you're targeting product companies, startups, or service-based organizations, our platform helps you prepare systematically.",
    },
    {
      question: "Is Codentt free to use?",
      answer: "We offer a generous free tier that includes access to basic DSA problems, limited HR questions, and a sample resume review. Premium plans unlock unlimited practice, AI-powered resume feedback, and personalized learning paths.",
    },
    {
      question: "What topics are covered?",
      answer: "Our platform covers four core areas: Data Structures & Algorithms (arrays, trees, graphs, DP, etc.), DBMS (SQL queries, normalization, transactions), HR interview preparation (behavioral questions, situational responses), and Resume optimization with AI feedback.",
    },
    {
      question: "How is Codentt different from other platforms?",
      answer: "Unlike generic coding platforms, Codentt is designed specifically for the Indian job market. We focus on building daily habits, not just solving problems. Our AI-powered resume feedback and curated HR questions are tailored to what Indian recruiters actually look for.",
    },
    {
      question: "Can I track my progress?",
      answer: "Absolutely! Codentt provides detailed analytics on your preparation journey. Track your daily streaks, see topic-wise performance, identify weak areas, and celebrate milestones as you progress toward interview readiness.",
    },
  ];

  return (
    <section id="faq" className="py-24 bg-surface">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Frequently Asked{" "}
            <span className="text-gradient">Questions</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need to know about Codentt.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card border border-border rounded-lg px-6 data-[state=open]:border-primary/30 transition-colors duration-300"
              >
                <AccordionTrigger className="text-left font-semibold hover:text-primary hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
