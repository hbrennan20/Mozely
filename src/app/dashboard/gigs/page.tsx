"use client";

import { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Plus,
  Bot,
  Search,
} from "lucide-react";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

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
  lng: number;
  lat: number;
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
    lng: -74.0004,
    lat: 40.7306,
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
    lng: -0.1318,
    lat: 51.5134,
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
    lng: -118.2437,
    lat: 34.0522,
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
    lng: -121.8947,
    lat: 36.6002,
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
    lng: -74.0018,
    lat: 40.7359,
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
    lng: -87.6298,
    lat: 41.8827,
  },
  // European Tour - May 2026
  {
    id: 7,
    venue: "New Morning",
    date: "May 1, 2026",
    time: "9:00 PM",
    location: "Paris, France",
    fee: "\u20ac1,100",
    status: "confirmed",
    type: "Jazz Club",
    notes: "European tour kickoff. Trio format.",
    lng: 2.3522,
    lat: 48.8716,
  },
  {
    id: 8,
    venue: "Bimhuis",
    date: "May 3, 2026",
    time: "8:30 PM",
    location: "Amsterdam, Netherlands",
    fee: "\u20ac950",
    status: "confirmed",
    type: "Jazz Club",
    notes: "Sold out. Hotel booked near venue.",
    lng: 4.9041,
    lat: 52.3792,
  },
  {
    id: 9,
    venue: "A-Trane",
    date: "May 5, 2026",
    time: "9:30 PM",
    location: "Berlin, Germany",
    fee: "\u20ac900",
    status: "confirmed",
    type: "Jazz Club",
    notes: "Two sets. Local rhythm section provided.",
    lng: 13.3255,
    lat: 52.5069,
  },
  {
    id: 10,
    venue: "Porgy & Bess",
    date: "May 7, 2026",
    time: "8:00 PM",
    location: "Vienna, Austria",
    fee: "\u20ac1,000",
    status: "confirmed",
    type: "Jazz Club",
    notes: "Record label showcase. Press attending.",
    lng: 16.3738,
    lat: 48.2082,
  },
  {
    id: 11,
    venue: "Blue Note Milano",
    date: "May 9, 2026",
    time: "9:00 PM",
    location: "Milan, Italy",
    fee: "\u20ac1,200",
    status: "confirmed",
    type: "Jazz Club",
    notes: "Full band flies in. Soundcheck at 4 PM.",
    lng: 9.1900,
    lat: 45.4642,
  },
  {
    id: 12,
    venue: "Jamboree",
    date: "May 11, 2026",
    time: "10:00 PM",
    location: "Barcelona, Spain",
    fee: "\u20ac850",
    status: "pending",
    type: "Jazz Club",
    notes: "Contract under review by Mozely.",
    lng: 2.1734,
    lat: 41.3809,
  },
  {
    id: 13,
    venue: "North Sea Jazz Festival",
    date: "May 15, 2026",
    time: "4:00 PM",
    location: "Rotterdam, Netherlands",
    fee: "\u20ac3,000",
    status: "inquiry",
    type: "Festival",
    notes: "Mozely submitted application. Major festival opportunity.",
    lng: 4.4777,
    lat: 51.9244,
  },
  {
    id: 14,
    venue: "Montreux Jazz Festival",
    date: "May 18, 2026",
    time: "7:00 PM",
    location: "Montreux, Switzerland",
    fee: "\u20ac4,500",
    status: "inquiry",
    type: "Festival",
    notes: "Dream gig. Mozely negotiating with booker.",
    lng: 6.9106,
    lat: 46.4312,
  },
];

const statusColors: Record<
  GigStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  confirmed: "default",
  pending: "secondary",
  inquiry: "outline",
  completed: "secondary",
};

const statusMapColors: Record<GigStatus, string> = {
  confirmed: "#18181b",
  pending: "#a1a1aa",
  inquiry: "#71717a",
  completed: "#d4d4d8",
};

function GigCard({
  gig,
  onHover,
  isActive,
}: {
  gig: Gig;
  onHover: (id: number | null) => void;
  isActive: boolean;
}) {
  return (
    <div
      className={`flex items-start justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
        isActive ? "border-primary bg-muted/50" : "hover:bg-muted/30"
      }`}
      onMouseEnter={() => onHover(gig.id)}
      onMouseLeave={() => onHover(null)}
    >
      <div className="space-y-1.5 min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-semibold text-sm">{gig.venue}</p>
          <Badge variant={statusColors[gig.status]} className="text-[10px] px-1.5 py-0">
            {gig.status}
          </Badge>
          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
            {gig.type}
          </Badge>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
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
      </div>
      <p className="font-bold text-sm ml-2 shrink-0">{gig.fee}</p>
    </div>
  );
}

