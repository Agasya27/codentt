import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Play, ChevronDown, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Editor from "@monaco-editor/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Navbar from "@/components/landing/Navbar";
import ComingSoonModal from "@/components/landing/ComingSoonModal";
import DiscussionForum from "@/components/DiscussionForum";

const companies = [
  "Google", "Amazon", "Microsoft", "Meta", "Apple", 
  "Netflix", "Oracle", "Uber", "Flipkart", "TCS"
];

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

const getTopicColor = (topic: string) => {
  const colors = [
    "text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400",
    "text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400",
    "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400",
    "text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400",
    "text-cyan-600 bg-cyan-100 dark:bg-cyan-900/30 dark:text-cyan-400",
    "text-pink-600 bg-pink-100 dark:bg-pink-900/30 dark:text-pink-400",
  ];
  const index = topic.length % colors.length;
  return colors[index];
};

const DBMSCompany = () => {
  const { company } = useParams();
  const companyName = company || "google";
  const questions = questionsByCompany[companyName] || questionsByCompany.google;
  const [selectedQuestion, setSelectedQuestion] = useState(questions[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState(`-- ${selectedQuestion.title}
-- Topic: ${selectedQuestion.topic}

SELECT 
  *
FROM 
  your_table
WHERE 
  condition = 'value';
`);

  const displayCompanyName = companyName.charAt(0).toUpperCase() + companyName.slice(1);

  return (
    <div className="min-h-screen bg-background">
      <Navbar onCtaClick={() => setIsModalOpen(true)} />
      <ComingSoonModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <main className="pt-24 pb-8">
        <div className="container mx-auto px-4">
          {/* Page Title with Company Dropdown */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-1">
                <span className="text-primary">{displayCompanyName}</span> DBMS Questions
              </h1>
              <p className="text-muted-foreground">Practice SQL and database questions asked at {displayCompanyName}</p>
            </div>
            
            {/* Company Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Building2 className="h-4 w-4" />
                  {displayCompanyName}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-card border border-border">
                {companies.map((comp) => (
                  <DropdownMenuItem key={comp} asChild>
                    <Link 
                      to={`/dbms/${comp.toLowerCase()}`}
                      className={comp.toLowerCase() === companyName ? "bg-primary/10 text-primary" : ""}
                    >
                      {comp}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Main Layout - Questions and Editor */}
          <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr] gap-6">
            {/* Questions List */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="p-4 border-b border-border bg-muted/30">
                <h2 className="font-semibold">Questions ({questions.length})</h2>
              </div>
              <div className="divide-y divide-border max-h-[300px] md:max-h-[calc(100vh-220px)] overflow-y-auto">
                {questions.map((q) => (
                  <button
                    key={q.id}
                    onClick={() => {
                      setSelectedQuestion(q);
                      setCode(`-- ${q.title}\n-- Topic: ${q.topic}\n\nSELECT \n  *\nFROM \n  your_table\nWHERE \n  condition = 'value';`);
                    }}
                    className={`w-full text-left p-4 hover:bg-muted/50 transition-colors ${
                      selectedQuestion.id === q.id ? "bg-primary/5 border-l-2 border-primary" : ""
                    }`}
                  >
                    <div className="flex flex-col gap-2">
                      <span className="text-xs text-muted-foreground">#{q.id}</span>
                      <h3 className="font-medium text-sm line-clamp-2">{q.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium w-fit ${getTopicColor(q.topic)}`}>
                        {q.topic}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Code Editor */}
            <div className="bg-card rounded-xl border border-border overflow-hidden flex flex-col">
              <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between">
                <div>
                  <h2 className="font-semibold">{selectedQuestion.title}</h2>
                  <p className="text-sm text-muted-foreground">{selectedQuestion.topic}</p>
                </div>
                <Button className="gap-2">
                  <Play className="h-4 w-4" />
                  Run Query
                </Button>
              </div>
              <div className="flex-1 min-h-[400px] md:min-h-[500px]">
                <Editor
                  height="100%"
                  defaultLanguage="sql"
                  value={code}
                  onChange={(value) => setCode(value || "")}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    padding: { top: 16 },
                    scrollBeyondLastLine: false,
                  }}
                />
              </div>
              
              {/* Discussion Forum */}
              <DiscussionForum 
                questionId={selectedQuestion.id}
                questionTitle={selectedQuestion.title}
                company={displayCompanyName}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DBMSCompany;