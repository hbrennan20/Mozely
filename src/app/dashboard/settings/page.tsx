"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Bot, Music, DollarSign, Bell, Shield } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your profile and agent preferences.</p>
      </div>

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="h-4 w-4" />
            Artist Profile
          </CardTitle>
          <CardDescription>This info helps Mozely find the right opportunities.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Artist Name</label>
              <Input defaultValue="Alex Rivera" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Genre</label>
              <Input defaultValue="Jazz, Blues" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <Input defaultValue="New York, NY" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Performance Type</label>
              <Input defaultValue="Solo, Trio, Full Band" />
            </div>
          </div>
          <Button>Save Profile</Button>
        </CardContent>
      </Card>

      {/* Agent Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            Agent Preferences
          </CardTitle>
          <CardDescription>Control what Mozely can do on your behalf.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Auto-send gig inquiries</p>
              <p className="text-xs text-muted-foreground">Let Mozely reach out to matching venues</p>
            </div>
            <Badge>Enabled</Badge>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Draft email responses</p>
              <p className="text-xs text-muted-foreground">AI drafts replies for your review</p>
            </div>
            <Badge>Enabled</Badge>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Auto-send invoices</p>
              <p className="text-xs text-muted-foreground">Automatically invoice after confirmed gigs</p>
            </div>
            <Badge variant="outline">Disabled</Badge>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Contract auto-review</p>
              <p className="text-xs text-muted-foreground">AI reviews contracts and flags issues</p>
            </div>
            <Badge>Enabled</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Financial */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Financial Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Minimum Gig Fee</label>
              <Input defaultValue="$800" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Currency</label>
              <Input defaultValue="USD" />
            </div>
          </div>
          <Button>Save Preferences</Button>
        </CardContent>
      </Card>
    </div>
  );
}
