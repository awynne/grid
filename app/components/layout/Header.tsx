import { BASelector } from "@/components/gridpulse/BASelector";
import { FreshnessIndicator } from "@/components/gridpulse/FreshnessIndicator";
import { useState } from "react";

export function Header() {
  const [selectedBA, setSelectedBA] = useState<string>('');

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-container">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-primary">GridPulse</h1>
            <p className="text-sm text-muted-foreground hidden sm:block">
              Electric Grid Data Visualization
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <BASelector 
              value={selectedBA}
              onValueChange={setSelectedBA}
              className="hidden sm:block"
            />
            <FreshnessIndicator 
              status="stale" 
              lastUpdated={new Date(Date.now() - 2 * 60 * 60 * 1000)} // 2 hours ago
            />
          </div>
        </div>
        
        {/* Mobile BA selector */}
        <div className="sm:hidden pb-4">
          <BASelector 
            value={selectedBA}
            onValueChange={setSelectedBA}
            className="w-full"
          />
        </div>
      </div>
    </header>
  );
}