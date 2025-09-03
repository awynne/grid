import { Construct } from "constructs";
import { TerraformOutput } from "cdktf";
import { RailwayProvider } from "../.gen/providers/railway/provider";
import { Environment } from "../.gen/providers/railway/environment";
import { Service, type ServiceConfig } from "../.gen/providers/railway/service";
import { Variable } from "../.gen/providers/railway/variable";
import { SharedVariable } from "../.gen/providers/railway/shared-variable";

export interface GridPulseEnvironmentConfig {
  projectId: string;
  environmentName: string;
  railwayToken: string;
  postgresPassword: string;
  sessionSecret: string;
  eiaApiKey?: string;

  // Optional: Deploy web from a registry image
  dockerImage?: string;               // e.g., ghcr.io/awynne/grid:v1.2.3
  dockerUsername?: string;            // Registry username (for private images)
  dockerPassword?: string;            // Registry token/password
}

export class GridPulseEnvironment extends Construct {
  public readonly environment: Environment;
  public readonly webService: Service;
  public readonly postgresService: Service;
  public readonly redisService: Service;
  public dataService?: Service;
  private readonly config: GridPulseEnvironmentConfig;
  private readonly envPostgresPassword: SharedVariable;

  constructor(scope: Construct, id: string, config: GridPulseEnvironmentConfig) {
    super(scope, id);
    this.config = config;

    // Railway Provider
    new RailwayProvider(this, "railway", {
      token: config.railwayToken,
    });

    // Environment
    this.environment = new Environment(this, "environment", {
      name: config.environmentName,
      projectId: config.projectId,
    });

    // Set DB password at environment level BEFORE creating the Postgres service so
    // the container initializes with the intended password on first boot.
    this.envPostgresPassword = new SharedVariable(this, "env_postgres_password", {
      environmentId: this.environment.id,
      name: "POSTGRES_PASSWORD",
      projectId: config.projectId,
      value: config.postgresPassword,
    });

    // PostgreSQL Service (Railway Managed PostgreSQL with SSL)
    // Depend on both environment AND the shared password variable
    this.postgresService = new Service(this, "postgres", {
      name: "postgres",
      projectId: config.projectId,
      sourceImage: "ghcr.io/railwayapp-templates/postgres-ssl:17",
      dependsOn: [this.environment, this.envPostgresPassword],
    });

    // PostgreSQL Environment Variables
    new Variable(this, "postgres_db", {
      environmentId: this.environment.id,
      serviceId: this.postgresService.id,
      name: "POSTGRES_DB",
      value: "gridpulse",
    });

    new Variable(this, "postgres_user", {
      environmentId: this.environment.id,
      serviceId: this.postgresService.id,
      name: "POSTGRES_USER", 
      value: "postgres",
    });

    // Keep service-scoped POSTGRES_PASSWORD in sync (harmless if env-level already set)
    new Variable(this, "postgres_password", {
      environmentId: this.environment.id,
      serviceId: this.postgresService.id,
      name: "POSTGRES_PASSWORD",
      value: config.postgresPassword,
    });

    // Redis Service
    this.redisService = new Service(this, "redis", {
      name: "redis",
      projectId: config.projectId,
      sourceImage: "redis:7-alpine",
      dependsOn: [this.environment],
    });

    // React Router 7 Web Service
    // Prefer Docker image if provided; otherwise Railway builds from repo
    const webServiceConfig: ServiceConfig = config.dockerImage
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

    this.webService = new Service(this, "web", webServiceConfig);

    // Web Service Environment Variables
    this.createWebServiceVariables(config);

    // Outputs (simplified for initial implementation)
    new TerraformOutput(this, "web_service_id", {
      description: "Web service ID",
      value: this.webService.id,
    });

    new TerraformOutput(this, "postgres_service_id", {
      description: "PostgreSQL service ID",
      value: this.postgresService.id,
    });

    new TerraformOutput(this, "redis_service_id", {
      description: "Redis service ID",
      value: this.redisService.id,
    });
  }

  private createWebServiceVariables(config: GridPulseEnvironmentConfig) {
    // If the provided password already appears percent-encoded, avoid double-encoding
    const isAlreadyEncoded = (() => {
      try {
        return decodeURIComponent(config.postgresPassword) !== config.postgresPassword;
      } catch {
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
    webVariables.push(
      { name: "DEPLOYMENT_METHOD", value: "docker" }
    );

    webVariables.forEach((variable, index) => {
      new Variable(this, `web_var_${index}`, {
        environmentId: this.environment.id,
        serviceId: this.webService.id,
        name: variable.name,
        value: variable.value,
      });
    });

    // Add EIA API key if provided (for future data service)
    if (config.eiaApiKey) {
      new Variable(this, "web_eia_api_key", {
        environmentId: this.environment.id,
        serviceId: this.webService.id,
        name: "EIA_API_KEY",
        value: config.eiaApiKey,
      });
    }
  }

  // Method to add data service (for future use with GRID-013)
  public addDataService(serviceConfig: { cronSchedule?: string }): Service {
    if (this.dataService) {
      return this.dataService;
    }

    this.dataService = new Service(this, "data", {
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
      new Variable(this, `data_var_${index}`, {
        environmentId: this.environment.id,
        serviceId: this.dataService!.id,
        name: variable.name,
        value: variable.value,
      });
    });

    return this.dataService;
  }
}
