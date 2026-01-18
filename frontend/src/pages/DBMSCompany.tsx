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
  "Oracle",
  "Uber",
  "Flipkart",
  "TCS",
];

const companyIcons: Record<string, string> = {
  google: "🔍",
  amazon: "📦",
  microsoft: "🪟",
  meta: "👥",
  apple: "🍎",
  netflix: "🎬",
  oracle: "🏛️",
  uber: "🚕",
  flipkart: "🛒",
  tcs: "💼",
};

const questionsByCompany: Record<string, { id: number; title: string; topic: string }[]> = {
  google: [
    { id: 1, title: "Write a query to find the second highest salary", topic: "Subqueries" },
    { id: 2, title: "Find employees who earn more than their managers", topic: "Self Join" },
    { id: 3, title: "Get the nth highest salary using DENSE_RANK", topic: "Window Functions" },
    { id: 4, title: "Find duplicate emails in a table", topic: "Group By" },
    { id: 5, title: "Delete duplicate emails keeping one", topic: "Delete" },
    { id: 6, title: "Combine two tables using LEFT JOIN", topic: "Joins" },
    { id: 7, title: "Find customers who never order", topic: "NOT IN" },
    { id: 8, title: "Calculate running total of sales", topic: "Window Functions" },
    { id: 9, title: "Find consecutive numbers in a table", topic: "Self Join" },
    { id: 10, title: "Rank scores without gaps", topic: "DENSE_RANK" },
  ],
  amazon: [
    { id: 1, title: "Find products with above average price", topic: "Subqueries" },
    { id: 2, title: "Get top 3 products by category", topic: "Window Functions" },
    { id: 3, title: "Calculate month-over-month growth", topic: "LAG Function" },
    { id: 4, title: "Find customers with multiple orders same day", topic: "Group By" },
    { id: 5, title: "Get order details with shipping status", topic: "CASE WHEN" },
    { id: 6, title: "Find inventory below reorder level", topic: "Comparison" },
    { id: 7, title: "Calculate average order value by region", topic: "Aggregation" },
    { id: 8, title: "Find most returned products", topic: "Join & Count" },
    { id: 9, title: "Get customer lifetime value", topic: "SUM & Group By" },
    { id: 10, title: "Find peak ordering hours", topic: "Date Functions" },
  ],
  microsoft: [
    { id: 1, title: "Explain ACID properties with examples", topic: "Transactions" },
    { id: 2, title: "Difference between DELETE, TRUNCATE, DROP", topic: "DDL vs DML" },
    { id: 3, title: "Implement pagination using OFFSET FETCH", topic: "Pagination" },
    { id: 4, title: "Create a stored procedure with parameters", topic: "Procedures" },
    { id: 5, title: "Write a trigger for audit logging", topic: "Triggers" },
    { id: 6, title: "Implement transaction with savepoints", topic: "Transactions" },
    { id: 7, title: "Create and use a CTE recursively", topic: "CTE" },
    { id: 8, title: "Optimize a slow query using indexes", topic: "Indexing" },
    { id: 9, title: "Handle NULL values in comparisons", topic: "NULL Handling" },
    { id: 10, title: "Pivot data from rows to columns", topic: "PIVOT" },
  ],
  meta: [
    { id: 1, title: "Find mutual friends between users", topic: "Self Join" },
    { id: 2, title: "Calculate engagement rate by post type", topic: "Aggregation" },
    { id: 3, title: "Find trending hashtags in last 24 hours", topic: "Date & Group" },
    { id: 4, title: "Get friend suggestions based on mutual friends", topic: "Complex Join" },
    { id: 5, title: "Calculate daily active users (DAU)", topic: "DISTINCT Count" },
    { id: 6, title: "Find users who liked all posts of a user", topic: "Division" },
    { id: 7, title: "Get notification count by type", topic: "Group By" },
    { id: 8, title: "Find posts with more comments than likes", topic: "Comparison" },
    { id: 9, title: "Calculate user retention week over week", topic: "Cohort Analysis" },
    { id: 10, title: "Find viral posts (shares > 1000)", topic: "Filtering" },
  ],
  apple: [
    { id: 1, title: "Design schema for music streaming app", topic: "Schema Design" },
    { id: 2, title: "Find most played songs by genre", topic: "Join & Group" },
    { id: 3, title: "Calculate user listening time per day", topic: "Date Functions" },
    { id: 4, title: "Recommend songs based on listening history", topic: "Complex Query" },
    { id: 5, title: "Find artists with most monthly listeners", topic: "Aggregation" },
    { id: 6, title: "Get playlist statistics", topic: "Multiple Joins" },
    { id: 7, title: "Find songs added to most playlists", topic: "Count & Order" },
    { id: 8, title: "Calculate revenue by subscription type", topic: "SUM & Group" },
    { id: 9, title: "Find users who cancelled subscription", topic: "Status Check" },
    { id: 10, title: "Get top charts by country", topic: "Partition By" },
  ],
  netflix: [
    { id: 1, title: "Find most watched shows by region", topic: "Group By" },
    { id: 2, title: "Calculate average viewing time per user", topic: "Aggregation" },
    { id: 3, title: "Recommend shows based on watch history", topic: "Complex Join" },
    { id: 4, title: "Find shows completed by most users", topic: "Having Clause" },
    { id: 5, title: "Get trending content this week", topic: "Date Functions" },
    { id: 6, title: "Calculate churn rate by subscription tier", topic: "Division" },
    { id: 7, title: "Find users who watched same show twice", topic: "Self Join" },
    { id: 8, title: "Get content performance metrics", topic: "Multiple Aggregates" },
    { id: 9, title: "Find peak streaming hours", topic: "Time Functions" },
    { id: 10, title: "Calculate content cost vs views ratio", topic: "Calculation" },
  ],
  oracle: [
    { id: 1, title: "Explain normalization forms (1NF to BCNF)", topic: "Normalization" },
    { id: 2, title: "Create materialized view with refresh", topic: "Materialized Views" },
    { id: 3, title: "Implement row-level security", topic: "Security" },
    { id: 4, title: "Use MERGE for upsert operations", topic: "MERGE" },
    { id: 5, title: "Create partitioned table by date", topic: "Partitioning" },
    { id: 6, title: "Write hierarchical query using CONNECT BY", topic: "Hierarchical" },
    { id: 7, title: "Implement flashback query", topic: "Flashback" },
    { id: 8, title: "Create function-based index", topic: "Indexing" },
    { id: 9, title: "Use EXPLAIN PLAN to analyze query", topic: "Optimization" },
    { id: 10, title: "Implement table locking strategies", topic: "Concurrency" },
  ],
  uber: [
    { id: 1, title: "Find nearest available drivers", topic: "Geospatial" },
    { id: 2, title: "Calculate surge pricing zones", topic: "Aggregation" },
    { id: 3, title: "Get driver ratings and trip counts", topic: "Join & Group" },
    { id: 4, title: "Find peak hours by city", topic: "Time Analysis" },
    { id: 5, title: "Calculate average trip duration by route", topic: "Aggregation" },
    { id: 6, title: "Find riders with most cancelled trips", topic: "Count & Filter" },
    { id: 7, title: "Get revenue by payment method", topic: "Group By" },
    { id: 8, title: "Calculate driver earnings per hour", topic: "Division" },
    { id: 9, title: "Find trips with rating below average", topic: "Subquery" },
    { id: 10, title: "Get ETA calculation data", topic: "Complex Query" },
  ],
  flipkart: [
    { id: 1, title: "Find bestselling products by category", topic: "Rank" },
    { id: 2, title: "Calculate cart abandonment rate", topic: "Division" },
    { id: 3, title: "Get seller performance metrics", topic: "Multiple Joins" },
    { id: 4, title: "Find products frequently bought together", topic: "Association" },
    { id: 5, title: "Calculate delivery time by pincode", topic: "Date Diff" },
    { id: 6, title: "Get customer segmentation by spending", topic: "CASE WHEN" },
    { id: 7, title: "Find products with most returns", topic: "Count & Order" },
    { id: 8, title: "Calculate GMV by category monthly", topic: "Date & Sum" },
    { id: 9, title: "Get wishlist to purchase conversion", topic: "Join & Division" },
    { id: 10, title: "Find sellers with delayed shipments", topic: "Date Comparison" },
  ],
  tcs: [
    { id: 1, title: "What is database normalization?", topic: "Theory" },
    { id: 2, title: "Explain different types of joins", topic: "Joins" },
    { id: 3, title: "What is a primary key vs foreign key?", topic: "Keys" },
    { id: 4, title: "Difference between WHERE and HAVING", topic: "Clauses" },
    { id: 5, title: "What is an index? Types of indexes?", topic: "Indexing" },
    { id: 6, title: "Explain view vs materialized view", topic: "Views" },
    { id: 7, title: "What is a deadlock? How to prevent?", topic: "Concurrency" },
    { id: 8, title: "Explain UNION vs UNION ALL", topic: "Set Operations" },
    { id: 9, title: "What are aggregate functions?", topic: "Functions" },
    { id: 10, title: "Explain stored procedure vs function", topic: "Procedures" },
  ],
};

