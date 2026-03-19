"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
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
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import {
  CalendarDays,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Map as MapIcon,
  MapPin,
  Music,
  Navigation,
  Pause,
  Plus,
  Route,
  Search,
  Ticket,
  Trash2,
} from "lucide-react";

/* ─── Types ─────────────────────────────────────────────────────── */

type StopStatus = "confirmed" | "hold" | "draft";

type TourStop = {
  id: number;
  city: string;
  venue: string;
  date: string;
  status: StopStatus;
  lat: number;
  lng: number;
};

type KnownVenue = {
  venue: string;
  lat: number;
  lng: number;
};

type DiscoverEvent = {
  id: string;
  name: string;
  localDate: string;
  localTime: string;
  venue: string;
  city: string;
};

/* ─── Data ──────────────────────────────────────────────────────── */

const knownVenues: KnownVenue[] = [
  { venue: "O2 Academy Brixton", lat: 51.4656, lng: -0.1146 },
  { venue: "Eventim Apollo", lat: 51.4901, lng: -0.2239 },
  { venue: "Roundhouse", lat: 51.5433, lng: -0.1511 },
  { venue: "KOKO", lat: 51.5341, lng: -0.1393 },
  { venue: "The Jazz Cafe", lat: 51.5414, lng: -0.1427 },
  { venue: "Electric Ballroom", lat: 51.5415, lng: -0.1421 },
  { venue: "Camden Assembly", lat: 51.5418, lng: -0.1432 },
  { venue: "The Dublin Castle", lat: 51.5396, lng: -0.1433 },
  { venue: "The Underworld", lat: 51.5415, lng: -0.1415 },
  { venue: "Village Underground", lat: 51.5242, lng: -0.0791 },
  { venue: "XOYO", lat: 51.5256, lng: -0.0876 },
  { venue: "The Old Blue Last", lat: 51.5267, lng: -0.0788 },
  { venue: "Colours Hoxton", lat: 51.5317, lng: -0.0762 },
  { venue: "Scala", lat: 51.5303, lng: -0.1203 },
  { venue: "Heaven", lat: 51.5074, lng: -0.1238 },
  { venue: "The Garage", lat: 51.5473, lng: -0.1038 },
  { venue: "Islington Assembly Hall", lat: 51.536, lng: -0.1033 },
  { venue: "The Lexington", lat: 51.5332, lng: -0.1118 },
  { venue: "OMEARA", lat: 51.5044, lng: -0.0856 },
  { venue: "Lafayette", lat: 51.5358, lng: -0.1238 },
  { venue: "Alexandra Palace", lat: 51.5942, lng: -0.1296 },
  { venue: "Troxy", lat: 51.5162, lng: -0.0382 },
  { venue: "MOTH Club", lat: 51.5459, lng: -0.0553 },
  { venue: "EartH", lat: 51.5472, lng: -0.0544 },
  { venue: "Oslo Hackney", lat: 51.5464, lng: -0.0554 },
  { venue: "The Shacklewell Arms", lat: 51.5538, lng: -0.0754 },
  { venue: "The George Tavern", lat: 51.5116, lng: -0.0584 },
  { venue: "The Social", lat: 51.516, lng: -0.1368 },
  { venue: "The 100 Club", lat: 51.5168, lng: -0.1307 },
  { venue: "Ronnie Scott's", lat: 51.5136, lng: -0.1317 },
  { venue: "Royal Albert Hall", lat: 51.5009, lng: -0.1774 },
  { venue: "Southbank Centre", lat: 51.5069, lng: -0.1167 },
  { venue: "Union Chapel", lat: 51.5465, lng: -0.1033 },
  { venue: "Brixton Jamm", lat: 51.4602, lng: -0.1157 },
  { venue: "Phonox", lat: 51.465, lng: -0.1142 },
  { venue: "Paper Dress Vintage", lat: 51.5521, lng: -0.0758 },
  { venue: "Peckham Audio", lat: 51.4727, lng: -0.0694 },
  { venue: "Electric Brixton", lat: 51.4636, lng: -0.1132 },
  { venue: "Bush Hall", lat: 51.5042, lng: -0.2271 },
  { venue: "New Cross Inn", lat: 51.4745, lng: -0.0367 },
  { venue: "The Troubadour", lat: 51.4845, lng: -0.1916 },
  { venue: "O2 Shepherds Bush Empire", lat: 51.5025, lng: -0.2258 },
  { venue: "O2 Academy Islington", lat: 51.5357, lng: -0.1041 },
];

