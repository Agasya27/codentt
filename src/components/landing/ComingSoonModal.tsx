import { Rocket, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ComingSoonModal = ({ isOpen, onClose }: ComingSoonModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md text-center">
        <DialogHeader className="space-y-4">
          {/* Icon */}
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center animate-pulse-glow">
            <Rocket className="h-8 w-8 text-primary" />
          </div>

          <DialogTitle className="text-2xl font-bold">
            <span className="text-gradient">Coming Soon!</span>
          </DialogTitle>

          <DialogDescription className="text-muted-foreground text-base">
            We're putting the finishing touches on something amazing. Codentt is launching soon to help you ace your tech interviews!
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 space-y-4">
          {/* Features Preview */}
          <div className="flex flex-wrap justify-center gap-2">
            {["DSA", "DBMS", "HR Prep", "AI Resume"].map((feature) => (
              <span
                key={feature}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
              >
                <Sparkles className="h-3 w-3" />
                {feature}
              </span>
            ))}
          </div>

          {/* CTA */}
          <Button
            onClick={onClose}
            className="w-full glow-primary-hover"
          >
            Got it, I'll wait!
          </Button>

          <p className="text-sm text-muted-foreground">
            Stay tuned for updates on{" "}
            <a href="#" className="text-primary hover:underline">
              Twitter
            </a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ComingSoonModal;
