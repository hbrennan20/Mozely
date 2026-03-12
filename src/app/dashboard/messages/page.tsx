"use client";

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
import { Search, Pencil, Bot } from "lucide-react";

const conversations = [
  {
    name: "Sarah Chen",
    role: "Collaborator",
    lastMessage: "Would love to work together on the spring EP. What dates work for you?",
    time: "2h ago",
    unread: true,
  },
  {
    name: "The Blue Note - Booking",
    role: "Venue",
    lastMessage: "Contract attached for your March 15 performance. Please review and sign.",
    time: "5h ago",
    unread: true,
  },
  {
    name: "Mike Torres",
    role: "Promoter",
    lastMessage: "I can offer $1,500 for the April 20th date. Let me know!",
    time: "1d ago",
    unread: false,
  },
  {
    name: "Ronnie Scott's",
    role: "Venue",
    lastMessage: "Rider requirements confirmed. See you on the 22nd!",
    time: "2d ago",
    unread: false,
  },
  {
    name: "Lisa Park - Manager",
    role: "Industry",
    lastMessage: "Let's catch up about the festival circuit. Free next week?",
    time: "3d ago",
    unread: false,
  },
];

export default function MessagesPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Messages</h1>
          <p className="text-muted-foreground">Communications managed by Mozely.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Bot className="mr-2 h-4 w-4" />
            Draft Replies
          </Button>
          <Button>
            <Pencil className="mr-2 h-4 w-4" />
            Compose
          </Button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search messages..." className="pl-10" />
      </div>

      <Card>
        <CardContent className="p-0 divide-y">
          {conversations.map((conv, i) => (
            <div
              key={i}
              className="flex items-start gap-4 p-4 hover:bg-muted/50 cursor-pointer transition-colors"
            >
              <Avatar>
                <AvatarFallback>{conv.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={`text-sm ${conv.unread ? "font-semibold" : "font-medium"}`}>
                    {conv.name}
                  </p>
                  <Badge variant="outline" className="text-xs">{conv.role}</Badge>
                  {conv.unread && (
                    <span className="h-2 w-2 rounded-full bg-primary" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">{conv.time}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
