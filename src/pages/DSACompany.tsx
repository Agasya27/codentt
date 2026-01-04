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
  "Netflix", "Adobe", "Uber", "Flipkart", "Infosys"
];

const questionsByCompany: Record<string, { id: number; title: string; difficulty: string }[]> = {
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

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Easy": return "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400";
    case "Medium": return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400";
    case "Hard": return "text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400";
    default: return "text-muted-foreground bg-muted";
  }
};

const DSACompany = () => {
  const { company } = useParams();
  const companyName = company || "google";
  const questions = questionsByCompany[companyName] || questionsByCompany.google;
  const [selectedQuestion, setSelectedQuestion] = useState(questions[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState(`// ${selectedQuestion.title}
// Write your solution here

function solution() {
  // Your code here
  
}

// Test your solution
console.log(solution());
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
                <span className="text-primary">{displayCompanyName}</span> DSA Questions
              </h1>
              <p className="text-muted-foreground">Practice the most asked questions at {displayCompanyName}</p>
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
                      to={`/dsa/${comp.toLowerCase()}`}
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
                      setCode(`// ${q.title}\n// Write your solution here\n\nfunction solution() {\n  // Your code here\n  \n}\n\nconsole.log(solution());`);
                    }}
                    className={`w-full text-left p-4 hover:bg-muted/50 transition-colors ${
                      selectedQuestion.id === q.id ? "bg-primary/5 border-l-2 border-primary" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <span className="text-xs text-muted-foreground">#{q.id}</span>
                        <h3 className="font-medium text-sm truncate">{q.title}</h3>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getDifficultyColor(q.difficulty)}`}>
                        {q.difficulty}
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
                  <p className="text-sm text-muted-foreground">{selectedQuestion.difficulty}</p>
                </div>
                <Button className="gap-2">
                  <Play className="h-4 w-4" />
                  Run Code
                </Button>
              </div>
              <div className="flex-1 min-h-[400px] md:min-h-[500px]">
                <Editor
                  height="100%"
                  defaultLanguage="javascript"
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

export default DSACompany;