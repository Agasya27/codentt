import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Rocket } from "lucide-react";

interface HeaderProps {
  isCompanyMode?: boolean;
  onToggleMode?: () => void;
  onLeaveWorkspace?: () => void;
  leaveLabel?: string;
}

export function Header({ onLeaveWorkspace, leaveLabel }: HeaderProps) {
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { y: -50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <header ref={headerRef} className="flex items-center justify-between px-6 py-4">
      <div className="glass-card flex items-center gap-3 rounded-2xl border border-border/40 bg-background/80 px-4 py-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Rocket className="h-4 w-4" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Collaborative Workspace</p>
          <h1 className="text-base font-semibold text-foreground">CodePad Sandbox</h1>
        </div>
      </div>

      <button
        onClick={onLeaveWorkspace}
        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-sky-500/40 hover:shadow-sky-500/60 hover:scale-105 transition-all duration-300"
      >
        {leaveLabel ?? "Leave Workspace"}
      </button>
    </header>
  );
}
