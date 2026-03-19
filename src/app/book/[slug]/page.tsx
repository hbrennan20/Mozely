"use client";

import { useState } from "react";
import { format, addDays, isBefore, startOfDay } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Music,
  Clock,
  CalendarDays,
  MapPin,
  ArrowLeft,
  Check,
  ChevronRight,
} from "lucide-react";
import { useParams } from "next/navigation";

const ARTIST_PROFILES: Record<
  string,
  {
    name: string;
    genre: string;
    location: string;
    bio: string;
    performanceTypes: string[];
    minFee: string;
  }
> = {
  "alex-rivera": {
    name: "Alex Rivera",
    genre: "Jazz, Blues",
    location: "London, UK",
    bio: "London-based jazz and blues artist available for live bookings. Solo, trio, or full band configurations.",
    performanceTypes: ["Solo", "Trio", "Full Band"],
    minFee: "£800",
  },
};

const TIME_SLOTS = [
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
  "8:00 PM",
  "9:00 PM",
  "10:00 PM",
];

type Step = "date" | "time" | "details" | "confirmed";

export default function BookingPage() {
  const params = useParams();
  const slug = params.slug as string;
  const artist = ARTIST_PROFILES[slug] ?? {
    name: slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" "),
    genre: "Music",
    location: "",
    bio: "Available for live bookings.",
    performanceTypes: ["Live Performance"],
    minFee: "",
  };

  const [step, setStep] = useState<Step>("date");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    contactName: "",
    contactEmail: "",
    venueName: "",
    venueCapacity: "",
    eventType: "",
    message: "",
  });

  const today = startOfDay(new Date());

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setStep("time");
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep("details");
  };

  const handleBack = () => {
    if (step === "time") setStep("date");
    if (step === "details") setStep("time");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          artistSlug: slug,
          date: selectedDate ? format(selectedDate, "MMM d, yyyy") : "",
          time: selectedTime,
          ...form,
        }),
      });
      setStep("confirmed");
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[oklch(0.985_0_0)] flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-foreground text-background mb-4">
            <Music className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">{artist.name}</h1>
          <p className="text-muted-foreground mt-1">{artist.bio}</p>
          <div className="flex items-center justify-center gap-4 mt-3 text-sm text-muted-foreground">
            {artist.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {artist.location}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Music className="w-3.5 h-3.5" />
              {artist.genre}
            </span>
          </div>
        </div>

        {/* Progress */}
        {step !== "confirmed" && (
          <div className="flex items-center justify-center gap-2 mb-8">
            {(["date", "time", "details"] as const).map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    step === s
                      ? "bg-foreground text-background"
                      : (["date", "time", "details"] as const).indexOf(step) > i
                        ? "bg-foreground/10 text-foreground"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {(["date", "time", "details"] as const).indexOf(step) > i ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    i + 1
                  )}
                </div>
                {i < 2 && (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Main Card */}
        <div className="bg-card rounded-2xl ring-1 ring-foreground/10 overflow-hidden">
          {/* Date Step */}
          {step === "date" && (
            <div className="p-6 sm:p-8">
              <div className="text-center mb-6">
                <h2 className="text-lg font-semibold flex items-center justify-center gap-2">
                  <CalendarDays className="w-5 h-5" />
                  Select a Date
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Choose when you&apos;d like to book {artist.name}
                </p>
              </div>
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  disabled={(date) => isBefore(date, today)}
                  fromDate={today}
                  toDate={addDays(today, 180)}
                  className="rounded-xl"
                />
              </div>
            </div>
          )}

          {/* Time Step */}
          {step === "time" && (
            <div className="p-6 sm:p-8">
              <button
                onClick={handleBack}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <div className="text-center mb-6">
                <h2 className="text-lg font-semibold flex items-center justify-center gap-2">
                  <Clock className="w-5 h-5" />
                  Select a Time
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedDate && format(selectedDate, "EEEE, MMMM d, yyyy")}
                </p>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-w-md mx-auto">
                {TIME_SLOTS.map((time) => (
                  <button
                    key={time}
                    onClick={() => handleTimeSelect(time)}
                    className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ring-1 ring-foreground/10 hover:bg-foreground hover:text-background ${
                      selectedTime === time
                        ? "bg-foreground text-background"
                        : "bg-card"
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Details Step */}
          {step === "details" && (
            <div className="p-6 sm:p-8">
              <button
                onClick={handleBack}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>

              {/* Summary bar */}
              <div className="flex items-center gap-3 mb-6 p-3 rounded-lg bg-muted text-sm">
                <CalendarDays className="w-4 h-4 text-muted-foreground shrink-0" />
                <span>
                  {selectedDate && format(selectedDate, "EEE, MMM d, yyyy")}
                </span>
                <span className="text-muted-foreground">at</span>
                <span>{selectedTime}</span>
              </div>

              <h2 className="text-lg font-semibold mb-4">Your Details</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Your Name *</label>
                    <Input
                      required
                      placeholder="Jane Smith"
                      value={form.contactName}
                      onChange={(e) =>
                        setForm({ ...form, contactName: e.target.value })
                      }
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Email *</label>
                    <Input
                      required
                      type="email"
                      placeholder="jane@venue.com"
                      value={form.contactEmail}
                      onChange={(e) =>
                        setForm({ ...form, contactEmail: e.target.value })
                      }
                      className="h-10"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Venue Name *</label>
                    <Input
                      required
                      placeholder="The Blue Note"
                      value={form.venueName}
                      onChange={(e) =>
                        setForm({ ...form, venueName: e.target.value })
                      }
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">
                      Venue Capacity
                    </label>
                    <Input
                      placeholder="e.g. 200"
                      value={form.venueCapacity}
                      onChange={(e) =>
                        setForm({ ...form, venueCapacity: e.target.value })
                      }
                      className="h-10"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Event Type</label>
                  <Input
                    placeholder="e.g. Album launch, Festival set, Private event"
                    value={form.eventType}
                    onChange={(e) =>
                      setForm({ ...form, eventType: e.target.value })
                    }
                    className="h-10"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">
                    Message (optional)
                  </label>
                  <Textarea
                    placeholder="Tell us about your event, technical requirements, or any other details..."
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    rows={3}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-11 text-base font-medium mt-2"
                >
                  {submitting ? "Submitting..." : "Request Booking"}
                </Button>
              </form>
            </div>
          )}

          {/* Confirmed Step */}
          {step === "confirmed" && (
            <div className="p-6 sm:p-10 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mb-6">
                <Check className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-semibold mb-2">
                Booking Request Sent!
              </h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Your request to book {artist.name} on{" "}
                <span className="font-medium text-foreground">
                  {selectedDate && format(selectedDate, "EEEE, MMMM d, yyyy")}
                </span>{" "}
                at{" "}
                <span className="font-medium text-foreground">
                  {selectedTime}
                </span>{" "}
                has been sent. You&apos;ll hear back soon.
              </p>
              <div className="inline-flex items-center gap-2 rounded-lg bg-muted px-4 py-2.5 text-sm">
                <CalendarDays className="w-4 h-4 text-muted-foreground" />
                {selectedDate && format(selectedDate, "EEE, MMM d")} at{" "}
                {selectedTime} &middot; {form.venueName}
              </div>
              <div className="mt-8">
                <button
                  onClick={() => {
                    setStep("date");
                    setSelectedDate(undefined);
                    setSelectedTime("");
                    setForm({
                      contactName: "",
                      contactEmail: "",
                      venueName: "",
                      venueCapacity: "",
                      eventType: "",
                      message: "",
                    });
                  }}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
                >
                  Book another date
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          Powered by Mozely
        </p>
      </div>
    </div>
  );
}