const sqlLanguages = [{ id: "sql", name: "SQL" }];

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

const toTitleCase = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

const deriveDifficulty = (id: number): Problem["difficulty"] => {
  if (id <= 3) return "Easy";
  if (id <= 7) return "Medium";
  return "Hard";
};

const buildSqlStarterCode = (title: string, topic: string): Record<string, string> => ({
  sql: `-- ${title}
-- Topic: ${topic}
-- Outline your SQL solution below

WITH preparation AS (
    -- Prepare intermediate data here
    SELECT *
    FROM source_table
)
SELECT *
FROM preparation;
`,
});

const fallbackProblem: Problem = {
  id: 0,
  title: "Design a simple ER diagram",
  difficulty: "Easy",
  company: "generic",
  companyIcon: "🗄️",
  description: "Sketch entities, attributes, and relationships for a student-course enrollment schema.",
  examples: [
    { input: "Entities: Student, Course", output: "Relationships: Student ENROLLS Course" },
    { input: "Attributes: student_id, course_id", output: "Primary Keys identified" },
  ],
  constraints: ["Identify primary and foreign keys.", "Ensure cardinality is explicit."],
  starterCode: buildSqlStarterCode("Design a simple ER diagram", "ERD"),
  testCases: [
    { input: "ER diagram completeness", expectedOutput: "All required relationships captured" },
    { input: "Key identification", expectedOutput: "Primary and foreign keys documented" },
  ],
};

