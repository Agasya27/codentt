export interface Problem {
  id: number;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  company: string;
  companyIcon: string;
  description: string;
  examples: { input: string; output: string; explanation?: string }[];
  constraints: string[];
  starterCode: Record<string, string>;
  testCases: { input: string; expectedOutput: string }[];
}

export const companies = [
  { id: "google", name: "Google", icon: "G", color: "from-blue-500 to-green-500" },
  { id: "amazon", name: "Amazon", icon: "A", color: "from-orange-500 to-yellow-500" },
  { id: "meta", name: "Meta", icon: "M", color: "from-blue-600 to-indigo-500" },
  { id: "apple", name: "Apple", icon: "Ap", color: "from-gray-600 to-gray-800" },
  { id: "netflix", name: "Netflix", icon: "N", color: "from-red-600 to-red-800" },
  { id: "microsoft", name: "Microsoft", icon: "MS", color: "from-blue-500 to-cyan-500" },
];

export const mockProblems: Problem[] = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    company: "google",
    companyIcon: "G",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.",
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
      },
      {
        input: "nums = [3,3], target = 6",
        output: "[0,1]",
      },
    ],
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists.",
    ],
    starterCode: {
      python: "def twoSum(nums: List[int], target: int) -> List[int]:\n    # Write your solution here\n    hash_map = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in hash_map:\n            return [hash_map[complement], i]\n        hash_map[num] = i\n    return []",
      javascript: "function twoSum(nums, target) {\n    // Write your solution here\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (map.has(complement)) {\n            return [map.get(complement), i];\n        }\n        map.set(nums[i], i);\n    }\n    return [];\n}",
      java: "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your solution here\n        Map<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int complement = target - nums[i];\n            if (map.containsKey(complement)) {\n                return new int[] {map.get(complement), i};\n            }\n            map.put(nums[i], i);\n        }\n        return new int[] {};\n    }\n}",
      cpp: "class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Write your solution here\n        unordered_map<int, int> map;\n        for (int i = 0; i < nums.size(); i++) {\n            int complement = target - nums[i];\n            if (map.find(complement) != map.end()) {\n                return {map[complement], i};\n            }\n            map[nums[i]] = i;\n        }\n        return {};\n    }\n};",
    },
    testCases: [
      { input: "[2,7,11,15], 9", expectedOutput: "[0,1]" },
      { input: "[3,2,4], 6", expectedOutput: "[1,2]" },
      { input: "[3,3], 6", expectedOutput: "[0,1]" },
    ],
  },
  {
    id: 2,
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    company: "amazon",
    companyIcon: "A",
    description: "Given a string s, find the length of the longest substring without repeating characters.\n\nA substring is a contiguous non-empty sequence of characters within a string.",
    examples: [
      {
        input: "s = \"abcabcbb\"",
        output: "3",
        explanation: "The answer is \"abc\", with the length of 3.",
      },
      {
        input: "s = \"bbbbb\"",
        output: "1",
        explanation: "The answer is \"b\", with the length of 1.",
      },
      {
        input: "s = \"pwwkew\"",
        output: "3",
        explanation: "The answer is \"wke\", with the length of 3.",
      },
    ],
    constraints: [
      "0 <= s.length <= 5 * 10^4",
      "s consists of English letters, digits, symbols and spaces.",
    ],
    starterCode: {
      python: "def lengthOfLongestSubstring(s: str) -> int:\n    # Write your solution here\n    char_set = set()\n    left = 0\n    max_length = 0\n    for right in range(len(s)):\n        while s[right] in char_set:\n            char_set.remove(s[left])\n            left += 1\n        char_set.add(s[right])\n        max_length = max(max_length, right - left + 1)\n    return max_length",
      javascript: "function lengthOfLongestSubstring(s) {\n    // Write your solution here\n    const charSet = new Set();\n    let left = 0;\n    let maxLength = 0;\n    for (let right = 0; right < s.length; right++) {\n        while (charSet.has(s[right])) {\n            charSet.delete(s[left]);\n            left++;\n        }\n        charSet.add(s[right]);\n        maxLength = Math.max(maxLength, right - left + 1);\n    }\n    return maxLength;\n}",
      java: "class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        // Write your solution here\n        Set<Character> charSet = new HashSet<>();\n        int left = 0, maxLength = 0;\n        for (int right = 0; right < s.length(); right++) {\n            while (charSet.contains(s.charAt(right))) {\n                charSet.remove(s.charAt(left));\n                left++;\n            }\n            charSet.add(s.charAt(right));\n            maxLength = Math.max(maxLength, right - left + 1);\n        }\n        return maxLength;\n    }\n}",
      cpp: "class Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        // Write your solution here\n        unordered_set<char> charSet;\n        int left = 0, maxLength = 0;\n        for (int right = 0; right < s.length(); right++) {\n            while (charSet.count(s[right])) {\n                charSet.erase(s[left]);\n                left++;\n            }\n            charSet.insert(s[right]);\n            maxLength = max(maxLength, right - left + 1);\n        }\n        return maxLength;\n    }\n};",
    },
    testCases: [
      { input: "\"abcabcbb\"", expectedOutput: "3" },
      { input: "\"bbbbb\"", expectedOutput: "1" },
      { input: "\"pwwkew\"", expectedOutput: "3" },
    ],
  },
  {
    id: 3,
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    company: "meta",
    companyIcon: "M",
    description: "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.\n\nThe overall run time complexity should be O(log (m+n)).",
    examples: [
      {
        input: "nums1 = [1,3], nums2 = [2]",
        output: "2.00000",
        explanation: "merged array = [1,2,3] and median is 2.",
      },
      {
        input: "nums1 = [1,2], nums2 = [3,4]",
        output: "2.50000",
        explanation: "merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5.",
      },
    ],
    constraints: [
      "nums1.length == m",
      "nums2.length == n",
      "0 <= m <= 1000",
      "0 <= n <= 1000",
      "1 <= m + n <= 2000",
      "-10^6 <= nums1[i], nums2[i] <= 10^6",
    ],
    starterCode: {
      python: "def findMedianSortedArrays(nums1: List[int], nums2: List[int]) -> float:\n    # Write your solution here\n    merged = sorted(nums1 + nums2)\n    n = len(merged)\n    if n % 2 == 0:\n        return (merged[n//2 - 1] + merged[n//2]) / 2\n    return float(merged[n//2])",
      javascript: "function findMedianSortedArrays(nums1, nums2) {\n    // Write your solution here\n    const merged = [...nums1, ...nums2].sort((a, b) => a - b);\n    const n = merged.length;\n    if (n % 2 === 0) {\n        return (merged[n/2 - 1] + merged[n/2]) / 2;\n    }\n    return merged[Math.floor(n/2)];\n}",
      java: "class Solution {\n    public double findMedianSortedArrays(int[] nums1, int[] nums2) {\n        // Write your solution here\n        int[] merged = new int[nums1.length + nums2.length];\n        System.arraycopy(nums1, 0, merged, 0, nums1.length);\n        System.arraycopy(nums2, 0, merged, nums1.length, nums2.length);\n        Arrays.sort(merged);\n        int n = merged.length;\n        if (n % 2 == 0) {\n            return (merged[n/2 - 1] + merged[n/2]) / 2.0;\n        }\n        return merged[n/2];\n    }\n}",
      cpp: "class Solution {\npublic:\n    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {\n        // Write your solution here\n        vector<int> merged(nums1);\n        merged.insert(merged.end(), nums2.begin(), nums2.end());\n        sort(merged.begin(), merged.end());\n        int n = merged.size();\n        if (n % 2 == 0) {\n            return (merged[n/2 - 1] + merged[n/2]) / 2.0;\n        }\n        return merged[n/2];\n    }\n};",
    },
    testCases: [
      { input: "[1,3], [2]", expectedOutput: "2.00000" },
      { input: "[1,2], [3,4]", expectedOutput: "2.50000" },
    ],
  },
  {
    id: 4,
    title: "Valid Parentheses",
    difficulty: "Easy",
    company: "apple",
    companyIcon: "Ap",
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.",
    examples: [
      {
        input: "s = \"()\"",
        output: "true",
      },
      {
        input: "s = \"()[]{}\"",
        output: "true",
      },
      {
        input: "s = \"(]\"",
        output: "false",
      },
    ],
    constraints: [
      "1 <= s.length <= 10^4",
      "s consists of parentheses only '()[]{}'.",
    ],
    starterCode: {
      python: "def isValid(s: str) -> bool:\n    # Write your solution here\n    stack = []\n    mapping = {')': '(', '}': '{', ']': '['}\n    for char in s:\n        if char in mapping:\n            if not stack or stack[-1] != mapping[char]:\n                return False\n            stack.pop()\n        else:\n            stack.append(char)\n    return len(stack) == 0",
      javascript: "function isValid(s) {\n    // Write your solution here\n    const stack = [];\n    const mapping = { ')': '(', '}': '{', ']': '[' };\n    for (const char of s) {\n        if (mapping[char]) {\n            if (!stack.length || stack[stack.length - 1] !== mapping[char]) {\n                return false;\n            }\n            stack.pop();\n        } else {\n            stack.push(char);\n        }\n    }\n    return stack.length === 0;\n}",
      java: "class Solution {\n    public boolean isValid(String s) {\n        // Write your solution here\n        Stack<Character> stack = new Stack<>();\n        Map<Character, Character> mapping = new HashMap<>();\n        mapping.put(')', '(');\n        mapping.put('}', '{');\n        mapping.put(']', '[');\n        for (char c : s.toCharArray()) {\n            if (mapping.containsKey(c)) {\n                if (stack.isEmpty() || stack.peek() != mapping.get(c)) {\n                    return false;\n                }\n                stack.pop();\n            } else {\n                stack.push(c);\n            }\n        }\n        return stack.isEmpty();\n    }\n}",
      cpp: "class Solution {\npublic:\n    bool isValid(string s) {\n        // Write your solution here\n        stack<char> st;\n        unordered_map<char, char> mapping = {{')', '('}, {'}', '{'}, {']', '['}};\n        for (char c : s) {\n            if (mapping.count(c)) {\n                if (st.empty() || st.top() != mapping[c]) {\n                    return false;\n                }\n                st.pop();\n            } else {\n                st.push(c);\n            }\n        }\n        return st.empty();\n    }\n};",
    },
    testCases: [
      { input: "\"()\"", expectedOutput: "true" },
      { input: "\"()[]{}\"", expectedOutput: "true" },
      { input: "\"(]\"", expectedOutput: "false" },
    ],
  },
];
