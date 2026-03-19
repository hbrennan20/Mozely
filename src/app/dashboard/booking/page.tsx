"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ExternalLink,
  Copy,
  Check,
  Clock,
  CalendarDays,
  Mail,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";

interface Booking {
  id: number;
  date: string;
  time: string;
  venueName: string;
  contactName: string;
  contactEmail: string;
  venueCapacity: string;
  eventType: string;
  message: string;
  status: "pending" | "confirmed" | "declined";
  createdAt: string;
}

export default function BookingPortalPage() {
  const [copied, setCopied] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const bookingUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/book/alex-rivera`
      : "/book/alex-rivera";

  useEffect(() => {
    fetch("/api/bookings?slug=alex-rivera")
      .then((r) => r.json())
      .then(setBookings)
      .catch(() => {});
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(bookingUrl);
    setCopied(true);
    toast.success("Booking link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Booking Portal</h1>
        <p className="text-muted-foreground">
          Share your booking link with venues to let them request dates.
        </p>
      </div>

      {/* Share Link Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4" />
            Your Booking Link
          </CardTitle>
          <CardDescription>
            Send this to venues so they can book you directly — like Calendly,
            but for gigs.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              readOnly
              value={bookingUrl}
              className="h-10 font-mono text-sm bg-muted"
            />
            <Button onClick={handleCopy} variant="outline" className="h-10 shrink-0 gap-2">
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="gap-2"
              render={(props) => (
                <a
                  {...props}
                  href={bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              )}
            >
              <ExternalLink className="h-4 w-4" />
              Preview
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Incoming Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            Incoming Requests
          </CardTitle>
          <CardDescription>
            Booking requests from venues will appear here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-8 w-8 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No booking requests yet.</p>
              <p className="text-xs mt-1">
                Share your link to start receiving requests.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-start justify-between gap-4 p-4 rounded-lg ring-1 ring-foreground/10"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm truncate">
                        {booking.venueName}
                      </p>
                      <Badge
                        variant={
                          booking.status === "confirmed"
                            ? "default"
                            : booking.status === "declined"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {booking.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="h-3 w-3" />
                        {booking.date} at {booking.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {booking.contactName}
                      </span>
                      {booking.venueCapacity && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          Cap. {booking.venueCapacity}
                        </span>
                      )}
                    </div>
                    {booking.message && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {booking.message}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <Button
                      size="sm"
                      onClick={() =>
                        toast.success(`Booking at ${booking.venueName} confirmed`)
                      }
                    >
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        toast("Declined", {
                          description: `Booking at ${booking.venueName} declined`,
                        })
                      }
                    >
                      Decline
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
