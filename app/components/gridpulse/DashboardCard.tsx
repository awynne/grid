import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { FeatureCard } from "@/types";

const dashboardCardVariants = cva(
  "rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md",
  {
    variants: {
      size: {
        sm: "p-4 min-h-[200px]",
        md: "p-6 min-h-[250px]",
        lg: "p-8 min-h-[300px]",
      },
      priority: {
        low: "border-border",
        medium: "border-yellow-200 dark:border-yellow-800",
        high: "border-red-200 dark:border-red-800 shadow-md",
      },
      columns: {
        1: "col-span-1",
        2: "col-span-1 md:col-span-2",
        3: "col-span-1 md:col-span-2 lg:col-span-3",
      },
    },
    defaultVariants: {
      size: "md",
      priority: "low",
      columns: 1,
    },
  }
);

interface DashboardCardProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof dashboardCardVariants> {
  title: string;
  description: string;
  href: string;
  status: FeatureCard['status'];
}

export function DashboardCard({ 
  className, 
  title, 
  description, 
  href, 
  status, 
  size, 
  priority, 
  columns,
  ...props 
}: DashboardCardProps) {
  const statusBadgeColor = {
    placeholder: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
    "coming-soon": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  }[status];

  const statusText = {
    placeholder: "Placeholder",
    "coming-soon": "Coming Soon",
    active: "Active",
  }[status];

  return (
    <Link to={href} className="block">
      <Card 
        className={cn(dashboardCardVariants({ size, priority, columns }), className)} 
        {...props}
      >
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            <Badge className={statusBadgeColor}>
              {statusText}
            </Badge>
          </div>
          <CardDescription className="text-sm text-muted-foreground">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {status === 'placeholder' && (
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2" />
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}