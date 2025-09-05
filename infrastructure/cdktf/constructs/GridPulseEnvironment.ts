import { Construct } from "constructs";
import { TerraformOutput } from "cdktf";
import { RailwayProvider } from "../.gen/providers/railway/provider";
import { Environment } from "../.gen/providers/railway/environment";
import { Service, type ServiceConfig } from "../.gen/providers/railway/service";
import { Variable } from "../.gen/providers/railway/variable";
import { SharedVariable } from "../.gen/providers/railway/shared-variable";
import { ServiceDomain } from "../.gen/providers/railway/service-domain";
import { CustomDomain } from "../.gen/providers/railway/custom-domain";
import { SupabaseProvider } from "../.gen/providers/supabase/provider";
import { Project } from "../.gen/providers/supabase/project";
import { Settings } from "../.gen/providers/supabase/settings";

export interface GridPulseEnvironmentConfig {
  // Railway configuration (for web service hosting)
  projectId: string;
  environmentName: string;
  railwayToken: string;
  sessionSecret: string;
  eiaApiKey?: string;

  // Database configuration - choose exactly one (no fallback)
  // Option 1: Railway PostgreSQL (legacy)
  postgresPassword?: string;

  // Option 2: Supabase managed database (preferred)
  // NOTE: If neither database option is provided, deployment will fail fast
  supabase?: {
    accessToken: string;
    organizationId: string;
    projectName: string;
    databasePassword: string;
    region?: string; // defaults to us-east-1
  };

  // Optional: Deploy web from a registry image
  dockerImage?: string;               // e.g., ghcr.io/awynne/grid:v1.2.3
  dockerUsername?: string;            // Registry username (for private images)
  dockerPassword?: string;            // Registry token/password

  // Optional: Domain configuration
  domain?: {
    // Option 1: Railway-provided subdomain (e.g., "myapp" -> myapp.up.railway.app)
    railwaySubdomain?: string;
    // Option 2: Custom domain you own (requires DNS setup)
    customDomain?: string;            // e.g., app.example.com
  };
}

export class GridPulseEnvironment extends Construct {
  public readonly environment: Environment;
  public readonly webService: Service;
  public readonly postgresService?: Service; // Optional for Railway PostgreSQL
  public readonly redisService: Service;
  public readonly supabaseProject?: Project; // Optional for Supabase
  public readonly supabaseSettings?: Settings;
  public readonly serviceDomain?: ServiceDomain; // Optional Railway subdomain
  public readonly customDomain?: CustomDomain; // Optional custom domain
  public dataService?: Service;
  private readonly config: GridPulseEnvironmentConfig;
  private readonly envPostgresPassword?: SharedVariable;
  private readonly databaseUrl: string;

