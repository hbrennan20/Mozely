"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { ArrowLeft, CalendarDays, Clock3 } from "lucide-react";

const radioCalendarEvents = [
  {
    id: 1,
    date: "2026-03-16",
    station: "BBC Radio 1",
    item: "New Music Fix",
    time: "7:15 PM",
    status: "recent spin",
  },
  {
    id: 2,
    date: "2026-03-18",
    station: "BBC Radio 6 Music",
    item: "Evening Mix",
    time: "9:00 PM",
    status: "recent spin",
  },
  {
    id: 3,
    date: "2026-03-21",
    station: "BBC Introducing",
    item: "Featured Playlist",
    time: "Pending slot",
    status: "submitted",
  },
  {
    id: 4,
    date: "2026-03-27",
    station: "Amazing Radio",
    item: "Artist Spotlight",
    time: "8:30 PM",
    status: "confirmed",
  },
];

function dateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDateKey(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function getWeekRange(date: Date) {
  const weekStart = new Date(date);
  weekStart.setHours(0, 0, 0, 0);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);
  return { weekStart, weekEnd };
}

export default function RadioSchedulePage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date("2026-03-18")
  );
  const [scheduleView, setScheduleView] = useState<"day" | "week">("day");

  const eventDateSet = useMemo(() => {
    return new Set(radioCalendarEvents.map((event) => event.date));
  }, []);

  const selectedDayEvents = useMemo(() => {
    if (!selectedDate) return [];
    return radioCalendarEvents.filter(
      (event) => event.date === dateKey(selectedDate)
    );
  }, [selectedDate]);

  const selectedWeekEvents = useMemo(() => {
    if (!selectedDate) return [];
    const { weekStart, weekEnd } = getWeekRange(selectedDate);
    return radioCalendarEvents.filter((event) => {
      const eventDate = parseDateKey(event.date);
      return eventDate >= weekStart && eventDate <= weekEnd;
    });
  }, [selectedDate]);

  const selectedWeek = useMemo(() => {
    if (!selectedDate) return null;
    return getWeekRange(selectedDate);
  }, [selectedDate]);

  const visibleEvents = scheduleView === "week" ? selectedWeekEvents : selectedDayEvents;

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Radio Schedule</h1>
          <p className="text-muted-foreground">
            View spin dates, submissions, and promo opportunities.
          </p>
        </div>
        <Button variant="outline" render={<Link href="/dashboard/radio" />}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Radio
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              Radio Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border p-2"
              modifiers={{
                hasEvent: (date) => eventDateSet.has(dateKey(date)),
                inSelectedWeek: (date) => {
                  if (!selectedWeek) return false;
                  return date >= selectedWeek.weekStart && date <= selectedWeek.weekEnd;
                },
              }}
              modifiersClassNames={{
                hasEvent:
                  "font-semibold text-primary underline decoration-primary/60 underline-offset-4",
                inSelectedWeek: "bg-muted/60",
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="flex items-center gap-2">
                <Clock3 className="h-4 w-4" />
                {scheduleView === "week" ? "Week Schedule" : "Day Schedule"}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant={scheduleView === "day" ? "default" : "outline"}
                  onClick={() => setScheduleView("day")}
                >
                  Day
                </Button>
                <Button
                  size="sm"
                  variant={scheduleView === "week" ? "default" : "outline"}
                  onClick={() => setScheduleView("week")}
                >
                  Week
                </Button>
              </div>
            </div>
            <CardDescription>
              {scheduleView === "week"
                ? selectedWeek
                  ? `${selectedWeek.weekStart.toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })} - ${selectedWeek.weekEnd.toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}`
                  : "Select a date to view activity"
                : selectedDate
                  ? selectedDate.toLocaleDateString(undefined, {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })
                  : "Select a date to view activity"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {visibleEvents.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No radio activity scheduled for this {scheduleView}.
              </p>
            ) : (
              visibleEvents.map((event) => (
                <div
                  key={event.id}
                  className="rounded-lg border p-3 flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">{event.station}</p>
                    <p className="text-sm text-muted-foreground">{event.item}</p>
                    {scheduleView === "week" && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {parseDateKey(event.date).toLocaleDateString(undefined, {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    )}
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-sm">{event.time}</p>
                    <Badge
                      variant={
                        event.status === "recent spin" ? "default" : "secondary"
                      }
                    >
                      {event.status}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
