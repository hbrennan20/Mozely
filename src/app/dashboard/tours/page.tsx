"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";
import {
  CalendarDays,
  Map as MapIcon,
  MapPin,
  Navigation,
  Plus,
  Route,
  Trash2,
} from "lucide-react";

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

type LondonVenueSeed = {
  venue: string;
  lat: number;
  lng: number;
};

const initialStops: TourStop[] = [
  {
    id: 1,
    city: "London, UK",
    venue: "Scala",
    date: "2026-04-12",
    status: "confirmed",
    lat: 51.5303,
    lng: -0.1203,
  },
  {
    id: 2,
    city: "London, UK",
    venue: "Roundhouse",
    date: "2026-04-15",
    status: "hold",
    lat: 51.5433,
    lng: -0.1511,
  },
  {
    id: 3,
    city: "London, UK",
    venue: "Eventim Apollo",
    date: "2026-04-18",
    status: "confirmed",
    lat: 51.4901,
    lng: -0.2239,
  },
];

const londonVenueSeeds: LondonVenueSeed[] = [
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
  { venue: "Pryzm Kingston", lat: 51.4106, lng: -0.3056 },
  { venue: "Alexandra Palace", lat: 51.5942, lng: -0.1296 },
  { venue: "Troxy", lat: 51.5162, lng: -0.0382 },
  { venue: "The Dome", lat: 51.5714, lng: -0.0977 },
  { venue: "MOTH Club", lat: 51.5459, lng: -0.0553 },
  { venue: "EartH", lat: 51.5472, lng: -0.0544 },
  { venue: "Oslo Hackney", lat: 51.5464, lng: -0.0554 },
  { venue: "Sebright Arms", lat: 51.5297, lng: -0.0557 },
  { venue: "The Shacklewell Arms", lat: 51.5538, lng: -0.0754 },
  { venue: "The George Tavern", lat: 51.5116, lng: -0.0584 },
  { venue: "The Pickle Factory", lat: 51.5293, lng: -0.0737 },
  { venue: "The Social", lat: 51.516, lng: -0.1368 },
  { venue: "The 100 Club", lat: 51.5168, lng: -0.1307 },
  { venue: "Ronnie Scott's", lat: 51.5136, lng: -0.1317 },
  { venue: "Jazz Cafe POSK", lat: 51.5192, lng: -0.2011 },
  { venue: "Piano Smithfield", lat: 51.5188, lng: -0.1004 },
  { venue: "Royal Albert Hall", lat: 51.5009, lng: -0.1774 },
  { venue: "Southbank Centre", lat: 51.5069, lng: -0.1167 },
  { venue: "Union Chapel", lat: 51.5465, lng: -0.1033 },
  { venue: "Brixton Jamm", lat: 51.4602, lng: -0.1157 },
  { venue: "Phonox", lat: 51.465, lng: -0.1142 },
  { venue: "The Blues Kitchen Brixton", lat: 51.4654, lng: -0.1137 },
  { venue: "Paper Dress Vintage", lat: 51.5521, lng: -0.0758 },
  { venue: "Peckham Audio", lat: 51.4727, lng: -0.0694 },
  { venue: "The Prince of Peckham", lat: 51.4711, lng: -0.0702 },
];

