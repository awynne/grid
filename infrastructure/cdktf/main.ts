import { App, CloudBackend, NamedCloudWorkspace } from "cdktf";
import { ProductionEnvironmentStack } from "./stacks/ProductionEnvironmentStack";

const app = new App();

// Create production-only stack
const prod = new ProductionEnvironmentStack(app, "gridpulse-prod");

// Optional: Configure Terraform Cloud remote backend when env vars are provided
const org = process.env.TF_CLOUD_ORG;
const workspace = process.env.TF_CLOUD_WORKSPACE;
if (org && workspace) {
  new CloudBackend(prod, {
    hostname: "app.terraform.io",
    organization: org,
    workspaces: new NamedCloudWorkspace(workspace),
  });
}

app.synth();
