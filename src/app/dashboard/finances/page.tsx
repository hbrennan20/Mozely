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
import { Separator } from "@/components/ui/separator";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Receipt,
  Plus,
} from "lucide-react";

const transactions = [
  { description: "Blue Note - Performance Fee", amount: "+$1,200", date: "Mar 1", type: "income" },
  { description: "Spotify Royalties - February", amount: "+$342", date: "Feb 28", type: "income" },
  { description: "Equipment Rental - PA System", amount: "-$150", date: "Feb 25", type: "expense" },
  { description: "Village Vanguard - Performance Fee", amount: "+$1,000", date: "Feb 22", type: "income" },
  { description: "Studio Session - Mixing", amount: "-$400", date: "Feb 20", type: "expense" },
  { description: "Apple Music Royalties - February", amount: "+$128", date: "Feb 18", type: "income" },
  { description: "Travel - Flight to Chicago", amount: "-$280", date: "Feb 12", type: "expense" },
  { description: "Chicago Blues Fest - Performance Fee", amount: "+$2,000", date: "Feb 14", type: "income" },
];

const invoices = [
  { client: "Jazz Cafe Sessions", amount: "$950", status: "pending", due: "Apr 2" },
  { client: "Monterey Jazz Festival", amount: "$3,500", status: "draft", due: "Apr 18" },
  { client: "The Troubadour", amount: "$1,100", status: "sent", due: "Mar 30" },
];

export default function FinancesPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Finances</h1>
          <p className="text-muted-foreground">Track your income, expenses, and invoices.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Invoice
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Income (YTD)</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,670</div>
            <p className="text-xs text-muted-foreground"><span className="text-green-600">+18%</span> vs last year</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses (YTD)</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$3,830</div>
            <p className="text-xs text-muted-foreground">30% of income</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Outstanding Invoices</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$5,550</div>
            <p className="text-xs text-muted-foreground">3 invoices pending</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your latest income and expenses</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {transactions.map((tx, i) => (
              <div key={i} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{tx.description}</p>
                  <p className="text-xs text-muted-foreground">{tx.date}</p>
                </div>
                <span className={`font-semibold text-sm ${tx.type === "income" ? "text-green-600" : "text-red-500"}`}>
                  {tx.amount}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Invoices */}
        <Card>
          <CardHeader>
            <CardTitle>Invoices</CardTitle>
            <CardDescription>Track payments from venues and clients</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {invoices.map((inv, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <p className="font-medium text-sm">{inv.client}</p>
                  <p className="text-xs text-muted-foreground">Due {inv.due}</p>
                </div>
                <div className="text-right flex items-center gap-3">
                  <Badge variant={inv.status === "pending" ? "secondary" : inv.status === "sent" ? "default" : "outline"}>
                    {inv.status}
                  </Badge>
                  <span className="font-semibold">{inv.amount}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
