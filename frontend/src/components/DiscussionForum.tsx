import { useState } from "react";
import { MessageCircle, ThumbsUp, Send, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Comment {
  id: number;
  user: string;
  avatar: string;
  text: string;
  likes: number;
  time: string;
}

interface DiscussionForumProps {
  questionId: number;
  questionTitle: string;
  company: string;
}

const dummyComments: Comment[] = [
  {
    id: 1,
    user: "CodeMaster99",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=codemaster",
    text: "I solved this using a two-pointer approach. The key insight is to sort the array first and then iterate from both ends.",
    likes: 24,
    time: "2 hours ago"
  },
  {
    id: 2,
    user: "AlgoWizard",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=algowizard",
    text: "Great question! This was asked in my interview last week. Make sure to handle edge cases like empty arrays.",
    likes: 18,
    time: "5 hours ago"
  },
  {
    id: 3,
    user: "TechNinja",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=techninja",
    text: "Time complexity matters here. The optimal solution is O(n) using a hash map instead of O(n²) brute force.",
    likes: 31,
    time: "1 day ago"
  },
];

const DiscussionForum = ({ questionId, questionTitle, company }: DiscussionForumProps) => {
  const [comments, setComments] = useState<Comment[]>(dummyComments);
  const [newComment, setNewComment] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = () => {
    if (!newComment.trim()) return;
    
    const comment: Comment = {
      id: Date.now(),
      user: "You",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=you",
      text: newComment,
      likes: 0,
      time: "Just now"
    };
    
    setComments([comment, ...comments]);
    setNewComment("");
  };

  const handleLike = (commentId: number) => {
    setComments(comments.map(c => 
      c.id === commentId ? { ...c, likes: c.likes + 1 } : c
    ));
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden mt-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between bg-muted/30 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-primary" />
          <span className="font-semibold">Discussion Forum</span>
          <span className="text-sm text-muted-foreground">({comments.length} comments)</span>
        </div>
        <span className="text-sm text-primary">{isExpanded ? "Hide" : "Show"}</span>
      </button>

      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* Add Comment */}
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 space-y-2">
              <Textarea
                placeholder="Share your approach or ask a question..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[80px] resize-none"
              />
              <div className="flex justify-end">
                <Button size="sm" onClick={handleSubmit} disabled={!newComment.trim()} className="gap-2">
                  <Send className="h-4 w-4" />
                  Post Comment
                </Button>
              </div>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-4 pt-4 border-t border-border">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <img 
                  src={comment.avatar} 
                  alt={comment.user}
                  className="w-8 h-8 rounded-full bg-muted flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{comment.user}</span>
                    <span className="text-xs text-muted-foreground">{comment.time}</span>
                  </div>
                  <p className="text-sm text-foreground/90 mb-2">{comment.text}</p>
                  <button
                    onClick={() => handleLike(comment.id)}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                  >
                    <ThumbsUp className="h-3 w-3" />
                    <span>{comment.likes}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscussionForum;
