import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { Check, CheckSquare, FileInput, FileOutput, Maximize2, Minimize2, RotateCcw } from "lucide-react";
import { Problem } from "@/data/mockProblems";
import { cn } from "@/lib/utils";
import type { LanguageOption } from "./languageTypes";
export type { LanguageOption } from "./languageTypes";

interface CodeEditorPanelProps {
  problem: Problem;
  languages?: LanguageOption[];
  defaultLanguage?: string;
  isFullscreen?: boolean;
  onToggleFullscreen?: (value: boolean) => void;
}

const DEFAULT_LANGUAGES: LanguageOption[] = [
  { id: "python", name: "Python 3" },
  { id: "javascript", name: "JavaScript" },
  { id: "java", name: "Java" },
  { id: "c", name: "C" },
  { id: "cpp", name: "C++" },
];

const DEFAULT_STARTER_SNIPPETS: Record<string, string> = {
  python: `def solution(*args):
    """Implement your algorithm here."""
    return None


if __name__ == "__main__":
    print(solution())
`,
  javascript: `function solution(...args) {
  // Implement your algorithm here
  return null;
}

console.log(solution());
`,
  java: `public class Solution {
    public static Object solution(Object... args) {
        // Implement your algorithm here
        return null;
    }

    public static void main(String[] args) {
        System.out.println(solution());
    }
}
`,
  cpp: `#include <bits/stdc++.h>
using namespace std;

int solution() {
    // Implement your algorithm here
    return 0;
}

int main() {
    cout << solution() << "\\n";
    return 0;
}
`,
  c: `#include <stdio.h>

int solution(void) {
    /* Implement your algorithm here */
    return 0;
}

int main(void) {
    printf("%d\\n", solution());
    return 0;
}
`,
};

