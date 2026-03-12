"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Bot,
  Send,
  Calendar,
  DollarSign,
  Mail,
  FileText,
  CheckCircle2,
  Clock,
  Zap,
} from "lucide-react";

interface Message {
  role: "user" | "agent";
  content: string;
  timestamp: string;
}

const sampleConversation: Message[] = [
  {
    role: "agent",
    content:
      "Hey Alex! I've been busy today. I sent booking inquiries to 3 venues in the Bay Area that match your jazz trio format. I also flagged a royalty discrepancy on your latest EP — looks like Spotify underpaid by about $42. Want me to file a dispute?",
    timestamp: "10:30 AM",
  },
  {
    role: "user",
    content: "Yes, file the dispute. Also, can you find me gigs in Austin for May?",
    timestamp: "10:35 AM",
  },
  {
    role: "agent",
    content:
      "On it! I'll file the Spotify dispute now and start searching Austin venues for May. I know you prefer jazz clubs and listening rooms with a minimum fee of $800. I'll filter for those and send you options by tomorrow. Anything else?",
    timestamp: "10:35 AM",
  },
];

const agentTasks = [
  {
    task: "Booking inquiries to Bay Area venues",
    status: "completed",
    icon: Calendar,
  },
  {
    task: "Spotify royalty dispute filing",
    status: "in-progress",
    icon: DollarSign,
  },
  {
    task: "Austin venue search for May",
    status: "in-progress",
    icon: Calendar,
  },
  {
    task: "Follow up with Ronnie Scott's on rider requirements",
    status: "queued",
    icon: Mail,
  },
  {
    task: "Review festival contract for April",
    status: "queued",
    icon: FileText,
  },
];

const statusIcon = {
  completed: <CheckCircle2 className="h-4 w-4 text-green-600" />,
  "in-progress": <Clock className="h-4 w-4 text-yellow-600" />,
  queued: <Clock className="h-4 w-4 text-muted-foreground" />,
};

export default function AgentPage() {
  const [messages, setMessages] = useState<Message[]>(sampleConversation);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([
      ...messages,
      {
        role: "user",
        content: input,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
      {
        role: "agent",
        content:
          "Got it! I'll get on that right away. Give me a moment to work on this...",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
    setInput("");
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">AI Agent</h1>
        <p className="text-muted-foreground">
          Chat with Mozely to manage your career.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Chat */}
        <Card className="lg:col-span-2 flex flex-col" style={{ height: 600 }}>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-base">Mozely</CardTitle>
                <CardDescription className="text-xs flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  Online &middot; Managing your career
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      msg.role === "user"
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground"
                    }`}
                  >
                    {msg.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
          <Separator />
          <div className="p-4 flex gap-2">
            <Input
              placeholder="Ask Mozely anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <Button onClick={handleSend} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </Card>

        {/* Task Queue */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Agent Tasks
              </CardTitle>
              <CardDescription>What Mozely is working on</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {agentTasks.map((task, i) => (
                <div key={i} className="flex items-start gap-3">
                  {statusIcon[task.status as keyof typeof statusIcon]}
                  <div>
                    <p className="text-sm">{task.task}</p>
                    <Badge variant="outline" className="text-xs mt-1">
                      {task.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                Find me gigs this month
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <DollarSign className="mr-2 h-4 w-4" />
                Check my royalty payments
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Mail className="mr-2 h-4 w-4" />
                Draft follow-up emails
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Review pending contracts
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
