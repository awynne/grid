import { useState } from "react";
import { Info } from "lucide-react";

interface AboutDialogProps {
  version?: string;
  deployedImage?: string;
}

export function AboutDialog({ version = "unknown", deployedImage = "unknown" }: AboutDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* About button */}
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9 text-muted-foreground"
        aria-label="About GridPulse"
      >
        <Info className="h-4 w-4" />
      </button>

      {/* Dialog overlay and modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dialog content */}
          <div className="relative bg-background rounded-lg border shadow-lg max-w-md w-full mx-4 p-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold">About GridPulse</h2>
                <p className="text-sm text-muted-foreground">
                  Electric Grid Data Visualization Platform
                </p>
              </div>
              
              <div className="space-y-3 text-xs">
                <div>
                  <div className="font-medium text-foreground mb-1">Version Information</div>
                  <div className="font-mono text-muted-foreground bg-muted p-2 rounded">
                    <div>Version: {version}</div>
                    <div className="break-all">Image: {deployedImage}</div>
                  </div>
                </div>
                
                <div>
                  <div className="font-medium text-foreground mb-1">Data Source</div>
                  <div className="text-muted-foreground">
                    EIA-930 Hourly Electric Grid Data
                  </div>
                </div>
                
                <div>
                  <div className="font-medium text-foreground mb-1">Technology</div>
                  <div className="text-muted-foreground">
                    React Router 7, TypeScript, Tailwind CSS
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-3"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}