const buildProblemsForCompany = (
  companyKey: string,
  questions: { id: number; title: string; topic: string }[],
): Problem[] => {
  const icon = companyIcons[companyKey] ?? "🏢";
  const companyName = toTitleCase(companyKey);

  return questions.map((question) => ({
    id: question.id,
    title: question.title,
    difficulty: deriveDifficulty(question.id),
    company: companyKey,
    companyIcon: icon,
    description: `Craft a solution for \"${question.title}\" as discussed in ${companyName} database interviews. Highlight indexing, transaction handling, and trade-offs as you go.`,
    examples: [
      { input: `Sample dataset for ${question.topic}`, output: "Discuss expected rows and ordering." },
      { input: "Edge case: sparse data", output: "Explain how the query handles empty results." },
    ],
    constraints: [
      `${companyName} expects strong fundamentals in ${question.topic}.`,
      "Explain assumptions, validation steps, and performance considerations.",
    ],
    starterCode: buildSqlStarterCode(question.title, question.topic),
    testCases: [
      { input: "Representative dataset", expectedOutput: "Correct result set" },
      { input: "Edge condition", expectedOutput: "Graceful handling with no errors" },
    ],
  }));
};

const DBMSCompany = () => {
  const { company } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const companyKey = (company ?? "google").toLowerCase();
  const questionBank = useMemo(
    () => questionsByCompany[companyKey] ?? questionsByCompany.google,
    [companyKey],
  );
  const problems = useMemo(() => buildProblemsForCompany(companyKey, questionBank), [companyKey, questionBank]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const questionOptions = useMemo(
    () =>
      questionBank
        .map((item, index) => {
          const difficulty = deriveDifficulty(item.id);
          return { question: item, index, difficulty };
        })
        .sort((a, b) => {
          const diff = difficultyPriority[a.difficulty] - difficultyPriority[b.difficulty];
          if (diff !== 0) {
            return diff;
          }
          return a.question.title.localeCompare(b.question.title);
        }),
    [questionBank],
  );

  const selectedQuestion = useMemo(
    () => questionOptions.find((option) => option.index === currentIndex),
    [questionOptions, currentIndex],
  );

  const difficultySummary = useMemo(
    () =>
      questionOptions.reduce(
        (acc, { difficulty }) => {
          acc[difficulty] += 1;
          return acc;
        },
        { Easy: 0, Medium: 0, Hard: 0 },
      ),
    [questionOptions],
  );

  useEffect(() => {
    setCurrentIndex(0);
  }, [companyKey]);

  const currentProblem = problems[currentIndex] ?? fallbackProblem;
  const currentTopic = questionBank[currentIndex]?.topic ?? "SQL Practice";
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

      <Header onLeaveWorkspace={() => navigate("/dbms")} />

      <div className="px-4 pb-12 md:px-6">
        <div className="mx-auto w-full max-w-[1600px] space-y-8">
          <div className="glass-card flex flex-col gap-5 rounded-3xl border border-border/40 bg-background/80 p-6 shadow-xl backdrop-blur-xl">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-3xl">
                  {companyIcon}
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Deep dive scenario</p>
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
                    <Badge variant="outline" className="rounded-full border-border/50 bg-background/80 text-muted-foreground">
                      {currentTopic}
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
                  Next scenario
                </Button>
                <Button
                  className="rounded-full bg-gradient-to-r from-primary/90 to-primary px-5 py-2 text-sm font-semibold shadow-lg shadow-primary/40"
                  onClick={() =>
                    navigate("/codepad", {
                      state: {
                        origin: "dbms",
                        problem: currentProblem,
                        languages: sqlLanguages,
                        defaultLanguage: "sql",
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
              Rehearse real {companyName} data rounds. Explain indexing strategy, transaction handling, and SQL trade-offs
              as you craft queries for the interviewer.
            </p>
          </div>

          <div className="flex flex-col gap-8 xl:flex-row">
            <aside className="flex w-full flex-shrink-0 flex-col gap-6 xl:w-96 2xl:w-[420px]">
              <div className="glass-card rounded-3xl border border-border/40 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Company</p>
                    <h2 className="text-2xl font-semibold text-foreground">{companyName}</h2>
                    <p className="text-sm text-muted-foreground">{questionBank.length} SQL scenarios</p>
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
                          <Link to={`/dbms/${label.toLowerCase()}`} className="flex items-center gap-2">
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
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">SQL Workshop</p>
                </div>

                <div className="space-y-5 px-6 py-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Selected scenario</p>
                      <p className="mt-1 line-clamp-2 text-sm font-semibold text-foreground">
                        {currentProblem.title}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          className="flex items-center gap-2 rounded-full border border-border/40 bg-background/80 px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-foreground transition hover:border-primary/40 hover:text-primary"
                          disabled={!questionOptions.length}
                        >
                          <span className="line-clamp-1 max-w-[180px] text-left">
                            {selectedQuestion
                              ? `#${selectedQuestion.question.id} · ${selectedQuestion.question.title}`
                              : "No scenarios"}
                          </span>
                          <ChevronDown className="h-3.5 w-3.5" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-80 max-h-72 overflow-auto">
                        {questionOptions.map(({ question, index: originalIndex, difficulty }) => {
                          const isActive = originalIndex === currentIndex;
                          return (
                            <DropdownMenuItem
                              key={question.id}
                              onSelect={(event) => {
                                event.preventDefault();
                                handleSelectProblem(originalIndex);
                              }}
                              className="flex items-start gap-3 px-3 py-2"
                            >
                              <Check className={cn("mt-0.5 h-4 w-4 text-primary", isActive ? "opacity-100" : "opacity-0")} />
                              <div className="flex flex-1 flex-col">
                                <span className="line-clamp-2 text-sm font-semibold text-foreground">{question.title}</span>
                                <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                                  <Badge
                                    variant="secondary"
                                    className={cn("rounded-full px-2 py-0.5 font-semibold", difficultyStyles[difficulty])}
                                  >
                                    {difficulty}
                                  </Badge>
                                  <span className="rounded-full border border-border/40 bg-background/70 px-2 py-0.5 font-medium">
                                    {question.topic}
                                  </span>
                                </div>
                              </div>
                            </DropdownMenuItem>
                          );
                        })}

                        {!questionOptions.length && (
                          <DropdownMenuItem disabled className="text-xs text-muted-foreground">
                            We are curating a fresh SQL set for this company.
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
                    <Badge variant="outline" className="rounded-full border-border/50 bg-background/80 px-2.5 py-1 font-medium text-muted-foreground">
                      {currentTopic}
                    </Badge>
                    <span>{questionOptions.length} scenarios</span>
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

export default DBMSCompany;
