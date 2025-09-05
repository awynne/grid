import { LoaderFunction, useLoaderData } from "react-router";
import { Layout } from "@/components/layout";
import { DashboardCard } from "@/components/gridpulse";
import { FEATURE_CARDS } from "@/lib/constants";

export function meta() {
  return [
    { title: "GridPulse - Electric Grid Data Visualization" },
    { name: "description", content: "Real-time electric grid data analysis and visualization platform" },
  ];
}

export const loader: LoaderFunction = async () => {
  const deployedImage = process.env.DEPLOYED_IMAGE || "unknown";
  // Extract just the version tag from the full image string (e.g., "ghcr.io/awynne/grid:v20250905-19" -> "v20250905-19")
  const version = deployedImage.includes(":") ? deployedImage.split(":").pop() || "unknown" : "unknown";
  
  return {
    version,
    deployedImage
  };
};

export default function Home() {
  const { version } = useLoaderData<typeof loader>();
  
  return (
    <Layout>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Electric Grid Dashboard
          </h1>
          <div className="inline-flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <span className="px-2 py-0.5 rounded-md bg-muted">Deployment check</span>
            <span className="font-mono">{version}</span>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real-time insights from EIA-930 hourly electric grid data. 
            Select a balancing authority and explore grid patterns.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid gap-dashboard-gap grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {FEATURE_CARDS.map((card) => (
            <DashboardCard
              key={card.id}
              title={card.title}
              description={card.description}
              href={card.href}
              status={card.status}
            />
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-12 p-6 bg-muted/50 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <h3 className="font-medium text-foreground mb-2">1. Select a Balancing Authority</h3>
              <p className="text-muted-foreground">
                Choose from major grid operators like CAISO (California), 
                ERCOT (Texas), PJM (Eastern), MISO (Midwest), or SPP (Southwest).
              </p>
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-2">2. Explore Features</h3>
              <p className="text-muted-foreground">
                Each card represents a different way to analyze grid data. 
                Click any card to explore that feature (currently showing placeholders).
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
