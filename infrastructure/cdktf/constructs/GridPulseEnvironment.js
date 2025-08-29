"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridPulseEnvironment = void 0;
const constructs_1 = require("constructs");
const cdktf_1 = require("cdktf");
const provider_1 = require("../.gen/providers/railway/provider");
const environment_1 = require("../.gen/providers/railway/environment");
const service_1 = require("../.gen/providers/railway/service");
const variable_1 = require("../.gen/providers/railway/variable");
class GridPulseEnvironment extends constructs_1.Construct {
    constructor(scope, id, config) {
        super(scope, id);
        // Railway Provider
        new provider_1.RailwayProvider(this, "railway", {
            token: config.railwayToken,
        });
        // Environment
        this.environment = new environment_1.Environment(this, "environment", {
            name: config.environmentName,
            projectId: config.projectId,
        });
        // PostgreSQL Service (TimescaleDB)
        this.postgresService = new service_1.Service(this, "postgres", {
            name: "postgres",
            projectId: config.projectId,
            sourceImage: "timescale/timescaledb:latest-pg15",
            dependsOn: [this.environment],
        });
        // PostgreSQL Environment Variables
        new variable_1.Variable(this, "postgres_db", {
            environmentId: this.environment.id,
            serviceId: this.postgresService.id,
            name: "POSTGRES_DB",
            value: "railway",
        });
        new variable_1.Variable(this, "postgres_user", {
            environmentId: this.environment.id,
            serviceId: this.postgresService.id,
            name: "POSTGRES_USER",
            value: "postgres",
        });
        new variable_1.Variable(this, "postgres_password", {
            environmentId: this.environment.id,
            serviceId: this.postgresService.id,
            name: "POSTGRES_PASSWORD",
            value: config.postgresPassword,
        });
        // Redis Service
        this.redisService = new service_1.Service(this, "redis", {
            name: "redis",
            projectId: config.projectId,
            sourceImage: "redis:7-alpine",
            dependsOn: [this.environment],
        });
        // React Router 7 Web Service
        // Prefer Docker image if provided; otherwise Railway builds from repo
        const webServiceConfig = config.dockerImage
            ? {
                name: "web",
                projectId: config.projectId,
                dependsOn: [this.environment],
                sourceImage: config.dockerImage,
                ...(config.dockerUsername
                    ? { sourceImageRegistryUsername: config.dockerUsername }
                    : {}),
                ...(config.dockerPassword
                    ? { sourceImageRegistryPassword: config.dockerPassword }
                    : {}),
            }
            : {
                name: "web",
                projectId: config.projectId,
                dependsOn: [this.environment],
            };
        this.webService = new service_1.Service(this, "web", webServiceConfig);
        // Web Service Environment Variables
        this.createWebServiceVariables(config);
        // Outputs (simplified for initial implementation)
        new cdktf_1.TerraformOutput(this, "web_service_id", {
            description: "Web service ID",
            value: this.webService.id,
        });
        new cdktf_1.TerraformOutput(this, "postgres_service_id", {
            description: "PostgreSQL service ID",
            value: this.postgresService.id,
        });
        new cdktf_1.TerraformOutput(this, "redis_service_id", {
            description: "Redis service ID",
            value: this.redisService.id,
        });
    }
    createWebServiceVariables(config) {
        const webVariables = [
            { name: "NODE_ENV", value: "production" },
            { name: "RAILWAY_ENVIRONMENT_NAME", value: config.environmentName },
            { name: "PORT", value: "3000" },
            { name: "SESSION_SECRET", value: config.sessionSecret },
            { name: "DATABASE_URL", value: `postgresql://postgres:${config.postgresPassword}@postgres.railway.internal:5432/railway` },
            { name: "REDIS_URL", value: `redis://redis.railway.internal:6379` },
        ];
        // Add Docker deployment variables
        webVariables.push({ name: "DEPLOYMENT_METHOD", value: "docker" });
        webVariables.forEach((variable, index) => {
            new variable_1.Variable(this, `web_var_${index}`, {
                environmentId: this.environment.id,
                serviceId: this.webService.id,
                name: variable.name,
                value: variable.value,
            });
        });
        // Add EIA API key if provided (for future data service)
        if (config.eiaApiKey) {
            new variable_1.Variable(this, "web_eia_api_key", {
                environmentId: this.environment.id,
                serviceId: this.webService.id,
                name: "EIA_API_KEY",
                value: config.eiaApiKey,
            });
        }
    }
    // Method to add data service (for future use with GRID-013)
    addDataService(config) {
        if (this.dataService) {
            return this.dataService;
        }
        this.dataService = new service_1.Service(this, "data", {
            name: `data-${this.environment.name}`,
            projectId: this.environment.projectId,
            sourceRepo: "awynne/grid",
            sourceRepoBranch: "main",
            rootDirectory: "worker",
            cronSchedule: config.cronSchedule || "15 * * * *", // Hourly at 15 minutes past
        });
        // Data service variables
        const dataVariables = [
            { name: "NODE_ENV", value: "production" },
            { name: "EIA_API_KEY", value: "${var.eia_api_key}" },
            { name: "DATABASE_URL", value: "postgresql://postgres:password@postgres-service:5432/railway" },
            { name: "REDIS_URL", value: "redis://redis-service:6379" },
        ];
        dataVariables.forEach((variable, index) => {
            new variable_1.Variable(this, `data_var_${index}`, {
                environmentId: this.environment.id,
                serviceId: this.dataService.id,
                name: variable.name,
                value: variable.value,
            });
        });
        return this.dataService;
    }
}
exports.GridPulseEnvironment = GridPulseEnvironment;
//# sourceMappingURL=GridPulseEnvironment.js.map