const discoverEvents: DiscoverEvent[] = [
  { id: "1", name: "MURKAGE DAVE", localDate: "2026-03-19", localTime: "19:30", venue: "Village Underground", city: "London" },
  { id: "2", name: "Mt. Joy", localDate: "2026-03-27", localTime: "19:00", venue: "Eventim Apollo", city: "London" },
  { id: "3", name: "THE HAUNTED YOUTH", localDate: "2026-04-03", localTime: "19:30", venue: "Colours Hoxton", city: "London" },
  { id: "4", name: "Black Sea Dahu", localDate: "2026-04-16", localTime: "19:00", venue: "Oslo Hackney", city: "London" },
  { id: "5", name: "Basht.", localDate: "2026-04-17", localTime: "19:00", venue: "MOTH Club", city: "London" },
  { id: "6", name: "The Bros. Landreth", localDate: "2026-04-25", localTime: "19:00", venue: "Union Chapel", city: "London" },
  { id: "7", name: "Lizzie Reid", localDate: "2026-04-30", localTime: "19:00", venue: "The Garage", city: "London" },
  { id: "8", name: "Luca Fogale", localDate: "2026-04-30", localTime: "19:00", venue: "Bush Hall", city: "London" },
  { id: "9", name: "Ryan Harris", localDate: "2026-05-07", localTime: "19:00", venue: "The Garage", city: "London" },
  { id: "10", name: "Nick Mulvey", localDate: "2026-05-16", localTime: "19:00", venue: "Troxy", city: "London" },
  { id: "11", name: "Kingfishr", localDate: "2026-05-20", localTime: "19:00", venue: "O2 Academy Brixton", city: "London" },
  { id: "12", name: "RATBOYS", localDate: "2026-05-21", localTime: "19:00", venue: "The Garage", city: "London" },
  { id: "13", name: "John Vincent III", localDate: "2026-05-27", localTime: "19:00", venue: "EartH", city: "London" },
  { id: "14", name: "The Longest Johns", localDate: "2026-05-27", localTime: "19:00", venue: "O2 Shepherds Bush Empire", city: "London" },
  { id: "15", name: "BIIRD", localDate: "2026-05-28", localTime: "19:30", venue: "EartH", city: "London" },
  { id: "16", name: "Ye Vagabonds", localDate: "2026-06-11", localTime: "19:30", venue: "Roundhouse", city: "London" },
  { id: "17", name: "Grace Ives", localDate: "2026-06-16", localTime: "19:30", venue: "Village Underground", city: "London" },
  { id: "18", name: "Buffalo Traffic Jam", localDate: "2026-06-24", localTime: "19:00", venue: "Electric Ballroom", city: "London" },
  { id: "19", name: "José González", localDate: "2026-11-26", localTime: "19:00", venue: "Eventim Apollo", city: "London" },
  { id: "20", name: "Lime Garden", localDate: "2026-10-21", localTime: "19:00", venue: "Electric Brixton", city: "London" },
];

const initialStops: TourStop[] = [
  { id: 1, city: "London", venue: "Scala", date: "2026-04-12", status: "confirmed", lat: 51.5303, lng: -0.1203 },
  { id: 2, city: "London", venue: "Roundhouse", date: "2026-04-15", status: "hold", lat: 51.5433, lng: -0.1511 },
  { id: 3, city: "London", venue: "Eventim Apollo", date: "2026-04-18", status: "confirmed", lat: 51.4901, lng: -0.2239 },
];

