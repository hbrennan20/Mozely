"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  TrendingUp,
  Music,
  Users,
  Radio,
  Globe,
  BarChart3,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const platforms = [
  { name: "Spotify", streams: 15200, change: "+12%", listeners: "4.1K" },
  { name: "Apple Music", streams: 6800, change: "+5%", listeners: "2.3K" },
  { name: "YouTube Music", streams: 2300, change: "+22%", listeners: "890" },
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

const monthlyStreams = [
  { month: "Oct", streams: 12900, listeners: 4400 },
  { month: "Nov", streams: 14600, listeners: 5000 },
  { month: "Dec", streams: 16500, listeners: 5600 },
  { month: "Jan", streams: 18200, listeners: 6200 },
  { month: "Feb", streams: 20800, listeners: 6800 },
  { month: "Mar", streams: 24300, listeners: 7300 },
];

const audienceBySource = [
  { source: "Streaming", value: 62, color: "var(--chart-1)" },
  { source: "Social", value: 24, color: "var(--chart-2)" },
  { source: "Live gigs", value: 14, color: "var(--chart-3)" },
];

export default function AnalyticsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Track your growth across all platforms.
        </p>
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
        {/* Streams + Listeners Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Streams &amp; Listeners Trend</CardTitle>
            <CardDescription>Last 6 months performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 rounded-lg border p-3">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyStreams} margin={{ top: 12, right: 16, left: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--background)",
                      border: "1px solid var(--border)",
                      borderRadius: "10px",
                    }}
                    labelStyle={{ color: "var(--foreground)" }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="streams"
                    stroke="var(--chart-1)"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Streams"
                  />
                  <Line
                    type="monotone"
                    dataKey="listeners"
                    stroke="var(--chart-2)"
                    strokeWidth={2.5}
                    strokeDasharray="6 4"
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                    name="Listeners"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Platform Mix */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Mix</CardTitle>
            <CardDescription>Share of streams by platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 rounded-lg border p-3">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={platforms}
                  margin={{ top: 8, right: 12, left: 8, bottom: 8 }}
                  barGap={10}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    formatter={(value) => [`${Number(value).toLocaleString()} streams`, "Streams"]}
                    contentStyle={{
                      background: "var(--background)",
                      border: "1px solid var(--border)",
                      borderRadius: "10px",
                    }}
                  />
                  <Bar dataKey="streams" radius={[8, 8, 0, 0]}>
                    {platforms.map((platform, index) => (
                      <Cell
                        key={`${platform.name}-${index}`}
                        fill={`var(--chart-${(index % 5) + 1})`}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 space-y-2">
              {platforms.map((platform) => (
                <div
                  key={`${platform.name}-meta`}
                  className="flex items-center justify-between text-sm"
                >
                  <p className="text-muted-foreground">{platform.name}</p>
                  <p className="font-medium">{platform.change}</p>
                </div>
              ))}
            </div>
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

        {/* Social Media + Acquisition */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Social Growth &amp; Audience Source</CardTitle>
            <CardDescription>
              Follower growth, engagement, and where fans discover you
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
              <div className="grid gap-4 md:grid-cols-3">
                {socialStats.map((social, i) => (
                  <div key={i} className="p-4 rounded-lg border text-center">
                    <p className="font-medium">{social.platform}</p>
                    <p className="text-2xl font-bold mt-1">{social.followers}</p>
                    <div className="flex items-center justify-center gap-3 mt-2 text-sm text-muted-foreground">
                      <span>Engagement: {social.engagement}</span>
                      <span className="text-green-600">{social.change}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-lg border p-4">
                <p className="text-sm font-medium mb-3">Audience source split</p>
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Tooltip
                        formatter={(value) => [`${value}%`, "Audience"]}
                        contentStyle={{
                          background: "var(--background)",
                          border: "1px solid var(--border)",
                          borderRadius: "10px",
                        }}
                      />
                      <Pie
                        data={audienceBySource}
                        dataKey="value"
                        nameKey="source"
                        cx="50%"
                        cy="50%"
                        innerRadius={48}
                        outerRadius={74}
                        paddingAngle={3}
                      >
                        {audienceBySource.map((entry) => (
                          <Cell key={entry.source} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  {audienceBySource.map((source) => (
                    <div key={source.source} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: source.color }}
                        />
                        <span className="text-muted-foreground">{source.source}</span>
                      </div>
                      <span className="font-medium">{source.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
