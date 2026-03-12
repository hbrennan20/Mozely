"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Music,
  Users,
  Radio,
  Globe,
  BarChart3,
} from "lucide-react";

const platforms = [
  { name: "Spotify", streams: "15.2K", change: "+12%", listeners: "4.1K" },
  { name: "Apple Music", streams: "6.8K", change: "+5%", listeners: "2.3K" },
  { name: "YouTube Music", streams: "2.3K", change: "+22%", listeners: "890" },
];

const topTracks = [
  { title: "Midnight in Blue", streams: "8,420", trend: "up" },
  { title: "City Lights", streams: "5,210", trend: "up" },
  { title: "Autumn Leaves (Live)", streams: "3,890", trend: "stable" },
  { title: "Quarter Note Blues", streams: "2,100", trend: "down" },
  { title: "Sunday Morning", streams: "1,950", trend: "up" },
];

const socialStats = [
  { platform: "Instagram", followers: "12.4K", engagement: "4.2%", change: "+320" },
  { platform: "TikTok", followers: "8.1K", engagement: "6.8%", change: "+1.2K" },
  { platform: "Twitter/X", followers: "3.2K", engagement: "2.1%", change: "+85" },
];

export default function AnalyticsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">Track your growth across all platforms.</p>
      </div>

      {/* Top Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Streams</CardTitle>
            <Radio className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.3K</div>
            <p className="text-xs text-muted-foreground"><span className="text-green-600">+11%</span> this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Monthly Listeners</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7.3K</div>
            <p className="text-xs text-muted-foreground"><span className="text-green-600">+8%</span> this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Social Followers</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23.7K</div>
            <p className="text-xs text-muted-foreground"><span className="text-green-600">+1.6K</span> this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Gig Revenue</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$4,200</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Streaming Platforms */}
        <Card>
          <CardHeader>
            <CardTitle>Streaming Platforms</CardTitle>
            <CardDescription>Monthly breakdown by platform</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {platforms.map((p, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <p className="font-medium">{p.name}</p>
                  <p className="text-sm text-muted-foreground">{p.listeners} listeners</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{p.streams} streams</p>
                  <p className="text-sm text-green-600">{p.change}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top Tracks */}
        <Card>
          <CardHeader>
            <CardTitle>Top Tracks</CardTitle>
            <CardDescription>Most streamed this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topTracks.map((track, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground w-4">{i + 1}</span>
                    <Music className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-medium">{track.title}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{track.streams}</span>
                    {track.trend === "up" && <TrendingUp className="h-3 w-3 text-green-600" />}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Social Media */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Social Media</CardTitle>
            <CardDescription>Follower growth and engagement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {socialStats.map((s, i) => (
                <div key={i} className="p-4 rounded-lg border text-center">
                  <p className="font-medium">{s.platform}</p>
                  <p className="text-2xl font-bold mt-1">{s.followers}</p>
                  <div className="flex items-center justify-center gap-3 mt-2 text-sm text-muted-foreground">
                    <span>Engagement: {s.engagement}</span>
                    <span className="text-green-600">{s.change}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