const statusOrder: StopStatus[] = ["draft", "hold", "confirmed"];

/* ─── Helpers ───────────────────────────────────────────────────── */

function formatDisplayDate(rawDate: string) {
  if (!rawDate) return "";
  const parsed = new Date(`${rawDate}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return rawDate;
  return parsed.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}

function formatFullDate(rawDate: string) {
  if (!rawDate) return "";
  const parsed = new Date(`${rawDate}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return rawDate;
  return parsed.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

function haversineMiles(start: TourStop, end: TourStop) {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const R = 3958.8;
  const dLat = toRad(end.lat - start.lat);
  const dLng = toRad(end.lng - start.lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(start.lat)) * Math.cos(toRad(end.lat)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toDateInputValue(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function statusBadgeVariant(status: StopStatus) {
  return status === "confirmed" ? "default" as const : status === "hold" ? "secondary" as const : "outline" as const;
}

/* ─── TourMap ───────────────────────────────────────────────────── */

function TourMap({
  stops,
  activeStopId,
  onMarkerClick,
}: {
  stops: TourStop[];
  activeStopId: number | null;
  onMarkerClick: (id: number) => void;
}) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<Map<number, mapboxgl.Marker>>(new Map());
  const centeredRef = useRef(false);
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  useEffect(() => {
    if (!token || !mapContainerRef.current || mapRef.current) return;
    mapboxgl.accessToken = token;
    const markers = markersRef.current;
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [-0.1276, 51.5074],
      zoom: 11,
      minZoom: 2,
    });
    map.addControl(new mapboxgl.NavigationControl(), "top-right");
    mapRef.current = map;
    return () => {
      markers.forEach((m) => m.remove());
      markers.clear();
      try {
        mapRef.current?.remove();
      } catch {
        // Mapbox may throw AbortError during React strict-mode remount
      }
      mapRef.current = null;
    };
  }, [token]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    markersRef.current.forEach((m) => m.remove());
    markersRef.current.clear();

    stops.forEach((stop, index) => {
      const el = document.createElement("button");
      el.type = "button";
      el.className =
        "flex items-center justify-center h-8 w-8 rounded-full border-2 border-white bg-primary text-[11px] font-bold text-primary-foreground shadow-lg transition-transform hover:scale-110";
      el.textContent = String(index + 1);
      el.addEventListener("click", () => onMarkerClick(stop.id));

      const marker = new mapboxgl.Marker(el)
        .setLngLat([stop.lng, stop.lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 14, className: "tour-popup" }).setHTML(
            `<div style="font-family:Inter,sans-serif;padding:2px 0">
              <div style="font-weight:700;font-size:13px">${stop.venue}</div>
              <div style="font-size:12px;color:#a1a1aa;margin-top:2px">${stop.city} · ${formatDisplayDate(stop.date)}</div>
            </div>`
          )
        )
        .addTo(map);
      markersRef.current.set(stop.id, marker);
    });
  }, [onMarkerClick, stops]);

  useEffect(() => {
    const map = mapRef.current;
    const src = "tour-route-source";
    const lyr = "tour-route-line";
    if (!map) return;

    if (stops.length < 2) {
      if (map.getLayer(lyr)) map.removeLayer(lyr);
      if (map.getSource(src)) map.removeSource(src);
      return;
    }

    const update = () => {
      const data: GeoJSON.Feature<GeoJSON.LineString> = {
        type: "Feature",
        properties: {},
        geometry: { type: "LineString", coordinates: stops.map((s) => [s.lng, s.lat]) },
      };
      if (!map.getSource(src)) {
        map.addSource(src, { type: "geojson", data });
      } else {
        (map.getSource(src) as mapboxgl.GeoJSONSource).setData(data);
      }
      if (!map.getLayer(lyr)) {
        map.addLayer({
          id: lyr,
          type: "line",
          source: src,
          paint: { "line-color": "#a78bfa", "line-width": 2.5, "line-opacity": 0.7, "line-dasharray": [2, 2] },
        });
      }
    };

    if (map.isStyleLoaded()) update();
    else map.once("load", update);

    if (!centeredRef.current) {
      const bounds = new mapboxgl.LngLatBounds([stops[0].lng, stops[0].lat], [stops[0].lng, stops[0].lat]);
      stops.forEach((s) => bounds.extend([s.lng, s.lat]));
      map.fitBounds(bounds, { padding: 60, maxZoom: 13 });
      centeredRef.current = true;
    }
  }, [stops]);

  useEffect(() => {
    markersRef.current.forEach((marker, id) => {
      const el = marker.getElement();
      const active = id === activeStopId;
      el.style.transform = active ? "scale(1.25)" : "scale(1)";
      el.style.zIndex = active ? "10" : "1";
      if (active) marker.togglePopup();
      else if (marker.getPopup()?.isOpen()) marker.togglePopup();
    });
  }, [activeStopId]);

  if (!token) {
    return (
      <div className="h-full flex items-center justify-center p-6 text-center text-sm text-muted-foreground">
        Add <code className="mx-1 rounded bg-muted px-1.5 py-0.5 text-xs">NEXT_PUBLIC_MAPBOX_TOKEN</code> to <code className="mx-1 rounded bg-muted px-1.5 py-0.5 text-xs">.env.local</code> to enable tour maps.
      </div>
    );
  }

  return <div ref={mapContainerRef} className="h-full w-full" />;
}

