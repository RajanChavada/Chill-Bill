import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, ThumbsUp, ThumbsDown, PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  category: string;
  upvotes: number;
  downvotes: number;
  comments: number;
  timestamp: Date;
}

const mockPosts: Post[] = [
  // Saving Tips
  {
    id: "1",
    title: "50/30/20 Rule Changed My Savings",
    content: "I started using the 50/30/20 budgeting rule (50% needs, 30% wants, 20% savings) and it's transformed my financial habits...",
    author: "Sarah M.",
    category: "Saving Tips",
    upvotes: 24,
    downvotes: 2,
    comments: 8,
    timestamp: new Date(2024, 0, 15, 14, 30),
  },
  {
    id: "2",
    title: "Automated Savings Strategy",
    content: "Setting up automatic transfers to my savings account has been a game-changer. Here's my setup...",
    author: "Mike R.",
    category: "Saving Tips",
    upvotes: 45,
    downvotes: 3,
    comments: 15,
    timestamp: new Date(2024, 0, 15, 10, 15),
  },
  
  // Investing
  {
    id: "3",
    title: "ETF Investment Strategy for Beginners",
    content: "Started my investment journey with low-cost ETFs. Here's what I learned...",
    author: "Alex K.",
    category: "Investing",
    upvotes: 67,
    downvotes: 4,
    comments: 23,
    timestamp: new Date(2024, 0, 14, 9, 45),
  },
  {
    id: "4",
    title: "Dollar-Cost Averaging Success Story",
    content: "How I've been investing $200 monthly regardless of market conditions...",
    author: "Lisa P.",
    category: "Investing",
    upvotes: 38,
    downvotes: 2,
    comments: 12,
    timestamp: new Date(2024, 0, 13, 16, 20),
  },

  // Budgeting
  {
    id: "5",
    title: "Zero-Based Budgeting Method",
    content: "Assigning every dollar a job has helped me eliminate unnecessary spending...",
    author: "Chris T.",
    category: "Budgeting",
    upvotes: 52,
    downvotes: 3,
    comments: 19,
    timestamp: new Date(2024, 0, 12, 11, 30),
  },
  {
    id: "6",
    title: "Envelope System in Digital Age",
    content: "Using digital 'envelopes' for different spending categories...",
    author: "Emma S.",
    category: "Budgeting",
    upvotes: 31,
    downvotes: 1,
    comments: 9,
    timestamp: new Date(2024, 0, 11, 13, 45),
  },

  // Debt Management
  {
    id: "7",
    title: "Snowball vs. Avalanche Method",
    content: "My experience using the debt snowball method to clear $30k in debt...",
    author: "David M.",
    category: "Debt Management",
    upvotes: 89,
    downvotes: 4,
    comments: 34,
    timestamp: new Date(2024, 0, 10, 15, 15),
  },
  {
    id: "8",
    title: "Credit Card Balance Transfer Strategy",
    content: "How I used 0% balance transfers to pay off debt faster...",
    author: "Rachel K.",
    category: "Debt Management",
    upvotes: 43,
    downvotes: 2,
    comments: 16,
    timestamp: new Date(2024, 0, 9, 14, 20),
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
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [selectedCategory, setSelectedCategory] = useState("All Topics");
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewPostOpen, setIsNewPostOpen] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    author: "",
    category: "",
  });

  const handleNewPost = () => {
    const post: Post = {
      id: Date.now().toString(),
      ...newPost,
      upvotes: 0,
      downvotes: 0,
      comments: 0,
      timestamp: new Date(),
    };

    setPosts([post, ...posts]);
    setIsNewPostOpen(false);
    setNewPost({ title: "", content: "", author: "", category: "" });
  };

  const filteredPosts = posts
    .filter((post) =>
      selectedCategory === "All Topics" ? true : post.category === selectedCategory
    )
    .filter(
      (post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <Card className="p-6 shadow-sm" style={{ background: "#FBFBFB" }}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold">Community Discussions</h2>
          <p className="text-sm text-muted-foreground">
            Share and learn from others
          </p>
        </div>
        <Dialog open={isNewPostOpen} onOpenChange={setIsNewPostOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <PlusCircle className="h-4 w-4" />
              New Post
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Post</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Input
                placeholder="Title"
                value={newPost.title}
                onChange={(e) =>
                  setNewPost({ ...newPost, title: e.target.value })
                }
              />
              <Input
                placeholder="Your Name"
                value={newPost.author}
                onChange={(e) =>
                  setNewPost({ ...newPost, author: e.target.value })
                }
              />
              <Select
                onValueChange={(value) =>
                  setNewPost({ ...newPost, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories
                    .filter((cat) => cat !== "All Topics")
                    .map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <Textarea
                placeholder="Share your thoughts..."
                value={newPost.content}
                onChange={(e) =>
                  setNewPost({ ...newPost, content: e.target.value })
                }
              />
              <Button
                onClick={handleNewPost}
                disabled={
                  !newPost.title ||
                  !newPost.content ||
                  !newPost.author ||
                  !newPost.category
                }
              >
                Post
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="w-full sm:w-auto overflow-x-auto">
            <Tabs
              value={selectedCategory}
              onValueChange={setSelectedCategory}
              className="w-full sm:w-auto"
            >
              <TabsList className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground w-full sm:w-auto overflow-x-auto whitespace-nowrap">
                {categories.map((category) => (
                  <TabsTrigger
                    key={category}
                    value={category}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
          
          <div className="w-full sm:w-auto">
            <Input
              placeholder="Search discussions..."
              className="w-full sm:w-[200px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-4 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pr-2">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="border rounded-lg p-4 space-y-3"
              style={{
                background: 'linear-gradient(to right, #D4F6FF, #D4F6FF 100%, #FBFBFB 25%)',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                opacity: 0.9
              }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{post.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {post.content}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {format(post.timestamp, "MMM d, h:mm a")}
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
