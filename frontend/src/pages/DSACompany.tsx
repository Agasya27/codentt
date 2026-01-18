import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Building2, Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { BackgroundShapes } from "@/components/codepad/BackgroundShapes";
import { Header } from "@/components/codepad/Header";
import { ProblemPanel } from "@/components/codepad/ProblemPanel";
import { Problem } from "@/data/mockProblems";
import { cn } from "@/lib/utils";

const companyList = [
  "Google",
  "Amazon",
  "Microsoft",
  "Meta",
  "Apple",
  "Netflix",
  "Adobe",
  "Uber",
  "Flipkart",
  "Infosys",
];

const companyIcons: Record<string, string> = {
  google: "🔍",
  amazon: "📦",
  microsoft: "🪟",
  meta: "👥",
  apple: "🍎",
  netflix: "🎬",
  adobe: "🖌️",
  uber: "🚗",
  flipkart: "🛒",
  infosys: "💼",
};

const questionsByCompany: Record<string, { id: number; title: string; difficulty: "Easy" | "Medium" | "Hard" }[]> = {
  google: [
    { id: 1, title: "Two Sum", difficulty: "Easy" },
    { id: 2, title: "Longest Substring Without Repeating Characters", difficulty: "Medium" },
    { id: 3, title: "Median of Two Sorted Arrays", difficulty: "Hard" },
    { id: 4, title: "Container With Most Water", difficulty: "Medium" },
    { id: 5, title: "3Sum", difficulty: "Medium" },
    { id: 6, title: "Letter Combinations of Phone Number", difficulty: "Medium" },
    { id: 7, title: "Valid Parentheses", difficulty: "Easy" },
    { id: 8, title: "Merge K Sorted Lists", difficulty: "Hard" },
    { id: 9, title: "Trapping Rain Water", difficulty: "Hard" },
    { id: 10, title: "Word Search II", difficulty: "Hard" },
  ],
  amazon: [
    { id: 1, title: "LRU Cache", difficulty: "Medium" },
    { id: 2, title: "Number of Islands", difficulty: "Medium" },
    { id: 3, title: "Word Ladder", difficulty: "Hard" },
    { id: 4, title: "Min Stack", difficulty: "Medium" },
    { id: 5, title: "Serialize and Deserialize Binary Tree", difficulty: "Hard" },
    { id: 6, title: "Product of Array Except Self", difficulty: "Medium" },
    { id: 7, title: "Kth Largest Element in Array", difficulty: "Medium" },
    { id: 8, title: "Merge Intervals", difficulty: "Medium" },
    { id: 9, title: "Meeting Rooms II", difficulty: "Medium" },
    { id: 10, title: "Course Schedule", difficulty: "Medium" },
  ],
  microsoft: [
    { id: 1, title: "Reverse Linked List", difficulty: "Easy" },
    { id: 2, title: "Add Two Numbers", difficulty: "Medium" },
    { id: 3, title: "Spiral Matrix", difficulty: "Medium" },
    { id: 4, title: "Set Matrix Zeroes", difficulty: "Medium" },
    { id: 5, title: "Group Anagrams", difficulty: "Medium" },
    { id: 6, title: "Rotate Image", difficulty: "Medium" },
    { id: 7, title: "Find First and Last Position", difficulty: "Medium" },
    { id: 8, title: "Search in Rotated Sorted Array", difficulty: "Medium" },
    { id: 9, title: "Copy List with Random Pointer", difficulty: "Medium" },
    { id: 10, title: "Binary Tree Level Order Traversal", difficulty: "Medium" },
  ],
  meta: [
    { id: 1, title: "Valid Palindrome", difficulty: "Easy" },
    { id: 2, title: "Move Zeroes", difficulty: "Easy" },
    { id: 3, title: "Binary Tree Right Side View", difficulty: "Medium" },
    { id: 4, title: "Subarray Sum Equals K", difficulty: "Medium" },
    { id: 5, title: "Random Pick with Weight", difficulty: "Medium" },
    { id: 6, title: "Lowest Common Ancestor", difficulty: "Medium" },
    { id: 7, title: "Alien Dictionary", difficulty: "Hard" },
    { id: 8, title: "Range Sum of BST", difficulty: "Easy" },
    { id: 9, title: "Diameter of Binary Tree", difficulty: "Easy" },
    { id: 10, title: "Accounts Merge", difficulty: "Medium" },
  ],
  apple: [
    { id: 1, title: "First Missing Positive", difficulty: "Hard" },
    { id: 2, title: "Maximum Subarray", difficulty: "Medium" },
    { id: 3, title: "Climbing Stairs", difficulty: "Easy" },
    { id: 4, title: "Best Time to Buy and Sell Stock", difficulty: "Easy" },
    { id: 5, title: "Longest Palindromic Substring", difficulty: "Medium" },
    { id: 6, title: "House Robber", difficulty: "Medium" },
    { id: 7, title: "Word Break", difficulty: "Medium" },
    { id: 8, title: "Coin Change", difficulty: "Medium" },
    { id: 9, title: "Longest Increasing Subsequence", difficulty: "Medium" },
    { id: 10, title: "Decode Ways", difficulty: "Medium" },
  ],
  netflix: [
    { id: 1, title: "Design Hit Counter", difficulty: "Medium" },
    { id: 2, title: "Rate Limiter", difficulty: "Medium" },
    { id: 3, title: "LFU Cache", difficulty: "Hard" },
    { id: 4, title: "Find Median from Data Stream", difficulty: "Hard" },
    { id: 5, title: "Sliding Window Maximum", difficulty: "Hard" },
    { id: 6, title: "Time Based Key-Value Store", difficulty: "Medium" },
    { id: 7, title: "Design Search Autocomplete", difficulty: "Hard" },
    { id: 8, title: "Top K Frequent Elements", difficulty: "Medium" },
    { id: 9, title: "Task Scheduler", difficulty: "Medium" },
    { id: 10, title: "Reorganize String", difficulty: "Medium" },
  ],
  adobe: [
    { id: 1, title: "String to Integer (atoi)", difficulty: "Medium" },
    { id: 2, title: "Zigzag Conversion", difficulty: "Medium" },
    { id: 3, title: "Integer to Roman", difficulty: "Medium" },
    { id: 4, title: "Roman to Integer", difficulty: "Easy" },
    { id: 5, title: "Longest Common Prefix", difficulty: "Easy" },
    { id: 6, title: "Remove Nth Node From End", difficulty: "Medium" },
    { id: 7, title: "Generate Parentheses", difficulty: "Medium" },
    { id: 8, title: "Swap Nodes in Pairs", difficulty: "Medium" },
    { id: 9, title: "Next Permutation", difficulty: "Medium" },
    { id: 10, title: "Search Insert Position", difficulty: "Easy" },
  ],
  uber: [
    { id: 1, title: "Design Parking System", difficulty: "Easy" },
    { id: 2, title: "Cheapest Flights Within K Stops", difficulty: "Medium" },
    { id: 3, title: "Network Delay Time", difficulty: "Medium" },
    { id: 4, title: "Path With Maximum Probability", difficulty: "Medium" },
    { id: 5, title: "Minimum Cost to Reach Destination", difficulty: "Medium" },
    { id: 6, title: "Evaluate Division", difficulty: "Medium" },
    { id: 7, title: "Reconstruct Itinerary", difficulty: "Hard" },
    { id: 8, title: "Find the City With Smallest Number", difficulty: "Medium" },
    { id: 9, title: "Shortest Path in Binary Matrix", difficulty: "Medium" },
    { id: 10, title: "Pacific Atlantic Water Flow", difficulty: "Medium" },
  ],
  flipkart: [
    { id: 1, title: "Stock Buy and Sell II", difficulty: "Medium" },
    { id: 2, title: "Largest Rectangle in Histogram", difficulty: "Hard" },
    { id: 3, title: "Maximal Rectangle", difficulty: "Hard" },
    { id: 4, title: "Candy Distribution", difficulty: "Hard" },
    { id: 5, title: "Jump Game", difficulty: "Medium" },
    { id: 6, title: "Jump Game II", difficulty: "Medium" },
    { id: 7, title: "Gas Station", difficulty: "Medium" },
    { id: 8, title: "Partition Labels", difficulty: "Medium" },
    { id: 9, title: "Queue Reconstruction by Height", difficulty: "Medium" },
    { id: 10, title: "Non-overlapping Intervals", difficulty: "Medium" },
  ],
  infosys: [
    { id: 1, title: "Palindrome Number", difficulty: "Easy" },
    { id: 2, title: "Power of Two", difficulty: "Easy" },
    { id: 3, title: "Fizz Buzz", difficulty: "Easy" },
    { id: 4, title: "Single Number", difficulty: "Easy" },
    { id: 5, title: "Contains Duplicate", difficulty: "Easy" },
    { id: 6, title: "Missing Number", difficulty: "Easy" },
    { id: 7, title: "Find All Duplicates", difficulty: "Medium" },
    { id: 8, title: "Set Mismatch", difficulty: "Easy" },
    { id: 9, title: "Third Maximum Number", difficulty: "Easy" },
    { id: 10, title: "Majority Element", difficulty: "Easy" },
  ],
};