  constructor(scope: Construct, id: string, config: GridPulseEnvironmentConfig) {
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
    new RailwayProvider(this, "railway", {
      token: config.railwayToken,
    });

    // Supabase Provider (if using Supabase)
    if (config.supabase) {
      new SupabaseProvider(this, "supabase", {
        accessToken: config.supabase.accessToken,
      });
    }

    // Environment
    this.environment = new Environment(this, "environment", {
      name: config.environmentName,
      projectId: config.projectId,
    });

    // Database setup - either Railway PostgreSQL or Supabase
    if (config.supabase) {
      // Supabase managed database
      this.supabaseProject = new Project(this, "supabase_project", {
        name: config.supabase.projectName,
        organizationId: config.supabase.organizationId,
        databasePassword: config.supabase.databasePassword,
        region: config.supabase.region || "us-east-1",
      });

      this.supabaseSettings = new Settings(this, "supabase_settings", {
        projectRef: this.supabaseProject.id,
        api: JSON.stringify({
          db_schema: "public,storage,graphql_public",
          db_extra_search_path: "public,extensions",
          max_rows: 1000,
        }),
      });

      // Supabase session pooler connection string format (IPv4 compatible, required for Railway and Prisma)
      this.databaseUrl = `postgresql://postgres.${this.supabaseProject.id}:${config.supabase.databasePassword}@aws-1-${config.supabase.region || 'us-east-1'}.pooler.supabase.com:5432/postgres`;
    } else {
      // Railway PostgreSQL (legacy)
      // Set DB password at environment level BEFORE creating the Postgres service
      this.envPostgresPassword = new SharedVariable(this, "env_postgres_password", {
        environmentId: this.environment.id,
        name: "POSTGRES_PASSWORD",
        projectId: config.projectId,
        value: config.postgresPassword!,
      });

      // PostgreSQL Service (Railway Managed PostgreSQL with SSL)
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

      new Variable(this, "postgres_password", {
        environmentId: this.environment.id,
        serviceId: this.postgresService.id,
        name: "POSTGRES_PASSWORD",
        value: config.postgresPassword!,
      });

      // Railway PostgreSQL connection string
      const isAlreadyEncoded = (() => {
        try {
          return decodeURIComponent(config.postgresPassword!) !== config.postgresPassword!;
        } catch {
          return false;
        }
      })();
      const encodedDbPassword = isAlreadyEncoded
        ? config.postgresPassword!
        : encodeURIComponent(config.postgresPassword!);
      this.databaseUrl = `postgresql://postgres:${encodedDbPassword}@postgres.railway.internal:5432/gridpulse`;
    }

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

    // Domain Configuration
    if (config.domain?.railwaySubdomain && config.domain.railwaySubdomain.trim()) {
      this.serviceDomain = new ServiceDomain(this, "railway_subdomain", {
        serviceId: this.webService.id,
        environmentId: this.environment.id,
        subdomain: config.domain.railwaySubdomain.trim(),
      });
    }

    if (config.domain?.customDomain && config.domain.customDomain.trim()) {
      this.customDomain = new CustomDomain(this, "custom_domain", {
        serviceId: this.webService.id,
        environmentId: this.environment.id,
        domain: config.domain.customDomain.trim(),
      });
    }

    // Outputs
    new TerraformOutput(this, "web_service_id", {
      description: "Web service ID",
      value: this.webService.id,
    });

    new TerraformOutput(this, "redis_service_id", {
      description: "Redis service ID",
      value: this.redisService.id,
    });

    // Domain outputs - conditional on domain configuration
    if (this.serviceDomain) {
      new TerraformOutput(this, "web_service_domain", {
        description: "Railway-provided service domain URL",
        value: `https://${this.serviceDomain.domain}`,
      });
    }

    if (this.customDomain) {
      new TerraformOutput(this, "web_custom_domain", {
        description: "Custom domain URL",
        value: `https://${this.customDomain.domain}`,
      });
    }

    // Database outputs - conditional on which database is used
    if (config.supabase) {
      new TerraformOutput(this, "supabase_project_id", {
        description: "Supabase project ID",
        value: this.supabaseProject!.id,
      });

      new TerraformOutput(this, "supabase_project_ref", {
        description: "Supabase project reference",
        value: this.supabaseProject!.id,
      });

      new TerraformOutput(this, "database_url", {
        description: "Database connection URL",
        value: this.databaseUrl,
        sensitive: true,
      });
    } else {
      new TerraformOutput(this, "postgres_service_id", {
        description: "Railway PostgreSQL service ID",
        value: this.postgresService!.id,
      });

      new TerraformOutput(this, "database_url", {
        description: "Database connection URL", 
        value: this.databaseUrl,
        sensitive: true,
      });
    }
  }

  private createWebServiceVariables(config: GridPulseEnvironmentConfig) {
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
      webVariables.push(
        { name: "DATABASE_TYPE", value: "supabase" },
        { name: "SUPABASE_PROJECT_REF", value: this.supabaseProject!.id }
      );
    } else {
      webVariables.push(
        { name: "DATABASE_TYPE", value: "railway" },
        { name: "POSTGRES_PASSWORD", value: config.postgresPassword! }
      );
    }

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
      { name: "DATABASE_URL", value: this.databaseUrl },
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
