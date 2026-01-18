import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MessageSquare, Send } from "lucide-react";
import { BackgroundShapes } from "@/components/codepad/BackgroundShapes";
import { CodeEditorPanel } from "@/components/codepad/CodeEditorPanel";
import type { LanguageOption } from "@/components/codepad/languageTypes";
import { Header } from "@/components/codepad/Header";
import { ProblemPanel } from "@/components/codepad/ProblemPanel";
import { mockProblems } from "@/data/mockProblems";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

const DEFAULT_DISCUSSION_COMMENTS = [
  "Loved this sliding window breakdown!",
  "Watch out for edge cases on duplicates.",
];

const DSA_LANGUAGES: LanguageOption[] = [
  { id: "python", name: "Python" },
  { id: "java", name: "Java" },
  { id: "c", name: "C" },
  { id: "cpp", name: "C++" },
  { id: "javascript", name: "JavaScript" },
];

type SandboxState = {
  origin?: "dsa" | "dbms" | string;
  problem?: typeof mockProblems[number];
  languages?: LanguageOption[];
  defaultLanguage?: string;
  returnTo?: string;
};

const CodePad = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as SandboxState) ?? {};
  const pinnedProblem = state.problem;
  const [isEditorFullscreen, setIsEditorFullscreen] = useState(false);
  const [discussionInput, setDiscussionInput] = useState("");
  const [localComments, setLocalComments] = useState<string[]>([]);

  const currentProblem = useMemo(() => {
    if (pinnedProblem) {
      return pinnedProblem;
    }
    return mockProblems[0];
  }, [pinnedProblem]);

  useEffect(() => {
    setDiscussionInput("");
    setLocalComments([]);
  }, [currentProblem.id]);

  useEffect(() => {
    document.body.style.overflow = isEditorFullscreen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isEditorFullscreen]);

  const commentFeed = useMemo(
    () => [...localComments, ...DEFAULT_DISCUSSION_COMMENTS],
    [localComments],
  );

  const resolvedLanguages = useMemo(() => {
    if (state.languages?.length) {
      return state.languages;
    }
    if (state.origin === "dsa") {
      return DSA_LANGUAGES;
    }
    return undefined;
  }, [state.languages, state.origin]);

  const resolvedDefaultLanguage = useMemo(() => {
    if (state.defaultLanguage) {
      return state.defaultLanguage;
    }
    if (state.origin === "dsa") {
      return "python";
    }
    return undefined;
  }, [state.defaultLanguage, state.origin]);

  const handleLeaveWorkspace = () => {
    if (state.returnTo) {
      navigate(state.returnTo);
      return;
    }
    navigate(-1);
  };

  const handleDiscussionChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
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

  if (isEditorFullscreen) {
    return (
      <div className="relative min-h-screen w-full overflow-hidden bg-background">
        <BackgroundShapes />
        <div className="relative z-10 flex min-h-screen flex-col">
          <Header onLeaveWorkspace={handleLeaveWorkspace} leaveLabel="Quit Sandbox" />
          <div className="flex flex-1 flex-col px-0">
            <div className="flex flex-1 px-4 pb-6 pt-6 md:px-6">
              <div className="flex h-full w-full">
                <CodeEditorPanel
                  problem={currentProblem}
                  languages={resolvedLanguages}
                  defaultLanguage={resolvedDefaultLanguage}
                  isFullscreen
                  onToggleFullscreen={setIsEditorFullscreen}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      <BackgroundShapes />

      <div className="relative z-10 flex min-h-screen flex-col">
        <Header onLeaveWorkspace={handleLeaveWorkspace} leaveLabel="Quit Sandbox" />

        <main className="mx-auto flex w-full max-w-[1600px] flex-1 gap-4 px-6 pb-6">
          <div className="flex h-full min-w-[320px] flex-[0.42] overflow-hidden">
            <ProblemPanel problem={currentProblem} showDiscussion={false} />
          </div>

          <div className="flex h-full flex-1">
            <CodeEditorPanel
              problem={currentProblem}
              languages={resolvedLanguages}
              defaultLanguage={resolvedDefaultLanguage}
              isFullscreen={false}
              onToggleFullscreen={setIsEditorFullscreen}
            />
          </div>
        </main>

        <footer className="mx-auto w-full max-w-[1600px] px-6 pb-10">
          <div className="glass-card flex flex-col gap-6 rounded-3xl border border-border/40 bg-background/85 p-6 shadow-xl shadow-primary/10">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Discussion Forum</p>
              </div>
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">
                {commentFeed.length} contributions
              </span>
            </div>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
              <div className="flex flex-col gap-3 rounded-2xl border border-border/40 bg-background/75 p-4">
                <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Share insights</label>
                <textarea
                  value={discussionInput}
                  onChange={handleDiscussionChange}
                  placeholder="Add your commentary or interview tips for this problem..."
                  className="h-28 w-full resize-none rounded-xl border border-border/30 bg-background/60 px-4 py-3 text-sm leading-6 text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
                />
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    className="rounded-full px-5 font-semibold uppercase tracking-wide"
                    onClick={handlePostComment}
                  >
                    <Send className="h-4 w-4" />
                    Post Comment
                  </Button>
                </div>
              </div>

              <ScrollArea className="max-h-64 rounded-2xl border border-border/40 bg-background/75 p-4 custom-scrollbar">
                <div className="space-y-4">
                  {commentFeed.map((comment, index) => (
                    <div key={`${comment}-${index}`} className="rounded-2xl border border-border/40 bg-background/80 p-4 shadow-sm">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-primary/30 bg-primary/5">
                          <AvatarFallback className="text-xs font-semibold text-primary">
                            {currentProblem.companyIcon}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-semibold text-foreground">Community Member</p>
                          <p className="text-xs text-muted-foreground">Just now</p>
                        </div>
                      </div>
                      <Separator className="my-3 bg-border/40" />
                      <p className="text-sm leading-6 text-foreground/80">{comment}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default CodePad;
