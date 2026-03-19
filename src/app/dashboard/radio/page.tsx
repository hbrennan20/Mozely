"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  RadioTower,
  Plus,
  Signal,
  Headphones,
  CalendarDays,
  Clock3,
  FileAudio,
  FileText,
  FolderOpen,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import {
  Campaign,
  initialCampaigns,
  readStoredCampaigns,
} from "@/app/dashboard/radio/campaigns";

const stations = [
  {
    name: "BBC Radio 6 Music",
    program: "Evening Mix",
    spinDate: "Mar 18, 2026",
    status: "recent spin",
  },
  {
    name: "BBC Radio 1",
    program: "New Music Fix",
    spinDate: "Mar 16, 2026",
    status: "recent spin",
  },
  {
    name: "BBC Introducing",
    program: "Featured Playlist",
    spinDate: "Pending",
    status: "submitted",
  },
];

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

type PromoAssetStatus = "ready" | "needs update" | "draft";

type PromoAsset = {
  id: number;
  title: string;
  type: string;
  updatedAt: string;
  status: PromoAssetStatus;
  notes?: string;
};

const initialPromoAssets: PromoAsset[] = [
  {
    id: 1,
    title: "Radio one-sheet",
    type: "PDF",
    updatedAt: "Mar 14, 2026",
    status: "ready",
    notes: "Includes latest release highlights and socials.",
  },
  {
    id: 2,
    title: "Clean radio edit",
    type: "WAV",
    updatedAt: "Mar 11, 2026",
    status: "needs update",
    notes: "Current cut still references old outro.",
  },
  {
    id: 3,
    title: "Station intro drops",
    type: "ZIP",
    updatedAt: "Mar 9, 2026",
    status: "ready",
    notes: "Pack includes 8 station-specific variants.",
  },
  {
    id: 4,
    title: "Artist bio (short + full)",
    type: "DOCX",
    updatedAt: "Mar 6, 2026",
    status: "draft",
    notes: "Needs updated tour callout section.",
  },
];

