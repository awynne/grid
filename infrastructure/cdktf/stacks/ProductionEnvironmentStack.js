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
        // Railway builds Docker images automatically from connected repository using Dockerfile
        // Create Production Environment
        const prodEnvironment = new GridPulseEnvironment_1.GridPulseEnvironment(this, "prod", {
            projectId: projectId.stringValue,
            environmentName: "prod",
            railwayToken: railwayToken.stringValue,
            postgresPassword: postgresPassword.stringValue,
            sessionSecret: sessionSecret.stringValue,
            eiaApiKey: eiaApiKey.stringValue,
            // Railway handles Docker build automatically
        });
        // Data service is not provisioned in prod for now
        // prodEnvironment.addDataService({ cronSchedule: "15 * * * *" });
    }
}
exports.ProductionEnvironmentStack = ProductionEnvironmentStack;
//# sourceMappingURL=ProductionEnvironmentStack.js.map