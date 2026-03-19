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
  ArrowLeft,
  FileAudio,
  FileText,
  FolderOpen,
  Upload,
} from "lucide-react";
import { toast } from "sonner";

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

export default function RadioAssetsPage() {
  const [promoAssets, setPromoAssets] = useState<PromoAsset[]>(initialPromoAssets);
  const [promoSearch, setPromoSearch] = useState("");
  const [promoStatusFilter, setPromoStatusFilter] = useState<"all" | PromoAssetStatus>("all");
  const [isAddAssetOpen, setIsAddAssetOpen] = useState(false);
  const [newAssetTitle, setNewAssetTitle] = useState("");
  const [newAssetType, setNewAssetType] = useState("PDF");
  const [newAssetStatus, setNewAssetStatus] = useState<PromoAssetStatus>("draft");
  const [newAssetNotes, setNewAssetNotes] = useState("");
  const [assetError, setAssetError] = useState<string | null>(null);
  const [promoChecklist, setPromoChecklist] = useState(initialPromoChecklist);

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

  const readyAssetCount = promoAssets.filter((a) => a.status === "ready").length;
  const needsUpdateAssetCount = promoAssets.filter((a) => a.status === "needs update").length;
  const completedChecklistCount = promoChecklist.filter((item) => item.done).length;

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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Promo Assets</h1>
          <p className="text-muted-foreground">
            Build and review what stations receive before each pitch cycle.
          </p>
        </div>
        <div className="flex items-center gap-2">
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
          <Button variant="outline" render={<Link href="/dashboard/radio" />}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Radio
          </Button>
        </div>
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
  );
}
