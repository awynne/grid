import type { Route } from "./+types/ducks";
import { Layout } from "@/components/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { ArrowLeft, Sun, TrendingDown } from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Duck Days - GridPulse" },
    { name: "description", content: "Discoverable gallery of duck curve patterns" },
  ];
}

export default function DuckDays() {
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
            <Sun className="h-8 w-8 text-primary" />
            Duck Days
          </h1>
          <p className="text-lg text-muted-foreground">
            Discoverable gallery of duck curve patterns
          </p>
        </div>

        {/* Duck Curve Explanation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5" />
              What is the Duck Curve?
            </CardTitle>
            <CardDescription>
              Understanding the shape that defines modern grid operations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              The "duck curve" describes the daily pattern of electricity demand minus 
              solar generation. As solar adoption increases, this curve becomes more 
              pronounced, creating challenges for grid operators.
            </p>
            
            <div className="h-48 bg-gradient-to-r from-blue-50 to-yellow-50 dark:from-blue-950 dark:to-yellow-950 rounded-lg flex items-center justify-center">
              <div className="text-center space-y-2">
                <TrendingDown className="h-12 w-12 text-muted-foreground mx-auto" />
                <p className="text-muted-foreground">Duck curve visualization placeholder</p>
                <p className="text-xs text-muted-foreground">
                  Morning peak → Midday dip → Evening ramp
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Placeholder Gallery */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {['Perfect Duck', 'Extreme Duck', 'Inverted Duck'].map((title, index) => (
            <Card key={title}>
              <CardHeader>
                <CardTitle className="text-lg">{title}</CardTitle>
                <CardDescription>
                  {index === 0 && "Classic duck curve pattern"}
                  {index === 1 && "Deep midday solar generation"}  
                  {index === 2 && "Unusual reverse pattern"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-32 bg-muted/30 rounded flex items-center justify-center">
                  <Sun className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="mt-3 text-xs text-muted-foreground space-y-1">
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span>2024-{String(index + 3).padStart(2, '0')}-15</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duckiness Score:</span>
                    <span>{[8.5, 9.2, 3.1][index]}/10</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Coming Soon Info */}
        <Card>
          <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
            <CardDescription>
              Interactive gallery of duck curve patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-muted/30 rounded-lg">
              <h3 className="font-semibold mb-3">Duck Days will include:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Searchable gallery of historical duck curves</li>
                <li>• "Duckiness" scoring algorithm and rankings</li>
                <li>• Seasonal patterns and renewable energy correlation</li>
                <li>• Interactive comparisons across different grid operators</li>
                <li>• Educational content about grid flexibility challenges</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}