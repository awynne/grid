import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FreshnessBadgeProps } from "@/types";

export function FreshnessIndicator({ lastUpdated, status }: FreshnessBadgeProps) {
  const statusConfig = {
    fresh: {
      color: "bg-status-fresh text-white",
      text: "Fresh",
      icon: Clock,
    },
    stale: {
      color: "bg-status-stale text-white",
      text: "Stale",
      icon: Clock,
    },
    "very-stale": {
      color: "bg-status-very-stale text-white", 
      text: "Very Stale",
      icon: Clock,
    },
    missing: {
      color: "bg-status-missing text-white",
      text: "Missing",
      icon: Clock,
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  const formatLastUpdated = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffHours === 0) {
      return `${diffMinutes}m ago`;
    }
    return `${diffHours}h ${diffMinutes}m ago`;
  };

  return (
    <Badge className={cn("flex items-center gap-1 text-xs", config.color)}>
      <Icon className="h-3 w-3" />
      <span>{config.text}</span>
      {lastUpdated && (
        <span className="ml-1 opacity-90">
          ({formatLastUpdated(lastUpdated)})
        </span>
      )}
    </Badge>
  );
}