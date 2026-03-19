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
import {
  RadioTower,
  Plus,
  Signal,
  Headphones,
  CalendarDays,
  FolderOpen,
} from "lucide-react";
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

export default function RadioPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);

  useEffect(() => {
    const storedCampaigns = readStoredCampaigns();
    if (storedCampaigns?.length) {
      setCampaigns(storedCampaigns);
    }
  }, []);

  const totalTargetStations = useMemo(() => {
    return campaigns.reduce((acc, campaign) => acc + campaign.target, 0);
  }, [campaigns]);

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

      <div className="grid gap-4 md:grid-cols-2">
        <Button
          variant="outline"
          className="h-auto p-4 justify-start"
          render={<Link href="/dashboard/radio/schedule" />}
        >
          <CalendarDays className="h-5 w-5 mr-3 text-muted-foreground" />
          <div className="text-left">
            <p className="font-medium">Schedule</p>
            <p className="text-xs text-muted-foreground">
              Calendar view of spins, submissions, and promo slots
            </p>
          </div>
        </Button>
        <Button
          variant="outline"
          className="h-auto p-4 justify-start"
          render={<Link href="/dashboard/radio/assets" />}
        >
          <FolderOpen className="h-5 w-5 mr-3 text-muted-foreground" />
          <div className="text-left">
            <p className="font-medium">Promo Assets</p>
            <p className="text-xs text-muted-foreground">
              Manage files, checklists, and broadcast packs
            </p>
          </div>
        </Button>
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
