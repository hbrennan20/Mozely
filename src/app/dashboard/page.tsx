"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { format, isSameDay } from "date-fns";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Calendar as CalendarWidget } from "@/components/ui/calendar";
import {
  Calendar,
  DollarSign,
  TrendingUp,
  MessageSquare,
  Bot,
  MapPin,
  Clock,
  ArrowUpRight,
  Send,
  Loader2,
} from "lucide-react";

const upcomingGigs = [
  {
    venue: "Ronnie Scott's",
    date: "Mar 15, 2026",
    time: "9:00 PM",
    location: "London, UK",
    fee: "£1,200",
    status: "confirmed",
  },
  {
    venue: "The Jazz Cafe",
    date: "Mar 22, 2026",
    time: "8:30 PM",
    location: "London, UK",
    fee: "\u00a3800",
    status: "confirmed",
  },
  {
    venue: "KOKO",
    date: "Apr 2, 2026",
    time: "7:00 PM",
    location: "London, UK",
    fee: "£950",
    status: "pending",
  },
];

const allActivity = [
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
  {
    action: "Merch store weekly report generated",
    time: "3 days ago",
    type: "report",
  },
  {
    action: "Social media post scheduled for Friday",
    time: "3 days ago",
    type: "outreach",
  },
  {
    action: "Gig at PizzaExpress Live marked as completed",
    time: "4 days ago",
    type: "contract",
  },
  {
    action: "New venue lead: The Lexington, London",
    time: "5 days ago",
    type: "outreach",
  },
  {
    action: "Invoice #1041 sent to Southbank Centre",
    time: "5 days ago",
    type: "payment",
  },
];

const calendarEvents = [
  {
    date: new Date(2026, 2, 15),
    title: "Ronnie Scott's",
    time: "9:00 PM",
    type: "gig" as const,
  },
  {
    date: new Date(2026, 2, 18),
    title: "Studio session – Abbey Road",
    time: "2:00 PM",
    type: "session" as const,
  },
  {
    date: new Date(2026, 2, 22),
    title: "The Jazz Cafe",
    time: "8:30 PM",
    type: "gig" as const,
  },
  {
    date: new Date(2026, 2, 25),
    title: "Band rehearsal",
    time: "4:00 PM",
    type: "rehearsal" as const,
  },
  {
    date: new Date(2026, 3, 2),
    title: "KOKO",
    time: "7:00 PM",
    type: "gig" as const,
  },
  {
    date: new Date(2026, 3, 8),
    title: "Podcast interview – Jazz FM",
    time: "11:00 AM",
    type: "session" as const,
  },
  {
    date: new Date(2026, 3, 14),
    title: "Southbank Centre",
    time: "8:00 PM",
    type: "gig" as const,
  },
];

const eventTypeColors = {
  gig: "bg-primary",
  session: "bg-blue-500",
  rehearsal: "bg-amber-500",
};

const mozelySuggestions = [
  "Find me jazz gigs in London this month",
  "What's my next confirmed gig?",
  "Send a follow-up to The Troubadour",
  "Summarise my earnings this quarter",
];

