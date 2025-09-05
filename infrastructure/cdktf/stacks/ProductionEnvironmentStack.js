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
        // Supabase variables (optional - for managed database)
        const supabaseAccessToken = new cdktf_1.TerraformVariable(this, "supabase_access_token", {
            type: "string",
            description: "Supabase API access token",
            sensitive: true,
            default: "",
        });
        const supabaseOrganizationId = new cdktf_1.TerraformVariable(this, "supabase_organization_id", {
            type: "string",
            description: "Supabase organization ID",
            default: "",
        });
        const supabaseProjectName = new cdktf_1.TerraformVariable(this, "supabase_project_name", {
            type: "string",
            description: "Supabase project name",
            default: "",
        });
        const supabaseDatabasePassword = new cdktf_1.TerraformVariable(this, "supabase_database_password", {
            type: "string",
            description: "Database password for Supabase project",
            sensitive: true,
            default: "",
        });
        const supabaseRegion = new cdktf_1.TerraformVariable(this, "supabase_region", {
            type: "string",
            description: "AWS region for Supabase project",
            default: "us-east-1",
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
        // Optional domain configuration
        const railwaySubdomain = new cdktf_1.TerraformVariable(this, "railway_subdomain", {
            type: "string",
            description: "Railway-provided subdomain (e.g., 'myapp' -> myapp.up.railway.app)",
            default: "",
        });
        const customDomain = new cdktf_1.TerraformVariable(this, "custom_domain", {
            type: "string",
            description: "Custom domain for the web service (e.g., app.example.com)",
            default: "",
        });
        // Railway builds Docker images automatically from connected repository using Dockerfile
        // Create Production Environment
        // Explicit database backend choice - no fallback, fail fast if misconfigured
        const useSupabase = supabaseAccessToken.stringValue !== "";
        const prodEnvironment = new GridPulseEnvironment_1.GridPulseEnvironment(this, "prod", {
            projectId: projectId.stringValue,
            environmentName: "prod-02",
            railwayToken: railwayToken.stringValue,
            sessionSecret: sessionSecret.stringValue,
            eiaApiKey: eiaApiKey.stringValue,
            // Database configuration - choose one
            ...(useSupabase ? {
                supabase: {
                    accessToken: supabaseAccessToken.stringValue,
                    organizationId: supabaseOrganizationId.stringValue,
                    projectName: supabaseProjectName.stringValue,
                    databasePassword: supabaseDatabasePassword.stringValue,
                    region: supabaseRegion.stringValue,
                }
            } : {
                postgresPassword: postgresPassword.stringValue,
            }),
            // Docker deployment configuration
            dockerImage: dockerImage.stringValue || undefined,
            dockerUsername: dockerUsername.stringValue || undefined,
            dockerPassword: dockerPassword.stringValue || undefined,
            // Domain configuration - both options are optional
            domain: (() => {
                const trimmedRailwaySubdomain = railwaySubdomain.stringValue.trim();
                const trimmedCustomDomain = customDomain.stringValue.trim();
                if (!trimmedRailwaySubdomain && !trimmedCustomDomain) {
                    return undefined;
                }
                const domainConfig = {};
                if (trimmedRailwaySubdomain) {
                    domainConfig.railwaySubdomain = trimmedRailwaySubdomain;
                }
                if (trimmedCustomDomain) {
                    domainConfig.customDomain = trimmedCustomDomain;
                }
                return domainConfig;
            })(),
        });
        // Data service is not provisioned in prod for now
        // prodEnvironment.addDataService({ cronSchedule: "15 * * * *" });
    }
}
exports.ProductionEnvironmentStack = ProductionEnvironmentStack;
//# sourceMappingURL=ProductionEnvironmentStack.js.map