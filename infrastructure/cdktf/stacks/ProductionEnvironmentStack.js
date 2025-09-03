"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductionEnvironmentStack = void 0;
const cdktf_1 = require("cdktf");
const GridPulseEnvironment_1 = require("../constructs/GridPulseEnvironment");
class ProductionEnvironmentStack extends cdktf_1.TerraformStack {
    constructor(scope, id) {
        super(scope, id);
        // Input variables
        const railwayToken = new cdktf_1.TerraformVariable(this, "railway_token", {
            type: "string",
            description: "Railway API token",
            sensitive: true,
        });
        const projectId = new cdktf_1.TerraformVariable(this, "project_id", {
            type: "string",
            description: "Railway project ID",
            default: "10593acb-4a7a-4331-a993-52d24860d1fa", // gridpulse project
        });
        const postgresPassword = new cdktf_1.TerraformVariable(this, "postgres_password", {
            type: "string",
            description: "PostgreSQL password",
            sensitive: true,
        });
        const sessionSecret = new cdktf_1.TerraformVariable(this, "session_secret", {
            type: "string",
            description: "Session secret for web application",
            sensitive: true,
        });
        const eiaApiKey = new cdktf_1.TerraformVariable(this, "eia_api_key", {
            type: "string",
            description: "EIA API key for data ingestion",
            sensitive: true,
        });
        // Optional Docker deployment variables (recommended for prod)
        const dockerImage = new cdktf_1.TerraformVariable(this, "docker_image", {
            type: "string",
            description: "Fully qualified Docker image (e.g., ghcr.io/owner/repo:tag)",
            default: "", // empty -> fallback to Git deployment
        });
        const dockerUsername = new cdktf_1.TerraformVariable(this, "docker_username", {
            type: "string",
            description: "Registry username for pulling private images",
            default: "",
        });
        const dockerPassword = new cdktf_1.TerraformVariable(this, "docker_password", {
            type: "string",
            description: "Registry token/password for pulling private images",
            sensitive: true,
            default: "",
        });
        // Railway builds Docker images automatically from connected repository using Dockerfile
        // Create Production Environment
        const prodEnvironment = new GridPulseEnvironment_1.GridPulseEnvironment(this, "prod", {
            projectId: projectId.stringValue,
            environmentName: "prod-00",
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
exports.ProductionEnvironmentStack = ProductionEnvironmentStack;
//# sourceMappingURL=ProductionEnvironmentStack.js.map