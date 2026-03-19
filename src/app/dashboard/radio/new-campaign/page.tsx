"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Campaign,
  initialCampaigns,
  readStoredCampaigns,
  ukMusicBroadcasters,
  writeStoredCampaigns,
} from "@/app/dashboard/radio/campaigns";

export default function NewRadioCampaignPage() {
  const router = useRouter();
  const [campaignName, setCampaignName] = useState("");
  const [campaignStartDate, setCampaignStartDate] = useState("");
  const [broadcasterSearch, setBroadcasterSearch] = useState("");
  const [selectedBroadcasters, setSelectedBroadcasters] = useState<string[]>([]);
  const [campaignNotes, setCampaignNotes] = useState("");
  const [campaignError, setCampaignError] = useState<string | null>(null);

  const filteredBroadcasters = useMemo(() => {
    const query = broadcasterSearch.trim().toLowerCase();
    if (!query) return ukMusicBroadcasters;
    return ukMusicBroadcasters.filter((name) => name.toLowerCase().includes(query));
  }, [broadcasterSearch]);

  const toggleBroadcaster = (broadcaster: string) => {
    setSelectedBroadcasters((prev) =>
      prev.includes(broadcaster)
        ? prev.filter((item) => item !== broadcaster)
        : [...prev, broadcaster]
    );
  };

  const handleCreateCampaign = () => {
    const trimmedName = campaignName.trim();

    if (!trimmedName) {
      setCampaignError("Campaign name is required.");
      return;
    }

    if (selectedBroadcasters.length === 0) {
      setCampaignError("Select at least one broadcaster.");
      return;
    }

    const currentCampaigns = readStoredCampaigns() ?? initialCampaigns;
    const nextCampaign: Campaign = {
      id: Date.now(),
      name: trimmedName,
      target: selectedBroadcasters.length,
      reached: 0,
      status: "draft",
      broadcasters: selectedBroadcasters,
      startDate: campaignStartDate || undefined,
      notes: campaignNotes.trim() || undefined,
    };

    writeStoredCampaigns([nextCampaign, ...currentCampaigns]);
    router.push("/dashboard/radio");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">New Radio Campaign</h1>
          <p className="text-muted-foreground">
            Pick target broadcasters and start a new radio outreach cycle.
          </p>
        </div>
        <Button variant="outline" render={<Link href="/dashboard/radio" />}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Radio
        </Button>
      </div>

      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>Create radio campaign</CardTitle>
          <CardDescription>
            Add campaign details and choose UK broadcasters for outreach.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Campaign name"
            value={campaignName}
            onChange={(event) => setCampaignName(event.target.value)}
          />
          <div className="grid gap-3">
            <Input
              type="date"
              value={campaignStartDate}
              onChange={(event) => setCampaignStartDate(event.target.value)}
            />
            <Input
              placeholder="Search broadcasters"
              value={broadcasterSearch}
              onChange={(event) => setBroadcasterSearch(event.target.value)}
            />
            <div className="max-h-80 space-y-1 overflow-y-auto rounded-md border p-2">
              {filteredBroadcasters.length === 0 ? (
                <p className="px-2 py-1 text-xs text-muted-foreground">
                  No broadcasters match your search.
                </p>
              ) : (
                filteredBroadcasters.map((broadcaster) => {
                  const checked = selectedBroadcasters.includes(broadcaster);
                  return (
                    <label
                      key={broadcaster}
                      className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 hover:bg-muted/40"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleBroadcaster(broadcaster)}
                        className="h-4 w-4 accent-primary"
                      />
                      <span className="text-sm">{broadcaster}</span>
                    </label>
                  );
                })
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Selected broadcasters: {selectedBroadcasters.length}
            </p>
          </div>
          <Textarea
            placeholder="Campaign notes (optional)"
            value={campaignNotes}
            onChange={(event) => setCampaignNotes(event.target.value)}
          />
          {campaignError ? (
            <p className="text-sm text-destructive">{campaignError}</p>
          ) : null}
          {campaignStartDate ? (
            <p className="text-xs text-muted-foreground">
              Planned start:{" "}
              {new Date(campaignStartDate).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          ) : null}
          <div className="flex flex-wrap gap-2 pt-2">
            <Button variant="outline" render={<Link href="/dashboard/radio" />}>
              Cancel
            </Button>
            <Button onClick={handleCreateCampaign}>
              <Plus className="mr-2 h-4 w-4" />
              Create Campaign
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
