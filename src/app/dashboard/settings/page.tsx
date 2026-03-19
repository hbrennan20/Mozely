"use client";

import { useState } from "react";
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
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, Music, DollarSign, Bell, Shield } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  // Profile state
  const [artistName, setArtistName] = useState("Alex Rivera");
  const [genre, setGenre] = useState("Jazz, Blues");
  const [location, setLocation] = useState("London, UK");
  const [performanceType, setPerformanceType] = useState("Solo, Trio, Full Band");

  // Agent preferences state
  const [autoSendInquiries, setAutoSendInquiries] = useState(true);
  const [draftEmails, setDraftEmails] = useState(true);
  const [autoSendInvoices, setAutoSendInvoices] = useState(false);
  const [contractAutoReview, setContractAutoReview] = useState(true);

  // Financial state
  const [minFee, setMinFee] = useState("£800");
  const [currency, setCurrency] = useState("GBP");

  // Notification state
  const [gigAlerts, setGigAlerts] = useState(true);
  const [paymentUpdates, setPaymentUpdates] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  // Security state
  const [email, setEmail] = useState("alex@example.com");
  const [password, setPassword] = useState("••••••••••••");

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your profile and agent preferences.</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList>
          <TabsTrigger value="profile" className="gap-2">
            <Music className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="agent" className="gap-2">
            <Bot className="h-4 w-4" />
            Agent
          </TabsTrigger>
          <TabsTrigger value="financial" className="gap-2">
            <DollarSign className="h-4 w-4" />
            Financial
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music className="h-4 w-4" />
                Artist Profile
              </CardTitle>
              <CardDescription>This info helps Mozely find the right opportunities.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Artist Name</label>
                  <Input value={artistName} onChange={(e) => setArtistName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Genre</label>
                  <Input value={genre} onChange={(e) => setGenre(e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Location</label>
                  <Input value={location} onChange={(e) => setLocation(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Performance Type</label>
                  <Input value={performanceType} onChange={(e) => setPerformanceType(e.target.value)} />
                </div>
              </div>
              <Button
                onClick={() => toast.success("Profile saved")}
              >
                Save Profile
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agent" className="mt-4">
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
                <Switch
                  checked={autoSendInquiries}
                  onCheckedChange={(checked) => {
                    setAutoSendInquiries(checked);
                    toast.success(`Auto-send gig inquiries ${checked ? "enabled" : "disabled"}`);
                  }}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Draft email responses</p>
                  <p className="text-xs text-muted-foreground">AI drafts replies for your review</p>
                </div>
                <Switch
                  checked={draftEmails}
                  onCheckedChange={(checked) => {
                    setDraftEmails(checked);
                    toast.success(`Draft email responses ${checked ? "enabled" : "disabled"}`);
                  }}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Auto-send invoices</p>
                  <p className="text-xs text-muted-foreground">Automatically invoice after confirmed gigs</p>
                </div>
                <Switch
                  checked={autoSendInvoices}
                  onCheckedChange={(checked) => {
                    setAutoSendInvoices(checked);
                    toast.success(`Auto-send invoices ${checked ? "enabled" : "disabled"}`);
                  }}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Contract auto-review</p>
                  <p className="text-xs text-muted-foreground">AI reviews contracts and flags issues</p>
                </div>
                <Switch
                  checked={contractAutoReview}
                  onCheckedChange={(checked) => {
                    setContractAutoReview(checked);
                    toast.success(`Contract auto-review ${checked ? "enabled" : "disabled"}`);
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Financial Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Minimum Gig Fee</label>
                  <Input value={minFee} onChange={(e) => setMinFee(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Currency</label>
                  <Input value={currency} onChange={(e) => setCurrency(e.target.value)} />
                </div>
              </div>
              <Button
                onClick={() => toast.success("Financial preferences saved")}
              >
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notification Settings
              </CardTitle>
              <CardDescription>Choose what updates you receive from Mozely.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Gig alerts</p>
                  <p className="text-xs text-muted-foreground">Get notified about new matching opportunities</p>
                </div>
                <Switch
                  checked={gigAlerts}
                  onCheckedChange={(checked) => {
                    setGigAlerts(checked);
                    toast.success(`Gig alerts ${checked ? "enabled" : "disabled"}`);
                  }}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Payment updates</p>
                  <p className="text-xs text-muted-foreground">Track invoice and payout status changes</p>
                </div>
                <Switch
                  checked={paymentUpdates}
                  onCheckedChange={(checked) => {
                    setPaymentUpdates(checked);
                    toast.success(`Payment updates ${checked ? "enabled" : "disabled"}`);
                  }}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Marketing emails</p>
                  <p className="text-xs text-muted-foreground">Receive product tips and feature announcements</p>
                </div>
                <Switch
                  checked={marketingEmails}
                  onCheckedChange={(checked) => {
                    setMarketingEmails(checked);
                    toast.success(`Marketing emails ${checked ? "enabled" : "disabled"}`);
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Security
              </CardTitle>
              <CardDescription>Manage account access and protection settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email Address</label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <Button
                variant="outline"
                onClick={() => toast.success("Security settings updated")}
              >
                Update Security Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