const difficultyStyles: Record<Problem["difficulty"], string> = {
  Easy: "bg-emerald-100 text-emerald-600",
  Medium: "bg-amber-100 text-amber-700",
  Hard: "bg-red-100 text-red-600",
};

const difficultyPriority: Record<Problem["difficulty"], number> = {
  Easy: 0,
  Medium: 1,
  Hard: 2,
};

const dsaLanguages = [
  { id: "python", name: "Python" },
  { id: "java", name: "Java" },
  { id: "c", name: "C" },
  { id: "cpp", name: "C++" },
  { id: "javascript", name: "JavaScript" },
];

const toTitleCase = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

const buildStarterCode = (title: string): Record<string, string> => ({
  python: `# ${title}
# Outline your solution in Python
def solve():
    """Implement your algorithm here."""
    return None

if __name__ == "__main__":
    print(solve())
`,
  javascript: `// ${title}
// Outline your solution in JavaScript
function solve() {
  // TODO: implement
  return null;
}

console.log(solve());
`,
  java: `// ${title}
// Outline your solution in Java
public class Solution {
    public static Object solve() {
        // TODO: implement
        return null;
    }

    public static void main(String[] args) {
        System.out.println(solve());
    }
}
`,
  cpp: `// ${title}
// Outline your solution in C++
#include <bits/stdc++.h>
using namespace std;

int solve() {
    // TODO: implement
    return 0;
}

int main() {
    cout << solve() << "\n";
    return 0;
}
`,
});

