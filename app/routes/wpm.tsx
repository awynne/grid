import type { Route } from "./+types/wpm";
import { Layout } from "@/components/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router";
import { ArrowLeft, Zap, Leaf } from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "What's Powering Me - GridPulse" },
    { name: "description", content: "Current CO₂ intensity and next clean window" },
  ];
}

export default function WhatsPoweringMe() {
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
            <Zap className="h-8 w-8 text-primary" />
            What's Powering Me
          </h1>
          <p className="text-lg text-muted-foreground">
            Current CO₂ intensity and next clean window
          </p>
        </div>

        {/* Placeholder Content */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Current Grid Status
              </CardTitle>
              <CardDescription>
                Real-time CO₂ intensity and fuel mix
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-6 bg-muted/30 rounded-lg">
                <div className="text-3xl font-bold text-primary mb-2">
                  425 <span className="text-lg font-normal text-muted-foreground">lbs/MWh</span>
                </div>
                <Badge className="bg-status-stale text-white">
                  Current CO₂ Intensity
                </Badge>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Current Fuel Mix:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span>Natural Gas</span>
                    <span className="font-medium">42%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Solar</span>
                    <span className="font-medium">18%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Wind</span>
                    <span className="font-medium">15%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Nuclear</span>
                    <span className="font-medium">12%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="h-5 w-5 text-green-600" />
                Next Clean Window
              </CardTitle>
              <CardDescription>
                Optimal time for high electricity usage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-6 bg-green-50 dark:bg-green-950 rounded-lg">
                <div className="text-2xl font-bold text-green-700 dark:text-green-300 mb-2">
                  2:00 PM - 4:00 PM
                </div>
                <Badge className="bg-status-clean text-white">
                  Clean Energy Window
                </Badge>
              </div>
              
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  <strong>Best time for:</strong> Running dishwashers, 
                  charging electric vehicles, and other energy-intensive activities.
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Why:</strong> Peak solar generation with low demand 
                  creates the cleanest electricity of the day.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coming Soon Info */}
        <Card>
          <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
            <CardDescription>
              Enhanced features for personalized grid insights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-muted/30 rounded-lg">
              <h3 className="font-semibold mb-3">What's Powering Me will include:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Real-time CO₂ intensity with historical context</li>
                <li>• 24-hour clean energy windows and recommendations</li>
                <li>• Personalized notifications for optimal usage times</li>
                <li>• Integration with smart home devices and EV charging</li>
                <li>• Carbon footprint tracking and reduction tips</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}