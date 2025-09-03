"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridPulseEnvironment = void 0;
const constructs_1 = require("constructs");
const cdktf_1 = require("cdktf");
const provider_1 = require("../.gen/providers/railway/provider");
const environment_1 = require("../.gen/providers/railway/environment");
const service_1 = require("../.gen/providers/railway/service");
const variable_1 = require("../.gen/providers/railway/variable");
const shared_variable_1 = require("../.gen/providers/railway/shared-variable");
class GridPulseEnvironment extends constructs_1.Construct {
    constructor(scope, id, config) {
        super(scope, id);
        this.config = config;
        // Railway Provider
        new provider_1.RailwayProvider(this, "railway", {
            token: config.railwayToken,
        });
        // Environment
        this.environment = new environment_1.Environment(this, "environment", {
            name: config.environmentName,
            projectId: config.projectId,
        });
        // Set DB password at environment level BEFORE creating the Postgres service so
        // the container initializes with the intended password on first boot.
        this.envPostgresPassword = new shared_variable_1.SharedVariable(this, "env_postgres_password", {
            environmentId: this.environment.id,
            name: "POSTGRES_PASSWORD",
            projectId: config.projectId,
            value: config.postgresPassword,
        });
        // PostgreSQL Service (TimescaleDB)
        // Depend on both environment AND the shared password variable
        this.postgresService = new service_1.Service(this, "postgres", {
            name: "postgres",
            projectId: config.projectId,
            sourceImage: "timescale/timescaledb:latest-pg15",
            dependsOn: [this.environment, this.envPostgresPassword],
        });
        // PostgreSQL Environment Variables
        new variable_1.Variable(this, "postgres_db", {
            environmentId: this.environment.id,
            serviceId: this.postgresService.id,
            name: "POSTGRES_DB",
            value: "gridpulse",
        });
        new variable_1.Variable(this, "postgres_user", {
            environmentId: this.environment.id,
            serviceId: this.postgresService.id,
            name: "POSTGRES_USER",
            value: "postgres",
        });
        // Keep service-scoped POSTGRES_PASSWORD in sync (harmless if env-level already set)
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
        // If the provided password already appears percent-encoded, avoid double-encoding
        const isAlreadyEncoded = (() => {
            try {
                return decodeURIComponent(config.postgresPassword) !== config.postgresPassword;
            }
            catch {
                return false;
            }
        })();
        const encodedDbPassword = isAlreadyEncoded
            ? config.postgresPassword
            : encodeURIComponent(config.postgresPassword);
        const webVariables = [
            { name: "NODE_ENV", value: "production" },
            { name: "RAILWAY_ENVIRONMENT_NAME", value: config.environmentName },
            { name: "PORT", value: "3000" },
            { name: "SESSION_SECRET", value: config.sessionSecret },
            // Ensure password is URL-encoded to avoid P1013 when it contains special characters
            { name: "DATABASE_URL", value: `postgresql://postgres:${encodedDbPassword}@postgres.railway.internal:5432/gridpulse` },
            { name: "POSTGRES_PASSWORD", value: config.postgresPassword },
            { name: "REDIS_URL", value: `redis://redis.railway.internal:6379` },
            // Force Prisma to use Debian OpenSSL 1.1 engines we package in the image
            { name: "PRISMA_SCHEMA_ENGINE_BINARY", value: "/app/node_modules/@prisma/engines/schema-engine-debian-openssl-1.1.x" },
            { name: "PRISMA_QUERY_ENGINE_LIBRARY", value: "/app/node_modules/.prisma/client/libquery_engine-debian-openssl-1.1.x.so.node" },
            ...(config.dockerImage ? [{ name: "DEPLOYED_IMAGE", value: config.dockerImage }] : []),
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
    addDataService(serviceConfig) {
        if (this.dataService) {
            return this.dataService;
        }
        this.dataService = new service_1.Service(this, "data", {
            name: "data",
            projectId: this.environment.projectId,
            sourceRepo: "awynne/grid",
            sourceRepoBranch: "main",
            rootDirectory: "worker",
            cronSchedule: serviceConfig.cronSchedule || "15 * * * *", // Hourly at 15 minutes past
        });
        // Data service variables
        const dataVariables = [
            { name: "NODE_ENV", value: "production" },
            { name: "EIA_API_KEY", value: this.config.eiaApiKey || "" },
            { name: "DATABASE_URL", value: `postgresql://postgres:${this.config.postgresPassword}@postgres.railway.internal:5432/gridpulse` },
            { name: "REDIS_URL", value: "redis://redis.railway.internal:6379" },
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