import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { Problem } from "@/data/mockProblems";
import { MessageSquare, Send } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ProblemPanelProps {
  problem: Problem;
  showDiscussion?: boolean;
}

export function ProblemPanel({ problem, showDiscussion = true }: ProblemPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [discussionInput, setDiscussionInput] = useState("");
  const [localComments, setLocalComments] = useState<string[]>([]);

  const descriptionSections = useMemo(() => {
    return problem.description
      .split(/\n{2,}/)
      .map((section) => section.replace(/\n/g, " ").trim())
      .filter(Boolean);
  }, [problem.description]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        panelRef.current,
        { x: -80, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: 0.2 },
      );

      if (contentRef.current) {
        gsap.fromTo(
          contentRef.current.children,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, stagger: 0.1, ease: "power2.out", delay: 0.5 },
        );
      }
    });

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0.5, y: 10 },
        { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" },
      );
    }
  }, [problem.id]);

  useEffect(() => {
    setDiscussionInput("");
    setLocalComments([]);
  }, [problem.id]);

  const handleCommentChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setDiscussionInput(event.target.value);
  };

  const handlePostComment = () => {
    const trimmed = discussionInput.trim();
    if (!trimmed) {
      return;
    }
    setLocalComments((comments) => [trimmed, ...comments]);
    setDiscussionInput("");
  };

  return (
    <div ref={panelRef} className="glass-card h-full flex flex-col overflow-hidden rounded-3xl border border-border/40">
      <div className="border-b border-border/30 bg-background/80 px-8 py-5">
        <h2 className="text-lg font-semibold uppercase tracking-wide text-muted-foreground opacity-80">Problem Statement</h2>
        <p className="mt-1 text-2xl font-semibold text-foreground">{problem.title}</p>
      </div>

      <ScrollArea className="flex-1 custom-scrollbar">
        <div ref={contentRef} className="space-y-8 px-8 py-8">
          <div className="space-y-4 text-base leading-7 text-muted-foreground">
            {descriptionSections.map((section, index) => (
              <p key={index}>{section}</p>
            ))}
          </div>

          <div className="space-y-5">
            {problem.examples.map((example, index) => (
              <div
                key={index}
                className="rounded-2xl border border-border/40 bg-background/75 p-5 backdrop-blur-sm"
              >
                <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Example {index + 1}
                </p>
                <div className="space-y-2 text-sm leading-6 text-foreground/90">
                  <p>
                    <span className="font-semibold text-foreground">Input:</span>{" "}
                    {example.input}
                  </p>
                  <p>
                    <span className="font-semibold text-foreground">Output:</span>{" "}
                    {example.output}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-border/40 bg-background/75 p-5 backdrop-blur-sm">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Constraints</p>
            <ul className="space-y-2 text-sm leading-6 text-foreground/80">
              {problem.constraints.map((constraint, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary/70" aria-hidden="true" />
                  <span>{constraint}</span>
                </li>
              ))}
            </ul>
          </div>

          {showDiscussion && (
            <div className="space-y-4 rounded-2xl border border-border/40 bg-background/75 p-5 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-primary" />
                <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Discussion Forum</p>
              </div>

              <div className="rounded-2xl border border-border/40 bg-background/90 px-4 py-3">
                <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Share insights</label>
                <textarea
                  value={discussionInput}
                  onChange={handleCommentChange}
                  placeholder="Add your commentary or interview tips for this problem..."
                  className="mt-2 h-28 w-full resize-none rounded-xl bg-transparent text-sm leading-6 text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
                <div className="mt-3 flex items-center justify-end">
                  <button
                    onClick={handlePostComment}
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary-foreground shadow-primary/30 transition-colors hover:bg-primary/90"
                  >
                    <Send className="h-3.5 w-3.5" />
                    Post Comment
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {[...localComments, "Loved this sliding window breakdown!", "Watch out for edge cases on duplicates."].map(
                  (comment, index) => (
                    <div key={`${comment}-${index}`} className="rounded-2xl border border-border/40 bg-background/85 p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 border border-primary/30 bg-primary/5">
                          <AvatarFallback className="text-xs font-semibold text-primary">
                            {problem.companyIcon}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-semibold text-foreground">Community Member</p>
                          <p className="text-xs text-muted-foreground">Shared just now</p>
                        </div>
                      </div>
                      <Separator className="my-3 bg-border/40" />
                      <p className="text-sm leading-6 text-foreground/90">{comment}</p>
                    </div>
                  ),
                )}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

    </div>
  );
}
