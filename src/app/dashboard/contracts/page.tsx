"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, AlertTriangle, CheckCircle2, Clock, Bot, Upload } from "lucide-react";

const contracts = [
  {
    title: "Blue Note - March 15 Performance",
    party: "The Blue Note NYC",
    status: "signed",
    date: "Mar 1, 2026",
    value: "$1,200",
    alerts: [],
  },
  {
    title: "Ronnie Scott's - Solo Performance",
    party: "Ronnie Scott's Jazz Club",
    status: "signed",
    date: "Feb 28, 2026",
    value: "\u00a3800",
    alerts: [],
  },
  {
    title: "Jazz Cafe Sessions Agreement",
    party: "Jazz Cafe LA",
    status: "review",
    date: "Mar 10, 2026",
    value: "$950",
    alerts: ["Cancellation clause needs review", "Payment terms differ from standard"],
  },
  {
    title: "Monterey Jazz Festival 2026",
    party: "Monterey Jazz Festival",
    status: "draft",
    date: "Mar 8, 2026",
    value: "$3,500",
    alerts: ["Exclusivity radius clause flagged"],
  },
  {
    title: "Streaming Distribution Agreement",
    party: "DistroKid",
    status: "active",
    date: "Jan 15, 2026",
    value: "Revenue share",
    alerts: [],
  },
];

const statusConfig = {
  signed: { color: "default" as const, icon: CheckCircle2 },
  review: { color: "secondary" as const, icon: AlertTriangle },
  draft: { color: "outline" as const, icon: Clock },
  active: { color: "default" as const, icon: CheckCircle2 },
};

export default function ContractsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Contracts</h1>
          <p className="text-muted-foreground">Review, negotiate, and manage your agreements.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Bot className="mr-2 h-4 w-4" />
            Review All
          </Button>
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Upload Contract
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {contracts.map((contract, i) => {
          const config = statusConfig[contract.status as keyof typeof statusConfig];
          return (
            <Card key={i} className="hover:shadow-sm transition-shadow cursor-pointer">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-muted">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{contract.title}</p>
                        <Badge variant={config.color}>{contract.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{contract.party} &middot; {contract.date}</p>
                      {contract.alerts.length > 0 && (
                        <div className="space-y-1 mt-2">
                          {contract.alerts.map((alert, j) => (
                            <div key={j} className="flex items-center gap-2 text-sm text-yellow-600">
                              <AlertTriangle className="h-3 w-3" />
                              {alert}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="font-semibold">{contract.value}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
