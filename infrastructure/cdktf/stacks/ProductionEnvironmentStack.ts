import { Construct } from "constructs";
import { TerraformStack, TerraformVariable } from "cdktf";
import { GridPulseEnvironment } from "../constructs/GridPulseEnvironment";

export class ProductionEnvironmentStack extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    // Input variables
    const railwayToken = new TerraformVariable(this, "railway_token", {
      type: "string",
      description: "Railway API token",
      sensitive: true,
    });

    const projectId = new TerraformVariable(this, "project_id", {
      type: "string",
      description: "Railway project ID",
      default: "10593acb-4a7a-4331-a993-52d24860d1fa", // gridpulse project
    });

    const postgresPassword = new TerraformVariable(this, "postgres_password", {
      type: "string",
      description: "PostgreSQL password",
      sensitive: true,
    });

    const sessionSecret = new TerraformVariable(this, "session_secret", {
      type: "string",
      description: "Session secret for web application", 
      sensitive: true,
    });

    const eiaApiKey = new TerraformVariable(this, "eia_api_key", {
      type: "string",
      description: "EIA API key for data ingestion",
      sensitive: true,
    });

    // Optional Docker deployment variables (recommended for prod)
    const dockerImage = new TerraformVariable(this, "docker_image", {
      type: "string",
      description: "Fully qualified Docker image (e.g., ghcr.io/owner/repo:tag)",
      default: "", // empty -> fallback to Git deployment
    });

    const dockerUsername = new TerraformVariable(this, "docker_username", {
      type: "string",
      description: "Registry username for pulling private images",
      default: "",
    });

    const dockerPassword = new TerraformVariable(this, "docker_password", {
      type: "string",
      description: "Registry token/password for pulling private images",
      sensitive: true,
      default: "",
    });

    // Railway builds Docker images automatically from connected repository using Dockerfile

    // Create Production Environment
    const prodEnvironment = new GridPulseEnvironment(this, "prod", {
      projectId: projectId.stringValue,
      environmentName: "prod",
      railwayToken: railwayToken.stringValue,
      postgresPassword: postgresPassword.stringValue,
      sessionSecret: sessionSecret.stringValue,
      eiaApiKey: eiaApiKey.stringValue,
      // If docker_image is provided, deploy via Docker; otherwise use Git
      dockerImage: dockerImage.stringValue || undefined,
      dockerUsername: dockerUsername.stringValue || undefined,
      dockerPassword: dockerPassword.stringValue || undefined,
    });

    // Data service is not provisioned in prod for now
    // prodEnvironment.addDataService({ cronSchedule: "15 * * * *" });
  }
}