function GigMap({
  gigs,
  activeGigId,
  onMarkerClick,
}: {
  gigs: Gig[];
  activeGigId: number | null;
  onMarkerClick: (id: number) => void;
}) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<Map<number, mapboxgl.Marker>>(new Map());

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [-40, 40],
      zoom: 2.2,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    gigs.forEach((gig) => {
      const el = document.createElement("div");
      el.className = "gig-marker";
      el.style.width = "14px";
      el.style.height = "14px";
      el.style.borderRadius = "50%";
      el.style.backgroundColor = statusMapColors[gig.status];
      el.style.border = "2px solid white";
      el.style.boxShadow = "0 1px 4px rgba(0,0,0,0.3)";
      el.style.cursor = "pointer";
      el.style.transition = "all 0.2s ease";
      el.dataset.gigId = String(gig.id);

      el.addEventListener("click", () => onMarkerClick(gig.id));

      const popup = new mapboxgl.Popup({
        offset: 12,
        closeButton: false,
        className: "gig-popup",
      }).setHTML(
        `<div style="font-family: Inter, sans-serif; padding: 2px 0;">
          <strong style="font-size: 13px;">${gig.venue}</strong>
          <div style="font-size: 11px; color: #71717a; margin-top: 2px;">${gig.date} &middot; ${gig.time}</div>
          <div style="font-size: 11px; color: #71717a;">${gig.location}</div>
          <div style="font-size: 12px; font-weight: 600; margin-top: 4px;">${gig.fee}</div>
        </div>`
      );

      const marker = new mapboxgl.Marker(el)
        .setLngLat([gig.lng, gig.lat])
        .setPopup(popup)
        .addTo(map.current!);

      markersRef.current.set(gig.id, marker);
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    markersRef.current.forEach((marker, id) => {
      const el = marker.getElement();
      if (id === activeGigId) {
        el.style.width = "20px";
        el.style.height = "20px";
        el.style.backgroundColor = "#18181b";
        el.style.zIndex = "10";
        marker.togglePopup();
      } else {
        const gig = gigs.find((g) => g.id === id);
        el.style.width = "14px";
        el.style.height = "14px";
        el.style.backgroundColor = gig
          ? statusMapColors[gig.status]
          : "#71717a";
        el.style.zIndex = "1";
        const popup = marker.getPopup();
        if (popup?.isOpen()) {
          marker.togglePopup();
        }
      }
    });

    if (activeGigId && map.current) {
      const gig = gigs.find((g) => g.id === activeGigId);
      if (gig) {
        map.current.flyTo({
          center: [gig.lng, gig.lat],
          zoom: Math.max(map.current.getZoom(), 5),
          duration: 800,
        });
      }
    }
  }, [activeGigId, gigs]);

  return (
    <div ref={mapContainer} className="w-full h-full rounded-lg" />
  );
}

export default function GigsPage() {
  const [search, setSearch] = useState("");
  const [activeGigId, setActiveGigId] = useState<number | null>(null);

  const upcoming = allGigs.filter(
    (g) => g.status === "confirmed" || g.status === "pending"
  );
  const inquiries = allGigs.filter((g) => g.status === "inquiry");
  const past = allGigs.filter((g) => g.status === "completed");

  return (
    <div className="flex h-[calc(100vh-2rem)] gap-4 p-4">
      {/* Left: Gig List */}
      <div className="w-[420px] shrink-0 flex flex-col gap-4 overflow-hidden">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Gigs</h1>
            <p className="text-sm text-muted-foreground">
              Manage your performances and bookings.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Bot className="mr-1 h-3 w-3" />
              Find
            </Button>
            <Dialog>
              <DialogTrigger className="inline-flex shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground text-xs font-medium h-7 gap-1 px-2 transition-all">
                <Plus className="h-3 w-3" />
                Add
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add a New Gig</DialogTitle>
                  <DialogDescription>
                    Enter the details for a new booking. Mozely can also find
                    gigs for you automatically.
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

        <Tabs defaultValue="upcoming" className="flex flex-col flex-1 overflow-hidden">
          <TabsList>
            <TabsTrigger value="upcoming">
              Upcoming ({upcoming.length})
            </TabsTrigger>
            <TabsTrigger value="inquiries">
              Inquiries ({inquiries.length})
            </TabsTrigger>
            <TabsTrigger value="past">Past ({past.length})</TabsTrigger>
          </TabsList>

          <TabsContent
            value="upcoming"
            className="space-y-2 mt-3 overflow-y-auto flex-1 pr-1"
          >
            {upcoming.map((gig) => (
              <GigCard
                key={gig.id}
                gig={gig}
                onHover={setActiveGigId}
                isActive={activeGigId === gig.id}
              />
            ))}
          </TabsContent>

          <TabsContent
            value="inquiries"
            className="space-y-2 mt-3 overflow-y-auto flex-1 pr-1"
          >
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
              inquiries.map((gig) => (
                <GigCard
                  key={gig.id}
                  gig={gig}
                  onHover={setActiveGigId}
                  isActive={activeGigId === gig.id}
                />
              ))
            )}
          </TabsContent>

          <TabsContent
            value="past"
            className="space-y-2 mt-3 overflow-y-auto flex-1 pr-1"
          >
            {past.map((gig) => (
              <GigCard
                key={gig.id}
                gig={gig}
                onHover={setActiveGigId}
                isActive={activeGigId === gig.id}
              />
            ))}
          </TabsContent>
        </Tabs>
      </div>

      {/* Right: Map */}
      <div className="flex-1 rounded-lg border overflow-hidden">
        <GigMap
          gigs={allGigs}
          activeGigId={activeGigId}
          onMarkerClick={setActiveGigId}
        />
      </div>
    </div>
  );
}
