"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestEnvironmentStack = void 0;
const cdktf_1 = require("cdktf");
const GridPulseEnvironment_1 = require("../constructs/GridPulseEnvironment");
class TestEnvironmentStack extends cdktf_1.TerraformStack {
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
            default: "test-development-password",
        });
        const sessionSecret = new cdktf_1.TerraformVariable(this, "session_secret", {
            type: "string",
            description: "Session secret for web application",
            sensitive: true,
            default: "test-32-character-session-secret",
        });
        const eiaApiKey = new cdktf_1.TerraformVariable(this, "eia_api_key", {
            type: "string",
            description: "EIA API key for data ingestion",
            sensitive: true,
            default: "",
        });
        // Railway builds Docker images automatically from connected repository using Dockerfile
        // Create Test Environment (instance used for side effects only)
        new GridPulseEnvironment_1.GridPulseEnvironment(this, "test", {
            projectId: projectId.stringValue,
            environmentName: "test2",
            railwayToken: railwayToken.stringValue,
            postgresPassword: postgresPassword.stringValue,
            sessionSecret: sessionSecret.stringValue,
            eiaApiKey: eiaApiKey.stringValue,
            // Railway handles Docker build automatically
        });
        // Future: Add data service when ready
        // new GridPulseEnvironment(...).addDataService({ cronSchedule: "15 * * * *" });
    }
}
exports.TestEnvironmentStack = TestEnvironmentStack;
//# sourceMappingURL=TestEnvironmentStack.js.map