function formatDisplayDate(rawDate: string) {
  if (!rawDate) return "";
  const parsed = new Date(`${rawDate}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return rawDate;
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function haversineMiles(start: TourStop, end: TourStop) {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const earthRadiusMiles = 3958.8;
  const dLat = toRad(end.lat - start.lat);
  const dLng = toRad(end.lng - start.lng);
  const lat1 = toRad(start.lat);
  const lat2 = toRad(end.lat);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusMiles * c;
}

function toDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

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
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-0.1276, 51.5074],
      zoom: 11,
      minZoom: 2,
    });
    map.addControl(new mapboxgl.NavigationControl(), "top-right");
    mapRef.current = map;

    return () => {
      markers.forEach((marker) => marker.remove());
      markers.clear();
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [token]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current.clear();

    stops.forEach((stop, index) => {
      const markerEl = document.createElement("button");
      markerEl.type = "button";
      markerEl.className =
        "h-7 w-7 rounded-full border-2 border-white bg-primary text-[11px] font-semibold text-primary-foreground shadow-md transition-transform";
      markerEl.textContent = String(index + 1);
      markerEl.addEventListener("click", () => onMarkerClick(stop.id));

      const marker = new mapboxgl.Marker(markerEl)
        .setLngLat([stop.lng, stop.lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 12 }).setHTML(
            `<div style="font-family: Inter, sans-serif">
              <div style="font-weight:600">${stop.city}</div>
              <div style="font-size:12px;color:#71717a">${stop.venue}</div>
              <div style="font-size:12px;color:#71717a">${formatDisplayDate(stop.date)}</div>
            </div>`
          )
        )
        .addTo(map);

      markersRef.current.set(stop.id, marker);
    });
  }, [onMarkerClick, stops]);

  useEffect(() => {
    const map = mapRef.current;
    const sourceId = "tour-route-source";
    const layerId = "tour-route-line";
    if (!map) return;

    if (stops.length < 2) {
      if (map.getLayer(layerId)) {
        map.removeLayer(layerId);
      }
      if (map.getSource(sourceId)) {
        map.removeSource(sourceId);
      }
      return;
    }

    const updateRoute = () => {
      const routeData: GeoJSON.Feature<GeoJSON.LineString> = {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: stops.map((stop) => [stop.lng, stop.lat]),
        },
      };

      if (!map.getSource(sourceId)) {
        map.addSource(sourceId, {
          type: "geojson",
          data: routeData,
        });
      } else {
        (map.getSource(sourceId) as mapboxgl.GeoJSONSource).setData(routeData);
      }

      if (!map.getLayer(layerId)) {
        map.addLayer({
          id: layerId,
          type: "line",
          source: sourceId,
          paint: {
            "line-color": "#18181b",
            "line-width": 3,
            "line-opacity": 0.8,
          },
        });
      }
    };

    if (map.isStyleLoaded()) {
      updateRoute();
    } else {
      map.once("load", updateRoute);
    }

    if (!centeredRef.current) {
      const bounds = new mapboxgl.LngLatBounds(
        [stops[0].lng, stops[0].lat],
        [stops[0].lng, stops[0].lat]
      );
      stops.forEach((stop) => bounds.extend([stop.lng, stop.lat]));
      map.fitBounds(bounds, { padding: 60, maxZoom: 8 });
      centeredRef.current = true;
    }
  }, [stops]);

  useEffect(() => {
    markersRef.current.forEach((marker, id) => {
      const markerElement = marker.getElement();
      const isActive = id === activeStopId;
      markerElement.style.transform = isActive ? "scale(1.2)" : "scale(1)";
      markerElement.style.backgroundColor = isActive ? "#0f172a" : "#18181b";
      if (isActive) {
        marker.togglePopup();
      } else if (marker.getPopup()?.isOpen()) {
        marker.togglePopup();
      }
    });
  }, [activeStopId]);

  if (!token) {
    return (
      <div className="h-full flex items-center justify-center p-6 text-center text-sm text-muted-foreground">
        Add `NEXT_PUBLIC_MAPBOX_TOKEN` to `.env.local` to enable tour maps.
      </div>
    );
  }

  return <div ref={mapContainerRef} className="h-full w-full" />;
}

export default function ToursPage() {
  const [stops, setStops] = useState<TourStop[]>(initialStops);
  const [activeStopId, setActiveStopId] = useState<number | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<Date | undefined>(
    new Date(initialStops[0].date)
  );
  const [city, setCity] = useState("");
  const [venue, setVenue] = useState("");
  const [date, setDate] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [seedNotice, setSeedNotice] = useState<string | null>(null);

  const orderedStops = useMemo(
    () =>
      [...stops].sort((a, b) => {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }),
    [stops]
  );

  const totalDistance = useMemo(() => {
    if (orderedStops.length < 2) return 0;
    return orderedStops
      .slice(1)
      .reduce(
        (miles, stop, index) => miles + haversineMiles(orderedStops[index], stop),
        0
      );
  }, [orderedStops]);

  const calendarDateSet = useMemo(() => {
    return new Set(stops.map((stop) => stop.date));
  }, [stops]);

  const selectedDayStops = useMemo(() => {
    if (!selectedCalendarDate) return [];
    const year = selectedCalendarDate.getFullYear();
    const month = String(selectedCalendarDate.getMonth() + 1).padStart(2, "0");
    const day = String(selectedCalendarDate.getDate()).padStart(2, "0");
    const dateKey = `${year}-${month}-${day}`;
    return orderedStops.filter((stop) => stop.date === dateKey);
  }, [orderedStops, selectedCalendarDate]);

  const parsedLat = Number(lat);
  const parsedLng = Number(lng);
  const isStopFormValid =
    city.trim().length > 0 &&
    venue.trim().length > 0 &&
    date.trim().length > 0 &&
    lat.trim().length > 0 &&
    lng.trim().length > 0 &&
    Number.isFinite(parsedLat) &&
    Number.isFinite(parsedLng) &&
    parsedLat >= -90 &&
    parsedLat <= 90 &&
    parsedLng >= -180 &&
    parsedLng <= 180;

  const addStop = () => {
    if (!isStopFormValid) {
      setFormError(
        "Add city, venue, date, and valid coordinates (lat -90..90, lng -180..180)."
      );
      return;
    }
    setFormError(null);

    const nextStop: TourStop = {
      id: Date.now(),
      city: city.trim(),
      venue: venue.trim(),
      date,
      status: "draft",
      lat: parsedLat,
      lng: parsedLng,
    };

    setStops((previous) => [...previous, nextStop]);
    setCity("");
    setVenue("");
    setDate("");
    setLat("");
    setLng("");
    setSeedNotice(null);
  };

  const removeStop = (id: number) => {
    setStops((previous) => previous.filter((stop) => stop.id !== id));
    if (activeStopId === id) {
      setActiveStopId(null);
    }
  };

  const seedLondonVenues = () => {
    const seedStartDate = new Date("2026-06-01T00:00:00");
    const existingVenueNames = new Set(
      stops.map((stop) => stop.venue.trim().toLowerCase())
    );

    const additions = londonVenueSeeds
      .filter((seed) => !existingVenueNames.has(seed.venue.trim().toLowerCase()))
      .map((seed, index) => {
        const seedDate = new Date(seedStartDate);
        seedDate.setDate(seedDate.getDate() + index);
        return {
          id: Date.now() + index,
          city: "London, UK",
          venue: seed.venue,
          date: toDateInputValue(seedDate),
          status: "draft" as const,
          lat: seed.lat,
          lng: seed.lng,
        };
      });

    if (additions.length === 0) {
      setSeedNotice("London venue seed list already added.");
      return;
    }

    setStops((previous) => [...previous, ...additions]);
    setFormError(null);
    setSeedNotice(`Added ${additions.length} London venues.`);
  };

  return (
    <div className="p-4 h-[calc(100vh-2rem)] space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tours</h1>
          <p className="text-muted-foreground">
            Plan route order, map your stops, and estimate travel distance.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={seedLondonVenues}>
            Seed London Venues
          </Button>
          <Button onClick={addStop}>
            <Plus className="mr-2 h-4 w-4" />
            Add Stop
          </Button>
          <Button render={<Link href="/dashboard/tours/new" />}>
            <Plus className="mr-2 h-4 w-4" />
            New Tour
          </Button>
        </div>
      </div>
      {(formError || seedNotice) && (
        <p className="text-sm text-muted-foreground">
          {formError ?? seedNotice}
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Stops Planned</CardTitle>
            <MapIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stops.length}</div>
            <p className="text-xs text-muted-foreground">Current itinerary</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Route Distance</CardTitle>
            <Route className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(totalDistance)} mi</div>
            <p className="text-xs text-muted-foreground">Great-circle estimate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Cities Covered</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(stops.map((stop) => stop.city)).size}
            </div>
            <p className="text-xs text-muted-foreground">Across all stops</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-[420px,1fr] h-[calc(100%-11.5rem)]">
        <div className="space-y-4 overflow-y-auto pr-1">
          <Card>
            <CardHeader>
              <CardTitle>Plan Tour Stops</CardTitle>
              <CardDescription>
                Add city, venue, date, and valid coordinates to place each stop.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input
                value={city}
                onChange={(event) => setCity(event.target.value)}
                placeholder="City, Region"
              />
              <Input
                value={venue}
                onChange={(event) => setVenue(event.target.value)}
                placeholder="Venue"
              />
              <Input
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
              />
              <div className="grid grid-cols-2 gap-2">
                <Input
                  value={lat}
                  onChange={(event) => setLat(event.target.value)}
                  placeholder="Latitude"
                />
                <Input
                  value={lng}
                  onChange={(event) => setLng(event.target.value)}
                  placeholder="Longitude"
                />
              </div>
              <Button className="w-full" onClick={addStop}>
                <Navigation className="mr-2 h-4 w-4" />
                Add To Route
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Route Order</CardTitle>
              <CardDescription>
                Hover a stop to highlight it on the map.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {orderedStops.map((stop, index) => (
                <div key={stop.id}>
                  {index > 0 && <Separator className="mb-4" />}
                  <div
                    className={`flex items-center justify-between rounded-md p-2 transition-colors ${
                      activeStopId === stop.id ? "bg-muted" : ""
                    }`}
                    onMouseEnter={() => setActiveStopId(stop.id)}
                    onMouseLeave={() => setActiveStopId(null)}
                  >
                    <div>
                      <p className="font-medium">
                        {index + 1}. {stop.city}
                      </p>
                      <p className="text-sm text-muted-foreground">{stop.venue}</p>
                    </div>
                    <div className="text-right space-y-2">
                      <p className="text-sm">{formatDisplayDate(stop.date)}</p>
                      <div className="flex items-center gap-2 justify-end">
                        <Badge
                          variant={
                            stop.status === "confirmed"
                              ? "default"
                              : stop.status === "hold"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {stop.status}
                        </Badge>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7"
                          onClick={() => removeStop(stop.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <Button
                variant="outline"
                className="w-full"
                onClick={() => setIsCalendarOpen(true)}
              >
                <CalendarDays className="mr-2 h-4 w-4" />
                Open Tour Calendar
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="overflow-hidden">
          <CardContent className="h-full p-0">
            <TourMap
              stops={orderedStops}
              activeStopId={activeStopId}
              onMarkerClick={setActiveStopId}
            />
          </CardContent>
        </Card>
      </div>

      <Dialog open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              Tour Calendar
            </DialogTitle>
            <DialogDescription>
              Review scheduled stops by day and spot open dates.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2 md:grid-cols-[320px,1fr]">
            <Calendar
              mode="single"
              selected={selectedCalendarDate}
              onSelect={setSelectedCalendarDate}
              className="rounded-md border p-2"
              modifiers={{
                hasStop: (date) => {
                  const year = date.getFullYear();
                  const month = String(date.getMonth() + 1).padStart(2, "0");
                  const day = String(date.getDate()).padStart(2, "0");
                  return calendarDateSet.has(`${year}-${month}-${day}`);
                },
              }}
              modifiersClassNames={{
                hasStop:
                  "font-semibold text-primary underline decoration-primary/60 underline-offset-4",
              }}
            />
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">
                  {selectedCalendarDate
                    ? selectedCalendarDate.toLocaleDateString(undefined, {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "Select a date"}
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
                    Add stops with matching dates to build your itinerary.
                  </p>
                ) : (
                  selectedDayStops.map((stop) => (
                    <div
                      key={stop.id}
                      className="rounded-md border p-3 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium">{stop.city}</p>
                        <p className="text-sm text-muted-foreground">{stop.venue}</p>
                      </div>
                      <Badge
                        variant={
                          stop.status === "confirmed"
                            ? "default"
                            : stop.status === "hold"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {stop.status}
                      </Badge>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