const initialPromoChecklist = [
  { id: 1, label: "Clean edit exported at broadcast standards", done: true },
  { id: 2, label: "One-sheet updated with latest metrics", done: true },
  { id: 3, label: "Station intro drops normalized", done: false },
  { id: 4, label: "Press quote block refreshed", done: false },
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

export default function RadioPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date("2026-03-18")
  );
  const [scheduleView, setScheduleView] = useState<"day" | "week">("day");
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [promoAssets, setPromoAssets] = useState<PromoAsset[]>(initialPromoAssets);
  const [promoSearch, setPromoSearch] = useState("");
  const [promoStatusFilter, setPromoStatusFilter] = useState<"all" | PromoAssetStatus>(
    "all"
  );
  const [isAddAssetOpen, setIsAddAssetOpen] = useState(false);
  const [newAssetTitle, setNewAssetTitle] = useState("");
  const [newAssetType, setNewAssetType] = useState("PDF");
  const [newAssetStatus, setNewAssetStatus] = useState<PromoAssetStatus>("draft");
  const [newAssetNotes, setNewAssetNotes] = useState("");
  const [assetError, setAssetError] = useState<string | null>(null);
  const [promoChecklist, setPromoChecklist] = useState(initialPromoChecklist);

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

  const totalTargetStations = useMemo(() => {
    return campaigns.reduce((acc, campaign) => acc + campaign.target, 0);
  }, [campaigns]);

  const filteredPromoAssets = useMemo(() => {
    const query = promoSearch.trim().toLowerCase();

    return promoAssets.filter((asset) => {
      const matchesQuery =
        query.length === 0 ||
        asset.title.toLowerCase().includes(query) ||
        asset.type.toLowerCase().includes(query) ||
        (asset.notes ?? "").toLowerCase().includes(query);
      const matchesStatus =
        promoStatusFilter === "all" || asset.status === promoStatusFilter;

      return matchesQuery && matchesStatus;
    });
  }, [promoAssets, promoSearch, promoStatusFilter]);

  const readyAssetCount = useMemo(() => {
    return promoAssets.filter((asset) => asset.status === "ready").length;
  }, [promoAssets]);

  const needsUpdateAssetCount = useMemo(() => {
    return promoAssets.filter((asset) => asset.status === "needs update").length;
  }, [promoAssets]);

  const completedChecklistCount = useMemo(() => {
    return promoChecklist.filter((item) => item.done).length;
  }, [promoChecklist]);

  const visibleEvents = scheduleView === "week" ? selectedWeekEvents : selectedDayEvents;

  useEffect(() => {
    const storedCampaigns = readStoredCampaigns();
    if (storedCampaigns?.length) {
      setCampaigns(storedCampaigns);
    }
  }, []);

  const toggleChecklistItem = (id: number) => {
    setPromoChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  const handleAddAsset = () => {
    const trimmedTitle = newAssetTitle.trim();

    if (!trimmedTitle) {
      setAssetError("Asset title is required.");
      return;
    }

    setPromoAssets((prev) => [
      {
        id: Date.now(),
        title: trimmedTitle,
        type: newAssetType,
        status: newAssetStatus,
        updatedAt: new Date().toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        notes: newAssetNotes.trim() || undefined,
      },
      ...prev,
    ]);
    setNewAssetTitle("");
    setNewAssetType("PDF");
    setNewAssetStatus("draft");
    setNewAssetNotes("");
    setAssetError(null);
    setIsAddAssetOpen(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Radio</h1>
          <p className="text-muted-foreground">
            Manage radio outreach, track spins, and monitor campaigns.
          </p>
        </div>
        <Button
          render={
            <Link href="/dashboard/radio/new-campaign" />
          }
        >
          <Plus className="mr-2 h-4 w-4" />
          New Campaign
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <RadioTower className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaigns.length}</div>
            <p className="text-xs text-muted-foreground">
              Across {totalTargetStations} stations
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Recent Spins</CardTitle>
            <Signal className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Last 14 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Listener Reach</CardTitle>
            <Headphones className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">186K</div>
            <p className="text-xs text-muted-foreground">Estimated monthly</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              Radio Calendar
            </CardTitle>
            <CardDescription>
              View spin dates, submissions, and promo opportunities.
            </CardDescription>
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

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Promo Assets</h2>
            <p className="text-sm text-muted-foreground">
              Build and review what stations receive before each pitch cycle.
            </p>
          </div>
          <Dialog
            open={isAddAssetOpen}
            onOpenChange={(open) => {
              setIsAddAssetOpen(open);
              if (!open) setAssetError(null);
            }}
          >
            <DialogTrigger
              render={
                <Button>
                  <Upload className="mr-2 h-4 w-4" />
                  Add Asset
                </Button>
              }
            />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add promo asset</DialogTitle>
                <DialogDescription>
                  Track a file that should be included in your outbound radio pack.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 py-2">
                <Input
                  placeholder="Asset title"
                  value={newAssetTitle}
                  onChange={(event) => setNewAssetTitle(event.target.value)}
                />
                <div className="grid grid-cols-2 gap-3">
                  <select
                    className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                    value={newAssetType}
                    onChange={(event) => setNewAssetType(event.target.value)}
                  >
                    <option value="PDF">PDF</option>
                    <option value="WAV">WAV</option>
                    <option value="MP3">MP3</option>
                    <option value="DOCX">DOCX</option>
                    <option value="ZIP">ZIP</option>
                  </select>
                  <select
                    className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                    value={newAssetStatus}
                    onChange={(event) =>
                      setNewAssetStatus(event.target.value as PromoAssetStatus)
                    }
                  >
                    <option value="draft">draft</option>
                    <option value="needs update">needs update</option>
                    <option value="ready">ready</option>
                  </select>
                </div>
                <Textarea
                  placeholder="Asset notes (optional)"
                  value={newAssetNotes}
                  onChange={(event) => setNewAssetNotes(event.target.value)}
                />
                {assetError && (
                  <p className="text-sm text-destructive">{assetError}</p>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddAssetOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddAsset}>Save Asset</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Asset Library</CardTitle>
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{promoAssets.length}</div>
              <p className="text-xs text-muted-foreground">Total tracked files</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Ready To Send</CardTitle>
              <FileAudio className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{readyAssetCount}</div>
              <p className="text-xs text-muted-foreground">
                {needsUpdateAssetCount} need updates
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pack Checklist</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {completedChecklistCount}/{promoChecklist.length}
              </div>
              <p className="text-xs text-muted-foreground">Items completed</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.6fr,1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Asset Library</CardTitle>
              <CardDescription>
                Search by title, type, or notes and keep statuses current.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-[1fr,180px]">
                <Input
                  placeholder="Search promo assets"
                  value={promoSearch}
                  onChange={(event) => setPromoSearch(event.target.value)}
                />
                <select
                  className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                  value={promoStatusFilter}
                  onChange={(event) =>
                    setPromoStatusFilter(
                      event.target.value as "all" | PromoAssetStatus
                    )
                  }
                >
                  <option value="all">All statuses</option>
                  <option value="ready">ready</option>
                  <option value="needs update">needs update</option>
                  <option value="draft">draft</option>
                </select>
              </div>

              <div className="space-y-2">
                {filteredPromoAssets.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No promo assets match your filters.
                  </p>
                ) : (
                  filteredPromoAssets.map((asset) => (
                    <div
                      key={asset.id}
                      className="rounded-md border px-3 py-2 flex items-center justify-between gap-3"
                    >
                      <div>
                        <p className="text-sm font-medium">{asset.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {asset.type} • Updated {asset.updatedAt}
                        </p>
                        {asset.notes && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {asset.notes}
                          </p>
                        )}
                      </div>
                      <Badge
                        variant={asset.status === "ready" ? "default" : "secondary"}
                      >
                        {asset.status}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Broadcast Pack Checklist</CardTitle>
              <CardDescription>
                Mark what is complete before you send the next station batch.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {promoChecklist.map((item) => (
                <label
                  key={item.id}
                  className="flex items-start gap-3 rounded-md border p-3 cursor-pointer hover:bg-muted/40"
                >
                  <input
                    type="checkbox"
                    checked={item.done}
                    onChange={() => toggleChecklistItem(item.id)}
                    className="mt-0.5 h-4 w-4 accent-primary"
                  />
                  <span
                    className={`text-sm ${
                      item.done ? "text-muted-foreground line-through" : ""
                    }`}
                  >
                    {item.label}
                  </span>
                </label>
              ))}
              <Button
                variant={completedChecklistCount === promoChecklist.length ? "default" : "outline"}
                className="w-full"
                onClick={() => {
                  if (completedChecklistCount === promoChecklist.length) {
                    toast.success("Broadcast pack marked as ready for delivery!");
                  } else {
                    setPromoChecklist((prev) =>
                      prev.map((item) => ({ ...item, done: true }))
                    );
                    toast.success("All checklist items marked as complete");
                  }
                }}
              >
                {completedChecklistCount === promoChecklist.length
                  ? "Pack Ready For Delivery"
                  : "Complete Remaining Checklist"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Station Activity</CardTitle>
            <CardDescription>Latest station interactions and spins</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {stations.map((station) => (
              <div
                key={station.name}
                className="rounded-lg border p-4 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium">{station.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {station.program}
                  </p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-sm">{station.spinDate}</p>
                  <Badge
                    variant={
                      station.status === "recent spin" ? "default" : "secondary"
                    }
                  >
                    {station.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Outreach Progress</CardTitle>
            <CardDescription>Campaign-level station coverage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{campaign.name}</p>
                    <Badge
                      variant={
                        campaign.status === "active" ? "default" : "secondary"
                      }
                      className="text-[10px] px-1.5 py-0"
                    >
                      {campaign.status}
                    </Badge>
                  </div>
                  <span className="text-muted-foreground">{campaign.reached}/{campaign.target} stations</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{
                      width: `${Math.round(
                        (campaign.reached / campaign.target) * 100
                      )}%`,
                    }}
                  />
                </div>
                {campaign.notes && (
                  <p className="text-xs text-muted-foreground">{campaign.notes}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  {campaign.broadcasters.slice(0, 3).join(", ")}
                  {campaign.broadcasters.length > 3
                    ? ` +${campaign.broadcasters.length - 3} more`
                    : ""}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