export default function DashboardPage() {
  const router = useRouter();
  const [showAllActivity, setShowAllActivity] = useState(false);
  const [askOpen, setAskOpen] = useState(false);
  const [askInput, setAskInput] = useState("");
  const [askMessages, setAskMessages] = useState<
    { role: "user" | "assistant"; text: string }[]
  >([]);
  const [askLoading, setAskLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const eventDates = useMemo(
    () => calendarEvents.map((e) => e.date),
    []
  );

  const selectedDayEvents = useMemo(
    () =>
      selectedDate
        ? calendarEvents.filter((e) => isSameDay(e.date, selectedDate))
        : [],
    [selectedDate]
  );

  const displayedActivity = showAllActivity
    ? allActivity
    : allActivity.slice(0, 5);

  const handleAsk = () => {
    const trimmed = askInput.trim();
    if (!trimmed) return;

    setAskMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setAskInput("");
    setAskLoading(true);

    // Simulate agent response
    setTimeout(() => {
      const responses: Record<string, string> = {
        gig: "I found 3 jazz venues in London with open slots this month. I'll send inquiries to The Troubadour, Servant Jazz Quarters, and Kansas Smitty's. Shall I go ahead?",
        next: "Your next confirmed gig is at Ronnie Scott's on Mar 15 at 9:00 PM. Soundcheck is at 5 PM. Full band setup.",
        follow: "I'll draft a follow-up email to The Troubadour referencing your last performance. I'll have it ready for your review in a moment.",
        earn: "This quarter you've earned £4,850 from live performances and £1,200 from streaming royalties, totalling £6,050. That's up 15% from last quarter.",
      };

      const key = Object.keys(responses).find((k) =>
        trimmed.toLowerCase().includes(k)
      );
      const reply =
        key
          ? responses[key]
          : "I'm on it! Let me look into that and get back to you shortly. In the meantime, you can check your gigs page for the latest updates.";

      setAskMessages((prev) => [...prev, { role: "assistant", text: reply }]);
      setAskLoading(false);
    }, 1200);
  };

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
        <Button onClick={() => setAskOpen(true)}>
          <Bot className="mr-2 h-4 w-4" />
          Ask Mozely
        </Button>
      </div>

      {/* Ask Mozely Dialog */}
      <Dialog
        open={askOpen}
        onOpenChange={(open) => {
          setAskOpen(open);
          if (!open) {
            setAskMessages([]);
            setAskInput("");
          }
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Ask Mozely
            </DialogTitle>
            <DialogDescription>
              Ask your AI agent anything about your music career.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {askMessages.length === 0 && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Try asking:</p>
                {mozelySuggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className="block w-full text-left text-sm rounded-md border px-3 py-2 hover:bg-muted/50 transition-colors"
                    onClick={() => {
                      setAskInput(s);
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            {askMessages.length > 0 && (
              <div className="max-h-64 overflow-y-auto space-y-3 rounded-md border p-3">
                {askMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                {askLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg px-3 py-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  </div>
                )}
              </div>
            )}
            <div className="flex gap-2">
              <Input
                placeholder="Ask Mozely something..."
                value={askInput}
                onChange={(e) => setAskInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAsk()}
              />
              <Button size="icon" onClick={handleAsk} disabled={askLoading}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
            <div className="text-2xl font-bold">£4,850</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => router.push("/dashboard/gigs")}
        >
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
        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => router.push("/dashboard/analytics")}
        >
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

      {/* Calendar */}
      <Card>
        <CardHeader>
          <CardTitle>Calendar</CardTitle>
          <CardDescription>Your upcoming gigs, sessions &amp; rehearsals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            <CalendarWidget
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              modifiers={{ event: eventDates }}
              modifiersClassNames={{
                event:
                  "relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:h-1 after:w-1 after:rounded-full after:bg-primary",
              }}
              className="rounded-md border"
            />
            <div className="flex-1 min-w-0">
              {selectedDate ? (
                <div className="space-y-1">
                  <h3 className="font-medium text-sm">
                    {format(selectedDate, "EEEE, MMMM d")}
                  </h3>
                  {selectedDayEvents.length > 0 ? (
                    <div className="space-y-3 mt-3">
                      {selectedDayEvents.map((event, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div
                            className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${eventTypeColors[event.type]}`}
                          />
                          <div>
                            <p className="text-sm font-medium">{event.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {event.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground mt-2">
                      No events scheduled.
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <h3 className="font-medium text-sm">Upcoming</h3>
                  {calendarEvents.slice(0, 4).map((event, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div
                        className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${eventTypeColors[event.type]}`}
                      />
                      <div>
                        <p className="text-sm font-medium">{event.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(event.date, "MMM d")} · {event.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-4 mt-4 pt-4 border-t">
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span className="text-xs text-muted-foreground">Gig</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                  <span className="text-xs text-muted-foreground">Session</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-amber-500" />
                  <span className="text-xs text-muted-foreground">Rehearsal</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
            {displayedActivity.map((activity, i) => (
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
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-2"
              onClick={() => setShowAllActivity(!showAllActivity)}
            >
              {showAllActivity ? "Show Less" : "View All Activity"}
              <ArrowUpRight className="ml-2 h-3 w-3" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
