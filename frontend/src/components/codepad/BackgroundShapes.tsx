import { useEffect, useRef } from "react";
import gsap from "gsap";

export function BackgroundShapes() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate gradient orbs for subtle motion
      gsap.to('[data-orb="1"]', {
        x: 80,
        y: -40,
        duration: 15,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      gsap.to('[data-orb="2"]', {
        x: -60,
        y: 60,
        duration: 18,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      gsap.to('[data-orb="3"]', {
        x: 50,
        y: 50,
        duration: 12,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      // Light pulsing for depth
      gsap.to('[data-pulse]', {
        opacity: 0.4,
        duration: 3,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: 1,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden -z-10"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-slate-600 via-slate-500 to-slate-700" />

      <div
        data-orb="1"
        className="absolute top-[5%] left-[5%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-blue-400/20 to-transparent blur-3xl"
      />
      <div
        data-orb="2"
        data-pulse
        className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tl from-slate-400/15 to-transparent blur-3xl"
      />
      <div
        data-orb="3"
        className="absolute top-[40%] right-[30%] w-[300px] h-[300px] rounded-full bg-gradient-to-br from-blue-300/10 to-transparent blur-2xl"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-slate-800/30 via-transparent to-slate-800/20" />
      <div className="absolute top-0 left-1/4 w-1/2 h-1/3 bg-gradient-to-b from-white/5 to-transparent blur-2xl -skew-x-12" />
    </div>
  );
}
