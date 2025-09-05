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
const service_domain_1 = require("../.gen/providers/railway/service-domain");
const custom_domain_1 = require("../.gen/providers/railway/custom-domain");
const provider_2 = require("../.gen/providers/supabase/provider");
const project_1 = require("../.gen/providers/supabase/project");
const settings_1 = require("../.gen/providers/supabase/settings");
class GridPulseEnvironment extends constructs_1.Construct {
    constructor(scope, id, config) {
        super(scope, id);
        this.config = config;
        // Validate configuration - require explicit database choice (no fallback)
        if (!config.supabase && !config.postgresPassword) {
            throw new Error("Database configuration required: Either supabase configuration or postgresPassword must be explicitly provided. No fallback available.");
        }
        if (config.supabase && config.postgresPassword) {
            throw new Error("Cannot configure both supabase and Railway PostgreSQL - choose exactly one database backend");
        }
        // Railway Provider (always needed for web service)
        new provider_1.RailwayProvider(this, "railway", {
            token: config.railwayToken,
        });
        // Supabase Provider (if using Supabase)
        if (config.supabase) {
            new provider_2.SupabaseProvider(this, "supabase", {
                accessToken: config.supabase.accessToken,
            });
        }
        // Environment
        this.environment = new environment_1.Environment(this, "environment", {
            name: config.environmentName,
            projectId: config.projectId,
        });
        // Database setup - either Railway PostgreSQL or Supabase
        if (config.supabase) {
            // Supabase managed database
            this.supabaseProject = new project_1.Project(this, "supabase_project", {
                name: config.supabase.projectName,
                organizationId: config.supabase.organizationId,
                databasePassword: config.supabase.databasePassword,
                region: config.supabase.region || "us-east-1",
            });
            this.supabaseSettings = new settings_1.Settings(this, "supabase_settings", {
                projectRef: this.supabaseProject.id,
                api: JSON.stringify({
                    db_schema: "public,storage,graphql_public",
                    db_extra_search_path: "public,extensions",
                    max_rows: 1000,
                }),
            });
            // Supabase session pooler connection string format (IPv4 compatible, required for Railway and Prisma)
            this.databaseUrl = `postgresql://postgres.${this.supabaseProject.id}:${config.supabase.databasePassword}@aws-1-${config.supabase.region || 'us-east-1'}.pooler.supabase.com:5432/postgres`;
        }
        else {
            // Railway PostgreSQL (legacy)
            // Set DB password at environment level BEFORE creating the Postgres service
            this.envPostgresPassword = new shared_variable_1.SharedVariable(this, "env_postgres_password", {
                environmentId: this.environment.id,
                name: "POSTGRES_PASSWORD",
                projectId: config.projectId,
                value: config.postgresPassword,
            });
            // PostgreSQL Service (Railway Managed PostgreSQL with SSL)
            this.postgresService = new service_1.Service(this, "postgres", {
                name: "postgres",
                projectId: config.projectId,
                sourceImage: "ghcr.io/railwayapp-templates/postgres-ssl:17",
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
            new variable_1.Variable(this, "postgres_password", {
                environmentId: this.environment.id,
                serviceId: this.postgresService.id,
                name: "POSTGRES_PASSWORD",
                value: config.postgresPassword,
            });
            // Railway PostgreSQL connection string
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
            this.databaseUrl = `postgresql://postgres:${encodedDbPassword}@postgres.railway.internal:5432/gridpulse`;
        }
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
        // Domain Configuration - only create resources for non-empty, trimmed strings
        const trimmedRailwaySubdomain = config.domain?.railwaySubdomain?.trim();
        const trimmedCustomDomain = config.domain?.customDomain?.trim();
        if (trimmedRailwaySubdomain && trimmedRailwaySubdomain.length > 0) {
            this.serviceDomain = new service_domain_1.ServiceDomain(this, "railway_subdomain", {
                serviceId: this.webService.id,
                environmentId: this.environment.id,
                subdomain: trimmedRailwaySubdomain,
            });
        }
        if (trimmedCustomDomain && trimmedCustomDomain.length > 0) {
            this.customDomain = new custom_domain_1.CustomDomain(this, "custom_domain", {
                serviceId: this.webService.id,
                environmentId: this.environment.id,
                domain: trimmedCustomDomain,
            });
        }
        // Outputs
        new cdktf_1.TerraformOutput(this, "web_service_id", {
            description: "Web service ID",
            value: this.webService.id,
        });
        new cdktf_1.TerraformOutput(this, "redis_service_id", {
            description: "Redis service ID",
            value: this.redisService.id,
        });
        // Domain outputs - conditional on domain configuration
        if (this.serviceDomain) {
            new cdktf_1.TerraformOutput(this, "web_service_domain", {
                description: "Railway-provided service domain URL",
                value: `https://${this.serviceDomain.domain}`,
            });
        }
        if (this.customDomain) {
            new cdktf_1.TerraformOutput(this, "web_custom_domain", {
                description: "Custom domain URL",
                value: `https://${this.customDomain.domain}`,
            });
        }
        // Database outputs - conditional on which database is used
        if (config.supabase) {
            new cdktf_1.TerraformOutput(this, "supabase_project_id", {
                description: "Supabase project ID",
                value: this.supabaseProject.id,
            });
            new cdktf_1.TerraformOutput(this, "supabase_project_ref", {
                description: "Supabase project reference",
                value: this.supabaseProject.id,
            });
            new cdktf_1.TerraformOutput(this, "database_url", {
                description: "Database connection URL",
                value: this.databaseUrl,
                sensitive: true,
            });
        }
        else {
            new cdktf_1.TerraformOutput(this, "postgres_service_id", {
                description: "Railway PostgreSQL service ID",
                value: this.postgresService.id,
            });
            new cdktf_1.TerraformOutput(this, "database_url", {
                description: "Database connection URL",
                value: this.databaseUrl,
                sensitive: true,
            });
        }
    }
    createWebServiceVariables(config) {
        const webVariables = [
            { name: "NODE_ENV", value: "production" },
            { name: "RAILWAY_ENVIRONMENT_NAME", value: config.environmentName },
            { name: "PORT", value: "3000" },
            { name: "SESSION_SECRET", value: config.sessionSecret },
            { name: "DATABASE_URL", value: this.databaseUrl },
            { name: "REDIS_URL", value: `redis://redis.railway.internal:6379` },
            // Force Prisma to use Debian OpenSSL 1.1 engines we package in the image
            { name: "PRISMA_SCHEMA_ENGINE_BINARY", value: "/app/node_modules/@prisma/engines/schema-engine-debian-openssl-1.1.x" },
            { name: "PRISMA_QUERY_ENGINE_LIBRARY", value: "/app/node_modules/.prisma/client/libquery_engine-debian-openssl-1.1.x.so.node" },
            ...(config.dockerImage ? [{ name: "DEPLOYED_IMAGE", value: config.dockerImage }] : []),
        ];
        // Add database-specific variables
        if (config.supabase) {
            webVariables.push({ name: "DATABASE_TYPE", value: "supabase" }, { name: "SUPABASE_PROJECT_REF", value: this.supabaseProject.id });
        }
        else {
            webVariables.push({ name: "DATABASE_TYPE", value: "railway" }, { name: "POSTGRES_PASSWORD", value: config.postgresPassword });
        }
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
            { name: "DATABASE_URL", value: this.databaseUrl },
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