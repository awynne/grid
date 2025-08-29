import { App } from "cdktf";
import { ProductionEnvironmentStack } from "./stacks/ProductionEnvironmentStack";

const app = new App();

// Create production-only stack
new ProductionEnvironmentStack(app, "gridpulse-prod");

app.synth();
