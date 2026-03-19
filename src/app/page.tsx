"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Music,
  Calendar,
  DollarSign,
  MessageSquare,
  FileText,
  TrendingUp,
  Zap,
  Shield,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: Calendar,
    title: "Gig Booking",
    description:
      "AI finds and books gigs matching your style, availability, and rate. Never miss an opportunity.",
  },
  {
    icon: DollarSign,
    title: "Financial Management",
    description:
      "Track earnings, send invoices, manage expenses, and get tax-ready reports automatically.",
  },
  {
    icon: MessageSquare,
    title: "Smart Communications",
    description:
      "AI drafts and sends professional emails to venues, promoters, and collaborators on your behalf.",
  },
  {
    icon: FileText,
    title: "Contract Management",
    description:
      "Review, negotiate, and manage contracts. Get alerts on key terms and deadlines.",
  },
  {
    icon: TrendingUp,
    title: "Career Analytics",
    description:
      "Track your growth across streaming, social media, and live performance metrics in one place.",
  },
  {
    icon: Shield,
    title: "Rights & Royalties",
    description:
      "Monitor your royalty streams, flag discrepancies, and ensure you get paid for every play.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Music className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold tracking-tight">Mozely</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-medium h-7 px-2.5 transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <Badge variant="secondary" className="text-sm px-4 py-1">
            <Zap className="h-3 w-3 mr-1" />
            AI-Powered Music Management
          </Badge>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-tight">
            Your AI manager.
            <br />
            <span className="text-muted-foreground">
              So you can focus on the music.
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Mozely is an AI agent that handles the business side of your music
            career &mdash; booking gigs, managing finances, negotiating
            contracts, and growing your audience.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-medium h-9 px-2.5 transition-all"
            >
              Start Free <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Button
              size="lg"
              variant="outline"
              onClick={() =>
                document
                  .getElementById("features")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              See How It Works
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 bg-muted/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight">
              Everything you need to run your career
            </h2>
            <p className="text-muted-foreground mt-3 text-lg">
              One AI agent handling all the stuff that takes you away from
              creating.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="pt-6">
                  <feature.icon className="h-10 w-10 text-primary mb-4" />
                  <h3 className="font-semibold text-lg mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-bold tracking-tight">
            Ready to let AI handle the business?
          </h2>
          <p className="text-muted-foreground text-lg">
            Join thousands of musicians who spend less time on admin and more
            time making music.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-medium h-9 px-2.5 transition-all"
          >
            Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Music className="h-4 w-4" />
            <span>Mozely</span>
          </div>
          <p>&copy; {new Date().getFullYear()} Mozely. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
