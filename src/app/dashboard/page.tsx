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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  DollarSign,
  TrendingUp,
  MessageSquare,
  Bot,
  MapPin,
  Clock,
  ArrowUpRight,
} from "lucide-react";

const upcomingGigs = [
  {
    venue: "The Blue Note",
    date: "Mar 15, 2026",
    time: "9:00 PM",
    location: "New York, NY",
    fee: "$1,200",
    status: "confirmed",
  },
  {
    venue: "Ronnie Scott's",
    date: "Mar 22, 2026",
    time: "8:30 PM",
    location: "London, UK",
    fee: "\u00a3800",
    status: "confirmed",
  },
  {
    venue: "Jazz Cafe Sessions",
    date: "Apr 2, 2026",
    time: "7:00 PM",
    location: "Los Angeles, CA",
    fee: "$950",
    status: "pending",
  },
];

const recentActivity = [
  {
    action: "Gig inquiry sent to The Troubadour",
    time: "2 hours ago",
    type: "outreach",
  },
  {
    action: "Invoice #1042 paid by Blue Note",
    time: "5 hours ago",
    type: "payment",
  },
  {
    action: "Contract review completed for festival booking",
    time: "1 day ago",
    type: "contract",
  },
  {
    action: "Royalty discrepancy flagged on Spotify",
    time: "1 day ago",
    type: "alert",
  },
  {
    action: "New collaboration request from Sarah Chen",
    time: "2 days ago",
    type: "message",
  },
];

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Good evening, Alex
          </h1>
          <p className="text-muted-foreground">
            Here&apos;s what&apos;s happening with your music career.
          </p>
        </div>
        <Button>
          <Bot className="mr-2 h-4 w-4" />
          Ask Mozely
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Earnings
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$4,850</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Gigs
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">Next 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Streams
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.3K</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Unread Messages
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              2 require your attention
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming Gigs */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Gigs</CardTitle>
            <CardDescription>Your next confirmed performances</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingGigs.map((gig, i) => (
              <div key={i}>
                {i > 0 && <Separator className="mb-4" />}
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{gig.venue}</p>
                      <Badge
                        variant={
                          gig.status === "confirmed" ? "default" : "secondary"
                        }
                        className="text-xs"
                      >
                        {gig.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {gig.date} at {gig.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {gig.location}
                      </span>
                    </div>
                  </div>
                  <span className="font-semibold">{gig.fee}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* AI Agent Activity */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Agent Activity</CardTitle>
                <CardDescription>
                  What Mozely has been doing for you
                </CardDescription>
              </div>
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-primary shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full mt-2">
              View All Activity
              <ArrowUpRight className="ml-2 h-3 w-3" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
