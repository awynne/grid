import type { Route } from "./+types/diff";
import { Layout } from "@/components/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router";
import { ArrowLeft, GitCompare, TrendingUp, TrendingDown } from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "What Changed - GridPulse" },
    { name: "description", content: "Daily diff cards vs baseline metrics" },
  ];
}

export default function WhatChanged() {
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
            <GitCompare className="h-8 w-8 text-primary" />
            What Changed
          </h1>
          <p className="text-lg text-muted-foreground">
            Daily diff cards vs baseline metrics
          </p>
        </div>

        {/* Placeholder Diff Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                Peak Demand
                <TrendingUp className="h-5 w-5 text-green-600" />
              </CardTitle>
              <CardDescription>vs. 30-day average</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">24,500</span>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                    +8.5%
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Yesterday:</span>
                    <span>24,500 MW</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Baseline:</span>
                    <span>22,580 MW</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                Solar Generation
                <TrendingDown className="h-5 w-5 text-red-600" />
              </CardTitle>
              <CardDescription>vs. seasonal average</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">12,400</span>
                  <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                    -12.3%
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Yesterday:</span>
                    <span>12,400 MW</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Baseline:</span>
                    <span>14,140 MW</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                Wind Generation
                <TrendingUp className="h-5 w-5 text-green-600" />
              </CardTitle>
              <CardDescription>vs. weekly average</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">18,900</span>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                    +23.7%
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Yesterday:</span>
                    <span>18,900 MW</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Baseline:</span>
                    <span>15,280 MW</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary Card */}
        <Card>
          <CardHeader>
            <CardTitle>Yesterday's Notable Changes</CardTitle>
            <CardDescription>
              Key deviations from baseline patterns
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-800 dark:text-green-300">
                  Strong wind generation
                </span>
              </div>
              <p className="text-sm text-green-700 dark:text-green-400">
                Wind output exceeded weekly average by 23.7% due to favorable weather patterns.
              </p>
            </div>
            
            <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="h-4 w-4 text-red-600" />
                <span className="font-medium text-red-800 dark:text-red-300">
                  Reduced solar output
                </span>
              </div>
              <p className="text-sm text-red-700 dark:text-red-400">
                Solar generation dropped 12.3% below seasonal average due to cloud cover.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Coming Soon Info */}
        <Card>
          <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
            <CardDescription>
              Advanced baseline comparisons and change detection
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-muted/30 rounded-lg">
              <h3 className="font-semibold mb-3">What Changed will include:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Multiple baseline comparisons (daily, weekly, seasonal, annual)</li>
                <li>• Automated anomaly detection with contextual explanations</li>
                <li>• Historical trend analysis and pattern recognition</li>
                <li>• Weather correlation and external factor integration</li>
                <li>• Customizable alerts for significant grid changes</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}