/* ─── VenuePicker ───────────────────────────────────────────────── */

function VenuePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (venue: KnownVenue | null, text: string) => void;
}) {
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => { setQuery(value); }, [value]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = useMemo(
    () =>
      query.length > 0
        ? knownVenues.filter((v) => v.venue.toLowerCase().includes(query.toLowerCase())).slice(0, 8)
        : knownVenues.slice(0, 8),
    [query]
  );

  return (
    <div ref={ref} className="relative">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            onChange(null, e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search venues…"
          className="pl-8"
        />
      </div>
      {open && filtered.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border bg-popover p-1 shadow-md">
          {filtered.map((v) => (
            <button
              key={v.venue}
              type="button"
              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent text-left"
              onClick={() => {
                setQuery(v.venue);
                onChange(v, v.venue);
                setOpen(false);
              }}
            >
              <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              {v.venue}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────────── */

export default function ToursPage() {
  const [stops, setStops] = useState<TourStop[]>(initialStops);
  const [activeStopId, setActiveStopId] = useState<number | null>(null);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<Date | undefined>(new Date(initialStops[0].date));
  const [discoverSearch, setDiscoverSearch] = useState("");

  // Add-stop form
  const [formVenue, setFormVenue] = useState("");
  const [formVenueData, setFormVenueData] = useState<KnownVenue | null>(null);
  const [formCity, setFormCity] = useState("London");
  const [formDate, setFormDate] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const orderedStops = useMemo(
    () => [...stops].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [stops]
  );

  const totalDistance = useMemo(() => {
    if (orderedStops.length < 2) return 0;
    return orderedStops.slice(1).reduce((mi, s, i) => mi + haversineMiles(orderedStops[i], s), 0);
  }, [orderedStops]);

  const dateRange = useMemo(() => {
    if (orderedStops.length === 0) return null;
    const first = orderedStops[0].date;
    const last = orderedStops[orderedStops.length - 1].date;
    return { first, last, days: Math.ceil((new Date(last).getTime() - new Date(first).getTime()) / 86400000) + 1 };
  }, [orderedStops]);

  const confirmedCount = useMemo(() => stops.filter((s) => s.status === "confirmed").length, [stops]);

  const calendarDateSet = useMemo(() => new Set(stops.map((s) => s.date)), [stops]);

  const selectedDayStops = useMemo(() => {
    if (!selectedCalendarDate) return [];
    const key = toDateInputValue(selectedCalendarDate);
    return orderedStops.filter((s) => s.date === key);
  }, [orderedStops, selectedCalendarDate]);

  const filteredEvents = useMemo(() => {
    const q = discoverSearch.toLowerCase();
    return discoverEvents.filter(
      (e) => e.name.toLowerCase().includes(q) || e.venue.toLowerCase().includes(q)
    );
  }, [discoverSearch]);

  const handleMarkerClick = useCallback((id: number) => setActiveStopId(id), []);

  const addStop = () => {
    if (!formVenueData) {
      setFormError("Select a venue from the list.");
      return;
    }
    if (!formDate) {
      setFormError("Pick a date.");
      return;
    }
    setFormError(null);
    setStops((prev) => [
      ...prev,
      {
        id: Date.now(),
        city: formCity || "London",
        venue: formVenueData.venue,
        date: formDate,
        status: "draft",
        lat: formVenueData.lat,
        lng: formVenueData.lng,
      },
    ]);
    setFormVenue("");
    setFormVenueData(null);
    setFormDate("");
  };

  const addEventAsStop = (event: DiscoverEvent) => {
    const venueData = knownVenues.find((v) => v.venue === event.venue);
    if (!venueData) return;
    if (stops.some((s) => s.venue === event.venue && s.date === event.localDate)) return;
    setStops((prev) => [
      ...prev,
      {
        id: Date.now(),
        city: event.city,
        venue: event.venue,
        date: event.localDate,
        status: "draft",
        lat: venueData.lat,
        lng: venueData.lng,
      },
    ]);
  };

  const removeStop = (id: number) => {
    setStops((prev) => prev.filter((s) => s.id !== id));
    if (activeStopId === id) setActiveStopId(null);
  };

  const cycleStatus = (id: number) => {
    setStops((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const next = statusOrder[(statusOrder.indexOf(s.status) + 1) % statusOrder.length];
        return { ...s, status: next };
      })
    );
  };

  const moveStop = (id: number, dir: -1 | 1) => {
    setStops((prev) => {
      const idx = prev.findIndex((s) => s.id === id);
      if (idx < 0) return prev;
      const target = idx + dir;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[target]] = [next[target], next[idx]];
      const tmpDate = next[idx].date;
      next[idx] = { ...next[idx], date: next[target].date };
      next[target] = { ...next[target], date: tmpDate };
      return next;
    });
  };

  const isEventOnTour = (event: DiscoverEvent) =>
    stops.some((s) => s.venue === event.venue && s.date === event.localDate);

  return (
    <div className="flex h-[calc(100vh-2rem)] flex-col gap-4 p-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">London Spring Tour</h1>
          <p className="text-sm text-muted-foreground">
            {dateRange
              ? `${formatDisplayDate(dateRange.first)} – ${formatDisplayDate(dateRange.last)} · ${dateRange.days} days`
              : "No stops yet"}
          </p>
        </div>
        <Button render={<Link href="/dashboard/tours/new" />}>
          <Plus className="mr-2 h-4 w-4" />
          New Tour
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-lg border bg-card p-3">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" /> Stops
          </div>
          <p className="mt-1 text-2xl font-bold">{stops.length}</p>
        </div>
        <div className="rounded-lg border bg-card p-3">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Check className="h-3.5 w-3.5" /> Confirmed
          </div>
          <p className="mt-1 text-2xl font-bold">{confirmedCount}<span className="text-sm font-normal text-muted-foreground">/{stops.length}</span></p>
        </div>
        <div className="rounded-lg border bg-card p-3">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Route className="h-3.5 w-3.5" /> Distance
          </div>
          <p className="mt-1 text-2xl font-bold">{Math.round(totalDistance)} <span className="text-sm font-normal text-muted-foreground">mi</span></p>
        </div>
        <div className="rounded-lg border bg-card p-3">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5" /> Duration
          </div>
          <p className="mt-1 text-2xl font-bold">{dateRange ? dateRange.days : 0} <span className="text-sm font-normal text-muted-foreground">days</span></p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="route" className="flex min-h-0 flex-1 flex-col">
        <TabsList>
          <TabsTrigger value="route"><MapIcon className="mr-1.5 h-3.5 w-3.5" /> Route</TabsTrigger>
          <TabsTrigger value="discover"><Ticket className="mr-1.5 h-3.5 w-3.5" /> Discover</TabsTrigger>
          <TabsTrigger value="calendar"><CalendarDays className="mr-1.5 h-3.5 w-3.5" /> Calendar</TabsTrigger>
        </TabsList>

        {/* ── Route Tab ────────────────────────────────────────── */}
        <TabsContent value="route" className="min-h-0 flex-1">
          <div className="grid h-full gap-4 lg:grid-cols-[380px,1fr]">
            <div className="flex flex-col gap-3 overflow-y-auto pr-1">
              {/* Add stop form */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Add Stop</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <VenuePicker
                    value={formVenue}
                    onChange={(venue, text) => {
                      setFormVenue(text);
                      setFormVenueData(venue);
                    }}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      value={formCity}
                      onChange={(e) => setFormCity(e.target.value)}
                      placeholder="City"
                    />
                    <Input
                      type="date"
                      value={formDate}
                      onChange={(e) => setFormDate(e.target.value)}
                    />
                  </div>
                  {formError && <p className="text-xs text-destructive">{formError}</p>}
                  <Button className="w-full" size="sm" onClick={addStop}>
                    <Navigation className="mr-2 h-3.5 w-3.5" />
                    Add to Route
                  </Button>
                </CardContent>
              </Card>

              {/* Stop list — timeline style */}
              <div className="flex-1 space-y-0">
                {orderedStops.map((stop, index) => (
                  <div key={stop.id} className="relative flex gap-3">
                    {/* Timeline line + dot */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-[11px] font-bold transition-colors ${
                          activeStopId === stop.id
                            ? "border-primary bg-primary text-primary-foreground"
                            : stop.status === "confirmed"
                              ? "border-primary/40 bg-primary/10 text-primary"
                              : "border-muted-foreground/30 bg-muted text-muted-foreground"
                        }`}
                      >
                        {index + 1}
                      </div>
                      {index < orderedStops.length - 1 && (
                        <div className="w-px flex-1 bg-border" />
                      )}
                    </div>

                    {/* Stop card */}
                    <div
                      className={`mb-3 flex-1 rounded-lg border p-3 transition-colors cursor-pointer ${
                        activeStopId === stop.id ? "border-primary/40 bg-primary/5" : "hover:bg-muted/50"
                      }`}
                      onMouseEnter={() => setActiveStopId(stop.id)}
                      onMouseLeave={() => setActiveStopId(null)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-medium leading-tight">{stop.venue}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">{stop.city} · {formatDisplayDate(stop.date)}</p>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); cycleStatus(stop.id); }}
                        >
                          <Badge
                            variant={statusBadgeVariant(stop.status)}
                            className="cursor-pointer text-[10px]"
                          >
                            {stop.status === "confirmed" && <Check className="mr-0.5 h-2.5 w-2.5" />}
                            {stop.status === "hold" && <Pause className="mr-0.5 h-2.5 w-2.5" />}
                            {stop.status}
                          </Badge>
                        </button>
                      </div>
                      <div className="mt-2 flex items-center gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6"
                          disabled={index === 0}
                          onClick={(e) => { e.stopPropagation(); moveStop(stop.id, -1); }}
                        >
                          <ChevronUp className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6"
                          disabled={index === orderedStops.length - 1}
                          onClick={(e) => { e.stopPropagation(); moveStop(stop.id, 1); }}
                        >
                          <ChevronDown className="h-3.5 w-3.5" />
                        </Button>
                        <div className="flex-1" />
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 text-muted-foreground hover:text-destructive"
                          onClick={(e) => { e.stopPropagation(); removeStop(stop.id); }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                {orderedStops.length === 0 && (
                  <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                    No stops yet. Add a venue above or discover events.
                  </div>
                )}
              </div>
            </div>

            {/* Map */}
            <Card className="overflow-hidden">
              <CardContent className="h-full p-0">
                <TourMap stops={orderedStops} activeStopId={activeStopId} onMarkerClick={handleMarkerClick} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── Discover Tab ─────────────────────────────────────── */}
        <TabsContent value="discover" className="min-h-0 flex-1 overflow-y-auto">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  value={discoverSearch}
                  onChange={(e) => setDiscoverSearch(e.target.value)}
                  placeholder="Search events or venues…"
                  className="pl-8"
                />
              </div>
              <p className="text-xs text-muted-foreground">{filteredEvents.length} upcoming indie events in London</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filteredEvents.map((event) => {
                const onTour = isEventOnTour(event);
                const hasVenueData = knownVenues.some((v) => v.venue === event.venue);
                return (
                  <div
                    key={event.id}
                    className={`group rounded-lg border p-4 transition-colors ${onTour ? "border-primary/30 bg-primary/5" : "hover:bg-muted/50"}`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <Music className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        <p className="truncate font-medium text-sm">{event.name}</p>
                      </div>
                      <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span className="truncate">{event.venue}</span>
                      </div>
                      <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 shrink-0" />
                        <span>{formatDisplayDate(event.localDate)} · {event.localTime}</span>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      {onTour ? (
                        <Badge variant="default" className="text-[10px]">
                          <Check className="mr-0.5 h-2.5 w-2.5" /> On tour
                        </Badge>
                      ) : hasVenueData ? (
                        <Button size="xs" variant="outline" onClick={() => addEventAsStop(event)}>
                          <Plus className="mr-1 h-3 w-3" /> Add to tour
                        </Button>
                      ) : (
                        <span className="text-[10px] text-muted-foreground">Venue not mapped</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredEvents.length === 0 && (
              <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                No events match your search.
              </div>
            )}
          </div>
        </TabsContent>

        {/* ── Calendar Tab ─────────────────────────────────────── */}
        <TabsContent value="calendar" className="min-h-0 flex-1">
          <div className="grid gap-4 md:grid-cols-[auto,1fr] h-full">
            <Calendar
              mode="single"
              selected={selectedCalendarDate}
              onSelect={setSelectedCalendarDate}
              className="rounded-lg border p-3"
              modifiers={{
                hasStop: (date) => calendarDateSet.has(toDateInputValue(date)),
              }}
              modifiersClassNames={{
                hasStop: "font-semibold text-primary underline decoration-primary/60 underline-offset-4",
              }}
            />
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">
                  {selectedCalendarDate ? formatFullDate(toDateInputValue(selectedCalendarDate)) : "Select a date"}
                </CardTitle>
                <CardDescription>
                  {selectedDayStops.length > 0
                    ? `${selectedDayStops.length} stop${selectedDayStops.length === 1 ? "" : "s"} scheduled`
                    : "No stops scheduled"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {selectedDayStops.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Dates with stops are <span className="font-semibold underline underline-offset-4">underlined</span> in the calendar.
                  </p>
                ) : (
                  selectedDayStops.map((stop) => (
                    <div key={stop.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <p className="font-medium">{stop.venue}</p>
                        <p className="text-xs text-muted-foreground">{stop.city}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={statusBadgeVariant(stop.status)}>{stop.status}</Badge>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          onClick={() => removeStop(stop.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