const fallbackProblem: Problem = {
  id: 0,
  title: "Warm-up Array Exploration",
  difficulty: "Easy",
  company: "generic",
  companyIcon: "🚀",
  description: "Start with a quick warm-up to get into problem-solving mode before tackling company questions.",
  examples: [
    { input: "nums = [1,2,3,4]", output: "10" },
    { input: "nums = [5,5,5]", output: "15" },
  ],
  constraints: ["Keep your first attempt simple.", "Focus on readability over micro-optimizations."],
  starterCode: buildStarterCode("Warm-up Array Exploration"),
  testCases: [
    { input: "[1,2,3,4]", expectedOutput: "10" },
    { input: "[5,5,5]", expectedOutput: "15" },
  ],
};

const buildProblemsForCompany = (companyKey: string): Problem[] => {
  const questions = questionsByCompany[companyKey] ?? questionsByCompany.google;
  const icon = companyIcons[companyKey] ?? "🏢";
  const companyName = toTitleCase(companyKey);

  return questions.map((question) => ({
    id: question.id,
    title: question.title,
    difficulty: question.difficulty,
    company: companyKey,
    companyIcon: icon,
    description: `Practice ${question.title} from ${companyName} interview loops. Emphasize clarity, optimal complexity, and trade-offs while you code.`,
    examples: [
      { input: `Sample input for ${question.title}`, output: "Review the prompt to determine the output." },
      { input: "Edge case scenario", output: "Handle boundary conditions carefully." },
    ],
    constraints: [
      `${companyName} expects a ${question.difficulty.toLowerCase()}-level solution with strong communication.`,
      "Consider time, space, and potential follow-up questions.",
    ],
    starterCode: buildStarterCode(question.title),
    testCases: [
      { input: "Sample input", expectedOutput: "Expected output" },
      { input: "Edge case input", expectedOutput: "Edge case output" },
    ],
  }));
};

