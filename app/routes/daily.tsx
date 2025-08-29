import { Layout } from "@/components/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { ArrowLeft, TrendingUp } from "lucide-react";

export function meta() {
  return [
    { title: "Daily Pulse - GridPulse" },
    { name: "description", content: "Auto-generated daily narrative with annotated chart" },
  ];
}

export default function DailyPulse() {
  return (
    <Layout>
      <div className="space-y-6">
        {/* Navigation */}
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        {/* Feature Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-primary" />
            Daily Pulse
          </h1>
          <p className="text-lg text-muted-foreground">
            Auto-generated daily narrative with annotated chart
          </p>
        </div>

        {/* Placeholder Content */}
        <Card>
          <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
            <CardDescription>
              This feature will provide automated daily summaries of grid activity
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-6 bg-muted/30 rounded-lg">
              <h3 className="font-semibold mb-3">What Daily Pulse will include:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Auto-generated narrative describing the day&apos;s grid activity</li>
                <li>• Annotated charts highlighting peaks, troughs, and ramp events</li>
                <li>• Key metrics and comparisons to historical averages</li>
                <li>• Renewable energy highlights and grid stability insights</li>
                <li>• Embed-ready content for reports and social sharing</li>
              </ul>
            </div>
            
            <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
              <div className="text-center space-y-2">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto" />
                <p className="text-muted-foreground">Chart visualization placeholder</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