export function CodeEditorPanel({
  problem,
  languages,
  defaultLanguage,
  isFullscreen = false,
  onToggleFullscreen,
}: CodeEditorPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  const availableLanguages = useMemo(
    () => (languages?.length ? languages : DEFAULT_LANGUAGES),
    [languages],
  );

  const getStarterCode = useCallback(
    (languageId: string) => problem.starterCode[languageId] ?? DEFAULT_STARTER_SNIPPETS[languageId] ?? "",
    [problem],
  );

  const initialLanguage = useMemo(() => {
    const fallback = availableLanguages[0]?.id ?? DEFAULT_LANGUAGES[0].id;
    if (defaultLanguage && availableLanguages.some((option) => option.id === defaultLanguage)) {
      return defaultLanguage;
    }
    return fallback;
  }, [availableLanguages, defaultLanguage]);

  const [selectedLanguage, setSelectedLanguage] = useState(initialLanguage);
  const [code, setCode] = useState(() => getStarterCode(initialLanguage));
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTestTab, setActiveTestTab] = useState<"input" | "output" | "expected">("output");
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (initialLanguage && initialLanguage !== selectedLanguage) {
      setSelectedLanguage(initialLanguage);
      setCode(getStarterCode(initialLanguage));
    }
  }, [getStarterCode, initialLanguage, selectedLanguage]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        panelRef.current,
        { x: 80, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: 0.3 },
      );

      gsap.to(editorRef.current, {
        boxShadow: "0 0 30px rgba(56, 189, 248, 0.22)",
        duration: 2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    });

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    setCode(getStarterCode(selectedLanguage));
    setShowResults(false);
  }, [getStarterCode, problem, selectedLanguage]);

  const handleRun = () => {
    setIsRunning(true);
    setActiveTestTab("output");

    gsap.to("[data-run-btn]", {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
    });

    setTimeout(() => {
      setIsRunning(false);
      setShowResults(true);

      gsap.fromTo(
        "[data-results]",
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" },
      );
    }, 1500);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);

    gsap.to("[data-submit-btn]", {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
    });

    setTimeout(() => {
      setIsSubmitting(false);
      setShowResults(true);

      gsap
        .timeline()
        .fromTo("[data-success-badge]", { scale: 0 }, { scale: 1, duration: 0.4, ease: "back.out(1.7)" });
    }, 2000);
  };

  const handleLanguageChange = (languageId: string) => {
    setSelectedLanguage(languageId);

    gsap.fromTo(
      editorRef.current,
      { opacity: 0.6 },
      { opacity: 1, duration: 0.3 },
    );
  };

  const getLineNumbers = () => {
    const lines = code.split("\n").length;
    return Array.from({ length: Math.max(lines, 5) }, (_, index) => index + 1);
  };

  return (
    <div
      ref={panelRef}
      className={cn(
        "relative flex h-full w-full flex-col overflow-hidden border border-border/40 bg-background/90 text-foreground shadow-2xl shadow-primary/10 backdrop-blur-xl",
        isFullscreen ? "rounded-none" : "rounded-3xl",
      )}
    >
      <div className="relative z-10 flex items-center justify-between border-b border-border/30 bg-background/85 px-6 py-5 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
            Live Workspace
          </span>
          <h2 className="text-xl font-semibold">Code Editor</h2>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {availableLanguages.map((languageOption) => {
              const isActive = languageOption.id === selectedLanguage;
              return (
                <button
                  key={languageOption.id}
                  onClick={() => handleLanguageChange(languageOption.id)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-all",
                    isActive
                      ? "border-primary/60 bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                      : "border-border/50 bg-background/80 text-muted-foreground hover:border-primary/40 hover:text-primary",
                  )}
                >
                  {languageOption.name}
                </button>
              );
            })}
          </div>

          {onToggleFullscreen && (
            <button
              onClick={() => onToggleFullscreen(!isFullscreen)}
              className="flex items-center gap-2 rounded-full border border-border/40 bg-background/80 px-4 py-2 text-sm font-medium shadow-inner shadow-primary/5 transition-colors hover:border-primary/40 hover:text-primary"
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              <span className="hidden sm:inline">{isFullscreen ? "Exit Fullscreen" : "Fullscreen"}</span>
            </button>
          )}

          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400/70" />
            <span className="h-2 w-2 rounded-full bg-amber-400/70" />
            <span className="h-2 w-2 rounded-full bg-rose-400/70" />
          </div>
        </div>
      </div>

      <div ref={editorRef} className="relative z-10 flex-1">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        <div className="relative h-full overflow-auto px-6 py-6 custom-scrollbar">
          <div className="relative flex min-h-[460px] rounded-3xl border border-border/30 bg-background/80 backdrop-blur">
            <div className="flex w-14 select-none flex-col items-end gap-2 border-r border-border/30 bg-background/70 px-4 py-6 font-mono text-xs leading-7 text-muted-foreground">
              {getLineNumbers().map((lineNumber) => (
                <span key={lineNumber}>{lineNumber}</span>
              ))}
            </div>

            <textarea
              value={code}
              onChange={(event) => setCode(event.target.value)}
              spellCheck={false}
              className="min-h-[460px] flex-1 resize-none bg-transparent px-6 py-6 font-mono text-[15px] leading-7 text-foreground caret-primary outline-none focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>
      </div>

      <div className="relative z-10 flex flex-wrap items-center gap-3 border-t border-border/30 bg-background/85 px-6 py-4 backdrop-blur">
        <button
          data-run-btn
          onClick={handleRun}
          disabled={isRunning || isSubmitting}
          className={cn(
            "flex items-center justify-center gap-2 rounded-full px-7 py-2 text-sm font-semibold uppercase tracking-wide transition-all",
            "bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 text-white shadow-lg shadow-sky-500/30",
            "disabled:cursor-not-allowed disabled:opacity-60",
            isRunning && "animate-pulse",
          )}
        >
          {isRunning ? (
            <>
              <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              Running...
            </>
          ) : (
            "Run"
          )}
        </button>

        <button
          data-submit-btn
          onClick={handleSubmit}
          disabled={isRunning || isSubmitting}
          className={cn(
            "flex items-center justify-center gap-2 rounded-full px-7 py-2 text-sm font-semibold uppercase tracking-wide transition-all",
            "bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-500 text-white shadow-lg shadow-emerald-500/30",
            "disabled:cursor-not-allowed disabled:opacity-60",
            isSubmitting && "animate-pulse",
          )}
        >
          {isSubmitting ? (
            <>
              <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit"
          )}
        </button>

        <button
          onClick={() => {
            setCode(getStarterCode(selectedLanguage));
            setShowResults(false);
          }}
          className="flex items-center gap-2 rounded-full border border-border/40 bg-background/75 px-5 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground transition hover:border-primary/40 hover:text-primary"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </button>
      </div>

      <div className="relative z-10 border-t border-border/30 bg-background/85">
        <div className="flex flex-wrap items-center gap-2 border-b border-border/30 px-6 py-3">
          <span className="mr-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Test Case</span>

          <button
            onClick={() => setActiveTestTab("input")}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium transition-colors",
              activeTestTab === "input"
                ? "bg-primary/10 text-primary shadow-inner shadow-primary/10"
                : "text-muted-foreground hover:bg-primary/5 hover:text-primary",
            )}
          >
            <FileInput className="h-3 w-3" />
            Input
          </button>

          <button
            onClick={() => setActiveTestTab("output")}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium transition-colors",
              activeTestTab === "output"
                ? "bg-primary/10 text-primary shadow-inner shadow-primary/10"
                : "text-muted-foreground hover:bg-primary/5 hover:text-primary",
            )}
          >
            <FileOutput className="h-3 w-3" />
            Output
          </button>

          <button
            onClick={() => setActiveTestTab("expected")}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium transition-colors",
              activeTestTab === "expected"
                ? "bg-primary/10 text-primary shadow-inner shadow-primary/10"
                : "text-muted-foreground hover:bg-primary/5 hover:text-primary",
            )}
          >
            <CheckSquare className="h-3 w-3" />
            Expected
          </button>

          <button
            onClick={handleRun}
            className="ml-auto rounded-full border border-border/40 px-4 py-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground transition hover:border-primary/40 hover:text-primary"
          >
            Test Again
          </button>
        </div>

        {showResults && (
          <div data-results className="space-y-4 px-6 pb-6 pt-4">
            <div className="grid gap-3 text-sm text-foreground/90 sm:grid-cols-2">
              <p>
                <span className="text-muted-foreground">Output:</span> 3
              </p>
              <p className="flex items-center gap-2">
                <span className="text-muted-foreground">Status:</span>
                <span data-success-badge className="flex items-center gap-1 rounded-full bg-emerald-500/15 px-3 py-1 text-emerald-500">
                  <Check className="h-4 w-4" />
                  Accepted
                </span>
              </p>
              <p>
                <span className="text-muted-foreground">Runtime:</span> 8 ms
              </p>
              <p>
                <span className="text-muted-foreground">Memory:</span> 14.3 MB
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-border/30 bg-background/80">
              <table className="w-full text-sm">
                <thead className="bg-background/70 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Test Case</th>
                    <th className="px-4 py-3 text-center">Input</th>
                    <th className="px-4 py-3 text-center">Output</th>
                    <th className="px-4 py-3 text-center">Expected</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  <tr>
                    <td className="px-4 py-3 text-foreground/90">
                      <span className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-emerald-400" />
                        "abcabcbb"
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-foreground/80">"abcabcbb"</td>
                    <td className="px-4 py-3 text-center text-foreground/80">3</td>
                    <td className="px-4 py-3 text-center text-foreground/80">3</td>
                  </tr>
                </tbody>
              </table>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/30 bg-background/70 px-4 py-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-2 text-emerald-500">
                  <Check className="h-4 w-4" />
                  All tests passed
                </span>
                <button
                  onClick={handleRun}
                  className="rounded-full border border-border/40 px-4 py-1.5 font-medium uppercase tracking-wide text-muted-foreground transition hover:border-primary/40 hover:text-primary"
                >
                  Test Again
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
