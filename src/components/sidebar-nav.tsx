"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Music,
  LayoutDashboard,
  Calendar,
  RadioTower,
  Map,
  TrendingUp,
  Settings,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/gigs", label: "Gigs", icon: Calendar },
  { href: "/dashboard/tours", label: "Tours", icon: Map },
  { href: "/dashboard/radio", label: "Radio", icon: RadioTower },
  { href: "/dashboard/analytics", label: "Analytics", icon: TrendingUp },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-64 border-r bg-muted/30 flex-col">
      <div className="h-16 border-b flex items-center px-6 gap-2">
        <Music className="h-5 w-5 text-primary" />
        <span className="font-bold text-lg tracking-tight">Mozely</span>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
