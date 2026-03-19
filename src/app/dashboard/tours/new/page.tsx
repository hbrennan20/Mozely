"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  MapPin,
  Navigation,
  Plus,
  Trash2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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

const steps = [
  { id: 1, label: "Tour Details" },
  { id: 2, label: "Add Stops" },
  { id: 3, label: "Review & Create" },
] as const;

function formatDisplayDate(rawDate: string) {
  if (!rawDate) return "";
  const parsed = new Date(`${rawDate}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return rawDate;
  return parsed.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function NewTourPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Tour details
  const [tourName, setTourName] = useState("");
  const [tourDescription, setTourDescription] = useState("");
  const [tourStartDate, setTourStartDate] = useState("");
  const [tourEndDate, setTourEndDate] = useState("");

  // Step 2: Stops
  const [stops, setStops] = useState<TourStop[]>([]);
  const [city, setCity] = useState("");
  const [venue, setVenue] = useState("");
  const [date, setDate] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  const [error, setError] = useState<string | null>(null);

  const orderedStops = useMemo(
    () =>
      [...stops].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      ),
    [stops]
  );

  const uniqueCities = useMemo(
    () => new Set(stops.map((s) => s.city)).size,
    [stops]
  );

  // --- Step validation ---

  const isStep1Valid =
    tourName.trim().length > 0 && tourStartDate.length > 0;

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

  // --- Actions ---

  const goNext = () => {
    setError(null);
    if (currentStep === 1 && !isStep1Valid) {
      setError("Tour name and start date are required.");
      return;
    }
    if (currentStep === 2 && stops.length === 0) {
      setError("Add at least one stop to the tour.");
      return;
    }
    setCurrentStep((s) => Math.min(s + 1, 3));
  };

  const goBack = () => {
    setError(null);
    setCurrentStep((s) => Math.max(s - 1, 1));
  };

  const addStop = () => {
    if (!isStopFormValid) {
      setError(
        "Fill in city, venue, date, and valid coordinates (lat -90..90, lng -180..180)."
      );
      return;
    }
    setError(null);
    setStops((prev) => [
      ...prev,
      {
        id: Date.now(),
        city: city.trim(),
        venue: venue.trim(),
        date,
        status: "draft",
        lat: parsedLat,
        lng: parsedLng,
      },
    ]);
    setCity("");
    setVenue("");
    setDate("");
    setLat("");
    setLng("");
  };

  const removeStop = (id: number) => {
    setStops((prev) => prev.filter((s) => s.id !== id));
  };

  const handleCreate = () => {
    // For now, just navigate back to the tours list.
    // In the future this would persist to a backend / store.
    router.push("/dashboard/tours");
  };

  // --- Render helpers ---

  const stepIndicator = (
    <nav className="flex items-center gap-2">
      {steps.map((step, i) => {
        const isActive = step.id === currentStep;
        const isCompleted = step.id < currentStep;
        return (
          <div key={step.id} className="flex items-center gap-2">
            {i > 0 && (
              <div
                className={`h-px w-8 ${
                  isCompleted ? "bg-primary" : "bg-border"
                }`}
              />
            )}
            <button
              type="button"
              onClick={() => {
                if (step.id < currentStep) {
                  setError(null);
                  setCurrentStep(step.id);
                }
              }}
              className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : isCompleted
                    ? "bg-primary/10 text-primary cursor-pointer"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {isCompleted ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <span className="text-xs">{step.id}</span>
              )}
              {step.label}
            </button>
          </div>
        );
      })}
    </nav>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">New Tour</h1>
          <p className="text-muted-foreground">
            Set up your tour details, add stops, then review and create.
          </p>
        </div>
        <Button variant="outline" render={<Link href="/dashboard/tours" />}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Tours
        </Button>
      </div>

      {/* Step indicator */}
      {stepIndicator}

      {/* Error */}
      {error && <p className="text-sm text-destructive">{error}</p>}

      {/* Step 1: Tour Details */}
      {currentStep === 1 && (
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Tour Details</CardTitle>
            <CardDescription>
              Give your tour a name and set the date range.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Tour name *</label>
              <Input
                placeholder="e.g. UK Spring 2026"
                value={tourName}
                onChange={(e) => setTourName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder="Optional notes about this tour..."
                value={tourDescription}
                onChange={(e) => setTourDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Start date *</label>
                <Input
                  type="date"
                  value={tourStartDate}
                  onChange={(e) => setTourStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">End date</label>
                <Input
                  type="date"
                  value={tourEndDate}
                  onChange={(e) => setTourEndDate(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Add Stops */}
      {currentStep === 2 && (
        <div className="grid gap-6 lg:grid-cols-[400px,1fr] max-w-5xl">
          <Card>
            <CardHeader>
              <CardTitle>Add a Stop</CardTitle>
              <CardDescription>
                Enter city, venue, date, and coordinates for each stop.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input
                placeholder="City, Region"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <Input
                placeholder="Venue"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
              />
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Latitude"
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                />
                <Input
                  placeholder="Longitude"
                  value={lng}
                  onChange={(e) => setLng(e.target.value)}
                />
              </div>
              <Button className="w-full" onClick={addStop}>
                <Navigation className="mr-2 h-4 w-4" />
                Add Stop
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                Stops ({stops.length})
              </CardTitle>
              <CardDescription>
                {stops.length === 0
                  ? "No stops added yet."
                  : `${uniqueCities} ${uniqueCities === 1 ? "city" : "cities"} across ${stops.length} ${stops.length === 1 ? "stop" : "stops"}`}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 max-h-[420px] overflow-y-auto">
              {orderedStops.map((stop, index) => (
                <div key={stop.id}>
                  {index > 0 && <Separator className="mb-3" />}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        {index + 1}. {stop.venue}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {stop.city} &middot; {formatDisplayDate(stop.date)}
                      </p>
                    </div>
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
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 3: Review & Create */}
      {currentStep === 3 && (
        <Card className="max-w-3xl">
          <CardHeader>
            <CardTitle>Review Your Tour</CardTitle>
            <CardDescription>
              Check everything looks right before creating.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Tour summary */}
            <div className="rounded-md border p-4 space-y-2">
              <h3 className="font-semibold text-lg">{tourName}</h3>
              {tourDescription && (
                <p className="text-sm text-muted-foreground">
                  {tourDescription}
                </p>
              )}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span>
                  Starts: {formatDisplayDate(tourStartDate)}
                </span>
                {tourEndDate && (
                  <span>
                    Ends: {formatDisplayDate(tourEndDate)}
                  </span>
                )}
                <span>
                  {stops.length} {stops.length === 1 ? "stop" : "stops"}
                </span>
                <span>
                  {uniqueCities} {uniqueCities === 1 ? "city" : "cities"}
                </span>
              </div>
            </div>

            {/* Stops list */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Route ({orderedStops.length} stops)
              </h4>
              {orderedStops.map((stop, index) => (
                <div key={stop.id}>
                  {index > 0 && <Separator className="mb-3" />}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        {index + 1}. {stop.venue}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {stop.city}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">
                        {formatDisplayDate(stop.date)}
                      </p>
                      <Badge variant="outline">{stop.status}</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation buttons */}
      <div className="flex gap-3">
        {currentStep > 1 && (
          <Button variant="outline" onClick={goBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        )}
        {currentStep < 3 ? (
          <Button onClick={goNext}>
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Create Tour
          </Button>
        )}
      </div>
    </div>
  );
}
