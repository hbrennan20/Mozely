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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  MapPin,
  Clock,
  DollarSign,
  Plus,
  Bot,
  Search,
} from "lucide-react";

type GigStatus = "confirmed" | "pending" | "inquiry" | "completed";

interface Gig {
  id: number;
  venue: string;
  date: string;
  time: string;
  location: string;
  fee: string;
  status: GigStatus;
  type: string;
  notes: string;
}

const allGigs: Gig[] = [
  {
    id: 1,
    venue: "The Blue Note",
    date: "Mar 15, 2026",
    time: "9:00 PM",
    location: "New York, NY",
    fee: "$1,200",
    status: "confirmed",
    type: "Jazz Club",
    notes: "Full band setup. Soundcheck at 5 PM.",
  },
  {
    id: 2,
    venue: "Ronnie Scott's",
    date: "Mar 22, 2026",
    time: "8:30 PM",
    location: "London, UK",
    fee: "\u00a3800",
    status: "confirmed",
    type: "Jazz Club",
    notes: "Solo performance. Travel arranged.",
  },
  {
    id: 3,
    venue: "Jazz Cafe Sessions",
    date: "Apr 2, 2026",
    time: "7:00 PM",
    location: "Los Angeles, CA",
    fee: "$950",
    status: "pending",
    type: "Cafe",
    notes: "Awaiting contract from venue.",
  },
  {
    id: 4,
    venue: "Monterey Jazz Festival",
    date: "Apr 18, 2026",
    time: "3:00 PM",
    location: "Monterey, CA",
    fee: "$3,500",
    status: "inquiry",
    type: "Festival",
    notes: "Mozely sent inquiry. Waiting for response.",
  },
  {
    id: 5,
    venue: "Village Vanguard",
    date: "Feb 28, 2026",
    time: "8:00 PM",
    location: "New York, NY",
    fee: "$1,000",
    status: "completed",
    type: "Jazz Club",
    notes: "Great show. Venue wants to rebook.",
  },
  {
    id: 6,
    venue: "Chicago Blues Fest",
    date: "Feb 14, 2026",
    time: "5:00 PM",
    location: "Chicago, IL",
    fee: "$2,000",
    status: "completed",
    type: "Festival",
    notes: "Paid in full.",
  },
];

const statusColors: Record<GigStatus, "default" | "secondary" | "outline" | "destructive"> = {
  confirmed: "default",
  pending: "secondary",
  inquiry: "outline",
  completed: "secondary",
};

function GigCard({ gig }: { gig: Gig }) {
  return (
    <div className="flex items-start justify-between p-4 rounded-lg border">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <p className="font-semibold">{gig.venue}</p>
          <Badge variant={statusColors[gig.status]}>{gig.status}</Badge>
          <Badge variant="outline" className="text-xs">
            {gig.type}
          </Badge>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {gig.date}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {gig.time}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {gig.location}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">{gig.notes}</p>
      </div>
      <div className="text-right">
        <p className="font-bold text-lg">{gig.fee}</p>
      </div>
    </div>
  );
}

export default function GigsPage() {
  const [search, setSearch] = useState("");

  const upcoming = allGigs.filter(
    (g) => g.status === "confirmed" || g.status === "pending"
  );
  const inquiries = allGigs.filter((g) => g.status === "inquiry");
  const past = allGigs.filter((g) => g.status === "completed");

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gigs</h1>
          <p className="text-muted-foreground">
            Manage your performances and bookings.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Bot className="mr-2 h-4 w-4" />
            Find Gigs
          </Button>
          <Dialog>
            <DialogTrigger
              className="inline-flex shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-medium h-8 gap-1.5 px-2.5 transition-all"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Gig
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add a New Gig</DialogTitle>
                <DialogDescription>
                  Enter the details for a new booking. Mozely can also find gigs
                  for you automatically.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <Input placeholder="Venue name" />
                <div className="grid grid-cols-2 gap-4">
                  <Input type="date" />
                  <Input type="time" />
                </div>
                <Input placeholder="Location" />
                <Input placeholder="Fee" />
                <Textarea placeholder="Notes" />
                <Button className="w-full">Save Gig</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search gigs..."
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">
            Upcoming ({upcoming.length})
          </TabsTrigger>
          <TabsTrigger value="inquiries">
            Inquiries ({inquiries.length})
          </TabsTrigger>
          <TabsTrigger value="past">Past ({past.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-3 mt-4">
          {upcoming.map((gig) => (
            <GigCard key={gig.id} gig={gig} />
          ))}
        </TabsContent>

        <TabsContent value="inquiries" className="space-y-3 mt-4">
          {inquiries.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                <Bot className="h-8 w-8 mx-auto mb-3 opacity-50" />
                <p>No active inquiries.</p>
                <p className="text-sm">
                  Let Mozely find and reach out to venues for you.
                </p>
              </CardContent>
            </Card>
          ) : (
            inquiries.map((gig) => <GigCard key={gig.id} gig={gig} />)
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-3 mt-4">
          {past.map((gig) => (
            <GigCard key={gig.id} gig={gig} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