const DSACompany = () => {
  const { company } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const companyKey = (company ?? "google").toLowerCase();
  const problems = useMemo(() => buildProblemsForCompany(companyKey), [companyKey]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const problemOptions = useMemo(
    () =>
      problems
        .map((item, index) => ({ problem: item, index }))
        .sort((a, b) => {
          const diff = difficultyPriority[a.problem.difficulty] - difficultyPriority[b.problem.difficulty];
          if (diff !== 0) {
            return diff;
          }
          return a.problem.title.localeCompare(b.problem.title);
        }),
    [problems],
  );

  const selectedOption = useMemo(
    () => problemOptions.find((option) => option.index === currentIndex),
    [problemOptions, currentIndex],
  );

  const difficultySummary = useMemo(
    () =>
      problemOptions.reduce(
        (acc, { problem }) => {
          acc[problem.difficulty] += 1;
          return acc;
        },
        { Easy: 0, Medium: 0, Hard: 0 },
      ),
    [problemOptions],
  );

  useEffect(() => {
    setCurrentIndex(0);
  }, [companyKey]);

  const currentProblem = problems[currentIndex] ?? fallbackProblem;
  const companyName = toTitleCase(companyKey);
  const companyIcon = companyIcons[companyKey] ?? "🏢";

  const cycleProblem = () => {
    if (!problems.length) {
      return;
    }
    setCurrentIndex((index) => (index + 1) % problems.length);
  };

  const handleSelectProblem = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background text-foreground">
      <BackgroundShapes />

      <Header onLeaveWorkspace={() => navigate("/dsa")} />

      <div className="px-4 pb-12 md:px-6">
        <div className="mx-auto w-full max-w-[1600px] space-y-8">
          <div className="glass-card flex flex-col gap-5 rounded-3xl border border-border/40 bg-background/80 p-6 shadow-xl backdrop-blur-xl">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-3xl">
                  {companyIcon}
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Currently solving</p>
                  <h1 className="text-2xl font-semibold text-foreground md:text-3xl">{currentProblem.title}</h1>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
                    <Badge
                      variant="secondary"
                      className={cn(
                        "rounded-full px-3 py-1 font-semibold",
                        difficultyStyles[currentProblem.difficulty],
                      )}
                    >
                      {currentProblem.difficulty}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="flex items-center gap-2 rounded-full border-primary/40 bg-primary/5 text-primary"
                    >
                      <span>{companyIcon}</span>
                      {companyName}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button
                  variant="outline"
                  className="rounded-full border-border/50 bg-background/80 px-5 py-2 text-sm font-medium shadow-sm backdrop-blur"
                  onClick={cycleProblem}
                >
                  Next challenge
                </Button>
                <Button
                  className="rounded-full bg-gradient-to-r from-primary/90 to-primary px-5 py-2 text-sm font-semibold shadow-lg shadow-primary/40"
                  onClick={() =>
                    navigate("/codepad", {
                      state: {
                        origin: "dsa",
                        problem: currentProblem,
                        languages: dsaLanguages,
                        defaultLanguage: "python",
                        returnTo: location.pathname,
                      },
                    })
                  }
                >
                  Open sandbox
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground md:max-w-3xl">
              Rotate through vetted {companyName} interview prompts. Focus on walking through your thought process out
              loud while you codify your approach and document trade-offs.
            </p>
          </div>

          <div className="flex flex-col gap-8 xl:flex-row">
            <aside className="flex w-full flex-shrink-0 flex-col gap-6 xl:w-96 2xl:w-[420px]">
              <div className="glass-card rounded-3xl border border-border/40 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Company</p>
                    <h2 className="text-2xl font-semibold text-foreground">{companyName}</h2>
                    <p className="text-sm text-muted-foreground">{problems.length} curated challenges</p>
                  </div>
                  <span className="text-3xl" aria-hidden="true">
                    {companyIcon}
                  </span>
                </div>

                <div className="mt-5">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex w-full items-center justify-between rounded-xl border border-border/40 bg-background/70 px-3 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:border-border">
                      <span className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        {companyName}
                      </span>
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56">
                      {companyList.map((label) => (
                        <DropdownMenuItem key={label} asChild>
                          <Link to={`/dsa/${label.toLowerCase()}`} className="flex items-center gap-2">
                            <span>{companyIcons[label.toLowerCase()] ?? "🏢"}</span>
                            <span>{label}</span>
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="glass-card w-full max-w-[420px] rounded-3xl border border-border/40">
                <div className="border-b border-border/40 px-6 py-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Question Bank</p>
                </div>

                <div className="space-y-5 px-6 py-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Selected challenge</p>
                      <p className="mt-1 line-clamp-2 text-sm font-semibold text-foreground">
                        {currentProblem.title}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          className="flex items-center gap-2 rounded-full border border-border/40 bg-background/80 px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-foreground transition hover:border-primary/40 hover:text-primary"
                          disabled={!problemOptions.length}
                        >
                          <span className="line-clamp-1 max-w-[160px] text-left">
                            {selectedOption ? `#${selectedOption.problem.id} · ${selectedOption.problem.title}` : "No problems"}
                          </span>
                          <ChevronDown className="h-3.5 w-3.5" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-72 max-h-72 overflow-auto">
                        {problemOptions.map(({ problem, index: originalIndex }) => {
                          const isActive = originalIndex === currentIndex;
                          return (
                            <DropdownMenuItem
                              key={problem.id}
                              onSelect={(event) => {
                                event.preventDefault();
                                handleSelectProblem(originalIndex);
                              }}
                              className="flex items-start gap-3 px-3 py-2"
                            >
                              <Check className={cn("mt-0.5 h-4 w-4 text-primary", isActive ? "opacity-100" : "opacity-0")} />
                              <div className="flex flex-1 flex-col">
                                <span className="line-clamp-2 text-sm font-semibold text-foreground">{problem.title}</span>
                                <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                                  <Badge
                                    variant="secondary"
                                    className={cn("rounded-full px-2 py-0.5 font-semibold", difficultyStyles[problem.difficulty])}
                                  >
                                    {problem.difficulty}
                                  </Badge>
                                  <span className="font-mono text-[10px] text-muted-foreground/80">#{problem.id}</span>
                                </div>
                              </div>
                            </DropdownMenuItem>
                          );
                        })}

                        {!problemOptions.length && (
                          <DropdownMenuItem disabled className="text-xs text-muted-foreground">
                            We are curating a new interview set for this company.
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                    <Badge
                      variant="secondary"
                      className={cn("rounded-full px-2.5 py-1 font-semibold", difficultyStyles[currentProblem.difficulty])}
                    >
                      {currentProblem.difficulty}
                    </Badge>
                    <Badge variant="outline" className="rounded-full border-border/50 bg-background/80 px-2.5 py-1 font-medium text-muted-foreground">
                      {companyName}
                    </Badge>
                    <span>{problemOptions.length} problems</span>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {(["Easy", "Medium", "Hard"] as const).map((tier) => (
                      <div key={tier} className="rounded-2xl border border-border/40 bg-background/85 px-3 py-2 text-center">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{tier}</p>
                        <p className="mt-1 text-sm font-semibold text-foreground">{difficultySummary[tier]}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            <div className="flex-1">
              <div className="min-h-[520px]">
                <ProblemPanel problem={currentProblem} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DSACompany;
