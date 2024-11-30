import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, ThumbsUp, ThumbsDown, PlusCircle } from "lucide-react";

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  category: string;
  upvotes: number;
  downvotes: number;
  comments: number;
  timestamp: string;
}

const mockPosts: Post[] = [
  {
    id: "1",
    title: "Tips for building an emergency fund",
    content: "Here's what worked for me when starting my emergency fund...",
    author: "Sarah M.",
    category: "Saving Tips",
    upvotes: 24,
    downvotes: 2,
    comments: 8,
    timestamp: "2h ago",
  },
  {
    id: "2",
    title: "How to start investing with little money",
    content: "You don't need a lot to start investing. Here's how...",
    author: "Mike R.",
    category: "Investing",
    upvotes: 45,
    downvotes: 3,
    comments: 15,
    timestamp: "5h ago",
  },
];

const categories = [
  "All Topics",
  "Saving Tips",
  "Investing",
  "Budgeting",
  "Debt Management",
];

const DiscussionBoard = () => {
  return (
    <Card className="p-6 bg-white shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold">Community Discussions</h2>
          <p className="text-sm text-muted-foreground">
            Share and learn from others
          </p>
        </div>
        <Button className="gap-2">
          <PlusCircle className="h-4 w-4" />
          New Post
        </Button>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Tabs defaultValue="All Topics" className="w-[400px]">
            <TabsList>
              {categories.map((category) => (
                <TabsTrigger key={category} value={category}>
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <Input placeholder="Search discussions..." className="w-[200px]" />
        </div>

        <div className="space-y-4">
          {mockPosts.map((post) => (
            <div key={post.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{post.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {post.content}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {post.timestamp}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <span className="text-muted-foreground">
                    by {post.author}
                  </span>
                  <span className="text-primary">{post.category}</span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ThumbsUp className="h-4 w-4" />
                    </Button>
                    <span>{post.upvotes}</span>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ThumbsDown className="h-4 w-4" />
                    </Button>
                    <span>{post.downvotes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    {post.comments}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default DiscussionBoard;
